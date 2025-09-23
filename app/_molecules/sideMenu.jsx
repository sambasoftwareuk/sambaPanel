"use client";

import React, { useState } from "react";
import { SambaLinks } from "../_atoms/SambaLinks";

export const SideMenu = ({ menu, activeHref }) => (
  <aside className="w-64 bg-white  p-0 hidden md:block">
    {menu?.map((section, idx) => (
      <div key={idx} className="mb-0">
        <div
          className={`font-bold px-4 py-3 ${
            section.href
              ? "bg-primary900 text-white"
              : "bg-primary50 text-primary"
          }`}
        >
          {section.href ? (
            <SambaLinks href={section.href} color="white" underline="none">
              {section.title}
            </SambaLinks>
          ) : (
            section.title
          )}
        </div>
        {section.items && (
          <ul className="space-y-0 border rounded mb-6">
            {section.items.map((item, i) => (
              <li key={i}>
                <SambaLinks
                  href={item.href}
                  color="primary900"
                  underline="none"
                  hoverBg="hover:bg-primary hover:text-white"
                  className={`block px-6 py-2 transition-colors ${
                    activeHref === item.href ? "bg-primary text-white" : ""
                  }`}
                >
                  {item.label}
                </SambaLinks>
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </aside>
);

// Mobile Accordion
export const MobileSideMenu = ({ menu, activeHref }) => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <aside className="w-full bg-white border rounded p-0 md:hidden">
      {menu.map((section, idx) => (
        <div key={idx} className="border-b relative">
          <button
            className={`w-full flex items-center justify-between px-4 py-3 text-left font-bold ${
              openIndex === idx
                ? "bg-primary900 text-white"
                : "bg-white text-primary"
            }`}
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
          >
            <span>{section.title}</span>
            <span className="ml-2">{openIndex === idx ? "▲" : "▼"}</span>
          </button>
          {openIndex === idx && section.items && (
            <ul className="space-y-0 bg-white absolute z-10 w-full shadow-md">
              {section.items.map((item, i) => (
                <li key={i}>
                  <SambaLinks
                    href={item.href}
                    color="primary900"
                    underline="none"
                    hoverBg="hover:bg-primary hover:text-white"
                    className={`block px-6 py-2 border-l-2 border-primary transition-colors ${
                      activeHref === item.href ? "bg-primary text-white" : ""
                    }`}
                  >
                    {item.label}
                  </SambaLinks>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
};
