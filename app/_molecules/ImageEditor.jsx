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
  const [activeTab, setActiveTab] = useState("gallery"); // gallery, upload, url
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);
  const [previewOk, setPreviewOk] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Galeri yükle
  const loadGallery = async () => {
    setLoadingGallery(true);
    try {
      const res = await fetch("/api/media?limit=50");
      const data = await res.json();
      setGallery(data.media || []);
    } catch (e) {
      console.error("Galeri yüklenemedi:", e);
    } finally {
      setLoadingGallery(false);
    }
  };

  // Modal açıldığında galeri yükle
  useEffect(() => {
    if (open) {
      loadGallery();
      setUrl(initialUrl ?? "");
      setAlt(initialAlt ?? "");
      setError("");
      setPreviewOk(true);
    }
  }, [open, initialUrl, initialAlt]);

  // Galeri resmi seç
  const selectFromGallery = (mediaItem) => {
    setUrl(mediaItem.url);
    setAlt(mediaItem.alt_text || "");
    setPreviewOk(true);
  };

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
      const mediaRes = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt_text: alt }),
      });

      if (!mediaRes.ok) {
        throw new Error("Media oluşturulamadı");
      }

      const newMedia = await mediaRes.json();

      // HEM hero_media_id HEM de hero_url ve hero_alt'ı güncelle
      setFields({
        hero_media_id: newMedia.id,
        hero_url: url, // Yeni URL'yi draft'a ekle
        hero_alt: alt, // Yeni alt'ı draft'a ekle
      });

      setOpen(false);
    } catch (e) {
      setError(e.message || "Güncellenemedi");
    }
  }

  function clearImage() {
    setFields({ hero_media_id: null, hero_url: "", hero_alt: "" });
    setOpen(false);
  }

  // Tab içerikleri
  const renderTabContent = () => {
    switch (activeTab) {
      case "gallery":
        return (
          <div className="max-h-64 overflow-y-auto">
            {loadingGallery ? (
              <p className="text-sm text-gray-500 text-center py-4">
                Galeri yükleniyor...
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => selectFromGallery(item)}
                    className={`cursor-pointer rounded border-2 p-1 ${
                      url === item.url ? "border-blue-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={item.url}
                      alt={item.alt_text || "Galeri"}
                      className="w-full h-16 object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "upload":
        return (
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
        );

      case "url":
        return (
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded border px-3 py-2 text-sm"
          />
        );

      default:
        return null;
    }
  };

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
          <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-2xl border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Görseli Düzenle</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-3 py-1 text-sm"
              >
                ✖
              </button>
            </div>

            {/* Tab'lar */}
            <div className="flex border-b mb-4">
              {[
                { id: "gallery", label: "Galeri" },
                { id: "upload", label: "Upload" },
                { id: "url", label: "URL" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab içeriği */}
            <div className="mb-4">{renderTabContent()}</div>

            {/* Alt metin */}
            <label className="text-sm block mb-4">
              Alt Metin (SEO)
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Örn. Şirketimiz üretim tesisi"
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              />
            </label>

            {/* Önizleme */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">Önizleme</p>
              <div className="border rounded p-2 grid place-items-center min-h-[200px]">
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
                    className="max-h-48 max-w-full rounded object-cover"
                  />
                )}
                {url && !checking && !previewOk && (
                  <span className="text-xs text-red-600">
                    Görsel yüklenemedi. URL'yi kontrol edin.
                  </span>
                )}
              </div>
            </div>

            {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

            <div className="flex justify-between">
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
          </div>
        </div>
      )}
    </>
  );
}
