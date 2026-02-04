import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string(),
});

export const SigninSchema = z.object({
  email: z.string(),
  password: z.string().min(6),
});