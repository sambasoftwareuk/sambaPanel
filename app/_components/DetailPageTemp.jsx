import React from "react";
import Image from "next/image";
import { Header1 } from "@/app/_atoms/Headers";
import { MobileSideMenu, SideMenu } from "@/app/_molecules/sideMenu";
import Breadcrumb from "@/app/_molecules/breadCrumb";
import MainItemGrid from "@/app/_components/MainItemGrid";

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
}) => {
  if (!title) {
    return <div className="p-6 text-red-500">{notFoundText}</div>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center">
        <Breadcrumb />
      </div>
      <Header1 className="text-center my-5">{title}</Header1>
      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <SideMenu menu={menu} activeHref={activeHref} />
        <MobileSideMenu menu={menu} activeHref={activeHref} />
        <div
          className="prose prose-lg w-full lg:w-1/2 max-w-2xl text-justify"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div>
          <Image
            src={image}
            alt={title}
            width={300}
            height={300}
            className="rounded-lg shadow-lg object-contain"
          />
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
  );
};

export default DetailPageTemplate;
