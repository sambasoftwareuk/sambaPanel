// "use client";
// import CourseCard from "../_molecules/CourseCard";
// import { CardWithIcon } from "../_molecules/CardWithIcon";
// import SliderCard from "../_molecules/SliderCard";
// import { Certificate } from "../_atoms/Icons";
// import TabMenu from "../_molecules/TabMenu";
// import tabs from "../mocks/tabs.json";
// import { CareerCard } from "../_molecules/CareerCard";
// import careers from "../constants/careers";
// import { SliderImage } from "../_atoms/Images";
// import { SambaSlider } from "../_molecules/Slider";
// import { TestimonialCard } from "../_molecules/TestimonialCard";
// import { LearnCard } from "../_molecules/LearnCard";
// import { FAQSection } from "../_molecules/FaqSection";
// import courses from "../mocks/courses.json";
// import bannerProducts from "../mocks/bannerProducts.json";
// import BlogCard from "../_molecules/BlogCard";
// import blogData from "../mocks/blogData.json";
// import Breadcrumb from "../_molecules/BreadCrumb";
// import { OverlayImageCard } from "../_molecules/ProductCardWithImage";
// import { MobileSideMenu, SideMenu } from "../_molecules/SideMenu";
// import sideMenuData from "../mocks/sideMenuData.json";
// import MainItemGrid from "../_components/MainItemGrid";

// const page = () => {
//   return (
//     <div className="p-4">
//       <Breadcrumb />
//       <CourseCard course={courses.mockCourses[0]} />
//       <SliderCard
//         title="Stay One Step Ahead"
//         subtitle="Achieve success by learning the most up-to-date skills. Courses starting at just €11.99! Offer ends May 15th."
//         primaryLabel="Start Now"
//         onPrimaryClick={() => {}}
//         secondaryLabel="Learn More"
//         onSecondaryClick={() => {}}
//       />
//       <TestimonialCard
//         quote="The Empower gives you the ability to be persistent. I learned exactly what I needed to know in the real world. It helped me sell myself to get a new role."
//         authorName="William Wallace"
//         authorTitle="Partner Account Manager at Samba Web Services"
//         authorImage="/images/testimonials/william.png"
//         courseLink="/aws-course"
//         courseTitle="View this AWS course"
//       />
//       <div className="mt-5">
//         <CardWithIcon
//           icon={Certificate}
//           title="Hands-on training"
//           description="Upskill effectively with AI-powered coding exercises, practice tests, and quizzes."
//           badge="Enterprise Plan"
//           linkText="Explore courses"
//           linkHref="#"
//         />
//       </div>
//       <div className="mt-5">
//         <TabMenu tabs={tabs} />

//         <div className="flex flex-wrap gap-2 justify-center mt-5  ">
//           {careers.map((career, index) => (
//             <div key={index}>
//               <CareerCard {...career} />
//             </div>
//           ))}
//         </div>
//         <FAQSection />
//       </div>
//       <div className="mt-2">
//         <SambaSlider>
//           <SliderImage imageLink={"/sampleimages/logo.png"} />
//         </SambaSlider>
//       </div>
//       <div className="mt-2">
//         <SambaSlider variant="infinite" showDots={true}>
//           <SliderImage imageLink={"/sampleimages/learner-centered.jpg"} />
//           <SliderImage />
//           <SliderImage imageLink={"/sampleimages/life-in-the-uk.jpg"} />
//         </SambaSlider>
//       </div>
//       <div className="mt-2">
//         <SambaSlider showDots={true}>
//           <SliderImage imageLink={"/sampleimages/life-in-the-uk.jpg"} />
//           <SliderImage imageLink={"/sampleimages/learner-centered.jpg"} />
//           <SliderImage />
//         </SambaSlider>
//       </div>
//       <div className="mt-2">
//         <SambaSlider variant={"autoSlide"} showDots={false} showArrows={false}>
//           <SliderImage imageLink={"/sampleimages/life-in-the-uk.jpg"} />
//           <SliderImage imageLink={"/sampleimages/learner-centered.jpg"} />
//           <SliderImage />
//         </SambaSlider>
//       </div>
//       <div className="mt-2">
//         <SambaSlider variant={"autoSlide"} showDots={true} showArrows={false}>
//           <SliderImage imageLink={"/sampleimages/life-in-the-uk.jpg"} />
//           <SliderImage imageLink={"/sampleimages/learner-centered.jpg"} />
//           <SliderImage />
//         </SambaSlider>
//       </div>
//       <div className="mt-2">
//         <SambaSlider variant={"autoSlide"} showDots={false} showArrows={true}>
//           <SliderImage imageLink={"/sampleimages/life-in-the-uk.jpg"} />
//           <SliderImage imageLink={"/sampleimages/learner-centered.jpg"} />
//           <SliderImage />
//         </SambaSlider>
//       </div>
//       <LearnCard />
//       <MainItemGrid items={bannerProducts} baseHref="urunler" />

//       <div className="flex flex-col justify-center items-center m-4">
//         <h1 className="font-bold text-lg mb-10">BLOG</h1>
//         <div className="mt-2 flex w-4/5 m-auto justify-center gap-6 h-1/4 flex-wrap">
//           {blogData.map((post, index) => (
//             <BlogCard
//               key={index}
//               imageLink={post.imageLink}
//               imageAlt={post.imageAlt}
//               date={post.date}
//               title={post.title}
//               excerpt={post.excerpt}
//               aspectRatio={post.aspectRatio}
//             />
//           ))}
//         </div>
//       </div>
//       <OverlayImageCard
//         title="Tüm Su Soğutma Kulesi Markaları İçin Bakım"
//         imageLink="/5.jpg"
//         overlayDarkness={0.5}
//       />
//       <SideMenu menu={sideMenuData} activeHref={""} />
//       <MobileSideMenu menu={sideMenuData} activeHref={""} />
//     </div>
//   );
// };

// export default page;
