/**
 * Reset password cho admin user.
 * Run: npx tsx scripts/reset-admin-password.ts
 */

import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    projectId: "web-noi-bo-umcc1",
  });
}

const auth = getAuth();

const EMAIL = "admin@phongkham.vn";
const NEW_PASSWORD = "admin123";

async function main() {
  try {
    const user = await auth.getUserByEmail(EMAIL);
    console.log(`[FOUND] ${EMAIL} — uid: ${user.uid}`);
    console.log(`  displayName: ${user.displayName}`);
    console.log(`  emailVerified: ${user.emailVerified}`);
    console.log(`  disabled: ${user.disabled}`);

    await auth.updateUser(user.uid, { password: NEW_PASSWORD });
    console.log(`[OK] Password reset to: ${NEW_PASSWORD}`);
  } catch (error) {
    console.error(`[ERROR]:`, error);
  }

  process.exit(0);
}

main();
