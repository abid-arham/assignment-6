import { Router } from "express"
import { Role } from "@prisma/client"
import { authenticate } from "../../middlewares/authenticate.js"
import { authorize } from "../../middlewares/authorize.js"
import { validate } from "../../middlewares/validate.js"
import { enrollmentValidation } from "./enrollment.validation.js"
import { enrollmentController } from "./enrollment.controller.js"
import { gradeValidation } from "../grades/grade.validation.js"
import { gradeController } from "../grades/grade.controller.js"

const router = Router()

router.post("/", authenticate, authorize(Role.STUDENT), validate(enrollmentValidation.create), enrollmentController.enroll)
router.post("/:id/drop", authenticate, authorize(Role.STUDENT), enrollmentController.drop)
router.get("/my", authenticate, authorize(Role.STUDENT), enrollmentController.getMyEnrollments)
router.patch("/:id/grade", authenticate, authorize(Role.INSTRUCTOR), validate(gradeValidation.submitGrade), gradeController.submitGrade)

export const enrollmentRouter = router
