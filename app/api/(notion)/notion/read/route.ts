// app/api/notion/read/route.ts
import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
const notion = new Client({ auth: process.env.NOTION_API_KEY })

async function getBlocksRecursively(id: string): Promise<any[]> {
  const all: any[] = []
  let cursor: string|undefined
  do {
    const { results, next_cursor, has_more } = await notion.blocks.children.list({
      block_id: id,
      start_cursor: cursor,
      page_size: 50,
    })
    all.push(...results)
    cursor = has_more ? next_cursor as string : undefined
  } while (cursor)

  for (const b of all) {
    if (b.has_children) {
      // @ts-ignore
      b.children = await getBlocksRecursively(b.id)
    }
  }
  return all
}

export async function GET(req: Request) {
  const pageId = new URL(req.url).searchParams.get('pageId')
  if (!pageId) return NextResponse.json({ error: 'Falta pageId' }, { status: 400 })
  const blocks = await getBlocksRecursively(pageId)
  return NextResponse.json({ blocks })
}
