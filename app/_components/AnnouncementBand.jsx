import React from "react";
import Link from "next/link";
import { socialIcons } from "../_atoms/Icons";
import CompanyAddress from "./CompanyAddress";

const AnnouncementBand = () => {
  return (
    <div
      className="
        hidden lg:flex
        w-full bg-primary h-12
        items-center gap-10
        px-4 text-md text-black
        
        text-sm md:text-base lg:text-md
      "
    >
      <div className="flex gap-2 ml-[15%]">
        {socialIcons?.map(({ href, svg, alt, bgColor }) => (
          <Link
            key={alt}
            href={href}
            target="_blank"
            aria-label={alt}
            rel="noopener noreferrer"
            className="transition-transform transform hover:scale-125"
          >
            <div
              style={{ backgroundColor: bgColor }}
              className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-full"
            >
              {svg}
            </div>
          </Link>
        ))}
      </div>

      <CompanyAddress className="flex flex-wrap items-center justify-center text-white text-xs md:text-sm lg:text-base text-center gap-0" />
    </div>
  );
};

export default AnnouncementBand;
