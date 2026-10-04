import { Router } from "express"
import { Role } from "@prisma/client"
import { authenticate } from "../../middlewares/authenticate.js"
import { authorize } from "../../middlewares/authorize.js"
import { validate } from "../../middlewares/validate.js"
import { courseValidation } from "./course.validation.js"
import { courseController } from "./course.controller.js"

const router = Router()

router.get("/", validate(courseValidation.list), courseController.getAllCourses)
router.get("/:id", courseController.getCourseById)
router.post("/", authenticate, authorize(Role.ADMIN), validate(courseValidation.create), courseController.createCourse)
router.patch("/:id", authenticate, authorize(Role.ADMIN), validate(courseValidation.update), courseController.updateCourse)
router.delete("/:id", authenticate, authorize(Role.ADMIN), courseController.deleteCourse)
router.post("/:id/prerequisites", authenticate, authorize(Role.ADMIN), validate(courseValidation.addPrerequisite), courseController.addPrerequisite)
router.delete("/:id/prerequisites/:prereqId", authenticate, authorize(Role.ADMIN), courseController.removePrerequisite)

export const courseRouter = router
