import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Served at /sitemap.xml. One page today; add entries here as routes grow.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];
}
