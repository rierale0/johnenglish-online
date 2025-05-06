"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";

import Editor, { createYooptaEditor, YooptaContentValue } from "@yoopta/editor";

// Plugins
import Paragraph from "@yoopta/paragraph";
import Blockquote from "@yoopta/blockquote";
import Embed from "@yoopta/embed";
import Image from "@yoopta/image";
import Link from "@yoopta/link";
import Callout from "@yoopta/callout";
import Video from "@yoopta/video";
import File from "@yoopta/file";
import { HeadingOne, HeadingTwo, HeadingThree } from "@yoopta/headings";
import { BulletedList, NumberedList, TodoList } from "@yoopta/lists";
import Code from "@yoopta/code";

// Tools & marks
import ActionMenuList, {
  DefaultActionMenuRender,
} from "@yoopta/action-menu-list";
import Toolbar, { DefaultToolbarRender } from "@yoopta/toolbar";
import LinkTool, { DefaultLinkToolRender } from "@yoopta/link-tool";
import {
  Bold,
  Italic,
  CodeMark,
  Underline,
  Strike,
  Highlight,
} from "@yoopta/marks";

import EmojiPicker from "emoji-picker-react";
import { db, auth } from "@/lib/firebase/firebase-client";

/** Normaliza la estructura de bloques para asegurarse de que siempre tengan `elements: []` */
function normalizeBlocks(raw: Record<string, any>): YooptaContentValue {
  return Object.fromEntries(
    Object.entries(raw || {}).map(([id, blk]) => [
      id,
      {
        ...blk,
        elements: Array.isArray(blk.elements) ? blk.elements : [],
        value: Array.isArray(blk.value) ? blk.value : [],
      },
    ])
  );
}

function deepSanitize(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepSanitize);
  } else if (obj !== null && typeof obj === "object") {
    const cleaned: Record<string, any> = {};
    for (const key in obj) {
      const value = obj[key];
      if (value !== undefined) {
        cleaned[key] = deepSanitize(value);
      }
    }
    return cleaned;
  }
  return obj;
}

export default function PageEditor() {
  const [editor] = useState(() => createYooptaEditor());
  const [blocks, setBlocks] = useState<YooptaContentValue>({});
  const [uid, setUid] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [title, setTitle] = useState("Untitled Page");
  const [icon, setIcon] = useState("📄");
  const [coverImage, setCoverImage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Referencia al último estado guardado para evitar bucles
  const lastSavedRef = useRef<{
    title: string;
    icon: string;
    coverImage: string;
    blocks: YooptaContentValue;
  } | null>(null);

  const tools = useMemo(
    () => ({
      ActionMenu: { render: DefaultActionMenuRender, tool: ActionMenuList },
      Toolbar: { render: DefaultToolbarRender, tool: Toolbar },
      LinkTool: { render: DefaultLinkToolRender, tool: LinkTool },
    }),
    []
  );

  // Carga inicial y suscripción a Firestore
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUid(null);
        setReady(false);
        return;
      }
      const uidLocal = user.uid;
      setUid(uidLocal);
      const pageRef = doc(db, "pages", uidLocal);

      // const snap = await getDoc(pageRef);
      // if (!snap.exists()) {

      // const initialBlocks = createParagraphBlock("👋 ¡Bienvenido a tu espacio de notas!");

      //   const initial = {
      //     title: "Untitled Page",
      //     icon: "📄",
      //     coverImage: "",
      //     createdAt: serverTimestamp(),
      //     updatedAt: serverTimestamp(),
      //     initialBlocks,
      //   };
      //   await setDoc(pageRef, initial);
      // }

      // Listener en tiempo real
      const unsubSnap = onSnapshot(pageRef, (snap) => {
        const data = snap.data()!;
        setTitle(data.title);
        setIcon(data.icon);
        setCoverImage(data.coverImage);
        setBlocks(normalizeBlocks(data.blocks));
        setReady(true);
      });

      return () => unsubSnap();
    });

    return () => unsubAuth();
  }, [editor]);

  // Función de guardado real
  const doSave = useCallback(
    (
      newBlocks: YooptaContentValue,
      meta: { title: string; icon: string; coverImage: string }
    ) => {
      if (!uid) return;
      const payload = {
        title: meta.title,
        icon: meta.icon,
        coverImage: meta.coverImage,
        blocks: deepSanitize(normalizeBlocks(newBlocks)),
      };
      // Evita guardar si no hay cambios
      if (lastSavedRef.current && isEqual(lastSavedRef.current, payload))
        return;
      lastSavedRef.current = payload;

      setSaving(true);
      setDoc(doc(db, "pages", uid), payload, { merge: false })
        .then(() => {
          setSaving(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        })
        .catch((err) => {
          console.error("Save failed:", err);
          setSaving(false);
        });
    },
    [uid]
  );

  // Debounce para coalescer cambios
  const debouncedSave = useMemo(() => debounce(doSave, 3000), [doSave]);

  // Handler de cambios en bloques
  const handleBlocksChange = (newBlocks: YooptaContentValue) => {
    setBlocks(newBlocks);
    debouncedSave(newBlocks, { title, icon, coverImage });
  };

  // Cuando cambia título, icono o cover, también dispara guardado
  useEffect(() => {
    if (ready) debouncedSave(blocks, { title, icon, coverImage });
  }, [title, icon, coverImage]);

  if (!ready) return <p className="p-4 text-white">Cargando editor…</p>;

  return (
    <div className="yoopta-editor w-full h-screen bg-zinc-900 text-white overflow-auto">
      <div className="w-full max-w-[90ch] mx-auto px-4 py-10 relative">
        {/* Cover Image */}
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="rounded-xl mb-4 max-h-60 w-full object-cover"
          />
        )}

        {/* Título e ícono */}
        <div className="flex items-center gap-4 mb-6 relative">
          <button
            onClick={() => setShowEmojiPicker((p) => !p)}
            className="text-3xl hover:scale-110 transition-transform"
          >
            {icon}
          </button>
          <textarea
            className="bg-transparent text-white text-3xl font-bold w-full resize-none outline-none leading-tight"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            rows={1}
          />
          {showEmojiPicker && (
            <div className="absolute z-50 mt-2">
              <div
                ref={(node) => {
                  // Handle click outside to close emoji picker
                  const handleClickOutside = (e: MouseEvent) => {
                    if (node && !node.contains(e.target as Node)) {
                      setShowEmojiPicker(false);
                    }
                  };

                  if (node) {
                    document.addEventListener("mousedown", handleClickOutside);
                  }

                  return () => {
                    document.removeEventListener(
                      "mousedown",
                      handleClickOutside
                    );
                  };
                }}
              >
                <EmojiPicker
                  onEmojiClick={(e) => {
                    setIcon(e.emoji);
                    setShowEmojiPicker(false);
                  }}
                  style={{
                    position: "absolute",
                    zIndex: 9999,
                    top: "100%",
                    left: "0",
                    marginTop: "24px",
                  }}
                  theme={"dark" as any}
                />
              </div>
            </div>
          )}
        </div>

        {/* Indicador de guardado */}
        {(saving || saved) && (
          <div className="absolute top-4 right-4 bg-zinc-800 px-3 py-1 rounded-md text-sm shadow">
            {saving ? "Saving…" : "Saved"}
          </div>
        )}

        {/* Editor principal */}
        <Editor
          editor={editor}
          plugins={[
            Paragraph,
            HeadingOne,
            HeadingTwo,
            HeadingThree,
            Blockquote,
            Callout,
            Code,
            Link,
            NumberedList,
            BulletedList,
            TodoList,
            Embed,
            Image.extend({
              options: {
                async onUpload(file) {
                  return {
                    src: URL.createObjectURL(file),
                    width: 500,
                    height: 300,
                  };
                },
              },
            }),
            Video.extend({
              options: {
                async onUpload(file) {
                  return {
                    src: URL.createObjectURL(file),
                    width: 500,
                    height: 300,
                  };
                },
              },
            }),
            File.extend({
              options: {
                async onUpload(file) {
                  return {
                    src: URL.createObjectURL(file),
                    name: file.name,
                    size: file.size,
                  };
                },
              },
            }),
          ]}
          marks={[Bold, Italic, CodeMark, Underline, Strike, Highlight]}
          tools={tools}
          value={blocks}
          onChange={handleBlocksChange}
          placeholder="Presiona / para comandos"
          readOnly={false}
        />
      </div>
    </div>
  );
}
