import { z } from "zod";
const create = z.object({
    body: z.object({
        name: z.string().min(1),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        tuitionPerCredit: z.number().positive(),
    }),
});
const update = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        startDate: z.coerce.date().optional(),
        endDate: z.coerce.date().optional(),
        enrollmentOpen: z.boolean().optional(),
        tuitionPerCredit: z.number().positive().optional(),
    }),
});
export const semesterValidation = { create, update };
//# sourceMappingURL=semester.validation.js.map