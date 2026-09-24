import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import { verifyAccessToken, AccessTokenPayload } from "../utils/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError(401, "Missing or invalid Authorization header"));
  }

  const token = header.slice("Bearer ".length);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired access token"));
  }
}
