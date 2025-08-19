"use client";
import React from "react";
import { SambaLinks } from "../_atoms/SambaLinks";
import { usePathname } from "next/navigation";
import { Home } from "../_atoms/Icons";

const Breadcrumb = ({title}) => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);


  const breadcrumbItems = [
    {
      label: <Home size={10} className="text-primary" />,
      href: "/",
    },
    ...pathParts.map((part, idx) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1),
      href: "/" + pathParts.slice(0, idx + 1).join("/"),
    })),
  ];

  return (
    <nav className="text-sm mb-4" aria-label="Breadcrumb">
      <ol className="list-none p-0 inline-flex">
        {breadcrumbItems.map((item, idx) => (
          <li key={idx} className="flex items-center">
            {idx > 0 && <span className="mx-2 text-gray-400">/</span>}
            {item.href && idx !== breadcrumbItems.length - 1 ? (
              <SambaLinks
                href={item.href}
                className="text-primary hover:underline"
              >
                {item.label == "Urunler" ? "Ürünler" : item.label == "Yedek-parcalar" ? "Yedek Parçalar" : item.label}
              </SambaLinks>
            ) : (
              <span className="text-gray-500">{title ? title : item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
