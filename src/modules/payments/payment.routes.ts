import { Router } from "express"
import { Role } from "@prisma/client"
import { authenticate } from "../../middlewares/authenticate.js"
import { authorize } from "../../middlewares/authorize.js"
import { validate } from "../../middlewares/validate.js"
import { paymentValidation } from "./payment.validation.js"
import { paymentController } from "./payment.controller.js"

const router = Router()

router.post("/initiate", authenticate, authorize(Role.STUDENT), validate(paymentValidation.initiate), paymentController.initiatePayment)
// Stripe redirects the browser here (no Bearer token); both re-check the session with Stripe.
router.get("/success", validate(paymentValidation.success), paymentController.paymentSuccess)
router.get("/cancel", validate(paymentValidation.cancel), paymentController.paymentCancel)
router.get("/:id", authenticate, authorize(Role.STUDENT), paymentController.getPaymentStatus)

export const paymentRouter = router
