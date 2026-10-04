import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { AppError } from "../utils/AppError";
export function authorize(...roles) {
    return (req, res, next) => {
        if (!req.user)
            return next(new AppError(401, "Not authenticated"));
        if (!roles.includes(req.user.role)) {
            return next(new AppError(403, "You do not have permission to perform this action"));
        }
        next();
    };
}
//# sourceMappingURL=authorize.js.map