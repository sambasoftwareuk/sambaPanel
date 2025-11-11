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
        tag: 'video[src]',
        getAttrs: (dom) => ({
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt') || '',
          width: dom.style.width || '100%',
          type: 'video',
        }),
      },
    ];
  },
  
  renderHTML({ HTMLAttributes }) {
    const { type, ...attrs } = HTMLAttributes;
    if (type === 'video') {
      return ['video', { ...attrs, controls: true }];
    }
    return ['img', attrs];
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

