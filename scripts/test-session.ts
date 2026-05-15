/**
 * Test login flow: creates a session cookie for admin user.
 * Run: npx tsx scripts/test-session.ts
 */

import { initializeApp, getApps, applicationDefault, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Load .env.local manually (no dotenv dependency)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, "../.env.local");
if (existsSync(envPath)) {
  const lines = readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
  console.log("[OK] Loaded .env.local");
}

const PROJECT_ID = "web-noi-bo-umcc1";
const ADMIN_UID = "lzT4O7CbwlMn1djV4rmooffOtbf2";
const SESSION_MAX_AGE = 60 * 60 * 24 * 14;

async function main() {
  try {
    // Init Firebase Admin with service account key
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey || serviceAccountKey.startsWith("<")) {
      console.error("[FAIL] FIREBASE_SERVICE_ACCOUNT_KEY not set in .env.local");
      console.error("Download from: Firebase Console > Project Settings > Service Accounts > Generate new private key");
      process.exit(1);
    }

    const serviceAccount = JSON.parse(Buffer.from(serviceAccountKey, "base64").toString());
    console.log(`[OK] Service account loaded, project: ${serviceAccount.project_id}`);

    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount),
        projectId: PROJECT_ID,
      });
    }

    const auth = getAuth();
    console.log("[OK] Firebase Admin initialized");

    // Create custom token
    const customToken = await auth.createCustomToken(ADMIN_UID);
    console.log("[OK] Custom token created");

    // Exchange for ID token via REST API
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      console.error("[FAIL] NEXT_PUBLIC_FIREBASE_API_KEY not set");
      process.exit(1);
    }

    const signInRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: customToken, returnSecureToken: true }),
      }
    );

    if (!signInRes.ok) {
      const err = (await signInRes.json()) as { error?: { message?: string } };
      console.error("[FAIL] signInWithCustomToken:", err.error?.message ?? signInRes.status);
      process.exit(1);
    }

    const signInData = (await signInRes.json()) as { idToken: string };
    console.log("[OK] ID token obtained");

    // Create session cookie
    const sessionCookie = await auth.createSessionCookie(signInData.idToken, {
      expiresIn: SESSION_MAX_AGE * 1000,
    });
    console.log(`[OK] Session cookie created (${sessionCookie.length} chars)`);

    // Verify
    const decoded = await auth.verifySessionCookie(sessionCookie);
    console.log(`[OK] Session verified — uid: ${decoded.uid}`);

    console.log("\n=== Login flow works! Ready to test in browser ===\n");
  } catch (error) {
    console.error("[ERROR]:", error);
    process.exit(1);
  }
}

main();
