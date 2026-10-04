import { z } from "zod";
export declare const gradeValidation: {
    submitGrade: z.ZodObject<{
        body: z.ZodObject<{
            grade: z.ZodEnum<{
                A: "A";
                "A+": "A+";
                "A-": "A-";
                B: "B";
                "B+": "B+";
                "B-": "B-";
                C: "C";
                "C+": "C+";
                "C-": "C-";
                D: "D";
                F: "F";
            }>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    gradeEnum: z.ZodEnum<{
        A: "A";
        "A+": "A+";
        "A-": "A-";
        B: "B";
        "B+": "B+";
        "B-": "B-";
        C: "C";
        "C+": "C+";
        "C-": "C-";
        D: "D";
        F: "F";
    }>;
};
//# sourceMappingURL=grade.validation.d.ts.map