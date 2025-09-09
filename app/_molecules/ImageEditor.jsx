"use client";

import { useEffect, useState } from "react";
import { useEditSession } from "../_context/EditSessionContext";
import EditButton from "../_atoms/EditButton";

export default function ImageEditor({
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

  // Modal açıldığında, varsa draft; yoksa initial değerleri yükle
  useEffect(() => {
    if (!open) return;
    setUrl(draft.hero_url ?? initialUrl ?? "");
    setAlt(draft.hero_alt ?? initialAlt ?? "");
    setError("");
    setPreviewOk(true);
  }, [open, draft, initialUrl, initialAlt]);

  // Basit bir URL/erişilebilirlik kontrolü (görsel yükleniyor mu?)
  useEffect(() => {
    if (!open) return;
    if (!url) { setPreviewOk(false); return; }

    let cancelled = false;
    setChecking(true);
    const img = new Image();
    img.onload = () => { if (!cancelled) { setPreviewOk(true); setChecking(false); } };
    img.onerror = () => { if (!cancelled) { setPreviewOk(false); setChecking(false); } };
    img.src = url;

    return () => { cancelled = true; };
  }, [open, url]);

  function apply() {
    if (!url) {
      setError("Görsel URL gerekli");
      return;
    }
    setFields({ hero_url: url, hero_alt: alt || "Görsel" });
    setOpen(false);
  }

  function clearImage() {
    // Görseli kaldırmak istersen: url'yi boşalt, alt'ı koru (veya boşalt)
    setFields({ hero_url: "", hero_alt: alt || "" });
    setOpen(false);
  }

  return (
    <>
      <EditButton onClick={() => setOpen(true)} className={className} size="small" />

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
              <label className="text-sm">
                Görsel URL
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded border px-3 py-2 text-sm"
                />
              </label>

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
                    <span className="text-xs text-gray-500">URL girin…</span>
                  )}
                  {url && checking && (
                    <span className="text-xs text-gray-500">Kontrol ediliyor…</span>
                  )}
                  {url && !checking && previewOk && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={url}
                      alt={alt || "Önizleme"}
                      className="max-h-64 max-w-full rounded object-cover"
                    />
                  )}
                  {url && !checking && !previewOk && (
                    <span className="text-xs text-red-600">
                      Görsel yüklenemedi. URL’yi kontrol edin.
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
                  className="rounded bg-black px-3 py-1 text-white text-sm"
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
