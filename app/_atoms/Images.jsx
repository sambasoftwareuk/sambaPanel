"use client";
import Image from "next/image";
import React, { useMemo, useState } from "react";

// Eğer imageLink boşsa generic image döner, varsa orijinal haliyle bırakır
const getSrc = (imageLink) =>
  imageLink && imageLink.trim() !== "" ? imageLink : "/generic-image.png";

const getImageSlug = (imageLink) =>
  imageLink
    ? imageLink
        .split("/")
        .pop()
        .replace(/\.[^/.]+$/, "")
    : "generic-image";

// --- SLIDER IMAGE ---
export const SliderImage = ({ imageLink, imageAlt, orientation }) => {
  const src = useMemo(() => getSrc(imageLink), [imageLink]);
  const randomImageAlt = useMemo(() => getImageSlug(imageLink), [imageLink]);

  return (
    <div className="mx-auto w-full">
      <div
        className={`bg-primary50 custom:block relative ${
          orientation === "split-horizontal" ? "h-[600px] ml-10" : "h-[600px]"
        } overflow-hidden`}
      >
        <div className="absolute my-[auto] left-1/2 -translate-x-1/2 w-full h-full">
          <Image
            src={src}
            alt={`slider-image-${imageAlt || randomImageAlt}`}
            fill
            className={
              src === "/generic-image.png"
                ? "object-contain bg-gray-300"
                : "object-contain object-center"
            }
          />
        </div>
      </div>
    </div>
  );
};

// --- CARD IMAGE ---
export const CardImage = ({
  imageLink,
  imageAlt,
  aspectRatio = "aspect-[16/9]",
}) => {
  const src = useMemo(() => getSrc(imageLink), [imageLink]);
  const randomImageAlt = useMemo(() => getImageSlug(imageLink), [imageLink]);

  return (
    <div className="mx-auto w-full">
      <div
        className={`relative w-full  overflow-hidden rounded-t-m ${aspectRatio}`}
      >
         
          <Image
            src={src}
            alt={imageAlt || randomImageAlt}
            fill
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </div>
  );
};

// --- LOGO IMAGE ---
export const LogoImage = ({
  imageLink = "",
  width = 50,
  height = 20,
  imageAlt,
}) => {
  const src = useMemo(() => getSrc(imageLink), [imageLink]);
  const randomImageAlt = useMemo(() => getImageSlug(imageLink), [imageLink]);

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: `200px`,
        maxHeight: `80px`,
      }}
    >
      <Image
        src={src}
        alt={`slider-image-${imageAlt || randomImageAlt}`}
        fill
        className={`object-cover ${
          src === "/generic-image.png" ? "bg-gray-300" : ""
        }`}
      />
    </div>
  );
};

// --- PROFILE IMAGE ---
export const ProfileImage = ({ imageLink = "", imageAlt }) => {
  const src = useMemo(() => getSrc(imageLink), [imageLink]);
  const randomImageAlt = useMemo(() => getImageSlug(imageLink), [imageLink]);

  return (
    <div className="relative w-[80px] h-[80px] overflow-hidden">
      <Image
        src={src}
        alt={`slider-image-${imageAlt || randomImageAlt}`}
        fill
        className="object-contain border-2 border-black rounded-full bg-gray-200"
      />
    </div>
  );
};

// --- ZOOMABLE IMAGE ---
export const ZoomableImage = ({ imageLink, alt = "zoomable" }) => {
  const [zoomed, setZoomed] = useState(false);

  const toggleZoom = (e) => {
    e.stopPropagation();
    setZoomed((z) => !z);
  };

  const src = getSrc(imageLink);

  return (
    <Image
      src={src}
      width={800}
      height={600}
      alt={alt}
      onClick={toggleZoom}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === "Enter" || e.key === " ") toggleZoom(e);
      }}
      className={`object-contain transition-transform duration-300 cursor-zoom-in ${
        zoomed ? "scale-[1.5]" : "scale-100"
      }`}
    />
  );
};
