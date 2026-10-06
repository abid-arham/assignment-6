import { z } from "zod";

const register = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.email(),
    password: z.string().min(8).max(72),
  }),
});

const login = z.object({
  body: z.object({
    email: z.email(),
    password: z.string().min(1),
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
