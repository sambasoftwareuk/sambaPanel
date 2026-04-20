import Link from "next/link";

export const metadata = {
  title:
    "Soğutma Kulesi Nedir? Endüstriyel Sistemlerde Çalışma Prensibi ve Avantajlar | Greenstep",
  description:
    "Soğutma kulesi nedir, nasıl çalışır ve hangi sektörlerde kullanılır? Greenstep’in mühendislik odaklı çözümleriyle işletmeniz için doğru kule sistemini keşfedin.",
};

const BASE_URL = "https://www.greenstepcoolingtowers.com";
const PAGE_URL = `${BASE_URL}/blog/sogutma-kulesi-nedir`;

export default function SogutmaKulesiNedirPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Soğutma Kulesi Nedir?",
        description:
          "Soğutma kulesi nedir sorusuna kapsamlı yanıt: çalışma prensibi, türleri, avantajları ve B2B kullanım alanları.",
        inLanguage: "tr-TR",
        mainEntityOfPage: PAGE_URL,
        datePublished: "2026-04-20",
        dateModified: "2026-04-20",
        author: {
          "@type": "Organization",
          name: "Greenstep Cooling Towers",
        },
        publisher: {
          "@type": "Organization",
          name: "Greenstep Cooling Towers",
          url: BASE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/logo.png`,
          },
        },
        image: `${BASE_URL}/images/blog/sogutma-kulesi-nedir.jpg`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ana Sayfa",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${BASE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Soğutma Kulesi Nedir",
            item: PAGE_URL,
          },
        ],
      },
      {
        "@type": "Organization",
        name: "Greenstep Cooling Towers",
        url: BASE_URL,
        logo: `${BASE_URL}/logo.png`,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "satış",
          url: `${BASE_URL}/iletisim`,
          availableLanguage: ["tr"],
        },
        areaServed: {
          "@type": "Country",
          name: "Türkiye",
        },
      },
    ],
  };

  const faqs = [
    {
      question: "Soğutma kulesi ne işe yarar?",
      answer:
        "Soğutma kuleleri, proseslerden gelen sıcak suyun ısısını atmosfere atarak suyun tekrar kullanılmasını sağlar. Böylece sistemler stabil, güvenli ve verimli şekilde çalışır.",
    },
    {
      question: "Chiller ile farkı nedir?",
      answer:
        "Chiller kapalı çevrimde mekanik soğutma yaparken, soğutma kuleleri su-hava teması ve buharlaşma etkisiyle ısı atımı gerçekleştirir. Endüstriyel projelerde bu sistemler birlikte de kullanılabilir.",
    },
    {
      question: "Bakımı gerekli midir?",
      answer:
        "Evet. Düzenli bakım, su kalitesi yönetimi ve fan-dolgu kontrolü performans kaybını önler, enerji tüketimini optimize eder ve ekipman ömrünü uzatır.",
    },
    {
      question: "Hangi sektörlerde kullanılır?",
      answer:
        "Soğutma kuleleri enerji, kimya, gıda, plastik, metal işleme, HVAC ve genel üretim tesisleri gibi sürekli ısı atımı gereken birçok sektörde kullanılır.",
    },
  ];

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 md:py-14 text-slate-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 md:p-10 shadow-sm">
        <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">
          Soğutma Kulesi Nedir?
        </h1>
        <p className="text-base md:text-lg text-slate-700 leading-7 mb-3 max-w-4xl">
          Soğutma kulesi, endüstriyel proseslerde ısınan suyu yeniden kullanılabilir
          sıcaklığa düşürmek için kullanılan kritik bir ısı atım sistemidir. Özellikle
          kesintisiz üretim hedefleyen tesislerde proses güvenliği ve enerji dengesi
          için temel bir rol oynar.
        </p>
        <p className="text-base md:text-lg text-slate-700 leading-7 max-w-4xl">
          Enerji santrallerinden gıda üretim hatlarına kadar birçok sektörde tercih
          edilen kuleler, yüksek kapasitede ısı transferi sağlayarak işletmelerin
          verimli ve sürdürülebilir çalışmasına katkı sunar.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            href="/urunler"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            Ürünleri İncele
          </Link>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Teklif Al
          </Link>
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
          Soğutma Kulesi Nasıl Çalışır?
        </h2>
        <p className="text-slate-700 leading-7">
          Sistemden gelen sıcak su, kule içindeki dolgu malzemeleri üzerinden
          dağıtılır. Fan veya doğal çekişle içeri alınan hava ile temas eden suyun bir
          bölümü buharlaşır ve buharlaşma ile ısı dışarı taşınır. Sıcaklığı düşen su
          havuzda toplanarak prosese geri gönderilir; böylece döngü sürdürülebilir
          ve ekonomik şekilde devam eder.
        </p>
      </section>

      <section className="mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
          Soğutma Kulesi Çeşitleri
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 p-5 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Açık Devre</h3>
            <p className="text-slate-700 text-sm leading-6">
              Proses suyu doğrudan hava ile temas ederek soğutulur. Yüksek kapasite
              gereken uygulamalarda yaygın olarak tercih edilir.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 p-5 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Kapalı Tip Soğutma Kulesi</h3>
            <p className="text-slate-700 text-sm leading-6">
              Proses akışkanı serpantin içinde dolaşır ve dış ortamla doğrudan temas
              etmez. Hijyen ve sistem koruması gerektiren tesisler için uygundur.
            </p>
          </article>
          <article className="rounded-xl border border-slate-200 p-5 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Endüstriyel Kule Sistemleri</h3>
            <p className="text-slate-700 text-sm leading-6">
              Tesise özel mühendislik ile ölçeklenebilir kapasite, otomasyon ve enerji
              optimizasyonu sunan kapsamlı çözüm mimarisidir.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
          Soğutma Kulesi Avantajları
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-slate-700 leading-7">
          <li>Enerji verimliliği ile işletme giderlerini düşürür.</li>
          <li>Sürekli çalışma gerektiren üretim süreçlerini destekler.</li>
          <li>Uzun vadede maliyet avantajı ve ekipman ömrü sağlar.</li>
          <li>Proses kontrolünü iyileştirerek kalite sürekliliğine katkı verir.</li>
        </ul>
      </section>

      <section className="mt-12 md:mt-16 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
          Neden Greenstep?
        </h2>
        <p className="text-slate-700 leading-7 mb-4">
          Greenstep, Türkiye’deki B2B tesis ihtiyaçlarına özel soğutma kulesi
          projelerinde mühendislikten üretime kadar uçtan uca çözüm sunar. Proje
          sonrası süreçte yedek parça erişimi ve teknik destek ile sistemlerinizin
          performansını güvence altına alır.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <p className="rounded-lg bg-white border border-slate-200 p-4 text-slate-700">
            Güçlü mühendislik altyapısı ve projeye özel tasarım yaklaşımı
          </p>
          <p className="rounded-lg bg-white border border-slate-200 p-4 text-slate-700">
            Yüksek kalite standartlarında yerli üretim kabiliyeti
          </p>
          <p className="rounded-lg bg-white border border-slate-200 p-4 text-slate-700">
            Hızlı tedarik için kritik yedek parça erişimi
          </p>
          <p className="rounded-lg bg-white border border-slate-200 p-4 text-slate-700">
            Devreye alma sonrası sürdürülebilir teknik destek
          </p>
        </div>
      </section>

      <section className="mt-12 md:mt-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-4">
          Sık Sorulan Sorular
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <article key={faq.question} className="rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
              <p className="text-slate-700 leading-7">{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 md:mt-16 rounded-2xl bg-primary/5 border border-primary/20 p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-3">
          Teknik ekibimizle görüşün
        </h2>
        <p className="text-slate-700 leading-7 mb-5">
          Projenize uygun sistem seçimi için ürün, hizmet, yedek parça ve keşif
          süreçlerini birlikte planlayalım.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90"
          >
            İletişime Geç
          </Link>
          <Link
            href="/hizmetler"
            className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Hizmetleri Gör
          </Link>
          <Link
            href="/yedek-parcalar"
            className="inline-flex items-center justify-center rounded-md border border-primary px-6 py-3 font-semibold text-primary transition hover:bg-primary hover:text-white"
          >
            Yedek Parçaları İncele
          </Link>
        </div>
      </section>
    </main>
  );
}
