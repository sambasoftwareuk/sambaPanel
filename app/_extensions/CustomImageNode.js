import { Node } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CustomImageComponent from '../_molecules/CustomImageComponent';

export const CustomImageNode = Node.create({
  name: 'customImage',
  
  group: 'block',
  
  draggable: true,
  
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: '',
      },
      width: {
        default: '100%',
      },
      type: {
        default: 'image',
      },
      aspectRatio: {
        default: null,
      },
    };
  },
  
  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: (dom) => ({
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt'),
          width: dom.style.width || '100%',
          type: 'image',
        }),
      },
      {
        tag: 'iframe[src]',
        getAttrs: (dom) => ({
          src: dom.getAttribute('src'),
          alt: '',
          width: dom.style.width || '100%',
          type: 'iframe',
        }),
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    const { type, width, ...attrs } = HTMLAttributes;
    
    if (type === 'iframe') {
      return [
        'iframe',
        {
          ...attrs,
          style: `width: ${width || '100%'}; aspect-ratio: 16/9; border: none;`,
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          allowFullScreen: true,
        },
      ];
    }
    
    return ['img', { ...attrs, style: `width: ${width || '100%'}` }];
  },
  
  addNodeView() {
    return ReactNodeViewRenderer(CustomImageComponent);
  },
  
  addCommands() {
    return {
      setCustomImage: (options) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

