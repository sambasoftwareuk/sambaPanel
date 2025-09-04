"use client";
import { useEditSession } from "../_context/EditSessionContext";
import { useRouter } from "next/navigation";

export default function SaveBar() {
  const { dirtyCount, dirtyGroups, saveAll, reset, saving, error } = useEditSession();
  const router = useRouter();

  if (dirtyCount === 0) return null;

  async function handleSend() {
    const ok = await saveAll();
    if (ok) router.refresh();
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-xl border">
      <span className="text-sm">
        {dirtyCount} alan değişti
        {dirtyGroups?.length ? ` (${dirtyGroups.join(", ")})` : ""}
      </span>
      {error && <span className="text-sm text-red-600">{error}</span>}
      <button onClick={reset} disabled={saving} className="rounded border px-3 py-1 text-sm">
        Vazgeç
      </button>
      <button onClick={handleSend} disabled={saving} className="rounded bg-black px-3 py-1 text-white text-sm">
        {saving ? "Gönderiliyor…" : "Gönder"}
      </button>
    </div>
  );
}
