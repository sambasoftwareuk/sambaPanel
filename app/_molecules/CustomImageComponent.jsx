"use client";

import { useState, useRef, useEffect } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

export default function CustomImageComponent(props) {
  const { src, alt, width, type = 'image', aspectRatio } = props.node.attrs;
  const containerRef = useRef(null);
  const resizeHandleRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startWidth, setStartWidth] = useState(0);
  const [startX, setStartX] = useState(0);

  // Aspect ratio hesapla (ilk render'da)
  const [calculatedAspectRatio, setCalculatedAspectRatio] = useState(aspectRatio);

  useEffect(() => {
    if (type === 'iframe') {
      setCalculatedAspectRatio(16 / 9); // YouTube default
    } else if (containerRef.current && !aspectRatio) {
      const img = containerRef.current.querySelector('img');
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
    setIsResizing(true);
    setStartX(e.clientX);
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setStartWidth(rect.width);
    }
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;
      
      if (containerRef.current && containerRef.current.parentElement) {
        const parentWidth = containerRef.current.parentElement.getBoundingClientRect().width;
        const maxWidth = parentWidth;
        const minWidth = 100; // Minimum 100px
        
        let finalWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
        const percentage = (finalWidth / parentWidth) * 100;
        
        props.updateAttributes({ width: `${percentage}%` });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, startX, startWidth, props]);

  return (
    <NodeViewWrapper className="custom-image-wrapper" contentEditable={false}>
      <div 
        ref={containerRef}
        className={`relative inline-block ${props.selected ? 'ring-2 ring-blue-500' : ''}`}
        style={{ width }}
      >
        {type === 'iframe' ? (
          <iframe
            src={src}
            className="max-w-full rounded"
            style={{ 
              width: '100%', 
              aspectRatio: calculatedAspectRatio ? `${calculatedAspectRatio}` : '16/9',
              border: 'none'
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
              width: '100%', 
              height: 'auto',
              aspectRatio: calculatedAspectRatio ? `${calculatedAspectRatio}` : 'auto'
            }}
          />
        )}
        
        {/* Resize handle - sağ üst köşe, ok büyüttüğüm tarafa doğru (sağa-aşağı) */}
        {props.selected && (
          <div
            ref={resizeHandleRef}
            onMouseDown={handleMouseDown}
            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 border-2 border-white rounded shadow-lg z-10 flex items-center justify-center"
            style={{ cursor: 'nesw-resize' }}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 8L8 0M6 0H8V2M2 8H0V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}
