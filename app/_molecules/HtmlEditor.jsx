"use client";

import { PrimaryButton, OutlinedButton } from "../_atoms/Buttons";

export default function HtmlEditor({
  htmlContent,
  setHtmlContent,
  onLoadToEditor,
  onReset,
}) {
  // HTML'i formatla ve highlight et
  const formatAndHighlightHtml = (html) => {
    return html
      .replace(/></g, ">\n<") // Tag'leri satırlara böl
      .replace(/^\s+|\s+$/g, "") // Boşlukları temizle
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .join("\n")
      .replace(/(<[^>]+>)/g, '<span class="html-tag">$1</span>'); // Tag'leri highlight et
  };

  return (
    <div className="p-3">
      <div className="mb-2 text-sm text-gray-600">
        HTML kodunu düzenleyin. Değişiklikleri uygulamak için "HTML'den Yükle"
        butonuna tıklayın.
      </div>

      {/* HTML Preview */}
      <div className="w-full h-64 p-3 border rounded font-mono text-sm bg-gray-50 overflow-auto">
        <div
          dangerouslySetInnerHTML={{
            __html: formatAndHighlightHtml(htmlContent),
          }}
          className="whitespace-pre-wrap"
        />
      </div>

      {/* HTML Textarea */}
      <textarea
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        className="w-full h-32 p-3 border rounded font-mono text-sm mt-2"
        placeholder="HTML kodunu buraya yazın..."
      />

      {/* Action Buttons */}
      <div className="mt-2 flex gap-2">
        <PrimaryButton
          label="HTML'den Yükle"
          onClick={onLoadToEditor}
          className="bg-green-600 hover:bg-green-700"
        />
        <OutlinedButton
          label="Sıfırla"
          onClick={onReset}
          className="bg-primary900 text-primary900 hover:bg-primary800"
        />
      </div>
    </div>
  );
}
