import DetailPageTemplate from "@/app/_components/DetailPageTemp";
import products from "../../constants/bigCardProducts.json";
import sideMenuData from "../../mocks/sideMenuData.json";
import { getMetadataForPath } from "@/app/utils/metadataHelper";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/urunler/${slug}`;
  return getMetadataForPath(path);
}
export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  const productMenu = sideMenuData.filter(
    (section) => section.title === "Ürünlerimiz"
  );

  return (
    <DetailPageTemplate
      title={product?.title}
      description={product?.description}
      image={product?.image}
      menu={productMenu}
      activeHref={`/urunler/${product?.slug}`}
      otherItems={products.filter((p) => p.slug !== slug)}
      otherItemsTitle="Diğer Ürünler"
      baseHref="urunler"
      notFoundText="Ürün bulunamadı."
    />
  );
}
