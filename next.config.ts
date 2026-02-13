import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/valentine",
  images: { unoptimized: true },
};

export default nextConfig;
