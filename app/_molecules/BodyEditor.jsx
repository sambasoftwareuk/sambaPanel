"use client";

import { useState, useEffect } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { CustomImageNode } from "../_extensions/CustomImageNode";
import EditButton from "../_atoms/EditButton";
import { usePageEdit } from "../context/PageEditProvider";
import XButton from "../_atoms/XButton";
import BodyEditorModal from "./BodyEditorModal";

export default function BodyEditor({ className = "" }) {
  const {
    bodyHtml,
    setBodyHtml,
    resetBody,
    deletedImages,
    setDeletedImages,
    pageSlug,
  } = usePageEdit();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);

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
        types: ["paragraph", "customImage"],
      }),
      CustomImageNode,
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

  // Resim seçimi için modal açma fonksiyonu
  const openImageModal = () => {
    setImageModalOpen(true);
  };

  // Resim seçildiğinde editöre ekleme fonksiyonu
  const handleImageSelect = (id, imageUrl) => {
    if (editor && imageUrl) {
      const fileName = imageUrl.split("/").pop();
      const altText = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      editor.commands.setCustomImage({
        src: imageUrl,
        alt: altText,
        type: "image",
        width: "100%",
      });
    }
    setImageModalOpen(false);
  };

  // Resim yükleme fonksiyonu
  const handleImageUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      alert("Sadece resim dosyaları kabul edilir");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload başarısız");
      }

      const data = await res.json();

      // Dosya adından alt text oluştur
      const fileName = data.fileName || data.url.split("/").pop();
      const altText = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      // Media API'ye kaydet
      await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: data.url,
          alt_text: altText,
        }),
      });

      // Resmi editöre ekle
      if (editor && data.url) {
        editor.commands.setCustomImage({
          src: data.url,
          alt: altText,
          type: "image",
          width: "100%",
        });

        // Context'i de güncelle (Save All butonunu aktif etmek için)
        const updatedHtml = editor.getHTML();
        setBodyHtml(updatedHtml);
      }
    } catch (e) {
      alert("Resim yüklenirken hata oluştu: " + e.message);
    }
  };

  function save() {
    if (!editor) return;
    setSaving(true);
    setError("");

    try {
      const html = editor.getHTML();

      // Sadece context'i güncelle (basit ve temiz)
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
        onImageUpload={handleImageUpload}
        onSave={save}
        saving={saving}
        error={error}
        onOpenImageModal={openImageModal}
        onDeleteImage={(image) => setDeletedImages((prev) => [...prev, image])}
        deletedImages={deletedImages}
        pageSlug={pageSlug}
      />

      {/* Resim seçimi modal'ı */}
      <BodyEditorModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        mode="image"
        imageUrl=""
        imageAlt=""
        onImageUrlChange={() => {}}
        onImageAltChange={() => {}}
        onImageSelect={(id, url) => handleImageSelect(id, url)}
        onImageUpload={handleImageUpload}
        onSave={() => setImageModalOpen(false)}
        saving={false}
        error=""
        deletedImages={deletedImages}
        pageSlug={pageSlug}
      />
    </>
  );
}
