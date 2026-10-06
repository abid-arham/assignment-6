import type { NextFunction, Request, Response } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../config/redis.js";
import { AppError } from "../utils/AppError.js";

function buildLimiter(requests: number, window: `${number} ${"s" | "m"}`) {
  if (!redis) return null;
  return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window) });
}

const globalLimiter = buildLimiter(60, "1 m");
const authLimiter = buildLimiter(5, "1 m");

function makeMiddleware(limiter: Ratelimit | null) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    if (!limiter) return next();

    const identifier = req.user?.id ?? req.ip ?? "anonymous";
    const { success } = await limiter.limit(identifier);

    if (!success) return next(new AppError(429, "Too many requests, please try again later"));
    next();
  };
}

export const rateLimitGlobal = makeMiddleware(globalLimiter);
export const rateLimitAuth = makeMiddleware(authLimiter);
