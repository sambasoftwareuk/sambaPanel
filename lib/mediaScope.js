export function resolveMediaScope(pageSlug, baseHref) {
  if (
    pageSlug === "kurumsal" ||
    pageSlug === "about-us" ||
    pageSlug === "corporate"
  ) {
    return "kurumsal";
  }

  const byBaseHref = {
    urunler: "product",
    hizmetler: "service",
    "yedek-parcalar": "spare",
  };

  if (baseHref && byBaseHref[baseHref]) {
    return byBaseHref[baseHref];
  }

  if (!pageSlug) return "gallery";
  if (pageSlug.startsWith("urun")) return "product";
  if (pageSlug.startsWith("hizmet")) return "service";
  if (pageSlug.startsWith("yedek") || pageSlug.includes("spare")) return "spare";
  if (pageSlug.startsWith("iletisim") || pageSlug.startsWith("contact")) {
    return "contact";
  }

  return "gallery";
}
