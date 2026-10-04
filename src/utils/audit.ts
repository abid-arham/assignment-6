import { prisma } from "../config/prisma.js"
import { Prisma } from "@prisma/client"

export async function writeAuditLog(params: {
  actorId?: string | null
  action: string
  entity: string
  entityId: string
  metadata?: Record<string, unknown>
}) {
  await prisma.auditLog.create({
    data: {
      actorId: params.actorId ?? null,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      metadata: (params.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    },
  })
}
