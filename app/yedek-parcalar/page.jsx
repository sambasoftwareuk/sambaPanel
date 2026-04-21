import React from "react";
import MainItemGrid from "../_components/MainItemGrid";
import Breadcrumb from "../_molecules/BreadCrumb";
import { getAllSparePart } from "@/lib/repos/spareParts";
import { buildMetadata, getSeoPage } from "@/lib/repos/seo";
import JsonLd from "@/components/seo/JsonLd";

const locale = "tr-TR";

const yedekParcalarMetadataFallback = {
  title: "Yedek Parçalar - Greenstep Su Soğutma Kuleleri",
  description: "Yedek Parçalar sayfası - Greenstep Su Soğutma Kuleleri",
  canonical: "/yedek-parcalar",
};

export async function generateMetadata() {
  const seo = await getSeoPage("yedek-parcalar", locale);
  return buildMetadata(seo, yedekParcalarMetadataFallback);
}

const SparePartsPage = async () => {
  const [spareParts, seo] = await Promise.all([
    getAllSparePart(locale, "spare"),
    getSeoPage("yedek-parcalar", locale),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 text-center py-12 px-4">
      <JsonLd data={seo?.json_ld} />
      <Breadcrumb title={"Yedek Parçalar"} />
      <MainItemGrid
        items={spareParts}
        title="Yedek Parçalar"
        baseHref="yedek-parcalar"
        gridClassName="grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"
        cardProps={{ button: false, variant: 2 }}
      />
    </div>
  );
};

export default SparePartsPage;
