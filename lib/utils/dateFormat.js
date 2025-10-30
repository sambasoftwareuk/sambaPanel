// lib/utils/dateFormat.js
// Tarihi Türkçe formatla: "29 Haziran 2025"

const TURKISH_MONTHS = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

/**
 * Tarihi Türkçe formata çevirir
 * @param {string|Date} date - Tarih string veya Date objesi
 * @returns {string} - "DD MMMM YYYY" formatında Türkçe tarih (örn: "29 Haziran 2025")
 */
export function formatTurkishDate(date) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const day = dateObj.getDate();
  const month = TURKISH_MONTHS[dateObj.getMonth()];
  const year = dateObj.getFullYear();

  return `${day} ${month} ${year}`;
}
