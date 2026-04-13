"use client";
import React from "react";
import { SambaSlider } from "../_molecules/Slider";
import ProductCardWithImage from "../_molecules/ProductCardWithImage";
import { useWindowSize } from "../utils/useWindowSize";

const CarouselSlider = ({
  data,
  itemsPerSlide = 4,
  title,
  isAutoSlide,
  isInfinite,
  headingLevel = 1,
}) => {
  const { width } = useWindowSize();
  const HeadingTag = headingLevel === 2 ? "h2" : headingLevel === 3 ? "h3" : "h1";

  const getResponsiveItems = () => {
    if (width < 640) return 1; // mobile
    if (width < 768) return 2; // sm
    if (width < 1024) return 3; // md
    return itemsPerSlide; // lg ve üstü
  };

  const responsiveItems = getResponsiveItems();

  return (
    <div className="mt-2 w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] mx-auto">
      {title && <HeadingTag className="text-3xl font-bold text-primary text-center mb-4">{title}</HeadingTag>}

      <SambaSlider
        variant="slide"
        showDots={false}
        showArrows={true}
        itemsPerSlide={responsiveItems}
        isAutoSlide={isAutoSlide}
        isInfinite={isInfinite}
      >
        {data.map((product) => (
          <div key={product?.id} className="px-2">
            <ProductCardWithImage
              title={product?.title}
              imageLink={product?.image_url ? `${product?.image_url}` : "/generic-image.png"}
              variant={3}
              button={false}
            />
          </div>
        ))}
      </SambaSlider>
    </div>
  );
};

export default CarouselSlider;
