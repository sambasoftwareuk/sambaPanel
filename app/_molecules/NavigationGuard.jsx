"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePageEdit } from "./PageEditProvider";

export function NavigationGuard() {
  const { isDirty, handleSave, saving } = usePageEdit();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [pendingHref, setPendingHref] = useState("");

  const bypassRef = useRef(false); // true = bypass guard
  const currentUrlRef = useRef(""); // track current URL for popstate

  // Track current URL
  useEffect(() => {
    currentUrlRef.current =
      window.location.pathname + window.location.search + window.location.hash;
  }, []);

  // Warn before tab close / refresh
  useEffect(() => {
    if (!isDirty) return;

    const onBeforeUnload = (e) => {
      if (bypassRef.current) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [isDirty]);

  // Intercept internal link clicks
  useEffect(() => {
    if (!isDirty) return;

    const handleClick = (e) => {
      if (bypassRef.current || e.defaultPrevented) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = e.target?.closest("a[href]");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);

      // Only handle same-origin, non-download, non-target links
      if (
        url.origin !== window.location.origin ||
        (anchor.target && anchor.target !== "_self") ||
        anchor.hasAttribute("download")
      )
        return;

      const dest = url.pathname + url.search + url.hash;
      if (dest === currentUrlRef.current) return;

      e.preventDefault();
      setPendingHref(dest);
      setShowModal(true);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  // Handle back/forward navigation
  useEffect(() => {
    if (!isDirty) return;

    const handlePopState = () => {
      if (bypassRef.current) return;
      const attemptedUrl =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      history.pushState(null, "", currentUrlRef.current);
      setPendingHref(attemptedUrl);
      setShowModal(true);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty]);

  // Handlers
  const handleLeaveWithoutSaving = () => {
    if (!pendingHref) return setShowModal(false);
    bypassRef.current = true;
    setShowModal(false);
    router.push(pendingHref);
  };

  const handleSaveAndLeave = async () => {
    if (!pendingHref) return setShowModal(false);
    await handleSave();
    handleLeaveWithoutSaving();
  };

  const handleCancel = () => {
    setShowModal(false);
    setPendingHref(null);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unsaved-changes-title"
      aria-describedby="unsaved-changes-desc"
    >
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl border">
        <h3 id="unsaved-changes-title" className="text-lg font-semibold mb-2">
          You have unsaved changes
        </h3>
        <p id="unsaved-changes-desc" className="text-sm text-gray-700 mb-4">
          You have unsaved changes. Leaving this page will discard them.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancel}
            className="rounded bg-green-500 text-white border px-3 py-1 text-sm"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleLeaveWithoutSaving}
            className="rounded bg-red border text-white px-3 py-1 text-sm"
            disabled={saving}
          >
            Leave without Saving
          </button>
          <button
            onClick={handleSaveAndLeave}
            className="rounded bg-black text-white px-3 py-1 text-sm disabled:opacity-60"
            disabled={saving}
          >
            {saving ? "Saving…" : "Save & Leave"}
          </button>
        </div>
      </div>
    </div>
  );
}
