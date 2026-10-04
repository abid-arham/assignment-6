
import type { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/sendResponse.js";
import { getMe, updateMe } from "./users.service.js";

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await getMe(req.user!.id);
  sendSuccess(res, 200, "OK", user);
});

export const patchMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await updateMe(req.user!.id, req.body);
  sendSuccess(res, 200, "Updated", user);
});
