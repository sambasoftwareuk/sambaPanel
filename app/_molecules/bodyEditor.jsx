"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import EditButton from "../_atoms/EditButton";
import { usePageEdit } from "./PageEditProvider";
import XButton from "../_atoms/XButton";

export default function BodyEditor({ className = "" }) {
  const { bodyHtml, setBodyHtml, resetBody } = usePageEdit();
  const [open, setOpen] = useState(false);
  const [draftBody, setDraftBody] = useState(bodyHtml || "<p></p>");

  const editor = useEditor({
    extensions: [StarterKit],
    content: draftBody, // use draft instead of global state
    editorProps: {
      attributes: {
        class: "prose max-w-none min-h-[240px] focus:outline-none px-3 py-2",
      },
    },
    immediatelyRender: false,
  });

  // Reset draft when modal opens
  useEffect(() => {
    if (open) {
      setDraftBody(bodyHtml || "<p></p>");
      if (editor) {
        editor.commands.setContent(bodyHtml || "<p></p>");
      }
    }
  }, [open, editor, bodyHtml]);

  function handleSaveLocal() {
    if (editor) {
      const newHtml = editor.getHTML();
      setDraftBody(newHtml);
      setBodyHtml(newHtml); // commit to global context
    }
    setOpen(false);
  }

  function handleCancel() {
    // discard draft, reset editor content
    if (editor) {
      editor.commands.setContent(bodyHtml || "<p></p>");
    }
    setOpen(false);
  }

  return (
    <>
      <div className=" flex items-center gap-1">
        <EditButton
          onClick={() => setOpen(true)}
          className={className}
          size="small"
        />
        <XButton onClick={resetBody} />
      </div>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-3xl rounded-xl bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">İçeriği Düzenle</h2>
              <button
                onClick={handleCancel}
                className="rounded border px-3 py-1 text-sm"
              >
                ✖
              </button>
            </div>

            <div className="border rounded">
              {editor ? (
                <EditorContent editor={editor} />
              ) : (
                <div className="p-3 text-sm text-gray-500">Yükleniyor…</div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="rounded border px-3 py-1"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSaveLocal}
                className="rounded bg-black px-3 py-1 text-white"
              >
                Kaydet (Local)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
