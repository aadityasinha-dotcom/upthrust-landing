import { fallbackContent, fallbackSiteSettings } from "@/lib/fallback";
import type {
  HeroSection,
  ImageAsset,
  LandingPageContent,
  LogoStripSection,
  NavLink,
  Section,
  Service,
  ServicesSection,
  SiteSettings,
} from "@/lib/types";
import type {
  RawImage,
  RawLandingPage,
  RawLink,
  RawSection,
  RawService,
  RawSiteSettings,
} from "./types";

// Raw Sanity -> component props. Missing values fall back to the hardcoded
// design copy so a half-filled CMS never breaks the page.

function toImage(raw: RawImage | undefined, fallback: ImageAsset): ImageAsset {
  if (!raw?.src || !raw.width || !raw.height) return fallback;
  return { src: raw.src, alt: raw.alt ?? fallback.alt, width: raw.width, height: raw.height };
}

function toLink(raw: RawLink | undefined, fallback: NavLink): NavLink {
  return { label: raw?.label ?? fallback.label, href: raw?.href ?? fallback.href };
}

function toLinks(raw: RawLink[] | null | undefined, fallback: NavLink[]): NavLink[] {
  if (!raw?.length) return fallback;
  return raw.map((l, i) => toLink(l, fallback[i] ?? fallback[0]));
}

const fallbackSections = fallbackContent.sections;
const fallbackHero = fallbackSections.find((s) => s.type === "hero") as HeroSection;
const fallbackLogos = fallbackSections.find((s) => s.type === "logoStrip") as LogoStripSection;
const fallbackServices = fallbackSections.find((s) => s.type === "services") as ServicesSection;

export function mapSiteSettings(raw: RawSiteSettings): SiteSettings {
  const f = fallbackSiteSettings;
  const fw = f.footer;
  return {
    siteName: raw.siteName ?? f.siteName,
    logo: toImage(raw.logo, f.logo),
    headerCta: toLink(raw.headerCta, f.headerCta),
    footer: {
      wordmark: raw.wordmark?.length === 2 ? [raw.wordmark[0], raw.wordmark[1]] : fw.wordmark,
      groups: raw.groups?.length
        ? raw.groups.map((g, i) => ({
            link: toLink(g.link, fw.groups[i]?.link ?? fw.groups[0].link),
            description: g.description ?? "",
            email: g.email ?? "",
          }))
        : fw.groups,
      tagline: raw.tagline ?? fw.tagline,
      links: toLinks(raw.links, fw.links),
      socials: toLinks(raw.socials, fw.socials),
      legal: toLinks(raw.legal, fw.legal),
      copyright: raw.copyright ?? fw.copyright,
      newsletter: {
        heading: raw.newsletter?.heading ?? fw.newsletter.heading,
        consent: raw.newsletter?.consent ?? fw.newsletter.consent,
        placeholder: raw.newsletter?.placeholder ?? fw.newsletter.placeholder,
        submit: raw.newsletter?.submit ?? fw.newsletter.submit,
      },
    },
    seo: {
      title: raw.seoTitle ?? f.seo.title,
      description: raw.seoDescription ?? f.seo.description,
      ogImage: raw.ogImage ?? undefined,
    },
  };
}

function mapService(raw: RawService, index: number): Service {
  const f = fallbackServices.services[index] ?? fallbackServices.services[0];
  return {
    id: raw?.id ?? f.id,
    eyebrow: raw?.eyebrow ?? f.eyebrow,
    title: raw?.title ?? f.title,
    lead: raw?.lead ?? f.lead,
    bullets: raw?.bullets?.length ? raw.bullets : f.bullets,
    note: raw?.note ?? undefined,
    bento: toImage(raw?.bento, f.bento),
    cta: toLink(raw?.cta, f.cta),
  };
}

function mapSection(raw: RawSection): Section | null {
  switch (raw._type) {
    case "heroSection": {
      const lines = raw.headlineLines ?? [];
      return {
        type: "hero",
        key: raw._key,
        headlineLines:
          lines.length === 3 ? [lines[0], lines[1], lines[2]] : fallbackHero.headlineLines,
        annotations: {
          strategy: raw.strategy ?? fallbackHero.annotations.strategy,
          comfortable: raw.comfortable ?? fallbackHero.annotations.comfortable,
          identity: raw.identity?.length ? raw.identity : fallbackHero.annotations.identity,
        },
        bust: toImage(raw.bust, fallbackHero.bust),
      };
    }
    case "logoStripSection":
      return {
        type: "logoStrip",
        key: raw._key,
        stat: raw.stat ?? fallbackLogos.stat,
        caption: raw.caption ?? fallbackLogos.caption,
        logos: raw.logos?.length
          ? raw.logos.map((l, i) => toImage(l, fallbackLogos.logos[i] ?? fallbackLogos.logos[0]))
          : fallbackLogos.logos,
      };
    case "servicesSection":
      return {
        type: "services",
        key: raw._key,
        services: raw.services?.length ? raw.services.map(mapService) : fallbackServices.services,
      };
    default:
      // Unknown block type (schema added before its component): skip, don't crash.
      return null;
  }
}

export function mapLandingPage(raw: RawLandingPage): LandingPageContent {
  const sections = (raw.sections ?? []).map(mapSection).filter((s): s is Section => s !== null);
  return {
    sections: sections.length ? sections : fallbackContent.sections,
    seo: {
      title: raw.seo?.title ?? undefined,
      description: raw.seo?.description ?? undefined,
    },
  };
}
