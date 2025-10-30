"use server";

import { appointments, AppointmentStatus } from "@/db/schema/appointment";
import { revalidatePath } from "next/cache";
import { signInSchema } from "@/lib/validators/auth";
import { hashPassword, signJwt, verifyPassword } from "@/lib/auth";
import { db } from "@/db";
import { admins, users } from "@/db/schema";
import { cookies } from "next/headers";
import { updatePasswordSchema } from "@/lib/validators/update-password";
import { getUserFromToken } from "@/lib/clientAuth";
import { eq } from "drizzle-orm";

type FormDataLike = {
  get: (k: string) => FormDataEntryValue | null;
};

export async function adminSignInAction(formData: FormDataLike) {
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
    const existing = await db.query.admins.findFirst({
      where: (admins, { eq }) => {
        return eq(admins.email, parsed.data.email);
      },
    });

    if (!existing) {
      // throw an error that you can catch in the client or use redirect with message
      return { ok: false, data: null, errors: "Invalid email or password" };
    }

    // Hash password
    const result = await verifyPassword(
      existing.password,
      parsed.data.password
    );

    if (!result) {
      return { ok: false, data: null, errors: "Unauthorized user" };
    }

    const user = existing;

    // Create JWT payload (keep minimal)
    const token = await signJwt({ sub: String(user.id), email: user.email });

    // Set HttpOnly cookie
    //   setSessionCookie(token);

    const cookieStore = await cookies();
    cookieStore.set({
      name: "admin",
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
    throw err;
  }
}

export async function adminUpdatePassword(formData: {
  old_password: string;
  password: string;
  confirm_password: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin")?.value;
    const data = getUserFromToken(token);

    if (!data) {
      return { ok: false, errors: "Unauthorized" };
    }
    // build object from FormData to validate with zod

    // Validate using zod (throws on bad input)
    const parsed = updatePasswordSchema.safeParse(formData);

    if (!parsed.success) {
      let errorMessage = "";
      parsed.error.issues.forEach((i) => {
        errorMessage = errorMessage + i.message + ". \b";
      });
      return { ok: false, errors: errorMessage };
    }

    // Check if user exists
    const existing = await db.query.admins.findFirst({
      where: (admins, { eq }) => {
        return eq(admins.email, data.email);
      },
    });

    if (!existing) {
      // throw an error that you can catch in the client or use redirect with message
      throw new Error("Admin not found");
    }

    // Hash password
    const result = await verifyPassword(
      existing.password,
      parsed.data.old_password
    );

    if (!result) {
      return { ok: false, errors: "Incorrect old password" };
    }

    const user = existing;
    const new_password = await hashPassword(parsed.data.password);
    await db
      .update(admins)
      .set({
        password: new_password,
      })
      .where(eq(admins.email, existing.email));

    revalidatePath("/");

    // Return something to the client (server action resolves to this)
    return { ok: true, user: { ...user, password: undefined } };
  } catch (err) {
    throw err;
  }
}

export async function logout() {
  const cookieStore = await cookies(); // ✅ Call immediately
  cookieStore.delete("admin");
}

export async function dashboardStats() {
  const [
    totalUsers,
    totalAppointments,
    totalConfirmedAppointments,
    totalPendingAppointments,
  ] = await Promise.all([
    db.$count(users),
    db.$count(appointments),
    db.$count(
      appointments,
      eq(appointments.appointment_status, AppointmentStatus.CONFIRMED)
    ),
    db.$count(
      appointments,
      eq(appointments.appointment_status, AppointmentStatus.PENDING)
    ),
  ]);
  return {
    totalUsers,
    totalAppointments,
    totalConfirmedAppointments,
    totalPendingAppointments,
  };
}
