import type { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
type Source = "body" | "query" | "params";
export declare function validate(schema: ZodType, source?: Source): (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=validate.d.ts.map