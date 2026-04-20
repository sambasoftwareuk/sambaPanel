function isPlainObject(value) {
  if (!value || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function parseJsonLd(value) {
  if (value == null) return null;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;

    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) || isPlainObject(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }

  if (Array.isArray(value) || isPlainObject(value)) {
    return value;
  }

  return null;
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
