import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getGoogleAuthUrl,
  loginWithGoogle,
} from "./auth.service.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await registerUser(req.body);
  sendSuccess(res, 201, "Registered successfully", tokens);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await loginUser(req.body);
  sendSuccess(res, 200, "Logged in successfully", tokens);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await refreshAccessToken(req.body.refreshToken);
  sendSuccess(res, 200, "Token refreshed", tokens);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await logoutUser(req.body.refreshToken);
  sendSuccess(res, 200, "Logged out successfully", null);
});

export const googleLogin = asyncHandler(async (_req: Request, res: Response) => {
  res.redirect(getGoogleAuthUrl());
});

export const googleCallback = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await loginWithGoogle(req.query.code as string);
  sendSuccess(res, 200, "Logged in with Google successfully", tokens);
});
