import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { enrollmentValidation } from "./enrollment.validation.js";
import { enrollmentController } from "./enrollment.controller.js";
const router = Router();
router.post("/", authenticate, authorize(Role.STUDENT), validate(enrollmentValidation.create), enrollmentController.enroll);
router.post("/:id/drop", authenticate, authorize(Role.STUDENT), enrollmentController.drop);
router.get("/my", authenticate, authorize(Role.STUDENT), enrollmentController.getMyEnrollments);
export const enrollmentRouter = router;
//# sourceMappingURL=enrollment.routes.js.map