import { prisma } from "../../config/prisma";
import { toSafeUser } from "../../utils/serialize";

export async function getMe(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  return toSafeUser(user);
}

export async function updateMe(userId: string, data: { name: string }) {
  const user = await prisma.user.update({ where: { id: userId }, data });
  return toSafeUser(user);
}
