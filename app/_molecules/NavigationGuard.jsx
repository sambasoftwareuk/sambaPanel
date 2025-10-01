"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { usePageEdit } from "../context/PageEditProvider";
import { PrimaryButton } from "../_atoms/Buttons";

export function NavigationGuard() {
  const { isDirty, handleSave, saving } = usePageEdit();
  const router = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [pendingHref, setPendingHref] = useState("");

  const bypassRef = useRef(false);
  const currentUrlRef = useRef("");

  useEffect(() => {
    currentUrlRef.current =
      window.location.pathname + window.location.search + window.location.hash;
  }, []);

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

  useEffect(() => {
    if (!isDirty) return;
    const handleClick = (e) => {
      if (bypassRef.current || e.defaultPrevented) return;
      const anchor = e.target?.closest("a[href]");
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.href);
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

  useEffect(() => {
    if (!isDirty) return;
    const handlePopState = () => {
      if (bypassRef.current) return;
      const attemptedUrl =
        window.location.pathname + window.location.search + window.location.hash;
      history.pushState(null, "", currentUrlRef.current);
      setPendingHref(attemptedUrl);
      setShowModal(true);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isDirty]);

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
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl border">
        <h3 className="text-lg font-semibold mb-2">You have unsaved changes</h3>
        <p className="text-sm text-gray-700 mb-4">
          Leaving this page will discard unsaved changes.
        </p>
        <div className="flex justify-end gap-2">
          <PrimaryButton
            onClick={handleCancel}
            className=" bg-gray-900"
            disabled={saving}
            label="Cancel"
          />
          <PrimaryButton
            onClick={handleLeaveWithoutSaving}
            className=" bg-red "
            disabled={saving}
            label="Leave without Saving"
          />
          <PrimaryButton
            onClick={handleSaveAndLeave}
            className=""
            disabled={saving}
            label={saving ? "Saving…" : "Save & Leave"}
          />
        </div>
      </div>
    </div>
  );
}
