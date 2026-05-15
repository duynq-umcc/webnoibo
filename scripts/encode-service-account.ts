/**
 * Encode service-account.json to base64 for FIREBASE_SERVICE_ACCOUNT_KEY env var.
 * Run: npx tsx scripts/encode-service-account.ts
 *
 * Reads: scripts/service-account.json
 * Output: base64 string to put in .env.local as FIREBASE_SERVICE_ACCOUNT_KEY
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const SERVICE_ACCOUNT_PATH = resolve(__dirname, "../scripts/service-account.json");

try {
  const json = readFileSync(SERVICE_ACCOUNT_PATH, "utf8");
  const base64 = Buffer.from(json).toString("base64");
  console.log("\n=== Base64 encoded service account ===\n");
  console.log(base64);
  console.log("\nAdd this to .env.local:\n");
  console.log(`FIREBASE_SERVICE_ACCOUNT_KEY=${base64}`);
  console.log("\nOr run with env var:\n");
  console.log(`FIREBASE_SERVICE_ACCOUNT_KEY=${base64} npx tsx scripts/test-session.ts`);
} catch {
  console.error(`ERROR: Cannot read ${SERVICE_ACCOUNT_PATH}`);
  console.error("Download from: Firebase Console > Project Settings > Service Accounts > Generate new private key");
  console.error("Save as: scripts/service-account.json");
  process.exit(1);
}
