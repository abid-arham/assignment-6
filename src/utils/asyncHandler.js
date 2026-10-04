import { NextFunction, Request, Response } from "express";
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
//# sourceMappingURL=asyncHandler.js.map