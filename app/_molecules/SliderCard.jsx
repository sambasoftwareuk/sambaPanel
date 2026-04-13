"use client";
import React from "react";
import { PrimaryButton } from "../_atoms/Buttons";
import { Header2 } from "../_atoms/Headers";
import { useRouter } from "next/navigation";

export default function SliderCard({
  title,
  subtitle,
  primaryLabel,
  primaryLabelLink,
  body,
  secondaryLabel,
  secondaryLabelLink,
  headingLevel = 1,
}) {

  const router = useRouter();

  const onPrimaryClick = () => {
    if (primaryLabelLink) {
      router.push(primaryLabelLink);
    }
  };

  const onSecondaryClick = () => {
    if (secondaryLabelLink) {
      router.push(secondaryLabelLink);
    }
  };

  const HeadingTag = headingLevel === 2 ? "h2" : headingLevel === 3 ? "h3" : "h1";

  return (
    <div className="rounded-4xl shadow-lg bg-white p-6 md:p-12 max-w-md w-full flex flex-col justify-between h-full">
      <div>
        <HeadingTag className="text-xl md:text-2xl font-bold text-gray-900 mb-2 text-primary">{title}</HeadingTag>
        <Header2 className="hidden md:flex text-gray-700 text-base">{subtitle}</Header2>
      </div>
      <div>
        {body && <p className="text-gray-600 text-sm mt-4">{body}</p>}
      </div>

      {(primaryLabel || secondaryLabel) && (
        <div className="mt-6 flex justify-between gap-4">
          {primaryLabel && (
            <PrimaryButton
              label={primaryLabel}
              onClick={onPrimaryClick}
              className="w-1/2"
            />
          )}
          {secondaryLabel && (
            <PrimaryButton
              label={secondaryLabel}
              onClick={onSecondaryClick}
              className="w-1/2"
            />
          )}
        </div>
      )}
    </div>
  );
}
