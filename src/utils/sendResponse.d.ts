import { Response } from "express";
interface Meta {
    page?: number;
    limit?: number;
    total?: number;
}
export declare function sendSuccess<T>(res: Response, statusCode: number, message: string, data: T, meta?: Meta): Response<any, Record<string, any>>;
export declare function sendError(res: Response, statusCode: number, message: string, errors?: unknown[]): Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=sendResponse.d.ts.map