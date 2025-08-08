import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { notion } from "@/lib/notion/notion";
import { getClassesDataFromDatabase } from "@/lib/notion/notion";

const CLASSES_DB_ID = "23b61211622b806da470f3c3d0d9ae07";

export async function GET(
  req: NextRequest,
  params: { params: { pageId: string } }
) {
  const pageId = params.params.pageId;
  console.log("Solicitud para pageId:", pageId);

  // 1. Verifica autenticación
  const token = req.cookies.get("authToken")?.value;
  if (!token) return NextResponse.json({ error: "No auth" }, { status: 401 });

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
    console.log("UID del usuario autenticado:", uid);
  } catch (err) {
    console.error("Error al verificar el token de Firebase:", err);
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  // 2. Verifica que el usuario tenga acceso a esta clase
  try {
    const classes = await getClassesDataFromDatabase(CLASSES_DB_ID, {
      property: "user_id",
      rollup: {
        every: {
          rich_text: {
            equals: uid,
          },
        },
      },
    });
    console.log("Clases recuperadas para el usuario:", classes.map((cls: { id: string }) => cls.id));

    const hasAccess = classes.some((cls: { id: string }) => cls.id === pageId);
    console.log("El usuario tiene acceso a esta página?", hasAccess);

    if (!hasAccess) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }
  } catch (error) {
    console.error("Error al verificar el acceso a la clase:", error);
    return NextResponse.json(
      { error: "Error al verificar el acceso" },
      { status: 500 }
    );
  }

  // 3. Obtiene los bloques de la página de Notion
  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    return NextResponse.json(response.results);
  } catch (error) {
    console.error("Error al obtener bloques de Notion:", error);
    return NextResponse.json(
      { error: "Error al obtener el contenido de la clase" },
      { status: 500 }
    );
  }
}