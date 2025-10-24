import { notFound } from "next/navigation";
import { getCorporatePage } from "@/lib/repos/pages";
import DetailPageTemplate from "../_components/DetailPageTemp";

export default async function KurumsalPage() {
  const data = await getCorporatePage("tr-TR"); // repo fonksiyonu
  const CORPORATE_SLUG = "kurumsal";

  if (!data) return notFound();
  
  return (
    <DetailPageTemplate
      page={data}
      pageSlug={CORPORATE_SLUG}
      pageId={data?.id}
      // menu={data?.sideMenu}
      notFoundText="Kurumsal sayfası bulunamadı."
    />
  );
}
