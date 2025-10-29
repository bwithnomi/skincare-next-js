import { z } from "zod";

export const footerSchema = z.object({
  email: z.email("Email is required"),
  address: z.string().min(1).max(256),
  facebook: z.string().min(1).max(256),
  phone: z.string().min(1).max(125),
  linkedin: z.string().min(1).max(256),
  instagram: z.string().min(1).max(256),
});

