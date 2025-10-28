import BlogComponent from "../_components/BlogComponent";
import Breadcrumb from "../_molecules/BreadCrumb";
import { getMetaData } from "../utils/metadataHelper";
import { getBlogList } from "@/lib/repos/blog";

export async function generateMetadata() {
  return await getMetaData("/blog");
}

const locale = "tr-TR";

export default async function Blog() {
  const blogPosts = await getBlogList(locale, { limit: 100 });

  // BlogComponent formatına çevir
  const { formatTurkishDate } = await import("@/lib/utils/dateFormat");
  const blogData = blogPosts.map((post) => {
    return {
      slug: post.slug,
      title: post.title,
      excerpt: post.summary || "",
      imageLink: post.hero_url || "/5.jpg",
      imageAlt: post.hero_alt || post.title,
      date: formatTurkishDate(post.dt),
      aspectRatio: "aspect-[16/16]",
    };
  });

  return (
    <div className="w-full flex flex-col items-center mt-8 m-auto">
      <Breadcrumb />
      <BlogComponent
        blogData={blogData}
        title="Blog"
        showViewAllButton={false}
      />
    </div>
  );
}
