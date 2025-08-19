// components/common/CompanyAddress.jsx
import React from "react";
import Link from "next/link";

const CompanyAddress = ({ className = "" }) => {
  return (
    <address className={`flex not-italic  ${className}`}>
      <Link
        href="https://maps.google.com/?q=Alemdag Mah. Saray Cad. 111. Sk. No:1-3 Daire:10 Çekmeköy/ISTANBUL"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:underline px-2"
      >
        Alemdağ Mah. Saray Cad. 111. Sk. No:1-3 Daire:10 Çekmeköy/İSTANBUL
      </Link>
      <Link href="tel:+902163046868" className="hover:underline px-2">
        +90 216 304 68 68
      </Link>
      <Link href="mailto:info@greenstepcoolingtowers.com" className="hover:underline px-2">
        info@greenstepcoolingtowers.com
      </Link>
    </address>
  );
};

export default CompanyAddress;
