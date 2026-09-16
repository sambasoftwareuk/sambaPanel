"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn } from "@clerk/nextjs";
import { PageEditProvider } from "../context/PageEditProvider";
import TitleDisplay from "../_molecules/TitleDisplay";
import BodyDisplay from "../_molecules/BodyDisplay";
import SaveAllButton from "../_molecules/SaveAllButton";
import ProductCardWithImage from "../_molecules/ProductCardWithImage";
import EditButton from "../_atoms/EditButton";
import { PrimaryButton, OutlinedButton } from "../_atoms/Buttons";
import { apiFetch } from "../utils/apiFetch";
import { showError, showSuccess } from "../utils/toast";

function CardEditor({ item, locale, onClose, onSaved, onDeleted }) {
  const [title, setTitle] = useState(item?.title || "");
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const save = async () => {
    setSaving(true);
    try {
      const res = await apiFetch(`/api/collections/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, locale }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onSaved({ ...item, ...data.item, href: item.href });
      showSuccess("Kart güncellendi.");
      onClose();
    } catch (e) {
      showError(e.message || "Kart güncellenemedi.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (confirmText !== "Evet silmek istiyorum") return;
    setSaving(true);
    try {
      const res = await apiFetch(`/api/collections/${item.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      onDeleted(item.id);
      showSuccess("Kart silindi.");
      onClose();
    } catch (e) {
      showError(e.message || "Kart silinemedi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 text-left shadow-xl">
        <h3 className="mb-4 text-xl font-bold text-primary900">Ürün Kartını Düzenle</h3>
        <label className="mb-2 block text-sm font-semibold text-gray-700">Başlık</label>
        <input className="mb-4 w-full rounded border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="mb-4 text-sm text-gray-500">Görsel: {item?.hero_url || "/generic-image.png"}</div>

        {confirming && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3">
            <p className="mb-2 text-sm text-red-700">Silmek için aşağıya <strong>Evet silmek istiyorum</strong> yazın.</p>
            <input className="w-full rounded border px-3 py-2" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
          </div>
        )}

        <div className="flex flex-wrap justify-between gap-2">
          <button type="button" className="rounded bg-red-600 px-4 py-2 text-white disabled:bg-gray-400" onClick={confirming ? remove : () => setConfirming(true)} disabled={saving || (confirming && confirmText !== "Evet silmek istiyorum")}>
            {confirming ? "Sil" : "Silme Butonu"}
          </button>
          <div className="flex gap-2">
            <OutlinedButton label="Vazgeç" onClick={onClose} disabled={saving} />
            <PrimaryButton label={saving ? "Kaydediliyor..." : "Kaydet"} onClick={save} disabled={saving} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditableProductOverview({ items, page, locale = "tr-TR" }) {
  const [cards, setCards] = useState(items || []);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);

  const createCard = async () => {
    setCreating(true);
    try {
      const res = await apiFetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, type: "product", title: "Yeni Ürün Kartı" }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setCards((prev) => [...prev, data.item]);
      setEditing(data.item);
      showSuccess("Yeni kart eklendi.");
    } catch (e) {
      showError(e.message || "Kart eklenemedi.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <PageEditProvider initialTitle={page?.title || "Ürünlerimiz"} initialBody={page?.content_html || "<p></p>"} pageId={page?.id} locale={locale} pageSlug="urunler" baseHref="urunler">
      <div className="w-full max-w-7xl mx-auto mt-6 p-4">
        <div className="flex justify-center"><TitleDisplay pageId={page?.id} locale={locale} /></div>
        <div className="mx-auto mb-4 max-w-3xl"><BodyDisplay initialHtml={page?.content_html || "<p></p>"} pageId={page?.id} locale={locale} /></div>
        <div className="flex justify-center"><SaveAllButton /></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {cards.map((item) => (
            <div key={item.id} className="relative">
              <Link href={item.href}>
                <ProductCardWithImage title={item.title} imageLink={item.hero_url} altText={item.hero_alt || item.title} buttonLabel="DETAYLAR" variant={1} aspectRatio="aspect-[16/16]" />
              </Link>
              <SignedIn><div className="absolute right-4 top-4"><EditButton onClick={() => setEditing(item)} /></div></SignedIn>
            </div>
          ))}
          <SignedIn>
            <button type="button" onClick={createCard} disabled={creating} className="my-6 flex min-h-[360px] w-full items-center justify-center rounded-lg border-4 border-dashed border-primary100 bg-white text-7xl font-bold text-primary900 shadow transition hover:bg-primary50 disabled:cursor-not-allowed disabled:opacity-60" aria-label="Yeni ürün kartı ekle">
              {creating ? "..." : "+"}
            </button>
          </SignedIn>
        </div>
      </div>
      {editing && <CardEditor item={editing} locale={locale} onClose={() => setEditing(null)} onSaved={(next) => setCards((prev) => prev.map((card) => card.id === next.id ? next : card))} onDeleted={(id) => setCards((prev) => prev.filter((card) => card.id !== id))} />}
    </PageEditProvider>
  );
}
