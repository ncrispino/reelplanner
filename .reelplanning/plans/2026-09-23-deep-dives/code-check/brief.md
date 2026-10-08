# Code check brief: 2026-09-23-deep-dives

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-23-deep-dives/code-check/findings.md`.

1. **Steps.** Does every plan step have a change that carries it out?
2. **Decisions.** Does every decision below hold in the code?
3. **Unexplained.** Is there anything in the diff the autonomy log does not explain? A change counts as
   explained when a step asks for it, a decision requires it, or an autonomy row names it. A choice a
   reviewer could reasonably have made the other way (a default, an error code, a library, a data
   shape, deleting instead of flagging, behaviour someone can see) needs a row; renames, file layout
   and the order of edits do not.

Report what you find, never fix it. Say "✗" only for something a reviewer would want to know; say why
in one sentence.

## The shape of findings.md (keep it exactly)

```
# Code check: 2026-09-23-deep-dives

## Steps
- Step 1 — ✓ carried by `path/to/file`, `other/file`
- Step 2 — ✗ nothing in the diff carries "<the part of the step>"; closest is `file`

## Decisions
- D-004 — ✓ holds: `path/file.mjs` (the summary frame is written in resumeAt)
- D-005 — ✗ broken: `path/file.js:120` counts a record jump as a rewind

## Unexplained
- `path/file.js` — ✗ changes the default speed from 1× to 1.25×; no step, decision or autonomy row covers it. Suggest: autonomy row "default speed 1.25×, instead of 1×".
```

Write "- none" under a section with nothing to report. Every ✗ line must start with its key: `Step N`,
a decision id, or a backticked path.

## Commits (b2225ec..HEAD, limited to scripts templates skills packages/player package.json)

```
b3b66a6 Deep dives, player side: the Open chip, the side panel, comments in a detail, the plan beside the video
3af3bf6 Deep dives, pipeline side: detail tags, seven templates, the details check
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-23-deep-dives/plan.md` in full. Its title is "Deep dives: the video opens into HTML where a video falls short", with 6 steps.

## The decisions that apply

- **D-004** (step 2) After a pick-all-that-apply answer, what does the video play? → **One summary frame**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-021** (step 1) Where does a detail open? → **Side panel**
- **D-023** (step 4) What code does a walkthrough show? → **oh we shoulndt ALWAYS show the code, and we should not ONLY be showing the code as the thing we are showing more detail for. like there could be other thigns where detail is important. and code might not come with everything, only if it is relevant, and ppl often dont l ook at the full code there like it really should be justified. and other details could be important that are clearer, like going into more interactive depth.**
- **D-024** (step 2) How is each detail page made? → **Types first**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | The Open chip's key is **O** ("Open"); while a question sheet is up, O keeps meaning "answer in my own words" | E (the plan's key, which is Export today), or moving Export off E | O is the chip's own first letter and is free outside a question; moving E would break a key reviewers and `review-keys.spec.mjs` already rely on. A question on screen owns its letters, so the chip waits behind it | packages/player/reelplanning-player.js `onKey`, the `o` branch; chip label `Open <kbd>O</kbd>` |
| A2 | 1 | The panel is fixed to the window's right edge, full height, `min(560px, 44vw)` wide; the page's content column shrinks to its left so the paused stage sits beside it, uncovered. Under 600 px it covers everything; it sits beside the stage only when that leaves the stage at least 640 px wide (a window about 1250 px or wider), and covers the whole window below that | a panel inside the stage's own height, or an overlay on the stage | a detail is read or tried at length: the stage's 16:9 height is too short for a page, and covering the stage would lose the frame it belongs to | packages/player/reelplanning-player.js `.dpanel`, `.wrap.dopen` CSS, `measurePeek` (`dcover`), `.wrap.dcover` CSS |
| A3 | 5 | The plan text goes **beside the stage** (a 340 px column, the height of the player) when the window is wide enough that the stage loses under 10 % of its width for it (1440×900: 1038 → 1028 px); otherwise it is a section **in the record**, under Steps | always below the player in the page flow (the plan's words) | the record sheet is fixed and rests at a peek that fills the window under the controls, so anything in the page flow below the player sits behind it and nobody finds it; beside, the reviewer reads the lit step while the video plays, and the controls and Finish stay where they were | packages/player/reelplanning-player.js `placePlan`, `.wrap.beside` CSS |
| A4 | 1 | Close plays again only if the video was playing when the detail opened, and only if the playhead is still where it was (the reviewer did not move it meanwhile); no seek back | always play on close, or always seek back to the opening moment | "resumes where you were": a reviewer who opened it from a paused frame, or who moved the video while reading, would be surprised by a video that starts or jumps on its own | packages/player/reelplanning-player.js `closeDetail` |
| A5 | 1 | While the panel is open the video's keys are off (no play, draw, answer); O and Esc close it | letting space/A–D/N act on the hidden video | keys meant for the page should not start or answer the video under it. Once focus is inside the sandboxed page its keys are the page's own: Esc then works after one click on the panel's header, and × always works | packages/player/reelplanning-player.js `onKey` (`this._dopen` guard) |
| A6 | 3 | A detail comment is `kind: "note"` with `detail`; Enter or Esc keeps the words, the × discards them (the mark box's rule, A10); a click on another anchor keeps what was typed on the first | a new kind (`detail-note`), or Esc discarding | an ordinary annotation per the contract, so resolve-plan and every existing view read it as a comment; words are only thrown away on purpose | packages/player/reelplanning-player.js `saveDetailComment`, `closeDetailComment` |
| A7 | 4 | Accept / Flag in the panel are one-shot like the sheet's: once a verdict is on the record the buttons show it and are disabled. If that call's sheet is waiting, the panel's verdict answers it too and the video goes on at close | letting the panel change a verdict, or leaving the sheet waiting | the sheet has no "change" for a call either; one verdict per call keeps the export and the Flag note consistent | packages/player/reelplanning-player.js `detailVerdict`, `recordVerdict` |
| A8 | 5 | `plan` reads `plan.md`, never `plan.resolved.md` | the resolved file when it exists | the contract says plan.md; the resolved file appends review sections the page beside the video should not carry | scripts/plan-map.mjs |
| A9 | 3 | a click on a control (button, a, input, select, textarea, label, summary, `[data-no-anchor]`) INSIDE an anchored element does not post an anchor; the anchor element itself (even a button) does | posting on every click inside an anchor | sorting a table, copying a cell or pressing a prototype's button should not open a comment box; commenting on the region still works by clicking or selecting text in it | templates/details/*.html (rp-bridge) |
| A10 | 2 | a seventh template, `fresh.html`: the base styles, theme and bridge with an empty body, for kind `fresh` | writing the bridge from scratch each time | the contract says a fresh page still carries the bridge; copying it is the reliable way | templates/details/fresh.html |
| A11 | 2 | templates are filled by a JSON block (`<script id="rp-data" type="application/json">`) in `<head>`, plus two HTML/script slots for try (VARIANTS, BEHAVIOUR) and one optional script slot for explore (STEPS: `window.rpSteps`) | HTML slots everywhere, or JSON only | data pages (table, evidence, code, plan text) are data; a prototype is markup and behaviour, and 90 steps are a loop, not a list | templates/details/try.html, explore.html |
| A12 | 2 | the samples in each template are the uploads plan (risks, the 8/16/32 MB staging runs from this plan's video, parts.ts line 14, before/after drop, manifest explorer, a step's text), each marked "Sample content" | lorem ipsum | a copied template already shows what good looks like for its kind; the check passes the templates as they are | templates/details/*.html |
| A13 | 6 | the check also fails on: two `detail:` tags on one beat, a name that is not lower-case/digits/dashes, an unknown `detail_kind`, a `<script src>` or stylesheet `<link>` (even local), a request for a file that is not there, a bridge that never posts `ready`, and a click on the first anchor that posts no `anchor` | only missing page / network / bridge text / page error | each is a way the Open chip leads to a broken page; the last two test the bridge by running it, not by reading it | scripts/check-details.mjs |
| A14 | 6 | without playwright-core (or when Chromium will not start) the static checks still run and the result says the pages were not opened | failing the build | the contract says "when available"; under npx the dev dependency is not installed | scripts/check-details.mjs |
| A15 | 3 | plan-text renders a Markdown link as its text plus the address in grey, never an `<a href>` | a working link | the contract counts an http(s) href as a network load, and a sandboxed panel cannot open it anyway | templates/details/plan-text.html |
| m1 | 1 | `plan` is read from `plan.md` at `<repoRoot(video-dir)>/<plan_dir>`, falling back to the video folder's parent when that parent holds a `plan.md` (a copied or moved project) | only `<cwd>/<plan_dir>` | plan_dir is repo-relative; repoRoot() is how the other scripts find the repo, and the fallback keeps a copied video (the scratch test) finding its plan | scripts/plan-map.mjs |
| m2 | 1 | the storyboard-to-map mapping keeps only `frames[i].detail` (the name) on a frame; title/kind/why live in `details[]` | copying all four tags onto each frame | the contract names only `frames[i].detail`; one place for the rest keeps the map from disagreeing with itself | scripts/plan-map.mjs |
| m3 | 1 | `details[].title` falls back to the frame's title when `detail_title` is missing | null | the chip always has something to say | scripts/plan-map.mjs |
| m4 | 2 | theme: `theme=dark` read from the query OR the hash; also `paper`/`ink`/`accent` hex overrides from the same place; light by default, `prefers-color-scheme` ignored | following the OS setting | the player passes its own theme explicitly; an OS guess could disagree with the player the page sits in | templates/details/*.html (rp-theme script) |
| m5 | 3 | the bridge marks the last anchor posted with `data-rp-active` (a coral outline) | no feedback in the page | the reviewer sees which line or row their comment is about | templates/details/*.html |
| m6 | 3 | anchor labels: table `row: <value of anchorBy column>`; evidence `run: <label>` and `<metric>: <run>`; code `<file name>:<line>` (a removed diff line `<file>:-<n>`); explore `part: <label>`, `step <n>`, `row: <first cell>`; plan-text `step <n>, para <k>` / `step <n>, item <k>`; fresh `page` on `<main>` | full paths or ids | short enough to read in the record ("`parts.ts:14` in …"); the file name, not the path, matches the contract's own example | templates/details/*.html |
| m7 | 2 | table sorts "m:ss" and numbers with units ("16 MB", "1,200") by their number; evidence bars read "m:ss" as seconds | string sort | the staging runs' "time to finish" is m:ss | templates/details/table.html, evidence.html |
| m8 | 6 | a missing `detail_kind` or `detail_why`, a page no beat links to, and a detail linked from two beats only warn | failing | none of them breaks what the reviewer opens | scripts/check-details.mjs |
| m9 | 6 | the static scan skips text that is only shown (HTML comments, JSON data blocks, `<pre>`/`<code>`/`<textarea>`) | scanning every byte | a code page may show `fetch("https://…")`; the browser pass catches anything that really loads | scripts/check-details.mjs |
| m10 | 6 | each page is opened twice, light and `?theme=dark`; relative files inside `details/` are allowed, anything outside it (or on the network) fails | light only; no local files at all | the theme script is code too; bundle-player copies all of `details/`, so a local image there travels with the page | scripts/check-details.mjs |
| m11 | 6 | the check also reads `plan-map.json`'s `details` and fails on a page it lists that is missing | the storyboard only | a stale plan map would still send the player to it | scripts/check-details.mjs |
| m12 | 2 | `reelplanning detail new` takes `--data <file.json>` (writes the JSON block, `<` escaped) and, for plan-text, `--step <n | all>` (fills it from plan.md at plan_dir); `detail kinds` lists the kinds | copy only | filling by hand is where a `</script>` in a string breaks a page; the plan text is already in the repo |
| m13 | 3 | resolve-plan writes the contract's line, `- note in detail \`parts-runs\` at \`row: 16 MB\`: <comment>`, plus a sub-line `pointing at: "<selected text>"` when the selection says more than the anchor; a detail comment with no anchor reads `- note in detail \`<name>\`: …` | the line alone | the selection is what the reviewer actually pointed at (a phrase in a paragraph), and the agent revising needs it | scripts/resolve-plan.mjs |
| m14 | 3 | revise-scope keeps the reason's shape and adds `detail: { name, anchor, text }`; `about` becomes "detail <name> at <anchor>" when the annotation has none | a new reason kind | readers of revise-scope.json keep working, and the anchor is in the reason as the contract asks | scripts/revise-scope.mjs |
| m15 | 4 | resolve-walkthrough lists a detail comment the same way resolve-plan does | leaving it to resolve-plan only | a walkthrough call opens onto a detail (step 4), so its comments come back through the walkthrough record | scripts/resolve-walkthrough.mjs |
| m16 | 1 | The chip sits in the stage's top-right corner, shaped like the part card (hairline, coral rule), and steps down under a folded question's pill; it stays up while a question sheet waits | top-left (the part card's corner), or hiding it while a question waits | captions own the bottom; a walkthrough's call sheet is exactly when the reviewer needs its detail, so the chip must stay reachable then | packages/player/reelplanning-player.js `.dchip` CSS, `syncDetailChip` |
| m17 | 1 | Detail `src` is resolved against the plan map's URL, not the composition's | resolving against `index.html`'s folder | the two are the same folder in every real layout (plan-map.json sits in the video dir, also in the bundle), and it lets a test fixture map carry its own `details/` | packages/player/reelplanning-player.js `openDetail`, `detailUrl` |
| m18 | 3 | "Under its step" in the record is its step label (`step 2`) on the row, and the title of the detail is a link that opens it again | regrouping the Comments list by step | the Comments list is one time-ordered list for every kind; the step label is how every other comment names its step | packages/player/reelplanning-player.js `renderList`, `whereInDetail` |
| m19 | 3 | Anchor labels are trimmed to 120 chars, quoted text to 200, whitespace collapsed; messages must be `{type:"rp-detail"}` objects from the panel's own frame and only while it is open | trusting the page's lengths | the page is untrusted input; the contract caps text at 200 but not the anchor | packages/player/reelplanning-player.js `onDetailMessage` |
| m20 | 5 | Clicking a step's heading (unless it is a text selection) or its time seeks to its first frame and keeps playing if it was playing; going back > 2 s this way is recorded as a rewind (D-005) | pausing like the Steps list's rows, or not recording | the part markers (N/P) already count as rewinds; the Steps list's rows pause because they are a jump-to-look, while the plan text is read alongside a playing video | packages/player/reelplanning-player.js `jumpToStep` |
| m21 | 5 | The problem (`plan.problem`) is a section before step 1, lit while the video is before step 1's first frame; the closing frames light nothing | no problem section | it is in the contract's `plan` and is the plan's own opening text | packages/player/reelplanning-player.js `renderPlanText`, `syncPlanStep` |
| m22 | 5 | Beside the video, the lit step scrolls into view as the video moves on, unless the pointer is in the plan column | never auto-scrolling, or always | "you always know where you are in the text", without yanking the text from under someone reading ahead | packages/player/reelplanning-player.js `syncPlanStep` |
| m23 | 5 | Markdown: paragraphs, `-`/`1.` lists with one nested level, `**bold**`, `` `code` ``, fenced code; a heading inside a step reads as a bold line; a link shows its words only | a library, or rendering links | tiny and safe, as asked; a link in the page would navigate the review away | packages/player/reelplanning-player.js `mdToHtml`, `mdInline` |
| m24 | 5 | Each step section ends with "Open:" and its details, so a detail can be reached from the text as well as from its beat | chip only | the plan text is where a reviewer skims ahead; one line per step, only when it has details | packages/player/reelplanning-player.js `renderPlanText` |

## The diff

Read it yourself: `git diff b2225ec..HEAD -- scripts templates skills packages/player package.json` (from the repository root). The files it touches:

```
package.json                                       |   2 +-
 packages/player/reelplanning-player.js             | 399 ++++++++-
 packages/player/test/details.spec.mjs              | 183 ++++
 .../player/test/fixtures/details/complete-409.html |  42 +
 .../player/test/fixtures/details/parts-runs.html   |  50 ++
 packages/player/test/fixtures/l2-details.json      | 943 +++++++++++++++++++++
 scripts/bundle-player.mjs                          |   2 +
 scripts/check-details.mjs                          | 138 +++
 scripts/detail.mjs                                 |  56 ++
 scripts/finish-project.sh                          |   5 +-
 scripts/lib/details.mjs                            |  30 +
 scripts/lib/plan-md.mjs                            |  31 +
 scripts/plan-map.mjs                               |  13 +-
 scripts/resolve-plan.mjs                           |  11 +-
 scripts/resolve-walkthrough.mjs                    |  11 +-
 scripts/revise-scope.mjs                           |   4 +-
 scripts/test/details.spec.mjs                      | 144 ++++
 scripts/verify.sh                                  |  13 +-
 skills/plan-to-video/SKILL.md                      |   7 +-
 skills/plan-to-video/references/style-guide.md     |  19 +
 templates/details/code.html                        | 187 ++++
 templates/details/evidence.html                    | 201 +++++
 templates/details/explore.html                     | 266 ++++++
 templates/details/fresh.html                       | 103 +++
 templates/details/plan-text.html                   | 193 +++++
 templates/details/table.html                       | 172 ++++
 templates/details/try.html                         | 200 +++++
 27 files changed, 3400 insertions(+), 25 deletions(-)
```
