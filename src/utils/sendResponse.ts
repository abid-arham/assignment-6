import { Response } from "express";

interface Meta {
  page?: number;
  limit?: number;
  total?: number;
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: Meta
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data: meta ? { items: data, meta } : data,
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors: unknown[] = []
) {
  return res.status(statusCode).json({ success: false, message, errors });
}
