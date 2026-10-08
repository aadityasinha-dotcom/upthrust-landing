// Seeds Sanity with the design copy from lib/fallback.ts and uploads the images
// from /public. Safe to re-run: documents use fixed _ids (createOrReplace) and
// Sanity de-duplicates identical image uploads.
//
//   npm run seed      (= node --env-file=.env.local --experimental-strip-types scripts/seed.mts)
// .mts so Node treats it as ESM without touching package.json's module type.

import { createClient } from "@sanity/client";
import { createReadStream } from "node:fs";
import { basename } from "node:path";
import { fallbackContent, fallbackSiteSettings } from "../lib/fallback.ts";
import type { HeroSection, ImageAsset, LogoStripSection, ServicesSection } from "../lib/types.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2025-10-01", useCdn: false });

async function uploadImage(image: ImageAsset) {
  const path = `public${image.src}`;
  const asset = await client.assets.upload("image", createReadStream(path), {
    filename: basename(path),
  });
  console.log(`  uploaded ${image.src} -> ${asset._id}`);
  return {
    _type: "imageWithAlt",
    alt: image.alt,
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function main() {
  const settings = fallbackSiteSettings;
  const hero = fallbackContent.sections.find((s) => s.type === "hero") as HeroSection;
  const logos = fallbackContent.sections.find((s) => s.type === "logoStrip") as LogoStripSection;
  const services = fallbackContent.sections.find((s) => s.type === "services") as ServicesSection;

  console.log("Uploading images…");
  const logoImage = await uploadImage(settings.logo);
  const bustImage = await uploadImage(hero.bust);
  type Uploaded = Awaited<ReturnType<typeof uploadImage>>;
  const logoImages: (Uploaded & { _key: string })[] = [];
  for (const logo of logos.logos)
    logoImages.push({ _key: crypto.randomUUID(), ...(await uploadImage(logo)) });
  const bentoImages: Uploaded[] = [];
  for (const service of services.services) bentoImages.push(await uploadImage(service.bento));

  const tx = client.transaction();

  tx.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: settings.siteName,
    logo: logoImage,
    headerCta: { _type: "link", ...settings.headerCta },
    wordmark: settings.footer.wordmark,
    groups: settings.footer.groups.map((g) => ({
      _key: crypto.randomUUID(),
      link: { _type: "link", ...g.link },
      description: g.description,
      email: g.email,
    })),
    tagline: settings.footer.tagline,
    links: settings.footer.links.map((l) => ({ _key: crypto.randomUUID(), _type: "link", ...l })),
    socials: settings.footer.socials.map((l) => ({
      _key: crypto.randomUUID(),
      _type: "link",
      ...l,
    })),
    legal: settings.footer.legal.map((l) => ({ _key: crypto.randomUUID(), _type: "link", ...l })),
    copyright: settings.footer.copyright,
    newsletter: settings.footer.newsletter,
    seoTitle: settings.seo.title,
    seoDescription: settings.seo.description,
  });

  services.services.forEach((service, i) => {
    tx.createOrReplace({
      _id: `service-${service.id}`,
      _type: "service",
      title: service.title,
      slug: { _type: "slug", current: service.id },
      eyebrow: service.eyebrow,
      lead: service.lead,
      bullets: service.bullets,
      note: service.note,
      bento: bentoImages[i],
      cta: { _type: "link", ...service.cta },
    });
  });

  tx.createOrReplace({
    _id: "landingPage",
    _type: "landingPage",
    title: "Home",
    sections: [
      {
        _key: "hero",
        _type: "heroSection",
        headlineLines: hero.headlineLines,
        strategy: hero.annotations.strategy,
        comfortable: hero.annotations.comfortable,
        identity: hero.annotations.identity,
        bust: bustImage,
      },
      {
        _key: "logoStrip",
        _type: "logoStripSection",
        stat: logos.stat,
        caption: logos.caption,
        logos: logoImages,
      },
      {
        _key: "services",
        _type: "servicesSection",
        services: services.services.map((s) => ({
          _key: s.id,
          _type: "reference",
          _ref: `service-${s.id}`,
        })),
      },
    ],
    seo: { title: settings.seo.title, description: settings.seo.description },
  });

  console.log("Writing documents…");
  const result = await tx.commit();
  console.log(`Done: ${result.results.length} documents written to ${projectId}/${dataset}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
