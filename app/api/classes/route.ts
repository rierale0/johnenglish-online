import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/lib/notion/notion";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const CLASSES_DB_ID = "23b61211622b806da470f3c3d0d9ae07";

export async function GET(req: NextRequest) {
  // 1. Verify authentication
  const token = req.cookies.get("authToken")?.value;
  if (!token) return NextResponse.json({ error: "No auth" }, { status: 401 });

  let uid: string;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    uid = decoded.uid;
  } catch (_) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  // 2. Query Notion classes, filtering by user_id and sorting by date
  const filter = {
    property: "user_id",
    rollup: {
      every: {
        rich_text: {
          equals: uid,
        },
      },
    },
  };

  const sorts = [{ property: "Fecha", direction: "descending" }];

  try {
    const classes = await queryDatabase(CLASSES_DB_ID, filter, sorts);

    // If no classes are found for the user, return a specific response
    if (classes.length === 0) {
      return NextResponse.json({ hasAccess: false }, { status: 200 });
    }

    // 3. Filter and map data
    const filteredPages = classes.filter(
      (p): p is PageObjectResponse => "properties" in p
    );

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
  } catch (error) {
    // The error is already logged by queryDatabase
    return NextResponse.json({ error: "Failed to fetch classes from database." }, { status: 500 });
  }
}