import blogData from "@/app/mocks/blogData.json";
import { Header1 } from "@/app/_atoms/Headers";
import Breadcrumb from "@/app/_molecules/BreadCrumb";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MobileSideMenu, SideMenu } from "@/app/_molecules/SideMenu";
import sideMenuData from "../../mocks/sideMenuData.json";

export default function BlogDetailPage({ params }) {
  const { slug } = params;

  const post = blogData.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

const blogMenu = sideMenuData.filter(
    (section) => section.title === "Tüm Bloglar"
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="text-center">
        <Breadcrumb title={post.title} />
      </div>

      <Header1 className="text-center my-5 w-full lg:w-1/2 max-w-2xl m-auto">{post.title}</Header1>

      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <SideMenu menu={blogMenu} activeHref={`/blog/${post.slug}`} />
        <MobileSideMenu
          menu={blogMenu}
          activeHref={`/blog/${post.slug}`}
        />
        <div className="prose prose-lg w-full lg:w-1/2 max-w-2xl text-justify">
          <p className="text-red-500 text-sm mb-4">{post.date}</p>
          <p className="text-lg md:text-xl leading-relaxed text-justify">
            {post.excerpt}
          </p>
        </div>
        <div className="w-full lg:w-1/4  mt-6">
          <Image
            src={post.imageLink}
            alt={post.imageAlt}
            width={300}
            height={300}
            className="rounded-lg shadow-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}
