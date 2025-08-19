import DetailPageTemplate from "@/app/_components/DetailPageTemp";
import services from "../../mocks/services.json";
import sideMenuData from "../../mocks/sideMenuData.json";
import { getMetadataForPath } from "@/app/utils/metadataHelper";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/hizmetler/${slug}`;
  return getMetadataForPath(path);
}

export default async function ServicesDetailPage({ params }) {
  const { slug } = await params;

  const service = services.find((s) => s.slug === slug);
  const serviceMenu = sideMenuData.filter(
    (section) => section.title === "Hizmetlerimiz"
  );

  if (!service) {
    return <div className="p-6 text-red-500">Hizmet bulunamadı.</div>;
  }

  return (
    <DetailPageTemplate
      title={service?.title}
      description={service?.description}
      image={service?.image}
      menu={serviceMenu}
      activeHref={`/hizmetler/${service.slug}`}
      otherItems={services.filter((s) => s.slug !== slug)}
      otherItemsTitle="Diğer Hizmetler"
      baseHref="hizmetler"
      notFoundText="Hizmet bulunamadı."
    />
  );
}
