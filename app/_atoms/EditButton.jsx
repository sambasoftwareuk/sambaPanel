"use client";

import React from "react";
import { EditIcon } from "./Icons";

const EditButton = ({ onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 text-secondary400 bg-secondary100 rounded-full hover:bg-secondary200 transition-colors duration-200 shadow-lg ${className}`}
      title="Düzenle"
    >
      <EditIcon />
    </button>
  );
};

export default EditButton;
