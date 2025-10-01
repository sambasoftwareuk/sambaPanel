"use client";

import { Header1 } from "@/app/_atoms/Headers";
import { CardImage, ZoomableImage } from "@/app/_atoms/Images";
import Modal from "@/app/_molecules/Modal";
import { SambaSlider } from "@/app/_molecules/Slider";
import { useState } from "react";

const images = ["/4.jpg", "/5.jpg", "/6.jpg", "/7.jpg", "/8.jpg", "/9.jpg"];

const GalleryPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <Header1 className="mb-6 text-center">Fotoğraflar</Header1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedIndex(index)}
          >
            <CardImage imageLink={img} aspectRatio="aspect-[4/3]" />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <Modal onClose={() => setSelectedIndex(null)}>
          <SambaSlider
            itemsPerSlide={1}
            isScroll={false}
            isInfinite={true}
            showDots={true}
            showArrows={true}
            size="lg"
            initialSlide={selectedIndex}
          >
            {images.map((img, i) => (
              <div
                key={i}
                className="w-full h-full flex justify-center items-center"
              >
                <ZoomableImage imageLink={img} aspectRatio="aspect-[4/3]" />
              </div>
            ))}
          </SambaSlider>
        </Modal>
      )}
    </div>
  );
};

export default GalleryPage;
