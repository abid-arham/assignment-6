import { Router } from "express"
import { Role } from "@prisma/client"
import { authenticate } from "../../middlewares/authenticate.js"
import { authorize } from "../../middlewares/authorize.js"
import { validate } from "../../middlewares/validate.js"
import { paymentValidation } from "./payment.validation.js"
import { paymentController } from "./payment.controller.js"

const router = Router()

router.post("/initiate", authenticate, authorize(Role.STUDENT), validate(paymentValidation.initiate), paymentController.initiatePayment)
router.get("/:id", authenticate, authorize(Role.STUDENT), paymentController.getPaymentStatus)

export const paymentRouter = router
