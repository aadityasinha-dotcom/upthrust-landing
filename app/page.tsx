import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { Services } from "@/components/sections/Services";
import { GridBackground } from "@/components/ui/GridBackground";
import { fallbackContent, fallbackSiteSettings } from "@/lib/fallback";

// Phase 3: hardcoded content. Phase 4 fetches the same shape from Sanity and
// falls back to this when the CMS is empty.
export default function Home() {
  const content = fallbackContent;
  const settings = fallbackSiteSettings;

  return (
    <>
      {/* The drafting grid runs behind header + hero + logo strip. `isolate` keeps
          the grid's negative z-index inside this wrapper. */}
      <div className="relative isolate">
        <GridBackground />
        <Header settings={settings} />
        <main id="main">
          <Hero content={content.hero} />
          <LogoStrip content={content.logoStrip} />
          <Services services={content.services} />
        </main>
      </div>
      <Footer content={content.footer} />
    </>
  );
}
