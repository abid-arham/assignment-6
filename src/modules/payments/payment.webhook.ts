import { Request, Response } from "express"
import Stripe from "stripe"
import { stripe } from "../../config/stripe.js"
import config from "../../config/index.js"
import { paymentServices } from "./payment.service.js"

export const handleStripeWebhook = async (req: Request, res: Response) => {
  if (!stripe || !config.stripe_webhook_secret) {
    return res.status(500).send("Webhook not configured")
  }

  const signature = req.headers["stripe-signature"]
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(req.body, signature as string, config.stripe_webhook_secret)
  } catch (err) {
    return res.status(400).send("Webhook signature verification failed")
  }

  if (event.type === "checkout.session.completed") {
    await paymentServices.markSucceeded(event.data.object, event.id)
  } else if (event.type === "checkout.session.expired") {
    await paymentServices.markCancelled(event.data.object.id, "Checkout session expired")
  }

  res.status(200).json({ received: true })
}
