"use client"
import React from "react";
import { SambaSlider } from "../_molecules/slider";
import ProductCardWithImage from "../_molecules/productCardWithImage";
import { Header1 } from "../_atoms/Headers";
import { useWindowSize } from "../utils/useWindowSize";

const CarouselSlider = ({ data, itemsPerSlide = 4, title, isAutoSlide, isInfinite }) => {
  
  const { width } = useWindowSize();

  const getResponsiveItems = () => {
    if (width < 640) return 1;      // mobile
    if (width < 768) return 2;      // sm
    if (width < 1024) return 3;     // md
    return itemsPerSlide;           // lg ve üstü
  };

    const responsiveItems = getResponsiveItems();


  return (
    <div className="mt-2 w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] mx-auto">
       {title && (
        <Header1 className="text-center">{title}</Header1>
      )}

      <SambaSlider
        variant="slide"
        showDots={false}
        showArrows={true}
        itemsPerSlide={responsiveItems}
        isAutoSlide={isAutoSlide}
        isInfinite={isInfinite}
      >
        {data.map((product) => (
          <div key={product.id} className="px-2">
            <ProductCardWithImage
              title={product.title}
              imageLink={product.image}
              variant={3}
              button={false}
            />
          </div>
        ))}
      </SambaSlider>
    </div>
  )
}

export default CarouselSlider;
