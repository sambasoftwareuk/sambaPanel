"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "../_atoms/Icons";
import Icon from "../_atoms/Icon";
import { DirectionButton } from "../_atoms/buttons";

export const SambaSlider = ({
  children,
  itemsPerSlide = 1,
  isScroll = false,
  isAutoSlide = false,
  isInfinite = false,
  showDots = true,
  showArrows = true,
  size = "sm",
  initialSlide = 0,
  onSlideChange,
}) => {
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialSlide);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Touch/swipe için state'ler
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const childArray = useMemo(
    () => React.Children.toArray(children),
    [children]
  );
  const totalSlides = Math.ceil(childArray.length / itemsPerSlide);
  const isSingleItem = itemsPerSlide === 1;

  useEffect(() => {
    setCurrentIndex(initialSlide);
  }, [initialSlide]);

  // Auto slide (slide mode only)
  useEffect(() => {
    if (isAutoSlide && !isScroll) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) =>
          isInfinite
            ? (prev + itemsPerSlide) % childArray.length
            : Math.min(prev + itemsPerSlide, childArray.length - itemsPerSlide)
        );
      }, 5000);
      return () => clearInterval(intervalRef.current);
    }
  }, [isAutoSlide, isScroll, isInfinite, itemsPerSlide, childArray.length]);

  // Scroll mode
  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }
  };

  useEffect(() => {
    if (isScroll && scrollRef.current) {
      checkScroll();
      const el = scrollRef.current;
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [childArray]);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  const goToSlide = (index) => {
    setCurrentIndex(index);
    if (onSlideChange) onSlideChange(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = isInfinite
        ? (prev + itemsPerSlide) % childArray.length
        : Math.min(prev + itemsPerSlide, childArray.length - itemsPerSlide);
      if (onSlideChange) onSlideChange(newIndex);
      return newIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const newIndex = isInfinite
        ? (prev - itemsPerSlide + childArray.length) % childArray.length
        : Math.max(prev - itemsPerSlide, 0);
      if (onSlideChange) onSlideChange(newIndex);
      return newIndex;
    });
  };

  // Touch event handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsDragging(false);
  };

  const sizeClass =
    size === "lg"
      ? "h-[450px] sm:h-[600px]"
      : size === "md"
      ? "h-[300px]"
      : "h-[250px]"; // default sm

  // 👇 SCROLL VARIANT
  if (isScroll) {
    return (
      <div className="relative w-full">
        {showArrows && canScrollLeft && (
          <DirectionButton
            icon={<Icon variant={ChevronLeft} size={32} />}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow z-10 hidden md:flex"
            onClick={scrollLeft}
          />
        )}

        {showArrows && canScrollRight && (
          <DirectionButton
            icon={<Icon variant={ChevronRight} size={32} />}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow z-10 hidden md:flex"
            onClick={scrollRight}
          />
        )}

        <div
          ref={scrollRef}
          className={`overflow-x-auto scrollbar-hide px-8 py-2`}
        >
          <div className="flex gap-2">
            {childArray.map((child, i) => (
              <div key={i} className="shrink-0">
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 👇 SLIDE VARIANT
  const getExtendedSlides = () => {
    if (isInfinite && childArray.length > 0) {
      // Slider kapanmasın diye, itemsPerSlide kadar başa ekleme yapılır
      return [...childArray, ...childArray.slice(0, itemsPerSlide)];
    }
    return childArray;
  };

  const extendedSlides = useMemo(
    () => getExtendedSlides(),
    [childArray, isInfinite, itemsPerSlide]
  );

  return (
    <div
      className={`relative w-full overflow-hidden mx-auto ${
        isSingleItem ? sizeClass : ""
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`flex transition-transform duration-500 ease-in-out ${
          isDragging ? "transition-none" : ""
        }`}
        style={{
          transform: `translateX(-${
            (currentIndex * 100) / extendedSlides.length
          }%)`,
          width: `${(extendedSlides.length * 100) / itemsPerSlide}%`,
        }}
      >
        {extendedSlides.map((child, i) => (
          <div
            key={i}
            style={{ flex: `0 0 ${100 / extendedSlides.length}%` }}
            className="w-full flex-shrink-0"
          >
            {child}
          </div>
        ))}
      </div>

      {/* Arrows */}
      {showArrows && (isInfinite || currentIndex > 0) && (
        <DirectionButton
          icon={<Icon variant={ChevronLeft} size={32} />}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow z-10"
          onClick={prevSlide}
        />
      )}
      {showArrows &&
        (isInfinite || currentIndex < childArray.length - itemsPerSlide) && (
          <DirectionButton
            icon={<Icon variant={ChevronRight} size={32} />}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow z-10"
            onClick={nextSlide}
          />
        )}

      {/* Dots */}
      {showDots && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * itemsPerSlide)}
              className={`w-3 h-3 rounded-full ${
                currentIndex / itemsPerSlide === index
                  ? "bg-black"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
