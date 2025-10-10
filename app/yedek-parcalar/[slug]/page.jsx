import React from "react";
import spareParts from "../../mocks/spareParts.json";
import DetailPageTemplate from "@/app/_components/DetailPageTemp";
import { getMetadataForPath } from "@/app/utils/metadataHelper";
import { getSideMenuForPath } from "../../../lib/repos/sideMenu";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/yedek-parcalar/${slug}`;
  return getMetadataForPath(path);
}

export default async function SparePartDetailPage({ params }) {
  const { slug } = await params;
  const locale = "tr-TR";
  const path = `/yedek-parcalar`;
  const sideMenu = await getSideMenuForPath(path, locale);

  function toArray(x) {
    return x == null ? [] : Array.isArray(x) ? x : [x];
  }
  const arraySideMenu = toArray(sideMenu);

  const sparePart = spareParts.find((s) => s.slug === slug);

  return (
    <DetailPageTemplate
      page={sparePart}
      description={sparePart?.description}
      image={sparePart?.image}
      menu={arraySideMenu}
      activeHref={`/yedek-parcalar/${sparePart.slug}`}
      otherItems={spareParts?.filter((s) => s.slug !== slug)}
      otherItemsTitle="Diğer Yedek Parçalar"
      baseHref="yedek-parcalar"
      notFoundText="Yedek Parça bulunamadi."
    />
  );
}
