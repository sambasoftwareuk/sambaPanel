"use client";

import { useState, useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import RichTextToolbar from "./RichTextToolbar";
import HtmlEditor from "./HtmlEditor";
import DragDropZone from "./DragDropZone";
import ImageGallery from "./ImageGallery";
import { PrimaryButton, OutlinedButton } from "../_atoms/Buttons";
import { Header2 } from "../_atoms/Headers";
import InlineTabButton from "../_atoms/InlineTabButton";
import FileUploadPanel from "../_atoms/FileUploadPanel";
import UploadModal from "./UploadModal";

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
  onDeleteImage = () => {},
  deletedImages = [],
  onUploadComplete = () => {},
  pageSlug
}) {
  const [showHtml, setShowHtml] = useState(false);
  const [activeTab, setActiveTab] = useState(
    mode === "body" ? "visual" : "gallery"
  );
  const [galleryActions, setGalleryActions] = useState(null);

  // ✅ Yeni state: toolbar'daki inline panel için
  const [showGallery, setShowGallery] = useState(false);
  const [inlineGalleryTab, setInlineGalleryTab] = useState("gallery");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload sekmesine basınca direkt modal aç
  useEffect(() => {
    if (activeTab === "upload" && mode === "image") {
      setShowUploadModal(true);
    }
  }, [activeTab, mode]);

  // Inline gallery upload sekmesine basınca direkt modal aç
  useEffect(() => {
    if (inlineGalleryTab === "upload" && showGallery) {
      setShowUploadModal(true);
    }
  }, [inlineGalleryTab, showGallery]);

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
              ]
            : [
                { id: "gallery", label: "Galeri" },
                { id: "upload", label: "Upload" },
              ]
          ).map((tab) => (
            <InlineTabButton
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setShowHtml(tab.id === "html");
              }}
            />
          ))}
        </div>

        {/* Toolbar */}
        {editor && activeTab === "visual" && (
          <RichTextToolbar
            editor={editor}
            onImageUpload={onImageUpload}
            // ✅ Modal açmak yerine inline panel aç/kapa
            onOpenImageModal={() => setShowGallery((prev) => !prev)}
          />
        )}

        {/* ✅ Inline Gallery + Upload Panel */}
        {showGallery && activeTab === "visual" && (
          <div className="border rounded-lg p-3 my-3 bg-gray-50">
            {/* Küçük tablar */}
            <div className="flex border-b mb-3">
              <button
                onClick={() => setInlineGalleryTab("gallery")}
                className={`px-3 py-1 text-sm border-b-2 ${
                  inlineGalleryTab === "gallery"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Galeri
              </button>
              <button
                onClick={() => setInlineGalleryTab("upload")}
                className={`px-3 py-1 text-sm border-b-2 ${
                  inlineGalleryTab === "upload"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                Upload
              </button>
            </div>

            {/* İçerik */}
            {inlineGalleryTab === "gallery" ? (
              <ImageGallery
                onImageSelect={(id, url) => {
                  if (editor) {
                    const imageHtml = `<img src="${url}" alt="Galeri resmi" style="max-width: 100%; height: auto; max-height: 400px;" />`;
                    const pos = editor.state.selection.from;
                    editor
                      .chain()
                      .focus()
                      .insertContentAt(pos, imageHtml)
                      .run();
                  }
                  setShowGallery(false); // seçimden sonra panel kapanır
                }}
                onDeleteImage={onDeleteImage}
                deletedImages={deletedImages}
                onApply={setGalleryActions}
                pageSlug={pageSlug}
              />
            ) : (
              <div className="p-4 text-center text-gray-500">
                Upload modal açılıyor...
              </div>
            )}
          </div>
        )}

        {/* Tab Content */}
        {activeTab === "gallery" ? (
          <ImageGallery
            onImageSelect={(id, url) => onImageSelect(id, url)}
            onDeleteImage={onDeleteImage}
            deletedImages={deletedImages}
            onApply={setGalleryActions}
            pageSlug={pageSlug}
          />
        ) : activeTab === "upload" ? (
          <div className="p-4 text-center text-gray-500">
            Upload modal açılıyor...
          </div>
        ) : activeTab === "url" ? (
          <div className="p-4 text-center text-gray-500">
            URL özelliği geçici olarak devre dışı
          </div>
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

        {/* Error Message */}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {/* Action Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <OutlinedButton
            label="Vazgeç"
            onClick={() => {
              if (galleryActions && galleryActions.resetTemporaryDeletes) {
                galleryActions.resetTemporaryDeletes();
              }
              onClose();
            }}
            disabled={saving}
          />
          <PrimaryButton
            label={
              saving ? "Kaydediliyor..." : mode === "body" ? "Kaydet" : "Uygula"
            }
            onClick={async () => {
              if (galleryActions && galleryActions.applyDeletes) {
                await galleryActions.applyDeletes();
              }
              onSave();
              // Silme işlemi varsa sayfayı yenile
              if (galleryActions && galleryActions.hasTemporaryDeletes) {
                window.location.reload();
              }
            }}
            disabled={saving || (mode === "body" && !editor)}
            className="bg-black text-white disabled:opacity-60"
          />
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setActiveTab("gallery"); // Upload modal kapanınca galeri sekmesine geç
        }}
        onUploadComplete={() => {
          onUploadComplete?.();
          setShowUploadModal(false);
          setActiveTab("gallery"); // Upload sonrası galeri sekmesine geç
          setShowGallery(false); // Inline gallery'yi de kapat
        }}
      />
    </div>
  );
}
