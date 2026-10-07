import { randomUUID } from "node:crypto"
import type Stripe from "stripe"
import config from "../../config/index.js"
import { prisma } from "../../config/prisma.js"
import { stripe } from "../../config/stripe.js"
import { AppError } from "../../utils/AppError.js"
import { writeAuditLog } from "../../utils/audit.js"

const requireStripe = () => {
  if (!stripe) throw new AppError(500, "Payment provider is not configured")
  return stripe
}

const createCheckoutSession = async (studentId: string, invoiceId: string, baseUrl: string) => {
  const client = requireStripe()

  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, studentId } })
  if (!invoice) throw new AppError(404, "Invoice not found")
  if (invoice.status === "PAID") throw new AppError(409, "Invoice is already paid")

  // Generated up front so the cancel URL can name the payment it cancels.
  const paymentId = randomUUID()

  const session = await client.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: Math.round(Number(invoice.amount) * 100),
          product_data: { name: `Tuition — Invoice ${invoice.id}` },
        },
        quantity: 1,
      },
    ],
    success_url: config.frontend_url
      ? `${config.frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`
      : `${baseUrl}/api/v1/payments/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: config.frontend_url
      ? `${config.frontend_url}/payment/cancel?payment_id=${paymentId}`
      : `${baseUrl}/api/v1/payments/cancel?payment_id=${paymentId}`,
    metadata: { invoiceId: invoice.id, studentId, paymentId },
  })

  const payment = await prisma.payment.create({
    data: {
      id: paymentId,
      invoiceId: invoice.id,
      providerSessionId: session.id,
      amount: invoice.amount,
      status: "PENDING",
    },
  })

  return { checkoutUrl: session.url, paymentId: payment.id }
}

// Shared by the webhook and the success redirect, whichever arrives first.
const markSucceeded = async (session: Stripe.Checkout.Session, eventId?: string) => {
  if (session.payment_status !== "paid") return

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { providerSessionId: session.id } })
    if (!payment) return

    // Conditional update is the idempotency check: a retried webhook or the second of
    // webhook/redirect matches 0 rows (the row lock makes a concurrent caller wait, then skip).
    const { count } = await tx.payment.updateMany({
      where: { id: payment.id, status: { not: "SUCCEEDED" } },
      data: {
        status: "SUCCEEDED",
        failureReason: null,
        providerPaymentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        ...(eventId && { stripeEventId: eventId }),
      },
    })
    if (count === 0) return

    await tx.invoice.update({
      where: { id: payment.invoiceId },
      data: { status: "PAID", paidAt: new Date() },
    })

    await writeAuditLog({
      actorId: null,
      action: "PAYMENT_SUCCEEDED",
      entity: "Payment",
      entityId: payment.id,
      metadata: { invoiceId: payment.invoiceId, via: eventId ? "webhook" : "success_redirect", stripeEventId: eventId },
    }, tx)
  })
}

// Only a still-PENDING payment can be cancelled; a paid one stays SUCCEEDED.
const markCancelled = async (sessionId: string, reason: string) => {
  await prisma.payment.updateMany({
    where: { providerSessionId: sessionId, status: "PENDING" },
    data: { status: "CANCELLED", failureReason: reason },
  })
}

const paymentSummary = (where: { id: string } | { providerSessionId: string }) =>
  prisma.payment.findUniqueOrThrow({
    where,
    select: {
      id: true,
      status: true,
      amount: true,
      currency: true,
      failureReason: true,
      invoice: { select: { id: true, status: true, paidAt: true } },
    },
  })

const confirmSuccess = async (sessionId: string) => {
  const client = requireStripe()
  const session = await client.checkout.sessions.retrieve(sessionId).catch(() => {
    throw new AppError(404, "Checkout session not found")
  })
  await markSucceeded(session)
  return paymentSummary({ providerSessionId: session.id })
}

const cancelPayment = async (paymentId: string) => {
  const client = requireStripe()
  const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
  if (!payment?.providerSessionId) throw new AppError(404, "Payment not found")

  if (payment.status === "PENDING") {
    // Expire first so the session can't be paid after we report it cancelled, then trust Stripe's state.
    await client.checkout.sessions.expire(payment.providerSessionId).catch(() => undefined)
    const session = await client.checkout.sessions.retrieve(payment.providerSessionId)
    if (session.status === "expired") await markCancelled(session.id, "Cancelled at checkout")
    else await markSucceeded(session)
  }

  return paymentSummary({ id: paymentId })
}

const getPaymentStatus = async (paymentId: string, studentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, invoice: { studentId } },
    include: { invoice: true },
  })
  if (!payment) throw new AppError(404, "Payment not found")
  return payment
}

export const paymentServices = {
  createCheckoutSession,
  markSucceeded,
  markCancelled,
  confirmSuccess,
  cancelPayment,
  getPaymentStatus,
}
