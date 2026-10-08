import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CtaLink } from "@/components/ui/CtaLink";
import { cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

// The Figma "SERVICES" component has four variants (one per service). Only one is
// placed on the Homepage frame and there is no carousel UI, so we render all four
// as stacked panels. Bento + text sit side by side only from lg (1024): at 768 the
// 492px card and 480px column don't fit, so they stack: fully server-rendered, no JS, and it maps 1:1 to a CMS array.
export function Services({ services }: { services: Service[] }) {
  return (
    <div className="bg-black">
      {services.map((service, i) => (
        <ServicePanel key={service.id} service={service} index={i} />
      ))}
    </div>
  );
}

// The 3D curve asset is three panels wide (4320px in Figma). Each slide shows a
// different third of it, which is what the Figma variants do with a left offset.
const curveOffsets = ["left-0", "-left-full", "-left-[200%]"];

function ServicePanel({ service, index }: { service: Service; index: number }) {
  const headingId = `${service.id}-heading`;
  return (
    <section
      id={service.id}
      aria-labelledby={headingId}
      className="relative flex items-center overflow-hidden bg-black text-white xl:min-h-[810px]"
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute top-1/2 aspect-[4320/1401] w-[300%] -translate-y-1/2",
          curveOffsets[index % curveOffsets.length],
        )}
      >
        {/* Soft, blurred 3D render: capping `sizes` well below 300vw is invisible but
            cuts ~80 KB on mobile. Same URL for all four panels, so it downloads once. */}
        <Image
          src="/images/services/curve.webp"
          alt=""
          fill
          sizes="(min-width: 1024px) 2880px, 150vw"
          className="object-cover"
        />
      </div>

      <Container className="relative flex flex-col gap-10 py-10 md:gap-20 md:py-20">
        <div className="flex flex-col px-5 md:px-10">
          <p className="text-body uppercase">{service.eyebrow}</p>
          <h2 id={headingId} className="font-semibold text-h4 md:text-h3 xl:text-special">
            {service.title}
          </h2>
        </div>

        <div className="flex flex-col gap-10 px-5 md:px-10 lg:flex-row lg:items-start lg:gap-20 xl:gap-40 xl:pr-10 xl:pl-30">
          <Image
            src={service.bento.src}
            alt={service.bento.alt}
            width={service.bento.width}
            height={service.bento.height}
            sizes="(min-width: 768px) 492px, 100vw"
            className="w-full max-w-[492px] shrink-0 rounded-card"
          />

          <div className="flex flex-col gap-10 lg:min-h-[332px] lg:w-[480px] lg:justify-between lg:gap-6">
            <p className="font-semibold text-h7">{service.lead}</p>
            <ul className="flex flex-col gap-5">
              {service.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2 font-semibold text-h7">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <Image src="/images/icons/star.svg" alt="" width={15} height={15} />
                  </span>
                  {bullet}
                </li>
              ))}
            </ul>
            {service.note && <p className="text-note italic">{service.note}</p>}
            <CtaLink href={service.cta.href} className="self-start">
              {service.cta.label}
            </CtaLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
