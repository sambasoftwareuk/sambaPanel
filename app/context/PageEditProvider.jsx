"use client";

import { createContext, useContext, useState, useMemo } from "react";

const PageEditContext = createContext(null);

export function PageEditProvider({
  initialTitle,
  initialBody,
  initialHeroUrl,
  initialHeroAlt,
  initialHeroMediaId,
  pageId,
  locale,
  children,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [bodyHtml, setBodyHtml] = useState(initialBody);
  const [heroUrl, setHeroUrl] = useState(initialHeroUrl);
  const [heroAlt, setHeroAlt] = useState(initialHeroAlt);
  const [heroMediaId, setHeroMediaId] = useState(initialHeroMediaId);
  const [baseline, setBaseline] = useState({
    title: initialTitle,
    bodyHtml: initialBody,
    heroUrl: initialHeroUrl,
    heroAlt: initialHeroAlt,
    heroMediaId: initialHeroMediaId,
  });
  const [saving, setSaving] = useState(false); // ✅ added saving state

  function resetTitle() {
    setTitle(baseline.title);
  }
  function resetBody() {
    setBodyHtml(baseline.bodyHtml);
  }
  function resetHero() {
    setHeroUrl(baseline.heroUrl);
    setHeroAlt(baseline.heroAlt);
    setHeroMediaId(baseline.heroMediaId);
  }

  const isDirty = useMemo(
    () =>
      title !== baseline.title ||
      bodyHtml !== baseline.bodyHtml ||
      heroUrl !== baseline.heroUrl ||
      heroAlt !== baseline.heroAlt ||
      heroMediaId !== baseline.heroMediaId,
    [title, bodyHtml, heroUrl, heroAlt, heroMediaId, baseline]
  );

  const markSaved = () =>
    setBaseline({
      title,
      bodyHtml,
      heroUrl,
      heroAlt,
      heroMediaId,
    });

  async function handleSave() {
    if (!isDirty) return;
    setSaving(true); // start saving
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content_html: bodyHtml,
          hero_media_id: heroMediaId,
          locale,
        }),
      });
      if (!res.ok) throw new Error("API error");
      markSaved();
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  }

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

        resetTitle,
        resetBody,
        resetHero,
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
