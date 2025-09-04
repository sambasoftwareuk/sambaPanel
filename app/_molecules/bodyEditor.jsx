"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import EditButton from "../_atoms/EditButton";
import { useEditSession } from "../_context/EditSessionContext";

export default function BodyEditor({
  initialHtml = "",
  initialJson = null,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const { draft, setField, setFields } = useEditSession();


  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow" },
      }),
      TextAlign.configure({ types: ["paragraph"] }),
    ],
    content: "", // SSR uyuşmazlığı olmasın
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[240px] focus:outline-none px-3 py-2",
      },
    },
    immediatelyRender: false, // << SSR hatalarını önler
  });

  // Modal açıldığında draft veya initial'dan yükle
  useEffect(() => {
    if (!editor || !mounted || !open) return;
    const html = draft.content_html ?? initialHtml ?? "<p></p>";
    const json = draft.content_json ?? initialJson;
    if (json) editor.commands.setContent(json);
    else editor.commands.setContent(html, true);
  }, [editor, mounted, open, draft, initialHtml, initialJson]);

    function apply() {
    if (!editor) return;
    const html = editor.getHTML();
    const json = editor.getJSON();
-   setField("content_html", html);
-   setField("content_json", json);
+   setFields({ content_html: html, content_json: json });
    setOpen(false);
  }


  function Btn({ onClick, active, children, title }) {
    return (
      <button
        type="button"
        title={title}
        onClick={onClick}
        className={`px-2 py-1 rounded border text-sm mr-1 mb-1 ${
          active ? "bg-gray-200" : "hover:bg-gray-50"
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <>
      <EditButton onClick={() => setOpen(true)} className={className} size="small" />

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">İçeriği Düzenle</h2>
              <button onClick={() => setOpen(false)} className="rounded border px-3 py-1 text-sm">
                ✖
              </button>
            </div>

            {editor && (
              <div className="mb-2 flex flex-wrap">
                <Btn title="Kalın" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>B</Btn>
                <Btn title="İtalik" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>I</Btn>
                <Btn title="H2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
                <Btn title="H3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>
                <Btn title="• Liste" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Btn>
                <Btn title="1. Liste" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Btn>
                <Btn title="Alıntı" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</Btn>
                <Btn title="Bağlantı" onClick={() => {
                  const url = prompt("Bağlantı URL");
                  if (!url) return;
                  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                }}>🔗</Btn>
                <Btn title="Bağlantıyı Kaldır" onClick={() => editor.chain().focus().unsetLink().run()}>🔗✖</Btn>
                <Btn title="Temizle" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>Temizle</Btn>
                <Btn title="Sola Hizala" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>⬅</Btn>
                <Btn title="Ortala" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>⬍</Btn>
                <Btn title="Sağa Hizala" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>➡</Btn>
                <Btn title="İki Yana Yasla" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()}>⬌</Btn>
              </div>
            )}

            <div className="border rounded">
              {editor ? (
                <EditorContent editor={editor} />
              ) : (
                <div className="p-3 text-sm text-gray-500">Yükleniyor…</div>
              )}
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded border px-3 py-1">
                Vazgeç
              </button>
              <button onClick={apply} className="rounded bg-black px-3 py-1 text-white">
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
