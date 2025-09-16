"use client";

import { useState, useEffect } from "react";
import XButton from "../_atoms/XButton";

export default function ImageGallery({
  onImageSelect,
  selectedUrl = "",
  onDeleteImage,
  deletedImages = [], // Context'ten silinen resimleri al
  onApply, // Gallery fonksiyonlarını parent'a bildir
}) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [temporarilyDeleted, setTemporarilyDeleted] = useState([]); // Geçici silinen resimler

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

  // Resim silme fonksiyonu (sadece geçici olarak gizle)
  const handleDelete = (item) => {
    // Geçici silinen listesine ekle
    setTemporarilyDeleted((prev) => [...prev, item]);
    setDeleteConfirm(null);
  };

  // Modal kapandığında geçici silmeleri temizle
  const resetTemporaryDeletes = () => {
    setTemporarilyDeleted([]);
  };

  // "Uygula" butonuna basıldığında çağrılacak (modal'ın uygula butonundan)
  const applyDeletes = () => {
    // Geçici silinen resimleri context'e gönder
    temporarilyDeleted.forEach((image) => {
      if (onDeleteImage) {
        onDeleteImage(image);
      }
    });

    // Geçici silmeleri temizle
    setTemporarilyDeleted([]);
  };

  // onApply prop'u değiştiğinde applyDeletes'i parent'a bildir
  useEffect(() => {
    if (onApply) {
      onApply({
        applyDeletes,
        hasTemporaryDeletes: temporarilyDeleted.length > 0,
        resetTemporaryDeletes,
      });
    }
  }, [temporarilyDeleted.length]);

  return (
    <div className="max-h-64 overflow-y-auto">
      {loading ? (
        <p className="text-sm text-gray-500 text-center py-4">
          Galeri yükleniyor...
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {gallery
            .filter(
              (item) =>
                !deletedImages.some((deleted) => deleted.id === item.id) &&
                !temporarilyDeleted.some((temp) => temp.id === item.id)
            )
            .map((item) => (
              <div
                key={item.id}
                className={`relative rounded border-2 p-1 transition-colors ${
                  selectedUrl === item.id
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-primary900"
                }`}
              >
                <div
                  onClick={() => onImageSelect(item.id, item.url)}
                  className="cursor-pointer"
                >
                  <img
                    src={item.url}
                    alt={item.alt_text || "Galeri"}
                    className="w-full h-20 object-contain rounded"
                  />
                </div>

                {/* Silme butonu */}
                <div className="absolute -top-2 -right-2">
                  <XButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(item);
                    }}
                    className="!p-1"
                  />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Geçici silinen resimler varsa bilgi göster */}
      {temporarilyDeleted.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            {temporarilyDeleted.length} resim silinmek üzere işaretlendi
          </p>
          <button
            onClick={resetTemporaryDeletes}
            className="mt-2 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
          >
            İptal Et
          </button>
        </div>
      )}

      {/* Silme onay modalı */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Resmi Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu resmi silmek istediğinizden emin misiniz? Bu işlem geri
              alınamaz.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red text-white rounded hover:bg-red-200"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
