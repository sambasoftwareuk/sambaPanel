 export const SliderYedekleme = ({
   size = "sm",
   children,
   variant,
   showDots = true,
   showArrows = true,
 }) => {
   const [index, setIndex] = useState(0)
   const items = Array.isArray(children) ? children : [children]
   const intervalRef = useRef(null)
   const sliderRef = useRef(null)

   const isAutoSlide = variant === "autoSlide"
   const showByIndex = typeof variant === "undefined"
   const alwaysShowControls = variant === "infinite" || isAutoSlide


   const showLeft =
     showArrows && (alwaysShowControls || (showByIndex && index > 0));
   const showRight =
     showArrows &&
     (alwaysShowControls || (showByIndex && index < items.length - 1));

   const next = () => setIndex((prev) => (prev + 1) % items.length);
   const prev = () =>
     setIndex((prev) => (prev - 1 + items.length) % items.length);
   const goTo = (i) => setIndex(i);

   // Auto Slide
   useEffect(() => {
     if (isAutoSlide) {
       intervalRef.current = setInterval(next, 5000);
       return () => clearInterval(intervalRef.current);
     }
   }, [isAutoSlide]);

   // Touch Swipe Support
   useEffect(() => {
     let startX = 0
     let endX = 0

     const handleTouchStart = (e) => {
       startX = e.touches[0].clientX
     }

     const handleTouchMove = (e) => {
       endX = e.touches[0].clientX
     }

     const handleTouchEnd = () => {
       const diff = startX - endX
       if (Math.abs(diff) > 50) {
         if (diff > 0) next()
         else prev()
       }
     }

     const el = sliderRef.current
     if (el) {
       el.addEventListener("touchstart", handleTouchStart)
       el.addEventListener("touchmove", handleTouchMove)
       el.addEventListener("touchend", handleTouchEnd)
     }

     return () => {
       if (el) {
         el.removeEventListener("touchstart", handleTouchStart)
         el.removeEventListener("touchmove", handleTouchMove)
         el.removeEventListener("touchend", handleTouchEnd)
       }
     }
   }, [])

   return (
     <div ref={sliderRef} className="relative w-full overflow-hidden mx-auto">
       {/* Slide Container */}
       <div
         className={`flex w-full transition-transform duration-500 ease-in-out ${
           size === "sm"
             ? "h-[250px]"
             : size === "md"
             ? "h-[300px]"
             : size === "lg"
             ? "h-[450px] sm:h-[600px]"
             : ""
         }`}
         style={{ transform: `translateX(-${index * 100}%)` }}
       >
         {items.map((child, i) => (
           <div key={i} className="w-full flex-shrink-0">
             {child}
           </div>
         ))}
       </div>

       {/* Dots */}
       {showDots && (
         <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 space-x-2">
           {items.map((_, i) => (
             <button
               key={i}
               onClick={() => goTo(i)}
               className={`w-3 h-3 rounded-full ${
                 i === index ? "bg-black" : "bg-gray-300"
               } transition-colors duration-300`}
             />
           ))}
         </div>
       )}

       {/* Arrows (only md and up) */}
       {showLeft && (
         <DirectionButton
           icon={<Icon variant={ChevronLeft} size={32} />}
           className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow"
           onClick={prev}
         />
       )}
       {showRight && (
         <DirectionButton
           icon={<Icon variant={ChevronRight} size={32} />}
           className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full shadow"
           onClick={next}
         />
       )}
     </div>
   )
 }
