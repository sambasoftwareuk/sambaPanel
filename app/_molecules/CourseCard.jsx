"use client";

import { useEffect, useRef, useState } from "react";
import { CardImage } from "../_atoms/Images";
import { PrimaryButton } from "../_atoms/Buttons";
import { Star } from "../_atoms/Icons";

const CourseCard = ({
  course
}) => {
  const [showDetail, setShowDetail] = useState(false);
  const [openLeft, setOpenLeft] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (!showDetail || !cardRef.current) return;

    const shouldOpenLeft = () => {
      const rect = cardRef.current.getBoundingClientRect();
      const cardWidth = rect.width;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      return spaceRight < cardWidth + 10 && spaceLeft >= cardWidth + 10;
    };

    setOpenLeft(shouldOpenLeft());
  }, [showDetail]);

  return (
    <div
      ref={cardRef}
      className="relative group w-full max-w-[250px] aspect-[3/4]"
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      <div className="w-full h-full rounded-md overflow-hidden shadow-lg border border-gray-200 bg-white">
        <div className="relative w-full h-[45%]">
          <CardImage imageLink={course?.image} />
        </div>

        <div className="p-3 h-[55%] flex flex-col justify-between text-xs sm:text-sm">
          <div>
            <h3 className="font-semibold leading-tight mb-1">{course?.title}</h3>
            <p className="text-muted-foreground mb-1">{course?.author}</p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 flex items-center">
                {typeof(course?.rating) === "number" && [...Array(Math.max(0, Math.round(course?.rating)))].map((_, i) => (
                  <Star key={i} size={12} fill="#facc15" stroke="none" />
                ))}
              </span>
              <span className="text-muted-foreground">
                ({course?.reviews.toLocaleString()})
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div>
              <span className="font-bold">€{course?.price?.toFixed(2)}</span>{" "}
              {course?.oldPrice && (
                <span className="line-through text-muted-foreground text-xs">
                  €{course?.oldPrice?.toFixed(2)}
                </span>
              )}
            </div>
            {course?.badge && (
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                {course?.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {showDetail && (
        <div
          className={`
            absolute top-0 ${openLeft ? "right-full" : "left-full"} 
            z-50 w-full h-full max-w-[250px] aspect-[3/4]
            bg-white rounded-md shadow-xl border border-gray-200
          `}
        >
          <div className="p-3 flex flex-col h-full justify-between text-xs sm:text-sm ">
            <div>
              <h3 className="font-semibold leading-tight mb-1">{course?.title}</h3>
              <p className="text-muted-foreground mb-1">{course?.author}</p>
              <div className="flex items-center gap-1">
                <span className="text-yellow-500 flex items-center">
                  {typeof(course?.rating) === "number" && [...Array(Math.max(0, Math.round(course?.rating)))].map((_, i) => (
                    <Star key={i} size={12} fill="#facc15" stroke="none" />
                  ))}
                </span>
                <span className="text-muted-foreground">
                  ({course?.reviews.toLocaleString()})
                </span>
              </div>
              <p className="text-[10px] sm:text-xs mt-2">
                {course?.description || "No description available."}
              </p>
            </div>

            <div>
              <PrimaryButton
                label="Login"
                className="w-full bg-primary900 text-white text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;
