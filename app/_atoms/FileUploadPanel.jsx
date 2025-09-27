import { useRef } from "react";
import DragDropZone from "../_molecules/DragDropZone";

export default function FileUploadPanel({
  onFileDrop,
  acceptTypes = ["image/*"],
  title = "Resmi buraya sürükleyin veya tıklayın",
  subtitle = "JPG, PNG, GIF desteklenir",
  disabled = false,
}) {
  const inputRef = useRef(null);

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  return (
    <DragDropZone onFileDrop={onFileDrop} acceptTypes={acceptTypes}>
      <div
        className={`p-4 text-center cursor-pointer hover:bg-gray-50 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => onFileDrop(e.target.files[0])}
          className="hidden"
        />
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </DragDropZone>
  );
}
