import React from "react";
import Image from "next/image";
import { Header1 } from "@/app/_atoms/Headers";
import { MobileSideMenu, SideMenu } from "@/app/_molecules/sideMenu";
import Breadcrumb from "@/app/_molecules/breadCrumb";
import MainItemGrid from "@/app/_components/MainItemGrid";
import { sanitizeHtmlContent } from "../utils/cleanHTML";
import { PageEditProvider } from "../context/PageEditProvider";
import TitleDisplay from "../_molecules/TitleDisplay";
import { SignedIn } from "@clerk/nextjs";
import TitleEditor from "../_molecules/TitleEditor";
import BodyDisplay from "../_molecules/BodyDisplay";
import BodyEditor from "../_molecules/bodyEditor";
import DraftHeroImage from "../_molecules/DraftHeroImage";
import ImageEditor from "../_molecules/ImageEditor";
import { PrimaryButton } from "../_atoms/buttons";
import { NavigationGuard } from "../_molecules/NavigationGuard";

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
  pageId,
  locale = "tr-TR",
}) => {
  if (!title) {
    return <div className="p-6 text-red-500">{notFoundText}</div>;
  }

  const safeHtml = sanitizeHtmlContent(description);
  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageEditProvider
        initialTitle={title}
        initialBody={safeHtml || "<p></p>"}
        initialHeroUrl={image || "/placeholder.jpg"}
        initialHeroAlt={title}
        pageId={pageId}
        locale={locale}
      >
        <div className="max-w-7xl mx-auto p-6">
          <div className="text-center">
            <Breadcrumb />
            <NavigationGuard />
          </div>
          <div className="flex items-center justify-center gap-8">
            <TitleDisplay initialTitle={title} />
            <SignedIn>
              <TitleEditor pageId={pageId} locale={locale} />
            </SignedIn>
          </div>
          <div className="flex flex-col lg:flex-row justify-between gap-8 ">
            <SideMenu menu={menu} activeHref={activeHref} />
            {/* <MobileSideMenu menu={menu} activeHref={activeHref} /> */}

            <div className="flex items-start gap-2 mt-4">
              <div className="flex flex-col gap-6">
                <BodyDisplay initialHtml={safeHtml} />
                <SignedIn>
                  {/* <SaveAllButton pageId={page.id} locale={page.locale} /> */}
                  <PrimaryButton
                    label="Save All"
                    className="w-1/6 min-w-[120px] px-4 "
                  />
                </SignedIn>
              </div>
              <SignedIn>
                <BodyEditor pageId={pageId} locale={locale} />
              </SignedIn>
            </div>

            <div>
              <DraftHeroImage
                initialUrl={image}
                initialAlt={title}
                width={320}
                height={320}
                className="rounded-lg object-cover w-80 h-80"
              />
              <SignedIn>
                <ImageEditor initialUrl={image} initialAlt={title} />
              </SignedIn>
            </div>
          </div>

          <Header1 className="text-center my-8">{otherItemsTitle}</Header1>
          <MainItemGrid
            items={otherItems}
            baseHref={baseHref}
            gridClassName="grid-cols-1 md:grid-cols-3"
            cardProps={{ button: false, variant: 2 }}
          />
        </div>
      </PageEditProvider>
    </div>
  );
};

export default DetailPageTemplate;
