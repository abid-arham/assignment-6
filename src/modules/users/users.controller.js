import { asyncHandler } from "../../utils/asyncHandler";
import { sendSuccess } from "../../utils/sendResponse";
import { getMe, updateMe } from "./users.service";
export const me = asyncHandler(async (req, res) => {
    const user = await getMe(req.user.id);
    sendSuccess(res, 200, "OK", user);
});
export const patchMe = asyncHandler(async (req, res) => {
    const user = await updateMe(req.user.id, req.body);
    sendSuccess(res, 200, "Updated", user);
});
//# sourceMappingURL=users.controller.js.map