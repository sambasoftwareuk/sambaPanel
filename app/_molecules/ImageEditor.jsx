"use client";

import { useEffect, useState, useRef } from "react";
import { useEditSession } from "../_context/EditSessionContext";
import EditButton from "../_atoms/EditButton";

export default function ImageEditor({
  initialImageId = null,
  initialUrl = "/5.jpg",
  initialAlt = "Kurumsal",
  className = "mt-2",
}) {
  const { draft, setFields } = useEditSession();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);
  const [previewOk, setPreviewOk] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Modal açıldığında değerleri yükle
  useEffect(() => {
    if (!open) return;
    setUrl(initialUrl ?? "");
    setAlt(initialAlt ?? "");
    setError("");
    setPreviewOk(true);
  }, [open, initialUrl, initialAlt]);

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

  // Sürükle-bırak işlemleri
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

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
      // 1. Yeni media kaydı oluştur
      const mediaRes = await fetch(`/api/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt_text: alt }),
      });

      if (!mediaRes.ok) {
        throw new Error("Media oluşturulamadı");
      }

      const newMedia = await mediaRes.json();

      // 2. Yeni media ID'sini kullan
      setFields({ hero_media_id: newMedia.id });
      setOpen(false);
    } catch (e) {
      setError(e.message || "Güncellenemedi");
    }
  }

  function clearImage() {
    // Görseli kaldırmak istersen: url'yi boşalt, alt'ı koru (veya boşalt)
    setFields({ hero_media_id: null });
    setOpen(false);
  }

  return (
    <>
      <EditButton
        onClick={() => setOpen(true)}
        className={className}
        size="small"
      />
      {/* <button
        onClick={() => setOpen(true)}
        className="rounded border px-3 py-1 text-sm"
      >
        Kaydet
      </button> */}

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Görseli Düzenle</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-3 py-1 text-sm"
              >
                ✖
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Sürükle-bırak alanı */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {uploading ? (
                  <p className="text-sm text-gray-500">Yükleniyor...</p>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">
                      Resmi buraya sürükleyin veya tıklayın
                    </p>
                    <p className="text-xs text-gray-500">
                      JPG, PNG, GIF desteklenir
                    </p>
                  </div>
                )}
              </div>

              {/* URL girişi */}
              <label className="text-sm">
                Veya URL girin
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </label>

              {/* Alt metin */}
              <label className="text-sm">
                Alt Metin (SEO)
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Örn. Şirketimiz üretim tesisi"
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </label>

              <div className="mt-2">
                <p className="text-sm text-gray-700 mb-2">Önizleme</p>
                <div className="border rounded p-2 grid place-items-center min-h-[220px]">
                  {!url && (
                    <span className="text-xs text-gray-500">
                      Resim seçin veya URL girin
                    </span>
                  )}
                  {url && checking && (
                    <span className="text-xs text-gray-500">
                      Kontrol ediliyor...
                    </span>
                  )}
                  {url && !checking && previewOk && (
                    <img
                      src={url}
                      alt={alt || "Önizleme"}
                      className="max-h-64 max-w-full rounded object-cover"
                    />
                  )}
                  {url && !checking && !previewOk && (
                    <span className="text-xs text-red-600">
                      Görsel yüklenemedi. URL'yi kontrol edin.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

            <div className="mt-4 flex justify-between">
              <button
                onClick={clearImage}
                className="rounded border px-3 py-1 text-sm"
              >
                Görseli Kaldır
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setOpen(false)}
                  className="rounded border px-3 py-1 text-sm"
                >
                  Vazgeç
                </button>
                <button
                  onClick={apply}
                  disabled={uploading || !url}
                  className="rounded bg-black px-3 py-1 text-white text-sm disabled:opacity-50"
                >
                  Uygula
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {/* Not: Harici alan adlarından görsel göstermek için{" "}
              <code>next.config.js</code> içinde <code>images.domains</code> listesine
              alan adını eklemeyi unutmayın. */}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
