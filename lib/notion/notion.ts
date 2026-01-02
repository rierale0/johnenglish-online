import { Client } from "@notionhq/client";

export const notion = new Client({ auth: process.env.NOTION_API_KEY });

/**
 * A generic and robust function to query a Notion database.
 * @param {string} databaseId - The ID of the database to query.
 * @param {object} [filter] - Optional: A valid Notion API filter object.
 * @param {object[]} [sorts] - Optional: A valid Notion API sorts array.
 * @returns {Promise<any[]>} - A promise that resolves to the array of page results.
 */
export async function queryDatabase(databaseId: string, filter?: any, sorts?: any[]) {
  try {
    const queryPayload: any = {
      database_id: databaseId,
    };
    if (filter) {
      queryPayload.filter = filter;
    }
    if (sorts) {
      queryPayload.sorts = sorts;
    }
    const response = await notion.databases.query(queryPayload);
    return response.results;
  } catch (error) {
    console.error("Error querying Notion database:", error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}
