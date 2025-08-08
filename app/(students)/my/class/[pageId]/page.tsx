"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints";

interface RichTextItem {
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
}

// Helper para renderizar rich_text
const renderRichText = (richText: RichTextItem[]) => {
  return richText.map((text: RichTextItem, index: number) => {
    const annotations = text.annotations;
    let style = {};
    if (annotations.bold) style = { ...style, fontWeight: "bold" };
    if (annotations.italic) style = { ...style, fontStyle: "italic" };
    if (annotations.strikethrough) style = { ...style, textDecoration: "line-through" };
    if (annotations.underline) style = { ...style, textDecoration: "underline" };
    if (annotations.code) style = { ...style, fontFamily: "monospace", backgroundColor: "#eee", padding: "2px 4px", borderRadius: "3px" };

    return (
      <span key={index} style={style}>
        {text.href ? (
          <a href={text.href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            {text.plain_text}
          </a>
        ) : (
          text.plain_text
        )}
      </span>
    );
  });
};

// Componente para renderizar bloques de Notion
const NotionBlockRenderer = ({ blocks }: { blocks: BlockObjectResponse[] }) => {
  return (
    <div className="prose prose-invert max-w-none">
      {blocks.map((block) => {
        switch (block.type) {
          case "paragraph":
            return <p key={block.id}>{renderRichText(block.paragraph.rich_text)}</p>;
          case "heading_1":
            return <h1 key={block.id}>{renderRichText(block.heading_1.rich_text)}</h1>;
          case "heading_2":
            return <h2 key={block.id}>{renderRichText(block.heading_2.rich_text)}</h2>;
          case "heading_3":
            return <h3 key={block.id}>{renderRichText(block.heading_3.rich_text)}</h3>;
          case "bulleted_list_item":
            return <li key={block.id}>{renderRichText(block.bulleted_list_item.rich_text)}</li>;
          case "numbered_list_item":
            return <li key={block.id}>{renderRichText(block.numbered_list_item.rich_text)}</li>;
          case "to_do":
            return (
              <div key={block.id} className="flex items-center gap-2">
                <input type="checkbox" checked={block.to_do.checked} readOnly className="form-checkbox text-indigo-600 rounded" />
                <span className={block.to_do.checked ? "line-through text-gray-500" : ""}>
                  {renderRichText(block.to_do.rich_text)}
                </span>
              </div>
            );
          case "toggle":
            return (
              <details key={block.id} className="my-2 p-2 rounded-md bg-gray-700/30">
                <summary className="cursor-pointer font-semibold text-white">
                  {renderRichText(block.toggle.rich_text)}
                </summary>
                {/* El contenido anidado de los toggles no se renderiza en esta versión */}
              </details>
            );
          case "code":
            return (
              <pre key={block.id} className="bg-gray-800 p-4 rounded-md text-sm overflow-x-auto">
                <code className="text-white">
                  {block.code.rich_text.map((text: RichTextItem) => text.plain_text).join("")}
                </code>
              </pre>
            );
          case "image":
            const imageUrl = block.image.type === "file" ? block.image.file.url : block.image.external.url;
            return (
              <div key={block.id} className="my-4">
                <Image src={imageUrl} alt="Notion Image" className="max-w-full h-auto rounded-md" fill={true} />
              </div>
            );
          case "video":
            return (
              <div key={block.id} className="my-4 w-full aspect-video">
                {block.video.type === "external" && block.video.external.url ? (
                  <iframe
                    src={block.video.external.url.replace("watch?v=", "embed/")}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-md"
                  ></iframe>
                ) : block.video.type === "file" && block.video.file.url ? (
                  <video controls src={block.video.file.url} className="w-full h-full rounded-md"></video>
                ) : (
                  <p className="text-red-400 text-sm">Video no soportado o URL no encontrada.</p>
                )}
              </div>
            );
          case "child_page":
            return (
              <div key={block.id} className="my-2 p-3 rounded-md bg-blue-600/20 text-blue-200">
                <p className="font-semibold">Página hija: {block.child_page.title}</p>
                <p className="text-sm">Haz clic para navegar (si la ruta está implementada).</p>
              </div>
            );
          case "unsupported":
            return (
              <p key={block.id} className="text-red-400 text-sm">
                Bloque no soportado: {block.type}
              </p>
            );
          default:
            return (
              <p key={block.id} className="text-gray-500 text-sm">
                Tipo de bloque no renderizado: {block.type}
              </p>
            );
        }
      })}
    </div>
  );
};

export default function ClassPage() {
  const params = useParams();
  const pageId = params.pageId as string;
  const [blocks, setBlocks] = useState<BlockObjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pageId) {
      fetch(`/api/notion/page/${pageId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setBlocks(data);
        })
        .catch((err) => {
          console.error("Error al cargar el contenido de la clase:", err);
          setError("No se pudo cargar el contenido de la clase.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [pageId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#222222]">
        <div className="text-white text-lg animate-pulse">Cargando contenido de la clase...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#222222]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-[#2C2A4A] text-white">
      <h1 className="text-3xl font-bold mb-6">Contenido de la Clase</h1>
      {blocks.length > 0 ? (
        <NotionBlockRenderer blocks={blocks} />
      ) : (
        <p>No hay contenido disponible para esta clase.</p>
      )}
    </div>
  );
}