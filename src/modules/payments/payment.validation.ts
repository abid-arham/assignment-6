import { z } from "zod"

const initiate = z.object({
  body: z.object({
    invoiceId: z.string().min(1),
  }),
})

export const paymentValidation = { initiate }
