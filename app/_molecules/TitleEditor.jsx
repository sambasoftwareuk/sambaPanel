"use client";
import { usePageEdit } from "../context/PageEditProvider";
import { useState, useEffect } from "react";
import EditButton from "../_atoms/EditButton";
import XButton from "../_atoms/XButton";
import { OutlinedButton, PrimaryButton } from "../_atoms/Buttons";

export default function TitleEditor({ className = "" }) {
  const { title, setTitle, resetTitle } = usePageEdit();
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
      <div className=" flex items-center gap-1">
        <EditButton
          onClick={() => setOpen(true)}
          className={className}
          size="small"
        />
        <XButton onClick={resetTitle} />
      </div>

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
              <OutlinedButton label="Vazgeç" onClick={handleCancel} />
              <PrimaryButton
                label="Kaydet "
                onClick={handleSave}
                className="bg-black text-white"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
