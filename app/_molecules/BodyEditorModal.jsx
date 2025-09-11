"use client";

import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import RichTextToolbar from "./RichTextToolbar";
import HtmlEditor from "./HtmlEditor";
import DragDropZone from "./DragDropZone";
import ImageGallery from "./ImageGallery";
import { PrimaryButton, OutlinedButton } from "../_atoms/buttons";
import { Header2 } from "../_atoms/Headers";

export default function BodyEditorModal({
  isOpen,
  onClose,
  editor,
  htmlContent,
  setHtmlContent,
  onImageUpload,
  onSave,
  saving = false,
  error = "",
  mode = "body", // "body" or "image"
  imageUrl = "",
  imageAlt = "",
  onImageUrlChange = () => {},
  onImageAltChange = () => {},
  onImageSelect = () => {},
  onClearImage = () => {},
}) {
  const [showHtml, setShowHtml] = useState(false);
  const [activeTab, setActiveTab] = useState(mode === "body" ? "visual" : "gallery");

  if (!isOpen) return null;

  // HTML'den editor'a içerik yükle
  const loadHtmlToEditor = () => {
    if (editor && htmlContent) {
      editor.commands.setContent(htmlContent, true, {
        parseOptions: {
          preserveWhitespace: "full",
        },
      });
    }
  };

  // HTML'i sıfırla
  const resetHtml = () => {
    setHtmlContent(editor?.getHTML() || "");
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-xl bg-white p-4 shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <Header2 className="text-lg font-semibold">
            {mode === "body" ? "İçeriği Düzenle" : "Görseli Düzenle"}
          </Header2>
          <div className="flex items-center gap-2">
            <OutlinedButton
              label="✖"
              onClick={onClose}
              className="text-sm px-3 py-1"
            />
          </div>
        </div>

        {/* Tab'lar */}
        <div className="flex border-b mb-4">
          {(mode === "body" 
            ? [
                { id: "visual", label: "Görsel Editör" },
                { id: "html", label: "HTML Kodu" },
                { id: "gallery", label: "Resim Galerisi" },
              ]
            : [
                { id: "gallery", label: "Galeri" },
                { id: "upload", label: "Upload" },
                { id: "url", label: "URL" },
              ]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowHtml(tab.id === "html");
              }}
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        {editor && activeTab === "visual" && (
          <RichTextToolbar editor={editor} onImageUpload={onImageUpload} />
        )}

        {/* Tab Content */}
        {activeTab === "gallery" ? (
          <ImageGallery 
            onImageSelect={(url) => {
              if (mode === "body" && editor) {
                const imageHtml = `<img src="${url}" alt="Galeri resmi" style="max-width: 100%; height: auto; max-height: 400px;" />`;
                const pos = editor.state.selection.from;
                editor.chain().focus().insertContentAt(pos, imageHtml).run();
              } else if (mode === "image") {
                onImageSelect(url);
              }
            }}
          />
        ) : activeTab === "upload" ? (
          <DragDropZone onFileDrop={onImageUpload} acceptTypes={["image/*"]}>
            <div className="p-4 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Resmi buraya sürükleyin veya tıklayın
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, GIF desteklenir
              </p>
            </div>
          </DragDropZone>
        ) : activeTab === "url" ? (
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => onImageUrlChange(e.target.value)}
            placeholder="https://..."
            className="w-full rounded border px-3 py-2 text-sm"
          />
        ) : (
          <DragDropZone onFileDrop={onImageUpload} acceptTypes={["image/*"]}>
            {showHtml ? (
              <HtmlEditor
                htmlContent={htmlContent}
                setHtmlContent={setHtmlContent}
                onLoadToEditor={loadHtmlToEditor}
                onReset={resetHtml}
              />
            ) : (
              <>
                {editor ? (
                  <EditorContent editor={editor} />
                ) : (
                  <div className="p-3 text-sm text-gray-500">Yükleniyor…</div>
                )}
              </>
            )}
          </DragDropZone>
        )}

        {/* Image Mode: Alt Text */}
        {mode === "image" && (
          <div className="mb-4">
            <label className="text-sm block mb-2">
              Alt Metin (SEO)
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => onImageAltChange(e.target.value)}
                placeholder="Örn. Şirketimiz üretim tesisi"
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
              />
            </label>
          </div>
        )}

        {/* Image Mode: Preview */}
        {mode === "image" && imageUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 mb-2">Önizleme</p>
            <div className="border rounded p-2 grid place-items-center min-h-[200px]">
              <img
                src={imageUrl}
                alt={imageAlt || "Önizleme"}
                className="max-h-48 max-w-full rounded object-cover"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {/* Action Buttons */}
        <div className="mt-4 flex justify-between">
          {mode === "image" && (
            <OutlinedButton 
              label="Görseli Kaldır" 
              onClick={onClearImage} 
              disabled={saving} 
            />
          )}
          <div className="flex gap-2 ml-auto">
            <OutlinedButton label="Vazgeç" onClick={onClose} disabled={saving} />
            <PrimaryButton
              label={saving ? "Kaydediliyor..." : (mode === "body" ? "Kaydet" : "Uygula")}
              onClick={onSave}
              disabled={saving || (mode === "body" && !editor)}
              className="bg-black text-white disabled:opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
