import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { uploadImage } from "../../middlewares/upload.js";
import { usersValidation } from "./users.validation.js";
import { me, patchMe, patchAvatar } from "./users.controller.js";

const router = Router();

router.get("/me", authenticate, me);
router.patch("/me", authenticate, validate(usersValidation.updateMe), patchMe);
router.patch("/me/avatar", authenticate, uploadImage.single("avatar"), patchAvatar);

export default router;
