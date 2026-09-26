import { Router } from "express"
import { Role } from "@prisma/client"
import { authenticate } from "../../middlewares/authenticate.js"
import { authorize } from "../../middlewares/authorize.js"
import { validate } from "../../middlewares/validate.js"
import { departmentValidation } from "./department.validation.js"
import { departmentController } from "./department.controller.js"

const router = Router()

router.get("/", departmentController.getAllDepartments)
router.post("/", authenticate, authorize(Role.ADMIN), validate(departmentValidation.create), departmentController.createDepartment)
router.patch("/:id", authenticate, authorize(Role.ADMIN), validate(departmentValidation.update), departmentController.updateDepartment)
router.delete("/:id", authenticate, authorize(Role.ADMIN), departmentController.deleteDepartment)

export const departmentRouter = router
