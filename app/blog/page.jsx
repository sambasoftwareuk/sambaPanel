import BlogComponent from "../_components/BlogComponent";
import Breadcrumb from "../_molecules/breadCrumb";
import blogData from "../mocks/blogData.json";
import { getMetadataForPath } from "../utils/metadataHelper";

export async function generateMetadata() {
  const meta = getMetadataForPath("/blog");

  return {
    title: meta.title,
    description: meta.description,
  };
}

const Blog = () => {
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
};

export default Blog;
