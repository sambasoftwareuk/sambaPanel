import { SambaLinks } from "../_atoms/SambaLinks";
import Icon from "../_atoms/Icon";
import { Globe } from "../_atoms/Icons";
import footerData from "../mocks/footerData";
import { AccordionSection } from "../_molecules/AccordionSection";
import FooterBlogList from "./FooterBlogList";

export function Footer() {
  return (
    <footer className="text-white text-[16px]">
      <FooterBlogList />
      <div className="border-t border-black w-full" />

      <div className="bg-gray-200 w-full text-sm text-gray-800  py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span>
              Greenstep Su Soğutma Kuleleri © {new Date().getFullYear()}{" "}
              SambaAcademy, Inc. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icon variant={Globe} size={12} />
            <span>English</span>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 text-[16px] text-gray-300 py-4 px-6 text-center border-b border-gray-700">
        <span className="font-semibold text-white">Developed by</span>{" "}
        <SambaLinks color="sunshine" className="font-semibold">
          Samba Software
        </SambaLinks>
      </div>
    </footer>
  );
}
