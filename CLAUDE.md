# Upthrust Take-Home — Responsive Landing Page

This is a take-home assignment for a Junior Software Developer interview at Upthrust.
I (Aaditya) will present this LIVE from my laptop and will be asked to explain, debug,
and modify it on the spot. **Everything you build, I must be able to explain line by line.**
Prefer boring, readable, conventional code over clever code. No magic.

Interview is Saturday 10 Oct 2026, 2:30 PM. Budget: ~4 hours of build time. Ship, don't gold-plate.

## What is being evaluated (from the brief)

1. Accuracy against the supplied Figma design (layout, type, spacing, colours, components, imagery)
2. Quality and structure of the frontend build
3. Responsive behaviour at **375px / 768px / 1440px** — adapt, don't just scale
4. Performance (mobile PageSpeed ≥ 85), accessibility (Lighthouse ≥ 90), technical SEO
5. Working form + conversion tracking + CMS/backend for editable content
6. Code organisation, **meaningful Git history**, live deployment
7. My ability to explain and change it live

## Stack (decided — do not re-litigate)

| Layer        | Choice                                                                                                       | Why (I'll say this in the interview)                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework    | **Next.js (App Router) + TypeScript**                                                                        | SSR/SSG so content is in rendered HTML (SEO req), built-in `next/image` + `next/font`, route handlers for the form API, deploys to Vercel in one click. It's what I use at work. |
| Styling      | **Tailwind CSS**                                                                                             | Fast to match a Figma spec with design tokens in `tailwind.config.ts`; no CSS-in-JS runtime cost.                                                                                |
| CMS          | **Sanity** (free tier)                                                                                       | Hosted Studio a non-developer can use; structured schemas for headline/body/images/testimonials/FAQs/repeated sections; typed GROQ queries; webhooks → ISR revalidation.         |
| Form storage | **Sanity `submission` document** written via a Next.js Route Handler with a server-side write token          | One backend to explain; submissions visible in Studio; token never reaches the browser.                                                                                          |
| Tracking     | **Google Tag Manager** via `@next/third-parties/google`, push `form_submit` to `window.dataLayer` on success | Required event; verifiable with GTM Preview / Tag Assistant.                                                                                                                     |
| Hosting      | **Vercel** (prod) + GitHub                                                                                   | Preview deploys per commit, env vars in dashboard.                                                                                                                               |

If any choice is blocked (e.g. Sanity signup fails), STOP and tell me — don't silently swap.

## Hard requirements checklist (every item must be demonstrable)

### Design fidelity

- Build from `/design/` (exported Figma screenshots, specs, and the asset folder). Ask me if something is missing; don't invent sections.
- Extract exact colours, font families/weights/sizes, spacing, border radii, and breakpoints into `tailwind.config.ts` theme tokens. No arbitrary hex values scattered in components.
- Use the supplied assets as-is. Do not generate new imagery. Convert raster images to WebP/AVIF at correct sizes.

### Responsive

- Mobile-first. Test and screenshot at 375, 768, 1440.
- No horizontal scroll at any width. Nav collapses to an accessible mobile menu if the design shows one.

### Performance

- `next/image` for every image with correct `width`/`height`/`sizes`; `priority` only on the hero LCP image; everything else lazy.
- `next/font` for fonts (self-hosted, `display: swap`). No Google Fonts `<link>`.
- GTM loaded with `@next/third-parties` (loads after hydration). No other third-party scripts.
- Keep client components minimal: only the form, mobile nav, FAQ accordion (if any). Everything else is a Server Component.
- Run Lighthouse (`npx lighthouse <url> --preset=desktop` and mobile) before calling it done; fix anything under target.

### SEO

- Unique `<title>` + meta description via `metadata` export in `app/layout.tsx` / `app/page.tsx`
- Exactly **one `<h1>`**; logical h2/h3 hierarchy matching sections
- `alternates.canonical`, Open Graph title/description/image (1200×630), Twitter card
- JSON-LD `Organization` (+ `FAQPage` if the design has FAQs) rendered in a `<script type="application/ld+json">`
- `robots.txt` and `sitemap.ts` via App Router conventions
- All content server-rendered — verify with `curl` that the HTML contains the hero headline.

### Accessibility

- Semantic landmarks: `<header> <nav> <main> <section aria-labelledby> <footer>`
- Every image has meaningful `alt` (decorative → `alt=""`)
- Every form input has a `<label htmlFor>`; errors use `aria-describedby` + `aria-invalid`; success message in `role="status"`
- All interactive elements keyboard reachable; visible `:focus-visible` ring (don't remove outlines)
- Colour contrast ≥ 4.5:1 for body text — check the Figma palette and flag any failures to me rather than silently changing the design
- Skip-to-content link

### Form & tracking

- Fields and labels exactly as in the design. Required-field validation on client (zod + react-hook-form or plain) AND server.
- `POST /api/submit` route handler: validate with zod → write `submission` doc to Sanity (server token from env) → return JSON.
- Honeypot field + basic rate-limit comment (explain, don't over-engineer).
- On success: clear form, show success state, then `window.dataLayer.push({ event: "form_submit", form_name: "<name>" })`. Only after a 2xx — never on error.
- `src/lib/gtm.ts` with a single typed `pushEvent()` helper so I can show where the event comes from.

### CMS (Sanity)

Schemas in `sanity/schemas/`:

- `siteSettings` (logo, nav links, footer, SEO defaults, OG image)
- `landingPage` with a `sections` array of block types matching the design (hero, features, testimonials, faq, cta, etc.) — this is the "repeated content sections" requirement
- `testimonial`, `faq` as standalone documents referenced from sections
- `submission` (form entries; read-only in Studio)
  Studio mounted at `/studio` (embedded) so I can show a non-dev editing a headline.
  Typed GROQ queries in `src/sanity/queries.ts`; fetch with `next-sanity` and tag-based revalidation (`revalidateTag` via a webhook route at `/api/revalidate` secured by a secret).
  Seed the CMS with the real design copy via a script in `scripts/seed.ts` so the page isn't empty on first deploy.

### Env vars

`.env.example` committed with every key and a comment; `.env.local` git-ignored. Keys:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=          # server-only, used by /api/submit
SANITY_REVALIDATE_SECRET=        # shared secret for /api/revalidate webhook
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_SITE_URL=            # for canonical + OG
```

Never log or print token values. Never read a server-only var in a client component.

## Project structure

```
app/
  layout.tsx          # fonts, GTM, metadata defaults, skip link
  page.tsx            # fetches landingPage, renders <SectionRenderer/>
  robots.ts  sitemap.ts
  api/submit/route.ts
  api/revalidate/route.ts
  studio/[[...tool]]/page.tsx
components/
  layout/   (Header, Footer, MobileNav)
  sections/ (Hero, Features, Testimonials, Faq, Cta ... one file per Sanity block type)
  ui/       (Button, Container, Input ...)
  forms/ContactForm.tsx
lib/   (gtm.ts, utils.ts, validation.ts)
sanity/ (schemas/, client.ts, queries.ts, image.ts)
scripts/seed.ts
design/ (Figma exports — not shipped)
public/
```

## Git discipline (this is graded)

- Init repo first. Commit after every meaningful step with conventional messages:
  `chore: scaffold next + tailwind`, `feat: design tokens from figma`, `feat: hero section`,
  `feat: sanity schemas`, `feat: contact form + /api/submit`, `feat: gtm form_submit event`,
  `perf: image optimisation`, `a11y: focus states and labels`, `docs: readme`
- Small commits. Never squash into one. Never commit `.env.local`.
- I'll push to GitHub myself; don't try to push.

## Build order (follow this; stop and show me after each phase)

1. **Scaffold** — `create-next-app` (TS, Tailwind, App Router, src: no), eslint/prettier, `.env.example`, first commit.
2. **Tokens** — read `/design/`, populate `tailwind.config.ts` (colors, fontFamily, fontSize scale, spacing, radius, screens 375/768/1440), set up `next/font`.
3. **Static sections** — build every section as a Server Component with hardcoded copy from the design. Header/footer/mobile nav. Get it pixel-close at all three widths. Commit per section.
4. **Sanity** — schemas → embedded studio → seed script → swap hardcoded copy for GROQ data. Keep the hardcoded version as fallback content in `lib/fallback.ts` so the page never renders empty.
5. **Form** — component, validation, route handler, Sanity write, success state, `form_submit` push.
6. **SEO + a11y** — metadata, JSON-LD, robots/sitemap, alt/labels/focus audit, skip link.
7. **Perf** — image sizing, lazy loading, Lighthouse runs; fix regressions.
8. **README.md** — short, covering exactly: stack & why, project structure, how to edit content, CMS/backend setup, form handling & tracking, APIs/integrations, AI tools used (Claude Code — say what I reviewed/changed), known limitations / next steps. Plus local run instructions.
9. **Deploy** — I deploy to Vercel; you give me the exact env vars to set and the Sanity CORS origin to add.

## Working style

- Before writing a component, tell me in 2–3 lines what you're doing and why. Keep that habit — it's my interview script.
- When you make a non-obvious decision (e.g. why a component is `"use client"`), leave a one-line comment. I need those for the live Q&A.
- Don't add libraries beyond: `next`, `react`, `tailwindcss`, `next-sanity`, `@sanity/image-url`, `sanity`, `zod`, `react-hook-form` (optional), `@next/third-parties`, `clsx`/`tailwind-merge`. Ask before adding anything else.
- No `any`. Strict TS.
- When done with a phase, list what a reviewer could ask about it and the one-sentence answer.
- If you can't see something in `/design/`, ask — don't guess the design.

## Likely live-change requests (make these easy)

- Edit a headline / swap an image → via Studio, no code
- Add/edit an FAQ → via Studio
- Fix a responsive issue → tokens + Tailwind classes, nothing hidden in global CSS
- Change the form event name or add a param → single edit in `lib/gtm.ts` or `ContactForm.tsx`
- Add a new section type → schema + one component + one line in `SectionRenderer`
