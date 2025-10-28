import React from "react";
import DetailPageTemplate from "@/app/_components/DetailPageTemp";
import { getMetaData } from "@/app/utils/metadataHelper";
import { getSparePartBySlug } from "@/lib/repos/spare-parts";
// import { getSideMenuForPath } from "../../../lib/repos/-sideMenu";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/yedek-parcalar/${slug}`;
  return getMetaData(path);
}

export default async function SparePartDetailPage({ params }) {
  const { slug } = await params;
  const locale = "tr-TR";
  const path = `/yedek-parcalar`;
  // const sideMenu = await getSideMenuForPath(path, locale);

  function toArray(x) {
    return x == null ? [] : Array.isArray(x) ? x : [x];
  }
  // const arraySideMenu = toArray(sideMenu);

  const sparePart = await getSparePartBySlug(slug, locale);

  return (
    <DetailPageTemplate
      page={sparePart}
      // menu={arraySideMenu}
      activeHref={`/yedek-parcalar/${sparePart?.slug_i18n}`}
      // otherItems={otherItems} //!Bu kisim daha sonra yapilacak
      otherItemsTitle="Diğer Yedek Parçalar"
      baseHref="yedek-parcalar"
      notFoundText="Yedek Parça bulunamadi."
    />
  );
}
