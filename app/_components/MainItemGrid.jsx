import React from "react";
import ProductCardWithImage from "../_molecules/ProductCardWithImage";
import Link from "next/link";

const MainItemGrid = ({
  items,
  title,
  gridClassName = "grid-cols-1 md:grid-cols-2",
  cardProps = {},
  headingLevel = 1,
}) => {
  const HeadingTag = headingLevel === 2 ? "h2" : headingLevel === 3 ? "h3" : "h1";

  return (
    <div className="w-full max-w-7xl mx-auto mt-6 p-4">
      
      {title && <HeadingTag className="text-3xl font-bold text-primary text-center mb-4">{title}</HeadingTag>}
      <div className={`grid ${gridClassName} gap-8 items-center`}>
        {items?.map((item) => (
          <Link key={item?.id} href={item.href}>
            <ProductCardWithImage
              title={item?.title}
              imageLink={item?.hero_url}
              altText={item?.hero_alt || item?.title}
              buttonLabel="DETAYLAR"
              variant={1}
              aspectRatio="aspect-[16/16]"
              {...cardProps}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainItemGrid;
