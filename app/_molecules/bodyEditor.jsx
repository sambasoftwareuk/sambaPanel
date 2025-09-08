// app/_molecules/BodyEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import EditButton from "../_atoms/EditButton";

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
  const [showHtml, setShowHtml] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer nofollow" },
      }),
      TextAlign.configure({
        types: ["paragraph"], // hangi tiplerde hizalama çalışsın
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
          style: "max-width: 100%; height: auto; max-height: 400px;",
        },
      }),
    ],
    content: "", // SSR mismatch olmaması için boş başla
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[240px] focus:outline-none px-3 py-2",
      },
    },
    immediatelyRender: false, // <<< ÖNEMLİ: SSR hatasını engeller
    onUpdate: ({ editor }) => {
      // Editor değiştiğinde HTML'i güncelle
      const html = editor.getHTML();
      setHtmlContent(html);
    },
  });

  // Modal açıldığında veya editor hazır olduğunda içeriği set et
  useEffect(() => {
    if (!editor || !mounted || !open) return;
    if (initialJson) editor.commands.setContent(initialJson);
    else editor.commands.setContent(initialHtml || "<p></p>", true);
  }, [editor, mounted, open]); // open: modal açılınca içeriğ yükle

  // HTML içeriğini güncelle
  useEffect(() => {
    if (editor) {
      const html = editor.getHTML();
      setHtmlContent(html);
    }
  }, [editor, open]); // open değiştiğinde de güncelle

  // HTML'den editor'a içerik yükle
  const loadHtmlToEditor = () => {
    if (editor && htmlContent) {
      editor.commands.setContent(htmlContent, true, {
        parseOptions: {
          preserveWhitespace: "full",
        },
      });
    }
  };

  // HTML'i formatla ve highlight et
  const formatAndHighlightHtml = (html) => {
    return html
      .replace(/></g, ">\n<") // Tag'leri satırlara böl
      .replace(/^\s+|\s+$/g, "") // Boşlukları temizle
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
      .replace(/(<[^>]+>)/g, '<span class="html-tag">$1</span>'); // Tag'leri highlight et
  };

  // Resmi sunucuya yükle ve editöre ekle
  const handleImageFile = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Lütfen sadece resim dosyası seçin");
      return;
    }

    // Dosya boyutu kontrolü (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Resim dosyası çok büyük. Maksimum 5MB olmalıdır.");
      return;
    }

    try {
      // FormData oluştur
      const formData = new FormData();
      formData.append("image", file);

      // Sunucuya yükle
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Resim yüklenemedi");
      }

      const result = await response.json();

      // URL ile resmi editöre ekle
      const imageHtml = `<img src="${result.url}" alt="Yüklenen resim" style="max-width: 100%; height: auto; max-height: 400px;" />`;
      const pos = editor.state.selection.from;
      editor.chain().focus().insertContentAt(pos, imageHtml).run();
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      alert("Resim yüklenirken hata oluştu");
    }
  };

  // Sürükle-bırak event handler'ları
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith("image/"));

    if (imageFile) {
      handleImageFile(imageFile);
    } else {
      alert("Lütfen sadece resim dosyası sürükleyin");
    }
  };

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
      <EditButton
        onClick={() => setOpen(true)}
        className={className}
        size="small"
      />

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white p-4 shadow-lg overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">İçeriği Düzenle</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHtml(!showHtml)}
                  className="rounded border px-3 py-1 text-sm bg-blue-50 hover:bg-blue-100"
                >
                  {showHtml ? "Görsel Editör" : "HTML Kodu"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded border px-3 py-1 text-sm"
                >
                  ✖
                </button>
              </div>
            </div>

            {/* Toolbar */}
            {editor && !showHtml && (
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
                  title="H1"
                  active={editor.isActive("heading", { level: 1 })}
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                >
                  H1
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
                <Btn
                  title="Resim Ekle (URL)"
                  onClick={() => {
                    const url = prompt("Resim URL'si:");
                    if (url) {
                      const imageHtml = `<img src="${url}" alt="URL resmi" style="max-width: 100%; height: auto; max-height: 400px;" />`;
                      const pos = editor.state.selection.from;
                      editor
                        .chain()
                        .focus()
                        .insertContentAt(pos, imageHtml)
                        .run();
                    }
                  }}
                >
                  🖼️
                </Btn>
                <Btn
                  title="Bilgisayardan Resim Yükle"
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleImageFile(file);
                      }
                    };
                    input.click();
                  }}
                >
                  📷
                </Btn>
              </div>
            )}

            <div
              className={`border rounded relative ${
                isDragOver ? "border-blue-500 bg-blue-50" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {showHtml ? (
                // HTML Editörü
                <div className="p-3">
                  <div className="mb-2 text-sm text-gray-600">
                    HTML kodunu düzenleyin. Değişiklikleri uygulamak için
                    "HTML'den Yükle" butonuna tıklayın.
                  </div>
                  <div className="w-full h-64 p-3 border rounded font-mono text-sm bg-gray-50 overflow-auto">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formatAndHighlightHtml(htmlContent),
                      }}
                      className="whitespace-pre-wrap"
                    />
                  </div>
                  <textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    className="w-full h-32 p-3 border rounded font-mono text-sm mt-2"
                    placeholder="HTML kodunu buraya yazın..."
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={loadHtmlToEditor}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      HTML'den Yükle
                    </button>
                    <button
                      onClick={() => setHtmlContent(editor?.getHTML() || "")}
                      className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                    >
                      Sıfırla
                    </button>
                  </div>
                </div>
              ) : (
                // Görsel Editör
                <>
                  {isDragOver && (
                    <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-500 rounded flex items-center justify-center z-10">
                      <div className="text-blue-600 text-lg font-medium">
                        Resmi buraya bırakın
                      </div>
                    </div>
                  )}
                  {editor ? (
                    <EditorContent editor={editor} />
                  ) : (
                    <div className="p-3 text-sm text-gray-500">Yükleniyor…</div>
                  )}
                </>
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
