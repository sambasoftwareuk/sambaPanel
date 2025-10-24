"use client";

import { useState, useEffect } from "react";
import XButton from "../_atoms/XButton";
import DeleteConfirmModal from "../_atoms/DeleteConfirmModal";
import { getMediaByScope } from "@/lib/repos/gallery";

export default function ImageGallery({
  onImageSelect,
  selectedUrl = "",
  onDeleteImage,
  pageSlug,
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
      const res = await getMediaByScope(pageSlug);
      setGallery(res.items || []);
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
    <div className="max-h-64 overflow-y-auto p-2">
      {/* Geçici silinen resimler varsa bilgi göster */}
      {temporarilyDeleted.length > 0 && (
        <div className="mt-4 p-3 bg-primary300 border border-primary500 rounded flex justify-between mb-2">
          <p className="text-sm text-secondary400">
            {temporarilyDeleted.length} resim silinmek üzere işaretlendi
          </p>
          <button
            onClick={resetTemporaryDeletes}
            className="mt-2 px-3 py-1 bg-secondary400 text-white text-sm rounded hover:bg-gray-600"
          >
            İptal Et
          </button>
        </div>
      )}
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

      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        title="Resmi Sil"
        message="Bu resmi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={() => handleDelete(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
