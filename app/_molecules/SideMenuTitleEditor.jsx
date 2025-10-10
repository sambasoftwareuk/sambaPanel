"use client";
import { useEffect, useState } from "react";
import { Header3 } from "../_atoms/Headers";
import { InputBasic } from "../_atoms/Inputs";
import { OutlinedButton, PrimaryButton } from "../_atoms/Buttons";

export function SideMenuTitleEditor({ sectionIndex, currentTitle, onSave, onCancel }) {
    const [draftTitle, setDraftTitle] = useState(currentTitle);
  
    useEffect(() => {
      setDraftTitle(currentTitle);
    }, [currentTitle]);
  
    const handleSave = () => {
      onSave(sectionIndex, draftTitle);
    };
  
    return (
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
        <div className="w-full max-w-md rounded-xl bg-white p-4 shadow-lg">
          <Header3 >Başlığı Düzenle</Header3>
          <InputBasic
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="w-full rounded border px-3 py-2"
            placeholder="Başlık"
            autoFocus
          />
          <div className="mt-4 flex justify-end gap-2">
            <OutlinedButton label="Vazgeç" onClick={onCancel} />
            <PrimaryButton
              label="Kaydet"
              onClick={handleSave}
              className="bg-black text-white"
            />
          </div>
        </div>
      </div>
    );
  }