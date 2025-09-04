// app/_molecules/DraftBody.jsx
"use client";

import { useEditSession } from "../_context/EditSessionContext";

export default function DraftBody({ initialHtml = "<p></p>", className = "" }) {
  const { draft } = useEditSession();
  const html = draft.content_html ?? initialHtml;
  return (
    <div
      className={`prose max-w-none text-gray-700 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
