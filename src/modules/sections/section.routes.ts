import { Router } from "express"
import { Role } from "@prisma/client"
import { authenticate } from "../../middlewares/authenticate.js"
import { authorize } from "../../middlewares/authorize.js"
import { validate } from "../../middlewares/validate.js"
import { sectionValidation } from "./section.validation.js"
import { enrollmentController } from "../enrollments/enrollment.controller.js"
import { sectionController } from "./section.controller.js"

const router = Router()

router.get("/", validate(sectionValidation.list), sectionController.getAllSections)
router.get("/my", authenticate, authorize(Role.INSTRUCTOR), sectionController.getMySections)
router.get("/:id", sectionController.getSectionById)
router.get("/:id/students", authenticate, authorize(Role.INSTRUCTOR), enrollmentController.getStudentsForSection)
router.post("/", authenticate, authorize(Role.ADMIN), validate(sectionValidation.create), sectionController.createSection)
router.patch("/:id", authenticate, authorize(Role.ADMIN), validate(sectionValidation.update), sectionController.updateSection)

export const sectionRouter = router
