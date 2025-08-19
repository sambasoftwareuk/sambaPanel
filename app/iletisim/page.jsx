import React from "react";
import Breadcrumb from "../_molecules/breadCrumb";
import ContactCard from "../_molecules/contactCard";
import { Header1, Header3 } from "../_atoms/Headers";
import contactData from "../mocks/contactData.json";
import ContactFormWrapper from "../_components/ContactFormWrapper";
import { getMetadataForPath } from "../utils/metadataHelper";

export async function generateMetadata() {
  const meta = getMetadataForPath("/iletisim");

  return {
    title: meta.title,
    description: meta.description,
  };
}

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex container mx-auto px-4 py-8 flex-col justify-center items-center">
        <div className="text-center">
          <Breadcrumb />
        </div>

        <div className="text-center mb-12">
          <Header1 className="text-primary mb-4">İletişim</Header1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Bizimle iletişime geçin. Uzman ekibimiz size en kısa sürede dönüş
            yapacaktır.
          </p>
        </div>

        {/* İletişim Kartları */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {contactData.contactCards.map((card, index) => (
            <ContactCard
              key={index}
              title={card.title}
              address={card.address}
              phones={card.phones}
              emails={card.emails}
              mapUrl={card.mapUrl}
            />
          ))}
        </div>

        <div className="flex flex-col lg:w-2/4 sm:w-9/12 w-full">
          <ContactCard
            title="Banka Bilgileri"
            rightImage="/sampleimages/excel.png"
            className="mb-10"
          >
            <div className="space-y-4">
              <div>
                <Header3 className="text-primary900 mb-2">
                  Türk Lirasi (₺)
                </Header3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">KUVEYT TÜRK:</span>{" "}
                    136-95089376
                  </div>
                  <div>
                    <span className="font-medium">IBAN:</span> TR61 0020 5000
                    0950 8937 6000 01
                  </div>
                </div>
              </div>

              <div>
                <Header3 className="text-primary900 mb-2">
                  Amerikan Dolari ($)
                </Header3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">KUVEYT TÜRK:</span>{" "}
                    136-95089376-101
                  </div>
                  <div>
                    <span className="font-medium">IBAN:</span> TR77 0020 5000
                    0950 8937 6001 01
                  </div>
                </div>
              </div>

              <div>
                <Header3 className="text-primary900 mb-2">Euro (€)</Header3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">KUVEYT TÜRK:</span>{" "}
                    136-95089376-102
                  </div>
                  <div>
                    <span className="font-medium">IBAN:</span> TR50 0020 5000
                    0950 8937 6001 02
                  </div>
                </div>
              </div>
            </div>
          </ContactCard>

          <ContactFormWrapper
            kvkkLink="/kvkk-aydinlatma-metni"
            className="w-full mb-12 text-center"
          />
          {/* İletişim Formu */}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Header1 className="text-xl font-bold text-primary900 mb-4">
            Firma Bilgileri
          </Header1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Header3 className=" mb-2">
                CTP MÜHENDİSLİK SU SOĞUTMA KULELERİ ANONİM ŞİRKETİ
              </Header3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">ADRES:</span> NİŞANTEPE MAH.
                  NİŞANTEPE CAD. ŞEN SOK. NO:5 ÇEKMEKÖY İSTANBUL
                </p>
                <p>
                  <span className="font-medium">VERGİ DAİRESİ:</span> ŞEHİTKAMİL
                </p>
                <p>
                  <span className="font-medium">VERGİ NUMARASI:</span>{" "}
                  2150446689
                </p>
              </div>
            </div>

            <div>
              <Header3 className="mb-2">
                CTP ENGINEERING DIŞ TİCARET A.Ş.
              </Header3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">ADRES:</span> SANAYİ MAH. 60363
                  CAD. B BLOK NO: 40 ŞEHİTKAMİL/GAZİANTEP
                </p>
                <p>
                  <span className="font-medium">VERGİ DAİRESİ:</span> ŞEHİTKAMİL
                </p>
                <p>
                  <span className="font-medium">VERGİ NO:</span> 215 066 9840
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
