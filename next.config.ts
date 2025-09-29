import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export
  output: "export",

  // If you are using next/image, disable optimization
  images: {
    unoptimized: true,
  },

  // Optional: basePath if hosting in subdirectory
  // basePath: "",
};

export default nextConfig;
