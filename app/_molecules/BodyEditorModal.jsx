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
}) {
  const [showHtml, setShowHtml] = useState(false);
  const [activeTab, setActiveTab] = useState("visual"); // visual, html, gallery

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
          <Header2 className="text-lg font-semibold">İçeriği Düzenle</Header2>
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
          {[
            { id: "visual", label: "Görsel Editör" },
            { id: "html", label: "HTML Kodu" },
            { id: "gallery", label: "Resim Galerisi" },
          ].map((tab) => (
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
              if (editor) {
                const imageHtml = `<img src="${url}" alt="Galeri resmi" style="max-width: 100%; height: auto; max-height: 400px;" />`;
                const pos = editor.state.selection.from;
                editor.chain().focus().insertContentAt(pos, imageHtml).run();
              }
            }}
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

        {/* Error Message */}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        {/* Action Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <OutlinedButton label="Vazgeç" onClick={onClose} disabled={saving} />
          <PrimaryButton
            label={saving ? "Kaydediliyor..." : "Kaydet"}
            onClick={onSave}
            disabled={saving || !editor}
            className="bg-black text-white disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
}
