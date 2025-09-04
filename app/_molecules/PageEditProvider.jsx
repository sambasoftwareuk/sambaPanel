"use client";

import { createContext, useContext, useState } from "react";

const PageEditContext = createContext();

export function PageEditProvider({ children, initialTitle, initialBody }) {
  const [title, setTitle] = useState(initialTitle);
  const [bodyHtml, setBodyHtml] = useState(initialBody);

  return (
    <PageEditContext.Provider
      value={{ title, setTitle, bodyHtml, setBodyHtml }}
    >
      {children}
    </PageEditContext.Provider>
  );
}

export function usePageEdit() {
  const ctx = useContext(PageEditContext);
  if (!ctx) {
    throw new Error("usePageEdit must be used inside PageEditProvider");
  }
  return ctx;
}
