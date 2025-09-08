"use client";

import { usePageEdit } from "./PageEditProvider";

export default function SaveAllButton() {
  const { isDirty, handleSave, saving } = usePageEdit();

  return (
    <button
      onClick={handleSave}
      disabled={!isDirty || saving}
      className={`rounded px-4 py-2 text-white transition-colors ${
        !isDirty || saving
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {saving ? "Saving…" : "Save All"}
    </button>
  );
}
