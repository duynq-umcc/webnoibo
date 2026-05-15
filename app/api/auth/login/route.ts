/**
 * @deprecated
 * Redirects to /api/auth/session (POST).
 * New login flow: Firebase Auth client-side + session cookie creation.
 */
import { NextRequest, NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email va mat khau khong duoc de trong" },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    const sessionRes = await fetch(new URL("/api/auth/session", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!sessionRes.ok) {
      return NextResponse.json(
        { error: "Khong the tao phien dang nhap" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const firebaseError = err as { code?: string };
    if (
      firebaseError.code === "auth/user-not-found" ||
      firebaseError.code === "auth/wrong-password" ||
      firebaseError.code === "auth/invalid-credential"
    ) {
      return NextResponse.json(
        { error: "Email hoac mat khau khong dung" },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: "Dang nhap that bai" }, { status: 500 });
  }
}
