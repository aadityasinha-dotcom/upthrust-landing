import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { FooterContent } from "@/lib/types";

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

// Footer: giant Anton wordmark, then a 24-column grid (15 | 9) with 1px white rules.
// The wordmark is sized in container-query units so it stays one line at every width
// (200px at 1440 -> 13.9cqw). The newsletter form is static markup here; Phase 5
// turns it into the working ContactForm.
export function Footer({ content }: { content: FooterContent }) {
  const [word1, word2] = content.wordmark;
  return (
    <footer className="bg-black pt-16 text-white md:pt-30">
      <Container className="@container">
        <p className="relative flex items-end justify-center gap-[3.75cqw] pb-5 font-display text-[13.9cqw] leading-[1.36] uppercase">
          <span>{word1}</span>
          <Image
            src="/images/icons/flame.svg"
            alt=""
            width={67}
            height={63}
            aria-hidden="true"
            className="absolute top-[49%] left-[49.8%] h-auto w-[4.6cqw]"
          />
          <span>{word2}</span>
        </p>

        <div className="border-t border-white px-5">
          {/* Row 1: contact groups | newsletter */}
          <div className="grid gap-x-5 md:min-h-[258px] md:grid-cols-24">
            <div className="grid gap-10 pt-5 pb-10 md:col-span-15 md:grid-cols-3 md:gap-x-5 md:border-r md:border-white md:pb-16">
              {content.groups.map((group) => (
                <div key={group.link.label} className="flex flex-col gap-10">
                  <Link
                    href={group.link.href}
                    className={`inline-flex items-start gap-[3px] self-start text-small underline ${focusRing}`}
                  >
                    {group.link.label}
                    <Image
                      src="/images/icons/arrow-outward.svg"
                      alt=""
                      width={20}
                      height={20}
                      aria-hidden="true"
                    />
                  </Link>
                  <div className="flex flex-col">
                    <p className="text-small">{group.description}</p>
                    <a
                      href={`mailto:${group.email}`}
                      className={`text-small text-muted ${focusRing}`}
                    >
                      {group.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-5 pb-10 md:col-span-9 md:pt-[19px]">
              <form id="signup" aria-labelledby="signup-heading" className="flex flex-col gap-3.5">
                <h2 id="signup-heading" className="font-medium text-small">
                  {content.newsletter.heading}
                </h2>
                <div className="flex items-start gap-2">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    className={`mt-px size-2.5 shrink-0 appearance-none border border-white checked:bg-white ${focusRing}`}
                  />
                  <label htmlFor="consent" className="text-fine">
                    {content.newsletter.consent}
                  </label>
                </div>
                <div className="flex flex-col items-start gap-2.5">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder={content.newsletter.placeholder}
                    className={`w-full max-w-md bg-transparent text-small placeholder:text-muted ${focusRing}`}
                  />
                  <button type="submit" className={`text-small ${focusRing}`}>
                    {content.newsletter.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Row 2: tagline | links, socials, legal */}
          <div className="grid gap-x-5 md:min-h-[192px] md:grid-cols-24">
            <div className="flex items-end pb-5 md:col-span-15 md:border-r md:border-white">
              <p className="text-small text-muted">{content.tagline}</p>
            </div>
            <div className="flex flex-col justify-between gap-10 pb-5 md:col-span-9">
              <ul className="flex gap-5">
                {content.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`inline-flex items-start gap-[3px] text-small underline ${focusRing}`}
                    >
                      {link.label}
                      <Image
                        src="/images/icons/arrow-outward.svg"
                        alt=""
                        width={20}
                        height={20}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-[15px]">
                <p className="text-small">
                  {content.socials.map((social, i) => (
                    <span key={social.label}>
                      {i > 0 && ", "}
                      <Link href={social.href} className={focusRing}>
                        {social.label}
                      </Link>
                    </span>
                  ))}
                </p>
                <ul className="flex flex-col text-small text-muted">
                  {content.legal.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={focusRing}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>{content.copyright}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
