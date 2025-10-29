"use server";

import { db } from "@/db";
import { Footer, footer } from "@/db/schema";
import { getUserFromToken } from "@/lib/clientAuth";
import { footerSchema } from "@/lib/validators/footer";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export type JwtPayload = {
  sub: string;
  email: string;
  exp?: number;
  iat?: number;
};
export const fetchFooter = async () => {
  const footer = await db.query.footer.findFirst({});

  return footer;
};

export const updateFooter = async (footerData: Footer) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin")?.value;
  const data = getUserFromToken(token);

  if (!data) {
    return { ok: false, errors: "Unauthorized" };
  }

  const res = footerSchema.safeParse(footerData);
  if (!res.success) {
    let errorMessage = "";
    res.error.issues.forEach((i) => {
      errorMessage = errorMessage + i.message + ". \b";
    });
    return { ok: false, errors: errorMessage };
  }

  await db
    .update(footer)
    .set({
      facebook: footerData.facebook,
      linkedin: footerData.linkedin,
      instagram: footerData.instagram,
      email: footerData.email,
      address: footerData.address,
      phone: footerData.phone,
    })
    .where(eq(footer.id, footerData.id));

  return { ok: true, data: res.data };
};
