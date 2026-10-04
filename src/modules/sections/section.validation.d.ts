import { z } from "zod";
export declare const sectionValidation: {
    create: z.ZodObject<{
        body: z.ZodObject<{
            courseId: z.ZodString;
            semesterId: z.ZodString;
            instructorId: z.ZodString;
            sectionCode: z.ZodString;
            capacity: z.ZodNumber;
        }, z.core.$strip>;
    }, z.core.$strip>;
    update: z.ZodObject<{
        body: z.ZodObject<{
            instructorId: z.ZodOptional<z.ZodString>;
            capacity: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    list: z.ZodObject<{
        query: z.ZodObject<{
            semesterId: z.ZodOptional<z.ZodString>;
            courseId: z.ZodOptional<z.ZodString>;
            instructorId: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>;
};
//# sourceMappingURL=section.validation.d.ts.map