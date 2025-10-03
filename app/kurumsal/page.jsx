import React from "react";
import Breadcrumb from "../_molecules/BreadCrumb";
import { SignedIn } from "@clerk/nextjs";
import TitleDisplay from "../_molecules/TitleDisplay";
import BodyDisplay from "../_molecules/BodyDisplay";
import TitleEditor from "../_molecules/TitleEditor";
import BodyEditor from "../_molecules/BodyEditor";
import SaveAllButton from "../_molecules/SaveAllButton";
import DraftHeroImage from "../_molecules/DraftHeroImage";
import ImageEditor from "../_molecules/ImageEditor";
import { PageEditProvider } from "../context/PageEditProvider";
import { getKurumsalPage } from "@/lib/repos/page";
import { NavigationGuard } from "../_molecules/NavigationGuard";
import DetailPageTemplate from "../_components/DetailPageTemp";
import { getSideMenuData } from "../utils/getSideMenuData";


// ✅ still a server component (SEO)
export default async function KurumsalPage() {
  const locale = "tr-TR";
  const page = await getKurumsalPage(locale);
  const path = "/kurumsal";

  if (!page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <p className="text-gray-600">Kurumsal sayfası bulunamadı.</p>
      </div>
    );
  }

  console.log("Kurumsal page data:", page);
  

  return (
    <DetailPageTemplate
      title={page?.title}
      description={page?.content_html}
      image={page?.hero_url || "/5.jpg"}
      menu={null}
      activeHref={path}
      heroAlt={page?.hero_alt || page?.title || "Kurumsal"}
      heroMediaId={page?.hero_media_id}
      locale={page?.locale}
      pageId={page.id}
    />
  );
}
