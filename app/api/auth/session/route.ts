import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";

const SESSION_MAX_AGE = 60 * 60 * 24 * 14; // 14 days in seconds
const SESSION_COOKIE_NAME = "session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body as { idToken: string };

    if (!idToken) {
      return NextResponse.json({ error: "idToken is required" }, { status: 400 });
    }

    const expiresIn = SESSION_MAX_AGE * 1000; // milliseconds
    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    const response = NextResponse.json({ success: true });

    // Set cookie via Set-Cookie header directly to avoid Next.js cookie bug
    // SameSite=Lax works on localhost without Secure flag
    const cookieHeader = [
      `${SESSION_COOKIE_NAME}=${sessionCookie}`,
      `HttpOnly`,
      `Path=/`,
      `Max-Age=${SESSION_MAX_AGE}`,
      `SameSite=Lax`,
    ].join("; ");

    response.headers.set("Set-Cookie", cookieHeader);

    return response;
  } catch (error) {
    console.error("[session] POST error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });

  const cookieHeader = [
    `${SESSION_COOKIE_NAME}=`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=0`,
    `SameSite=Lax`,
    process.env.NODE_ENV === "production" ? "Secure" : "",
  ]
    .filter(Boolean)
    .join("; ");

  response.headers.set("Set-Cookie", cookieHeader);

  return response;
}
