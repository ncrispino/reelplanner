# Plan: Create a website about Bob Dylan

**Kind:** greenfield · **Repo:** new (`dylan-site`) · **Estimated size:** 6 steps, ~1,200 lines plus content

## Goal

A public website about Bob Dylan that a curious visitor can read for ten minutes and a fan can use as a reference: a short biography by era, a complete album discography with one page per album, a way to browse songs, and a timeline. It must load fast on a phone, work without JavaScript, and be easy to extend with new albums and articles without touching code.

## Why not the obvious approach

The obvious build is a template site: pick a theme, write five pages, publish. We rejected it because:

1. The discography is data, not prose. Dylan has 40 studio albums, 20 live albums, and hundreds of songs. Hand-written pages for those drift out of date and cannot be cross-linked (song → album → era) without a data model.
2. A single long biography page is where most fan sites fail: it reads as a wall of text. The site should be organised by era, with the discography and the timeline as the spine.
3. Client-side rendering costs the visitor on a phone and costs us in search. The content is static; it should ship as HTML.

So the site is a static site generated from structured content: Markdown for prose, one YAML record per album and per song, and templates that build the cross-links.

## Components

- **Content** (`content/`): Markdown articles (biography by era, features), YAML records (`albums/*.yaml`, `songs/*.yaml`, `events/*.yaml`).
- **Data build** (`scripts/build-data.ts`): validates the records and produces a single `site.json` index with cross-links.
- **Site generator** (`src/`): Astro with static output; templates for era, album, song, timeline.
- **Design system** (`src/styles/`): type scale, colours, two layouts (reading, reference).
- **Search** (`src/search/`): a prebuilt index for songs and albums, loaded on demand.
- **Hosting**: static files on a CDN with a build on every push.

## Steps

### Step 1 — Content model and sample records

**What:** Define the YAML shape for albums (`title`, `year`, `type`, `label`, `tracks[]`, `notes`), songs (`title`, `written`, `first_album`, `covers[]`) and timeline events (`date`, `era`, `text`, `sources[]`). Write ten albums, forty songs and thirty events by hand to prove the shape. Add a validator that fails the build on a missing field or a song that names an album that does not exist.

**Why:** Every later step reads this shape. Getting ten real records in first shows where the model is wrong before there are four hundred.

**Alternatives considered:** a headless CMS (adds a service and a login for a site one or two people edit); JSON instead of YAML (harder to edit by hand, and track lists are lists of lists).

**Files:** `content/albums/*.yaml`, `content/songs/*.yaml`, `content/events/*.yaml`, `scripts/validate.ts`

**Risk:** low. **Depends on:** nothing.

### Step 2 — Data build with cross-links

**What:** `build-data.ts` reads every record, resolves references (song → album, album → era, event → era), and writes `site.json` with back-links (album → songs, era → albums and events). Runs before the site build and fails on a broken reference.

**Why:** Cross-links are the point of the reference half of the site; computing them once keeps templates simple and pages consistent.

**Alternatives considered:** resolve links inside templates at render time (each template re-implements the lookup; a broken link shows as an empty page instead of a build error).

**Files:** `scripts/build-data.ts`, `site.json` (generated)

**Risk:** low. **Depends on:** Step 1.

### Step 3 — Site generator and page templates

**What:** Astro project with static output. Templates: home, era (biography prose plus that era's albums and events), album (cover, credits, track list with song links), song (writing notes, first album, notable covers), timeline (all events, filterable by era). Each page is HTML with no required JavaScript.

**Why:** Astro renders to plain HTML by default and lets us add islands of interactivity later without changing the pages.

**Alternatives considered:** Next.js static export (heavier default JavaScript, and most of its features are for apps); Eleventy (fine, but its data cascade makes the cross-links from step 2 awkward to consume).

**Files:** `src/pages/**`, `src/layouts/**`

**Risk:** medium. Template count is the largest chunk of work; the timeline page in particular has no obvious layout.

**Depends on:** Step 2.

### Step 4 — Design system

**What:** A type scale (one serif for reading, one sans for reference tables), a small palette, and two layouts: a reading layout (measure ~65 characters) for eras and features, and a reference layout (full width, tables) for albums, songs and the timeline. Images are served in two sizes with lazy loading.

**Why:** The two halves of the site are read differently; one layout serves neither well.

**Alternatives considered:** a component library (Tailwind UI or similar) — faster to start, harder to make the reading pages feel like a book.

**Files:** `src/styles/**`, `src/components/**`

**Risk:** low. **Depends on:** Step 3.

### Step 5 — Search

**What:** At build time, produce a compact index of albums and songs (title, year, era). The search box loads the index on first focus (about 60 KB) and matches in the browser. No server.

**Why:** A fan looking for one song should not have to browse forty albums; a static index keeps the site serverless.

**Alternatives considered:** a hosted search service (a dependency and a bill for a few hundred records); no search, rely on the site map and browser find (fine for eras, poor for songs).

**Files:** `src/search/index-build.ts`, `src/search/box.ts`

**Risk:** low. **Depends on:** Steps 2, 3.

### Step 6 — Hosting and content workflow

**What:** Build on every push, deploy the static output to a CDN, preview builds for pull requests. Document how to add an album: copy a YAML file, run the validator, open a pull request.

**Why:** The site is only useful if adding content is easier than not adding it.

**Alternatives considered:** manual deploys (nobody does them after the first month).

**Files:** `.github/workflows/deploy.yml`, `CONTRIBUTING.md`

**Risk:** low. **Depends on:** Step 3.

## After this lands

A visitor opens an era, reads a few screens, clicks an album, sees its tracks, clicks a song, and lands on the timeline where it was first performed. Adding an album is one file and one pull request.

## Risks

- Content accuracy: dates and credits for early albums conflict between sources. Every record carries `sources[]`; the validator warns when a record has none.
- Images: album art is copyrighted. Use small thumbnails under fair use with a credit, or none.
- Scope: songs are the long tail (hundreds). Step 1 starts with forty; the site must read as complete with a partial song list.

## Open questions for the reviewer

1. **Step 1 — how much content do we write before launch?**
   - **Ten albums and forty songs, then launch (recommended).** The site is designed to grow; a real launch surfaces what readers want.
   - **All studio albums first.** Forty records before anyone sees the site; a month of data entry with no feedback.
2. **Step 3 — do we include the timeline in the first release?**
   - **Yes, as a simple list by year (recommended).** The data exists from step 1; the page is a list, not a chart.
   - **No, ship eras and albums only.** One fewer template, but the era pages lose their "what else happened" links.
3. **Step 4 — reading design direction?**
   - **Book-like: serif, generous margins, few images (recommended).** Matches the biography half and is cheap to make good.
   - **Magazine: large photography, bold headings.** More striking, but depends on images we may not be allowed to use.
