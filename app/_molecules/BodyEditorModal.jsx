"use client";

import { useState } from "react";
import { EditorContent } from "@tiptap/react";
import RichTextToolbar from "./RichTextToolbar";
import HtmlEditor from "./HtmlEditor";
import DragDropZone from "./DragDropZone";
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
              label={showHtml ? "Görsel Editör" : "HTML Kodu"}
              onClick={() => setShowHtml(!showHtml)}
              className="bg-blue-50 hover:bg-blue-100 text-sm px-3 py-1"
            />
            <OutlinedButton
              label="✖"
              onClick={onClose}
              className="text-sm px-3 py-1"
            />
          </div>
        </div>

        {/* Toolbar */}
        {editor && !showHtml && (
          <RichTextToolbar editor={editor} onImageUpload={onImageUpload} />
        )}

        {/* Editor Content */}
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
