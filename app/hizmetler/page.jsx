import Link from "next/link";
import MainItemGrid from "../_components/MainItemGrid";
import Breadcrumb from "../_molecules/BreadCrumb";
import { getServiceCards } from "@/lib/repos/services";
import { buildMetadata, getSeoPage } from "@/lib/repos/seo";
import JsonLd from "@/components/seo/JsonLd";

const locale = "tr-TR";
const HIZMETLER_URL = "https://www.greenstepcoolingtowers.com/hizmetler";

const faqItems = [
  {
    question: "Soğutma kulesi bakım ne sıklıkla yapılmalı?",
    answer:
      "Soğutma kulesi bakım periyodu; çalışma yoğunluğu, su kalitesi ve mevsimsel koşullara göre belirlenir. Çoğu tesis için aylık kontrol ve sezonluk detaylı bakım önerilir.",
  },
  {
    question: "Montaj süreci ne kadar sürer?",
    answer:
      "Montaj süresi kule tipi, saha hazırlığı ve kapasiteye göre değişir. Keşif sonrası hazırlanan planla kurulum süreçleri kontrollü şekilde tamamlanır.",
  },
  {
    question: "Otomasyon enerji tasarrufu sağlar mı?",
    answer:
      "Evet. Soğutma kulesi otomasyon çözümleri, fan ve pompa yönetimini yük durumuna göre optimize ederek enerji verimliliği sağlar ve işletme maliyetlerini düşürür.",
  },
  {
    question: "Eski kuleler modernize edilebilir mi?",
    answer:
      "Mevcut sistemler teknik analiz sonrası modernize edilebilir. Dolgu, fan, kontrol ve mekanik bileşen güncellemeleriyle performans ve güvenilirlik artırılır.",
  },
  {
    question: "Teknik servis Türkiye geneli var mı?",
    answer:
      "Evet. Greenstep, Türkiye genelinde soğutma kulesi teknik servis, bakım ve saha destek hizmetleri sunarak endüstriyel soğutma süreçlerinde hızlı müdahale sağlar.",
  },
];

const hizmetlerMetadataFallback = {
  title: "Soğutma Kulesi Hizmetleri | Bakım, Montaj, Otomasyon",
  description:
    "Soğutma kulesi bakım, montaj, otomasyon, enerji analizi ve teknik servis hizmetleri. Endüstriyel çözümler için Greenstep ile iletişime geçin.",
  canonical: HIZMETLER_URL,
  robots: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
  openGraph: {
    title: "Soğutma Kulesi Hizmetleri | Bakım, Montaj, Otomasyon",
    description:
      "Soğutma kulesi bakım, montaj, otomasyon, enerji analizi ve teknik servis hizmetleri. Endüstriyel çözümler için Greenstep ile iletişime geçin.",
  },
  twitter: {
    title: "Soğutma Kulesi Hizmetleri | Bakım, Montaj, Otomasyon",
    description:
      "Soğutma kulesi bakım, montaj, otomasyon, enerji analizi ve teknik servis hizmetleri. Endüstriyel çözümler için Greenstep ile iletişime geçin.",
  },
};

const hizmetlerJsonLdFallback = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.greenstepcoolingtowers.com/#organization",
      name: "Greenstep Cooling Towers",
      url: "https://www.greenstepcoolingtowers.com",
      logo: "https://www.greenstepcoolingtowers.com/greenstep-logo.png",
      sameAs: ["https://www.instagram.com/greenstep_cooling_towers/"],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://www.greenstepcoolingtowers.com/#local-business",
      name: "Greenstep Cooling Towers",
      url: "https://www.greenstepcoolingtowers.com",
      image: "https://www.greenstepcoolingtowers.com/greenstep-logo.png",
      email: "info@greenstepcoolingtowers.com",
      areaServed: "Türkiye",
      parentOrganization: {
        "@id": "https://www.greenstepcoolingtowers.com/#organization",
      },
      address: {
        "@type": "PostalAddress",
        addressCountry: "TR",
      },
    },
    {
      "@type": "Service",
      "@id": `${HIZMETLER_URL}#service`,
      serviceType: "Soğutma Kulesi Hizmetleri",
      name: "Soğutma Kulesi Hizmetleri",
      provider: {
        "@type": "Organization",
        name: "Greenstep Cooling Towers",
        "@id": "https://www.greenstepcoolingtowers.com/#organization",
      },
      areaServed: {
        "@type": "Country",
        name: "Türkiye",
      },
      url: HIZMETLER_URL,
      description:
        "Soğutma kulesi bakım, soğutma kulesi montaj, soğutma kulesi otomasyon, enerji verimliliği ve teknik servis hizmetleri.",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${HIZMETLER_URL}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Ana Sayfa",
          item: "https://www.greenstepcoolingtowers.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Hizmetler",
          item: HIZMETLER_URL,
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${HIZMETLER_URL}#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ],
};

export async function generateMetadata() {
  const seo = await getSeoPage("hizmetler", locale);
  const dynamicMetadata = buildMetadata(seo, hizmetlerMetadataFallback);

  return {
    ...dynamicMetadata,
    keywords: [
      "soğutma kulesi bakım",
      "soğutma kulesi montaj",
      "soğutma kulesi otomasyon",
      "enerji verimliliği",
      "teknik servis",
      "endüstriyel soğutma",
    ],
    alternates: {
      canonical: HIZMETLER_URL,
    },
    robots:
      dynamicMetadata.robots ||
      "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",
    openGraph: {
      ...dynamicMetadata.openGraph,
      type: "website",
      url: HIZMETLER_URL,
      siteName: "Greenstep Cooling Towers",
      locale: "tr_TR",
    },
    twitter: {
      ...dynamicMetadata.twitter,
      card: "summary_large_image",
    },
  };
}

export default async function ServicesPage() {
  const [filteredServices, seo] = await Promise.all([
    getServiceCards(locale),
    getSeoPage("hizmetler", locale),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-center">
      <JsonLd data={seo?.json_ld || hizmetlerJsonLdFallback} />

      <Breadcrumb title={"Hizmetler"} />

      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          Soğutma Kulesi Hizmetleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto mb-3">
          Bakım, montaj, otomasyon ve enerji verimliliği odaklı profesyonel
          hizmetlerle sistem performansınızı artırın.
        </p>
        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto mb-6">
          Soğutma kulesi bakım, soğutma kulesi montaj ve soğutma kulesi otomasyon
          süreçlerinde teknik servis ekibimizle endüstriyel soğutma ihtiyaçlarınıza
          sürdürülebilir çözümler sunuyoruz.
        </p>
      </section>

      <section id="hizmetler-grid">
        <MainItemGrid
          items={filteredServices}
          title=""
          baseHref="hizmetler"
          gridClassName="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          cardProps={{ variant: 2, button: false, titleColor: "text-black" }}
        />
      </section>

      <section className="mt-10 text-sm md:text-base text-gray-700 text-left max-w-4xl mx-auto">
        <p>
          Projeniz için detaylı keşif ve planlama sürecini başlatmak için{" "}
          <Link href="/iletisim" className="text-primary underline underline-offset-4">
            iletişim sayfamıza
          </Link>{" "}
          ulaşabilir, ilgili ekipmanları{" "}
          <Link href="/urunler" className="text-primary underline underline-offset-4">
            ürünler
          </Link>{" "}
          bölümünde inceleyebilir, operasyon sürekliliği için{" "}
          <Link href="/yedek-parcalar" className="text-primary underline underline-offset-4">
            yedek parça
          </Link>{" "}
          seçeneklerini değerlendirebilir ve sektörel içerikler için{" "}
          <Link href="/blog" className="text-primary underline underline-offset-4">
            blog
          </Link>{" "}
          sayfamızı ziyaret edebilirsiniz.
        </p>
      </section>

      <section className="mt-12 text-left max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4 text-center">
          Hizmetlerimiz Hakkında
        </h2>
        <p className="text-gray-700 mb-3">
          Sunulan tüm hizmetlerimizde düzenli bakım süreçleri ile ekipman ömrünü
          uzatmayı, plansız duruşları azaltmayı ve operasyonel sürekliliği artırmayı
          hedefliyoruz.
        </p>
        <p className="text-gray-700 mb-3">
          Projelere özel montaj planlaması sayesinde kurulum aşamasında doğru
          mühendislik yaklaşımı uygulanır; sistemleriniz güvenli ve standartlara
          uygun şekilde devreye alınır.
        </p>
        <p className="text-gray-700">
          Gelişmiş otomasyon çözümleri ve sürekli izleme altyapısı ile enerji
          verimliliği odaklı optimizasyonlar yaparak toplam işletme maliyetlerinizi
          düşürmenize yardımcı oluyoruz.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <a
            href="/iletisim"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-white font-semibold hover:opacity-90 transition"
          >
            Teklif Alın
          </a>
          <a
            href="#hizmetler-grid"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition"
          >
            Hizmetleri İnceleyin
          </a>
        </div>
      </section>

      <section className="mt-12 text-left max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-5 text-center">
          Sıkça Sorulan Sorular
        </h2>

        <div className="space-y-4">
          {faqItems.map((item) => (
            <div key={item.question} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-black mb-1">{item.question}</h3>
              <p className="text-gray-700">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
