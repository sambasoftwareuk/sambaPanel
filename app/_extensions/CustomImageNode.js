import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import CustomImageComponent from "../_molecules/CustomImageComponent";

export const CustomImageNode = Node.create({
  name: "customImage",

  group: "block",

  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: "",
      },
      width: {
        default: "100%",
      },
      type: {
        default: "image",
      },
      aspectRatio: {
        default: null,
      },
      textAlign: {
        default: null,
      },
    };
  },

 parseHTML() {
  return [
    {
      tag: "img[src]",
      getAttrs: (dom) => {
        const style = dom.style || {};
        const marginLeft = style.marginLeft || "";
        const marginRight = style.marginRight || "";
        
        // Margin'den textAlign hesapla
        let textAlign = null;
        if (marginLeft === "auto" && marginRight === "auto") {
          textAlign = "center";
        } else if (marginLeft === "auto") {
          textAlign = "right";
        } else if (marginLeft === "0" || !marginLeft) {
          textAlign = "left";
        }
        
        return {
          src: dom.getAttribute("src"),
          alt: dom.getAttribute("alt"),
          width: style.width || "100%",
          type: "image",
          textAlign: textAlign,
        };
      },
    },
    {
      tag: "iframe[src]",
      getAttrs: (dom) => {
        const style = dom.style || {};
        const marginLeft = style.marginLeft || "";
        const marginRight = style.marginRight || "";
        
        // Margin'den textAlign hesapla
        let textAlign = null;
        if (marginLeft === "auto" && marginRight === "auto") {
          textAlign = "center";
        } else if (marginLeft === "auto") {
          textAlign = "right";
        } else if (marginLeft === "0" || !marginLeft) {
          textAlign = "left";
        }
        
        return {
          src: dom.getAttribute("src"),
          alt: "",
          width: style.width || "100%",
          type: "iframe",
          textAlign: textAlign,
        };
      },
    },
  ];
},

  renderHTML({ HTMLAttributes }) {
    const { type, width, textAlign, ...attrs } = HTMLAttributes;

    let marginStyle = "";
    if (textAlign === "center") {
      marginStyle = "margin-left: auto; margin-right: auto;";
    } else if (textAlign === "right") {
      marginStyle = "margin-left: auto; margin-right: 0;";
    } else {
      marginStyle = "margin-left: 0; margin-right: auto;";
    }

    if (type === "iframe") {
      return [
        "iframe",
        {
          ...attrs,
          style: `width: ${
            width || "100%"
          }; aspect-ratio: 16/9; border: none; display: block; ${marginStyle}`,
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
          allowFullScreen: true,
        },
      ];
    }

    return [
      "img",
      {
        ...attrs,
        style: `width: ${width || "100%"}; display: block; ${marginStyle}`,
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(CustomImageComponent);
  },

  addCommands() {
    return {
      setCustomImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
