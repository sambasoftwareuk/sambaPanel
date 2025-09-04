// app/_molecules/DraftTitle.jsx
"use client";

import { useEditSession } from "../_context/EditSessionContext";

export default function DraftTitle({ initialTitle = "", className = "" }) {
  const { draft } = useEditSession();
  const title = draft.title ?? initialTitle;
  return (
    <h1 className={`text-primary mb-2 text-3xl font-semibold ${className}`}>
      {title}
    </h1>
  );
}
