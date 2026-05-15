import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const sessionCookie =
    request.headers.get("x-session-cookie") ??
    request.nextUrl.searchParams.get("sessionCookie");

  if (!sessionCookie) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie);
    return NextResponse.json({
      uid: decoded.uid,
      email: decoded.email,
      role: (decoded.customClaims as { role?: string })?.role ?? "reception",
    });
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }
}
