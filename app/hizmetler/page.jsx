import MainItemGrid from "../_components/MainItemGrid";
import Breadcrumb from "../_molecules/BreadCrumb";
import { getMetaData } from "../utils/metadataHelper";
import { getServiceCards } from "@/lib/repos/services";

export async function generateMetadata() {
  const dynamicMeta = await getMetaData("/hizmetler");

  return {
    ...dynamicMeta,
    keywords: [
      "soğutma kulesi hizmetleri",
      "soğutma kulesi bakım",
      "soğutma kulesi montaj",
      "soğutma kulesi otomasyon",
      "enerji verimliliği",
      "endüstriyel soğutma",
    ],
    alternates: {
      canonical: "/hizmetler",
    },
  };
}

export default async function ServicesPage() {
  const locale = "tr-TR";
  const filteredServices = await getServiceCards(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "Samba Panel",
        url: "https://www.sambapanel.com",
        logo: "https://www.sambapanel.com/logo.png",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "müşteri hizmetleri",
          url: "https://www.sambapanel.com/iletisim",
          availableLanguage: "tr",
        },
      },
      {
        "@type": "Service",
        serviceType: "Soğutma Kulesi Hizmetleri",
        name: "Soğutma Kulesi Bakım, Montaj ve Otomasyon Hizmetleri",
        description:
          "Endüstriyel tesisler için soğutma kulesi bakım, montaj, otomasyon ve enerji verimliliği odaklı hizmetler.",
        provider: {
          "@type": "Organization",
          name: "Samba Panel",
          url: "https://www.sambapanel.com",
        },
        areaServed: {
          "@type": "Country",
          name: "Türkiye",
        },
        url: "https://www.sambapanel.com/hizmetler",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb title={"Hizmetler"} />

      <section className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
          Soğutma Kulesi Hizmetleri
        </h1>
        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto mb-3">
          Endüstriyel ihtiyaçlara uygun soğutma kulesi hizmetleri ile sistemlerinizin
          kesintisiz, güvenli ve yüksek performansla çalışmasını destekliyoruz.
        </p>
        <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto mb-6">
          Uzman ekibimiz; keşif, planlama ve uygulama süreçlerinde işletmenize özel
          çözümler geliştirerek uzun ömürlü kullanım ve sürdürülebilir verim sağlar.
        </p>
      </section>

      <section id="hizmetler-grid">
        <MainItemGrid
          items={filteredServices}
          title="Hizmetler"
          baseHref="hizmetler"
          gridClassName="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          cardProps={{ variant: 2, button: false, titleColor: "text-black" }}
        />
      </section>

      <section className="mt-12 text-left max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 text-center">
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
            Teklif Al
          </a>
          <a
            href="#hizmetler-grid"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition"
          >
            Hizmetleri İncele
          </a>
        </div>
      </section>

      <section className="mt-12 text-left max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-black mb-5 text-center">
          Sıkça Sorulan Sorular
        </h2>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-black mb-1">
              Soğutma kulesi bakım sıklığı nasıl belirlenir?
            </h3>
            <p className="text-gray-700">
              Bakım sıklığı; kullanım yoğunluğu, su kalitesi ve çalışma koşullarına
              göre belirlenir, periyodik kontrol planı uzman ekibimizce hazırlanır.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-black mb-1">
              Montaj sürecinde üretim kesintisi yaşanır mı?
            </h3>
            <p className="text-gray-700">
              Doğru planlama ve etaplı uygulama ile montaj süreci mümkün olan en az
              kesintiyle yürütülür ve devreye alma adımları kontrollü tamamlanır.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-black mb-1">
              Otomasyon enerji verimliliğine nasıl katkı sağlar?
            </h3>
            <p className="text-gray-700">
              Otomasyon sistemleri anlık veri takibiyle gereksiz tüketimi azaltır,
              ekipmanın optimum noktada çalışmasını sağlayarak enerji verimliliğini
              artırır.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
