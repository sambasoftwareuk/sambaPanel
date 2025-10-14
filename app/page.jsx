import services from "./mocks/services.json";
import ProductBanner from "./_molecules/ProductBanner";
import SliderComponent from "./_components/SliderComponent.jsx";
import bannerProducts from "./mocks/bannerProducts.json";
// import mainProducts from "./constants/bigCardProducts.json"; //(static data)
import CarouselSlider from "./_components/CarouselSlider.jsx";
import products from "./mocks/spareParts.json";
import MainItemGrid from "./_components/MainItemGrid.jsx";
import BlogComponent from "./_components/BlogComponent.jsx";
import blogData from "./mocks/blogData.json";
import { getHomeData } from "@/lib/repos/home";

const locale = "tr-TR";
const data = await getHomeData(locale, { latestBlog: 8 });


export default function Home() {
  const recentBlogs = blogData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SliderComponent
        size={"lg"}
        sliderData={data?.slider}
        orientation={"split-horizontal"}
      />
      <ProductBanner bannerProducts={data?.featuredItems} />

      <MainItemGrid
        items={data?.featuredCollections}
        title="Ürünlerimiz"
        baseHref="urunler"
      />
      
      <CarouselSlider
        data={data?.spareCarousel}
        title="Yedek Parçalar"
        isAutoSlide={true}
        isInfinite={true}
      />
      <CarouselSlider
        data={data?.serviceCarousel}
        title="Hizmetlerimiz"
        isAutoSlide={true}
        isInfinite={true}
      />
      <BlogComponent
        blogData={data?.latestPosts}
        title="Son Blog Yazıları"
        maxItems={4}
        showViewAllButton={true}
      />
    </div>
  );
}
