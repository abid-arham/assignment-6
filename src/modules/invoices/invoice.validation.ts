import { z } from "zod"

const generate = z.object({
  body: z.object({
    semesterId: z.string().min(1),
  }),
})

export const invoiceValidation = { generate }
