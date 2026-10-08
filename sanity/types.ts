// Raw shapes returned by the GROQ queries in sanity/queries.ts.
// Every field is optional/nullable because editors can leave things empty;
// the mappers fill gaps from the fallback content.

export type RawImage = {
  alt?: string | null;
  src?: string | null;
  width?: number | null;
  height?: number | null;
} | null;

export type RawLink = { label?: string | null; href?: string | null } | null;

export type RawSiteSettings = {
  siteName?: string | null;
  logo?: RawImage;
  headerCta?: RawLink;
  wordmark?: string[] | null;
  groups?: { link?: RawLink; description?: string | null; email?: string | null }[] | null;
  tagline?: string | null;
  links?: RawLink[] | null;
  socials?: RawLink[] | null;
  legal?: RawLink[] | null;
  copyright?: string | null;
  newsletter?: {
    heading?: string | null;
    consent?: string | null;
    placeholder?: string | null;
    submit?: string | null;
  } | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImage?: string | null;
};

export type RawService = {
  id?: string | null;
  title?: string | null;
  eyebrow?: string | null;
  lead?: string | null;
  bullets?: string[] | null;
  note?: string | null;
  cta?: RawLink;
  bento?: RawImage;
} | null;

export type RawSection =
  | {
      _key: string;
      _type: "heroSection";
      headlineLines?: string[] | null;
      strategy?: string | null;
      comfortable?: string | null;
      identity?: string[] | null;
      bust?: RawImage;
    }
  | {
      _key: string;
      _type: "logoStripSection";
      stat?: string | null;
      caption?: string | null;
      logos?: RawImage[] | null;
    }
  | { _key: string; _type: "servicesSection"; services?: RawService[] | null };

export type RawLandingPage = {
  title?: string | null;
  seo?: { title?: string | null; description?: string | null } | null;
  sections?: RawSection[] | null;
};
