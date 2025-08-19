import { useState, useEffect } from "react";

export function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth });
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // ilk yükleme

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
