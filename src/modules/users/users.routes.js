import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate";
import { validate } from "../../middlewares/validate";
import { updateMeSchema } from "./users.schema";
import { me, patchMe } from "./users.controller";
const router = Router();
router.get("/me", authenticate, me);
router.patch("/me", authenticate, validate(updateMeSchema), patchMe);
export default router;
//# sourceMappingURL=users.routes.js.map