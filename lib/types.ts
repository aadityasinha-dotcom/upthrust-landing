// Content types shared by the fallback content (Phase 3) and the Sanity queries (Phase 4).
// Keeping them in one place means components never care where the data came from.

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

export type SiteSettings = {
  siteName: string;
  logo: ImageAsset;
  headerCta: NavLink;
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

export type LandingPageContent = {
  hero: HeroContent;
  logoStrip: LogoStripContent;
  services: Service[];
  footer: FooterContent;
};
