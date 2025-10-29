import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1).max(256),
  sub_categories: z.array(z.string().min(1).max(256)).min(1),
});

