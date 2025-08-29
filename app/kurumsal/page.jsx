// app/kurumsal/page.jsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "../_molecules/breadCrumb";
import { Header1 } from "../_atoms/Headers";
import { SignedIn } from "@clerk/nextjs";
import TitleEditor from "../_molecules/TitleEditor";
import { q } from "@/lib/db";

// Bu sayfa server component: DB'den doğrudan okuyor
export default async function KurumsalPage() {
  const locale = "tr-TR";

  // Kurumsal'ı iki şekilde bulalım: (a) pages.slug='hakkimizda' (b) page_locales.slug_i18n='kurumsal'
  const rows = await q(
    `
    SELECT p.id, p.slug, p.status,
           pl.locale, pl.slug_i18n, pl.title, pl.summary, pl.content_html,
           m.url AS hero_url, m.alt_text AS hero_alt
    FROM pages p
    JOIN page_locales pl ON pl.page_id = p.id AND pl.locale = :locale
    LEFT JOIN media m ON m.id = p.hero_media_id
    WHERE (p.slug = 'hakkimizda' OR pl.slug_i18n = 'kurumsal')
      AND p.status IN ('published','draft')
    LIMIT 1;
    `,
    { locale }
  );

  if (!rows.length) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Kurumsal sayfası bulunamadı.</p>
      </div>
    );
  }

  const page = rows[0];

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
            </div>

            <div className="w-80 shrink-0">
              <Image
                src={page.hero_url || "/5.jpg"}
                alt={page.hero_alt || page.title || "Kurumsal"}
                width={320}
                height={320}
                className="rounded-lg object-cover w-80 h-80"
              />
              {/* örnek linkler */}
              <div className="mt-4 text-sm text-gray-500">
                <Link href="/">Ana sayfa</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
