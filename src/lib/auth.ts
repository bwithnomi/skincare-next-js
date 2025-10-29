import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN!) || 3600; // e.g. 7d

export async function hashPassword(password: string) {
  return await argon2.hash(password);
}

export async function verifyPassword(hash: string, plain: string) {
  return await argon2.verify(hash, plain);
}

export async function signJwt(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/** Set HttpOnly cookie using Next's server cookies API */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: token,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    // secure should be true in prod
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 days if JWT_EXPIRES_IN is 7d
  });
}

/** Optional: clear cookie */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: "",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
}

