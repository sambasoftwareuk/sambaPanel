import React from "react";
import references from "../mocks/references.json";
import ProductCardWithImage from "../_molecules/ProductCardWithImage";
import { Header1 } from "../_atoms/Headers";
import Breadcrumb from "../_molecules/BreadCrumb";
import { getMetaData } from "../utils/metadataHelper";

export async function generateMetadata() {
  return await getMetaData("/referanslar");
}

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50  text-center py-12 px-4 ">
      <Breadcrumb />
      <Header1 className="text-3xl font-bold  mb-10">Referanslar</Header1>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:mx-16 lg:mx-24 xl:mx-40">
        {references.map((ref, index) => (
          <ProductCardWithImage
            key={index}
            title={ref.title}
            imageLink={ref.imageLink}
            layout="vertical"
            variant={2}
            button={false}
            titleFontSize="text-lg"
            titleColor="text-gray-800"
            showBottomLine={true}
          />
        ))}
      </div>
    </div>
  );
};

export default Page;
