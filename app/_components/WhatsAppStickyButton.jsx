import React from "react";
import { WhatsAppIcon } from "../_atoms/Icons";
import Icon from "../_atoms/Icon";
import Link from "next/link";
import contact from "../constants/contact.json";

const WhatsAppStickyButton = () => {
  return (
    <Link
      href={contact.whatsappUrl}
      target="_blank"
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-3 rounded-xl md:rounded-full shadow-lg transition-all"
    >
      <Icon variant={WhatsAppIcon} size={36} color="text-white" />
      <span className="hidden md:flex font-semibold text-lg">
        WhatsApp Destek Hattı
      </span>
    </Link>
  );
};

export default WhatsAppStickyButton;
