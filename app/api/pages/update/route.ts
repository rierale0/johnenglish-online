// app/api/pages/update/route.ts
import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase/firebase-admin'

export async function POST(req: Request) {
  const { uid, blocks } = await req.json()
  if (!uid || !Array.isArray(blocks)) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  await adminDb.collection('pages').doc(uid).update({
    blocks,
    updatedAt: Date.now(),
  })
  return NextResponse.json({ ok: true })
}
