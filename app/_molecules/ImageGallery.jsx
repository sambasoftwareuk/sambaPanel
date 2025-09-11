"use client";

import { useState, useEffect } from "react";

export default function ImageGallery({ onImageSelect, selectedUrl = "" }) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gallery yükle
  const loadGallery = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media?limit=50");
      const data = await res.json();
      setGallery(data.media || []);
    } catch (e) {
      console.error("Galeri yüklenemedi:", e);
    } finally {
      setLoading(false);
    }
  };

  // Component mount olduğunda gallery yükle
  useEffect(() => {
    loadGallery();
  }, []);

  return (
    <div className="max-h-64 overflow-y-auto">
      {loading ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Galeri yükleniyor...
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => onImageSelect(item.url)}
              className={`cursor-pointer rounded border-2 p-1 ${
                selectedUrl === item.url ? "border-blue-500" : "border-gray-200"
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
}
