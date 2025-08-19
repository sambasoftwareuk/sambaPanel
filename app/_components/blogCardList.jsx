import { Header1} from "../_atoms/Headers";
import BlogCard from "../_molecules/blogCard";

const BlogCardList = ({ blogData }) => (
    <div className="w-full flex flex-col items-center mt-8">
    <Header1 className="m-8">Blog</Header1>
    <div className="flex md:gap-6 lg:justify-center justify-around mb-4">
      {blogData.map((post, index) => (
        <BlogCard
          key={index}
          imageLink={post.imageLink}
          imageAlt={post.imageAlt}
          date={post.date}
          title={post.title}
          excerpt={post.excerpt}
          aspectRatio={post.aspectRatio}
        />
      ))}
    </div>
  </div>
);

export default BlogCardList;