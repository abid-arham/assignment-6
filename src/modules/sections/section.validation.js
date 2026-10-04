import { z } from "zod";
const create = z.object({
    body: z.object({
        courseId: z.string().min(1),
        semesterId: z.string().min(1),
        instructorId: z.string().min(1),
        sectionCode: z.string().min(1).max(5),
        capacity: z.number().int().min(1),
    }),
});
const update = z.object({
    body: z.object({
        instructorId: z.string().min(1).optional(),
        capacity: z.number().int().min(1).optional(),
    }),
});
const list = z.object({
    query: z.object({
        semesterId: z.string().optional(),
        courseId: z.string().optional(),
        instructorId: z.string().optional(),
    }),
});
export const sectionValidation = { create, update, list };
//# sourceMappingURL=section.validation.js.map