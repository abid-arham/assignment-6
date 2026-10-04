import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../../middlewares/authenticate.js";
import { authorize } from "../../middlewares/authorize.js";
import { validate } from "../../middlewares/validate.js";
import { semesterValidation } from "./semester.validation.js";
import { semesterController } from "./semester.controller.js";
const router = Router();
router.get("/", semesterController.getAllSemesters);
router.post("/", authenticate, authorize(Role.ADMIN), validate(semesterValidation.create), semesterController.createSemester);
router.patch("/:id", authenticate, authorize(Role.ADMIN), validate(semesterValidation.update), semesterController.updateSemester);
export const semesterRouter = router;
//# sourceMappingURL=semester.routes.js.map