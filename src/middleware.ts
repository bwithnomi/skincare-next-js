import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { getUserFromToken } from "./lib/clientAuth";

export function middleware(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.next();
  }
  const token = req.cookies.get("admin")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Allow public routes (admin login, regular login/signup)
  const publicPaths = ["/admin/login"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // ✅ Protect admin routes
  if (pathname.startsWith("/admin")) {
    // if there is no token and path is public
    if (!token && isPublicPath) {
      return NextResponse.next();
    }

    // if there is no token and path is protected
    if (!token && !isPublicPath) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    try {
      let res = getUserFromToken(token);
      
      // if there is valid token and path is protected
      if (res && !isPublicPath) {
        return NextResponse.next();
      }
      // if there is valid token and path is public
      if (res && isPublicPath) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (!res && isPublicPath) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/admin/login", req.url));
    } catch (err) {
      console.log(err);
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  // ✅ Protect other authenticated pages (like dashboard)
  //   if (pathname.startsWith("/admin")) {
  //     if (!token) {
  //       return NextResponse.redirect(new URL("/admin/login", req.url));
  //     }

  // Default allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
