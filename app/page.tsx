import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { GridBackground } from "@/components/ui/GridBackground";
import type { Metadata } from "next";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { getContent } from "@/lib/content";

// Title/description come from the CMS (page SEO fields, then site defaults).
// Canonical + OG/Twitter use metadataBase from layout.tsx.
export async function generateMetadata(): Promise<Metadata> {
  const { settings, page } = await getContent();
  const title = page.seo?.title ?? settings.seo.title;
  const description = page.seo?.description ?? settings.seo.description;
  const ogImage = settings.seo.ogImage ?? "/og.png";
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      siteName: settings.siteName,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${settings.siteName} — ${title}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}

// Content comes from Sanity via getContent() (cached, tag-revalidated), with the
// hardcoded design copy as fallback so the page never renders empty.
export default async function Home() {
  const { settings, page } = await getContent();

  return (
    <>
      <OrganizationJsonLd settings={settings} />
      {/* The drafting grid runs behind header + hero + logo strip. `isolate` keeps
          the grid's negative z-index inside this wrapper. */}
      <div className="relative isolate">
        <GridBackground />
        <Header settings={settings} />
        <main id="main">
          <SectionRenderer sections={page.sections} />
        </main>
      </div>
      <Footer content={settings.footer} />
    </>
  );
}
