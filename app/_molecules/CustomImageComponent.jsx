"use client";

import { useState, useRef, useEffect } from "react";
import { NodeViewWrapper } from "@tiptap/react";

export default function CustomImageComponent(props) {
  const {
    src,
    alt,
    width,
    type = "image",
    aspectRatio,
    textAlign,
  } = props.node.attrs;
  const containerRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startWidth, setStartWidth] = useState(0);
  const [startX, setStartX] = useState(0);
  const [activeCorner, setActiveCorner] = useState(null);
  const [startLeft, setStartLeft] = useState(0);

  // Aspect ratio hesapla (ilk render'da)
  const [calculatedAspectRatio, setCalculatedAspectRatio] =
    useState(aspectRatio);

  useEffect(() => {
    if (type === "iframe") {
      setCalculatedAspectRatio(16 / 9); // YouTube default
    } else if (containerRef.current && !aspectRatio) {
      const img = containerRef.current.querySelector("img");
      if (img) {
        img.onload = () => {
          const ratio = img.naturalWidth / img.naturalHeight;
          setCalculatedAspectRatio(ratio);
          props.updateAttributes({ aspectRatio: ratio });
        };
      }
    }
  }, [type, src]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const corner = e.currentTarget.dataset.corner;
    setActiveCorner(corner);
    setIsResizing(true);
    setStartX(e.clientX);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setStartWidth(rect.width);
      setStartLeft(rect.left);
    }
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.deleteNode();
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      if (containerRef.current && containerRef.current.parentElement) {
        const parentWidth =
          containerRef.current.parentElement.getBoundingClientRect().width;
        const maxWidth = parentWidth;
        const minWidth = 100; // Minimum 100px

        let deltaX = e.clientX - startX;
        let newWidth;
        let newLeft;

        // Sol köşeler için ters mantık
        if (activeCorner === "bottom-left" || activeCorner === "top-left") {
          // Sola gidince width azalır, left pozisyonu sola kayar
          newWidth = startWidth - deltaX;
          newLeft = startLeft + deltaX;

          // Sınırları kontrol et
          newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

          // Parent'a göre yüzde hesapla
          const percentage = (newWidth / parentWidth) * 100;

          // marginLeft'i parent'a göre hesapla
          const parentLeft =
            containerRef.current.parentElement.getBoundingClientRect().left;
          const marginLeftPx = newLeft - parentLeft;
          const marginLeftPercent = (marginLeftPx / parentWidth) * 100;

          props.updateAttributes({
            width: `${percentage}%`,
            marginLeft: `${marginLeftPercent}%`,
          });
        } else {
          // Sağ köşeler için mevcut mantık
          newWidth = startWidth + deltaX;
          newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
          const percentage = (newWidth / parentWidth) * 100;
          props.updateAttributes({ width: `${percentage}%` });
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setActiveCorner(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, startX, startWidth, startLeft, activeCorner, props]);

  return (
    <NodeViewWrapper className="custom-image-wrapper" contentEditable={false}>
      <div
        ref={containerRef}
        className={`relative block rounded ${
          props.selected ? "ring-2 ring-primary" : ""
        }`}
        style={{
          width,
          marginLeft:
            textAlign === "right"
              ? "auto"
              : textAlign === "center"
              ? "auto"
              : "0",
          marginRight:
            textAlign === "left"
              ? "auto"
              : textAlign === "center"
              ? "auto"
              : "0",
          display: "block",
          cursor: type === "iframe" ? "default" : "auto",
        }}
      >
        {type === "iframe" ? (
          <iframe
            src={src}
            className="max-w-full rounded"
            style={{
              width: "100%",
              aspectRatio: calculatedAspectRatio
                ? `${calculatedAspectRatio}`
                : "16/9",
              border: "none",
              cursor: "default",
              pointerEvents: isResizing ? "none" : "auto",
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={src}
            alt={alt}
            className="max-w-full h-auto rounded"
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: calculatedAspectRatio
                ? `${calculatedAspectRatio}`
                : "auto",
            }}
          />
        )}

        {/* Resize handle - sağ üst köşe, ok büyüttüğüm tarafa doğru (sağa-aşağı) */}
        {props.selected && (
          <button
            onClick={handleDelete}
            className="absolute -top-1 -left-1 w-6 h-6 bg-red-600 hover:bg-red-700 bg-red rounded-full shadow-lg z-10 flex items-center justify-center cursor-pointer"
            title="Sil"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 3L3 9M3 3L9 9"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Resize handles - 4 köşe */}
        {props.selected && (
          <>
            {/* Sağ üst köşe */}
            <div
              ref={resizeHandleRef}
              onMouseDown={handleMouseDown}
              data-corner="top-right"
              className="absolute -top-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded shadow-lg z-10 flex items-center justify-center"
              style={{ cursor: "nesw-resize" }}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 8L8 0M6 0H8V2M2 8H0V6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Sağ alt köşe */}
            <div
              onMouseDown={handleMouseDown}
              data-corner="bottom-right"
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary border-2 border-white rounded shadow-lg z-10 flex items-center justify-center"
              style={{ cursor: "nwse-resize" }}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                transform="rotate(270)"
              >
                <path
                  d="M0 8L8 0M6 0H8V2M2 8H0V6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Sol alt köşe */}
            <div
              onMouseDown={handleMouseDown}
              data-corner="bottom-left"
              className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary border-2 border-white rounded shadow-lg z-10 flex items-center justify-center"
              style={{ cursor: "nesw-resize" }}
            >
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 8L8 0M6 0H8V2M2 8H0V6"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
}
