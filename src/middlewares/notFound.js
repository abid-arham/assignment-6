import { Request, Response } from "express";
import { sendError } from "../utils/sendResponse";
export function notFound(req, res) {
    sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}
//# sourceMappingURL=notFound.js.map