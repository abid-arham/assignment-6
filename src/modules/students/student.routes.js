import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { gradeController } from "../grades/grade.controller.js";
const router = Router();
router.get("/me/transcript", authenticate, authorize(Role.STUDENT), gradeController.getTranscript);
export const studentRouter = router;
//# sourceMappingURL=student.routes.js.map