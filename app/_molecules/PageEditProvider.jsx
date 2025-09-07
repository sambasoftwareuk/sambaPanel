"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useMemo,
  useEffect,
} from "react";

const PageEditContext = createContext();

export function PageEditProvider({ children, initialTitle, initialBody }) {
  const [title, setTitle] = useState(initialTitle);
  const [bodyHtml, setBodyHtml] = useState(initialBody);

  const initialRef = useRef({ title: initialTitle, bodyHtml: initialBody });

  const isDirty = useMemo(() => {
    return (
      title !== initialRef.current.title ||
      bodyHtml !== initialRef.current.bodyHtml
    );
  }, [title, bodyHtml]);

  // // Warn user on page refresh or closing tab if there are unsaved changes
  // useEffect(() => {
  //   const handleBeforeUnload = (e) => {
  //     if (isDirty) {
  //       e.preventDefault();
  //       e.returnValue = ""; // required for Chrome
  //     }
  //   };
  //   window.addEventListener("beforeunload", handleBeforeUnload);
  //   return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  // }, [isDirty]);

  return (
    <PageEditContext.Provider
      value={{ title, setTitle, bodyHtml, setBodyHtml, isDirty }}
    >
      {children}
    </PageEditContext.Provider>
  );
}

export function usePageEdit() {
  const ctx = useContext(PageEditContext);
  if (!ctx) throw new Error("usePageEdit must be used inside PageEditProvider");
  return ctx;
}
