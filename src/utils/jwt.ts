import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env.js";

export interface AccessTokenPayload {
  id: string;
  role: Role;
}

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { algorithm: "HS256", expiresIn: "15m" });
}

export function signRefreshToken(payload: { id: string }) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { algorithm: "HS256", expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, { algorithms: ["HS256"] }) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): { id: string } {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ["HS256"] }) as { id: string };
}
