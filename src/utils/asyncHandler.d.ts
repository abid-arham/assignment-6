import { NextFunction, Request, Response } from "express";
type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: (fn: AsyncFn) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map