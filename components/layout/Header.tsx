import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { MobileNav } from "@/components/layout/MobileNav";
import type { SiteSettings } from "@/lib/types";

// 72px tall in the design: 16px vertical padding, 72px side gutters at 1440.
// There are no nav links in the design, only the "Contact us" CTA. On mobile the
// CTA moves into the hamburger menu (the hidden "dehaze" icon in the Figma file).
export function Header({ settings }: { settings: SiteSettings }) {
  return (
    <header className="relative z-20">
      <Container className="flex items-center justify-between px-5 py-4 md:px-10 xl:px-18">
        <Link
          href="/"
          className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <Image
            src={settings.logo.src}
            alt={settings.logo.alt}
            width={settings.logo.width}
            height={settings.logo.height}
            unoptimized={settings.logo.src.endsWith(".svg")}
            className="h-8 w-auto"
          />
        </Link>
        <nav aria-label="Primary">
          <CtaLink
            href={settings.headerCta.href}
            variant="header"
            className="hidden md:inline-flex"
          >
            {settings.headerCta.label}
          </CtaLink>
          <MobileNav cta={settings.headerCta} />
        </nav>
      </Container>
    </header>
  );
}
