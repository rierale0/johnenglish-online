// lib/firebase-admin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Tu serviceAccount.json en /lib (añádelo a .gitignore)
import serviceAccount from './serviceAccount.json'

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  })
}

export const adminDb = getFirestore()
