"use client";

import { useState } from "react";
import { usePageEdit } from "./PageEditProvider";

export default function SaveAllButton({ pageId, locale }) {
  const { title, bodyHtml, isDirty, markSaved } = usePageEdit();
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

      // ✅ Başarılı kayıttan sonra baseline güncelle
      markSaved();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSave}
      disabled={loading || !isDirty}
      className={`rounded px-4 py-2 text-white transition-colors ${
        isDirty
          ? "bg-green-600 hover:bg-green-700"
          : "bg-gray-400 cursor-not-allowed"
      }`}
    >
      {loading ? "Saving..." : "Save All"}
    </button>
  );
}
