"use client";

import { createContext, useContext, useState, useMemo } from "react";

const PageEditContext = createContext(null);

export function PageEditProvider({ initialTitle, initialBody, children }) {
  const [title, setTitle] = useState(initialTitle);
  const [bodyHtml, setBodyHtml] = useState(initialBody);

  // ✅ Baseline (kaydedilmiş son değerler)
  const [baseline, setBaseline] = useState({
    title: initialTitle,
    bodyHtml: initialBody,
  });

  // ✅ isDirty: sadece title veya body değişmişse true
  const isDirty = useMemo(() => {
    return title !== baseline.title || bodyHtml !== baseline.bodyHtml;
  }, [title, bodyHtml, baseline]);

  // ✅ Save sonrası baseline güncelleyici
  const markSaved = () => {
    setBaseline({ title, bodyHtml });
  };

  const value = {
    title,
    setTitle,
    bodyHtml,
    setBodyHtml,
    isDirty,
    markSaved,
  };

  return (
    <PageEditContext.Provider value={value}>
      {children}
    </PageEditContext.Provider>
  );
}

export function usePageEdit() {
  const ctx = useContext(PageEditContext);
  if (!ctx) {
    throw new Error("usePageEdit must be used within PageEditProvider");
  }
  return ctx;
}
