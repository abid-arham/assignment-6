import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";
import config from "../config/index.js";

export interface AccessTokenPayload {
  id: string;
  role: Role;
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, config.jwt_access_secret, { algorithm: "HS256", expiresIn: "15m" });
}

// jwtid makes every refresh token unique; without it two logins in the same second
// produce identical tokens and collide on RefreshToken.tokenHash.
export function signRefreshToken(payload: { id: string }) {
  return jwt.sign(payload, config.jwt_refresh_secret, {
    algorithm: "HS256",
    expiresIn: "7d",
    jwtid: randomUUID(),
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, config.jwt_access_secret, { algorithms: ["HS256"] }) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { id: string } {
  return jwt.verify(token, config.jwt_refresh_secret, { algorithms: ["HS256"] }) as { id: string };
}
