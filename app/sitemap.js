import { getBlogList } from "@/lib/repos/blog";
import { getProductCollections } from "@/lib/repos/products";
import { getServiceMenu } from "@/lib/repos/services";
import { getAllSparePart } from "@/lib/repos/spareParts";

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://www.greenstepcoolingtower.com").replace(/\/$/, "");
const LOCALE = "tr-TR";
const LAST_MODIFIED_DEFAULT = new Date();

async function getStaticEntries() {
  return [
    "/",
    "/kurumsal",
    "/urunler",
    "/hizmetler",
    "/yedek-parcalar",
    "/galeri",
    "/referanslar",
    "/blog",
    "/iletisim",
  ].map((path) => ({ path, lastModified: LAST_MODIFIED_DEFAULT }));
}

async function getProductEntries() {
  const products = await getProductCollections(LOCALE, "product");
  return products.map(({ slug }) => ({
    path: `/urunler/${slug}`,
    lastModified: LAST_MODIFIED_DEFAULT,
  }));
}

async function getServiceEntries() {
  const services = await getServiceMenu(LOCALE);
  return services.map(({ slug }) => ({
    path: `/hizmetler/${slug}`,
    lastModified: LAST_MODIFIED_DEFAULT,
  }));
}

async function getSparePartEntries() {
  const spareParts = await getAllSparePart(LOCALE);
  return spareParts.map(({ slug }) => ({
    path: `/yedek-parcalar/${slug}`,
    lastModified: LAST_MODIFIED_DEFAULT,
  }));
}

async function getBlogEntries() {
  const blogPosts = await getBlogList(LOCALE, { limit: 1000 });
  return blogPosts.map(({ slug, dt }) => ({
    path: `/blog/${slug}`,
    lastModified: dt ? new Date(dt) : LAST_MODIFIED_DEFAULT,
  }));
}

export default async function sitemap() {
  const [staticEntries, productEntries, serviceEntries, sparePartEntries, blogEntries] =
    await Promise.all([
      getStaticEntries(),
      getProductEntries(),
      getServiceEntries(),
      getSparePartEntries(),
      getBlogEntries(),
    ]);

  return [
    ...staticEntries,
    ...productEntries,
    ...serviceEntries,
    ...sparePartEntries,
    ...blogEntries,
  ].map(({ path, lastModified }) => ({
    url: `${BASE_URL}${path}`,
    lastModified,
  }));
}
