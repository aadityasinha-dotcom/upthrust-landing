import { defineQuery } from "next-sanity";

// GROQ projections. Images are flattened to {alt, src, width, height} here so the
// mappers (sanity/mappers.ts) stay trivial.
const image = `{ alt, "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  siteName,
  logo ${image},
  headerCta,
  wordmark,
  groups[]{ link, description, email },
  tagline,
  links,
  socials,
  legal,
  copyright,
  newsletter,
  seoTitle,
  seoDescription,
  "ogImage": ogImage.asset->url
}`);

export const landingPageQuery = defineQuery(`*[_type == "landingPage"][0]{
  title,
  seo,
  sections[]{
    _key,
    _type,
    _type == "heroSection" => {
      headlineLines, strategy, comfortable, identity,
      bust ${image}
    },
    _type == "logoStripSection" => {
      stat, caption,
      logos[] ${image}
    },
    _type == "servicesSection" => {
      services[]->{
        "id": slug.current, title, eyebrow, lead, bullets, note, cta,
        bento ${image}
      }
    }
  }
}`);
