import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/lib/notion/notion";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const USERS_DB_ID = "1ce61211622b808ea9cdde21996efc3a";

export async function GET(req: NextRequest) {
  console.log("API Route /api/meeting-link invoked (v3 - Hybrid Logic).");

  // 1. Authenticate user
  const token = req.cookies.get("authToken")?.value;
  if (!token) return NextResponse.json({ error: "Authentication token not found." }, { status: 401 });

  let email: string | undefined;
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    email = decodedToken.email;
    if (!email) throw new Error("Email not found in token.");
  } catch (error) {
    return NextResponse.json({ error: "Invalid authentication token." }, { status: 401 });
  }

  try {
    // STEP 1: Query the Users DB to get BOTH the meeting link and the classes DB URL
    console.log(`Step 1: Looking for user ${email} in Users DB ${USERS_DB_ID}`);
    const userFilter = { property: "Email", email: { equals: email } };
    const userResults = await queryDatabase(USERS_DB_ID, userFilter);

    if (userResults.length === 0) {
      return NextResponse.json({ error: "User not found in users database." }, { status: 404 });
    }

    const userPage = userResults[0] as PageObjectResponse;
    const userProperties = userPage.properties;

    // Extract the static meeting link for the user
    const meetingLinkProp = userProperties["Meeting link"];
    const meeting_link = (meetingLinkProp?.type === "url" && meetingLinkProp.url) ? meetingLinkProp.url : null;

    if (!meeting_link) {
        return NextResponse.json({ error: "User found, but no meeting link is assigned to them in the users database." }, { status: 404 });
    }

    // Extract the URL for the personal classes DB
    const classesProp = userProperties["Classes"];
    if (classesProp?.type !== 'url' || !classesProp.url) {
      return NextResponse.json({ error: "Could not find a valid URL in the 'Classes' property for this user." }, { status: 404 });
    }
    const classesDbUrl = classesProp.url;
    const classesDbId = classesDbUrl.split('/').pop()?.split('?')[0];
    if (!classesDbId) {
        return NextResponse.json({ error: "Could not parse a valid Database ID from the 'Classes' URL." }, { status: 500 });
    }

    // STEP 2: Find the next scheduled class in the user's personal database
    console.log(`Step 2: Found Classes DB ID: ${classesDbId}. Searching for next scheduled class.`);
    const now = new Date().toISOString();
    const classesFilter = {
        and: [
            { property: "Estado", select: { equals: "Agendada" } },
            { property: "Fecha", date: { on_or_after: now } }
        ]
    };
    const classesSorts = [{ property: "Fecha", direction: "ascending" as const }];
    const classesResults = await queryDatabase(classesDbId, classesFilter, classesSorts);

    if (classesResults.length === 0) {
        console.log("No upcoming scheduled classes found. Returning link with no class details.");
        return NextResponse.json({ meeting_link, class_title: null, datetime: null });
    }

    // STEP 3: Extract details from the found class
    console.log("Step 3: Found next scheduled class. Extracting details.");
    const nextClassPage = classesResults[0] as PageObjectResponse;
    const classProperties = nextClassPage.properties;

    const classTitleProp = classProperties["Clase"];
    const class_title = (classTitleProp?.type === "title" && classTitleProp.title[0]?.plain_text) ? classTitleProp.title[0].plain_text : "Próxima Clase";

    const dateTimeProp = classProperties["Fecha"];
    const datetime = (dateTimeProp?.type === "date" && dateTimeProp.date?.start) ? dateTimeProp.date.start : null;

    return NextResponse.json({
        meeting_link,
        class_title,
        datetime,
    });

  } catch (error) {
    console.error("An error occurred during the hybrid class fetch:", error);
    return NextResponse.json({ error: "A server error occurred." }, { status: 500 });
  }
}