import { z } from "zod";
const gradeEnum = z.enum(["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"]);
const submitGrade = z.object({
    body: z.object({
        grade: gradeEnum,
    }),
});
export const gradeValidation = { submitGrade, gradeEnum };
//# sourceMappingURL=grade.validation.js.map