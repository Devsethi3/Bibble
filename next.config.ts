import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["utfs.io", "uploadthing.com"],
  },
};

export default nextConfig;
