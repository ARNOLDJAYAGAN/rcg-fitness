import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  // Protect admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = req.cookies.get("admin_token")?.value;

    if (!token) {
      // redirect to login if token is missing
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET!);
    } catch {
      return NextResponse.redirect(new URL("/admin-login", req.url));
    }
  }

  return NextResponse.next();
}

// Specify which routes to apply middleware to
export const config = {
  matcher: ["/admin/:path*"], // all admin pages
};
