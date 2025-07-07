import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output:"export",
  distDir:"out",
  images :{
    unoptimized: true
  },
  basePath:"",
  assetPath:"./",
  trailingStash: true

};

export default nextConfig;
