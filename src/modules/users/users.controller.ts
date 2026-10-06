
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { getMe, updateMe, updateAvatar } from "./users.service.js";

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getMe(req.user!.id);
  sendSuccess(res, 200, "OK", user);
});

export const patchMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateMe(req.user!.id, req.body);
  sendSuccess(res, 200, "Updated", user);
});

export const patchAvatar = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError(422, "An image file is required in the 'avatar' form field");
  const user = await updateAvatar(req.user!.id, req.file);
  sendSuccess(res, 200, "Avatar updated", user);
});
