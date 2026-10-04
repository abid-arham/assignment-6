import { Request, Response } from "express"
import httpStatus from "http-status"
import { asyncHandler } from "../../utils/asyncHandler.js"
import { sendSuccess } from "../../utils/sendResponse.js"
import { paymentServices } from "./payment.service.js"

const initiatePayment = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentServices.createCheckoutSession(req.user!.id, req.body.invoiceId)
  sendSuccess(res, httpStatus.OK, "Checkout session created", result)
})

const getPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
  const result = await paymentServices.getPaymentStatus(req.params.id as string, req.user!.id)
  sendSuccess(res, httpStatus.OK, "Payment status retrieved", result)
})

export const paymentController = { initiatePayment, getPaymentStatus }
