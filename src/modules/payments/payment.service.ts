import Stripe from "stripe"
import { prisma } from "../../config/prisma.js"
import { stripe } from "../../config/stripe.js"
import { AppError } from "../../utils/AppError.js"
import { writeAuditLog } from "../../utils/audit.js"

const createCheckoutSession = async (studentId: string, invoiceId: string) => {
  if (!stripe) throw new AppError(500, "Payment provider is not configured")

  const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, studentId } })
  if (!invoice) throw new AppError(404, "Invoice not found")
  if (invoice.status === "PAID") throw new AppError(409, "Invoice is already paid")

  const session = await stripe.checkout.sessions.create({
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
    success_url: "https://example.com/payment/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: "https://example.com/payment/cancelled",
    metadata: { invoiceId: invoice.id, studentId },
  })

  const payment = await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      providerSessionId: session.id,
      amount: invoice.amount,
      status: "PENDING",
    },
  })

  return { checkoutUrl: session.url, paymentId: payment.id }
}

const handleCheckoutCompleted = async (event: Stripe.Event) => {
  const session = event.data.object as Stripe.Checkout.Session

  await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { providerSessionId: session.id } })
    if (!payment) return
    if (payment.stripeEventId === event.id) return

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCEEDED",
        providerPaymentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        stripeEventId: event.id,
      },
    })

    await tx.invoice.update({
      where: { id: payment.invoiceId },
      data: { status: "PAID", paidAt: new Date() },
    })

    await writeAuditLog({
      actorId: null,
      action: "PAYMENT_SUCCEEDED",
      entity: "Payment",
      entityId: payment.id,
      metadata: { stripeEventId: event.id, invoiceId: payment.invoiceId },
    })
  })
}

const getPaymentStatus = async (paymentId: string, studentId: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, invoice: { studentId } },
    include: { invoice: true },
  })
  if (!payment) throw new AppError(404, "Payment not found")
  return payment
}

export const paymentServices = { createCheckoutSession, handleCheckoutCompleted, getPaymentStatus }
