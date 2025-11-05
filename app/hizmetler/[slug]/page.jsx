import { getMetaData } from "@/app/utils/metadataHelper";
// import { getSideMenuForPath } from "../../../lib/repos/-sideMenu";
import DetailPageTemplate from "@/app/_components/DetailPageTemp";
import { getServiceBySlug, getOtherServices } from "@/lib/repos/services";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/hizmetler/${slug}`;
  return getMetaData(path);
}
export default async function ServicesDetailPage({ params }) {
  const { slug } = await params;
  const locale = "tr-TR";
  const path = `/hizmetler`;
  // const sideMenu = await getSideMenuForPath(path, locale);

  function toArray(x) {
    return x == null ? [] : Array.isArray(x) ? x : [x];
  }
  // const arraySideMenu = toArray(sideMenu);

  const serviceFromServer = await getServiceBySlug(slug, locale);
  const otherItems = await getOtherServices(slug, locale);

  if (!serviceFromServer) {
    return <div className="p-6 text-red-500">Hizmet bulunamadı.</div>;
  }

  return (
    <DetailPageTemplate
      pageId={serviceFromServer?.id}
      page={serviceFromServer}
      //buradaki image şuan tek link olarak hero_url olarak geliyor anca bunun bir liste olaması ve service_media'dan gelmesi lazım. Hem burası hem de getSingleService fonksiyonu düzenlenmeli
      // menu={arraySideMenu}
      activeHref={`/hizmetler/${serviceFromServer?.slug_i18n}`}
      otherItems={otherItems}
      otherItemsTitle="Diğer Hizmetler"
      baseHref="hizmetler"
      notFoundText="Hizmet bulunamadı."
    />
  );
}
