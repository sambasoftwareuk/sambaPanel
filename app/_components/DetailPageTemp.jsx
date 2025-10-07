import React from "react";
import Image from "next/image";
import { Header1 } from "@/app/_atoms/Headers";
import { MobileSideMenu, SideMenu } from "@/app/_molecules/SideMenu";
import Breadcrumb from "@/app/_molecules/BreadCrumb";
import MainItemGrid from "@/app/_components/MainItemGrid";
import { sanitizeHtmlContent } from "../utils/cleanHTML";
import { PageEditProvider } from "../context/PageEditProvider";
import TitleDisplay from "../_molecules/TitleDisplay";
import { SignedIn } from "@clerk/nextjs";
import TitleEditor from "../_molecules/TitleEditor";
import BodyDisplay from "../_molecules/BodyDisplay";
import BodyEditor from "../_molecules/BodyEditor";
import DraftHeroImage from "../_molecules/DraftHeroImage";
import ImageEditor from "../_molecules/ImageEditor";
import { PrimaryButton } from "../_atoms/Buttons";
import { NavigationGuard } from "../_molecules/NavigationGuard";
import SaveAllButton from "../_molecules/SaveAllButton";

const DetailPageTemplate = ({
  title,
  description,
  image,
  menu,
  activeHref,
  otherItems,
  otherItemsTitle,
  baseHref,
  notFoundText,
  page,
  pageId,
  locale = "tr-TR",
}) => {
  if (!page) {
    return <div className="p-6 text-red-500">{notFoundText}</div>;
  }
  const safeHtml = sanitizeHtmlContent(description || page.content_html);
  const displayTitle = page.title || page.name;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className=" flex justify-center">
          <Breadcrumb />
        </div>
        {/* Whole page layout: sidebar + content */}
        <div className={menu ? "flex gap-8 max-w-7xl mx-auto " : ""}>
          {/* LEFT: Side Menu */}
          {menu && (
            <aside className="w-60 flex-shrink-0 mt-8">
              <SideMenu menu={menu} activeHref={activeHref} />
            </aside>
          )}

          <div className="mt-8">
            {/* ✅ Wrap entire content area inside provider */}
            <PageEditProvider
              initialTitle={displayTitle}
              initialBody={page.content_html || safeHtml || "<p></p>"}
              initialHeroUrl={page.hero_url || image || "/placeholder.jpg"}
              initialHeroAlt={page.hero_alt || page.title || title}
              initialHeroMediaId={page.hero_media_id}
              pageId={page.id || page.id}
              locale={page.locale || locale}
              baseHref={page.slug}
            >
              <NavigationGuard />
              <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto flex gap-8">
                <div className="flex-1">
                  {/* Title */}
                  <TitleDisplay
                    pageId={page.id || page.id}
                    locale={page.locale || locale}
                  />

                  {/* Body */}
                  <BodyDisplay
                    initialHtml={page.content_html || safeHtml || description}
                    pageId={page.id || page.id}
                    locale={page.locale || locale}
                  />

                  {/* Save all button */}
                  <SaveAllButton
                    baseHref={baseHref}
                    pageId={page.id || page.id}
                    locale={page.locale || locale}
                  />
                </div>

                {/* Right-side image */}
                <DraftHeroImage
                  initialUrl={page.hero_url || image || "/5.jpg"}
                  initialAlt={page.hero_alt || page.title || title}
                  width={320}
                  height={320}
                  className="rounded-lg object-cover w-80 h-80"
                />
              </div>
              {otherItems && (
                <>
                  <Header1 className="text-center my-8">
                    {otherItemsTitle}
                  </Header1>
                  <MainItemGrid
                    items={otherItems}
                    baseHref={baseHref}
                    gridClassName="grid-cols-1 md:grid-cols-3"
                    cardProps={{ button: false, variant: 2 }}
                  />
                </>
              )}
            </PageEditProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPageTemplate;
