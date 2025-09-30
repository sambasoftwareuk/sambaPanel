"use client";

import { useState, useRef } from "react";
import DragDropZone from "./DragDropZone";
import { PrimaryButton } from "../_atoms/buttons";

export default function UploadSection({ onFileDrop, onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
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

    setSelectedFiles((prev) => [...prev, ...imageFiles]);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

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

        if (!uploadRes.ok) throw new Error("Upload başarısız");

        const uploadData = await uploadRes.json();

        // Media kaydı yap
        const mediaRes = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: uploadData.url,
            alt_text: file.name,
          }),
        });

        if (!mediaRes.ok) throw new Error("Media kaydı başarısız");
      }

      setSelectedFiles([]);
      alert("Resimler başarıyla yüklendi!");
      onUploadComplete?.();
    } catch (error) {
      console.error("Upload error:", error);
      alert("Resim yüklenirken hata oluştu: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
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
            Resim yüklemek için tıklayın
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
            {selectedFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-20 object-cover rounded border"
                />
                <button
                  onClick={() => removeFile(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
                <p className="text-xs text-gray-600 truncate mt-1">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yükle butonu */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 flex justify-end">
          <PrimaryButton
            label={uploading ? "Yükleniyor..." : "Yükle"}
            onClick={handleUpload}
            disabled={uploading}
            className="bg-blue-600 text-white"
          />
        </div>
      )}
    </div>
  );
}
