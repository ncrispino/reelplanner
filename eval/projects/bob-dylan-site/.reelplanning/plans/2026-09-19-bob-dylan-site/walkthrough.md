# Walkthrough: Create a website about Bob Dylan

**Status:** implemented on branch `dylan-site/initial` · **Plan:** `plan.md` · **Decisions taken:** Q1 = ten albums then launch · Q2 = timeline as a list · Q3 = book-like

This is the report the agent writes after implementing. The walkthrough video is built from it (style guide §13). Everything here is hypothetical: it shows the format.

## What was done, per step

### Step 1 — Content model and sample records ✅

Ten albums, 43 songs and 31 events written. `scripts/validate.ts` checks required fields and references; the build fails on a broken reference. Example: `content/songs/like-a-rolling-stone.yaml` names `first_album: highway-61-revisited`, which resolves.

### Step 2 — Data build ✅

`site.json` is 84 KB with 10 albums, 43 songs, 31 events and their back-links. Build time 120 ms.

### Step 3 — Site generator ✅ (one deviation)

Templates for home, era, album, song and timeline. **Deviation:** the plan said the timeline page would be "filterable by era"; the first release filters by decade instead, because eras overlap years and the filter read as broken. Recorded below as autonomy A2.

### Step 4 — Design system ✅

Serif reading layout at 65-character measure, sans reference layout, two image sizes, lazy loading. Lighthouse on a phone profile: performance 98, accessibility 100.

### Step 5 — Search ✅

Index is 41 KB gzipped; loads on first focus; matches on title and year.

### Step 6 — Hosting ✅

Deploy on push to `main`, preview builds for pull requests, `CONTRIBUTING.md` with the add-an-album recipe.

## Choices the plan did not specify (autonomy)

| id | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| A1 | 1 | album `type` is an enum: `studio`, `live`, `compilation`, `bootleg` | free text | four values cover the catalogue; the validator can reject typos | `scripts/validate.ts` line 22 |
| A2 | 3 | timeline filter by decade | by era, as the plan said | eras overlap years (1965–66 sits in two), so an era filter showed the same event twice | open `/timeline` and switch decades |
| A3 | 4 | one serif (Source Serif) shipped as WOFF2, no web-font for the sans (system stack) | two web fonts | saves 90 KB and a flash of unstyled text on the reference pages | view source of any album page |
| A4 | 5 | search matches from the third character | from the first | one- and two-character queries matched half the index | type "bl" then "blo" in the search box |

## Deviations from the plan or the decisions

- Step 3: timeline filter by decade, not era (A2).
- Step 1: 43 songs, not 40; three were needed to make the sample albums' track lists complete.

## Evidence

- `npm test`: 38 passing (validator, data build, search index).
- Lighthouse phone profile on `/albums/highway-61-revisited`: 98 / 100 / 100 / 100.
- Build: 4.1 s; deploy preview: https://preview-example.invalid/pr-1

## Not done / not tested

- No visual regression tests; the design was checked by eye on two phones and one laptop.
- Album art: thumbnails omitted pending a decision on rights.

## Quiz (for the walkthrough video)

| id | after step | question | options | answer | explain |
|---|---|---|---|---|---|
| K1 | 2 | A song's YAML names an album that does not exist. What happens? | a) the song page shows an empty album link · b) the build fails · c) the song is skipped | b | the data build resolves every reference and fails on a broken one, so the mistake never reaches a visitor |
| K2 | 5 | Where does search run? | a) on a server · b) in the browser, from a prebuilt index · c) in the build only | b | the index is built at deploy time and loaded on first focus; no server is involved |
