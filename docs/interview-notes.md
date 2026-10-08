# Interview notes — questions a reviewer may ask, phase by phase

One-sentence answers I can expand on live. Kept in sync as each phase lands.

## Phase 1 — Scaffold

- **Why Next.js 16 App Router?** Server-rendered HTML for SEO, built-in image and font optimisation, route handlers for the form API, one-click Vercel deploy.
- **Why TypeScript strict?** Catches shape mismatches between CMS data and components at build time instead of in the browser.
- **Why is `.env*` ignored but `.env.example` tracked?** The scaffold ignores every env file; the `!.env.example` negation re-adds the documented template so secrets never land in git.
- **Why Node 22 (`.nvmrc`)?** Sanity 6 requires >= 22.12; Next 16 needs >= 20.9; Vercel builds on 22 by default.
- **What does `eslint-config-prettier` do?** Disables ESLint's formatting rules so Prettier is the only formatter and the two never fight.
- **What is `cacheComponents` in `next.config.ts`?** Next 16's caching model (enabled by the scaffold). It changes how dynamic data and revalidation work; decided in Phase 4 after reading the bundled docs.
- **Why was the scaffold generated in a temp dir and copied in?** `create-next-app` refuses a non-empty directory (CLAUDE.md and design/ already existed).

## Phase 2 — Design tokens + fonts

- **Why `@theme` in `globals.css` and not `tailwind.config.ts`?** Tailwind v4 is CSS-first; the JS config is a legacy compatibility path. One CSS block is the single source of truth.
- **Why `@theme inline`?** Font tokens reference CSS variables that `next/font` sets on `<html>`. Inline substitutes values into utilities instead of pointing at a root variable that might not resolve.
- **Why are colours role-named (`primary`, `muted`, `grid`) instead of `orange-500`?** The design has five greys with distinct jobs; naming by job makes a class readable and lets a value change in one place.
- **Why one `text-h5` utility instead of `text-[32px] leading-[1.25] tracking-[-0.04em]`?** Each Figma text style becomes one token so size, line-height and tracking can't drift apart.
- **Why is letter-spacing in em, not px?** Figma defines it as a % of font size; em keeps it correct when the size shrinks on mobile.
- **Why were Tailwind's default breakpoints removed?** The brief grades 375/768/1440. Only `md`/`lg`/`xl` exist, so nobody can reach for `sm:` or `2xl:` and the responsive story stays auditable. 375 is the unprefixed mobile-first base.
- **Where are the fonts served from at runtime?** Nowhere external. `next/font` downloaded Anton and Inter at build time; the CSS has `@font-face` rules pointing at hashed woff2 files under `/_next/static/media`, with `display: swap` and a size-adjusted fallback to avoid layout shift.
- **Why no custom spacing scale?** Tailwind v4 spacing is 4px-based, so every Figma value maps directly (72 = `p-18`, 120 = `pl-30`, 160 = `gap-40`).
- **Why was the scaffold's dark-mode block deleted?** The design has no dark mode; leaving `prefers-color-scheme` would flip the page black for users with a dark OS theme.

## Phase 3 — Static sections

- **How is the hero responsive when Figma only has a 1440 frame?** From `md` up the stage keeps the 1440:1079 aspect ratio and defines one unit, `--u: calc(100cqw / 1440)` = "one Figma pixel at the current width". Every coordinate is `calc(<figma px> * var(--u))`, so the Figma numbers stay readable in the classes. Below `md` the same elements flow in a normal column. No duplicated markup, one `<h1>`.
- **Why not `transform: scale(100cqw / 1440)`?** That was the first attempt and it silently failed at 768: a length divided by a number is still a length, and `scale()` needs a unitless number, so the browser dropped the transform. Multiplying a length unit by numbers is always valid.
- **Why is the headline live text when Figma has outlined vectors?** SEO needs a real `<h1>`, the CMS needs to edit it, and it must reflow on mobile. Canvas `measureText` showed the outlines are Anton with caps at 161px (=185px font) stretched 1.5× horizontally and slanted, so `scale-x-150` + synthetic italic reproduces them within a few pixels.
- **Why `scale-x-150` and not a wider font?** It's what the designer did: the outline widths are 1.50–1.53× Anton's at the same cap height for all three lines.
- **Why are the hero positions "off" by 10px from Figma?** Figma gives ink boxes; CSS positions line boxes. Anton's ascent/descent (218/61 at 185px) put the cap top 10px below the line-box top, so the offsets compensate.
- **Why are all four services rendered when Figma shows one?** The component set has four variants and no carousel controls. Stacking keeps everything server-rendered, needs no JS, and maps 1:1 to a CMS array ("repeated content sections").
- **What's the only client component so far?** `MobileNav` (menu open/closed state). Everything else is a Server Component.
- **Where does the hero grid come from?** One SVG `<pattern>` (72px minor, 288px major, "+" markers) instead of 97 Figma vector layers; colours are tokens.
- **Why did the CTA text disappear during the build?** `tailwind-merge` doesn't know custom `text-h5` tokens and treated them as colours, dropping `text-primary`. Fixed by registering the tokens via `extendTailwindMerge` in `lib/utils.ts`.
- **Why do the hero images come from `/public` and not the CMS?** Phase 3 is static; Phase 4 moves editable images (bust, bentos) to Sanity. Decorative marks (grid, scribbles, curve) stay static.
- **Which images are placeholders?** Bust, wireframe and bento 2/4 (Figma call cap). Same file paths, so swapping the export in needs no code change.
- **How is the footer wordmark always one line?** Sized in container-query units: 200px at 1440 = 13.9cqw; the flame is positioned in % of the row.
- **Why `lg` for the services side-by-side layout, not `md`?** A 492px card plus 480px text column doesn't fit in 768 minus gutters; it was clipping at 768.
- **Why `priority` only on the bust?** It's the largest above-the-fold image (LCP candidate); everything else lazy-loads by default.

## Phase 4 — Sanity CMS

- **Why Sanity?** Hosted Studio a non-developer can use, structured schemas, typed GROQ queries, free tier, webhooks for cache invalidation, and it embeds inside the Next app at `/studio` so there is one deploy.
- **How does content reach the page?** `lib/content.ts#getContent()` runs two GROQ queries (`sanity/queries.ts`), maps the raw documents to the component types (`sanity/mappers.ts`) and falls back to `lib/fallback.ts` for anything missing. `page.tsx` hands `page.sections` to `SectionRenderer`.
- **What is `"use cache"` doing in `getContent`?** Next 16 Cache Components: the result is cached, tagged `content`, and `cacheLife("max")` keeps it until the tag is revalidated. The home page is a static shell (build output shows `○ /  30d  1y`).
- **How does a Studio edit reach production?** Publishing fires a Sanity webhook to `POST /api/revalidate`. `parseBody` from `next-sanity/webhook` verifies the HMAC signature with `SANITY_REVALIDATE_SECRET`, then `revalidateTag("content", "max")` marks the cache stale: the next visitor gets the stale page while fresh content is fetched (stale-while-revalidate).
- **Why `revalidateTag(tag, "max")` with a second argument?** The one-argument form is deprecated in Next 16; `"max"` is the documented recommendation for CMS content.
- **Why one cache tag instead of per-type tags?** One page, five documents: purging everything is simpler to reason about and costs one refetch.
- **What happens if Sanity is down or empty?** `getContent` catches and returns the hardcoded design copy; the mappers also fill missing fields per-field. The page never renders empty.
- **Why do components never import Sanity types?** Components take the `lib/types.ts` shapes. Swapping the CMS later means rewriting `sanity/mappers.ts` only.
- **What are singletons and how are they enforced?** `siteSettings` and `landingPage` exist once: fixed `_id`s, pinned in the Studio sidebar, removed from "Create new", and only publish/discard actions allowed (`sanity.config.ts`).
- **How is "repeated content sections" modelled?** `landingPage.sections[]` is an array of block types (hero, logo strip, services); the services block references `service` documents, so reordering or adding a service is drag-and-drop in the Studio.
- **Why is the Studio page a `"use client"` wrapper?** Importing `sanity.config.ts` in a Server Component pulled the `sanity` package into the RSC graph, where `swr`'s `react-server` build has no default export and the build failed. The client boundary keeps it in the browser bundle.
- **How are seeded images handled?** `scripts/seed.mts` uploads the files from `/public` as Sanity assets (de-duplicated by content hash) and references them; the queries flatten each to `{src, width, height, alt}` from the asset metadata so `next/image` gets real dimensions. `next.config.ts` allows `cdn.sanity.io`.
- **Why `.mts` and `--experimental-strip-types` for the seed?** No extra dependency (no ts-node/tsx): Node 22 strips types natively; `.mts` makes it ESM without changing the project's module type.
- **Why is `submission` read-only in the Studio?** Only the server route writes it with the write token; editors can review entries but not forge or alter them.
- **Where is the write token used?** Only in `scripts/seed.mts` (local) and, in Phase 5, `app/api/submit/route.ts`. It is never imported by a client component and never logged.

## Phase 5 — Form + tracking

- **Where does the form submit to?** `POST /api/submit` (`app/api/submit/route.ts`). It re-validates with the same zod schema as the client, drops honeypot hits, applies a best-effort rate limit, and creates a `submission` document in Sanity with the server-side write token.
- **Why validate on both sides?** Client-side for instant feedback; server-side because the client can be bypassed with curl. One schema in `lib/validation.ts` means they can't drift.
- **How does the honeypot work?** A hidden `website` input (`display:none`, `tabindex=-1`, `aria-hidden`). Humans never fill it; bots that auto-fill every field do. The server answers `{ok: true}` without saving so the bot learns nothing.
- **How does the rate limit work and what's its weakness?** 5 requests per IP per 10 minutes in an in-memory Map. On serverless each instance has its own map, so it only blunts naive abuse. The honeypot and validation do the real work; a shared store (KV/Upstash) is the upgrade path.
- **Where is the write token read?** Only in `sanity/server-client.ts`, called from the route handler. It is never imported by a client component, never in `NEXT_PUBLIC_*`, never logged.
- **When exactly is the `form_submit` event pushed?** In `NewsletterForm` after a 2xx response, after the form is cleared and the success message is set. Never on validation or network errors. The helper is `lib/gtm.ts#pushEvent`, the only place events come from.
- **How would you rename the event or add a parameter?** Edit the `GtmEvent` type and `pushEvent` call: one file for the helper, one line in the form.
- **How is GTM loaded?** `@next/third-parties` `GoogleTagManager` in `app/layout.tsx`, rendered only when `NEXT_PUBLIC_GTM_ID` is set. It injects `gtm.js` after hydration so it never competes with the page's own load.
- **How do you verify tracking?** GTM Preview / Tag Assistant, or `window.dataLayer` in the console: after a successful submit it contains `{event: "form_submit", form_name: "newsletter"}`.
- **Accessibility of the form?** Real `<label>`s (the email one is visually hidden to match the design), `aria-invalid` + `aria-describedby` on invalid fields pointing at the error text, success/error in `role="status" aria-live="polite"`, visible focus rings, submit disabled while in flight.
- **Why is the form a client component?** It holds state (values, errors, status) and calls `fetch`. It's one of three client components on the page (mobile nav, form, Studio).
- **Why no react-hook-form?** Three fields; `useState` is simpler to read and explain. The option was left open in CLAUDE.md.
