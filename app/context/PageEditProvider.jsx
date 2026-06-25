"use client";

import { createContext, useContext, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { showError, showSuccess } from "../utils/toast";
import { resolveMediaScope } from "@/lib/mediaScope";
import { apiFetch } from "../utils/apiFetch";

const PageEditContext = createContext(null);

function itemTypeFromBaseHref(baseHref) {
  const map = {
    urunler: "product",
    hizmetler: "service",
    "yedek-parcalar": "spare",
  };
  return map[baseHref] || null;
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
  pageSlug,
}) {
  const router = useRouter();
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

  const mediaScope = useMemo(
    () => resolveMediaScope(pageSlug, baseHref),
    [pageSlug, baseHref]
  );

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

    if (!pageSlug) {
      showError("Cannot save: page slug is missing.");
      return;
    }

    setSaving(true);
    try {
      let nextHeroMediaId = heroMediaId;
      for (const img of deletedImages) {
        if (nextHeroMediaId === img.id) nextHeroMediaId = null;
      }
      if (nextHeroMediaId !== heroMediaId) {
        setHeroMediaId(nextHeroMediaId);
      }

      const requestBody = {
        title,
        content_html: bodyHtml,
        hero_media_id: nextHeroMediaId,
        locale,
        slug: pageSlug,
      };

      let endpoint;

      if (pageSlug === "kurumsal") {
        endpoint = "/api/corporate";
        if (sideMenuDirty) requestBody.side_menu = sideMenu;
      } else {
        const itemType = itemTypeFromBaseHref(baseHref);
        if (!itemType) {
          throw new Error(`Save is not supported for this page (baseHref: ${baseHref || "missing"})`);
        }
        endpoint = `/api/items/${pageSlug}`;
        requestBody.type = itemType;
      }

      console.log("[SaveAll] PATCH", endpoint, requestBody);

      const res = await apiFetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Save failed");
      }

      for (const img of deletedImages) {
        try {
          await apiFetch(`/api/media?id=${img.id}`, { method: "DELETE" });
        } catch (e) {
          console.error("Failed to delete image:", e);
        }
      }

      setDeletedImages([]);
      baselineRef.current = {
        title,
        bodyHtml,
        heroUrl,
        heroAlt,
        heroMediaId: nextHeroMediaId,
      };
      setSideMenuDirty(false);
      showSuccess("Changes saved successfully.");
      router.refresh();
    } catch (err) {
      console.error("Save failed:", err);
      showError(err.message || "Failed to save changes.");
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
