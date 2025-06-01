import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({ auth: process.env.NOTION_API_KEY });

export async function getUserPageByEmail(email: string, usersDbId: string) {
  const response = await notion.databases.query({
    database_id: usersDbId,
    filter: {
      property: "Email",
      rich_text: { equals: email }
    }
  });
  return response.results[0]; // Puede ser undefined si no hay match
}

export async function getClassesDataFromDatabase(databaseId: string) {
  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [{ property: "Fecha", direction: "descending" }]
  });
  return response.results;
}

export async function getMeetingLinkByEmail(email: string, usersDbId: string): Promise<string | null> {
    const response = await notion.databases.query({
      database_id: usersDbId,
      filter: {
        property: "Email",
        rich_text: { equals: email }
      }
    });
    const userPage = response.results[0] as PageObjectResponse | undefined;
    if (!userPage) return null;
  
    const meetingProp = userPage.properties["meeting_link"];
    if (meetingProp && meetingProp.type === "url" && meetingProp.url) {
      return meetingProp.url;
    }
    return null;
  }