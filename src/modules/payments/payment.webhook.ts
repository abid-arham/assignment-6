import { Request, Response } from "express"
import Stripe from "stripe"
import { stripe } from "../../config/stripe.js"
import { env } from "../../config/env.js"
import { paymentServices } from "./payment.service.js"

export const handleStripeWebhook = async (req: Request, res: Response) => {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return res.status(500).send("Webhook not configured")
  }

  const signature = req.headers["stripe-signature"]
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, signature as string, env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send("Webhook signature verification failed")
  }

  if (event.type === "checkout.session.completed") {
    await paymentServices.handleCheckoutCompleted(event)
  }

  res.status(200).json({ received: true })
}
