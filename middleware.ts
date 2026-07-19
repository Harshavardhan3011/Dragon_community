import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dragon-up-dev-secret-key-change-in-production"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect admin dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
    const token = req.cookies.get("dragon-up-session")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    try {
      await jwtVerify(token, SECRET);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete("dragon-up-session");
      return response;
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/admin/login") {
    const token = req.cookies.get("dragon-up-session")?.value;
    if (token) {
      try {
        await jwtVerify(token, SECRET);
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } catch {
        // Token invalid — let them through to login
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
