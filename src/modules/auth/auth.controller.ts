import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "./auth.service.js";

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
