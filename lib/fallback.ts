import type { LandingPageContent, SiteContent, SiteSettings } from "./types";

// Hardcoded copy, verbatim from the Figma file (design/spec.md).
// Phase 4 swaps this for Sanity data; this stays as the fallback so the
// page never renders empty if the CMS is unreachable or unseeded.

export const fallbackSiteSettings: SiteSettings = {
  siteName: "Upthrust",
  logo: { src: "/images/logo.svg", alt: "Upthrust", width: 157, height: 32 },
  headerCta: { label: "Contact us", href: "#signup" },
  footer: {
    wordmark: ["Upthrust", "Design"],
    groups: [
      {
        link: { label: "upthrust.agency", href: "https://upthrust.agency" },
        description: "add description here",
        email: "hello@upthrust.agency",
      },
      {
        link: { label: "upthrust.io", href: "https://upthrust.io" },
        description: "add description here",
        email: "hello@upthrust.io",
      },
    ],
    tagline: "Lorem ipsum dolor sit amet consectetur",
    links: [
      { label: "upthrust.agency", href: "https://upthrust.agency" },
      { label: "upthrust.io", href: "https://upthrust.io" },
    ],
    socials: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "LinkedIn", href: "https://linkedin.com" },
    ],
    legal: [{ label: "Privacy Policy", href: "/privacy" }],
    copyright: "© Upthrust Design",
    newsletter: {
      heading: "Sign up for our emails",
      consent:
        "By checking this box sign up for our newsletter and receive marketing emails and updates on our services. You can unsubscribe at any time.",
      placeholder: "typehere@youremail.com",
      submit: "Submit",
    },
  },
  seo: {
    title: "Upthrust — Bold design that performs",
    description:
      "Upthrust is a design agency for strategy, brand identity, product experience and campaign production. 100+ brands trusted us to define how they're seen.",
  },
};

export const fallbackContent: LandingPageContent = {
  sections: [
    {
      type: "hero",
      key: "hero",
      headlineLines: ["Bold design", "that", "performs"],
      annotations: {
        strategy: "Strategy is cheaper",
        comfortable: "Comfortable is expensive",
        identity: ["Identity ·", "Experience ·", "Motion ·"],
      },
      bust: {
        src: "/images/hero/bust.webp",
        alt: "Iridescent classical bust sculpture",
        width: 546,
        height: 685,
      },
    },

    {
      type: "logoStrip",
      key: "logoStrip",
      stat: "100+",
      caption: "Brands trusted us to define how they're seen.",
      // width/height = the image file's aspect ratio at the design's display height.
      // L'Oréal appears twice in the design.
      logos: [
        { src: "/images/logos/zomato.png", alt: "Zomato", width: 152, height: 32 },
        { src: "/images/logos/bosch.png", alt: "Bosch", width: 154, height: 39 },
        { src: "/images/logos/loreal.svg", alt: "L'Oréal", width: 143, height: 26 },
        { src: "/images/logos/vega.png", alt: "Vega", width: 118, height: 41 },
        { src: "/images/logos/dell.png", alt: "Dell", width: 108, height: 33 },
        { src: "/images/logos/loreal.svg", alt: "L'Oréal", width: 143, height: 26 },
      ],
    },

    {
      type: "services",
      key: "services",
      services: [
        {
          id: "strategy",
          eyebrow: "What can we do for you",
          title: "Strategy and Insight",
          lead: "We interrogate what others assume. Then we build the brief behind the brief.",
          bullets: [
            "Brand strategy & positioning",
            "Messaging & tone of voice",
            "Audience & competitor research",
            "Workshops & creative sprints",
          ],
          bento: {
            src: "/images/services/bento-1.webp",
            alt: "Collage of strategy workshop boards: audience personas, typography and industry logos",
            width: 492,
            height: 332,
          },
          cta: { label: "Contact", href: "#signup" },
        },
        {
          id: "brand",
          eyebrow: "What can we do for you",
          title: "Brand & visual identity",
          lead: "We build systems, not just logos. So you own the category, not just the conversation.",
          bullets: [
            "Brand identity & visual language",
            "Guidelines & naming",
            "Illustration & iconography",
            "Brand architecture & systems",
          ],
          bento: {
            src: "/images/services/bento-2.webp",
            alt: "Collage of brand identity work: colour palettes, tags and a photographic poster",
            width: 492,
            height: 332,
          },
          cta: { label: "Contact", href: "#signup" },
        },
        {
          id: "product",
          eyebrow: "What can we do for you",
          title: "Product & digital experience",
          lead: "We design for humans and metrics. So users stay, engage, and come back.",
          bullets: [
            "UI/UX & website design",
            "Design systems & prototyping",
            "User research & testing",
            "Motion graphics & micro-interactions",
          ],
          bento: {
            src: "/images/services/bento-3.webp",
            alt: "Collage of product UI: dashboards, tables, status chips and a colour spec",
            width: 492,
            height: 332,
          },
          cta: { label: "Contact", href: "#signup" },
        },
        {
          id: "campaign",
          eyebrow: "What can we do for you",
          title: "Creative & campaign production",
          lead: "We turn attention into action. Then we prove it worked.",
          bullets: [
            "Campaign creative & social content",
            "Presentations & pitch decks",
            "Marketing collateral & ad creative",
          ],
          note: "psst.. Also, physical spaces. Because not everything happens on a screen experiential and spatial design for exhibitions, placemaking and branded environments, Just ask.",
          bento: {
            src: "/images/services/bento-4.webp",
            alt: "Collage of campaign work: billboards, social posts and ad creative",
            width: 492,
            height: 332,
          },
          cta: { label: "Contact", href: "#signup" },
        },
      ],
    },
  ],
};

export const fallbackSiteContent: SiteContent = {
  settings: fallbackSiteSettings,
  page: fallbackContent,
};
