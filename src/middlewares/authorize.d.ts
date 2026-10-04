import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
export declare function authorize(...roles: Role[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorize.d.ts.map