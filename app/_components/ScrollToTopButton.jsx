"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { LineUpArrow } from "../_atoms/Icons";
import { OutlinedButtonWithIcon } from "../_atoms/Buttons";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  const showThreshold = 200;
  const bottomThreshold = 100;

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const scrollingUp = scrollY < lastScrollY.current;
    const scrollEnough = scrollY > showThreshold;

    const nearBottom =
      window.innerHeight + scrollY >=
      document.body.offsetHeight - bottomThreshold;

    setVisible(nearBottom || (scrollingUp && scrollEnough));
    lastScrollY.current = scrollY;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once on mount to check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!visible) return null;

  return (
    <Link href="#top" scroll={true} aria-label="Scroll to top">
      <OutlinedButtonWithIcon
        className="bg-white hover:shadow-lg transition-shadow duration-200"
        icon={
          <LineUpArrow
            className="text-blue-500 translate-y[2px] md:translate-y-0"
            size={34}
          />
        }
      />
    </Link>
  );
}
