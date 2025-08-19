import React from "react";
import * as Icons from "./Icons";

const Icon = ({
  variant,
  size = 24,
  color = "text-current",
  className = "",
}) => {
  // Eğer variant bir component ise, doğrudan kullan
  if (typeof variant === "function") {
    const IconComponent = variant;
    return (
      <IconComponent
        style={{ width: size, height: size }}
        className={`${color} ${className}`}
      />
    );
  }

  // Eğer variant bir string ise, Icons objesinden bul
  const IconComponent = Icons[variant];

  if (!IconComponent) {
    console.warn(`Icon variant "${variant}" not found`);
    return null;
  }

  return (
    <IconComponent
      style={{ width: size, height: size }}
      className={`${color} ${className}`}
    />
  );
};

export default Icon;
