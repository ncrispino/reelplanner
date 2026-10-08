# The rubric

Five measures, each scored 1 to 5, the same for every site and every case study. Fixed before any arm
runs. Each score gets one line of evidence: what you did, and what you saw. Where a measure names this
site's own things (its eras, its albums), read them from `prompt.md`.

The ids in brackets are the keys in `data/judge.json`.

## 1. Does what the prompt asked `[asked]`

List what the prompt asks for first (for the Bob Dylan site: his life and music, the eras, the albums,
the songs, and how they connect). Then look for each one on the site.

- **1:** most of what was asked is missing, or only named.
- **3:** everything asked is there, but some of it is thin, or the connections between things are few.
- **5:** everything asked is there and done well, and the connections work in both directions.

## 2. More engaging than a reference article `[engaging]`

Could you wander sideways, from one thing to a related one, or only read down the page?

- **1:** a long page to read from top to bottom; nothing leads anywhere else.
- **3:** some links sideways, but most paths go down and back up.
- **5:** most things lead to something related; you keep going because you want to.

## 3. Works on a phone `[phone]`

At 390 px wide: no sideways scroll, text readable without zooming, and taps land on what you meant.

- **1:** it scrolls sideways, or something is cut off or can't be reached.
- **3:** it works, but it is cramped, or some targets are small or close together.
- **5:** it feels made for the phone: nothing to pinch, every tap lands.

## 4. Facts right `[facts]`

Ten facts from the site (dates, album titles, places, people), picked before reading the site closely,
each checked against a source you name.

- **5:** all ten right. **4:** nine. **3:** eight. **2:** seven. **1:** six or fewer.

## 5. Easy to change `[change]`

Add one item of the site's main kind (for the Bob Dylan site, one album) without touching code.

- **1:** it takes changes to code in several places.
- **3:** one file to edit, but it is code, or it isn't clear where.
- **5:** add it to a data file, in a shape the site's own notes explain; nothing else changes.
