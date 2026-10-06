import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { usersValidation } from "./users.validation.js";
import { me, patchMe } from "./users.controller.js";

const router = Router();

router.get("/me", authenticate, me);
router.patch("/me", authenticate, validate(usersValidation.updateMe), patchMe);

export default router;
