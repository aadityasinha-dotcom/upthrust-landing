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
