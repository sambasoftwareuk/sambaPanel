import DetailPageTemplate from "@/app/_components/DetailPageTemp";
// import products from "../../constants/bigCardProducts.json";
// import sideMenuData from "../../mocks/sideMenuData.json";
import { getMetadataForPath } from "@/app/utils/metadataHelper";
import { getSingleProduct } from "@/lib/repos/page";
import {
  getSideMenuForPath,
} from "../../../lib/repos/sideMenu";
import { toArray } from "@/app/utils/toArray";
import { getSideMenuData } from "@/app/utils/getSideMenuData";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/urunler/${slug}`;
  return getMetadataForPath(path);
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const locale = "tr-TR";
  const path = `/urunler`;
  const sideMenu = await getSideMenuData(path, locale);
  // const arraySideMenu = toArray(sideMenu);
  const product = await getSingleProduct(slug, locale);

  console.log("SM:", sideMenu);
  

  return (
    <DetailPageTemplate
      title={product?.name}
      description={product?.content_html}
      image={product?.hero_url}
      menu={sideMenu}
      activeHref={`/urunler/${product?.slug}`}
      // otherItems={product.filter((p) => p.slug !== slug)}
      otherItemsTitle="Diğer Ürünler"
      baseHref="urunler"
      notFoundText="Ürün bulunamadı."
    />
  );
}
