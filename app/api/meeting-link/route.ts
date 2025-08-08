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
    console.error("Error al verificar el token de Firebase:", err);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  if (!USERS_DB_ID) {
    console.error("NOTION_USERS_DB_ID no está configurado.");
    return NextResponse.json({ error: "Configuración de Notion incompleta" }, { status: 500 });
  }

  // Obtiene el meeting_link
  try {
    const link = await getMeetingLinkByEmail(email, USERS_DB_ID);
    if (!link) {
      return NextResponse.json({ meeting_link: null }, { status: 200 }); // Devuelve null si no hay link, no 404
    }
    return NextResponse.json({ meeting_link: link });
  } catch (error) {
    console.error("Error al obtener el meeting link de Notion:", error);
    return NextResponse.json({ error: "Error al consultar Notion" }, { status: 500 });
  }
}
