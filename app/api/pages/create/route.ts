// app/api/pages/create/route.ts
import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/firebase-admin'

export async function POST(req: Request) {
  // esperaba JSON { uid }
  const { uid } = await req.json()
  if (!uid) return NextResponse.json({ error: 'Falta uid' }, { status: 400 })

  const docRef = adminDb.collection('pages').doc(uid)
  const doc = await docRef.get()
  if (doc.exists) return NextResponse.json({ ok: true })

  // Crea página en blanco
  await docRef.set({
    createdAt: Date.now(),
    blocks: [],    // Yoopta arranca con doc vacío
    owner: uid,
  })
  return NextResponse.json({ ok: true })
}
