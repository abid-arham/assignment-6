export declare class AppError extends Error {
    readonly statusCode: number;
    readonly errors: unknown[];
    constructor(statusCode: number, message: string, errors?: unknown[]);
}
//# sourceMappingURL=AppError.d.ts.map