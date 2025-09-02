// app/_molecules/TitleEditor.jsx
"use client";
import { useState } from "react";
import EditButton from "../_atoms/EditButton";
import { usePageUpdate } from "../hooks/usePageUpdate";

export default function TitleEditor({
  pageId,
  locale = "tr-TR",
  initialTitle = "",
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { updatePage } = usePageUpdate();

  async function save() {
    setSaving(true);
    setError("");
    try {
      await updatePage(pageId, { locale, title });
      setOpen(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  const handleKeyDown = (e) => {
    console.log("Key pressed:", e.key, "Shift:", e.shiftKey);
    if (e.key === "Enter" && !e.shiftKey) {
      console.log("Enter pressed, saving...");
      e.preventDefault();
      if (!saving) {
        save();
      }
    }
  };

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded border px-3 py-2"
              placeholder="Başlık"
              autoFocus
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded border px-3 py-1"
                disabled={saving}
              >
                Vazgeç
              </button>
              <button
                onClick={save}
                className="rounded bg-black px-3 py-1 text-white disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
