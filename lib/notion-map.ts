import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function notionBlocksToTiptapDocument(blocks: BlockObjectResponse[]) {
  const content = blocks.map(block => {
    switch (block.type) {
      case 'paragraph':
        return {
          type: 'paragraph',
          content: block.paragraph.rich_text.map(text => ({
            type: 'text',
            text: text.plain_text,
          })),
        };
      // Add other block types here
      default:
        return null;
    }
  }).filter(Boolean) as any[];

  return {
    type: 'doc',
    content,
  };
}