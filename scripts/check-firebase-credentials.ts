/**
 * Check if Firebase Admin credentials are properly configured.
 * Run: npx tsx scripts/check-firebase-credentials.ts
 */

import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

console.log("\n=== Firebase Admin Credentials Check ===\n");

console.log("1. Environment:");
console.log("   GOOGLE_CLOUD_PROJECT:", process.env.GOOGLE_CLOUD_PROJECT ?? "(not set)");
console.log("   FIREBASE_ADMIN_PROJECT_ID:", process.env.FIREBASE_ADMIN_PROJECT_ID ?? "(not set)");
console.log("   GOOGLE_APPLICATION_CREDENTIALS:", process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "(not set)");

async function main() {
  try {
    if (!getApps().length) {
      initializeApp({
        credential: applicationDefault(),
        projectId: "web-noi-bo-umcc1",
      });
    }

    const auth = getAuth();
    console.log("\n2. [OK] Firebase Admin initialized");

    const result = await auth.listUsers(1);
    console.log(`3. [OK] listUsers() succeeded — ${result.users.length} user(s) visible`);
    console.log("\n=== All checks passed — login flow should work ===\n");
  } catch (error) {
    console.error("\n2. [FAIL] Firebase Admin error:");
    console.error(error);
    console.log("\n=== Fix required ===");
    console.log("Option A: gcloud auth application-default login");
    console.log("  (use Google account with Firebase Admin role on web-noi-bo-umcc1)");
    console.log("");
    console.log("Option B: Download service account JSON and set env var:");
    console.log("  GOOGLE_APPLICATION_CREDENTIALS=./path/to/key.json npx tsx scripts/check-firebase-credentials.ts");
    console.log("  (Download from: Firebase Console > Project Settings > Service Accounts > Generate key)\n");
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
