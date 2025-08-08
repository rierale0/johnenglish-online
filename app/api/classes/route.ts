import { NextRequest, NextResponse } from "next/server";
import { getClassesDataFromDatabase } from "@/lib/notion/notion";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const CLASSES_DB_ID = "23b61211622b806da470f3c3d0d9ae07";

export async function GET(req: NextRequest) {
  // 1. Verifica autenticación
  const token = req.cookies.get("authToken")?.value;
  if (!token) return NextResponse.json({ error: "No auth" }, { status: 401 });

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch (_) {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }

  // 2. Consulta las clases en Notion filtrando por user_id
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

  // 3. Filtra solo páginas completas (para asegurar properties)
  const filteredPages = classes.filter(
    (p): p is PageObjectResponse => "properties" in p
  );

  // 4. Transforma los datos con chequeo de tipo
  const mapped = filteredPages.map(page => {
    const properties = page.properties;

    const datetimeProp = properties["datetime"];
    const datetime = datetimeProp?.type === "date" ? datetimeProp.date?.start : null;

    const classTitleProp = properties["class_title"];
    const class_title = classTitleProp?.type === "title" ? classTitleProp.title[0]?.plain_text : "";

    const recordingProp = properties["recording"];
    const recording = recordingProp?.type === "url" ? recordingProp.url : null;

    const statusProp = properties["status"];
    const status = statusProp?.type === "select" ? statusProp.select?.name : "";
    
    const courseProp = properties["course"];
    const course = courseProp?.type === "select" ? courseProp.select?.name : "";

    const modeProp = properties["mode"];
    const mode = modeProp?.type === "select" ? modeProp.select?.name : "";

    const icon = page.icon && page.icon.type === "emoji" ? page.icon.emoji : null;

    return {
      page_id: page.id,
      datetime,
      class_title,
      recording,
      status,
      course,
      mode,
      icon,
    };
  });

  return NextResponse.json(mapped);
}
