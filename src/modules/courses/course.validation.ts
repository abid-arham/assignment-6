import { z } from "zod"

const create = z.object({
  body: z.object({
    code: z.string().min(1).max(20),
    title: z.string().min(1),
    description: z.string().optional(),
    credits: z.number().int().min(1).max(6),
    departmentId: z.string().min(1),
  }),
})

const update = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    credits: z.number().int().min(1).max(6).optional(),
    departmentId: z.string().min(1).optional(),
  }),
})

const list = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    departmentId: z.string().optional(),
    q: z.string().optional(),
    sortBy: z.enum(["title", "code", "createdAt"]).default("title"),
  }),
})

const addPrerequisite = z.object({
  body: z.object({
    prerequisiteId: z.string().min(1),
  }),
})

export type CourseListQuery = z.infer<typeof list>["query"]

export const courseValidation = { create, update, list, addPrerequisite }
