"use client";

import { useEffect, useState, useRef } from "react";
import { usePageEdit } from "../context/PageEditProvider";
import EditButton from "../_atoms/EditButton";
import XButton from "../_atoms/XButton";
import BodyEditorModal from "./BodyEditorModal";
import UploadModal from "./UploadModal";
import { apiFetch } from "../utils/apiFetch";
import { uploadWithProgress } from "../../lib/uploadWithProgress";

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
    pageSlug,
    mediaScope,
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLoaded, setUploadLoaded] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  // Modal açılınca state güncelle
  useEffect(() => {
    if (!open) return;
    setUrl(heroUrl || initialUrl);
    setAlt(heroAlt || initialAlt);
    setStagedMediaId(heroMediaId || null);
    setPreviewOk(true);
    setError("");
    setUploadComplete(false);
    setShowUploadModal(false);
  }, [open, heroUrl, heroAlt, heroMediaId, initialUrl, initialAlt]);

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
    setStagedMediaId(null);
    setUrl(heroUrl || initialUrl);
  };

  const [galleryRefreshKey, setGalleryRefreshKey] = useState(0);

  const apply = async () => {
    if (!url) {
      setError("Görsel URL gerekli");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const scope = mediaScope;
      let finalUrl = url;
      let mime = stagedFile?.type || "image/png";
      let mediaId = null;

      // 1) Dosya seçildiyse önce storage'a yükle → /api/upload
      if (stagedFile) {
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setUploadProgress(0);
        setUploadLoaded(0);
        setUploadTotal(stagedFile.size);

        const formData = new FormData();
        formData.append("file", stagedFile);

        const data = await uploadWithProgress("/api/upload", formData, {
          signal: controller.signal,
          onProgress: ({ percent, loaded, total }) => {
            setUploadProgress(percent);
            setUploadLoaded(loaded);
            setUploadTotal(total);
          },
        });

        finalUrl = data.url;
        if (stagedPreview) URL.revokeObjectURL(stagedPreview);
        setStagedFile(null);
        setStagedPreview(null);
        abortControllerRef.current = null;
      }

      // 2) Önizleme için context'i güncelle
      setHeroUrl(finalUrl);
      setHeroAlt(alt);

      // 3) Media kaydı + scope ataması
      // Eğer galeriden seçildiyse (stagedMediaId varsa), yeni kayıt oluşturma
      if (stagedMediaId) {
        // Galeriden seçildi, mevcut media kaydını kullan
        mediaId = stagedMediaId;
      } else {
        // Yeni dosya yüklendi, media kaydı oluştur
        const mediaRes = await apiFetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: finalUrl,
            alt_text: alt || null,
            mime_type: mime,
            scopes: [scope],
          }),
        });
        if (!mediaRes.ok) {
          const errorText = await mediaRes.text();
          throw new Error("Media oluşturulamadı: " + errorText);
        }
        const created = await mediaRes.json();
        mediaId = created.media.id;
      }

      // 4) Page context → hero_media_id'yi bağla (Save All PATCH'inde DB'ye yazılacak)
      setHeroMediaId(mediaId);

      setOpen(false);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message || "Güncellenemedi");
    } finally {
      setUploading(false);
      setUploadProgress(0);
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
        mediaScope={mediaScope}
        galleryRefreshKey={galleryRefreshKey}
        imageUrl={url}
        imageAlt={alt}
        onImageUrlChange={setUrl}
        onImageAltChange={setAlt}
        onImageUpload={handleFileSelected}
        onImageSelect={(id, selectedUrl, mimeType) => {
          clearStaged();
          setUrl(selectedUrl);
          setStagedMediaId(id); // Galeriden seçildiğini işaretle
          setPreviewOk(true);
        }}
        onSave={apply}
        saving={uploading}
        error={error}
        onDeleteImage={(image) => setDeletedImages((prev) => [...prev, image])}
        deletedImages={deletedImages}
        onUploadComplete={() => {
          setUploadComplete(true);
          setGalleryRefreshKey((k) => k + 1);
        }}
      />

      <UploadModal
        key={mediaScope}
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadComplete={() => {
          setUploadComplete(true);
          setShowUploadModal(false);
          setGalleryRefreshKey((k) => k + 1);
        }}
      />
    </>
  );
}
