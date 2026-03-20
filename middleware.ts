import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Edge Middleware — runs before every matched request.
 *
 * Protected routes: /leaderboard, /profile, /compare, /admin
 * Unauthenticated requests are redirected to /login.
 */
export default async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the originally requested URL so we can redirect back after login
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

/**
 * Matcher — only run middleware on these routes.
 * Public routes (/, /login, /api/auth/*) are intentionally excluded.
 */
export const config = {
  matcher: [
    "/leaderboard/:path*",
    "/profile/:path*",
    "/compare/:path*",
    "/admin/:path*",
  ],
};
