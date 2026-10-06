import Stripe from "stripe"
import config from "./index.js"

export const stripe = config.stripe_secret_key
  ? new Stripe(config.stripe_secret_key, { apiVersion: "2026-08-26.dahlia" })
  : null
