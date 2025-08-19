import React from "react";
import products from "../constants/bigCardProducts.json";
import MainItemGrid from "../_components/MainItemGrid";
import Breadcrumb from "../_molecules/breadCrumb";
import { getMetadataForPath } from "../utils/metadataHelper";

export async function generateMetadata() {
  return getMetadataForPath("/urunler");
}

const ProductPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-center py-12 px-4">
      <Breadcrumb title={"Ürünler"} />
      <MainItemGrid items={products} title="Ürünlerimiz" baseHref="urunler" />
    </div>
  );
};

export default ProductPage;
