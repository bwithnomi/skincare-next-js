"use server";

import { revalidatePath } from "next/cache";
import { signInSchema } from "@/lib/validators/auth";
import { signJwt, verifyPassword } from "@/lib/auth";
import { db } from "@/db";
import { cookies } from "next/headers";

type FormDataLike = {
  get: (k: string) => FormDataEntryValue | null;
};

export async function signInAction(formData: FormDataLike) {
  try {
    // build object from FormData to validate with zod
    const raw = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    // Validate using zod (throws on bad input)
    const parsed = signInSchema.safeParse(raw);

    if (!parsed.success) {
      let errorMessage = "";
      parsed.error.issues.forEach((i) => {
        errorMessage = errorMessage + i.message + ". \b";
      });
      return { ok: false, errors: errorMessage };
    }

    // Check if user exists
    const existing = await db.query.users.findFirst({
      where: (users, { eq }) => {
        return eq(users.email, parsed.data.email);
      },
    });

    if (!existing) {
      // throw an error that you can catch in the client or use redirect with message
      throw new Error("User not found");
    }

    // Hash password
    const result = await verifyPassword(
      existing.password,
      parsed.data.password
    );

    if (!result) {
      return { ok: false, data: null };
    }

    const user = existing;

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
    return { ok: true, user: { ...user, password: undefined } };
  } catch (err) {
    console.log(err);

    throw err;
  }
}
