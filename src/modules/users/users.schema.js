import { z } from "zod";
export const updateMeSchema = z.object({
    name: z.string().min(2).max(100),
});
//# sourceMappingURL=users.schema.js.map