"use client";
import React from "react";
import { PrimaryButton } from "../_atoms/Buttons";
import { Header1, Header2 } from "../_atoms/Headers";
import { useRouter } from "next/navigation";

export default function SliderCard({
  title,
  subtitle,
  primaryLabel,
  primaryLabelLink,
  body,
  secondaryLabel,
  secondaryLabelLink,
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

  return (
    <div className="rounded-4xl shadow-lg bg-white p-12 max-w-md w-full flex flex-col justify-between h-full">
      <div>
        <Header1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{title}</Header1>
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
