import { NextFunction, Request, Response } from "express";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../config/redis";
import { AppError } from "../utils/AppError";
function buildLimiter(requests, window) {
    if (!redis)
        return null;
    return new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(requests, window) });
}
const globalLimiter = buildLimiter(60, "1 m");
const authLimiter = buildLimiter(5, "1 m");
function makeMiddleware(limiter) {
    return async (req, res, next) => {
        if (!limiter)
            return next();
        const identifier = req.user?.id ?? req.ip ?? "anonymous";
        const { success } = await limiter.limit(identifier);
        if (!success)
            return next(new AppError(429, "Too many requests, please try again later"));
        next();
    };
}
export const rateLimitGlobal = makeMiddleware(globalLimiter);
export const rateLimitAuth = makeMiddleware(authLimiter);
//# sourceMappingURL=rateLimit.js.map