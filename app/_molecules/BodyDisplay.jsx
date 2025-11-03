"use client";
import { SignedIn } from "@clerk/nextjs";
import { usePageEdit } from "../context/PageEditProvider";
import BodyEditor from "./BodyEditor";

export default function BodyDisplay({ initialHtml, pageId, locale }) {
  const { bodyHtml } = usePageEdit();
  return (
    <div className="flex items-start gap-2">
      <div
        className="prose max-w-none text-gray-700 leading-relaxed w-full"
        dangerouslySetInnerHTML={{
          __html: bodyHtml || initialHtml || "<p>İçerik henüz eklenmemiş.</p>",
        }}
      />
      <SignedIn>
        <BodyEditor pageId={pageId} locale={locale} />
      </SignedIn>
    </div>
  );
}
