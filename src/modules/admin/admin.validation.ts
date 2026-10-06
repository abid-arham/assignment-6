import { z } from "zod"
import { Role } from "@prisma/client"

const page = z.coerce.number().int().min(1).default(1)
const limit = z.coerce.number().int().min(1).max(100).default(10)

const listUsers = z.object({
  query: z.object({
    page,
    limit,
    role: z.enum(Role).optional(),
    q: z.string().optional(),
  }),
})

const changeRole = z.object({
  body: z.object({
    role: z.enum(Role),
  }),
})

const changeStatus = z.object({
  body: z.object({
    isActive: z.boolean(),
  }),
})

const listAuditLogs = z.object({
  query: z.object({
    page,
    limit,
    entity: z.string().optional(),
    action: z.string().optional(),
  }),
})

export type UserListQuery = z.infer<typeof listUsers>["query"]
export type AuditLogListQuery = z.infer<typeof listAuditLogs>["query"]

export const adminValidation = { listUsers, changeRole, changeStatus, listAuditLogs }
