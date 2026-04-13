import Link from "next/link";
import SliderComponent from "./_components/SliderComponent.jsx";
import CarouselSlider from "./_components/CarouselSlider.jsx";
import MainItemGrid from "./_components/MainItemGrid.jsx";
import BlogComponent from "./_components/BlogComponent.jsx";
import { getHomeData } from "@/lib/repos/home";

const locale = "tr-TR";
const data = await getHomeData(locale, { latestBlog: 8 });


export default function Home() {

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <section className="w-full">
        <SliderComponent
          size={"lg"}
          sliderData={data?.slider}
          orientation={"split-horizontal"}
          cardHeadingLevel={2}
        />
      </section>

      <section className="w-full bg-primary50 border-y border-primary100">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
          <h1 className="text-2xl md:text-3xl font-bold text-primary text-center md:text-left">
            Greenstep Su Soğutma Kulesi Üreticisi
          </h1>
          <p className="mt-3 text-gray-700 max-w-4xl text-base">
            Endüstriyel tesislere özel su soğutma kulesi tasarım, üretim ve montaj hizmetini tek merkezden sunuyoruz. Projenize uygun sistemi kısa sürede planlayıp güvenilir performansla devreye alıyoruz.
          </p>
          <p className="mt-2 text-gray-700 max-w-4xl text-sm md:text-base font-medium">
            Ürün, hizmet ve yedek parçada hızlı teklif ve teknik destek.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/iletisim" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary900 transition-colors">
              Hemen Teklif Alın
            </Link>
            <Link href="/urunler" className="bg-white text-primary border border-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary100 transition-colors">
              Ürünleri Görün
            </Link>
          </div>

          <nav className="mt-4 flex flex-wrap gap-4 text-sm md:text-base">
            <Link href="/urunler" className="text-primary underline underline-offset-4">Ürün Çözümleri</Link>
            <Link href="/hizmetler" className="text-primary underline underline-offset-4">Mühendislik Hizmetleri</Link>
            <Link href="/yedek-parcalar" className="text-primary underline underline-offset-4">Yedek Parça Çözümleri</Link>
          </nav>
        </div>
      </section>

      <section className="w-full">
        <MainItemGrid
          items={data?.featuredCollections}
          title="Ürün Kategorileri"
          baseHref="urunler"
          headingLevel={2}
        />
      </section>

      <section className="w-full">
        <CarouselSlider
          data={data?.serviceCarousel}
          title="Hizmetler"
          isAutoSlide={true}
          isInfinite={true}
          headingLevel={2}
        />
      </section>

      <section className="w-full">
        <CarouselSlider
          data={data?.spareCarousel}
          title="Yedek Parçalar"
          isAutoSlide={true}
          isInfinite={true}
          headingLevel={2}
        />
      </section>

      <section className="w-full max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-bold text-primary">Güven ve Deneyim</h2>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          Farklı sektörlerde tamamladığımız projeler, mühendislik tecrübemiz ve satış sonrası desteğimizle
          işletmelerin sürdürülebilir soğutma performansı elde etmesine yardımcı oluyoruz.
        </p>
        <div className="mt-6">
          <Link href="/referanslar" className="text-primary font-semibold underline underline-offset-4">
            Referanslarımızı Görün
          </Link>
        </div>
      </section>

      <section className="w-full bg-primary900 text-white py-10 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">Projeniz için uygun çözümü birlikte belirleyelim</h2>
        <p className="mt-3 text-sm md:text-base max-w-3xl mx-auto">
          Teknik ekibimizle iletişime geçin, kapasite ve uygulama senaryonuza uygun kule tipini kısa sürede tekliflendirelim.
        </p>
        <div className="mt-5">
          <Link href="/iletisim" className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary100 transition-colors">
            Teklif ve Keşif Talebi
          </Link>
        </div>
      </section>

      <section className="w-full" aria-label="Blog içerikleri">
        <h2 className="text-3xl font-bold text-primary text-center mt-10">Bilgi Merkezi</h2>
        <BlogComponent
          blogData={data?.latestPosts}
          maxItems={4}
          showViewAllButton={true}
          showTitle={false}
        />
      </section>
    </main>
  );
}
