"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import XButton from "../_atoms/XButton";
import BodyEditorModal from "./BodyEditorModal";
import UploadModal from "./UploadModal";

export default function ImageEditor({
  initialUrl = "/generic-image.png",
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
    pageSlug
    
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

  
const scopeFromPage = (slug) => {
  // Sayfaya göre scope eşlemesi — ihtiyacına göre genişletebilirsin
  if (!slug) return 'gallery';
  if (slug === 'kurumsal' || slug === 'about-us' || slug === 'corporate') return 'kurumsal';
  if (slug.startsWith('urun') || slug.startsWith('products')) return 'product';
  if (slug.startsWith('hizmet') || slug.startsWith('services')) return 'service';
  if (slug.startsWith('yedek') || slug.includes('spare')) return 'spare';
  if (slug.startsWith('iletisim') || slug.startsWith('contact')) return 'contact';
  return 'gallery';
};



const computedScope = useMemo(() => scopeFromPage(pageSlug), [pageSlug]);

const apply = async () => {
  if (!url) {
    setError("Görsel URL gerekli");
    return;
  }
  setUploading(true);
  setError("");
  try {
    const scope = computedScope;
    let finalUrl = url;
    let mime = stagedFile?.type || 'image/png';

   
    


    // 1) Dosya seçildiyse önce storage’a yükle → /api/upload
    if (stagedFile) {
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const formData = new FormData();
      formData.append("file", stagedFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error("Upload başarısız: " + res.status + " - " + t);
      }
      const data = await res.json();
      finalUrl = data.url;              // storage URL
      if (stagedPreview) URL.revokeObjectURL(stagedPreview);
      setStagedFile(null);
      setStagedPreview(null);
      abortControllerRef.current = null;
    }

    // 2) Önizleme için context’i güncelle
    setHeroUrl(finalUrl);
    setHeroAlt(alt);

    // 3) Media kaydı + scope ataması → /api/media (POST)
    const mediaRes = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: finalUrl,
        alt_text: alt || null,
        mime_type: mime,
        scopes: [scope],             // 🔑 kurumsal sayfadaysan ['corporate']
      }),
    });
    if (!mediaRes.ok) {
      const errorText = await mediaRes.text();
      throw new Error("Media oluşturulamadı: " + errorText);
    }
    const created = await mediaRes.json(); // { message, media: { id, url, ... } }

    // 4) Page context → hero_media_id’yi bağla (Save All PATCH’inde DB’ye yazılacak)
    setHeroMediaId(created.media.id);

    setOpen(false);
  } catch (e) {
    if (e.name !== "AbortError") setError(e.message || "Güncellenemedi");
  } finally {
    setUploading(false);
    abortControllerRef.current = null;
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
        pageSlug={pageSlug}
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
        key={computedScope}
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        mediaScope={computedScope}
        onUploadComplete={() => {
          setUploadComplete(true);
          setShowUploadModal(false);
        }}
      />
    </>
  );
}
