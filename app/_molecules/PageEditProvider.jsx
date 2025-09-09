"use client";

import { createContext, useContext, useState, useMemo } from "react";

const PageEditContext = createContext(null);

export function PageEditProvider({
  initialTitle,
  initialBody,
  pageId,
  locale,
  children,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [bodyHtml, setBodyHtml] = useState(initialBody);
  const [baseline, setBaseline] = useState({
    title: initialTitle,
    bodyHtml: initialBody,
  });
  const [saving, setSaving] = useState(false); // ✅ added saving state

  function resetTitle() {
    setTitle(baseline.title);
  }
  function resetBody() {
    setBodyHtml(baseline.bodyHtml);
  }

  const isDirty = useMemo(
    () => title !== baseline.title || bodyHtml !== baseline.bodyHtml,
    [title, bodyHtml, baseline]
  );

  const markSaved = () => setBaseline({ title, bodyHtml });

  async function handleSave() {
    if (!isDirty) return;
    setSaving(true); // start saving
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content_html: bodyHtml, locale }),
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
        isDirty,
        saving,
        handleSave,

        resetTitle,
        resetBody,
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
