"use client";
import React from "react";

const Modal = ({ onClose, children }) => {
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
