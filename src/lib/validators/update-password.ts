import { z } from "zod";

export const updatePasswordSchema = z
  .object({
    old_password: z.string().min(1, "Old Password is required").max(128),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters")
      .max(128),
    confirm_password: z.string(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });
