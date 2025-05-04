// app/api/user-notion-page/route.ts
import { NextResponse } from 'next/server'
import { getPageIdFromUID } from '@/lib/firebase/firebase-db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const uid = searchParams.get('uid')
  if (!uid) return NextResponse.json({ error: 'Falta uid' }, { status: 400 })

  const pageId = await getPageIdFromUID(uid)
  if (!pageId) return NextResponse.json({ error: 'No se encontró página' }, { status: 404 })

  return NextResponse.json({ pageId })
}
