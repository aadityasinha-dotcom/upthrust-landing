# Design spec — Upthrust landing page

Extracted 2026-10-09 via Figma MCP from a duplicate of the supplied file.

- Original (view-only): https://www.figma.com/design/DZEPgdciIEu9de4rAazAT2/Upthrust?node-id=0-1
- Editable copy in Aaditya's drafts (used for extraction): https://www.figma.com/design/RWoGO800ShixImngzEsQNz/Upthrust--Copy-?node-id=0-1
- Reference renders: `homepage-1440.png` (1440×3331, the whole page), `hero-variant-frame-2147257863.png` (a duplicate hero frame left on the canvas — identical content, ignore).
- Raw assets pulled so far: `assets/` (see §9). 229 MB, git-ignored.

> Node IDs below are from the **copy** file (`RWoGO800ShixImngzEsQNz`). Use them with "Select layer → Export" if an asset is missing.

---

## 1. Pages / frames

One page ("Page 1"). Five top-level layers, all **1440 px wide**:

| Layer | Node | Size | What it is |
|---|---|---|---|
| Homepage | `4:4932` | 1440×3331 | **The page to build.** |
| Frame 2147257863 | `1:4907` | 1440×1368 | Duplicate of header+hero+logo strip. Identical. Ignore. |
| Footer | `1:9072` | 1440×900 | Standalone copy of the footer. Same as the one inside Homepage. |
| SERVICES | `4:43` | component set | 4 variants of the services panel (1440×810 each). |
| 3D elements | `1:9240` | section | Source images: the bust ("Futuristic") and the orange curve line. |

**There are no tablet (768) or mobile (375) frames.** Responsive behaviour has to be designed by us (see §10).

## 2. Section order inside Homepage (top → bottom)

| # | Section | Node | y / height | Background |
|---|---|---|---|---|
| 0 | Header | `4:7624` | 0 / 72 | white, sits on the grid |
| 1 | Hero | `4:7632` | 73 / 1079 | white + grid (`4:4933`) |
| 2 | Logo strip ("100+ brands") | `4:10119` | 1153 / 144 | white + grid |
| 3 | Services (one slide placed: "Strategy and Insight") | `4:7621` instance of `4:44` | 1380 / 810 | black + orange 3D curve + faint warped-grid lines |
| — | gap | | 2190 / 163 | black + warped-grid lines (`4:5140`) |
| 4 | Footer | `4:11500` | 2353 / 900 | black |

Light section = 0–1297 px, dark section ("Dark theme" frame `4:5139`) = 1380 → end. Between 1297 and 1380 there is ~83 px of white/grid.

### 2.0 Header (`4:7624`) — 1440×72
- Padding: 72 px left/right, 16 px top/bottom. Flex, space-between, align center.
- Left: logo `assets/header/upthrust-logo.svg` (rocket mark + "Upthrust" wordmark), 156.85×32.
- Right: **"CONTACT US"** — Anton Regular 36 px, line-height 52.2 px, colour `#FE3A00` (⚠ off-token; the token is `#FF4200` — I'll use the token), inside a white box padding 10/20 (198×51). No border, no radius.
- A hidden `dehaze` (hamburger) icon, 48×48 at x=1320, exists in the layer tree but is **not visible** in the render → treat as the mobile-menu affordance. No nav links anywhere in the design, so the mobile menu would only hold "Contact us".

### 2.1 Hero (`4:7632`) — 1440×1079 (composition, absolutely positioned on desktop)
Coordinates are relative to the hero frame (y=0 is just under the header).

| Element | Node | Box (x, y, w, h) | Notes |
|---|---|---|---|
| "BOLD DESIGN" | `4:7634` (vector "bold") | 38, 81, 1363, 161 | **Outlined vector, not text.** Orange `#FF4200`, heavy condensed, slanted (looks like Anton + synthetic italic). |
| "THAT" | `4:7633` (vector) | 796, 494, 294, 92 | same style |
| "PERFORMS" | `4:10109` (vector "perform") | 155, 826, 1130, 161 | same style |
| Bust image | `4:10108` "Futuristic" | 447, 173, 546, 685 | Raster PNG, iridescent bust, transparent bg. Also at `1:7649` in "3D elements". **Not yet downloaded.** |
| Architectural wireframe | `4:7635` "Clip path group" | 1440, 1079 anchor; group 916×720 | 2 470-node SVG, bottom-right, bleeds off-frame. **Not yet downloaded.** |
| "STRATEGY IS / CHEAPER" | `4:10114` | 292, 441, 158, 49 | Inter Bold 24 / 1.33 / −0.48 px, black. Orange hand-drawn ellipse `assets/hero/path59-strategy-scribble.svg` (108×47, rotated 6.5°) around "CHEAPER". |
| "COMFORTABLE / IS EXPENSIVE" | `4:10111` | 1157, 365, 232, 63 | Inter Bold 32 / 1.25 / −1.28 px, black. Orange wavy underline `4:10112` "path56" (172×9) **not yet downloaded**. |
| "IDENTITY · / EXPERIENCE · / MOTION ·" | `4:10117` | 73, 584, 253, 125 | Inter Bold 40 / 1.2 / −1.6 px, black. Orange underline `assets/hero/path70-identity-underline.svg` (124×20) under "MOTION". |
| Frame 2147257861 | `4:10110` | 1155, 432, 214, 69 | Empty/unsupported node under "COMFORTABLE…"; nothing visible. Ignore. |

Hero/page background grid (`4:4933`, 1440×1800, rebuild in CSS):
- Minor lines every **72 px** (both axes), colour `#F2F2F2`.
- Major lines every **288 px** (x = 288, 576, 864, 1152; y = 288, 576, 864, 1152, 1440…), colour `#D9D9D9`.
- Small "+" markers (20×20, `#D9D9D9`) centred on major intersections.

### 2.2 Logo strip (`4:10119`) — 1440×144
- Padding 40 all sides, flex space-between, align center.
- Left block (gap 20): **"100+"** Inter Bold 48 / 1.17 / −1.92 px; **"Brands trusted us to / define how they're seen."** Inter Regular 16 / 1.5 / −0.32 px. Both black.
- Right block: width 1112, flex space-between: zomato, BOSCH, L'ORÉAL, VEGA, DELL, L'ORÉAL (yes, L'Oréal twice — placeholder duplicate; flag).
  Sizes: zomato 152×61, bosch 154×64, loreal 171×73 (svg), vega 118×57, dell 108×33 (png), loreal again.
  zomato/bosch/vega are **mask PNGs filled black** (`assets/logos/*-mask.png`) — use as `<img>` directly (they're black-on-transparent) or as CSS mask.

### 2.3 Services (`4:44`, `4:86`, `4:168`, `4:290`) — 1440×810 each, black
Layout (identical across the 4 variants):
- Panel: 1440×810, `overflow: hidden`, black. Background: `assets/services-1/curve-line-bg.png` (3451×1119 source; placed 4320×1401, vertically centred, shifted per slide: slide1 left 0, slide2 left −1440, slide4 width 4025 top +14.5) + faint warped-grid lines (`4:5140`, decorative, **not downloaded**).
- Content column: padding 80 top/bottom, gap **80** between title block and body row.
- Title block: padding-x **40**. Eyebrow **"WHAT CAN WE DO FOR YOU"** Inter Regular 16 / 1.5 / −0.32 px white. Title Inter **Semi Bold 96 / 1.04 / −5.76 px** white ("Desktop/Special").
- Body row: padding-left **120**, padding-right 40 (slide 1) / 80 (others), gap **160**.
  - Left: **Bento card** 492×332, padding 8, gap 8, radius 8, white (`#FFFFFF`; slide 2 is black) containing a collage of tiles (`#E9E9E9` / `#F9F9F9` tiles, radius 8). Tiles are dozens of nested images → **export each Bento as one flat PNG @2x** (see §9).
  - Right column: width 480, flex column space-between, full height:
    1. Lead sentence — Inter Semi Bold 20 / 1.4 / −0.4 px white.
    2. Bullets (gap 20): 20×20 star icon `assets/services-1/star-icon-figure7.svg` + gap 8 + Inter Semi Bold 20 / 1.4 / −0.4 px white, text width 442.
    3. (slide 4 only) italic note Inter Italic 14 / 1.5 / −0.28 px white.
    4. **"CONTACT"** button: white box, padding 20, text Inter **Bold 32 / 1.25 / −1.28 px**, colour `#FF4200`. No radius.

Copy per slide:

| # | Node | Title | Lead | Bullets |
|---|---|---|---|---|
| 1 | `4:44` | Strategy and Insight | We interrogate what others assume. Then we build the brief behind the brief. | Brand strategy & positioning · Messaging & tone of voice · Audience & competitor research · Workshops & creative sprints |
| 2 | `4:86` | Brand & visual identity | We build systems, not just logos. So you own the category, not just the conversation. | Brand identity & visual language · Guidelines & naming · Illustration & iconography · Brand architecture & systems |
| 3 | `4:168` | Product & digital experience | We design for humans and metrics. So users stay, engage, and come back. | UI/UX & website design · Design systems & prototyping · User research & testing · Motion graphics & micro-interactions |
| 4 | `4:290` | Creative & campaign production | We turn attention into action. Then we prove it worked. | Campaign creative & social content · Presentations & pitch decks · Marketing collateral & ad creative. Plus italic note: "psst.. Also, physical spaces. Because not everything happens on a screen experiential and spatial design for exhibitions, placemaking and branded environments, Just ask." |

Bento nodes: slide1 `4:51`, slide2 `4:93`, slide3 — inside `4:168` (named "Bento"), slide4 `4:297`.

⚠ Only slide 1 is placed in Homepage; there are **no arrows/dots/tabs** anywhere. The variant names ("Slide 16:9 - 7/8/9") suggest a slideshow, but nothing in the design shows navigation. See §11 Q3.

### 2.4 Footer (`4:11500`) — 1440×900, black
- `padding-top: 120`, content bottom-aligned.
- Wordmark row (height ~272, `padding-bottom: 20`, centred, gap 54): **"UPTHRUST"** and **"DESIGN"** — Anton Regular **200 px**, line-height 271.68 px, uppercase, white. Orange rocket-flame mark `assets/footer/rocket-icon-group1000003300.svg` (63×59) sits between the words, overlapping the baseline (at x=717, y=133.6 of the row).
- Then a 450-px tall 2-row grid (rows 258 + 192), `padding-x: 20`, 24-col grid gap 20. Left block spans cols 1–15 with a **1 px white right border**; right block spans cols 16–24. Top row has a **1 px white top border** full width.
  - Top-left (pt 20, pb 64; 3 inner columns gap 20): col 1 → "upthrust.agency ↗" (underlined, 13 px) / 40 px gap / "add description here" (12.7 px white) + "hello@upthrust.agency" (13.2 px `#808080`). col 2 → same with "upthrust.io" / "hello@upthrust.io". col 3 empty.
  - Top-right (pt 19): **the form** — see §7.
  - Bottom-left (pb 20): "Lorem ipsum dolor sit amet consectetur" `#808080` bottom-aligned.
  - Bottom-right (pb 20, column space-between): links row "upthrust.agency ↗  upthrust.io ↗" (gap 20); then "Instagram, LinkedIn" (white 13/14 px); then "Privacy Policy" and "© Upthrust Design" (`#808080` 13.3 px).
- Arrow icon: `assets/footer/arrow-outward.svg` 20×20.
- All footer small text: Inter Regular, 12.7–14 px (messy — **normalise to 13 px and 14 px**), line-height 16.8 px, letter-spacing −0.14 px.

## 3. Colour palette

| Token (Figma) | Hex | Used for |
|---|---|---|
| Primary / Primary-500 (Base) | `#FF4200` | hero headline, CONTACT buttons, underlines, rocket flame |
| Black | `#000000` | dark sections bg, light-section text |
| White | `#FFFFFF` | light bg, dark-section text, button bg |
| — (unnamed) | `#808080` | footer secondary text |
| — | `#E9E9E9` | bento tile bg |
| — | `#F9F9F9` | bento tile bg (alt) |
| — | `#D9D9D9` | hero grid major lines + "+" markers |
| — | `#F2F2F2` | hero grid minor lines |
| ⚠ off-token | `#FE3A00` | header "CONTACT US" only — treat as `#FF4200` |

Contrast (WCAG):
- white/black both ways 21:1 ✅
- `#808080` on black 5.32:1 ✅ (AA normal text)
- `#FF4200` on white **3.48:1** — fails AA for normal text, passes for large text (≥24 px, or ≥18.66 px bold). Every orange-on-white use in the design is ≥32 px, so ✅ **as long as we never shrink CTA text below 24 px on mobile**. Flagging, not changing.
- `#FF4200` on black 6.03:1 ✅

## 4. Typography

Two families:
- **Anton** (Regular 400) — display: header CTA 36 px, footer wordmark 200 px, and (by eye) the outlined hero headline.
- **Inter** — everything else. Weights used: 400, 500 (one footer label), 600, 700, 400 italic.

Figma text styles (letter-spacing given as % in Figma → px here):

| Style | Family / weight | Size | Line-height | Tracking |
|---|---|---|---|---|
| Desktop/Special | Inter 600 | 96 | 1.04 | −5.76 px (−6%) |
| Desktop/H3 | Inter 700 | 48 | 1.17 | −1.92 px (−4%) |
| Desktop/H4 | Inter 700 | 40 | 1.20 | −1.6 px (−4%) |
| Desktop/H5: Bold | Inter 700 | 32 | 1.25 | −1.28 px (−4%) |
| Desktop/H6: Bold | Inter 700 | 24 | 1.33 | −0.48 px (−2%) |
| Desktop/H7 | Inter 600 | 20 | 1.40 | −0.4 px (−2%) |
| Desktop/Body: Medium | Inter 400 | 16 | 1.50 | −0.32 px (−2%) |
| (footer small) | Inter 400 | 13 / 14 | 16.8 px | −0.14 px |
| (footer consent) | Inter 400 | 9.5 | 12 px | 0 |
| (slide 4 note) | Inter 400 italic | 14 | 1.5 | −0.28 px |
| (display CTA) | Anton 400 | 36 | 52.2 px (1.45) | 0 |
| (display wordmark) | Anton 400 | 200 | 271.68 px (1.36) | 0 |

Hero headline is outlined, so size is inferred: cap-height 161 px ≈ Anton at ~200 px, with ~12° synthetic italic. Will tune visually.

## 5. Spacing, radii, grid

Spacing values that actually occur: **8, 10, 12, 14, 16, 20, 40, 54, 64, 72, 80, 120, 160**. Base-8-ish; 20 and 40 are the workhorses.
- Page gutters: header 72; logo strip 40; services title 40; services body 120 left; footer 20.
- Radii: 8 (bento + tiles), ~4 (tiny chips inside bento). **Buttons have 0 radius.**
- Borders: 1 px white in footer grid.
- Footer grid: 24 columns, gap 20, padding-x 20.

## 6. Breakpoints

Only 1440 exists in Figma. Brief requires **375 / 768 / 1440**. Tailwind `screens`: `sm: 375` (implicit base), `md: 768`, `xl: 1440`; design mobile-first.

## 7. Forms

**Exactly one form in the design: the footer newsletter signup** (`4:11552`).

| Field | Node | Design |
|---|---|---|
| Heading | `4:11554` | "Sign up for our emails" — Inter Medium 13.6 px white |
| Consent checkbox | `4:11558` + `4:11564` | 8×10 white-bordered box + text (9.5 px / 12 px): "By checking this box sign up for our newsletter and receive marketing emails and updates on our services. You can unsubscribe at any time." |
| Email input | `4:11566` | placeholder "typehere@youremail.com", `#808080` 13.3 px, **no visible border/box** (just text on black, 16.8 px tall). Width 448. |
| Submit | `4:11572` | plain text "Submit", Inter Regular 13.5 px white, no box |

Gaps: heading → 14 → checkbox row → 12 → input → 10 → Submit.

No contact form exists. "CONTACT" / "CONTACT US" buttons have no defined target.

## 8. Decorative / background assets

| Asset | Node | Status |
|---|---|---|
| Hero grid | `4:4933` | rebuild in CSS (values in §2.1) |
| Orange 3D curve (services bg) | `1:9071` / in each slide | ✅ `assets/services-1/curve-line-bg.png` 3451×1119 |
| Warped grid lines (dark section) | `4:5141` (1440×1152 tile, repeated) | ❌ not downloaded — export as SVG, or drop |
| Bust | `4:10108` / `1:7649` | ❌ not downloaded — export PNG @2x (1092×1370) |
| Architectural wireframe | `4:7635` | ❌ not downloaded — export SVG (or PNG @2x) |

## 9. Asset inventory (`design/assets/`, git-ignored)

- `header/upthrust-logo.svg` — 156.85×32 ✅
- `logos/` — zomato-mask.png, bosch-mask.png, vega-mask.png (black-on-transparent), dell.png, loreal.svg ✅
- `hero/` — path59 (scribble ellipse), path70 (underline) ✅; **missing:** bust, 3 headline outlines (`4:7634`, `4:7633`, `4:10109`), wireframe `4:7635`, path56 `4:10112`
- `services-1/` — curve-line-bg.png, star-icon, 7 bento tile images, slide export 1×, 16 raw images ✅
- `services-2/` — 10 bento internals (no flat export) ⚠
- `services-3/` — slide export 1×, 12 raw + 20 svg + ctx assets ✅ (flat bento needs export)
- `services-4/` — 38 bento internals (no flat export) ⚠
- `footer/` — rocket flame, arrow-outward, checkbox svg, export 1× ✅

### Please export from the copy file (select node → Export panel):
1. `4:10108` Futuristic (bust) → PNG 2× → `design/assets/hero/bust@2x.png`
2. `4:7634`, `4:7633`, `4:10109` → SVG → `hero/headline-bold.svg`, `hero/headline-that.svg`, `hero/headline-performs.svg` (only needed if you want the exact outlines; see Q1)
3. `4:7635` wireframe → SVG (or PNG 2×) → `hero/wireframe.svg`
4. `4:10112` path56 → SVG → `hero/path56-comfortable-underline.svg`
5. Bento cards `4:51`, `4:93`, Bento inside `4:168`, `4:297` → PNG 2× (984×664) → `services-N/bento@2x.png`
6. `4:5141` warped grid tile → SVG → `dark/curve-lines.svg` (optional)

Why: the Figma MCP Starter-plan call limit was hit after ~30 calls; the remaining downloads errored with "You've reached the Figma MCP tool call limit on the Starter plan".

## 10. Responsive plan (my proposal — no mobile frames exist)

- **Header**: same at all widths; at <768 shrink CTA to Anton 24 px (keeps large-text contrast) and tighten gutters to 20.
- **Hero**: desktop keeps the absolute composition inside a 1440-wide, 1079-tall stage, scaled with `clamp()`/viewport units; at 768 reduce headline to ~120 px, keep bust centred, move the three annotations into a row under the headline; at 375 stack: "BOLD DESIGN / THAT / PERFORMS" as three lines, bust below at ~80 % width, annotations as a simple list, wireframe hidden.
- **Logo strip**: 1440 single row; 768 two rows (text block + 3 logos / 3 logos); 375 text block then logos in a 2-col grid (or a horizontal scroll).
- **Services**: 768 → body row stacks (bento full width 492 → 100 %, max 492; text block under it), title 64 px; 375 → title 40 px, bento 100 %, bullets, CTA full width.
- **Footer**: wordmark 200 → 96 (768) → 56 (375) with the flame scaled; grid 15/9 → stacked blocks with the vertical border dropped; keep top border.

## 11. Open questions (answer before Phase 3; Phase 1–2 don't depend on them)

1. **Hero headline**: live text in Anton + synthetic italic (editable in CMS, real `<h1>`, responsive for free, *not* pixel-identical) vs. the exported SVG outlines (exact, but then the `<h1>` is visually hidden and editing the headline in Studio won't change the visual). **I'll default to live text** unless you say otherwise.
2. **Services**: render all four slides stacked vertically as sections (server-rendered, CMS array, matches "repeated content sections"), or a carousel showing one at a time (needs client JS + nav UI the design doesn't have)? **Default: stacked.**
3. **CONTACT / CONTACT US** targets: scroll to the footer signup form? `mailto:hello@upthrust.agency`? Or do you want a proper contact form (name/email/message) added — the brief says "working form", and the only form in the design is a newsletter email + consent. **Default: footer newsletter form is "the form"; CTAs smooth-scroll to it (`#signup`).**
4. **Placeholder copy** ("add description here", "Lorem ipsum…", duplicate L'Oréal logo): keep verbatim for fidelity, or substitute? **Default: keep verbatim, editable in Studio.**
5. **Header colour** `#FE3A00` vs token `#FF4200`: I'll use the token.
6. **Fonts**: Anton and Inter are both on Google Fonts → `next/font/google` (self-hosted at build). OK?
7. **Tailwind v4**: create-next-app now ships Tailwind v4 (CSS-first `@theme` in `globals.css`, no `tailwind.config.ts` by default). CLAUDE.md says tokens go in `tailwind.config.ts`. v4 still supports it via `@config`, but the idiomatic place is `@theme`. **Default: `@theme` block in `app/globals.css`** — same single source of truth, one file to show in the interview. Say if you want the legacy config file instead.
8. **Next 16 `cacheComponents`**: the scaffold enables it by default. It changes how dynamic data + revalidation work (`"use cache"` + `cacheTag`). I'll read the bundled docs before Phase 4 and either use it or switch it off for a plainer ISR story.
