import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { HeroContent } from "@/lib/types";

// The hero is a fixed composition in Figma (1440x1079, everything absolutely placed).
// From md up we keep that composition and make it fluid with one unit:
//   --u = 100cqw / 1440  ->  "one Figma pixel at the current container width"
// so every Figma coordinate is written as calc(<figma px> * var(--u)). The stage keeps
// the 1440:1079 aspect ratio. Below md the same elements flow in a normal column.
// Layer order from Figma (bottom -> top): "THAT"/"BOLD DESIGN" < wireframe < bust < "PERFORMS" < annotations.
export function Hero({ content }: { content: HeroContent }) {
  const [line1, line2, line3] = content.headlineLines;
  const { strategy, comfortable, identity } = content.annotations;

  return (
    <section aria-labelledby="hero-heading" className="relative">
      <Container className="@container">
        <div className="relative md:aspect-[1440/1079] md:overflow-hidden">
          <div className="flex flex-col gap-8 px-5 pt-6 pb-10 md:absolute md:inset-0 md:block md:p-0 md:[--u:calc(100cqw/1440)]">
            {/* Headline: three visual lines, one h1. The Figma outlines are Anton stretched
                1.5x horizontally and slanted; Anton has no italic, so the browser synthesises
                the oblique and scale-x-150 reproduces the stretch. Sizes come from the outline
                cap height (161px / 0.87 = 185px). Figma gives ink boxes, CSS positions line
                boxes, so top/left are nudged by Anton's metrics (-10px, -10px at 185px). */}
            <h1
              id="hero-heading"
              className="font-display text-[64px] leading-none text-primary uppercase italic md:contents"
            >
              <span className="block md:absolute md:top-[calc(71*var(--u))] md:left-[calc(28*var(--u))] md:z-0 md:origin-top-left md:scale-x-150 md:text-[calc(185*var(--u))]">
                {line1}
              </span>
              <span className="block md:absolute md:top-[calc(487*var(--u))] md:left-[calc(780*var(--u))] md:z-0 md:origin-top-left md:scale-x-150 md:text-[calc(107*var(--u))]">
                {line2}
              </span>
              <span className="block md:absolute md:top-[calc(816*var(--u))] md:left-[calc(145*var(--u))] md:z-30 md:origin-top-left md:scale-x-150 md:text-[calc(185*var(--u))]">
                {line3}
              </span>
            </h1>

            {/* Architectural wireframe, decorative, bottom-right. Hidden on mobile.
                Browsers still fetch display:none images, so `sizes` tells mobile it is
                1px wide and the browser picks the smallest (16px) candidate instead. */}
            <Image
              src="/images/hero/wireframe.webp"
              alt=""
              width={440}
              height={519}
              sizes="(min-width: 768px) 440px, 1px"
              aria-hidden="true"
              className="hidden md:absolute md:top-[calc(560*var(--u))] md:left-[calc(1000*var(--u))] md:z-10 md:block md:h-auto md:w-[calc(440*var(--u))]"
            />

            {/* Bust: the LCP image, so it gets priority. */}
            <Image
              src={content.bust.src}
              alt={content.bust.alt}
              width={content.bust.width}
              height={content.bust.height}
              priority
              sizes="(min-width: 1440px) 546px, (min-width: 768px) 38vw, 80vw"
              className="mx-auto h-auto w-4/5 max-w-[546px] md:absolute md:top-[calc(173*var(--u))] md:left-[calc(447*var(--u))] md:z-20 md:mx-0 md:w-[calc(546*var(--u))] md:max-w-none"
            />

            {/* Annotations (black Inter text with hand-drawn orange marks). Text sizes are the
                H6/H5/H4 tokens on mobile and the same values in Figma units from md. */}
            <ul className="flex flex-col gap-6 md:contents">
              <li className="relative md:absolute md:top-[calc(438*var(--u))] md:left-[calc(277*var(--u))] md:z-40 md:h-[calc(70*var(--u))] md:w-[calc(188*var(--u))]">
                <Image
                  src="/images/hero/scribble-ellipse.svg"
                  alt=""
                  width={108}
                  height={47}
                  aria-hidden="true"
                  className="hidden md:absolute md:top-[calc(11*var(--u))] md:left-[calc(5*var(--u))] md:block md:h-auto md:w-[calc(108*var(--u))] md:rotate-[6.5deg]"
                />
                <p className="relative font-bold text-h6 uppercase md:absolute md:top-[calc(3*var(--u))] md:left-[calc(15*var(--u))] md:w-[calc(158*var(--u))] md:text-[calc(24*var(--u))]">
                  {strategy}
                </p>
              </li>
              <li className="relative md:absolute md:top-[calc(365*var(--u))] md:left-[calc(1157*var(--u))] md:z-40 md:w-[calc(232*var(--u))]">
                <p className="font-bold text-h5 uppercase md:text-[calc(32*var(--u))]">
                  {comfortable}
                </p>
                <Image
                  src="/images/hero/underline-comfortable.png"
                  alt=""
                  width={176}
                  height={14}
                  aria-hidden="true"
                  className="hidden md:absolute md:top-[calc(67*var(--u))] md:left-0 md:block md:h-auto md:w-[calc(176*var(--u))]"
                />
              </li>
              <li className="relative md:absolute md:top-[calc(584*var(--u))] md:left-[calc(73*var(--u))] md:z-40 md:w-[calc(253*var(--u))]">
                <p className="font-bold text-h4 uppercase md:text-[calc(40*var(--u))] md:whitespace-nowrap">
                  {identity.map((word) => (
                    <span key={word} className="block">
                      {word}
                    </span>
                  ))}
                </p>
                <Image
                  src="/images/hero/underline-motion.svg"
                  alt=""
                  width={124}
                  height={20}
                  aria-hidden="true"
                  className="hidden md:absolute md:top-[calc(120*var(--u))] md:left-0 md:block md:h-auto md:w-[calc(124*var(--u))]"
                />
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
