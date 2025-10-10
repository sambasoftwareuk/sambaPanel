"use client";

import { createContext, useContext, useState, useMemo, useRef } from "react";

const PageEditContext = createContext(null);

export function PageEditProvider({
  initialTitle,
  initialBody,
  initialHeroUrl,
  initialHeroAlt,
  initialHeroMediaId,
  initialSideMenu,
  pageId,
  locale,
  baseHref,
  children,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [bodyHtml, setBodyHtml] = useState(initialBody);
  const [heroUrl, setHeroUrl] = useState(initialHeroUrl);
  const [heroAlt, setHeroAlt] = useState(initialHeroAlt);
  const [heroMediaId, setHeroMediaId] = useState(initialHeroMediaId);
  const [deletedImages, setDeletedImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [sideMenu, setSideMenu] = useState(initialSideMenu);
  const [sideMenuDirty, setSideMenuDirty] = useState(false);
  const [sideMenuSaving, setSideMenuSaving] = useState(false);

  // Baseline'ı useRef ile sakla (render tetiklemez)
  const baselineRef = useRef({
    title: initialTitle,
    bodyHtml: initialBody,
    heroUrl: initialHeroUrl,
    heroAlt: initialHeroAlt,
    heroMediaId: initialHeroMediaId,
  });

  const isDirty = useMemo(() => {
    const base = baselineRef.current;
    return (
      title !== base.title ||
      bodyHtml !== base.bodyHtml ||
      heroUrl !== base.heroUrl ||
      heroAlt !== base.heroAlt ||
      heroMediaId !== base.heroMediaId ||
      sideMenuDirty ||
      deletedImages.length > 0
    );
  }, [
    title,
    bodyHtml,
    heroUrl,
    heroAlt,
    heroMediaId,
    sideMenuDirty,
    deletedImages,
  ]);

  const updateSideMenuTitle = (sectionIndex, newTitle) => {
    setSideMenu((prev) => {
      if (!prev) return prev;
      return prev.map((section, idx) =>
        idx === sectionIndex
          ? {
              ...section,
              title: newTitle,
              menu_key: baseHref || "urunler", // baseHref'i kullan
            }
          : section
      );
    });
    setSideMenuDirty(true);
  };

  const markSaved = () => {
    baselineRef.current = {
      title,
      bodyHtml,
      heroUrl,
      heroAlt,
      heroMediaId,
    };
    setDeletedImages([]);
    setSideMenuDirty(false);
  };

  const resetSideMenu = () => {
    setSideMenu(initialSideMenu);
    setSideMenuDirty(false);
  };

  // Helper function for API call
  const patchSideMenu = async (sideMenu, locale) => {
    const res = await fetch(`/api/side-menu`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ side_menu: sideMenu, locale }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`SideMenu API error: ${res.status} - ${errorText}`);
    }
  };

  // SideMenu için ayrı save fonksiyonu
  async function handleSideMenuSave() {
    if (!sideMenuDirty) return;
    setSideMenuSaving(true);
    try {
      await patchSideMenu(sideMenu, locale);
      setSideMenuDirty(false);
    } catch (err) {
      console.error("SideMenu save failed:", err);
    } finally {
      setSideMenuSaving(false);
    }
  }

  async function handleSave() {
    if (!isDirty) return;
    setSaving(true);
    try {
      // Silinen resimleri kontrol et
      for (const img of deletedImages) {
        if (heroMediaId === img.id) setHeroMediaId(null);
      }
      // API'ye gönder
      const requestBody = {
        title,
        content_html: bodyHtml,
        hero_media_id: heroMediaId,
        locale,
      };

      // Sadece sideMenu değiştiyse ekle
      if (sideMenuDirty) {
        requestBody.side_menu = sideMenu;
      }

      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error("API error");

      // Silinen resimleri API’den temizle
      for (const img of deletedImages) {
        try {
          await fetch(`/api/media?id=${img.id}`, { method: "DELETE" });
        } catch (e) {
          console.error("Resim silinemedi:", e);
        }
      }

      setDeletedImages([]);
      baselineRef.current = { title, bodyHtml, heroUrl, heroAlt, heroMediaId }; // mark as saved
      setSideMenuDirty(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

  const resetTitle = () => setTitle(baselineRef.current.title);
  const resetBody = () => setBodyHtml(baselineRef.current.bodyHtml);
  const resetHero = () => {
    setHeroUrl(baselineRef.current.heroUrl);
    setHeroAlt(baselineRef.current.heroAlt);
    setHeroMediaId(baselineRef.current.heroMediaId);
  };

  return (
    <PageEditContext.Provider
      value={{
        title,
        setTitle,
        bodyHtml,
        setBodyHtml,
        heroUrl,
        setHeroUrl,
        heroAlt,
        setHeroAlt,
        heroMediaId,
        setHeroMediaId,
        isDirty,
        saving,
        handleSave,
        deletedImages,
        setDeletedImages,
        resetTitle,
        resetBody,
        resetHero,
        sideMenu,
        updateSideMenuTitle,
        sideMenuDirty,
        handleSideMenuSave,
        sideMenuSaving,
        resetSideMenu,
        pageId,
        locale,
        baseHref,
      }}
    >
      {children}
    </PageEditContext.Provider>
  );
}

export function usePageEdit() {
  const ctx = useContext(PageEditContext);
  if (!ctx) throw new Error("usePageEdit must be used within PageEditProvider");
  return ctx;
}
