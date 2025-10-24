import React from "react";
import { Header1 } from "@/app/_atoms/Headers";
import { SideMenu } from "@/app/_molecules/SideMenu";
import { EditableSideMenu } from "@/app/_molecules/EditableSideMenu";
import Breadcrumb from "@/app/_molecules/BreadCrumb";
import MainItemGrid from "@/app/_components/MainItemGrid";
import { sanitizeHtmlContent } from "../utils/cleanHTML";
import { PageEditProvider } from "../context/PageEditProvider";
import TitleDisplay from "../_molecules/TitleDisplay";
import BodyDisplay from "../_molecules/BodyDisplay";
import DraftHeroImage from "../_molecules/DraftHeroImage";
import { NavigationGuard } from "../_molecules/NavigationGuard";
import SaveAllButton from "../_molecules/SaveAllButton";

const DetailPageTemplate = ({
  //TODO Buradaki bazi propslar gereksiz olabilir. Gozden gecirelim!!!
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
  pageSlug,
  locale = "tr-TR",
}) => {
  if (!page) {
    return <div className="p-6 text-red-500">{notFoundText}</div>;
  }
  const displayTitle = page?.title || page?.name;
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className=" flex justify-center">
          <Breadcrumb />
        </div>
        {/* ✅ Wrap entire content area inside provider */}
        <PageEditProvider
          initialTitle={displayTitle}
          initialBody={
            page?.content_html ||
            sanitizeHtmlContent(description || "") ||
            "<p></p>"
          }
          //TODO json data iptal olunca burayi guncelleyelim!!
          initialHeroUrl={
            page?.hero_url ? `${page.hero_url}` : image || "/5.jpg"
          }
          initialHeroAlt={page?.hero_alt || page?.title || title}
          initialHeroMediaId={page?.hero_media_id}
          initialSideMenu={menu}
          pageId={page?.id || pageId}
          locale={page?.locale || locale}
          pageSlug={pageSlug}
          baseHref={baseHref}
        >
          {/* Whole page layout: sidebar + content */}
          <div className={menu ? "flex gap-8 max-w-7xl mx-auto " : ""}>
            {/* LEFT: Side Menu */}
            {menu && (
              <aside className="w-60 flex-shrink-0 mt-8">
                <EditableSideMenu menu={menu} activeHref={activeHref} />
              </aside>
            )}

            <div className="mt-8">
              <NavigationGuard />
              <div className="bg-white rounded-lg shadow-md p-8 max-w-5xl mx-auto flex gap-8">
                <div className="flex-1">
                  {/* Title */}
                  <TitleDisplay
                    pageId={page?.id || pageId}
                    locale={page?.locale || locale}
                  />

                  {/* Body */}
                  <BodyDisplay
                    initialHtml={page?.content_html || description}
                    pageId={page?.id || pageId}
                    locale={page?.locale || locale}
                  />

                  {/* Save all button */}
                  <SaveAllButton
                    baseHref={baseHref}
                    pageId={page?.id || pageId}
                    locale={page?.locale || locale}
                  />
                </div>

                {/* Right-side image */}
                <DraftHeroImage
                  initialUrl={
                    page?.hero_url ? `/${page.hero_url}` : image || "/5.jpg"
                  }
                  initialAlt={page?.hero_alt || page?.title || title}
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
            </div>
          </div>
        </PageEditProvider>
      </div>
    </div>
  );
};

export default DetailPageTemplate;
