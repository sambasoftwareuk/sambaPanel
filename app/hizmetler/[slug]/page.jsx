import DetailPageTemplate from "@/app/_components/DetailPageTemp";
import services from "../../mocks/services.json";
import sideMenuData from "../../mocks/sideMenuData.json";
import { getMetadataForPath } from "@/app/utils/metadataHelper";
import { getSingleService } from "@/lib/repos/services";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/hizmetler/${slug}`;
  return getMetadataForPath(path);
}

export default async function ServicesDetailPage({ params }) {
  const { slug } = await params;

  const serviceFromServer = await getSingleService(slug, "tr-TR"); 

 
  const serviceMenu = sideMenuData.filter(
    (section) => section.title === "Hizmetlerimiz"
  );

  if (!serviceFromServer) {
    return <div className="p-6 text-red-500">Hizmet bulunamadı.</div>;
  }
  
  return (
    <DetailPageTemplate
      title={serviceFromServer?.name}
      description={serviceFromServer?.content_html}
      //buradaki image şuan tek link olarak hero_url olarak geliyor anca bunun bir liste olaması ve service_media'dan gelmesi lazım. Hem burası hem de getSingleService fonksiyonu düzenlenmeli 
      image={serviceFromServer?.hero_url}
      menu={serviceMenu}
      activeHref={`/hizmetler/${serviceFromServer?.slug_i18n}`}

      //Aşağıdaki bölümü ayarlamamız lazım
      // otherItems={serviceFromServer?.filter((s) => s.slug !== slug)}
      otherItemsTitle="Diğer Hizmetler"
      baseHref="hizmetler"
      notFoundText="Hizmet bulunamadı."
    />
  );
}
