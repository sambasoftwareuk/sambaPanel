import React from "react";
import Image from "next/image";
import Breadcrumb from "../_molecules/breadCrumb";
import { SignedIn } from "@clerk/nextjs";
import TitleDisplay from "../_molecules/TitleDisplay";
import BodyDisplay from "../_molecules/BodyDisplay";
import TitleEditor from "../_molecules/TitleEditor";
import BodyEditor from "../_molecules/BodyEditor";
import SaveAllButton from "../_molecules/SaveAllButton";
import { PageEditProvider } from "../context/PageEditProvider";
import { getKurumsalPage } from "@/lib/repos/page";
import { NavigationGuard } from "../_molecules/NavigationGuard";

// ✅ still a server component (SEO)
export default async function KurumsalPage() {
  const locale = "tr-TR";
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
              {/* ✅ Wrap editors + displays inside provider */}
              <PageEditProvider
                initialTitle={page.title}
                initialBody={page.content_html || "<p></p>"}
                pageId={page.id}
                locale={page.locale}
              >
                {/* Title */}
                <NavigationGuard />
                <div className="flex items-center gap-2">
                  <TitleDisplay initialTitle={page.title} />
                  <SignedIn>
                    <TitleEditor pageId={page.id} locale={page.locale} />
                  </SignedIn>
                </div>

                {/* Body */}
                <div className="flex items-start gap-2 mt-4">
                  <BodyDisplay initialHtml={page.content_html} />
                  <SignedIn>
                    <BodyEditor pageId={page.id} locale={page.locale} />
                  </SignedIn>
                </div>

                {/* Save all button */}
                <div className="mt-6">
                  <SignedIn>
                    <SaveAllButton pageId={page.id} locale={page.locale} />
                  </SignedIn>
                </div>
              </PageEditProvider>
            </div>

            {/* Right-side image */}
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
