"use client";

import { BaseButton } from "./Buttons";

export default function ToolbarButton({
  onClick,
  active = false,
  children,
  title,
  className = "",
}) {
  return (
    <BaseButton
      type="button"
      title={title}
      onClick={onClick}
      className={`px-2 py-1 rounded border text-sm mr-1 mb-1 ${
        active ? "bg-gray-200" : "hover:bg-gray-50"
      } ${className}`}
    >
      {children}
    </BaseButton>
  );
}
