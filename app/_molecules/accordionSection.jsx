"use client";
import React, { useState } from "react";
import { DownArrowIcon, UpArrowIcon } from "../_atoms/Icons";

import Link from "next/link";
import Icon from "../_atoms/Icon";

export function AccordionSection({
  title,
  href,
  links = [],
  linkColor,
  linkUnderline,
  hoverBg,
  className = "",
  showArrowOnlyIfDropdown = false,
  onLinkClick,
  isActive = false,
  activePath = "",
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Parent link */}
      <div
        className={`flex justify-between items-center px-2 py-2 cursor-pointer rounded-lg 
          ${hoverBg}
          ${isActive ? "font-semibold text-primary500" : ""}
        `}
        onClick={() => {
          if (!links.length && href) onLinkClick?.();
          if (links.length) setIsOpen(!isOpen);
        }}
      >
        {href ? (
          <Link href={href} onClick={onLinkClick} className="flex-1">
            {title}
          </Link>
        ) : (
          <span className="flex-1">{title}</span>
        )}

        {showArrowOnlyIfDropdown && links.length > 0 && (
          <span className="ml-2 transform transition-transform duration-200">
            {isOpen ? (
              <Icon variant={UpArrowIcon} size={24} />
            ) : (
              <Icon variant={DownArrowIcon} size={24} />
            )}
          </span>
        )}
      </div>

      {/* Dropdown links */}
      {isOpen && links.length > 0 && (
        <div className="ml-6 mt-2 space-y-2">
          {links.map((link, i) => {
            const isChildActive = activePath === link.href;
            return (
              <Link
                key={i}
                href={link.href}
                onClick={onLinkClick}
                className={`block px-2 py-1 
                  
                  ${
                    isChildActive
                      ? "font-semibold text-primary500 underline"
                      : ""
                  }
                `}
              >
                {link.label}
                {linkUnderline === "always" && (
                  <hr className="border-b-1 border-gray-200 my-1" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
