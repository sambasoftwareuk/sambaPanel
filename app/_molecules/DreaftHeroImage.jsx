"use client";

import Image from "next/image";
import { useEditSession } from "../_context/EditSessionContext";

export default function DraftHeroImage({
  initialUrl = "/5.jpg",
  initialAlt = "Kurumsal",
  width = 320,
  height = 320,
  className = "rounded-lg object-cover w-80 h-80",
}) {
  const { draft } = useEditSession();
  const url = draft.hero_url ?? initialUrl;
  const alt = draft.hero_alt ?? initialAlt;

  return (
    <Image
      src={url}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  );
}
