// lib/clientAuth.ts

import { jwtDecode } from "jwt-decode";

export type JwtPayload = {
  sub: string;
  email: string;
  exp?: number;
  iat?: number;
};

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getUserFromToken(
  token: string | undefined | null
): JwtPayload | null {
  try {
    if (!token || typeof token !== "string") return null;

    // Ensure token is a valid JWT (has 3 parts)
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }
    const decoded = jwtDecode<JwtPayload>(token);

    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch (err) {
    console.log(err);

    return null;
  }
}
