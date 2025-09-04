"use client";

import { useState } from "react";
import { usePageEdit } from "./PageEditProvider";

export default function SaveAllButton({ pageId, locale }) {
  const { title, bodyHtml } = usePageEdit();
  const [loading, setLoading] = useState(false);
  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content_html: bodyHtml, locale }),
      });

      if (!res.ok) throw new Error("API error");

      // DB update başarılı → sayfayı revalidate et
      // (Next.js 15: revalidatePath client'tan çağrılamıyor, onun yerine refresh yapabilirsin)
      window.location.reload();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className="rounded bg-green-600 px-4 py-2 text-white"
    >
      {loading ? "Saving..." : "Save All"}
    </button>
  );
}
