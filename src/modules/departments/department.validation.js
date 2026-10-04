import { z } from "zod";
const create = z.object({
    body: z.object({
        name: z.string().min(1),
        code: z.string().min(1).max(10),
    }),
});
const update = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        code: z.string().min(1).max(10).optional(),
    }),
});
export const departmentValidation = { create, update };
//# sourceMappingURL=department.validation.js.map