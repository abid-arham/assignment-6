import { z } from "zod"

const create = z.object({
  body: z.object({
    sectionId: z.string().min(1),
  }),
})

export const enrollmentValidation = { create }
