"use client";

import { useEffect, useState, useRef } from "react";
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
  } = usePageEdit();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);
  const [previewOk, setPreviewOk] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Modal açıldığında state'i güncelle
  useEffect(() => {
    if (open) {
      setUrl(heroUrl || initialUrl);
      setAlt(heroAlt || initialAlt);
      setError("");
      setPreviewOk(true);
    }
  }, [open, heroUrl, heroAlt, initialUrl, initialAlt]);

  // URL kontrolü
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

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Sadece resim dosyaları kabul edilir");
      return;
    }

    setUploading(true);
    setError("");

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
      setUrl(data.url);
      setPreviewOk(true);
    } catch (e) {
      setError(e.message || "Upload başarısız");
    } finally {
      setUploading(false);
    }
  };

  async function apply() {
    if (!url) {
      setError("Görsel URL gerekli");
      return;
    }

    try {
      const mediaRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt_text: alt }),
      });

      if (!mediaRes.ok) {
        throw new Error("Media oluşturulamadı");
      }

      const newMedia = await mediaRes.json();

      // Sadece context'i güncelle (local olarak)
      setHeroUrl(url);
      setHeroAlt(alt);
      setHeroMediaId(newMedia.id);

      setOpen(false);
    } catch (e) {
      setError(e.message || "Güncellenemedi");
    }
  }

  function clearImage() {
    // Sadece context'i güncelle (local olarak)
    setHeroUrl("");
    setHeroAlt("");
    setHeroMediaId(null);
    setOpen(false);
  }

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
        onImageSelect={(id, selectedUrl) => {
          setUrl(selectedUrl);
          setPreviewOk(true);
        }}
        onImageUpload={handleFileUpload}
        onSave={apply}
        onClearImage={clearImage}
        saving={uploading}
        error={error}
      />
    </>
  );
}
