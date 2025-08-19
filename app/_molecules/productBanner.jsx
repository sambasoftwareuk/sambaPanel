import React from "react";
import Link from "next/link";

const ProductBanner = ({ bannerProducts }) => {
  return (
    <div className="bg-primary900 py-1 px-4 w-full flex justify-center">
      <div className="w-full max-w-7xl grid grid-cols-2 items-center md:grid-cols-4">
        {bannerProducts.map((product) => (
          <Link
            key={product.id}
            href={`/urunler/${product.id}`}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-center max-w-64 gap-0 md:w-full md:gap-2">
              <div className="max-w-24 md:max-w-full">
                <h2 className="text-white text-xs font-semibold text-center w-full">
                  {product.title}
                </h2>
              </div>
              <div className="max-w-24 md:max-w-full">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductBanner;
