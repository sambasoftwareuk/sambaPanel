import React from "react";
import DesktopNavbar from "./DesktopNavbar";
import HamburgerMenu from "./HamburgerMenu";
import AnnouncementBand from "./AnnouncementBand";

const Navbar = () => {
  return (
    <>
      {/* Desktop Navbar (xl and up) */}
      <div className="hidden xl:block sticky top-0 z-50">
        <AnnouncementBand />
        <DesktopNavbar />
      </div>

      {/* Mobile Hamburger Menu (below xl) */}
      <div className="block xl:hidden  ">
        <HamburgerMenu />
      </div>
    </>
  );
};

export default Navbar;
