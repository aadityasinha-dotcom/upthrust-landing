import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { LogoStripContent } from "@/lib/types";

// 144px tall band under the hero: stat + caption on the left, six client logos
// spread across 1112px on the right. Logos wrap to a 2-column grid on mobile.
export function LogoStrip({ content }: { content: LogoStripContent }) {
  return (
    <section aria-label="Brands that trust us" className="relative mb-20">
      <Container className="flex flex-col gap-8 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex shrink-0 flex-col gap-5">
          <p className="font-bold text-h3">{content.stat}</p>
          <p className="max-w-[12rem] text-body">{content.caption}</p>
        </div>
        <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-6 md:flex md:flex-wrap md:justify-between md:gap-x-10 xl:w-[1112px] xl:flex-nowrap">
          {content.logos.map((logo, i) => (
            <li key={`${logo.alt}-${i}`} className="flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-auto w-auto"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
