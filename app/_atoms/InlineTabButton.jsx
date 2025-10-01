import { BaseButton } from "./Buttons";

export default function InlineTabButton({
  label,
  isActive = false,
  onClick,
  disabled = false,
}) {
  return (
    <BaseButton
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 text-sm rounded transition-colors ${
        isActive
          ? "bg-black text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {label}
    </BaseButton>
  );
}
