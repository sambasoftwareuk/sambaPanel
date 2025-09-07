"use client";
import { useEffect } from "react";
import { usePageEdit } from "./PageEditProvider";

export function NavigationGuard() {
  const { isDirty } = usePageEdit();

  useEffect(() => {
    if (!isDirty) return;

    const handleLinkClick = (e) => {
      const link = e.target.closest("a"); // only links
      if (!link) return;

      const confirmLeave = confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) {
        e.preventDefault(); // stop navigation
        e.stopImmediatePropagation();
      }
    };

    document.addEventListener("click", handleLinkClick, true);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [isDirty]);

  return null;
}
