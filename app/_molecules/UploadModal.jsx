"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import DragDropZone from "./DragDropZone";
import { PrimaryButton, OutlinedButton } from "../_atoms/Buttons";
import { Header2 } from "../_atoms/Headers";
import XButton from "../_atoms/XButton";
import { usePageEdit } from "../context/PageEditProvider";
import UploadProgressBar from "../_atoms/UploadProgressBar";
import { uploadWithProgress } from "../../lib/uploadWithProgress";
import { showError } from "../utils/toast";
import { apiFetch } from "../utils/apiFetch";
import { getUploadErrorMessage } from "../../lib/uploadErrorMessage";

export default function UploadModal({ isOpen, onClose, onUploadComplete }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]); // Blob URL'leri tutmak için
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadLoaded, setUploadLoaded] = useState(0);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState("");
  const inputRef = useRef(null);
  const { mediaScope } = usePageEdit();

  const handleFileSelect = (files) => {
    const fileArray = files instanceof File
      ? [files]
      : Array.from(files || []);
    const imageFiles = fileArray.filter((file) => {
      if (file.type?.startsWith("image/")) return true;
      const ext = file.name.split(".").pop()?.toLowerCase();
      return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
    });
    if (imageFiles.length === 0) {
      showError("Only image files can be selected");
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

    if (!mediaScope) {
      showError("Scope is missing.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadLoaded(0);
    setUploadTotal(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setCurrentFileIndex(i + 1);
        setUploadingFileName(file.name);
        setUploadProgress(0);
        setUploadLoaded(0);
        setUploadTotal(file.size);

        const formData = new FormData();
        formData.append("file", file);

        const uploadData = await uploadWithProgress("/api/upload", formData, {
          onProgress: ({ percent, loaded, total }) => {
            setUploadProgress(percent);
            setUploadLoaded(loaded);
            setUploadTotal(total);
          },
        });

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          throw new Error(
            `Upload başarısız: ${uploadRes.status} - ${errorText}`
          );
        }

        const uploadData = await uploadRes.json();

        
        // Media kaydı yap
        const mediaRes = await apiFetch("/api/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      url: uploadData.url,
      alt_text: file.name,
      mime_type: uploadData?.mime_type || file.type || null,
      scopes: [mediaScope],                 // ← hard-coded "kurumsal" yerine bu
    }),
  });

        if (!mediaRes.ok) throw new Error("Media kaydı başarısız");
      }

      setSelectedFiles([]);
      onUploadComplete?.();
      onClose();
    } catch (error) {
      console.error("Upload error:", error);
      showError(getUploadErrorMessage(error));
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setUploadingFileName("");
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
      <div className="w-full max-w-4xl h-5/6 rounded-xl bg-white p-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Header2 className="text-lg font-semibold">Upload Image</Header2>
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
              Click or drag and drop to upload images
            </p>
            <p className="text-xs text-gray-500">JPG, PNG, GIF supported</p>
          </div>
        </DragDropZone>

        {/* Seçilen resimler */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 h-4/6">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Selected Images ({selectedFiles.length})
            </h4>
            <div className="grid grid-cols-3 gap-2 h-5/6 overflow-y-auto p-2">
              {filePreviews?.map((preview) => (
                <div key={preview.id} className="relative">
                  <div className="relative w-full h-32 rounded border overflow-hidden">
                    <Image
                      src={preview.url}
                      alt={preview.file.name}
                      fill
                      unoptimized
                      className="object-contain rounded"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <XButton
                      onClick={() => removeFile(preview.id)}
                      title="Remove file"
                    />
                  </div>
                  <p className="text-xs text-gray-600 truncate mt-1">
                    {preview.file.name}
                  </p>
                </div>
              ))
                ?? (
                  <div className="col-span-2 text-center text-gray-500 text-sm py-4">
                    No files found
                  </div>
                )
              }
            </div>
          </div>
        )}
        {uploading && (
          <div className="mt-4">
            <UploadProgressBar
              percent={uploadProgress}
              label={`Uploading: ${uploadingFileName}`}
              loaded={uploadLoaded}
              total={uploadTotal}
              fileIndex={currentFileIndex}
              fileCount={selectedFiles.length}
            />
          </div>
        )}
        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <OutlinedButton
            label="Cancel"
            onClick={handleClose}
            disabled={uploading}
          />
          <PrimaryButton
            label={uploading ? "Uploading..." : "Upload"}
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="bg-blue-600 text-white"
          />
        </div>
      </div>
    </div>
  );
}
