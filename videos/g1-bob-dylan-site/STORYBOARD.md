---
title: "Create a website about Bob Dylan"
format: 1920x1080
duration: 180s
message: "A Dylan site is a data problem first: structured albums and songs, then pages"
arc: how-to-process with decisions, in three parts
audience: the person approving the plan before any code is written
mode: autonomous
music: none
plan_dir: eval/projects/bob-dylan-site/.reelplanning/plans/2026-09-19-bob-dylan-site
---

## Video direction

- a SERIES OF THREE PARTS (style guide §16): each part opens on the stage as resolved so far and closes by naming the next part; parts are cut from the chapters (`chapter_start` on frames 1, 9, 17). One sitting is 60–75 s.
- palette system (from `frame.md`): cream ground, ink voice, coral as the single signal per frame (the lit node border, OR the lit edge, OR the recommended prototype's border, OR one small tag in #A5614A). Navy only for the Content node. The ✱ kicker mark, caption underline and option letters are ink.
- the stage: `.hyperframes/stage-snippet.html` — six-slot rail left, six-node diagram right, fixed positions. Built in frame 3, reused unchanged after. Nodes are a title only; one mono chip (≥ 26 px) below a node is the worked example. Edges are inherited from the steps so far (dim), never front-loaded.
- PROTOTYPES (§16): frames 2, 5, 13 and 19 show the thing itself as a page mock built from real HTML at a readable size, not a card about it. Two prototypes side by side at equal size; the recommended one bordered coral; the reviewer chooses between them.
- decision beats: the affected slot and node lit; the player pauses on the last frame and asks. Quick check (frame 11): a question card and three chips, none marked.
- motion grammar: power3 settles, reveal on the spoken cue, held read at the end; the final frame holds still ≥ 4 s.
- negative list: no gradients/glows/tilt/bokeh/music; no front-loading; no second coral; no pictograms; nothing below y 900.


## Frame 1 — A site about Dylan is a data problem

- chapter_start: The problem and step 1
- scene: Centred: a big serif '40' with mono 'albums' and '600' with 'songs', one hairline between; on 'wrong in a month' a coral strike through a small page icon-free mono line 'by hand'
- voiceover: "Bob Dylan has forty studio albums and about six hundred songs. A website about him is mostly a data problem: write the pages by hand, and they are wrong in a month."
- duration: 9.664s
- transition_in: cut
- status: outline
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Concrete numbers + Problem framing
- beat: Hook
- blueprint: kinetic-type-beats
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: A site about Dylan is a data problem.
keyMessage: Bob Dylan has forty studio albums and about six hundred songs.


## Frame 2 — The template site, as a page

- scene: PROTOTYPE: a real page mock of the obvious build, centred, 900×560: a template header, a biography as one long wall of grey text bars, no links; three mono chips strike on cue: '5 pages', 'wall of text', 'no links'
- voiceover: "The obvious build is a template site: five pages, the biography as one long wall of text, and no link from a song to its album or its year."
- duration: 8.32s
- transition_in: crossfade
- status: outline
- src: compositions/frames/02-template.html
- type: pain_point
- persuasion: Prototype of the obvious build, struck
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: The template site, as a page.
keyMessage: The obvious build is a template site: five pages, the biography as one long wall of text, and no link from a song to its album or its year.


## Frame 3 — 6 parts

- scene: FULL CHAIN, assembled as the narration names it (§18 pipeline). On 'content files' three chips land: albums/, songs/, events/. On 'a data build' the Build tile lands and the first arrow draws. On 'a generator' the second arrow draws and three page mocks land: era, album, song. Then the last three are named and they appear ON the pages, not beside them — on 'a search index' a search field appears on the song page, on 'hosting' a host bar above the row, on 'a design system' the page headings switch to serif. Rail fills all six slots, dim. One coral: the Build tile as it lands, handed back to ink.
- voiceover: "The plan has six parts: content files, a data build that checks and links them, a generator that makes the pages, a search index, hosting, and a design system."
- duration: 10.5s
- transition_in: crossfade
- status: outline
- src: compositions/frames/03-cast.html
- type: product_intro
- persuasion: Named cast
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Six parts.
keyMessage: The plan has six parts: content files, a data build that checks and links them, a generator that makes the pages, a search index, hosting, and a design system.


## Frame 4 — Step 1: the content model

- scene: FILES ONLY + rail (this step IS the content model). Three chips: albums/, songs/, events/. On 'a song file names its album' a hairline link draws from songs/ to albums/; on 'fails the build' that link is the frame's one coral and a mono note 'missing album → build fails' sits under it. On 'not a CMS' a mono chip '2 editors' under the stack. No Build, no pages. Rail slot 1 lit.
- voiceover: "Step one, the content model. One file per album, song and event. A song file names its album, and a validator fails the build if that album does not exist. Not a CMS: this site has two editors."
- duration: 12.267s
- transition_in: crossfade
- status: outline
- src: compositions/frames/04-step-1.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 1
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Step 1: the content model.
keyMessage: Step one, the content model.


## Frame 5 — How much content before launch?

- scene: RAIL ONLY + the two scope prototypes, as now (§16): two site-map boxes side by side under the rail, left '10 albums' with 10 filled album tiles, right 'All 40' with 40; mono cost lines '2 weeks' / '1 month'. The recommended box carries the one coral. No chain.
- voiceover: "First choice: how much content before launch? Ten albums: we launch in two weeks and learn what readers open. All forty: a month of data entry before anyone sees the site. I recommend ten. Which do you want?"
- duration: 12.032s
- transition_in: crossfade
- status: outline
- src: compositions/frames/05-decision-1.html
- type: cta
- persuasion: Comparison of two options + Recommendation with reason
- beat: Focus
- blueprint: comparison-split
- plan_step: 1
- decision: q1
- question: How much content do we write before launch?
- option_a: 10 albums, then launch
- option_b: All studio albums first
- why_a: launch in two weeks and learn what readers open
- why_b: a month of data entry before anyone sees the site
- recommended: a
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: How much content before launch?.
keyMessage: First choice: how much content before launch? Ten albums: we launch in two weeks and learn what readers open.


## Frame 6 — If 10 albums first

- scene: RAIL ONLY. Slot 1 takes its tag '10 albums'; slots 2–6 lift from dashed to filled to say the rest of the plan starts now. One coral: the tag as it lands.
- voiceover: "With ten albums, steps two to six start next week."
- duration: 5.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/06-branch-1a.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 1
- branch: q1=a
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: If ten albums first.
keyMessage: With ten albums, steps two to six start next week.


## Frame 7 — If all studio albums first

- scene: RAIL ONLY. Slot 1 takes 'All 40'; slots 2–6 stay dashed and a mono line 'about a month' sits beside slot 2, so the wait is what the frame shows. One coral: the tag.
- voiceover: "With all forty, every later step waits about a month."
- duration: 5.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/07-branch-1b.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 1
- branch: q1=b
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: If all studio albums first.
keyMessage: With all forty, every later step waits about a month.


## Frame 8 — Next: part 2

- scene: RAIL ONLY, tags earned so far, and the line 'Next · Part 2'. No chain.
- voiceover: "Next, part two: the data build and the generator."
- duration: 3.4s
- transition_in: crossfade
- status: outline
- src: compositions/frames/08-closer-1.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Next: part two.
keyMessage: Next, part two: the data build and the generator.


## Frame 9 — Part 2: steps 2 and 3

- chapter_start: Steps 2 and 3
- scene: RAIL ONLY. Slot 1 filled with its tag; slots 2 and 3 lift to filled as this part's steps. Mono line 'reads from those files'. No chain.
- voiceover: "Part two of three. Ten albums is banked, and everything from here reads from those files."
- duration: 5.392s
- transition_in: crossfade
- status: outline
- src: compositions/frames/09-opener-2.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Part two: steps 2 and 3.
keyMessage: Part two of three. Ten albums is banked, and everything from here reads from those files.


## Frame 10 — Step 2: the data build

- scene: FULL CHAIN — this is the step that makes pages exist. On 'reads every file' the three chips brighten in sequence; on 'writes one index' a mono chip 'site.json' appears under Build; on 'an album knows its songs' the second arrow draws and the three page mocks land. On 'a song that names a missing album' the Build tile takes the one coral. Rail slot 2 lit.
- voiceover: "Step two, the data build. It reads every file, follows every reference, and writes one index: site.json. An album knows its songs; an era knows its albums and events. A song that names a missing album fails the build here, not on a visitor's screen."
- duration: 15.061s
- transition_in: crossfade
- status: outline
- src: compositions/frames/10-step-2.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 2
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Step 2: the data build.
keyMessage: Step two, the data build.


## Frame 11 — Quick check

- scene: RAIL ONLY — the question owns the frame. The quiz card centred in the chain's space, three option chips beneath. No chain.
- voiceover: "Quick check. A song names an album that does not exist. Empty link, build fails, or song skipped?"
- duration: 5.355s
- transition_in: crossfade
- status: outline
- src: compositions/frames/11-quiz-1.html
- type: social_proof
- persuasion: Question→answer pairing
- beat: Focus
- blueprint: compose
- plan_step: 2
- question: A song names an album that does not exist. What happens?
- option_a: The song page shows an empty album link
- option_b: The build fails
- option_c: The song is skipped
- quiz: k1
- answer: b
- explain: the data build follows every reference and fails on a broken one, so the mistake never reaches a visitor
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Quick check.
keyMessage: Quick check.


## Frame 12 — Step 3: the generator

- scene: PAGES ONLY + rail. The three page mocks land one per named kind as 'one per era, one per album, one per song' is said; on 'and a timeline' a year strip appears across the era page. On 'plain HTML' a mono chip 'no JS' under the row. One coral: the era page when its strip lands. No files, no Build.
- voiceover: "Step three, the generator. It turns site.json into pages: one per era, one per album, one per song, and a timeline. Every page is plain HTML, so a phone needs no JavaScript to read it. We use Astro; Next.js would ship JavaScript the site does not need."
- duration: 16.917s
- transition_in: crossfade
- status: outline
- src: compositions/frames/12-step-3.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 3
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Step 3: the generator.
keyMessage: Step three, the generator.


## Frame 13 — Timeline in the first release?

- scene: RAIL ONLY + two option cards under the rail ('A · Yes, a list by year' / 'B · No, eras and albums only') with their mono cost lines. The recommended card carries the one coral. No chain.
- voiceover: "Second choice: is the timeline in the first release? As a list by year, it is one template, and the events already exist. Without it, the era pages lose their links to the years around an album. I recommend the list. Which do you want?"
- duration: 13.12s
- transition_in: crossfade
- status: outline
- src: compositions/frames/13-decision-2.html
- type: cta
- persuasion: Comparison of two options + Recommendation with reason
- beat: Focus
- blueprint: comparison-split
- plan_step: 3
- decision: q2
- question: Do we include the timeline in the first release?
- option_a: Yes, a list by year
- option_b: No, eras and albums only
- why_a: one template, and the events already exist
- why_b: the era pages lose their links to the years around an album
- recommended: a
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Timeline in the first release?.
keyMessage: Second choice: is the timeline in the first release? As a list by year, it is one template, and the events already exist.


## Frame 14 — If the timeline ships

- scene: PAGES ONLY + rail — the page that changes, changed. The era page gains a year strip and a hairline link from it to the album page. One coral: the strip. Slot 3 takes its tag.
- voiceover: "With the timeline, every era page links to its years."
- duration: 5.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/14-branch-2a.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 3
- branch: q2=a
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: If the timeline ships.
keyMessage: With the timeline, every era page links to its years.


## Frame 15 — If the timeline waits

- scene: PAGES ONLY + rail. Three page mocks, no strip, and a mono line 'eras stand alone' under the era page. One coral: the era page's border. Slot 3 takes its tag.
- voiceover: "Without it, the generator has three page kinds, and the eras stand alone."
- duration: 5.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/15-branch-2b.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 3
- branch: q2=b
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: If the timeline waits.
keyMessage: Without it, the generator has three page kinds, and the eras stand alone.


## Frame 16 — Next: part 3

- scene: RAIL ONLY, tags earned so far, line 'Next · Part 3'. No chain.
- voiceover: "Next, part three: design, search, hosting, and the plan resolved."
- duration: 3.963s
- transition_in: crossfade
- status: outline
- src: compositions/frames/16-closer-2.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Next: part three.
keyMessage: Next, part three: design, search, hosting, and the plan resolved.


## Frame 17 — Part 3: steps 4 to 6

- chapter_start: Steps 4 to 6, and the plan
- scene: RAIL ONLY. Slots 1–3 filled with tags; slots 4–6 lift to filled. Mono line 'now the pages need a look'. No chain.
- voiceover: "Part three of three. The timeline is in, and now the pages need a look."
- duration: 4.389s
- transition_in: crossfade
- status: outline
- src: compositions/frames/17-opener-3.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Part three: steps 4 to 6.
keyMessage: Part three of three. The timeline is in, and now the pages need a look.


## Frame 18 — Step 4: the design system

- scene: PAGES ONLY + rail — the design system is a restyle OF the pages. On 'a biography, read like a book in one narrow column' the era page narrows its text column; on 'an album page, a reference, full width with a table of tracks' the album page gains a track table; on 'one serif, one sans' every heading switches to serif. One coral: the page being named as it changes, one at a time, never two at once. Rail slot 4 lit.
- voiceover: "Step four, the design system. Two kinds of page: a biography, read like a book in one narrow column; and an album page, a reference, full width with a table of tracks. One serif, one sans, images in two sizes."
- duration: 12.672s
- transition_in: crossfade
- status: outline
- src: compositions/frames/18-step-4.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 4
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Step 4: the design system.
keyMessage: Step four, the design system.


## Frame 19 — Book-like or magazine?

- scene: RAIL ONLY + the two look prototypes side by side, as now (§16): book-like and magazine, both readable, co-visible at least 4 s. The recommended one carries the one coral. No chain.
- voiceover: "Third choice: the look of the reading pages. Here they are side by side. Book-like: a serif, wide margins, few images; cheap to do well. Magazine: big photographs and bold headings; striking, but the photographs are copyrighted, and we may not be allowed to use them. I recommend book-like. Which do you want?"
- duration: 16.917s
- transition_in: crossfade
- status: outline
- src: compositions/frames/19-decision-3.html
- type: cta
- persuasion: Comparison of two options + Recommendation with reason
- beat: Focus
- blueprint: comparison-split
- plan_step: 4
- decision: q3
- question: Which design direction for the reading pages?
- option_a: Book-like
- option_b: Magazine
- why_a: a serif, wide margins, few images; cheap to do well
- why_b: big photographs and bold headings; the photographs are copyrighted
- recommended: a
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Book-like or magazine?.
keyMessage: Third choice: the look of the reading pages.


## Frame 20 — If book-like

- scene: PAGES ONLY + rail. The pages take the book-like treatment: serif headings, wide margins, no images. Mono line 'no photographs to clear'. One coral: the album page. Slot 4 takes its tag 'Book-like'.
- voiceover: "Book-like: one serif face, wide margins, and no photographs to clear."
- duration: 5.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/20-branch-3a.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 4
- branch: q3=a
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: If book-like.
keyMessage: Book-like: one serif face, wide margins, and no photographs to clear.


## Frame 21 — If magazine

- scene: PAGES ONLY + rail. The pages take the magazine treatment: a photo block on each, bold headings. Mono line 'rights check before launch'. One coral: the album page. Slot 4 takes its tag 'Magazine'.
- voiceover: "Magazine: big photographs on every page, and a rights check before launch."
- duration: 5.2s
- transition_in: crossfade
- status: outline
- src: compositions/frames/21-branch-3b.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 4
- branch: q3=b
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: If magazine.
keyMessage: Magazine: big photographs on every page, and a rights check before launch.


## Frame 22 — Step 5: search

- scene: PAGES ONLY + rail, plus the one file search adds. On 'the build writes a small index' a fourth chip 'search.json' appears in the files column with a mono size '60 kB'; on 'the browser loads it the first time you click' a search field appears on the song page. One coral: the song page. Rail slot 5 lit.
- voiceover: "Step five, search. The build writes a small index, about sixty kilobytes, and the browser loads it the first time you click the search box. No search server."
- duration: 9.067s
- transition_in: crossfade
- status: outline
- src: compositions/frames/22-step-5.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 5
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Step 5: search.
keyMessage: Step five, search.


## Frame 23 — Step 6: hosting

- scene: PAGES ONLY + rail. On 'push to main' a host bar appears above the page row reading 'main → deploy'; on 'a pull request gets a preview link' a second, dimmer bar reads 'pr → preview'. On 'adding an album is one file' a single chip 'albums/' appears in the files column. One coral: the host bar. Rail slot 6 lit.
- voiceover: "Step six, hosting. Push to main and the site builds and deploys; a pull request gets a preview link. Adding an album is one file."
- duration: 7.659s
- transition_in: crossfade
- status: outline
- src: compositions/frames/23-step-6.html
- type: feature_showcase
- persuasion: Worked example on the stage
- beat: Focus
- blueprint: compose
- plan_step: 6
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: Step 6: hosting.
keyMessage: Step six, hosting.


## Frame 24 — The plan, resolved

- scene: FULL CHAIN with every decision tag on its slot, and the pages carrying everything the plan added: serif headings, the year strip, the search field, the host bar. The whole picture the reviewer approves. One coral: none moving — the frame holds still after the last tag lands.
- voiceover: "That is the plan, with your three choices. Draw on any step to ask for a change, or approve it."
- duration: 10s
- transition_in: crossfade
- status: outline
- src: compositions/frames/24-resolved.html
- type: cta
- persuasion: Comparison of two options + Recommendation with reason
- beat: Resolve
- blueprint: comparison-split
- plan_questions: 1,2,3
- focal: see shot
- roles: rail = anchor · diagram = foreground subject · small tags = supporting · cream ground = background
- sfx: none

narrativeRole: The plan, resolved.
keyMessage: That is the plan, with your three choices.

