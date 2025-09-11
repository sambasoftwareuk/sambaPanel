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

  // Draft'ta hero_media_id varsa, o media'nın URL'sini al
  const url = draft.hero_media_id ? draft.hero_url || initialUrl : initialUrl;

  const alt = draft.hero_alt || initialAlt;
  const id = draft.hero_media_id || null;

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
