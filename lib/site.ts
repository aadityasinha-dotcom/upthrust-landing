// Absolute site URL for canonical, Open Graph, sitemap and JSON-LD.
// Falls back to localhost so local builds never produce broken URLs.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);
