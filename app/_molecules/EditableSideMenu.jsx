"use client";

import React, { useState } from "react";
import { SambaLinks } from "../_atoms/SambaLinks";
import { SignedIn } from "@clerk/nextjs";
import EditButton from "../_atoms/EditButton";
import { PrimaryButton, OutlinedButton } from "../_atoms/Buttons";
import { usePageEdit } from "../context/PageEditProvider";
import { SideMenuTitleEditor } from "./SideMenuTitleEditor";


export const EditableSideMenu = ({ menu, activeHref }) => {
  const {
    sideMenu,
    updateSideMenuTitle,
    sideMenuDirty,
    handleSideMenuSave,
    sideMenuSaving,
    resetSideMenu,
  } = usePageEdit();
  const [editingSection, setEditingSection] = useState(null);

  // Context'ten sideMenu varsa onu kullan, yoksa menu prop'unu kullan
  const displayMenu = sideMenu || menu;

  const startEdit = (sectionIndex) => {
    setEditingSection(sectionIndex);
  };

  const saveEdit = (sectionIndex, newTitle) => {
    // Context'e kaydet
    updateSideMenuTitle(sectionIndex, newTitle);
    setEditingSection(null);
  };

  const cancelEdit = () => {
    setEditingSection(null);
  };
  if (!displayMenu || displayMenu.length === 0) {
    return (
      <div className="w-64 bg-white p-4 hidden md:block">
        <p className="text-gray-500 text-center">Menü bulunamadı</p>
      </div>
    );
  }

  return (
    <aside className="w-64 bg-white p-0 hidden md:block">
      { displayMenu?.map((section, idx) => (
        <div key={idx} className="mb-0">
          <div
            className={`font-bold px-4 py-3 ${
              section.href
                ? "bg-primary900 text-white"
                : "bg-primary50 text-primary"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{section.title}</span>
              <SignedIn>
                <EditButton
                  onClick={() => startEdit(idx)}
                  size="small"
                  className="ml-2"
                />
              </SignedIn>
            </div>
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

      {/* TitleEditor Modal */}
      {editingSection !== null && (
        <SideMenuTitleEditor
          sectionIndex={editingSection}
          currentTitle={displayMenu[editingSection]?.title || ""}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      )}

      {/* SideMenu Save Button */}
      {sideMenuDirty && (
        <div className="mt-4 p-2 bg-gray-50 rounded">
          <div className="flex justify-end gap-2">
            <OutlinedButton
              onClick={resetSideMenu}
              label="Vazgeç"
              className="px-4 py-2 w-1/2"
            />
            <PrimaryButton
              onClick={handleSideMenuSave}
              disabled={sideMenuSaving}
              className={`px-4 py-2 w-1/2 text-white rounded ${
                sideMenuSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              label={sideMenuSaving ? "Kaydediliyor..." : "SideMenu Kaydet"}
            />
          </div>
        </div>
      )}
    </aside>
  );
};
