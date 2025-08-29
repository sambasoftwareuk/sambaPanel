export function makeSlug(input, locale = "tr-TR") {
  let s = (input || "").normalize("NFC").toLowerCase();
  s = s.replace(/[^\p{L}\p{N}\- ]+/gu, ""); // harf/sayı/dash/space
  s = s.replace(/[\s_]+/g, "-");
  s = s.replace(/\-+/g, "-").replace(/^\-+|\-+$/g, "");
  if (s.length > 150) s = s.slice(0, 150).replace(/\-+$/,"");
  return s;
}
