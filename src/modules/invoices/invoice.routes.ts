import { Router } from "express"
import { Role } from "@prisma/client"
import { authenticate } from "../../middlewares/authenticate.js"
import { authorize } from "../../middlewares/authorize.js"
import { validate } from "../../middlewares/validate.js"
import { invoiceValidation } from "./invoice.validation.js"
import { invoiceController } from "./invoice.controller.js"

const router = Router()

router.post("/generate", authenticate, authorize(Role.STUDENT), validate(invoiceValidation.generate), invoiceController.generateInvoice)
router.get("/my", authenticate, authorize(Role.STUDENT), invoiceController.getMyInvoices)

export const invoiceRouter = router
