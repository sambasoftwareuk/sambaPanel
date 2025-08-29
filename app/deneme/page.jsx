"use client";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { useState } from "react";

export default function InlineEditable({ pageId, initialTitle, locale="tr-TR" }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle || "");

  async function save() {
    const res = await fetch(`/api/pages/${pageId}`, {
      method: "PATCH",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ locale, title }),
    });
    if (res.ok) setOpen(false);
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold">{title}</h1>

      <SignedIn>
        <button className="rounded border px-2 py-1" onClick={()=>setOpen(true)} title="Düzenle">✏️</button>
      </SignedIn>

      <SignedOut>{/* misafirler kalemi görmez */}</SignedOut>

      {open && (
        <div className="fixed inset-0 grid place-items-center bg-black/40">
          <div className="w-full max-w-md rounded bg-white p-4">
            <h2 className="mb-2 font-semibold">Başlığı Düzenle</h2>
            <input className="w-full rounded border px-3 py-2"
                   value={title} onChange={e=>setTitle(e.target.value)} />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={()=>setOpen(false)} className="border px-3 py-1 rounded">Vazgeç</button>
              <button onClick={save} className="bg-black text-white px-3 py-1 rounded">Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
