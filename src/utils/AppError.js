export class AppError extends Error {
    statusCode;
    errors;
    constructor(statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
//# sourceMappingURL=AppError.js.map