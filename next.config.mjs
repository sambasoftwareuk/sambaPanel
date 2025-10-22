/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        port: "",
        pathname: "/vi/**",
        
      },
       { protocol: "https", hostname: "www.greenstepcoolingtower.com" },
      { protocol: "https", hostname: "**.hostinger.com" },
    ],
  },
};

export default nextConfig;
