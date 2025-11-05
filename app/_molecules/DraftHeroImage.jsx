"use client";

import { useMemo } from "react";
import Image from "next/image";
import { usePageEdit } from "../context/PageEditProvider";
import ImageEditor from "./ImageEditor";
import { SignedIn } from "@clerk/nextjs";

export default function DraftHeroImage({
  initialUrl = "/generic-image.png",
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
    <div className="w-full md:w-80 shrink-0 relative">
      <Image
        src={url}
        alt={alt}
        width={width}
        height={height}
        className={className}
        data-imageid={id}
      />
      <SignedIn>
        <div className="absolute top-2 right-2">
          <ImageEditor initialUrl={initialUrl} initialAlt={initialAlt} />
        </div>
      </SignedIn>
    </div>
  );
}
