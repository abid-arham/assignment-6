import { type Prisma, Role } from "@prisma/client"
import { prisma } from "../../config/prisma.js"
import { AppError } from "../../utils/AppError.js"
import { writeAuditLog } from "../../utils/audit.js"
import { getOrSetCache } from "../../utils/cache.js"
import { toSafeUser } from "../../utils/serialize.js"
import type { AuditLogListQuery, UserListQuery } from "./admin.validation.js"

const listUsers = async (query: UserListQuery) => {
  const where: Prisma.UserWhereInput = {
    deletedAt: null,
    ...(query.role && { role: query.role }),
    ...(query.q && {
      OR: [
        { name: { contains: query.q, mode: "insensitive" } },
        { email: { contains: query.q, mode: "insensitive" } },
      ],
    }),
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.user.count({ where }),
  ])

  return { items: users.map(toSafeUser), meta: { page: query.page, limit: query.limit, total } }
}

const findTargetUser = async (adminId: string, userId: string) => {
  if (adminId === userId) throw new AppError(422, "Admins cannot change their own role or status")
  const user = await prisma.user.findFirst({ where: { id: userId, deletedAt: null } })
  if (!user) throw new AppError(404, "User not found")
  return user
}

const changeRole = async (adminId: string, userId: string, role: Role) => {
  const user = await findTargetUser(adminId, userId)

  return prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({ where: { id: userId }, data: { role } })
    await writeAuditLog({
      actorId: adminId,
      action: "ROLE_CHANGED",
      entity: "User",
      entityId: userId,
      metadata: { from: user.role, to: role },
    }, tx)
    return toSafeUser(updated)
  })
}

const changeStatus = async (adminId: string, userId: string, isActive: boolean) => {
  await findTargetUser(adminId, userId)

  return prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({ where: { id: userId }, data: { isActive } })
    // Deactivation ends existing sessions: no new access tokens can be minted.
    if (!isActive) {
      await tx.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })
    }
    await writeAuditLog({
      actorId: adminId,
      action: "USER_STATUS_CHANGED",
      entity: "User",
      entityId: userId,
      metadata: { isActive },
    }, tx)
    return toSafeUser(updated)
  })
}

// Several COUNT/SUM aggregates; 60s of staleness is fine for a dashboard.
const getStats = async () =>
  getOrSetCache("admin:stats", 60, async () => {
    const [usersByRole, courses, sections, activeEnrollments, paid, unpaidInvoices] = await Promise.all([
      prisma.user.groupBy({ by: ["role"], where: { deletedAt: null }, _count: { _all: true } }),
      prisma.course.count({ where: { deletedAt: null } }),
      prisma.section.count({ where: { deletedAt: null } }),
      prisma.enrollment.count({ where: { status: "ENROLLED" } }),
      prisma.invoice.aggregate({ where: { status: "PAID" }, _sum: { amount: true }, _count: { _all: true } }),
      prisma.invoice.count({ where: { status: "UNPAID" } }),
    ])

    return {
      users: Object.fromEntries(
        Object.values(Role).map((role) => [role, usersByRole.find((r) => r.role === role)?._count._all ?? 0])
      ),
      courses,
      sections,
      activeEnrollments,
      paidInvoices: paid._count._all,
      unpaidInvoices,
      revenue: Number(paid._sum.amount ?? 0),
    }
  })

const listAuditLogs = async (query: AuditLogListQuery) => {
  const where: Prisma.AuditLogWhereInput = {
    ...(query.entity && { entity: query.entity }),
    ...(query.action && { action: query.action }),
  }

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
      include: { actor: { select: { id: true, name: true, email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ])

  return { items, meta: { page: query.page, limit: query.limit, total } }
}

export const adminServices = { listUsers, changeRole, changeStatus, getStats, listAuditLogs }
