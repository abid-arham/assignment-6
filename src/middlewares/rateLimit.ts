import type { NextFunction, Request, Response } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../config/redis.js";
import { AppError } from "../utils/AppError.js";
import { verifyAccessToken } from "../utils/jwt.js";

function buildLimiter(requests: number, window: `${number} ${"s" | "m"}`) {
  if (!redis) return null;
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window) });
}

const globalLimiter = buildLimiter(60, "1 m");
const authLimiter = buildLimiter(5, "1 m");

// The global limiter runs before authenticate, so req.user isn't set yet. Key signed-in traffic by the
// token's user id: a frontend that proxies through its own server would otherwise put every user on one IP.
function clientKey(req: Request) {
  if (req.user) return `user:${req.user.id}`;
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      return `user:${verifyAccessToken(header.slice("Bearer ".length)).id}`;
    } catch {
      // invalid/expired token: fall through to the IP; authenticate will reject it with 401
    }
  }
  return `ip:${req.ip ?? "anonymous"}`;
}

function makeMiddleware(limiter: Ratelimit | null) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!limiter) return next();

    const identifier = clientKey(req);
    const { success } = await limiter.limit(identifier);

    if (!success) return next(new AppError(429, "Too many requests, please try again later"));
    next();
  };
}

export const rateLimitGlobal = makeMiddleware(globalLimiter);
export const rateLimitAuth = makeMiddleware(authLimiter);
