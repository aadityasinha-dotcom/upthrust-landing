import Image from "next/image";
import { Container } from "@/components/ui/Container";
import type { HeroContent } from "@/lib/types";

// The hero is a fixed composition in Figma (1440x1079, everything absolutely placed).
// From md up we keep it as a 1440x1079 "canvas" and scale the whole canvas to the
// container width with one transform (100cqw / 1440), so every Figma coordinate is
// used as-is. Below md the same elements flow normally in a column.
// Layer order from Figma (bottom -> top): "THAT"/"BOLD DESIGN" < wireframe < bust < "PERFORMS" < annotations.
export function Hero({ content }: { content: HeroContent }) {
  const [line1, line2, line3] = content.headlineLines;
  const { strategy, comfortable, identity } = content.annotations;

  return (
    <section aria-labelledby="hero-heading" className="relative">
      <Container className="@container">
        <div className="relative md:aspect-[1440/1079] md:overflow-hidden">
          <div className="flex flex-col gap-8 px-5 pt-6 pb-10 md:absolute md:top-0 md:left-0 md:block md:h-[1079px] md:w-[1440px] md:origin-top-left md:p-0 md:[transform:scale(calc(100cqw/1440))]">
            {/* Headline: three visual lines, one h1. The Figma outlines are Anton stretched
                1.5x horizontally and slanted; Anton has no italic, so the browser synthesises
                the oblique and scale-x-150 reproduces the stretch. Sizes come from the outline
                cap height (161px / 0.87 = 185px). Figma gives ink boxes, CSS positions line
                boxes, so top/left are nudged by Anton's metrics (-10px, -10px at 185px). */}
            <h1
              id="hero-heading"
              className="font-display text-[64px] leading-none text-primary uppercase italic md:contents"
            >
              <span className="block md:absolute md:top-[71px] md:left-[28px] md:z-0 md:origin-top-left md:scale-x-150 md:text-[185px]">
                {line1}
              </span>
              <span className="block md:absolute md:top-[487px] md:left-[780px] md:z-0 md:origin-top-left md:scale-x-150 md:text-[107px]">
                {line2}
              </span>
              <span className="block md:absolute md:top-[816px] md:left-[145px] md:z-30 md:origin-top-left md:scale-x-150 md:text-[185px]">
                {line3}
              </span>
            </h1>

            {/* Architectural wireframe, decorative, bottom-right. Hidden on mobile. */}
            <Image
              src="/images/hero/wireframe.webp"
              alt=""
              width={440}
              height={519}
              aria-hidden="true"
              className="hidden md:absolute md:top-[560px] md:left-[1000px] md:z-10 md:block"
            />

            {/* Bust: the LCP image, so it gets priority. */}
            <Image
              src={content.bust.src}
              alt={content.bust.alt}
              width={content.bust.width}
              height={content.bust.height}
              priority
              sizes="(min-width: 1440px) 546px, (min-width: 768px) 38vw, 80vw"
              className="mx-auto w-4/5 max-w-[546px] md:absolute md:top-[173px] md:left-[447px] md:z-20 md:mx-0 md:w-[546px] md:max-w-none"
            />

            {/* Annotations (black Inter text with hand-drawn orange marks) */}
            <ul className="flex flex-col gap-6 md:contents">
              <li className="relative md:absolute md:top-[438px] md:left-[277px] md:z-40 md:h-[70px] md:w-[188px]">
                <Image
                  src="/images/hero/scribble-ellipse.svg"
                  alt=""
                  width={108}
                  height={47}
                  aria-hidden="true"
                  className="hidden md:absolute md:top-[11px] md:left-[5px] md:block md:rotate-[6.5deg]"
                />
                <p className="relative font-bold text-h6 uppercase md:absolute md:top-[3px] md:left-[15px] md:w-[158px]">
                  {strategy}
                </p>
              </li>
              <li className="relative md:absolute md:top-[365px] md:left-[1157px] md:z-40 md:w-[232px]">
                <p className="font-bold text-h5 uppercase">{comfortable}</p>
                <Image
                  src="/images/hero/underline-comfortable.png"
                  alt=""
                  width={176}
                  height={14}
                  aria-hidden="true"
                  className="hidden md:absolute md:top-[67px] md:left-0 md:block"
                />
              </li>
              <li className="relative md:absolute md:top-[584px] md:left-[73px] md:z-40 md:w-[253px]">
                <p className="font-bold text-h4 uppercase">
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
                  className="hidden md:absolute md:top-[120px] md:left-0 md:block"
                />
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
