import { siteUrl } from "@/lib/site";
import type { SiteSettings } from "@/lib/types";

// schema.org Organization. Rendered server-side as a JSON-LD script so search
// engines get name, logo, contact and social profiles without parsing the page.
// (No FAQ in the design, so no FAQPage block.)
export function OrganizationJsonLd({ settings }: { settings: SiteSettings }) {
  const emails = settings.footer.groups.map((g) => g.email).filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: siteUrl,
    logo: settings.logo.src.startsWith("http")
      ? settings.logo.src
      : `${siteUrl}${settings.logo.src}`,
    sameAs: settings.footer.socials.map((s) => s.href),
    ...(emails[0] && {
      contactPoint: { "@type": "ContactPoint", email: emails[0], contactType: "sales" },
    }),
  };
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe to inline; "<" is escaped to stop </script> injection.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
