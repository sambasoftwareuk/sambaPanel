import React from "react";
import Link from "next/link";
import Icon from "../_atoms/Icon";
import { IconOnlyButton } from "../_atoms/Buttons";
import { Home, TurkishFlag, UKFlag } from "../_atoms/Icons";
import navLinks from "../constants/navLinks";
import { LogoImage } from "../_atoms/Images";
import Logo from "../constants/logo.json";
import { UserButton } from "@clerk/nextjs";

const DesktopNavbar = () => {
  return (
    <header className="w-full border-b bg-white shadow-sm">
      <nav className="flex items-center justify-between px-4 md:px-8 py-3 gap-2 max-w-full">
        {/* Logo */}
        <div className="ml-[10%]">
          <Link href="/">
            <LogoImage imageLink={Logo.imageLink} width={200} height={40} />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden xl:flex flex-grow justify-center items-center ">
          <Link href="/">
            <IconOnlyButton icon={<Icon variant={Home} size={20} />} />
          </Link>
          {navLinks.map(({ label, href, className, dropdown }) => (
            <div key={label} className="relative group">
              <Link
                href={href}
                className={`p-3 text-md font-medium whitespace-nowrap text-secondary hover:text-primary900 hover:bg-primary50 rounded-sm transition-colors duration-200 ${
                  className || ""
                }`}
              >
                {label}
              </Link>

              {dropdown && dropdown.length > 0 && (
                <div className="absolute left-0 top-full mt-1 hidden group-hover:block bg-white border shadow-md rounded-md z-20 min-w-[200px]">
                  {dropdown.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary50 hover:text-primary900"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Divider */}
          <span className="inline-block w-px h-7 bg-gray-300 mx-3" />

          {/* Icons */}
          {/* <div className="flex">
            <IconOnlyButton icon={<Icon variant={TurkishFlag} size={24} />} />
            <IconOnlyButton icon={<Icon variant={UKFlag} size={22} />} />
          </div> */}
        </div>
        <div><UserButton /></div>
      </nav>
    </header>
  );
};

export default DesktopNavbar;
