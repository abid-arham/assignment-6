import { z } from "zod";

const updateMe = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
  }),
});

export const usersValidation = { updateMe };
