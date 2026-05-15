import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase/admin";
import type { Role } from "@/lib/rbac";

const SESSION_COOKIE_NAME = "session";

async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return false;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie);
    const claims = decoded.customClaims as { role?: string } | undefined;
    return claims?.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAdmin(request))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { uid, role, department, isBhytDoctor } = body as {
      uid: string;
      role: Role;
      department?: string;
      isBhytDoctor?: boolean;
    };

    if (!uid || !role) {
      return NextResponse.json(
        { error: "uid and role are required" },
        { status: 400 }
      );
    }

    await adminAuth.setCustomUserClaims(uid, {
      role,
      department: department ?? "",
      isBhytDoctor: isBhytDoctor ?? false,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[set-claims] error:", error);
    return NextResponse.json(
      { error: "Failed to set custom claims" },
      { status: 500 }
    );
  }
}
