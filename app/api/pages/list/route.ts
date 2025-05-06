// app/api/pages/list/route.ts
import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/firebase-admin'

export async function GET(req: Request) {
  // aquí podrías validar que el request provenga de un admin
  const snapshot = await adminDb.collection('pages').get()
  const all = snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }))
  return NextResponse.json({ pages: all })
}
