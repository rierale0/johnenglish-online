export function createParagraphBlock(text: string, order = 0) {
  const blockId = crypto.randomUUID();
  const textId = crypto.randomUUID();

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