// app/_molecules/BodyEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";

export default function BodyEditor({
  pageId,
  locale = "tr-TR",
  initialHtml = "",
  initialJson = null, // DB'den JSON geliyorsa geçir
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow" },
      }),
      TextAlign.configure({
        types: ["paragraph"], // hangi tiplerde hizalama çalışsın
      }),
    ],
    content: "", // SSR mismatch olmaması için boş başla
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[240px] focus:outline-none px-3 py-2",
      },
    },
    immediatelyRender: false, // <<< ÖNEMLİ: SSR hatasını engeller
  });

  // Modal açıldığında veya editor hazır olduğunda içeriği set et
  useEffect(() => {
    if (!editor || !mounted || !open) return;
    if (initialJson) editor.commands.setContent(initialJson);
    else editor.commands.setContent(initialHtml || "<p></p>", true);
  }, [editor, mounted, open]); // open: modal açılınca içerik yükle

  async function save() {
    if (!editor) return;
    setSaving(true);
    setError("");
    try {
      const html = editor.getHTML();
      const json = editor.getJSON();

      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          content_html: html,
          content_json: json,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Kaydedilemedi");
      }
      setOpen(false);
      // İstersen: const { refresh } = useRouter(); refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
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
      <button
        className={`ml-2 inline-flex items-center rounded-md border px-2 py-1 text-sm hover:bg-gray-50 ${className}`}
        onClick={() => setOpen(true)}
        title="Metni düzenle"
        aria-label="Metni düzenle"
      >
        ✍️
      </button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">İçeriği Düzenle</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-2 py-1 text-sm"
              >
                ✖
              </button>
            </div>

            {/* Toolbar */}
            {editor && (
              <div className="mb-2 flex flex-wrap">
                <Btn
                  title="Kalın"
                  active={editor.isActive("bold")}
                  onClick={() => editor.chain().focus().toggleBold().run()}
                >
                  B
                </Btn>
                <Btn
                  title="İtalik"
                  active={editor.isActive("italic")}
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                  I
                </Btn>
                <Btn
                  title="H2"
                  active={editor.isActive("heading", { level: 2 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                >
                  H2
                </Btn>
                <Btn
                  title="H3"
                  active={editor.isActive("heading", { level: 3 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                >
                  H3
                </Btn>
                <Btn
                  title="• Liste"
                  active={editor.isActive("bulletList")}
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                >
                  • List
                </Btn>
                <Btn
                  title="1. Liste"
                  active={editor.isActive("orderedList")}
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                >
                  1. List
                </Btn>
                <Btn
                  title="Alıntı"
                  active={editor.isActive("blockquote")}
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                >
                  ❝
                </Btn>
                <Btn
                  title="Bağlantı"
                  onClick={() => {
                    const url = prompt("Bağlantı URL");
                    if (!url) return;
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: url })
                      .run();
                  }}
                >
                  🔗
                </Btn>
                <Btn
                  title="Bağlantıyı Kaldır"
                  onClick={() => editor.chain().focus().unsetLink().run()}
                >
                  🔗✖
                </Btn>
                <Btn
                  title="Temizle"
                  onClick={() =>
                    editor.chain().focus().clearNodes().unsetAllMarks().run()
                  }
                >
                  Temizle
                </Btn>
                <Btn
                  title="Sola Hizala"
                  active={editor.isActive({ textAlign: "left" })}
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                >
                  ⬅
                </Btn>
                <Btn
                  title="Ortala"
                  active={editor.isActive({ textAlign: "center" })}
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                >
                  ⬍
                </Btn>
                <Btn
                  title="Sağa Hizala"
                  active={editor.isActive({ textAlign: "right" })}
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                >
                  ➡
                </Btn>
                <Btn
                  title="İki Yana Yasla"
                  active={editor.isActive({ textAlign: "justify" })}
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                >
                  ⬌
                </Btn>
              </div>
            )}

            <div className="border rounded">
              {/* editor hazır olmadan render etme */}
              {editor ? (
                <EditorContent editor={editor} />
              ) : (
                <div className="p-3 text-sm text-gray-500">Yükleniyor…</div>
              )}
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-3 py-1"
                disabled={saving}
              >
                Vazgeç
              </button>
              <button
                onClick={save}
                className="rounded bg-black px-3 py-1 text-white disabled:opacity-60"
                disabled={saving || !editor}
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
