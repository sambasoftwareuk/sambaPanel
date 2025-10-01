// utils/sanitizeHtml.js
import sanitizeHtml from "sanitize-html";

/**
 * Güvenli HTML döndürür.
 * - Sadece whitelist edilen tag ve attribute'ları bırakır
 * - XSS riskini azaltır
 * 
 * @param {string} dirtyHtml - DB'den ya da dış kaynaktan gelen ham HTML
 * @returns {string} temizlenmiş HTML
 */
export function sanitizeHtmlContent(dirtyHtml = "") {
  return sanitizeHtml(dirtyHtml, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "ul", "ol", "li",
      "a", "h1", "h2", "h3", "h4", "h5", "h6",
      "blockquote", "code", "pre", "img",
      "table", "thead", "tbody", "tr", "th", "td",
      "hr", "span", "div"
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "title", "loading"],
      "*": ["style"], // İstersen kapatabilirsin
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
  });
}
