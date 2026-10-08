# Upthrust — landing page

Responsive landing page built from the supplied Figma design for the Upthrust take-home.
Next.js 16 (App Router) + TypeScript + Tailwind v4, content in Sanity, deployed on Vercel.

Screenshots at 375 / 768 / 1440: [`docs/screenshots/`](docs/screenshots). Design extraction notes: [`design/spec.md`](design/spec.md).

## Run locally

```bash
nvm use                     # Node 22 (.nvmrc) — Sanity 6 needs >= 22.12
npm install
cp .env.example .env.local  # fill in the values (see "Environment")
npm run dev                 # http://localhost:3000, Studio at /studio
```

Other scripts: `npm run build` / `start` (production), `lint`, `typecheck`, `format`, `seed` (writes the design copy + images into Sanity).

## Stack and why

| Layer        | Choice                                                 | Why                                                                                                                          |
| ------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| Framework    | Next.js 16 App Router, TypeScript (strict)             | Server-rendered HTML for SEO, `next/image` + `next/font` built in, route handlers for the form API, one-click Vercel deploy. |
| Styling      | Tailwind CSS v4                                        | Design tokens live in one `@theme` block (`app/globals.css`); classes map 1:1 to Figma values; no runtime CSS-in-JS.         |
| CMS          | Sanity (embedded Studio at `/studio`)                  | Structured schemas, a Studio a non-developer can use, typed GROQ queries, webhooks for cache invalidation, free tier.        |
| Form storage | Sanity `submission` documents via a Next route handler | One backend to run and explain; entries are visible in the Studio; the write token stays server-side.                        |
| Tracking     | Google Tag Manager via `@next/third-parties`           | Loads after hydration; a single typed helper pushes `form_submit` to `dataLayer`.                                            |
| Hosting      | Vercel + GitHub                                        | Preview deploy per commit, env vars in the dashboard.                                                                        |

## Project structure

```
app/
  layout.tsx             fonts (Anton, Inter), GTM, metadata defaults, skip link
  page.tsx               fetches content, renders <SectionRenderer/>, generateMetadata
  robots.ts  sitemap.ts
  api/submit/route.ts    POST: validate -> write submission to Sanity
  api/revalidate/route.ts Sanity webhook -> revalidateTag
  studio/[[...tool]]/    embedded Sanity Studio (client boundary)
components/
  layout/    Header, MobileNav (client), Footer
  sections/  Hero, LogoStrip, Services, SectionRenderer — one per Sanity block type
  forms/     NewsletterForm (client)
  seo/       Organization JSON-LD
  ui/        Container, CtaLink, GridBackground
lib/
  content.ts     getContent(): cached Sanity fetch with fallback
  fallback.ts    the design copy, verbatim — served if the CMS is empty/down
  types.ts       content types shared by fallback + CMS mappers
  validation.ts  zod schema (client + server)
  gtm.ts         pushEvent() — the only place analytics events come from
sanity/
  schemas/       siteSettings, landingPage, service, submission + blocks/objects
  queries.ts     GROQ   mappers.ts  raw -> component props   client.ts / server-client.ts
scripts/seed.mts seeds the CMS from lib/fallback.ts
design/          Figma extraction (spec, reference renders) — not shipped
public/images/   optimised assets (WebP/SVG) used as fallbacks and seed sources
```

## Editing content

Open `/studio` (deployed or local) and sign in with a Sanity account that has access to the project.

- **Landing page** → `sections`: reorder, edit or add Hero / Logo strip / Services blocks. The headline, annotations and bust image are fields on the Hero block.
- **Services** → one document per panel (title, lead, bullets, note, bento image, CTA). The Services block references them; drag to reorder.
- **Site settings** → logo, header CTA, footer (wordmark, contact groups, links, socials, legal, newsletter copy), SEO defaults and share image.
- **Form submissions** → read-only list of newsletter sign-ups.

Publishing fires a webhook that revalidates the site within seconds. Anything left empty in the Studio falls back to the original design copy (`lib/fallback.ts`), so the page never renders blank.

Adding a new section type: schema in `sanity/schemas/blocks/`, add it to `landingPage.sections`, a component in `components/sections/`, one `case` in `SectionRenderer.tsx`, and a mapper in `sanity/mappers.ts`.

## CMS / backend setup

1. Create a Sanity project (dataset `production`, public). Add the site origin(s) under **API → CORS origins** with credentials allowed (the embedded Studio needs it).
2. Create an **Editor** token under **API → Tokens** → `SANITY_API_WRITE_TOKEN`.
3. `npm run seed` uploads the images from `public/images` and writes the six documents.
4. Add a webhook under **API → Webhooks**: URL `https://<site>/api/revalidate`, trigger on create/update/delete, dataset `production`, secret = `SANITY_REVALIDATE_SECRET`, projection `{_type}`.

Data flow: `lib/content.ts#getContent()` runs two GROQ queries, maps them to component props and is a Next 16 `"use cache"` function tagged `content` with `cacheLife("max")`. The webhook route verifies the signature with `next-sanity/webhook` and calls `revalidateTag("content", "max")` (stale-while-revalidate).

## Form handling and tracking

The only form in the design is the footer newsletter sign-up (email + consent checkbox).

- `components/forms/NewsletterForm.tsx` validates with the zod schema in `lib/validation.ts`, shows inline errors (`aria-invalid` + `aria-describedby`), posts JSON to `/api/submit`, and on success clears the form, announces "Thanks, you're on the list." in a `role="status"` region, and then calls `pushEvent({ event: "form_submit", form_name: "newsletter" })`.
- `app/api/submit/route.ts` re-validates with the same schema, silently drops submissions with the hidden honeypot field filled, rate-limits to 5 per IP per 10 minutes (in-memory, best effort), and writes a `submission` document with the server-only write token.
- GTM is loaded only when `NEXT_PUBLIC_GTM_ID` is set. Verify with GTM Preview / Tag Assistant or `window.dataLayer` in the console after a successful submit. The event name and parameters live in `lib/gtm.ts`.

## APIs and integrations

| Endpoint / service                    | Purpose                                                     |
| ------------------------------------- | ----------------------------------------------------------- |
| `POST /api/submit`                    | Newsletter form → Sanity `submission`                       |
| `POST /api/revalidate`                | Sanity webhook → cache revalidation (HMAC-verified)         |
| `GET /robots.txt`, `GET /sitemap.xml` | App Router metadata routes                                  |
| `/studio`                             | Embedded Sanity Studio (noindex)                            |
| Sanity Content Lake (`cdn.sanity.io`) | Content + image CDN; `next/image` is allowed to optimise it |
| Google Tag Manager                    | `form_submit` conversion event                              |

## Environment

All keys are documented in [`.env.example`](.env.example). `NEXT_PUBLIC_*` values are safe in the browser; the write token and webhook secret are read only in route handlers and the seed script.

## Deployment (Vercel)

1. Import the GitHub repo. Framework preset: Next.js. Node 22 (default).
2. Set the six environment variables from `.env.example`, with `NEXT_PUBLIC_SITE_URL` = the production URL (no trailing slash). It drives canonical, Open Graph, sitemap and JSON-LD URLs.
3. In Sanity: add the Vercel domain to **CORS origins** (with credentials) and point the webhook at `https://<domain>/api/revalidate`.
4. Redeploy once after the webhook exists; no further deploys are needed for content changes.

## Quality checks

Lighthouse on the production build (`npm run build && npm start`): mobile 94–97 performance, desktop 100; accessibility, SEO and best practices 100; CLS 0. Content is in the server HTML (`curl` shows the `<h1>`), one `<h1>`, landmarks + skip link, all images have real dimensions and alt text, fonts self-hosted with `display: swap`.

## AI tools used

Built with Claude Code as a pair programmer, working phase by phase from a written brief (stack, build order and requirements were decided by me up front). Claude generated the implementation for each phase; I reviewed every commit, tested each phase in the browser at the three breakpoints and in the Studio, and made the calls on the open questions: live Anton text for the outlined headline, all four services rendered as stacked sections, CTAs scrolling to the newsletter form, and keeping the design's placeholder copy verbatim. Figma values were extracted through the Figma MCP server and recorded in `design/spec.md` rather than guessed.

## Known limitations / next steps

- The hero bust, the wireframe sketch and bento cards 2 and 4 are 1× placeholder crops of the Figma render (the Figma export cap was hit); swapping in 2× exports needs no code change.
- The hero headline is live text that reproduces the outlined vectors (Anton, stretched 1.5×, slanted) to within a few pixels, not pixel-identical.
- The design has no tablet/mobile frames; the 768/375 layouts are my adaptation (documented in `design/spec.md` §10).
- Rate limiting is per-instance in memory; a shared store (Vercel KV / Upstash) would make it reliable on serverless.
- Orange on white is 3.48:1 and is only used at ≥24px (large-text AA). The consent text is 9.5px as designed.
- No Sanity TypeGen yet; raw query types are hand-written in `sanity/types.ts`.
