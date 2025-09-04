"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEditSession } from "../_context/EditSessionContext";

export default function UnsavedChangesGuard() {
  const { dirtyCount, saveAll, saving } = useEditSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState(null);

  const bypassRef = useRef(false);         // true iken guard devre dışı (bilerek çık)
  const currentUrlRef = useRef("");

  // Mevcut URL'yi takip et (geri/ileri yakalamada lazım)
  useEffect(() => {
    currentUrlRef.current = window.location.pathname + window.location.search + window.location.hash;
  }, [pathname, searchParams]);

  // Sekmeyi kapatma / yenileme uyarısı
  useEffect(() => {
    if (dirtyCount === 0) return;
    const onBeforeUnload = (e) => {
      if (bypassRef.current) return;
      e.preventDefault();
      e.returnValue = ""; // bazı tarayıcılar için gerekli
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirtyCount]);

  // İç link tıklamalarını yakala
  useEffect(() => {
    if (dirtyCount === 0) return;

    const onClick = (e) => {
      if (bypassRef.current) return;
      if (e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target?.closest?.("a[href]");
      if (!a) return;

      // Dış linkler, yeni sekme vs. bypass
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (a.target && a.target !== "_self") return;
      if (a.hasAttribute("download")) return;

      // Aynı sayfaya anchor/jump ise bırak
      const dest = url.pathname + url.search + url.hash;
      const here = window.location.pathname + window.location.search + window.location.hash;
      if (dest === here) return;

      // Navigasyonu durdur, modal aç
      e.preventDefault();
      setPendingUrl(dest);
      setOpen(true);
    };

    document.addEventListener("click", onClick, true); // capture fazı
    return () => document.removeEventListener("click", onClick, true);
  }, [dirtyCount]);

  // Geri/ileri (popstate) yakala
  useEffect(() => {
    if (dirtyCount === 0) return;

    const onPopState = () => {
      if (bypassRef.current) return;
      const attempted = window.location.pathname + window.location.search + window.location.hash;
      // Eski URL'ye dön (navigasyonu iptal et)
      history.pushState(null, "", currentUrlRef.current);
      // Hedefi sakla, modal aç
      setPendingUrl(attempted);
      setOpen(true);
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [dirtyCount]);

  async function handleLeaveAnyway() {
    if (!pendingUrl) return setOpen(false);
    bypassRef.current = true;
    setOpen(false);
    router.push(pendingUrl);
  }

  async function handleSaveAndLeave() {
    const ok = await saveAll();
    if (ok) {
      await handleLeaveAnyway();
    }
  }

  function handleStay() {
    setOpen(false);
    setPendingUrl(null);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl border">
        <h3 className="text-lg font-semibold mb-2">Kaydedilmemiş değişiklikler var</h3>
        <p className="text-sm text-gray-700 mb-4">
          Değişiklikleri kaydetmediniz. Bu sayfadan ayrılırsanız yaptığınız taslak değişiklikler kaybolacak.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleStay}
            className="rounded border px-3 py-1 text-sm"
            disabled={saving}
          >
            Vazgeç
          </button>
          <button
            onClick={handleLeaveAnyway}
            className="rounded border px-3 py-1 text-sm"
            disabled={saving}
          >
            Yine de Çık
          </button>
          <button
            onClick={handleSaveAndLeave}
            className="rounded bg-black text-white px-3 py-1 text-sm disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Kaydediliyor…" : "Değişiklikleri Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
