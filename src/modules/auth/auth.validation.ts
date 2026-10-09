import { z } from "zod";

const register = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long").max(72)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  }),
});

const login = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long").max(72)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  }),
});

const refreshToken = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

const googleCallback = z.object({
  query: z.object({
    code: z.string().min(1),
  }),
});

export const authValidation = { register, login, refreshToken, googleCallback };
