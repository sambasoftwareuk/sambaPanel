import React from "react";
import Link from "next/link";
import Icon from "../_atoms/Icon";
import { LineRightArrow } from "../_atoms/Icons";

export const CardWithIcon = ({
  icon,
  title,
  description,
  linkText,
  linkHref,
  badge,
}) => {
  return (
    <div className="flex gap-4 p-5 rounded-lg border w-full max-w-md   border-primary900  hover:border-gray-200  bg-white  hover:bg-secondary100 hover:shadow-md transition-colors">
      {/* Icon */}
      <div className="text-5xl">
        <Icon variant={icon} color="text-secondary400" size={45} />
      </div>
      {/* Content */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray900">{title}</h3>
          {badge && (
            <span className="text-xs font-medium bg-gray-50 text-primary900 border border-primary500 rounded px-2 py-0.5">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm  text-secondary mt-1">{description}</p>
        {linkHref && linkText && (
          <Link
            href="#"
            className="text-sm text-primary900 font-medium mt-2 flex items-center gap-1 hover:underline"
          >
            {linkText}
            <span aria-hidden="true">
              <Icon
                variant={LineRightArrow}
                color="text-primary900"
                size={25}
              />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};
