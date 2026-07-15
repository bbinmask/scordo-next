import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [new URL("https://res.cloudinary.com/irfanulmadar/**")],
  },
};

export default nextConfig;
