"use client";
import { usePageEdit } from "./PageEditProvider";
import { useState, useEffect } from "react";
import EditButton from "../_atoms/EditButton";

export default function TitleEditor({ className = "" }) {
  const { title, setTitle } = usePageEdit();
  const [open, setOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);

  // Whenever modal opens, reset draft to current title
  useEffect(() => {
    if (open) {
      setDraftTitle(title);
    }
  }, [open, title]);

  function handleSave() {
    setTitle(draftTitle); // commit changes to global state
    setOpen(false);
  }

  function handleCancel() {
    setOpen(false); // just close, discard draft
  }

  return (
    <>
      <EditButton
        onClick={() => setOpen(true)}
        className={className}
        size="small"
      />

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <h2 className="mb-3 text-lg font-semibold">Başlığı Düzenle</h2>
            <input
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Başlık"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="rounded border px-3 py-1"
              >
                Vazgeç
              </button>
              <button
                onClick={handleSave}
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
