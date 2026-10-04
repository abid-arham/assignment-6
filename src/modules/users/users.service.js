import { prisma } from "../../config/prisma";
import { toSafeUser } from "../../utils/serialize";
export async function getMe(userId) {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
    return toSafeUser(user);
}
export async function updateMe(userId, data) {
    const user = await prisma.user.update({ where: { id: userId }, data });
    return toSafeUser(user);
}
//# sourceMappingURL=users.service.js.map