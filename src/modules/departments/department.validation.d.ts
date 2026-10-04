import { z } from "zod";
export declare const departmentValidation: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            code: z.ZodString;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            code: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=department.validation.d.ts.map