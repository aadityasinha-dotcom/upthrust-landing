import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Content images are served from Sanity's CDN once the CMS is seeded.
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
