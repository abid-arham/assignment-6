import { NextFunction, Request, Response } from "express";
import { AccessTokenPayload } from "../utils/jwt";
declare global {
    namespace Express {
        interface Request {
            user?: AccessTokenPayload;
        }
    }
}
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=authenticate.d.ts.map