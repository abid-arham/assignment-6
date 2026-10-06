import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

// Schemas are shaped { body?, query?, params? }; parsed (coerced/defaulted) values are written back.
export function validate(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body, query: req.query, params: req.params });
    if (!result.success) {
      return next(result.error);
    }
    const { body, query } = result.data as { body?: unknown; query?: unknown };
    if (body !== undefined) req.body = body;
    // Express 5 makes req.query a getter, so shadow it instead of assigning.
    if (query !== undefined) {
      Object.defineProperty(req, "query", { value: query, writable: true, configurable: true });
    }
    next();
  };
}
