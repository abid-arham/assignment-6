import { Response } from "express";
export function sendSuccess(res, statusCode, message, data, meta) {
    return res.status(statusCode).json({
        success: true,
        message,
        data: meta ? { items: data, meta } : data,
    });
}
export function sendError(res, statusCode, message, errors = []) {
    return res.status(statusCode).json({ success: false, message, errors });
}
//# sourceMappingURL=sendResponse.js.map