"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import EditButton from "../_atoms/EditButton";
import { usePageEdit } from "../context/PageEditProvider";
import XButton from "../_atoms/XButton";
import {
  IconOnlyButton,
  OutlinedButton,
  PrimaryButton,
} from "../_atoms/buttons";
import Icon from "../_atoms/Icon";
import { LineXIcon } from "../_atoms/Icons";
import BodyEditorModal from "./BodyEditorModal";

export default function BodyEditor({ className = "" }) {
  const { bodyHtml, setBodyHtml, resetBody } = usePageEdit();
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
        types: ["paragraph"],
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
          style: "max-width: 100%; height: auto; max-height: 400px;",
        },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[240px] focus:outline-none px-3 py-2",
      },
    },
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setHtmlContent(html);
    },
  });

  // Modal açıldığında veya editor hazır olduğunda içeriği set et
  useEffect(() => {
    if (!editor || !mounted || !open) return;
    editor.commands.setContent(bodyHtml || "<p></p>", true);
  }, [editor, mounted, open, bodyHtml]);

  // HTML içeriğini güncelle
  useEffect(() => {
    if (editor) {
      const html = editor.getHTML();
      setHtmlContent(html);
    }
  }, [editor, open]);

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
      formData.append("file", file);

      // Sunucuya yükle
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Resim yüklenemedi");
      }

      const result = await response.json();

      // Media API'ye kaydet (gallery için)
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          url: result.url, 
          alt_text: "Yüklenen resim" 
        }),
      });

      // URL ile resmi editöre ekle
      const imageHtml = `<img src="${result.url}" alt="Yüklenen resim" style="max-width: 100%; height: auto; max-height: 400px;" />`;
      const pos = editor.state.selection.from;
      editor.chain().focus().insertContentAt(pos, imageHtml).run();
    } catch (error) {
      console.error("Resim yükleme hatası:", error);
      alert("Resim yüklenirken hata oluştu");
    }
  };

  function save() {
    if (!editor) return;
    setSaving(true);
    setError("");
    try {
      const html = editor.getHTML();

      // Context'i güncelle (local state) - API call yok!
      setBodyHtml(html);
      
      setOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-1">
        <EditButton
          onClick={() => setOpen(true)}
          className={className}
          size="small"
        />
        <XButton onClick={resetBody} />
      </div>

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