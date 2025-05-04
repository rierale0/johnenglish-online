// app/api/notion/update/route.ts
import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'
const notion = new Client({ auth: process.env.NOTION_API_KEY })

export async function POST(req: Request) {
  const { pageId, document } = await req.json()
  // document es el JSON de TipTap
  // Aquí sólo actualizamos párrafos sencillos como ejemplo
  for (const node of document.content || []) {
    if (node.type === 'paragraph' && node.attrs?.notionBlockId) {
      await notion.blocks.update({
        block_id: node.attrs.notionBlockId,
        paragraph: {
          rich_text: node.content.map((textNode: any) => ({
            type: 'text',
            text: { content: textNode.text || '' }
          }))
        }
      })
    }
  }
  return NextResponse.json({ ok: true })
}
