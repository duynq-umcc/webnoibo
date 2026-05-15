import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "session";
const LOGIN_URL = "/login";

const PUBLIC_PATHS = [
  "/login",
  "/api/auth/session",
  "/api/auth/login",
  "/api/auth/verify-session",
  "/api/auth/set-claims",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".") ||
    PUBLIC_PATHS.some((p) => pathname.startsWith(p))
  ) {
    return NextResponse.next();
  }

  // Skip if no session cookie — let server layout handle redirect
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);

  const response = NextResponse.next();
  if (hasSession) {
    response.headers.set("x-has-session", "true");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
