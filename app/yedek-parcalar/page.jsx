import React from "react";
import MainItemGrid from "../_components/MainItemGrid";
import Breadcrumb from "../_molecules/breadCrumb";
import spareParts from "../mocks/spareParts.json";
import { getMetadataForPath } from "../utils/metadataHelper";

export async function generateMetadata() {
  return getMetadataForPath("/yedek-parcalar");
}

const SparePartsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-center py-12 px-4">
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
