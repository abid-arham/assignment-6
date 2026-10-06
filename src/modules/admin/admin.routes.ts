import { Router } from "express"
import { Role } from "@prisma/client"
import { authenticate } from "../../middlewares/authenticate.js"
import { authorize } from "../../middlewares/authorize.js"
import { validate } from "../../middlewares/validate.js"
import { adminValidation } from "./admin.validation.js"
import { adminController } from "./admin.controller.js"

const router = Router()

router.use(authenticate, authorize(Role.ADMIN))

router.get("/users", validate(adminValidation.listUsers), adminController.listUsers)
router.patch("/users/:id/role", validate(adminValidation.changeRole), adminController.changeRole)
router.patch("/users/:id/status", validate(adminValidation.changeStatus), adminController.changeStatus)
router.get("/stats", adminController.getStats)
router.get("/audit-logs", validate(adminValidation.listAuditLogs), adminController.listAuditLogs)

export const adminRouter = router
