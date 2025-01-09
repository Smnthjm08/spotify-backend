import { z } from "zod";

const emailSchema = z.string().email().min(1).max(255);
const passwordSchema = z.string().min(6).max(255);
const usernameSchema = z.string().min(1).max(255);

export const registerSchema = z
  .object({
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  // username: usernameSchema,
  password: passwordSchema,
});

export const verificationCodeScehma = z.string().min(1).max(24);
