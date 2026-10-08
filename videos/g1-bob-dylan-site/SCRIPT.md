# SCRIPT — g1-bob-dylan-site (v2, three parts)

**Voice:** am_michael (Kokoro, local; sped ×1.25 after synthesis)
**Voice settings:** default
**Voice direction:** Plain and even. A good teacher explaining a plan to a peer: one idea per sentence, an example for every mechanism, a comparison for every choice.

---

## Line 1 — A site about Dylan is a data problem (Frame 1)

**Time:** 0.0 – 7.0s
**Delivery:** Plain.

    Bob Dylan has forty studio albums and about six hundred songs. A website about him is mostly a data problem: write the pages by hand, and they are wrong in a month.

## Line 2 — The template site, as a page (Frame 2)

**Time:** 7.0 – 15.0s
**Delivery:** Plain.

    The obvious build is a template site: five pages, the biography as one long wall of text, and no link from a song to its album or its year.

## Line 3 — Six parts (Frame 3)

**Time:** 15.0 – 23.0s
**Delivery:** Plain.

    The plan has six parts: content files, a data build that checks and links them, a generator that makes the pages, a search index, hosting, and a design system.

## Line 4 — Step 1: the content model (Frame 4)

**Time:** 23.0 – 34.0s
**Delivery:** Plain.

    Step one, the content model. One file per album, song and event. A song file names its album, and a validator fails the build if that album does not exist. Not a CMS: this site has two editors.

## Line 5 — How much content before launch? (Frame 5)

**Time:** 34.0 – 46.0s
**Delivery:** Plain.

    First choice: how much content before launch? Ten albums: we launch in two weeks and learn what readers open. All forty: a month of data entry before anyone sees the site. I recommend ten. Which do you want?

## Line 6 — If ten albums first (Frame 6)

**Time:** 46.0 – 51.0s
**Delivery:** Plain.

    With ten albums, steps two to six start next week.

## Line 7 — If all studio albums first (Frame 7)

**Time:** 51.0 – 56.0s
**Delivery:** Plain.

    With all forty, every later step waits about a month.

## Line 8 — Next: part two (Frame 8)

**Time:** 56.0 – 60.0s
**Delivery:** Plain.

    Next, part two: the data build and the generator.

## Line 9 — Part two: steps 2 and 3 (Frame 9)

**Time:** 60.0 – 64.0s
**Delivery:** Plain.

    Part two of three. Ten albums is banked, and everything from here reads from those files.

## Line 10 — Step 2: the data build (Frame 10)

**Time:** 64.0 – 76.0s
**Delivery:** Plain.

    Step two, the data build. It reads every file, follows every reference, and writes one index: site.json. An album knows its songs; an era knows its albums and events. A song that names a missing album fails the build here, not on a visitor's screen.

## Line 11 — Quick check (Frame 11)

**Time:** 76.0 – 83.0s
**Delivery:** Plain.

    Quick check. A song names an album that does not exist. Empty link, build fails, or song skipped?

## Line 12 — Step 3: the generator (Frame 12)

**Time:** 83.0 – 94.0s
**Delivery:** Plain.

    Step three, the generator. It turns site.json into pages: one per era, one per album, one per song, and a timeline. Every page is plain HTML, so a phone needs no JavaScript to read it. We use Astro; Next.js would ship JavaScript the site does not need.

## Line 13 — Timeline in the first release? (Frame 13)

**Time:** 94.0 – 105.0s
**Delivery:** Plain.

    Second choice: is the timeline in the first release? As a list by year, it is one template, and the events already exist. Without it, the era pages lose their links to the years around an album. I recommend the list. Which do you want?

## Line 14 — If the timeline ships (Frame 14)

**Time:** 105.0 – 110.0s
**Delivery:** Plain.

    With the timeline, every era page links to its years.

## Line 15 — If the timeline waits (Frame 15)

**Time:** 110.0 – 115.0s
**Delivery:** Plain.

    Without it, the generator has three page kinds, and the eras stand alone.

## Line 16 — Next: part three (Frame 16)

**Time:** 115.0 – 119.0s
**Delivery:** Plain.

    Next, part three: design, search, hosting, and the plan resolved.

## Line 17 — Part three: steps 4 to 6 (Frame 17)

**Time:** 119.0 – 123.0s
**Delivery:** Plain.

    Part three of three. The timeline is in, and now the pages need a look.

## Line 18 — Step 4: the design system (Frame 18)

**Time:** 123.0 – 133.0s
**Delivery:** Plain.

    Step four, the design system. Two kinds of page: a biography, read like a book in one narrow column; and an album page, a reference, full width with a table of tracks. One serif, one sans, images in two sizes.

## Line 19 — Book-like or magazine? (Frame 19)

**Time:** 133.0 – 146.0s
**Delivery:** Plain.

    Third choice: the look of the reading pages. Here they are side by side. Book-like: a serif, wide margins, few images; cheap to do well. Magazine: big photographs and bold headings; striking, but the photographs are copyrighted, and we may not be allowed to use them. I recommend book-like. Which do you want?

## Line 20 — If book-like (Frame 20)

**Time:** 146.0 – 151.0s
**Delivery:** Plain.

    Book-like: one serif face, wide margins, and no photographs to clear.

## Line 21 — If magazine (Frame 21)

**Time:** 151.0 – 156.0s
**Delivery:** Plain.

    Magazine: big photographs on every page, and a rights check before launch.

## Line 22 — Step 5: search (Frame 22)

**Time:** 156.0 – 165.0s
**Delivery:** Plain.

    Step five, search. The build writes a small index, about sixty kilobytes, and the browser loads it the first time you click the search box. No search server.

## Line 23 — Step 6: hosting (Frame 23)

**Time:** 165.0 – 173.0s
**Delivery:** Plain.

    Step six, hosting. Push to main and the site builds and deploys; a pull request gets a preview link. Adding an album is one file.

## Line 24 — The plan, resolved (Frame 24)

**Time:** 173.0 – 183.0s
**Delivery:** Plain.

    That is the plan, with your three choices. Draw on any step to ask for a change, or approve it.
