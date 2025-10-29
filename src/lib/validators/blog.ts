import { z } from "zod";

export const blogSchema = z.object({
  title: z.string().min(1).max(256),
  author: z.string().min(1).max(256),
  content: z.string().min(1),
});

