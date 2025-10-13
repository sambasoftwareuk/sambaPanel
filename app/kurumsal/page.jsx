import { notFound } from "next/navigation";
import { getCorporatePage } from "@/lib/repos/pages";
import DetailPageTemplate from "../_components/DetailPageTemp";


export default async function KurumsalPage({ params: { locale} }) {
  const data = await getCorporatePage(locale); // repo fonksiyonu
  
  if (!data) return notFound();


  return (
    <DetailPageTemplate
      page={data}
      pageId={data?.id}
      // menu={data?.sideMenu}
      locale={locale}
      notFoundText="Kurumsal sayfası bulunamadı."
    />
  );
}
