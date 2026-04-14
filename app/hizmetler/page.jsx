import Link from "next/link";

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://www.greenstepcoolingtowers.com").replace(/\/$/, "");

export const metadata = {
  title: "Soğutma Kulesi Hizmetleri | Bakım, Montaj ve Mühendislik - Greenstep",
  description:
    "Greenstep soğutma kulesi hizmetleri ile bakım, montaj, otomasyon ve enerji analizi süreçlerinizi tek merkezden yönetin. Endüstriyel tesisler için güvenilir mühendislik desteği alın.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#kurulus`,
      name: "Greenstep Cooling Towers",
      url: BASE_URL,
      logo: `${BASE_URL}/greenstep-logo.png`,
      sameAs: ["https://www.instagram.com/greenstep_cooling_towers/"],
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
      "@type": "Service",
      "@id": `${BASE_URL}/hizmetler#bakim-onarim`,
      serviceType: "Soğutma kulesi bakım ve onarım",
      provider: {
        "@id": `${BASE_URL}/#kurulus`,
      },
      areaServed: "TR",
      url: `${BASE_URL}/hizmetler#bakim-onarim`,
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/hizmetler#montaj-devreye-alma`,
      serviceType: "Soğutma kulesi montaj ve devreye alma",
      provider: {
        "@id": `${BASE_URL}/#kurulus`,
      },
      areaServed: "TR",
      url: `${BASE_URL}/hizmetler#montaj-devreye-alma`,
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/hizmetler#otomasyon-sistemleri`,
      serviceType: "Soğutma kulesi otomasyon sistemleri",
      provider: {
        "@id": `${BASE_URL}/#kurulus`,
      },
      areaServed: "TR",
      url: `${BASE_URL}/hizmetler#otomasyon-sistemleri`,
    },
    {
      "@type": "Service",
      "@id": `${BASE_URL}/hizmetler#enerji-analizi-verimlilik`,
      serviceType: "Soğutma kulesi enerji analizi ve verimlilik",
      provider: {
        "@id": `${BASE_URL}/#kurulus`,
      },
      areaServed: "TR",
      url: `${BASE_URL}/hizmetler#enerji-analizi-verimlilik`,
    },
  ],
};

export default function ServicesPage() {
  return (
    <main className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="w-full bg-primary50 border-y border-primary100">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
          <h1 className="text-2xl md:text-4xl font-bold text-primary max-w-5xl">
            Soğutma Kulesi Hizmetleri: Bakım, Montaj ve Mühendislik Çözümleri
          </h1>
          <p className="mt-4 text-gray-700 max-w-4xl text-base md:text-lg">
            Greenstep, endüstriyel tesisler için soğutma kulesi bakım, soğutma kulesi montaj ve soğutma kulesi
            mühendislik süreçlerini tek bir teknik yapı altında yönetir. Projenin her aşamasında ölçülebilir performans,
            sürdürülebilir işletme ve güvenli operasyon hedefiyle çalışırız.
          </p>
          <p className="mt-3 text-gray-700 max-w-4xl text-base">
            Mevcut sisteminizi iyileştirmek, yeni yatırımınızı hızlı devreye almak veya enerji tüketimini düşürmek için
            uzman ekibimizle planlı ve şeffaf bir hizmet modeli sunuyoruz.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/iletisim"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary900 transition-colors"
            >
              Teklif ve Keşif Talebi
            </Link>
            <Link
              href="/urunler"
              className="bg-white text-primary border border-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary100 transition-colors"
            >
              Ürün Altyapısını İnceleyin
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Hizmet Kapsamı</h2>
        <p className="mt-3 text-gray-700 max-w-4xl">
          Soğutma kulesi hizmetleri kapsamında bakım, montaj, otomasyon ve enerji odaklı optimizasyon adımlarını proje
          ihtiyaçlarınıza göre uçtan uca planlıyoruz.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm md:text-base">
          <a href="#bakim-onarim" className="text-primary underline underline-offset-4 font-medium">
            Bakım ve Onarım
          </a>
          <a href="#montaj-devreye-alma" className="text-primary underline underline-offset-4 font-medium">
            Montaj ve Devreye Alma
          </a>
          <a href="#otomasyon-sistemleri" className="text-primary underline underline-offset-4 font-medium">
            Otomasyon Sistemleri
          </a>
          <a href="#enerji-analizi-verimlilik" className="text-primary underline underline-offset-4 font-medium">
            Enerji Analizi ve Verimlilik
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-12 space-y-8">
        <article id="bakim-onarim" className="border border-gray-200 rounded-2xl p-6 md:p-8 bg-white">
          <h2 className="text-xl md:text-2xl font-bold text-primary">Bakım ve Onarım</h2>
          <p className="mt-3 text-gray-700">
            Soğutma kulesi bakım süreçlerinde mekanik, termal ve hijyenik performansı birlikte değerlendirerek arıza
            riskini düşürürüz. Periyodik bakım planlarıyla plansız duruşları azaltır, kritik ekipmanların ömrünü uzatırız.
          </p>
          <p className="mt-2 text-gray-700">
            Onarım çalışmalarında kök neden analizi yaparak yalnızca semptomu değil, sorunun kaynağını çözen teknik bir
            yaklaşım uygularız.
          </p>
          <p className="mt-2 text-gray-900 font-medium">
            Kullanım senaryosu: Üretim hattında sık duruş yaşayan tesislerde bakım planı ve hedefli onarım ile operasyon
            sürekliliği güçlendirilir.
          </p>
        </article>

        <article id="montaj-devreye-alma" className="border border-gray-200 rounded-2xl p-6 md:p-8 bg-white">
          <h2 className="text-xl md:text-2xl font-bold text-primary">Montaj ve Devreye Alma</h2>
          <p className="mt-3 text-gray-700">
            Soğutma kulesi montaj hizmetlerinde saha koşulları, proses ihtiyaçları ve güvenlik kriterleri dikkate alınarak
            disiplinli bir kurulum süreci yürütürüz. Devreye alma aşamasında sistemin tasarım hedeflerine uygun çalıştığını
            test ederek performans doğrulaması yaparız.
          </p>
          <p className="mt-2 text-gray-700">
            Ekipman uyumu, borulama kontrolü ve işletme eğitimleriyle yatırımın ilk günden verimli çalışmasına odaklanırız.
          </p>
          <p className="mt-2 text-gray-900 font-medium">
            Kullanım senaryosu: Yeni hat yatırımı yapan işletmelerde hızlı ve kontrollü devreye alma ile üretime geçiş
            süresi kısalır.
          </p>
        </article>

        <article id="otomasyon-sistemleri" className="border border-gray-200 rounded-2xl p-6 md:p-8 bg-white">
          <h2 className="text-xl md:text-2xl font-bold text-primary">Otomasyon Sistemleri</h2>
          <p className="mt-3 text-gray-700">
            Otomasyon çözümlerimizle soğutma kulesi parametrelerini gerçek zamanlı izlenebilir hale getirir, kritik
            sapmalara erken müdahale imkânı sunarız. Alarm yönetimi, uzaktan takip ve raporlama altyapısı ile operasyonel
            görünürlüğü artırırız.
          </p>
          <p className="mt-2 text-gray-700">
            Mevcut altyapıya uyumlu mühendislik yaklaşımı sayesinde sisteminizi kesintisiz şekilde dijital olarak
            güçlendiririz.
          </p>
          <p className="mt-2 text-gray-900 font-medium">
            Kullanım senaryosu: Çoklu tesis yöneten işletmelerde merkezi izleme ile bakım kararları daha hızlı ve doğru
            alınır.
          </p>
        </article>

        <article id="enerji-analizi-verimlilik" className="border border-gray-200 rounded-2xl p-6 md:p-8 bg-white">
          <h2 className="text-xl md:text-2xl font-bold text-primary">Enerji Analizi ve Verimlilik</h2>
          <p className="mt-3 text-gray-700">
            Enerji analizi çalışmalarında soğutma kulesi performansını proses verileriyle birlikte değerlendirerek tüketim
            kaynaklarını netleştiririz. Sistem optimizasyonu odaklı aksiyon planlarıyla enerji maliyetlerini düşürmeye ve
            kapasite kullanımını dengelemeye yardımcı oluruz.
          </p>
          <p className="mt-2 text-gray-700">
            Uygulama sonrasında ölçüm ve karşılaştırma raporlarıyla iyileştirme etkisini şeffaf biçimde takip ederiz.
          </p>
          <p className="mt-2 text-gray-900 font-medium">
            Kullanım senaryosu: Yüksek enerji faturası olan tesislerde analiz ve optimizasyon adımlarıyla birim üretim
            maliyeti azaltılır.
          </p>
        </article>
      </section>

      <section className="w-full bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Neden Greenstep?</h2>
          <p className="mt-3 text-gray-700 max-w-4xl">
            Farklı sektörlerde yürüttüğümüz saha projeleriyle, soğutma kulesi mühendislik süreçlerini yalnızca tasarım
            seviyesinde değil, gerçek işletme koşullarında da yönetiyoruz. Deneyimli teknik kadromuz, hızlı iletişim ve
            ölçülebilir sonuç yaklaşımıyla B2B müşterilerimiz için güvenilir bir çözüm ortağı sunar.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm md:text-base">
            <Link href="/urunler" className="text-primary underline underline-offset-4 font-semibold">
              Ürün Çözümleri
            </Link>
            <Link href="/yedek-parcalar" className="text-primary underline underline-offset-4 font-semibold">
              Yedek Parça Desteği
            </Link>
            <Link href="/iletisim" className="text-primary underline underline-offset-4 font-semibold">
              Teknik Ekiple Görüşün
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full bg-primary900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold">Soğutma Kulesi Performansınızı Bir Üst Seviyeye Taşıyın</h2>
          <p className="mt-3 max-w-3xl mx-auto text-sm md:text-base">
            Tesisinize uygun bakım, montaj ve optimizasyon planını birlikte oluşturalım; kısa sürede net bir yol haritası ve
            uygulanabilir teklif sunalım.
          </p>
          <div className="mt-6">
            <Link
              href="/iletisim"
              className="inline-block bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary100 transition-colors"
            >
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Sık Sorulan Sorular</h2>
        <div className="mt-6 space-y-4">
          <article className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-primary">Soğutma kulesi bakım sıklığı nasıl belirlenir?</h3>
            <p className="mt-2 text-gray-700">
              Bakım periyodu; proses yükü, su kalitesi, ortam koşulları ve ekipman geçmişine göre belirlenir. İlk keşif sonrası
              tesisinize özel bakım planı oluşturulur.
            </p>
          </article>
          <article className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-primary">Montaj sonrası devreye alma sürecinde neler kontrol edilir?</h3>
            <p className="mt-2 text-gray-700">
              Mekanik bütünlük, debi ve sıcaklık değerleri, titreşim ve otomasyon sinyalleri test edilir. Amaç, sistemin
              tasarım hedeflerine uygun ve güvenli biçimde çalıştığını doğrulamaktır.
            </p>
          </article>
          <article className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-primary">Otomasyon yatırımı enerji maliyetini etkiler mi?</h3>
            <p className="mt-2 text-gray-700">
              Evet, doğru kontrol stratejileri ve veri takibi sayesinde gereksiz çalışma süreleri azaltılabilir. Bu sayede enerji
              tüketimi ve bakım maliyetleri üzerinde iyileşme sağlanır.
            </p>
          </article>
          <article className="border border-gray-200 rounded-xl p-5">
            <h3 className="text-lg font-semibold text-primary">Enerji analizi sonrası hangi çıktılar sunulur?</h3>
            <p className="mt-2 text-gray-700">
              Mevcut durum değerlendirmesi, önceliklendirilmiş iyileştirme önerileri ve beklenen etkiyi gösteren teknik rapor
              paylaşılır. Uygulama adımları net bir takvimle planlanır.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
