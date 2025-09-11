"use client";

import Image from "next/image";
import { usePageEdit } from "../context/PageEditProvider";

export default function DraftHeroImage({
  initialUrl = "/5.jpg",
  initialAlt = "Kurumsal",
  width = 320,
  height = 320,
  className = "rounded-lg object-cover w-80 h-80",
}) {
  const { heroUrl, heroAlt, heroMediaId } = usePageEdit();

  // Context'ten gelen değerleri kullan, yoksa initial değerleri kullan
  const url = heroUrl || initialUrl;
  const alt = heroAlt || initialAlt;
  const id = heroMediaId || null;

  return (
    <Image
      src={url}
      alt={alt}
      imageid={id}
      width={width}
      height={height}
      className={className}
    />
  );
}
