import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import { validate } from "../../middlewares/validate.js";
import { updateMeSchema } from "./users.schema.js";
import { me, patchMe } from "./users.controller.js";

const router = Router();

router.get("/me", authenticate, me);
router.patch("/me", authenticate, validate(updateMeSchema), patchMe);

export default router;
