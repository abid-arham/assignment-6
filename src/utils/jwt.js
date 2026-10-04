import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";
export function signAccessToken(payload) {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { algorithm: "HS256", expiresIn: "15m" });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { algorithm: "HS256", expiresIn: "7d" });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ["HS256"] });
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ["HS256"] });
}
//# sourceMappingURL=jwt.js.map