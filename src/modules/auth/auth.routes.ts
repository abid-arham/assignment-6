import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { rateLimitAuth } from "../../middlewares/rateLimit.js";
import { registerSchema, loginSchema, refreshTokenSchema } from "./auth.schema.js";
import { register, login, refresh, logout } from "./auth.controller.js";

const router = Router();

router.post("/register", rateLimitAuth, validate(registerSchema), register);
router.post("/login", rateLimitAuth, validate(loginSchema), login);
router.post("/refresh-token", validate(refreshTokenSchema), refresh);
router.post("/logout", validate(refreshTokenSchema), logout);

export default router;
