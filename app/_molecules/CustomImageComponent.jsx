"use client";

import { NodeViewWrapper } from '@tiptap/react';

export default function CustomImageComponent(props) {
  const { src, alt, width, type = 'image' } = props.node.attrs;
  
  const changeWidth = (newWidth) => {
    props.updateAttributes({ width: newWidth });
  };
  
  return (
    <NodeViewWrapper className="custom-image-wrapper">
      <div 
        className={`relative inline-block ${props.selected ? 'ring-2 ring-blue-500' : ''}`}
        style={{ width }}
      >
        {type === 'video' ? (
          <video 
            src={src}
            controls
            className="max-w-full h-auto rounded"
            style={{ width: '100%', height: 'auto' }}
          />
        ) : (
          <img 
            src={src}
            alt={alt}
            className="max-w-full h-auto rounded"
            style={{ width: '100%', height: 'auto' }}
          />
        )}
        
        {/* Genişlik kontrolleri - sadece seçiliyken göster */}
        {props.selected && (
          <div className="absolute -bottom-10 left-0 right-0 flex justify-center gap-1 bg-white border border-gray-300 rounded shadow-lg p-2">
            <button
              onClick={() => changeWidth('100%')}
              className={`px-3 py-1 text-xs rounded ${width === '100%' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              type="button"
            >
              Tam
            </button>
            <button
              onClick={() => changeWidth('75%')}
              className={`px-3 py-1 text-xs rounded ${width === '75%' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              type="button"
            >
              %75
            </button>
            <button
              onClick={() => changeWidth('50%')}
              className={`px-3 py-1 text-xs rounded ${width === '50%' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              type="button"
            >
              %50
            </button>
            <button
              onClick={() => changeWidth('33%')}
              className={`px-3 py-1 text-xs rounded ${width === '33%' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              type="button"
            >
              %33
            </button>
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

