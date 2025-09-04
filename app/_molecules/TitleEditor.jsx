"use client";

import { useEffect, useState } from "react";
import EditButton from "../_atoms/EditButton";
import { useEditSession } from "../_context/EditSessionContext";

export default function TitleEditor({
  initialTitle = "",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [localTitle, setLocalTitle] = useState(initialTitle);
  const { draft, setField } = useEditSession();

  useEffect(() => {
    if (open) {
      setLocalTitle(draft.title ?? initialTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function apply() {
    setField("title", localTitle); // sadece local draft
    setOpen(false);
  }

  return (
    <>
      <EditButton onClick={() => setOpen(true)} className={className} size="small" />
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <h2 className="mb-3 text-lg font-semibold">Başlığı Düzenle</h2>
            <input
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              className="w-full rounded border px-3 py-2"
              placeholder="Başlık"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded border px-3 py-1">
                Vazgeç
              </button>
              <button onClick={apply} className="rounded bg-black px-3 py-1 text-white">
                Uygula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
