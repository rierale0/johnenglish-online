import { v4 as uuidv4 } from "uuid";

export function createParagraphBlock(text: string, order = 0) {
  const blockId = uuidv4();
  const textId = uuidv4();

  return {
    [blockId]: {
      id: blockId,
      type: "paragraph",
      elements: [], // 👈 no lo olvides
      value: [
        {
          id: textId,
          type: "paragraph",
          children: [{ text }],
        }
      ],
      meta: {
        align: "left",
        order,
        depth: 0,
        type: "Paragraph"
      },
    },
  };
}