import Link from "next/link";
import SliderComponent from "./_components/SliderComponent.jsx";
import CarouselSlider from "./_components/CarouselSlider.jsx";
import MainItemGrid from "./_components/MainItemGrid.jsx";
import BlogComponent from "./_components/BlogComponent.jsx";
import { getHomeData } from "@/lib/repos/home";
import { buildMetadata, getSeoPage } from "@/lib/repos/seo";
import JsonLd from "@/components/seo/JsonLd";

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://www.greenstepcoolingtowers.com").replace(/\/$/, "");
const locale = "tr-TR";

const homeMetadataFallback = {
  title: "Su Soğutma Kulesi Üreticisi | Endüstriyel Sistemler - Greenstep",
  description:
    "Endüstriyel su soğutma kulesi üretimi, mühendislik ve sistem çözümleri. Projenize özel hızlı teklif ve teknik destek için Greenstep ile iletişime geçin.",
  canonical: "/",
};

const homeJsonLdFallback = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#kurulus`,
      name: "Greenstep Cooling Towers",
      url: BASE_URL,
      logo: `${BASE_URL}/greenstep-logo.png`,
      sameAs: ["https://www.instagram.com/greenstep_cooling_towers/"],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "satış",
        areaServed: "TR",
        availableLanguage: ["tr"],
        url: `${BASE_URL}/iletisim`,
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${BASE_URL}/#yerel-isletme`,
      name: "Greenstep Cooling Towers",
      url: BASE_URL,
      image: `${BASE_URL}/greenstep-logo.png`,
      email: "info@greenstepcoolingtowers.com",
      parentOrganization: {
        "@id": `${BASE_URL}/#kurulus`,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Alemdag Mah. Saray Cad. 111. Sk. No:1-3 Daire:10",
        addressLocality: "Çekmeköy",
        addressRegion: "İstanbul",
        addressCountry: "TR",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#websitesi`,
      url: BASE_URL,
      name: "Greenstep Cooling Towers",
      inLanguage: "tr-TR",
      potentialAction: {
        "@type": "SearchAction",
        target: `${BASE_URL}/arama?q={arama_ifadesi}`,
        "query-input": "required name=arama_ifadesi",
      },
      publisher: {
        "@id": `${BASE_URL}/#kurulus`,
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${BASE_URL}/#ekmek-kirintisi`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa",
          item: BASE_URL,
        },
      ],
    },
  ],
};

export async function generateMetadata() {
  const seo = await getSeoPage("homepage", locale);
  return buildMetadata(seo, homeMetadataFallback);
}

export default async function Home() {
  const [data, seo] = await Promise.all([
    getHomeData(locale, { latestBlog: 8 }),
    getSeoPage("homepage", locale),
  ]);
  const jsonLdData = seo?.json_ld || homeJsonLdFallback;

  return (
    <main className="flex flex-col items-center min-h-screen w-full">
      <JsonLd data={jsonLdData} />
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
            Su Soğutma Kulesi Üreticisi
          </h1>
          <p className="sr-only">
            Endüstriyel su soğutma kulesi üreticisi olarak soğutma kulesi sistemleri, kapalı tip soğutma kulesi, dolgu malzemesi ve serpantin sistemlerinde üretim, mühendislik ve teknik destek sunuyoruz.
          </p>
          <p className="mt-3 text-gray-700 max-w-4xl text-base">
            Greenstep, endüstriyel su soğutma kulesi üretimi ve soğutma kulesi sistemleri mühendisliğini tek merkezden sunarak tesislerinize güvenilir, verimli ve sürdürülebilir çözüm sağlar.
          </p>
          <p className="mt-2 text-gray-700 max-w-4xl text-sm md:text-base font-medium">
            Kapalı tip soğutma kulesi, dolgu malzemesi ve serpantin sistemlerinde projenize en uygun çözümü birlikte planlayalım.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/iletisim" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary900 transition-colors">
              Teklif İste
            </Link>
            <Link href="/urunler" className="bg-white text-primary border border-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary100 transition-colors">
              Ürünleri Gör
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm md:text-base">
            <Link href="/hizmetler" className="text-primary underline underline-offset-4">
              Mühendislik Hizmetleri
            </Link>
            <Link href="/yedek-parcalar" className="text-primary underline underline-offset-4">
              Yedek Parça Çözümleri
            </Link>
          </div>
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
