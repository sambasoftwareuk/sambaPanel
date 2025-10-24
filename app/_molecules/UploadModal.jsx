"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import DragDropZone from "./DragDropZone";
import { PrimaryButton, OutlinedButton } from "../_atoms/Buttons";
import { Header2 } from "../_atoms/Headers";
import XButton from "../_atoms/XButton";

export default function UploadModal({ isOpen, onClose, onUploadComplete, scope }  ) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]); // Blob URL'leri tutmak için
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  


  const handleFileSelect = (files) => {
    const fileArray = Array.from(files);
    const imageFiles = fileArray.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length === 0) {
      alert("Sadece resim dosyaları seçilebilir");
      return;
    }

    // Her dosya için blob URL ve benzersiz ID oluştur
    const newPreviews = imageFiles.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      url: URL.createObjectURL(file),
    }));

    setSelectedFiles((prev) => [...prev, ...imageFiles]);
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (id) => {
    // Kaldırılan dosyanın blob URL'ini temizle
    const previewToRemove = filePreviews.find((p) => p.id === id);
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove.url);
      const indexToRemove = filePreviews.indexOf(previewToRemove);
      setSelectedFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
    }

    setFilePreviews((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    console.log("scope2:", scope);

    // if (!scope) {
    //   // Scope zorunlu değil demiştin; ama senin ihtiyacında gerekli.
    //   // İstersen bunu uyarı yerine sessizce scopes göndermeyebilirsin.
    //   alert("scope eksik.");
    //   return;
    // }

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        // Direkt API'ye upload et
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(
            `Upload başarısız: ${uploadRes.status} - ${errorText}`
          );
        }

        const uploadData = await uploadRes.json();

        
        // Media kaydı yap
        const mediaRes = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: uploadData.url,
            alt_text: file.name,
            mime_type: uploadData?.mime_type || file.type || null,
            scopes: ["kurumsal"],
          }),
        });

        if (!mediaRes.ok) throw new Error("Media kaydı başarısız");
      }

      setSelectedFiles([]);
      onUploadComplete?.();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Resim yüklenirken hata oluştu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Tüm blob URL'leri temizle
    filePreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setFilePreviews([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white p-4 shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Header2 className="text-lg font-semibold">Resim Yükle</Header2>
          <OutlinedButton
            label="✖"
            onClick={handleClose}
            className="text-sm px-3 py-1"
          />
        </div>

        {/* Upload Area */}
        <DragDropZone onFileDrop={handleFileSelect} acceptTypes={["image/*"]}>
          <div
            className="p-6 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            onClick={handleClick}
          >
            <input
              type="file"
              ref={inputRef}
              onChange={(e) => handleFileSelect(e.target.files)}
              multiple
              className="hidden"
              accept="image/*"
            />
            <p className="text-sm text-gray-600 mb-2">
              Resim yüklemek için tıklayın ya da sürükleyip birakin
            </p>
            <p className="text-xs text-gray-500">JPG, PNG, GIF desteklenir</p>
          </div>
        </DragDropZone>

        {/* Seçilen resimler */}
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Seçilen Resimler ({selectedFiles.length})
            </h4>
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {filePreviews?.map((preview) => (
                  <div key={preview.id} className="relative">
                    <div className="relative w-full h-20 rounded border overflow-hidden">
                      <Image
                        src={preview.url}
                        alt={preview.file.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1">
                      <XButton
                        onClick={() => removeFile(preview.id)}
                        title="Resmi kaldır"
                      />
                    </div>
                    <p className="text-xs text-gray-600 truncate mt-1">
                      {preview.file.name}
                    </p>
                  </div>
                ))
               ?? (
                <div className="col-span-2 text-center text-gray-500 text-sm py-4">
                  Resim bulunamadı
                </div>
              )
            }
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-2">
          <OutlinedButton
            label="Vazgeç"
            onClick={handleClose}
            disabled={uploading}
          />
          <PrimaryButton
            label={uploading ? "Yükleniyor..." : "Yükle"}
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="bg-blue-600 text-white"
          />
        </div>
      </div>
    </div>
  );
}
