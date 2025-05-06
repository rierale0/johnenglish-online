// app/api/pages/read/route.ts
import { NextResponse } from "next/server";
import { adminDb }      from "@/lib/firebase/firebase-admin";

export async function GET(req: Request) {
  const uid = new URL(req.url).searchParams.get("uid");
  if (!uid) {
    return NextResponse.json({ error: "Falta uid" }, { status: 400 });
  }

  const snap = await adminDb.collection("pages").doc(uid).get();
  if (!snap.exists) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }

  const data = snap.data()!;
  const rawBlocks: Record<string, any> = data.blocks || {};

  // Asegúrate de que todos los bloques tengan `elements: []`
  const normalizedBlocks = Object.fromEntries(
    Object.entries(rawBlocks).map(([key, block]) => [
      key,
      {
        elements: [],               // si no existía, se crea vacío
        ...block,
      },
    ])
  );

  return NextResponse.json({ blocks: normalizedBlocks });
}
