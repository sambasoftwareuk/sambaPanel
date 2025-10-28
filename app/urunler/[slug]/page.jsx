import DetailPageTemplate from "@/app/_components/DetailPageTemp";
// import products from "../../constants/bigCardProducts.json";
// import sideMenuData from "../../mocks/sideMenuData.json";
import { getProductBySlug } from "@/lib/repos/products";
import { getMetaData } from "@/app/utils/metadataHelper";
import { getSideMenuForPath } from "../../../lib/repos/-sideMenu";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/urunler/${slug}`;
  return getMetaData(path);
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const locale = "tr-TR";
  const path = `/urunler`;
  // const sideMenu = await getSideMenuForPath(path, locale);

  function toArray(x) {
    return x == null ? [] : Array.isArray(x) ? x : [x];
  }
  // const arraySideMenu = toArray(sideMenu);
  const product = await getProductBySlug(slug, locale);

  return (
    <DetailPageTemplate
      page={product}
      locale={locale}
      // menu={arraySideMenu}
      activeHref={`/urunler/${product?.slug_i18n}`}
      // otherItems={product.filter((p) => p.slug !== slug)}
      otherItemsTitle="Diğer Ürünler"
      baseHref="urunler"
      notFoundText="Ürün bulunamadı."
    />
  );
}
