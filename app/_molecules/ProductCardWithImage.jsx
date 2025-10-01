import React from "react";
import { CardImage } from "../_atoms/Images";
import { PrimaryButton } from "../_atoms/Buttons";

const ProductCardWithImage = ({
  altText,
  title,
  imageLink,
  layout = "vertical",
  variant = 1,
  button = true,
  buttonLabel = "INCELE",
  imagePosition = "left",
  titleFontSize = "text-xl md:text-2xl",
  titleColor = "text-blue-600",
  showBottomLine = false,
}) => {
  const Title = (
    <h2
      className={`${titleFontSize} font-bold ${titleColor} mb-4 mt-8   ${
        showBottomLine ? "border-t border-gray-300 w-full pt-3" : ""
      }`}
    >
      {title}
    </h2>
  );

  const Image = (
    <div className="overflow-hidden rounded-md my-5">
      <div className="transition-transform duration-300 ease-in-out group-hover:scale-105">
        <CardImage imageLink={imageLink} imageAlt={altText ? altText : title} />
      </div>
    </div>
  );

  const Button = button ? (
    <div className="flex text-center justify-center mt-4">
      <PrimaryButton label={buttonLabel} className="rounded-full" />
    </div>
  ) : null;

  if (layout === "horizontal") {
    const imageContent = <div className="w-full md:w-1/2">{Image}</div>;

    const textContent = (
      <div className="w-full md:w-1/2 p-4 flex flex-col justify-center text-left">
        {Title}
        {Button}
      </div>
    );

    return (
      <div className="group bg-white flex flex-col md:flex-row rounded-lg shadow p-4 my-6 transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]">
        {imagePosition === "left" ? (
          <>
            {imageContent}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {imageContent}
          </>
        )}
      </div>
    );
  }

  const variantMap = {
    1: [Title, Image, Button],
    2: [Image, Title, Button],
    3: [Button, Image, Title],
  };

  const content = variantMap[variant] || variantMap[1];

  return (
    <div
      className={
        "group bg-white w-full flex flex-col rounded-lg shadow p-6 text-center justify-center my-6 transition-transform duration-300 hover:shadow-lg hover:scale-[1.02]"
      }
    >
      {content.map((element, index) => (
        <React.Fragment key={index}>{element}</React.Fragment>
      ))}
    </div>
  );
};

export default ProductCardWithImage;

export const OverlayImageCard = ({
  title,
  imageLink,
  titlePosition = "bottom-left",
  titleFontSize = "text-xl md:text-2xl",
  button = false,
  buttonLabel = "İNCELE",
}) => {
  const titlePositionMap = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "top-right": "top-4 right-4",
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <div
      className="relative w-1/4 h-72 md:h-80 rounded-lg overflow-hidden group shadow-md transition-opacity duration-300"
      style={{
        backgroundImage: `url(${imageLink})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay karartma */}
      <div className="absolute inset-0 bg-black opacity-40 transition-opacity duration-300 ease-in-out group-hover:opacity-20"></div>

      {/* Başlık */}
      <div
        className={`absolute z-10 px-4 py-2 text-white font-bold ${titleFontSize} ${
          titlePositionMap[titlePosition] || "bottom-center"
        }`}
      >
        {title}
      </div>

      {/* Opsiyonel buton */}
      {button && (
        <div className="absolute z-10 bottom-4 right-4">
          <PrimaryButton label={buttonLabel} className="rounded-full" />
        </div>
      )}
    </div>
  );
};
