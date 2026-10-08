import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { GridBackground } from "@/components/ui/GridBackground";
import { getContent } from "@/lib/content";

// Content comes from Sanity via getContent() (cached, tag-revalidated), with the
// hardcoded design copy as fallback so the page never renders empty.
export default async function Home() {
  const { settings, page } = await getContent();

  return (
    <>
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
