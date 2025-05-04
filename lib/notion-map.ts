// lib/notion-map.ts
export function notionBlocksToTiptapDocument(blocks: any[]): any {
    return {
      type: 'doc',
      content: blocks.map(b => {
        if (b.type === 'paragraph') {
          return {
            type: 'paragraph',
            attrs: { notionBlockId: b.id },
            content: b.paragraph.rich_text.map((rt: any) => ({
              type: 'text',
              text: rt.plain_text
            }))
          }
        }
        // añadir más tipos: heading_1, bulleted_list_item, image, etc.
        return { type: 'paragraph', content: [] }
      })
    }
  }
  