// app/_context/EditSessionContext.jsx
"use client";

import { createContext, useContext, useMemo, useRef, useState } from "react";

const EditSessionContext = createContext(null);

// Alan -> Grup eşleşmesi (counter tek olsun diye content_html + content_json aynı grupta)
const GROUPS = {
  title: "title",
  content_html: "content",
  content_json: "content",
  hero_url: "hero",
  hero_alt: "hero",
  hero_media_id: "hero",
};
const groupOf = (k) => GROUPS[k] || k;

// JSON alanları için karşılaştırma normalizasyonu
const normalize = (key, val) => {
  if (key.endsWith("_json")) {
    if (val == null) return null;
    if (typeof val === "string") return val;
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return val;
};

export function EditSessionProvider({ pageId, locale, initial, children }) {
  const [draft, setDraft] = useState(() => ({ ...initial }));
  const [dirty, setDirty] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // initial değerini referansta bir kez sakla (karşılaştırma ve reset için)
  const initialRef = useRef(null);
  if (initialRef.current === null) {
    const obj = { ...initial };
    if (obj.content_json && typeof obj.content_json !== "string") {
      try { obj.content_json = JSON.stringify(obj.content_json); } catch {}
    }
    initialRef.current = obj;
  }

  function markDirty(nextDirty, key, value) {
    const nv = normalize(key, value);
    const iv = normalize(key, initialRef.current?.[key]);
    if (nv === iv) {
      // Eski değere döndüyse kirlenmeyi kaldır
      const { [key]: _omit, ...rest } = nextDirty;
      return rest;
    }
    return { ...nextDirty, [key]: true };
  }

  // Tek alan güncelle
  function setField(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setDirty((prev) => markDirty(prev, key, value));
  }

  // Birden fazla alanı birlikte güncelle (örn. content_html + content_json)
  function setFields(obj) {
    setDraft((prev) => ({ ...prev, ...obj }));
    setDirty((prev) => {
      let next = { ...prev };
      for (const [k, v] of Object.entries(obj)) {
        next = markDirty(next, k, v);
      }
      return next;
    });
  }

  function reset() {
    setDraft({ ...initialRef.current });
    setDirty({});
    setError("");
  }

  const dirtyGroups = useMemo(() => {
    const set = new Set(Object.keys(dirty).map(groupOf));
    return Array.from(set);
  }, [dirty]);

  const dirtyCount = dirtyGroups.length;

  async function saveAll() {
    const changedKeys = Object.keys(dirty);
    if (changedKeys.length === 0) return true;

    const payload = { locale };
    for (const k of changedKeys) {
      const v = draft[k];
      payload[k] = k.endsWith("_json") && typeof v !== "string" ? JSON.stringify(v) : v;
    }

    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Kaydedilemedi");
      }
      setDirty({});
      return true;
    } catch (e) {
      setError(e?.message || "Kaydedilemedi");
      return false;
    } finally {
      setSaving(false);
    }
  }

  const value = useMemo(
    () => ({
      pageId,
      locale,
      draft,
      setField,
      setFields,
      dirty,        // kirlenen alanlar (ham)
      dirtyGroups,  // kirlenen gruplar (title, content, hero…)
      dirtyCount,   // gruplara göre sayaç
      reset,
      saveAll,
      saving,
      error,
    }),
    [pageId, locale, draft, dirty, dirtyGroups, dirtyCount, saving, error]
  );

  return (
    <EditSessionContext.Provider value={value}>
      {children}
    </EditSessionContext.Provider>
  );
}

export function useEditSession() {
  const ctx = useContext(EditSessionContext);
  if (!ctx) throw new Error("useEditSession must be used inside EditSessionProvider");
  return ctx;
}
