// app/kurumsal/page.jsx
import React from "react";
import Image from "next/image";
import Breadcrumb from "../_molecules/breadCrumb";
import { Header1 } from "../_atoms/Headers";
import { SignedIn } from "@clerk/nextjs";
import TitleEditor from "../_molecules/titleEditor";
import BodyEditor from "../_molecules/bodyEditor";
import { getKurumsalPage } from "@/lib/repos/page";
import { EditSessionProvider } from "../_context/EditSessionContext";
import SaveBar from "../_molecules/SaveBar";
import DraftTitle from "../_molecules/DraftTitle";
import DraftBody from "../_molecules/DraftBody";
import UnsavedChangesGuard from "../_molecules/UnsavedChangesGuard";
import DraftHeroImage from "../_molecules/DreaftHeroImage";
import ImageEditor from "../_molecules/ImageEditor";

// Bu sayfa server component: DB'den doğrudan okuyor
export default async function KurumsalPage() {
  const locale = "tr-TR";
  const page = await getKurumsalPage(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto gap-8">
            {/* Provider herkese açık (SSR korunur) */}
            <EditSessionProvider
              pageId={page.id}
              locale={page.locale}
              initial={{
                title: page.title,
                content_html: page.content_html || "<p></p>",
                content_json: page.content_json ?? null,
              }}
            >
              {/* Başlık: draft varsa onu gösterir; yoksa initial (SSR) */}
              <div className="flex items-start gap-3">
                <DraftTitle initialTitle={page.title} />
                <SignedIn>
                  <TitleEditor initialTitle={page.title} className="mt-1" />
                </SignedIn>
              </div>
              {/* Gövde: draft varsa onu gösterir; yoksa initial (SSR) */}
              <div className="flex gap-8 mt-4">
                <div className="flex items-start gap-3">
                  <DraftBody initialHtml={page.content_html || "<p></p>"} />
                  <SignedIn>
                    <BodyEditor
                      className="ml-2"
                      initialHtml={page.content_html || "<p></p>"}
                      initialJson={page.content_json}
                    />
                  </SignedIn>
                </div>
                <div className="w-80 shrink-0">
                  <DraftHeroImage
                    initialUrl={page.hero_url || "/5.jpg"}
                    initialAlt={page.hero_alt || page.title || "Kurumsal"}
                    width={320}
                    height={320}
                    className="rounded-lg object-cover w-80 h-80"
                  />
                  <SignedIn>
                    <ImageEditor
                      initialUrl={page.hero_url || "/5.jpg"}
                      initialAlt={page.hero_alt || page.title || "Kurumsal"}
                    />
                  </SignedIn>
                </div>
              </div>

              <SignedIn>
                <SaveBar />
              </SignedIn>
              <SignedIn>
                <UnsavedChangesGuard />
              </SignedIn>
            </EditSessionProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
