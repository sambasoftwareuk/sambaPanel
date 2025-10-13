import services from "../mocks/services.json";
import MainItemGrid from "../_components/MainItemGrid";
import Breadcrumb from "../_molecules/BreadCrumb";
import { getMetadataForPath } from "../utils/metadataHelper";
import { getServicesForListing } from "@/lib/repos/-services";

export async function generateMetadata() {
  return getMetadataForPath("/hizmetler");
}

export default async function ServicesPage() {
  const locale = "tr-TR";
  const filteredServices = await getServicesForListing(locale);
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb title={"Hizmetler"} />
      <MainItemGrid
        items={filteredServices}
        title="Hizmetler"
        baseHref="hizmetler"
        gridClassName="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        cardProps={{ variant: 2, button: false, titleColor: "text-black" }}
      />
    </div>
  );
}
