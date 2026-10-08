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
