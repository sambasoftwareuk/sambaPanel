"use client";

import { useMemo } from "react";
// import Image from "next/image";
import { usePageEdit } from "../context/PageEditProvider";

export default function DraftHeroImage({
  initialUrl = "/5.jpg",
  initialAlt = "Kurumsal",
  width = 320,
  height = 320,
  className = "rounded-lg object-cover w-80 h-80",
}) {
  const { heroUrl, heroAlt, heroMediaId } = usePageEdit();

  // Context'ten gelen değerleri kullan, yoksa initial değerleri kullan (memoized)
  const { url, alt, id } = useMemo(
    () => ({
      url: heroUrl ?? initialUrl,
      alt: heroAlt ?? initialAlt,
      id: heroMediaId ?? null,
    }),
    [heroUrl, heroAlt, heroMediaId, initialUrl, initialAlt]
  );

  return (
    <img
      src={url}
      alt={alt}
      imageid={id}
      width={width}
      height={height}
      className={className}
    />
  );
}
