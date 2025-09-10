"use client";
import { usePageEdit } from "../context/PageEditProvider";

export default function BodyDisplay({ initialHtml }) {
  const { bodyHtml } = usePageEdit();
  return (
    <div
      className="prose max-w-none text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: bodyHtml || initialHtml || "<p>İçerik henüz eklenmemiş.</p>",
      }}
    />
  );
}
