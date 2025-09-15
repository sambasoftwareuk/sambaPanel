"use client";

import { useState } from "react";

export default function DragDropZone({
  children,
  onFileDrop,
  acceptTypes = ["image/*"],
  className = "",
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = acceptTypes.join(",");
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onFileDrop(file);
      }
    };
    input.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const acceptedFile = files.find((file) =>
      acceptTypes.some((type) => file.type.match(type.replace("*", ".*")))
    );

    if (acceptedFile) {
      onFileDrop(acceptedFile);
    } else {
      alert(`Lütfen sadece ${acceptTypes.join(", ")} dosyaları sürükleyin`);
    }
  };

  return (
    <div
      className={`border rounded relative ${
        isDragOver ? "border-blue-500 bg-blue-50" : ""
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-blue-500 rounded flex items-center justify-center z-10">
          <div className="text-blue-600 text-lg font-medium">
            Dosyayı buraya bırakın
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
