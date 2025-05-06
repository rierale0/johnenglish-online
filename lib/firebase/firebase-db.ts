// lib/firebase-db.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
)

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  })
}

export const db = getFirestore()

export async function getPageIdFromUID(uid: string): Promise<string | null> {
  const doc = await db.collection('estudiantes').doc(uid).get()
  return doc.exists ? (doc.data()?.notionPageId as string) : null
}
