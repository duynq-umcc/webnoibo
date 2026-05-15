import { initializeApp, getApps, applicationDefault, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

function getAdminApp() {
  if (getApps().length > 0) return getApps()[0]

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    'web-noi-bo-umcc1'

  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

  // Local dev: use service account JSON if provided via env
  const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  if (serviceAccountKey && serviceAccountKey !== '<base64 cua file JSON service account>') {
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountKey, 'base64').toString()
    )
    return initializeApp({
      credential: cert(serviceAccount),
      projectId,
      storageBucket,
    })
  }

  // Production (Cloud Run, etc.): use Application Default Credentials
  return initializeApp({
    credential: applicationDefault(),
    projectId,
    storageBucket,
  })
}

const adminApp = getAdminApp()
export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)
export const adminStorage = getStorage(adminApp)
