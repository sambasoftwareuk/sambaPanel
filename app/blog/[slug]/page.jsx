import { Header1 } from "@/app/_atoms/Headers";
import Breadcrumb from "@/app/_molecules/BreadCrumb";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MobileSideMenu, SideMenu } from "@/app/_molecules/SideMenu";
import sideMenuData from "../../mocks/sideMenuData.json";
import { getBlogPostBySlug } from "@/lib/repos/blog";
import JsonLd from "@/components/seo/JsonLd";

const locale = "tr-TR";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(locale, slug);

  if (!post) {
    return {
      title: "Blog Yazısı Bulunamadı",
      description: "İlgili blog yazısı bulunamadı.",
    };
  }

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.summary || post.title;
  const ogTitle = post.og_title || title;
  const ogDescription = post.og_description || description;

  return {
    title,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(post.hero_url ? { images: [post.hero_url] } : {}),
    },
    twitter: {
      title: ogTitle,
      description: ogDescription,
      ...(post.hero_url ? { images: [post.hero_url] } : {}),
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;

  const post = await getBlogPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const { formatTurkishDate } = await import("@/lib/utils/dateFormat");
  const formattedDate = formatTurkishDate(post.dt);

  const blogMenu = sideMenuData.filter(
    (section) => section.title === "Tüm Bloglar"
  );

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col">
      <JsonLd data={post.json_ld} />

      {/* Mobile: 1 — Tüm Bloglar */}
      <div className="order-1 lg:hidden">
        <MobileSideMenu menu={blogMenu} activeHref={`/blog/${post.slug}`} />
      </div>

      {/* Mobile: 2 — Breadcrumb | Desktop: first */}
      <div className="text-center order-2 lg:order-1">
        <Breadcrumb title={post.title} />
      </div>
      <Header1 className="lg:hidden text-center my-5 w-full max-w-2xl lg:w-1/2 m-auto text-lg order-3 lg:order-2">
        {post.title}
      </Header1>

      <div className="flex flex-col lg:flex-row justify-between gap-8 order-4 lg:order-3">
        <SideMenu menu={blogMenu} activeHref={`/blog/${post.slug}`} />
        {/* Mobile: 4 — Text | Desktop: middle column */}
        <div className="prose prose-lg w-full lg:w-1/2 max-w-2xl text-justify order-2 lg:order-none">
          <p className="text-red-500 text-sm mb-4">{formattedDate}</p>
          <div
            className="text-sm leading-relaxed text-justify"
            dangerouslySetInnerHTML={{
              __html: post.body_html || post.summary || "",
            }}
          />
        </div>
        {/* Mobile: 3 — Image | Desktop: right column */}
        <div className="w-full lg:w-1/4 order-1 lg:order-none lg:mt-6 ">
          <Image
            src={post.hero_url || "/generic-image.png"}
            alt={post.hero_alt || post.title}
            width={300}
            height={300}
            className="rounded-lg shadow-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}
