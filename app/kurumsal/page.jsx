import { getKurumsalPage } from "@/lib/repos/page";
import DetailPageTemplate from "../_components/DetailPageTemp";

export default async function KurumsalPage() {
  const locale = "tr-TR";
  const page = await getKurumsalPage(locale);

  return (
    <DetailPageTemplate
      page={page}
      locale={locale}
      notFoundText="Kurumsal sayfası bulunamadı."
    />
  );
}
