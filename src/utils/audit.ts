import { prisma } from "../config/prisma.js"
import { Prisma } from "@prisma/client"

// Pass the transaction client (tx) so the log commits or rolls back with the change it records.
export async function writeAuditLog(
  params: {
    actorId?: string | null
    action: string
    entity: string
    entityId: string
    metadata?: Record<string, unknown>
  },
  client: Prisma.TransactionClient = prisma
) {
  await client.auditLog.create({
    data: {
      actorId: params.actorId ?? null,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      metadata: (params.metadata ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    },
  })
}
