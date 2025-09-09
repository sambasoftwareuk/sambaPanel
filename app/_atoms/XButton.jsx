"use client";

import React from "react";
import { XIcon } from "./Icons";

const XButton = ({ onClick, className = "", title = "İptal" }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-white bg-red rounded-full hover:bg-red-200 transition-colors duration-200 shadow-lg ${className}`}
      title={title}
    >
      <XIcon />
    </button>
  );
};

export default XButton;
