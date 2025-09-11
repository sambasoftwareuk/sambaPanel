"use client";

import ToolbarButton from "../_atoms/ToolbarButton";

export default function RichTextToolbar({ editor, onImageUpload }) {
  if (!editor) return null;

  return (
    <div className="mb-2 flex flex-wrap">
      {/* Text Formatting */}
      <ToolbarButton
        title="Kalın"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>

      <ToolbarButton
        title="İtalik"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </ToolbarButton>

      {/* Headings */}
      <ToolbarButton
        title="H1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        title="H2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>

      <ToolbarButton
        title="H3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>

      {/* Lists */}
      <ToolbarButton
        title="• Liste"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>

      <ToolbarButton
        title="1. Liste"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>

      {/* Blockquote */}
      <ToolbarButton
        title="Alıntı"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        ❝
      </ToolbarButton>

      {/* Links */}
      <ToolbarButton
        title="Bağlantı"
        onClick={() => {
          const url = prompt("Bağlantı URL");
          if (!url) return;
          editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url })
            .run();
        }}
      >
        🔗
      </ToolbarButton>

      <ToolbarButton
        title="Bağlantıyı Kaldır"
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        🔗✖
      </ToolbarButton>

      {/* Clear */}
      <ToolbarButton
        title="Temizle"
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
      >
        Temizle
      </ToolbarButton>

      {/* Text Alignment */}
      <ToolbarButton
        title="Sola Hizala"
        active={editor.isActive({ textAlign: "left" })}
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        ⬅
      </ToolbarButton>

      <ToolbarButton
        title="Ortala"
        active={editor.isActive({ textAlign: "center" })}
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        ⬍
      </ToolbarButton>

      <ToolbarButton
        title="Sağa Hizala"
        active={editor.isActive({ textAlign: "right" })}
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        ➡
      </ToolbarButton>

      <ToolbarButton
        title="İki Yana Yasla"
        active={editor.isActive({ textAlign: "justify" })}
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        ⬌
      </ToolbarButton>

      {/* Images */}
      <ToolbarButton
        title="Resim Ekle (URL)"
        onClick={() => {
          const url = prompt("Resim URL'si:");
          if (url) {
            const imageHtml = `<img src="${url}" alt="URL resmi" style="max-width: 100%; height: auto; max-height: 400px;" />`;
            const pos = editor.state.selection.from;
            editor.chain().focus().insertContentAt(pos, imageHtml).run();
          }
        }}
      >
        🖼️
      </ToolbarButton>

      <ToolbarButton
        title="Bilgisayardan Resim Yükle"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
              onImageUpload(file);
            }
          };
          input.click();
        }}
      >
        📷
      </ToolbarButton>
    </div>
  );
}
