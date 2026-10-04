import { User } from "@prisma/client";
export function toSafeUser(user) {
    const { passwordHash, googleId, ...safe } = user;
    return safe;
}
//# sourceMappingURL=serialize.js.map