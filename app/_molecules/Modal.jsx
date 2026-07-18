"use client";
import React, { useEffect } from "react";

const Modal = ({ onClose, children }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.dataset.modalOpen = "true";
    return () => {
      document.body.style.overflow = "";
      delete document.body.dataset.modalOpen;
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center"
    >
        {children}
    </div>
  );
};

export default Modal;
