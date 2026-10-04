import { prisma } from "../config/prisma";
export async function writeAuditLog(params) {
    await prisma.auditLog.create({
        data: {
            actorId: params.actorId ?? null,
            action: params.action,
            entity: params.entity,
            entityId: params.entityId,
            metadata: params.metadata ?? undefined,
        },
    });
}
//# sourceMappingURL=audit.js.map