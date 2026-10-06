import type { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import multer from "multer";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError.js";
import { sendError } from "../utils/sendResponse.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error(err);

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  if (err instanceof ZodError) {
    return sendError(res, 422, "Validation failed", err.issues);
  }

  if (err instanceof multer.MulterError) {
    return sendError(res, 422, err.message, [{ field: err.field, code: err.code }]);
  }

  // express.json() rejects an unparseable body with a SyntaxError carrying the raw body.
  if (err instanceof SyntaxError && "body" in err) {
    return sendError(res, 400, "Malformed JSON body");
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
    if (err.code === "P2003") {
      return sendError(res, 422, "Referenced record does not exist", [{ field: err.meta?.field_name }]);
    }
  }

  return sendError(res, 500, "Something went wrong");
}
