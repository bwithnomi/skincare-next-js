"use server";

import { db } from "@/db";
import { NewService, services } from "@/db/schema";
import { getUserFromToken } from "@/lib/clientAuth";
import { serviceSchema } from "@/lib/validators/service";
import { desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";

export const fetchServices = async () => {
  const allServices = await db.query.services.findMany({
    orderBy: desc(services.createdAt),
  });

  return allServices;
};

export const fetchBlogById = async (id: number) => {
  const blog = await db.query.blogs.findFirst({
    where: (blogs, { eq }) => {
      return eq(blogs.id, id);
    },
  });

  return blog;
};

export const createNewService = async (data: NewService) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }

  const parsed = serviceSchema.safeParse(data);

  if (!parsed.success) {
    let errorMessage = "";
    parsed.error.issues.forEach((i) => {
      errorMessage = errorMessage + i.message + ". \b";
    });
    return { ok: false, errors: errorMessage };
  }
  const blog = await db
    .insert(services)
    .values({
      title: parsed.data.title,
      sub_categories: parsed.data.sub_categories,
    })
    .returning();
  return { ok: true, data: blog };
};

export const deleteServiceById = async (id: number) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  const user = getUserFromToken(token);

  if (!user) {
    return { ok: false, errors: "Unauthorized" };
  }
  await db.delete(services).where(eq(services.id, id));
  return { ok: true };
};
