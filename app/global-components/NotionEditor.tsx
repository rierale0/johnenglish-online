'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExtension from '@tiptap/extension-image'
import LinkExtension from '@tiptap/extension-link'
import { notionBlocksToTiptapDocument } from '@/lib/notion-map'

export default function NotionEditor({ blocks, pageId }: { blocks: any[], pageId: string }) {
  const doc = notionBlocksToTiptapDocument(blocks)

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension,
    ],
    content: doc,
  })

  const save = async () => {
    if (!editor) return
    const document = editor.getJSON()
    await fetch('/api/notion/update', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ pageId, document })
    })
    alert('Guardado en Notion 👍')
  }

  return (
    <div>
      <div className="mb-2">
        <button onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4 border rounded"/>
    </div>
  )
}
