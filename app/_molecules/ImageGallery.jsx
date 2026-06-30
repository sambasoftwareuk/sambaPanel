"use client";

import { useState, useEffect, useCallback } from "react";
import XButton from "../_atoms/XButton";
import DeleteConfirmModal from "../_atoms/DeleteConfirmModal";
import { apiFetch } from "../utils/apiFetch";

export default function ImageGallery({
  onImageSelect,
  selectedUrl = "",
  selectedId,
  onDeleteImage,
  mediaScope,
  deletedImages = [],
  onApply,
  refreshKey = 0,
}) {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [temporarilyDeleted, setTemporarilyDeleted] = useState([]);

  const loadGallery = useCallback(async () => {
    if (!mediaScope) return;

    setLoading(true);
    try {
      const qs = new URLSearchParams({ scope: mediaScope });
      const res = await apiFetch(`/api/media?${qs.toString()}`);
      if (!res.ok) throw new Error(`Gallery load failed: ${res.status}`);
      const data = await res.json();
      setGallery(data.items || []);
    } catch (e) {
      console.error("Gallery failed to load:", e);
      setGallery([]);
    } finally {
      setLoading(false);
    }
  }, [mediaScope]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery, refreshKey]);

  const handleDelete = (item) => {
    setTemporarilyDeleted((prev) => [...prev, item]);
    setDeleteConfirm(null);
  };

  const resetTemporaryDeletes = () => {
    setTemporarilyDeleted([]);
  };

  const applyDeletes = async () => {
    if (!temporarilyDeleted.length) return;

    try {
      await Promise.all(
        temporarilyDeleted.map(async (image) => {
          try {
            const res = await apiFetch(`/api/media?id=${image.id}`, {
              method: "DELETE",
            });
            if (!res.ok) {
              const t = await res.text();
              console.error("Delete failed:", image.id, t);
              return;
            }
            setGallery((prev) => prev.filter((it) => it.id !== image.id));
          } catch (e) {
            console.error("Delete error:", image.id, e);
          }
        })
      );
    } finally {
      setTemporarilyDeleted([]);
    }
  };

  useEffect(() => {
    if (onApply) {
      onApply({
        applyDeletes,
        hasTemporaryDeletes: temporarilyDeleted.length > 0,
        resetTemporaryDeletes,
      });
    }
  }, [temporarilyDeleted.length, onApply]);

  return (
    <div className="max-h-64 overflow-y-auto p-2">
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
      ) : gallery.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No images in gallery for scope: {mediaScope || "—"}
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
                  selectedId === item.id
                    ? "border-blue-500 ring-2 ring-blue-200"
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
