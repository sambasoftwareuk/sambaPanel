import { parseJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";

export default function JsonLd({ data }) {
  const parsed = parseJsonLd(data);

  if (!parsed) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(parsed),
      }}
    />
  );
}
