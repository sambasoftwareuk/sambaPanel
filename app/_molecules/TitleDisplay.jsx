// app/_molecules/TitleDisplay.jsx
"use client";
import { usePageEdit } from "../context/PageEditProvider";
import { Header1 } from "../_atoms/Headers";
import { SignedIn } from "@clerk/nextjs";
import TitleEditor from "./TitleEditor";

export default function TitleDisplay({ pageId, locale }) {
  const { title } = usePageEdit();
  return (
    <div className="flex items-center gap-2">
      <Header1 className="mb-0 ">{title}</Header1>
      <SignedIn>
        <TitleEditor pageId={pageId} locale={locale} />
      </SignedIn>
    </div>
  );
}
