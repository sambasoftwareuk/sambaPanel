"use client";
import { useState } from "react";
import { SambaLinks } from "../_atoms/SambaLinks";
import { DownArrowIcon, UpArrowIcon } from "../_atoms/Icons";
import Icon from "../_atoms/Icon";

export const AccordionSection = ({
  title,
  links = [],
  linkColor = "white",
  linkUnderline = "hover",
  hoverBg = "",
  className = "",
  showArrowOnlyIfDropdown = false, // NEW PROP
}) => {
  const [open, setOpen] = useState(false);
  const hasDropdown = links.length > 0;

  const shouldShowArrow = showArrowOnlyIfDropdown ? hasDropdown : true;

  return (
    <div className={className}>
      <button
        className="w-full text-left py-2 font-semibold text-[16px] flex justify-between items-center"
        onClick={() => hasDropdown && setOpen((prev) => !prev)}
      >
        {title}
        {shouldShowArrow && (
          <span>
            {open ? (
              <Icon variant={UpArrowIcon} size={24} />
            ) : (
              <Icon variant={DownArrowIcon} size={24} />
            )}
          </span>
        )}
      </button>

      {hasDropdown && open && (
        <ul className="space-y-1 text-[16px]">
          {links.map((item, index) => {
            const isObject = typeof item === "object" && item !== null;
            const label = isObject ? item.label : item;
            const href = isObject ? item.href : "#";

            return (
              <li key={href || index}>
                <SambaLinks
                  href={href}
                  underline={linkUnderline}
                  color={linkColor}
                  hoverBg={hoverBg}
                >
                  {label}
                </SambaLinks>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
