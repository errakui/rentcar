import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
        port: "",
        search: "",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
        port: "",
        search: "",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
