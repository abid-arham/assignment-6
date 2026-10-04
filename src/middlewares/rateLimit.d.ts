import { NextFunction, Request, Response } from "express";
export declare const rateLimitGlobal: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const rateLimitAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=rateLimit.d.ts.map