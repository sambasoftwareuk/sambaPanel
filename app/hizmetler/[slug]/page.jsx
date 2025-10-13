import { getMetadataForPath } from "@/app/utils/metadataHelper";
import { getSingleService } from "@/lib/repos/-services";
import { getSideMenuForPath } from "../../../lib/repos/-sideMenu";
import DetailPageTemplate from "@/app/_components/DetailPageTemp";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/hizmetler/${slug}`;
  return getMetadataForPath(path);
}

export default async function ServicesDetailPage({ params }) {
  const { slug } = await params;
  const locale = "tr-TR";
  const path = `/hizmetler`;
  const sideMenu = await getSideMenuForPath(path, locale);

  function toArray(x) {
    return x == null ? [] : Array.isArray(x) ? x : [x];
  }
  const arraySideMenu = toArray(sideMenu);

  const serviceFromServer = await getSingleService(slug, locale);

  if (!serviceFromServer) {
    return <div className="p-6 text-red-500">Hizmet bulunamadı.</div>;
  }
  return (
    <DetailPageTemplate
      pageId={serviceFromServer?.id}
      page={serviceFromServer}
      title={serviceFromServer?.name}
      description={serviceFromServer?.content_html}
      //buradaki image şuan tek link olarak hero_url olarak geliyor anca bunun bir liste olaması ve service_media'dan gelmesi lazım. Hem burası hem de getSingleService fonksiyonu düzenlenmeli
      image={serviceFromServer?.hero_url}
      menu={arraySideMenu}
      activeHref={`/hizmetler/${serviceFromServer?.slug_i18n}`}
      //Aşağıdaki bölümü ayarlamamız lazım
      // otherItems={serviceFromServer?.filter((s) => s.slug !== slug)}
      otherItemsTitle="Diğer Hizmetler"
      baseHref="hizmetler"
      notFoundText="Hizmet bulunamadı."
    />
  );
}
