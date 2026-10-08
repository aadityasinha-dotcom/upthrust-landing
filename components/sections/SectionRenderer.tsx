import { Hero } from "@/components/sections/Hero";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { Services } from "@/components/sections/Services";
import type { Section } from "@/lib/types";

// One case per section type. Adding a section = schema + component + one line here.
export function SectionRenderer({ sections }: { sections: Section[] }) {
  return sections.map((section) => {
    switch (section.type) {
      case "hero":
        return <Hero key={section.key} content={section} />;
      case "logoStrip":
        return <LogoStrip key={section.key} content={section} />;
      case "services":
        return <Services key={section.key} services={section.services} />;
    }
  });
}
