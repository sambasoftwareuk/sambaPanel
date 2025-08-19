import React from "react";
import Link from "next/link";
import navLinks from "../constants/navLinks";
import blogPosts from "../mocks/blogData.json";
import { Header2, Header3 } from "../_atoms/Headers";
import { LogoImage } from "../_atoms/images";
import Logo from "../constants/logo.json";
import CompanyAddress from "./CompanyAddress";

// Utility to generate a slug from the title
const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9ğüşıöç ]/gi, "") // remove special chars
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-"); // remove duplicate dashes

const FooterBlogList = () => {
  return (
    <section className="bg-gray-200 p-4 py-8">
      <div className="max-w-screen-xl mx-auto space-y-2">
        <div className=" flex flex-col xl:flex-row justify-between gap-6 ">
          <div className="flex flex-col items-start  ">
            <Link href="/" aria-label="Go to homepage">
              <LogoImage
                imageLink={Logo.imageLinkGray}
                width={200}
                height={40}
              />
            </Link>
            <CompanyAddress className="text-gray-700 mt-2 gap-4 flex flex-col" />
          </div>

          <div className="flex flex-wrap xl:flex-nowrap gap-4 mt-12 ">
            {navLinks.map(({ label, href, className }) => (
              <div key={label}>
                <Link
                  href={href}
                  className={` text-md font-bold whitespace-nowrap text-secondary hover:text-primary900 hover:bg-primary50 rounded-sm transition-colors duration-200 ${
                    className || ""
                  }`}
                >
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <Header2 className="pt-7 pb-5">Blog</Header2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
          {blogPosts.map((post) => {
            if (!post.title) return null;
            const slug = slugify(post.title);
            return (
              <Link key={slug} href={`/blog/${slug}`}>
                <p className="text-sm text-gray-800 ">{post.title}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FooterBlogList;
