import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { getMeetingLinkByEmail } from "@/lib/notion/notion";

const USERS_DB_ID = process.env.NOTION_USERS_DB_ID as string; // tu database id de usuarios

export async function GET(req: NextRequest) {
  // Verifica autenticación
  const token = req.cookies.get("authToken")?.value;
  if (!token) return NextResponse.json({ error: "No auth" }, { status: 401 });

  let email: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    if (!decoded.email) {
      return NextResponse.json({ error: "No se pudo obtener el email del usuario" }, { status: 400 });
    }
    email = decoded.email;
  } catch (err) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  // Obtiene el meeting_link
  const link = await getMeetingLinkByEmail(email, USERS_DB_ID);
  if (!link) {
    return NextResponse.json({ error: "No se encontró el link de reunión" }, { status: 404 });
  }

  return NextResponse.json({ meeting_link: link });
}
