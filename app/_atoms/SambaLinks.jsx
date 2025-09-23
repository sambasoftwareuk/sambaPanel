import Link from "next/link";

export function SambaLinks({
  children,
  href = "#",
  className = "",
  color = "primary900",
  underline = "hover", // "always" | "hover" | "none
  hoverBg = "",

  ...props
}) {
  const baseColor = {
    white: "text-white hover:text-gray-200",
    black: "text-black hover:text-gray-800",
    primary900: "text-primary900 hover:text-primary",
    secondary: "text-secondary hover:text-secondary400",
    sunshine: "text-sunshine hover:text-sunshine100",
  };

  const underlineStyle = {
    always: "underline",
    hover: "hover:underline",
    none: "",
  };

  const computedClassName = `
    block w-full transition-colors cursor-pointer
    ${baseColor[color] || ""}
    ${underlineStyle[underline] || ""}
    ${hoverBg}
    ${className}
  `;

  return (
    <Link href={href} {...props} className={computedClassName}>
      {children}
    </Link>
  );
}
