"use client";

import { useEffect, useState, useRef } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import XButton from "../_atoms/XButton";
import BodyEditorModal from "./BodyEditorModal";
import UploadModal from "./UploadModal";

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
  const [stagedMediaId, setStagedMediaId] = useState(null);
  const [previewOk, setPreviewOk] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [stagedFile, setStagedFile] = useState(null);
  const [stagedPreview, setStagedPreview] = useState(null);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const abortControllerRef = useRef(null);

  // Modal açılınca state güncelle
  useEffect(() => {
    if (!open) return;
    setUrl(heroUrl || initialUrl);
    setAlt(heroAlt || initialAlt);
    setPreviewOk(true);
    setError("");
    setUploadComplete(false);
    setShowUploadModal(false);
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

  // Modal kapanınca upload iptal et
  useEffect(() => {
    if (!open && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [open]);

  // Component unmount olduğunda cleanup
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Seçme / staging
  const handleFileSelected = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Sadece resim dosyaları");
      return;
    }

    // Eski upload varsa iptal et
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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
        // Yeni controller oluştur
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const formData = new FormData();
        formData.append("file", stagedFile);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          signal: controller.signal, // Upload iptal edilebilir
        });
        if (!res.ok) throw new Error("Upload başarısız");
        const data = await res.json();
        finalUrl = data.url;
        if (stagedPreview) URL.revokeObjectURL(stagedPreview);
        setStagedFile(null);
        setStagedPreview(null);
        abortControllerRef.current = null; // Controller temizle
      }

      // context güncelle (sadece preview için)
      setHeroUrl(finalUrl);
      setHeroAlt(alt);

      // Media ID'yi staging'de tut (Uygula butonunda kullanılacak)
      // setStagedMediaId(newMedia.id); // Bu satırı kaldır - media kaydı yapmıyoruz

      // Database'e kaydedilmesi için kısa gecikme
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Context güncellemesi yeterli, Save All'da kaydedilecek

      // Media kaydı yap (Uygula butonunda)
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

      // Staged media ID'yi hero_media_id olarak set et
      setHeroMediaId(newMedia.id);

      setOpen(false);
    } catch (e) {
      if (e.name === "AbortError") {
        return; // Hata olarak sayma
      }
      setError(e.message || "Güncellenemedi");
    } finally {
      setUploading(false);
      abortControllerRef.current = null; // Controller temizle
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
        onUploadComplete={() => setUploadComplete(true)}
      />

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={() => {
          setUploadComplete(true);
          setShowUploadModal(false);
        }}
      />
    </>
  );
}
