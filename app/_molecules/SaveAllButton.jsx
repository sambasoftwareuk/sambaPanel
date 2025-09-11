"use client";

import { PrimaryButton } from "../_atoms/buttons";
import { usePageEdit } from "../context/PageEditProvider";

export default function SaveAllButton() {
  const { isDirty, handleSave, saving } = usePageEdit();

  return (
    <PrimaryButton
      onClick={handleSave}
      disabled={!isDirty || saving}
      className={`rounded px-4 py-2 text-white transition-colors ${
        !isDirty || saving
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }`}
      label={saving ? "Saving…" : "Save All"}
    ></PrimaryButton>
  );
}
