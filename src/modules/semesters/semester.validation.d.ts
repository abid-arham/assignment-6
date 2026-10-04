import { z } from "zod";
export declare const semesterValidation: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodString;
            startDate: z.ZodCoercedDate<unknown>;
            endDate: z.ZodCoercedDate<unknown>;
            tuitionPerCredit: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            name: z.ZodOptional<z.ZodString>;
            startDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
            endDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
            enrollmentOpen: z.ZodOptional<z.ZodBoolean>;
            tuitionPerCredit: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=semester.validation.d.ts.map