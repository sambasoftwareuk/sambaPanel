import React from "react";
// import products from "../constants/bigCardProducts.json"; (static data)
import MainItemGrid from "../_components/MainItemGrid";
import Breadcrumb from "../_molecules/BreadCrumb";
import { getProductCollections } from "@/lib/repos/products";
import { buildMetadata, getSeoPage } from "@/lib/repos/seo";
import JsonLd from "@/components/seo/JsonLd";

const locale = "tr-TR";

const urunlerMetadataFallback = {
  title: "Ürünlerimiz - Greenstep Su Soğutma Kuleleri",
  description: "Ürünlerimiz sayfası - Greenstep Su Soğutma Kuleleri",
  canonical: "/urunler",
};

export async function generateMetadata() {
  const seo = await getSeoPage("urunler", locale);
  return buildMetadata(seo, urunlerMetadataFallback);
}

const ProductPage = async () => {
  const [products, seo] = await Promise.all([
    getProductCollections(locale, "product"),
    getSeoPage("urunler", locale),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 text-center py-12 px-4">
      <JsonLd data={seo?.json_ld} />
      <Breadcrumb title={"Ürünler"} />
      <MainItemGrid items={products} title="Ürünlerimiz" />
    </div>
  );
};

export default ProductPage;
