import { cacheLife, cacheTag } from "next/cache";
import { fallbackSiteContent } from "@/lib/fallback";
import type { SiteContent } from "@/lib/types";
import { client } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { mapLandingPage, mapSiteSettings } from "@/sanity/mappers";
import { landingPageQuery, siteSettingsQuery } from "@/sanity/queries";
import type { RawLandingPage, RawSiteSettings } from "@/sanity/types";

export const CONTENT_TAG = "content";

// The one place the page gets its content.
// "use cache" (Next 16 Cache Components): the result is cached and becomes part of
// the static shell. cacheLife("max") keeps it until POST /api/revalidate calls
// revalidateTag(CONTENT_TAG), which the Sanity webhook triggers on publish.
// If Sanity is unconfigured, empty or down, the hardcoded design copy is served.
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheTag(CONTENT_TAG);
  cacheLife("max");

  if (!isSanityConfigured) return fallbackSiteContent;

  try {
    const [settings, page] = await Promise.all([
      client.fetch<RawSiteSettings | null>(siteSettingsQuery),
      client.fetch<RawLandingPage | null>(landingPageQuery),
    ]);
    return {
      settings: settings ? mapSiteSettings(settings) : fallbackSiteContent.settings,
      page: page ? mapLandingPage(page) : fallbackSiteContent.page,
    };
  } catch (error) {
    console.error("Sanity fetch failed, serving fallback content", error);
    return fallbackSiteContent;
  }
}
