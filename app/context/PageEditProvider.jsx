"use client";

import { createContext, useContext, useState, useMemo, useRef } from "react";

const PageEditContext = createContext(null);

// 👉 İSTER AYRI DOSYAYA KOY (lib/scope.js) İSTER ŞİMDİLİK BURADA DURSUN
function scopeFromPage(slug) {
  if (!slug) return "gallery";
  if (slug === "kurumsal" || slug === "about-us" || slug === "corporate") return "kurumsal";
  if (slug.startsWith("urun") || slug.startsWith("products")) return "product";
  if (slug.startsWith("hizmet") || slug.startsWith("services")) return "service";
  if (slug.startsWith("yedek") || slug.includes("spare")) return "spare";
  if (slug.startsWith("iletisim") || slug.startsWith("contact")) return "contact";
  return "gallery";
}

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
  pageSlug,                    // ← zaten geliyordu
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

  // ⭐️ YENİ: scope’u sayfa slug’ından türet
  const mediaScope = useMemo(() => scopeFromPage(pageSlug), [pageSlug]);

  // (İsteğe bağlı) İlk değeri “dondurmak” istersen:
  // const mediaScopeStable = useRef(mediaScope).current;

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
  }, [title, bodyHtml, heroUrl, heroAlt, heroMediaId, sideMenuDirty, deletedImages]);

  const updateSideMenuTitle = (sectionIndex, newTitle) => {
    setSideMenu((prev) => {
      if (!prev) return prev;
      return prev.map((section, idx) =>
        idx === sectionIndex
          ? { ...section, title: newTitle, menu_key: baseHref || "urunler" }
          : section
      );
    });
    setSideMenuDirty(true);
  };

  const markSaved = () => {
    baselineRef.current = { title, bodyHtml, heroUrl, heroAlt, heroMediaId };
    setDeletedImages([]);
    setSideMenuDirty(false);
  };

  const resetSideMenu = () => {
    setSideMenu(initialSideMenu);
    setSideMenuDirty(false);
  };

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
      for (const img of deletedImages) {
        if (heroMediaId === img.id) setHeroMediaId(null);
      }
      const requestBody = {
        title,
        content_html: bodyHtml,
        hero_media_id: heroMediaId,
        locale,
        slug: pageSlug,
      };
      if (sideMenuDirty) requestBody.side_menu = sideMenu;

      const res = await fetch(`/api/${pageSlug === "kurumsal" ? "corporate" : ""}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!res.ok) throw new Error("API error");

      for (const img of deletedImages) {
        try {
          await fetch(`/api/media?id=${img.id}`, { method: "DELETE" });
        } catch (e) {
          console.error("Resim silinemedi:", e);
        }
      }

      setDeletedImages([]);
      baselineRef.current = { title, bodyHtml, heroUrl, heroAlt, heroMediaId };
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
        title, setTitle,
        bodyHtml, setBodyHtml,
        heroUrl, setHeroUrl,
        heroAlt, setHeroAlt,
        heroMediaId, setHeroMediaId,
        isDirty, saving, handleSave,
        deletedImages, setDeletedImages,
        resetTitle, resetBody, resetHero,
        sideMenu, updateSideMenuTitle,
        sideMenuDirty, handleSideMenuSave,
        sideMenuSaving, resetSideMenu,
        pageId, locale, baseHref, pageSlug,

        // ⭐️ YENİ: Artık context'te
        mediaScope, 
        // mediaScope: mediaScopeStable, // (opsiyonel “freeze”)
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
