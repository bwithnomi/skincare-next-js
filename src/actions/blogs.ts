"use server";

import { db } from "@/db";
import { blogs } from "@/db/schema";
import { getUserFromToken } from "@/lib/clientAuth";
import { blogSchema } from "@/lib/validators/blog";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const fetchBlogs = async () => {
  const allBlogs = await db.query.blogs.findMany({
    orderBy: desc(blogs.createdAt),
  });

  return allBlogs;
};

export const fetchBlogById = async (id: number) => {
  const blog = await db.query.blogs.findFirst({
    where: (blogs, { eq }) => {
      return eq(blogs.id, id);
    },
  });

  return blog;
};

export const createNewBlog = async (data: {
  title: string;
  author: string;
  content: string;
}) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }

  const parsed = blogSchema.safeParse(data);

  if (!parsed.success) {
    let errorMessage = "";
    parsed.error.issues.forEach((i) => {
      errorMessage = errorMessage + i.message + ". \b";
    });
    return { ok: false, errors: errorMessage };
  }
  const blog = await db
    .insert(blogs)
    .values({
      title: parsed.data.title,
      author: parsed.data.author,
      content: parsed.data.content,
    })
    .returning();
  return { ok: true, data: blog };
};

export const deleteBlogById = async (id: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }
  await db.delete(blogs).where(eq(blogs.id, id));
  return { ok: true };
};
