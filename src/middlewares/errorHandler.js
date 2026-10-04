import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/sendResponse";
export function errorHandler(err, req, res, _next) {
    console.error(err);
    if (err instanceof AppError) {
        return sendError(res, err.statusCode, err.message, err.errors);
    }
    if (err instanceof ZodError) {
        return sendError(res, 422, "Validation failed", err.issues);
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            return sendError(res, 409, "A record with this value already exists", [
                { fields: err.meta?.target },
            ]);
        }
        if (err.code === "P2025") {
            return sendError(res, 404, "Record not found");
        }
    }
    return sendError(res, 500, "Something went wrong");
}
//# sourceMappingURL=errorHandler.js.map