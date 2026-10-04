import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { rateLimitAuth } from "../../middlewares/rateLimit";
import { registerSchema, loginSchema, refreshTokenSchema } from "./auth.schema";
import { register, login, refresh, logout } from "./auth.controller";
const router = Router();
router.post("/register", rateLimitAuth, validate(registerSchema), register);
router.post("/login", rateLimitAuth, validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refresh);
router.post("/logout", validate(refreshTokenSchema), logout);
export default router;
//# sourceMappingURL=auth.routes.js.map