import React from "react";
import { CardImage } from "../_atoms/Images";
import { ChevronRight } from "../_atoms/Icons";
import { SambaLinks } from "../_atoms/SambaLinks";

const BlogCard = ({
  imageLink,
  imageAlt,
  date,
  title,
  excerpt,
  aspectRatio,
  slug,
}) => {
  return (
    <SambaLinks
      href={`/blog/${slug}`}
      className="bg-white shadow-md rounded-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer w-[calc(50%-12px)] sm:w-[calc(50%-12px)] md:w-[calc(50%-12px)] lg:w-[calc(50%-12px)] xl:w-[calc(20%-19.2px)]"
    >
      <CardImage
        imageLink={imageLink}
        imageAlt={imageAlt}
        aspectRatio={aspectRatio}
      />

      <div className="p-4">
        <p className="text-sm text-red mb-1">{date}</p>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-700 text-sm line-clamp-3">{excerpt}</p>
      </div>

      <div className="p-4 pt-0 flex justify-start text-primary900">
        <p>devamı</p>
        <ChevronRight className="w-6 h-6" />
      </div>
    </SambaLinks>
  );
};

export default BlogCard;
