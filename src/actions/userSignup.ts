"use server";

import { revalidatePath } from "next/cache";
import { signUpSchema } from "@/lib/validators/auth";
import { hashPassword, signJwt, setSessionCookie } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { z, ZodError } from "zod";
import { db } from "@/db";
import { users } from "@/db/schema";
import { cookies } from "next/headers";

type FormDataLike = {
  get: (k: string) => FormDataEntryValue | null;
};

export async function signUpAction(formData: FormDataLike) {
  try {
    // build object from FormData to validate with zod
    const raw = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      whatsapp: String(formData.get("whatsapp") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      name: String(formData.get("name") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    // Validate using zod (throws on bad input)
    const parsed = signUpSchema.safeParse(raw);

    if (!parsed.success) {
      let errorMessage = "";
      parsed.error.issues.forEach((i) => {
        errorMessage = errorMessage + i.message + ". \b";
      });
      return { ok: false, errors: errorMessage };
    }

    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, parsed.data.email))
      .limit(1);

    if (existing.length > 0) {
      // throw an error that you can catch in the client or use redirect with message
      throw new Error("Email already in use");
    }

    // Hash password
    const passwordHash = await hashPassword(parsed.data.password);

    // Insert user and return id
    const inserted = await db
      .insert(users)
      .values({
        email: parsed.data.email,
        password: passwordHash,
        phone: parsed.data.phone,
        whatsapp: parsed.data.whatsapp,
        name: parsed.data.name,
      })
      .returning({ id: users.id, email: users.email });

    const user = Array.isArray(inserted) ? inserted[0] : inserted;

    // Create JWT payload (keep minimal)
    const token = await signJwt({ sub: String(user.id), email: user.email });

    // Set HttpOnly cookie
    //   setSessionCookie(token);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "session",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      // secure should be true in prod
      secure: process.env.NODE_ENV === "production",
      maxAge: parseInt(process.env.JWT_EXPIRES_IN!), // 7 days if JWT_EXPIRES_IN is 7d
    });

    // optional: revalidate paths (Next cache) so SSR pages update
    revalidatePath("/");

    // Return something to the client (server action resolves to this)
    return { ok: true, user: { id: user.id, email: user.email } };
  } catch (err) {
    console.log(err);

    throw err;
  }
}

export async function logout() {
  const cookieStore = await cookies(); // ✅ Call immediately
  cookieStore.delete("session");
}
