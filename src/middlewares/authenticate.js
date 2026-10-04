import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken, AccessTokenPayload } from "../utils/jwt";
export function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return next(new AppError(401, "Missing or invalid Authorization header"));
    }
    const token = header.slice("Bearer ".length);
    try {
        req.user = verifyAccessToken(token);
        next();
    }
    catch {
        next(new AppError(401, "Invalid or expired access token"));
    }
}
//# sourceMappingURL=authenticate.js.map