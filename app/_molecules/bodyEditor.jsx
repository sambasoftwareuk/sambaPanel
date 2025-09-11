// app/_molecules/BodyEditor.jsx
"use client";

import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import EditButton from "../_atoms/EditButton";
import BodyEditorModal from "./BodyEditorModal";

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
  const [htmlContent, setHtmlContent] = useState("");

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

  return (
    <>
      <EditButton
        onClick={() => setOpen(true)}
        className={className}
        size="small"
      />

      <BodyEditorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        editor={editor}
        htmlContent={htmlContent}
        setHtmlContent={setHtmlContent}
        onImageUpload={handleImageFile}
        onSave={save}
        saving={saving}
        error={error}
      />
    </>
  );
}
