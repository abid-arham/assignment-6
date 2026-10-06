import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { authValidation } from "./auth.validation.js";
import { register, login, refresh, logout, googleLogin, googleCallback } from "./auth.controller.js";

const router = Router();

router.post("/register", validate(authValidation.register), register);
router.post("/login", validate(authValidation.login), login);
router.post("/refresh-token", validate(authValidation.refreshToken), refresh);
router.post("/logout", validate(authValidation.refreshToken), logout);
router.get("/google", googleLogin);
router.get("/google/callback", validate(authValidation.googleCallback), googleCallback);

export default router;
