"use client";

import { Header1 } from "../_atoms/Headers";
import { CardImage, ZoomableImage } from "../_atoms/Images";
import Modal from "../_molecules/Modal";
import { SambaSlider } from "../_molecules/Slider";
import { useState } from "react";

const GalleryComponent = ({ title = "Galeri", images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="px-4 py-8 max-w-screen-xl mx-auto">
      <Header1 className="mb-6 text-center">{title}</Header1>

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

export default GalleryComponent;
