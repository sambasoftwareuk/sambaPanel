import services from "./mocks/services.json";
import sliderData from "./mocks/sliderData.json";
import ProductBanner from "./_molecules/productBanner";
import SliderComponent from "./_components/sliderComponent.jsx";
import bannerProducts from "./mocks/bannerProducts.json";
import mainProducts from "./constants/bigCardProducts.json";
import CarouselSlider from "./_components/CarouselSlider.jsx";
import products from "./mocks/spareParts.json";
import MainItemGrid from "./_components/MainItemGrid.jsx";
import BlogComponent from "./_components/BlogComponent.jsx";
import blogData from "./mocks/blogData.json";

export default function Home() {
  const recentBlogs = blogData
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SliderComponent
        size={"lg"}
        sliderData={sliderData}
        orientation={"split-horizontal"}
      />
      <ProductBanner bannerProducts={bannerProducts} />

      <MainItemGrid
        items={mainProducts.filter((item) => item.showOnMainPage)}
        title="Ürünlerimiz"
        baseHref="urunler"
      />
      <CarouselSlider
        data={products}
        title="Yedek Parçalar"
        isAutoSlide={true}
        isInfinite={true}
      />
      <CarouselSlider
        data={services}
        title="Hizmetlerimiz"
        isAutoSlide={true}
        isInfinite={true}
      />
      <BlogComponent
        blogData={recentBlogs}
        title="Son Blog Yazıları"
        maxItems={4}
        showViewAllButton={true}
      />
    </div>
  );
}
