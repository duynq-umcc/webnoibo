/**
 * Seed script — creates admin user(s) in Firebase Authentication.
 * Run once: npx tsx scripts/create-admin-user.ts
 *
 * Prerequisites:
 *   1. Download service account key from Firebase Console:
 *      https://console.firebase.google.com/project/web-noi-bo-umcc1/settings/serviceaccounts
 *      Save as: scripts/service-account.json
 *   2. Base64-encode it:
 *      npx tsx scripts/encode-service-account.ts
 *   3. Add FIREBASE_SERVICE_ACCOUNT_KEY to .env.local
 */

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { readFileSync, existsSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

// Load .env.local
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
}

const PROJECT_ID = "web-noi-bo-umcc1";

async function main() {
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountKey || serviceAccountKey.startsWith("<")) {
    console.error("[FAIL] FIREBASE_SERVICE_ACCOUNT_KEY not set in .env.local");
    console.error("1. npx tsx scripts/encode-service-account.ts");
    console.error("2. Paste output as FIREBASE_SERVICE_ACCOUNT_KEY in .env.local");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(Buffer.from(serviceAccountKey, "base64").toString());
  console.log(`\n=== Firebase Auth Seed ===`);
  console.log(`Project: ${serviceAccount.project_id}\n`);

  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: PROJECT_ID,
    });
  }

  const auth = getAuth();

  interface SeedUser {
    email: string;
    password: string;
    displayName: string;
    title: string;
    department: string;
    role: "admin" | "doctor" | "nurse" | "pharmacist" | "accountant" | "hr" | "reception";
    isBhytDoctor?: boolean;
  }

  const SEED_USERS: SeedUser[] = [
    {
      email: "admin@phongkham.vn",
      password: "admin123",
      displayName: "Nguyen Van Admin",
      title: "Quan tri vien",
      department: "Phong Cong nghe thong tin",
      role: "admin",
    },
  ];

  for (const user of SEED_USERS) {
    try {
      let existingUser;
      try {
        existingUser = await auth.getUserByEmail(user.email);
      } catch {
        existingUser = null;
      }

      const claims = {
        role: user.role,
        title: user.title,
        department: user.department,
        isBhytDoctor: user.isBhytDoctor ?? false,
      };

      if (existingUser) {
        console.log(`[EXISTS] ${user.email} — uid: ${existingUser.uid}`);
        await auth.setCustomUserClaims(existingUser.uid, claims);
        console.log(`  -> claims updated: role=${user.role}`);
      } else {
        const userRecord = await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.displayName,
          emailVerified: true,
        });
        await auth.setCustomUserClaims(userRecord.uid, claims);
        console.log(`[CREATED] ${user.email} — uid: ${userRecord.uid} — role: ${user.role}`);
      }
    } catch (error) {
      console.error(`[ERROR] ${user.email}:`, error);
    }
  }

  console.log("\nDone.\n");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
