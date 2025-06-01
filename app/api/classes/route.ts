import { NextRequest, NextResponse } from "next/server";
import { getUserPageByEmail, getClassesDataFromDatabase } from "@/lib/notion/notion";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const USERS_DB_ID = process.env.NOTION_USERS_DB_ID as string; // Database ID de usuarios en Notion

export async function GET(req: NextRequest) {
  // 1. Verifica autenticación
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

  // 2. Busca el usuario en Notion
  const userPage = await getUserPageByEmail(email, USERS_DB_ID);
  if (!userPage) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  // 3. Obtiene la URL de la base de clases del usuario
  const dbProperty = (userPage as PageObjectResponse).properties["Clases Database"];
  let dbUrl: string | undefined = undefined;
  if (dbProperty.type === "url" && dbProperty.url) {
    dbUrl = dbProperty.url;
  }
  if (!dbUrl) return NextResponse.json({ error: "No hay DB de clases" }, { status: 404 });

  // 4. Extrae el ID de la base de datos de la URL
  const matches = dbUrl.match(/([a-f0-9]{32})/);
  if (!matches) return NextResponse.json({ error: "ID de DB no válido" }, { status: 400 });
  const classesDbId = matches[1];

  // 5. Consulta las clases en Notion
  const classes = await getClassesDataFromDatabase(classesDbId);

  // 6. Filtra solo páginas completas (para asegurar properties)
  const filteredPages = classes.filter(
    (p): p is PageObjectResponse => "properties" in p
  );

  // 7. Transforma los datos con chequeo de tipo
  const mapped = filteredPages.map(page => {
    // Fecha
    const fechaProp = page.properties["Fecha"];
    let date: string | null = null;
    if (fechaProp && fechaProp.type === "date" && fechaProp.date) {
      date = fechaProp.date.start;
    }

    // Título
    const tituloProp = page.properties["Clase"];
    let title = "";
    if (tituloProp && tituloProp.type === "title" && tituloProp.title?.length > 0) {
      title = tituloProp.title[0].plain_text;
    }

    // Estado (traducción)
    const estadoProp = page.properties["Estado"];
    let status = "";
    if (estadoProp && estadoProp.type === "select" && estadoProp.select) {
      switch (estadoProp.select.name) {
        case "Complete":
          status = "Completado";
          break;
        case "Scheduled":
          status = "Programado";
          break;
        case "Pending":
          status = "Pendiente";
          break;
        default:
          status = estadoProp.select.name || "";
      }
    }

    // Nivel
    const nivelProp = page.properties["Nivel"];
    let level = "";
    if (nivelProp && nivelProp.type === "select" && nivelProp.select) {
      level = nivelProp.select.name;
    }

    // Link: ahora SIEMPRE será la URL de la página de Notion (no la columna Enlace)
    const notionPageId = page.id.replace(/-/g, "");
    const link = `https://www.notion.so/${notionPageId}`;

    return {
      date,
      title,
      status,
      level,
      link,
    };
  });

  return NextResponse.json(mapped);
}
