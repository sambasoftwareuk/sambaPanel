// app/kurumsal/page.jsx
import React from "react";
import Image from "next/image";
import Breadcrumb from "../_molecules/breadCrumb";
import { Header1 } from "../_atoms/Headers";
import { SignedIn } from "@clerk/nextjs";
import TitleEditor from "../_molecules/titleEditor";
import BodyEditor from "../_molecules/bodyEditor";
import { getKurumsalPage } from "@/lib/repos/page";

// Bu sayfa server component: DB'den doğrudan okuyor
export default async function KurumsalPage() {
  const locale = "tr-TR";

  // Kurumsal'ı iki şekilde bulalım: (a) pages.slug='hakkimizda' (b) page_locales.slug_i18n='kurumsal'
  const page = await getKurumsalPage(locale);

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Kurumsal sayfası bulunamadı.</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto flex gap-8">
            <div className="flex-1">
              <div className="flex items-start gap-3">
                <Header1 className="text-primary mb-2">{page.title}</Header1>
                <SignedIn>
                  {/* Giriş yapınca kalem görünür; PATCH /api/pages/:id çağırır */}
                  <TitleEditor
                    pageId={page.id}
                    locale={page.locale}
                    initialTitle={page.title}
                    className="mt-1"
                  />
                </SignedIn>
              </div>

              {/* Özet varsa */}
              {page.summary && (
                <p className="text-gray-600 mb-4">{page.summary}</p>
              )}

              {/* Gövde: HTML */}
              {page.content_html ? (
                <div
                  className="prose max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: page.content_html }}
                />
              ) : (
                <p className="text-gray-500">İçerik henüz eklenmemiş.</p>
              )}

              <SignedIn>
                <BodyEditor
                  className="ml-2"
                  pageId={page.id}
                  locale={page.locale}
                  initialHtml={page.content_html || "<p></p>"}
                  // initialJson={...} // eğer DB’de content_json doluysa onu da geçebilirsin
                />
              </SignedIn>
            </div>

            <div className="w-80 shrink-0">
              <Image
                src={page.hero_url || "/5.jpg"}
                alt={page.hero_alt || page.title || "Kurumsal"}
                width={320}
                height={320}
                className="rounded-lg object-cover w-80 h-80"
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
