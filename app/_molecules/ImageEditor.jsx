"use client";

import { useEffect, useState } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import XButton from "../_atoms/XButton";
import BodyEditorModal from "./BodyEditorModal";

export default function ImageEditor({
  initialUrl = "/5.jpg",
  initialAlt = "Kurumsal",
  className = "mt-2",
}) {
  const {
    heroUrl,
    setHeroUrl,
    heroAlt,
    setHeroAlt,
    heroMediaId,
    setHeroMediaId,
    resetHero,
    setDeletedImages,
    deletedImages,
    pageId,
    locale,
  } = usePageEdit();

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);
  const [previewOk, setPreviewOk] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [stagedFile, setStagedFile] = useState(null);
  const [stagedPreview, setStagedPreview] = useState(null);

  // Modal açılınca state güncelle
  useEffect(() => {
    if (!open) return;
    setUrl(heroUrl || initialUrl);
    setAlt(heroAlt || initialAlt);
    setPreviewOk(true);
    setError("");
  }, [open, heroUrl, heroAlt, initialUrl, initialAlt]);

  // URL kontrol
  useEffect(() => {
    if (!open || !url) return;
    let cancelled = false;
    setChecking(true);
    const img = new Image();
    img.onload = () => {
      if (!cancelled) {
        setPreviewOk(true);
        setChecking(false);
      }
    };
    img.onerror = () => {
      if (!cancelled) {
        setPreviewOk(false);
        setChecking(false);
      }
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [open, url]);

  // Seçme / staging
  const handleFileSelected = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Sadece resim dosyaları");
      return;
    }
    if (stagedPreview) URL.revokeObjectURL(stagedPreview);

    const objUrl = URL.createObjectURL(file);
    setStagedFile(file);
    setStagedPreview(objUrl);
    setUrl(objUrl);
    setPreviewOk(true);
    setError("");
  };

  const clearStaged = () => {
    if (stagedPreview) URL.revokeObjectURL(stagedPreview);
    setStagedFile(null);
    setStagedPreview(null);
    setUrl(heroUrl || initialUrl);
  };

  // Uygula → sadece context güncelle, upload yapılır
  const apply = async () => {
    if (!url) {
      setError("Görsel URL gerekli");
      return;
    }
    setUploading(true);
    setError("");
    try {
      let finalUrl = url;

      if (stagedFile) {
        const formData = new FormData();
        formData.append("file", stagedFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload başarısız");
        const data = await res.json();
        finalUrl = data.url;
        if (stagedPreview) URL.revokeObjectURL(stagedPreview);
        setStagedFile(null);
        setStagedPreview(null);
      }

      // media kaydı
      const mediaRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: finalUrl, alt_text: alt }),
      });
      
      if (!mediaRes.ok) {
        const errorText = await mediaRes.text();
        throw new Error("Media oluşturulamadı: " + errorText);
      }
      
      const newMedia = await mediaRes.json();

      // context güncelle
      setHeroUrl(finalUrl);
      setHeroAlt(alt);
      setHeroMediaId(newMedia.id);

      // Database'e kaydedilmesi için kısa gecikme
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Context güncellemesi yeterli, Save All'da kaydedilecek

      setOpen(false);
    } catch (e) {
      setError(e.message || "Güncellenemedi");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-1">
        <EditButton
          onClick={() => setOpen(true)}
          className={className}
          size="small"
        />
        <XButton onClick={resetHero} />
      </div>

      <BodyEditorModal
        isOpen={open}
        onClose={() => setOpen(false)}
        mode="image"
        imageUrl={url}
        imageAlt={alt}
        onImageUrlChange={setUrl}
        onImageAltChange={setAlt}
        onImageUpload={handleFileSelected}
        onImageSelect={(id, selectedUrl) => {
          clearStaged();
          setUrl(selectedUrl);
          setPreviewOk(true);
        }}
        onSave={apply}
        saving={uploading}
        error={error}
        onDeleteImage={(image) => setDeletedImages((prev) => [...prev, image])}
        deletedImages={deletedImages}
      />
    </>
  );
}
