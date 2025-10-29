import { z } from "zod";

export const signUpSchema = z
  .object({
    email: z.email("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128),
    whatsapp: z.string().min(10).max(125).nullable(),
    phone: z.string().min(10).max(125),
    name: z.string().min(1).max(125),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Optional: shape for server input (strip confirmPassword)
export const signUpInput = signUpSchema.pick({ email: true, password: true });

export type SignUpInput = z.infer<typeof signInInput>;
export const signInSchema = z.object({
  email: z.email("Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128),
});

// Optional: shape for server input (strip confirmPassword)
export const signInInput = signInSchema.pick({ email: true, password: true });

export type SignInInput = z.infer<typeof signUpInput>;
