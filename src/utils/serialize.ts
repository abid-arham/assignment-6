import type { User } from "@prisma/client";

export function toSafeUser(user: User) {
  const { passwordHash, googleId, ...safe } = user;
  return safe;
}
