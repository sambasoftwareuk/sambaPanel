import React from "react";
// import products from "../constants/bigCardProducts.json"; (static data)
import MainItemGrid from "../_components/MainItemGrid";
import Breadcrumb from "../_molecules/BreadCrumb";
import { getMetadataForPath } from "../utils/metadataHelper";
import { getProductGroups } from "@/lib/repos/-page";

export async function generateMetadata() {
  return getMetadataForPath("/urunler");
}

const locale = "tr-TR";
const products = await getProductGroups({ locale });

const ProductPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-center py-12 px-4">
      <Breadcrumb title={"Ürünler"} />
      <MainItemGrid items={products} title="Ürünlerimiz" baseHref="urunler" />
    </div>
  );
};

export default ProductPage;
