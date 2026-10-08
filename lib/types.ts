// Content types shared by the fallback content and the Sanity mappers.
// Components only ever see these shapes, never raw CMS documents.

export type ImageAsset = {
  src: string;
  alt: string; // "" for decorative images
  width: number;
  height: number;
};

export type NavLink = {
  label: string;
  href: string;
};

export type FooterLinkGroup = {
  link: NavLink;
  description: string;
  email: string;
};

export type FooterContent = {
  wordmark: [string, string]; // ["Upthrust", "Design"]
  groups: FooterLinkGroup[];
  tagline: string;
  links: NavLink[];
  socials: NavLink[];
  legal: NavLink[];
  copyright: string;
  newsletter: {
    heading: string;
    consent: string;
    placeholder: string;
    submit: string;
  };
};

// Site-wide content: header, footer, SEO defaults. One Sanity document.
export type SiteSettings = {
  siteName: string;
  logo: ImageAsset;
  headerCta: NavLink;
  footer: FooterContent;
  seo: {
    title: string;
    description: string;
    ogImage?: string; // absolute URL, 1200x630
  };
};

export type HeroContent = {
  // Three visual lines of the headline. Rendered as one <h1>.
  headlineLines: [string, string, string];
  annotations: {
    strategy: string; // "STRATEGY IS CHEAPER"
    comfortable: string; // "COMFORTABLE IS EXPENSIVE"
    identity: string[]; // ["IDENTITY ·", "EXPERIENCE ·", "MOTION ·"]
  };
  bust: ImageAsset;
};

export type LogoStripContent = {
  stat: string; // "100+"
  caption: string;
  logos: ImageAsset[];
};

export type Service = {
  id: string; // stable slug, used for anchors and React keys
  eyebrow: string;
  title: string;
  lead: string;
  bullets: string[];
  note?: string; // italic aside (slide 4 only)
  bento: ImageAsset;
  cta: NavLink;
};

// The page is an ordered list of sections. Each section type maps to one
// Sanity block type and one React component (see SectionRenderer).
export type HeroSection = { type: "hero"; key: string } & HeroContent;
export type LogoStripSection = { type: "logoStrip"; key: string } & LogoStripContent;
export type ServicesSection = { type: "services"; key: string; services: Service[] };
export type Section = HeroSection | LogoStripSection | ServicesSection;

export type LandingPageContent = {
  sections: Section[];
  seo?: { title?: string; description?: string };
};

export type SiteContent = {
  settings: SiteSettings;
  page: LandingPageContent;
};
