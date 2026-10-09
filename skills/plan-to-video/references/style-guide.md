# Plan video style guide

Read this before writing a storyboard. It says how a plan is told as a video; HyperFrames' faceless-explainer
skill (`/faceless-explainer` in Claude Code, `$faceless-explainer` in Codex) still owns the mechanics (storyboard
format, frame workers, the HyperFrames CLI). Where the two disagree on how the story is told, this guide wins.

The viewer is one engineer deciding whether to approve a plan, or whether to accept what was built.
They are making a real decision, so the video must be accurate: what each step does matches the plan
literally, even when the why is compressed.

Most of what follows is a goal, not a template. Where a tool enforces a rule, the rule says which.
Why a rule exists, and the reviews it came from, is in
[`docs/design-notes.md`](https://github.com/ncrispino/reelplanner/blob/main/docs/design-notes.md).

`$RP` means what SKILL.md says: `reelplanner` when it is on the PATH.

## 1. A series of parts

A video is **a series of parts of about a minute each** (60–75 s), one part per chapter. How many
parts there are follows from the plan: a two-step plan with no questions may be one part, and a
six-step plan with four questions is three to five.

**Length.** A plan video aims for 3–5 minutes (about 700–1,100 words of narration); longer only when
the plan needs it; past 7 is long, and past 10 is too long: cut or split the plan. A walkthrough video
shows the change running in about two minutes (§8): past 3 is long, past 5 too long. The system video may
run 5–8 minutes, never past 12. `$RP build` ends with the length against this budget, a warning, never a
stop. To stay inside it:

- One beat per step that says what it does; the how goes in the guide (the plan's blocks) or a detail
  (§10), not in more beats.
- In a walkthrough, only the calls you'd notice or can't easily undo pause, in the scene that shows them
  running; the rest are one list at the end (§8).
- A revised video is rebuilt as the new version, not the old one with the new beats added: cut what
  the reviewer already accepted down to a line, and keep the changes at full length.
- Cut in this order: the second example, the "why not" nobody would ask about, a sentence that says
  what the stage already shows, a recap.

- **A part** is an opener, one or two steps with their decisions and the quick checks that fall there
  (§7: each after the next step's scenes), and a closer. Past about 80 s, split it.
- **The opener** (3–4 s) shows the stage as resolved so far and one sentence ("Part two of three:
  steps two and three"). Tag it `- chapter_start: <title>`; the plan map and the page's part list come
  from that tag.
- **The closer** (about 3 s) adds the part's result to the stage and names what is next. An opener
  never repeats the closer before it. The last part's closer is the ending (§6).
- **Beats.** One idea per beat, 5–15 s.
- **Words.** 185–254 words a minute of narration; a 70 s part is about 210 words. `$RP narrate` speaks
  at 1.25× to reach that pace. Cut (as under **Length**) before shortening explanations.

**Holds.** `sync-durations` sets each frame to its voice line, which is too short for some beats. Put
the floor for those beats in `.hyperframes/holds.json` (`{ "<frame number>": <seconds> }`);
`hold-durations` (part of `$RP build`) applies them, and a hold is never shorter than the voice
line. `"tail": <seconds>` in the same file holds every frame that long after its line (the system video, for someone
new, is narrated at `--speed 1.1` with a `0.8` tail; a rebuild keeps the speed it was narrated at).

- No beat is under 4 s, openers and closers included.
- A branch beat holds 5–8 s, even when its line is two seconds long.
- A beat that assembles something holds it for 1.5 s after the last piece lands.
- The final frame holds still for at least 3 s.

## 2. The order of a plan video

The default order is a template, not a script. Drop a beat that has nothing to say.

hook → (tension) → overview → (cast) → step 1 … step N, each with its decision and, after its scenes,
the step before's quick check (§7) → the last step's quick check → callback → (risk) → ending.

In storyboard types: `hook` → `pain_point` → `product_intro` → `feature_showcase` per step →
`benefit_highlight` → `cta`.

- **Hook** (up to 8 s): the goal as a concrete failure with stakes, or a question the plan answers.
  Outcome language, no file names. Frame it, but don't open with "in this video".
- **Tension** (optional): the approach a reviewer would reach for, shown failing. It earns its time
  only when that failure is worth seeing. A greenfield plan can show the outcome instead ("this is the
  page we are building").
- **Overview.** Say what changes before how. Before any step, the viewer should hold the whole plan:
  the two to four changes it makes and which steps belong to each.
- **Say which steps depend on which.** Step numbers are a reading order, not a chain. A step that needs
  an earlier one says so ("this needs step two's manifest"); an independent one says nothing, or shows
  its own track.
- **Cast.** Name each part once before a step animates it, and only when there are more than about
  three. Introduce them a few at a time.
- **Step beats** carry `- plan_step: <n>`, and may carry a quiet anchor ("Step 3 · Resume endpoint") in
  place, so a mark on it lands on the step (without one, the player takes the step from `plan_step`). Say the step number aloud so the ear and the anchor
  agree. Each step changes one thing on the stage and lights only what it touches.
- **Callback:** the hook's failure again, on the same stage, now resolved.
- **Risk** (only when the plan lists risks): the failure on the stage, marked, then the guard.

**Greenfield and brownfield.** In a new project the cast names the parts we will build and the steps
are build order. In an existing one, add a "today" beat before the cast (how it works now), mark which
parts change, and show each step as a before and after on one part.

**Knowledge levels** (brownfield). Tag a frame `- knowledge: new,familiar` with the levels that include
it; untagged frames are for everyone. `new` gets the today beat, the cast and the why-not clauses;
`familiar` skips the today beat; `owner` also skips the cast and standard why-nots. The player skips
frames outside the level the reviewer picks, so one build serves all three.

**What to know first.** A video that leans on another says so in its front matter, one line each:
`before: <video>[#part N] | <what it gives you>`, where `<video>` is `system`, a plan's folder name, or
`<plan>--walkthrough` (the names the review page uses). With none, a video has the system video before
it (`system | what the parts are and how a review goes`); `before: none` opts out. The player shows
them before the first play ("Before you watch", each with its length, whether it was watched — in this
browser or by your file; for `#part N`, that chapter — and a link to it). A page opened for one video
carries each one built in this repo, so the link plays it there, at its chapter; one it cannot carry says
why: "Not built yet", "Not found here" (no video by that name in this repo), or "Not on this page" (left
off to keep the page small). `check-terms` counts their `terms:` as known. List the words this video defines itself
as `terms: a, b, c`.

**What to watch first** is `$RP reel prereqs <plan-dir>`'s `before:` lines: the system video's chapters on
what the plan touches, and at most two earlier plans' videos whose decisions it builds on most. It also
writes a `recap:` line for every earlier video the plan builds on, those two included.

**A recap beat** (tagged `- knowledge: new`) sums up every earlier video the plan builds on, the ones on
the card included, one plain line each (about 3 s a line), so a viewer who watches none of them still has
the gist; the card only says which to watch first. It goes right before the first beat that leans on
them, and gives the two or three words this video needs from them in the same lines ("A label is a word
the agent puts on a choice it made alone; a choice labelled *visible* pauses the walkthrough video").
A reviewer who knows them skips it at `familiar`.

## 3. Narration and screen

- **The screen shows what; the voice says why.** The screen shows the part that changes, the file,
  the edge. The narration gives the reason and the trade-off.
- **Never put the narration on screen.** A beat adds at most **5 new words** of on-screen text beyond
  the labels (a step's anchor and title, part names, option labels) and the real thing's own words. A part's box holds its name and nothing
  else; file paths go in the narration.
- **Each highlight lands on its word.** When the narration names a part, that part changes at that
  moment, not before. `$RP retime-frames` (part of `$RP build`) moves cues onto their words after the
  narration changes.
- **Captions are the script's own sentences**, with the current word marked. Whisper supplies the
  timings, never the words.
- **On screen use digits; the script uses words; `captions-sentences` applies it.**
- **Names as `names.md` shows them** (`.reelplanner/names.md`, one list for the project). A tool's name
  or a command is code: on screen it is in code markup (the mono, or a `<code>`), in its own spelling,
  never capitalised: the product is `reelplanner`, lowercase, like `reel status` or `npm test`. A product
  or an acronym that is not code keeps its case and no markup: GitHub, HyperFrames, CLI, JSON. The script
  may spell a name however reads well aloud (Kokoro says "reelplanner" and "ReelPlanner" alike); the
  captions show it the list's way, a tool's name as a chip in the code voice, and its command's next words
  in the same chip (`captions-sentences`). The narration is never re-voiced for a spelling. A real thing
  (`data-artifact`) keeps its own text. `check-terms` warns on a tool's name on screen outside code markup,
  and on a listed name spelled another way. A plan that brings in a tool the videos name adds its row.
- **Commands, flags, paths and file names are written as they are written.** SCRIPT.md says `claude -p`,
  `--dry-run`, `plan.md`, `/work`, `~/.reelplanner/you.jsonl`, never "claude dash p", "dot md" or "slash
  work": `narrate` hands the voice the spoken form ("claude dash p", "plan dot md", "slash work", "home dot
  reelplanner slash you dot json L"; `scripts/lib/say.mjs`), and the captions show the script's words, a
  flag, a path or a file name as a code chip. An id like D-110 stays as it is (Kokoro reads it as the ledger
  does). `check-terms` warns on a spelled-out form in a script; an old script's spelled-out forms are shown
  written in its captions all the same.
- **One signal at a time.** Light the part or step in play and dim the rest. Contrast, a border or an
  arrow is the signal, not motion. One colour per part for the whole video.
- **Tags read the same everywhere** the same choice appears (the branch frame, the rail, the ending).

## 4. Voice and plain language

- Conversational: "you", "we", "here's where we have a question". Brisk, no hedging, no filler.
- **Plain words on screen; the files keep theirs**. What the viewer sees and hears uses the
  glossary's on-screen word where a row has one: a *choice* the agent made (not a call), a *label* (not a
  tag), an *off-plan change* (not a deviation), a *late fix* (not a miss), a *chapter* (not a part), a
  *scene* (not a beat). File names, commands, storyboard tags and the decision log keep the term. The
  same goes for the plan itself: plain words, no more complicated than it needs to be.
- **Plain sentences.** No mannered prose ("here's the thing", "your call", clever fragments). The test:
  would you write it in a design doc?
- **Simple words, one idea a sentence.** Describe a mechanism plainly before you name it, then use the
  name.
- **An example for every mechanism**, with real values ("upload 7f3a, 2 GB, part 4 missing"). A number
  the viewer can follow beats an adjective.
- **A comparison for every choice**: both options as the same sentence with one thing changed.
- **Why not, in one clause.** When the plan considered an alternative, spend one clause on why it loses.
- **No lies-to-children.** Compress the why, never the what.
- **Define before use.** The first time the video says a word the viewer may not know (a glossary term,
  a word from `templates/reelplanner/jargon.txt`, one of the storyboard's `terms:`), it says what it
  means, plainly, in the same sentence or the one before: "a tag — a label the agent puts on a choice it
  made alone, like *you'll notice it*". Tag that beat `- defines: <term>`. A word the video before this
  one defines (its `before:` videos' `terms:`) needs no definition; if it matters here, give it a
  recap (§2). `check-terms` (run by `build`) warns on a word said before it is defined.
- **Never an id without what it is.** Not "D-056 stops every call" but "decision D-056, that the plan
  text sits beside the video, …"; not "A12" but "the agent's choice A12, to put Accept in the band". A
  sentence with an id also says which kind it is (decision, choice or call, quick check, question) and,
  the first time, what it decided or asked. `check-terms` fails a bare id on a `terms_check: strict`
  storyboard. The player glosses ids too, but the voice has to stand on its own.
- The register to aim for is a good teacher talking to a peer: a concrete case first, then the rule.

## 5. What to draw

**Draw what the plan changes; don't default to a node graph.** A graph of boxes and edges says "these
parts exchange data at runtime". That is right for a service and wrong for a static site or a document,
where the boxes would sit unconnected and teach the viewer something false. Pick the form from the
plan: a pipeline that ends in its real output, the set of pages or screens a user ends up with, a
wireframe of one screen whose regions move, a record whose fields change, or two actors exchanging
messages. Record the choice in `system.json` as `stage: { kind, why }`, with a `why` someone could
disagree with; starting points for some kinds are in reelplanner's `templates/reelplanner/theme/stages/`.
If something has no edge and no place on the artefact, it is a rail step, not a box.

**The real thing, where the brief picks it.** A scene can show the thing it is about (a file, a table, a
command's output, a screen of the player) with its own words, instead of a card about it. Which scenes
do is the brief's call: BRIEF.md names them under Customizations, `- Real things: scene 3 (the
table), scene 8 (the diff); the rest explain with pictures`, and nothing warns about the scenes it leaves
out. Pick the scenes where seeing the thing is what makes it click. The real thing serves understanding:
where it is hard to read (a long diff, a dense config), a picture that explains it is right instead, a
before and after diagram or a flow. A scene the brief picks shows its thing like this:

| The scene is about… | It shows… |
|---|---|
| a table change | the table, with its labels, the changed row or column wiped in |
| a code change | the diff: the real lines, the removed ones struck, the new ones wiped in (the theme's `blocks/code-diff.html`) |
| a command | its run: the command typed, its real output printed (`blocks/terminal-run.html`) |
| a screen change | the screen before and after, a wipe between them |
| how something looks | a prototype: a real HTML mock of the page or screen, with real words in it; two looks side by side |
| a mechanism | a worked example with real values stepping across the real thing |
| scope | the two scopes as two states of the same thing |
| a risk | the state that goes wrong, marked, then the guard |

In a scene that shows the real thing, a card about it (a "means" card, a "chose / instead" card) is only
for what has no surface: a rule, a count, a decision's two sides. Put the real thing in a container marked `data-artifact="<what it is>"`
(the file or command it comes from). Its own words stay as the files write them: `check-terms` reads them
as glossed in place, never as a word used before it is defined, and an id in them is a warning at most.

**A change across many files: the map, then the one or two places.** Never put every file on screen. A
change that touches many files shows its map first: the files it touches, each with one plain line of
what changes there. Then the one or two places that carry the idea are the real thing, with plain words
pinned on; the rest stay a line on the map. Say a plan changes ten files to put the answer on the
video's own cards. One scene is the map, ten rows (`reelplanner-player.js` · finds the cards and
answers on them; `frame-lint.mjs` · stops a card that moves; `BRIEF.md` · says where the cards go; …).
The next is the player's diff at the one place it finds a card, "answer" pinned on the new button; the
next is the screen before and after. The other eight files are never opened.

**A plain word is pinned to what it names.** A word the video defines is a small label on the code
token, the table column or the button it names (with an underline drawn under it), never a card
floating beside it. The label is marked `data-gloss="<the thing's own word>"` and its text is the
glossary's on-screen word: `<em data-gloss="misses">late fixes</em>` on the `misses` token.
`frame-lint` notes a pinned word outside any `data-artifact`.

A prototype decision frame may drop the diagram, so the two mocks have room. Both mocks are complete and
on screen together for at least 4 s.

### A frame a newcomer can read

Seven rules for how a frame reads, whatever it draws. `frame-lint` fails what a program can see in the markup
(rules 1 and 5); the designer, one of the two fresh agents that look at every video before you do
(`reelplanner fresh-eyes`), checks all seven on a picture of each scene at rest, the player's tab, chips and
captions included.

1. **Show the thing, never a stand-in.** Write the words; never grey lines or an empty box where words go. If the
   words don't matter, leave the box out. `frame-lint` fails empty bars (no text, under 12 px high, over 120 px wide)
   stacked where lines of words would be.
2. **One reading order,** top to bottom, left to right, in the order the narration says it.
3. **A label sits on what it labels, and a qualifier with what it qualifies.** Rule 3 is about where a word sits,
   rule 1 about what is drawn: two real files on the left and, far to the right, a column of chips "kept" and
   "removed" draws the real thing, so it keeps rule 1, and breaks rule 3. Each chip labels one file, so it goes on
   that file's row. A label is on its thing, never in a column of its own.
4. **A question says what you decide.** "Drop the walkthrough video after each build? Approve or not", never "you
   approve, or not" alone.
5. **Nothing covers content.** The player's label, "More in the guide ↓", opens just above the thing a detail
   explains (a faint glyph there while paused): leave 40 px of room above it. `frame-lint` fails another element's
   words, chip or line within those 40 px.
6. **Readable at a glance.** Text at least the theme's floor on screen, text inside a screenshot too: crop a
   screenshot to the part that matters rather than shrink it. Take it at `deviceScaleFactor: 2` (a 1440 px page is a
   2880 px file), PNG for a page of text, so it is at least twice as wide as the frame draws it: the snapshots, the
   guide's pictures and a 2× screen show it that sharp (`frame-lint --notes` names one drawn wider). At most three
   type sizes.
7. **Pleasing.** One focal point; the same gap between like things; the frame used in balance, not a column of chips
   with an empty half.

**The example: one scene, before and after.** Step 6 of the walkthroughs-that-help plan video, at rest, broke four
of them: a grey "What changed" box with two grey lines and two Flag buttons where the words of what changed should
be (rule 1); chips spread across the frame, "plan video · stays", "code check · stays", "if you don't · nothing
changes", each apart from what it is about (rule 3); "you approve, or not", which doesn't say what you'd approve
(rule 4); the page's Open tab on the status line's top edge (rule 5). Redrawn by the rules (the videos-that-make-sense plan video, scene 20): the question says what you'd
decide, "Next plan: drop the walkthrough video after each build?"; each answer sits under it; under Approve, the
plan's row, with "stays" on the plan video's own line and on the code check's, and What changed showing its two real
lines, "Save moved to the top" and "Reviews stored one file a day", each with its Flag; "if you ask for changes, or
don't answer, nothing changes" is the second answer; the status line has room above it for the tab.

**The stage is context, not the subject.** Draw the full stage on the cast beat, on beats that change
it, and on the ending; elsewhere give the frame to what the beat is about. The small mono heading and the
step ticks are optional: a quiet place label (`walkthrough.md · fewer, better stops`) when it helps the
viewer place the scene, the ticks where a scene has room and a reason. `$RP stage-presence <video-dir>`
reports how many beats carry the full stage (over half, and the video probably reads as one long still)
and says so when still ticks sit on most scenes.

**At most six parts on screen.** A beat adds at most one part or edge. A beat whose job is the whole
system (a system video's cast) declares `data-density="full"` on its root, and it should be rare. A
part's label is its `glossary.md` name, never a script or file name. For every frame ask: could someone
new to the repo say what each box does, from its label and the narration alone? If not, rename it,
explain it, or drop it. `$RP frame-lint <video-dir>/compositions/frames/*.html` checks the six-part
limit and the labels, along with hard-coded colours, text in the caption band, small mono text and
tweens on layout properties: run it on frames as they land.

**Look.** The theme (`theme/frame.md`) and the stage snippet from `reel stage` own sizes, fonts and
colours. Beyond them: one accent colour per frame, and it marks the one thing that matters; no
pictograms (a word in a chip instead); no music, particles, gradients or decorative motion; no blur
entrances or idle drift. A worked value is spelled the same way in every frame it appears.

**Motion** is `theme/motion-language.md`: a camera moves over one scene inside a view clipped above the
answer area (y 900); a thing is revealed by its own verb (drawn, typed, wiped, counted, struck); a
transition means something (a cut for a new chapter or a quick check, a push for the next scene of the
same chapter, a crossfade for the same place later, a zoom into code as a cut plus a pull-back). A
question's heading and cards sit outside the camera, or the camera is at rest at scale 1 when the scene
ends: `frame-lint` fails either. Give each scene its `- layout:` (a word: code, table, terminal,
before-after, wall…); `build` warns when over 70% of scenes share one layout or one transition.

**Composition varies by video.** BRIEF.md says the video's medium (screen, code, document, diagram),
its layouts and its main transition, as three lines under Customizations (`- Medium:`, `- Layouts:`,
`- Main transition:`); `build` warns when one is missing. A fourth, optional line, `- Real things:`,
names the scenes that show the real thing; `build` repeats it when it is there and never warns when it
is not.

## 6. Decisions

Every open question in the plan becomes a decision the reviewer makes in the video.

- **Explain before you ask.** The step comes first, with its example; then the fork (the one thing that
  differs); the cost of each side, as a comparison; the recommendation with its reason; then the
  question, as the last words of the beat. If that cannot be said in about 15 s, the question is not
  ready: resolve it in the plan, or give it a part of its own.
- **The decision beat**: `type: cta`, `- decision: q<N>`, `- plan_step: <n>`, `- question:`,
  `- option_a:` … `- option_d:` (two to four), a `- why_a:` … for each, `- recommended: <letter>`. On
  screen the options are short labels; the player pauses at the end of the beat and the reviewer answers
  by clicking a card on the frame. Mark each option card with its letter, `data-option="a"` (and in a
  quick check too), and the question's heading `data-question`. Everything else happens on the frame,
  by the cards: the player draws your-own-words
  as a slot beside or under the cards, a note on the card picked, and small chips (Explain this more,
  Continue) under them; nothing sits in a bar under or over the video, and the video keeps its size. So
  keep the cards whole, clear of each other, with room under them for a line, and give every frame's root
  `data-band="bottom"` with its lowest eighth (y ≥ 945) empty: the chips go there. A frame without
  cards gets the answer bar there instead. A third or fourth option must be one someone would argue for.
- **More behind a card.** A card holds a short label; the reviewer can open more on it (hover, or its
  "More") and on the question ("Full question"). Write `- option_a_more:` … for what the label leaves
  out — one or two plain sentences on what picking it means (the player falls back on `- why_a:`), and
  `- question_more:` when the heading shortens the question or it needs its case. Never a new fact the
  narration did not say.
- **Branch beats**: one per option, straight after the decision, `type: benefit_highlight`,
  `- branch: q<N>=<letter>`. Each shows what changes in the plan under that option: the step gains or
  loses a line, an edge appears, a risk moves. The player plays only the chosen one.
- **Pick all that apply**: tag the decision `- kind: multi`. It has no branches; one summary beat
  follows (`- summary: q<N>`) with an element `data-plan-picks="q<N>"` that the player fills with the
  picks (a list gets one item per pick). Narrate it generically.
- **As many questions as the plan needs**, about one per part. Phrase each option so it makes sense
  without a note, though the reviewer can add one to any answer.
- **Decisions in force** (the plan cites `D-00n`) get no question: a small `decided · D-00n` tag on the
  step and one sentence saying what was decided and that this plan keeps it.
- **Superseded decisions** get a full decision beat: the old choice and why it was made, what changed,
  the new options ("Keep …" among them), a recommendation.
- **The ending** is the resolved plan: the steps with each choice on its slot (the rail slots `reel stage`
  writes carry `data-plan-step`, and the player writes the reviewer's pick into each). Tag it
  `- plan_questions: 1, 2, …`. Show the steps and choices rather than the whole diagram, and end on an
  explicit ask: "draw on any step to leave a note, or approve."

## 7. Quick checks

A quick check asks the viewer to **predict what the plan or the code will do**. A wrong answer finds a
place where the reviewer expected something else, which is what a review is for.

- **At least one per plan step** (in the plan and system videos), **plus more wherever there is
  something to predict**: after any mechanism whose outcome a viewer could guess wrong. A walkthrough asks
  one only where the built change has something to predict (§8).
- **Ask "what happens when…"**, not "what did we just say". The wrong options are what a reasonable
  reviewer might expect instead; they are not jokes or straw men. "When the same review is sent twice,
  how many runs start?" with 0, 1 and 2 is a good check; "which step adds the manifest?" is not.
- **Later, on a new case**, in the plan and system videos. A check asked right after its
  explanation only asks the viewer to remember what was just said, which does not measure learning. So
  step N's check comes after step N+1's scenes, and the last step's at the end, just before the ending (in
  the system video, chapter N's at the end of chapter N+1). A walkthrough's check is the exception: it
  comes just before the scene that runs the change, and asks what that run will show (§8). And it asks about a case the video
  did not show: other names, other numbers, another example, so the viewer applies the rule instead of
  recalling the last sentence. The same number of checks, so the video is no longer.
- **The rule was explained; the case is new.** Every rule the right answer needs was said and shown
  before the check, in words this video defined; the check never carries a new rule. What is new is its
  case: its names, its numbers, its example. Test the step's main idea — not an exception said in one
  clause, not a rule from an earlier decision the video only named, not a count said in passing. If the
  step's title says "one pause per step", the check is about that pause, on a step the video did not draw.
  - Bad, right after step 4's scene: "The video just said step 4 has two calls that stop. How many
    pauses?" It asks what was just said, on the scene's own step and count.
  - Good, after step 5's scenes: "A step with three calls that stop and one off-plan change: how many
    pauses?" Two: the three calls share the step's one pause, and the off-plan change has its own.
- `check-terms` (in `build`) warns on each: a right answer whose words the beat that explains
  the rule (`- explained_at:`, else the beat before) never says or shows (the check's own case aside: the
  words of its question, and a count worked out from its numbers); a check right after that beat; and a
  check on that beat's own case, its question's numbers and names (digits, two to twenty in words, a file
  name, code, an id) all said or shown there, or two of them. In a walkthrough video only the first
  applies.
- **Walk me through it.** Give each check `- walk_me_through:` — two to four plain sentences working
  the check's own new case through with its values ("Three calls stop, and there is one off-plan change.
  The three calls share the step's one pause; the off-plan change pauses on its own. That is two."). After
  a wrong answer the player shows it open and the video waits; after a right one it is a button. The
  review records who opened it (`walked: true`). A check without one fails the build.
- Tags: `type: social_proof`, `- quiz: k<N>`, `- plan_step: <n>`, `- question:`, `- option_a:` …
  (three or four), `- answer: <letter>`, `- explain:` (one sentence, shown after the answer, for 10 s:
  the reason in words, never an id — "a flag that would overturn a logged decision becomes a new plan",
  not "per D-002").
- **The answer shows on the cards.** Once answered, the right card and the reviewer's are marked, and
  each card shows its own why under it: `- option_a_why:` … one sentence per option, why it is right or
  why it is not ("a warning would let the video ship with the word unexplained"); the right card falls
  back on `explain`. `- option_a_more:` and `- question_more:` add words before an answer and must never
  give it away: say what the option means, not whether it is right.
- The player offers "Back to where this was explained": it plays from the beat that explains the rule
  the check applies, named `- explained_at: <frame number or composition id>` (without one, the first
  beat of the check's `plan_step`). It is an earlier beat, never the one just before the check.
- After any answer the player offers "Expected something else? Say how it should work". A wrong
  answer with a note reaches the agent as a comment on that step, and the plan or the code is changed to
  match. Write `explain` so that a reviewer who disagrees can see what they are disagreeing with.

## 8. Walkthrough videos

After the build, the walkthrough video shows **the change running**, not the plan again. The
reviewer approved the plan; what they can judge now is what they can see. It aims for about two minutes
(past 3 the build says it is long), from `walkthrough.md`, which keeps the full record in text.

- **Each change running, before and after** (`type: feature_showcase`, `- plan_step: <n>`, one or two
  scenes a change, not a scene per step retold):
  - **On the screen**, when you'd see it: the real page before and after, the click, what it opens. In
    details-in-the-frame: the corner chip on an older scene, then the same scene with the tab on its code
    block, and a click opening the page over the frame.
  - **In a real run**, when it happens behind the page: the saved file before and after (a review stored
    as one file per review, then one per day), a command's real output (`blocks/terminal-run.html`), a
    migration run on a copy of real data with the rows before and after.
  - The brief picks every change scene as a real thing: `- Real things:` names each of them. Code
    is shown only for a choice about an interface or data, and a change across many files is its
    map, then the one place that carries the idea (§5).
- **The order:** the changes running (with their pauses, below), then at the end what ran (the tests,
  the code check, in a line each), what is not done, and the rest of the choices as one list.
- **What pauses** is a judgment, made for each build and said by the labels in `walkthrough.md`
  (`$RP reel stops <plan-dir>` prints each call, why it pauses or is listed, and the beats). No count is
  fixed or capped.
  - **An off-plan change always pauses** (`- autonomy: d1`), a beat of its own, said plainly.
  - **A choice you'd notice, or can't easily undo, pauses in the scene that shows it running.** You'd
    notice it: it changes what you see or do (the Save button moves, Escape keeps your words). You can't
    easily undo it: stored data and formats, permissions, something other people's code relies on (old
    reviews deleted after a month; saved reviews moved to a new file layout). The page before and after,
    or the saved file before and after, is on screen as it pauses. A step's calls that pause share one
    stop beat (`type: cta`, `- autonomy: a3, a4`, `- plan_step:`): the narration gives each a clause (what
    it chose, instead of what), and each card on the frame (`data-call="a3"`, one card a call, clear of the
    next with room under it) carries its own Accept, Flag and own words; the video goes on once each has a
    verdict.
  - **Every other choice goes on the list** (`- autonomy_list: a1, a2, a5`), one beat at the end: one
    short line says what it is; the player shows each choice in one line (what it chose, instead of what),
    each with its own Flag, and Go on. The line: after the change you see the same page, press the same
    buttons, and the same data sits on disk (a long file split in two, a helper renamed).
  - **A listed choice is listed, not judged**: Go on, or Approve, takes the rest; a later plan
    that touches one is not warned by it, and a flag on it gets it fixed like a flag on a pause.
- **A quick check where there is something to predict**, asked just before the scene that runs it
  (tags as §7, with its walk-through and its `- explained_at:`, the beat that set the change up):
  - **On the screen:** "You have typed a note and press Escape: what happens?", then the scene runs it and
    you see the note kept.
  - **Behind the page:** "After the change, what does the saved file look like?", then the scene shows the
    real file before and after the run; or "The migration runs on a copy of last week's reviews: how many
    are left unread?", then the run prints it.
  - **"The page looks the same" is not "nothing to predict."** A change to what is saved, or to what a
    command prints, is something to predict, shown by a real run: a build that moves each date in the saved
    review file from one field to two, with the page just as before, asks "After the change, what does the
    saved file look like?" and shows the file before and after. Only when the screen, the saved files and
    every command's output all stay the same (a rename, a split file) is there nothing to predict. There is
    no fixed number of checks.
- **The ending** asks one open question, `- open_question: Seeing it run, anything you'd change?`, on the
  last beat: the player asks it again where the review is finished, with room for the reviewer's words,
  which reach the agent with the review.
- **A step with nothing running** (it only changed wording, say) gets no scene; the ending says it in a
  line.
- **Short.** A clause a thing, no recap of the plan, no scene per step. A walkthrough revised after review
  shows what changed; what was accepted is one line.

## 9. Building from the project record

When the repo has `.reelplanner/`, the video is built from it:

- **Names** come from `glossary.md` and `system.json`. A plan that says "upload record" for the
  manifest is corrected to the glossary name in the script, not echoed.
- **The stage** comes from `$RP reel stage <plan-dir>`: the parts in fixed places, so the viewer learns
  the picture once across every video in the repo.
- **Pipelines** in `system.json` are ordered edges; light them one per spoken step, in that order.
- **`$RP reel check <plan-dir>`** runs before the storyboard. The video never asks a question the ledger
  has answered.

## 10. Details: a beat that opens a page

A beat can open one page, a **detail**: the reviewer clicks the thing on the frame the page explains, and
the page opens over the paused frame, grown from that thing. The video still tells the whole story:
it must make sense to someone who opens nothing.

- **A detail holds what the video cannot**: more than a screen shows, something to try, or the evidence
  behind a claim. Before adding one, write the sentence the video would say instead. If that sentence is
  enough, there is no detail.
- **Rarely more than one per beat**, and most beats have none (`check-details` warns on two).
- **The narration says, in one sentence, what opening it gives you.** That sentence is the beat's
  `- detail_why:`, and the player shows it by the thing's tab on hover. The sentence says what to click:
  "click the block to read the whole file".
- **The frame marks the thing the page explains**, with `data-detail="<name>"` on that one element: the
  real thing (a `data-artifact` region: the code block, the table, the terminal run; in the deep-dives
  walkthrough's call A11, the eight-line block of `table.html`), a part of it (one code line, one table
  row, one file on a map), or a pinned word (its `data-gloss` label; in the better-visuals plan video, the
  label "said too early: a warning" on `early.push` could open the rule's whole table). One marked thing
  per detail, the smallest that is still what the page is about. The storyboard's `- detail:` stays the
  source of which details a scene has; the frame only says where. The player lays a clear button over it,
  quiet so the video comes first: nothing drawn while it plays, a faint glyph just above the thing while
  paused, and under the pointer a thin ring and a small grey label, "More in the guide ↓" (a touch: the
  first tap shows them, the second opens); the corner chip goes. So the thing sits above the lowest
  eighth (y < 945), is at least 120 × 44 px, and is at rest
  (it, and any camera it sits in, at scale 1) for the scene's last 3 s: `frame-lint` fails each. While a
  question is up the frame is the cards': the thing's button hides, and a click on it does nothing. A
  frame that marks nothing keeps the corner chip (an older video), as does a thing under 44 px tall on a
  phone.
- **Tags:** `- detail: <name>` (the page is `details/<name>.html`), `- detail_title:`, `- detail_why:`,
  and optionally `- detail_kind:`, a free word the panel shows as its label.
- **Start from a template** with `$RP detail new <video-dir> <name> --kind <template>` (`$RP detail
  kinds` lists them): `explore` (the frame's diagram, live), `try` (a working prototype, its variants as
  tabs), `evidence` (the runs behind a number, the chosen one next to what the plan said), `table`
  (more than four rows, sortable), `code` (only when the code is what is judged, with the lines that
  carry the call marked), `fresh` (a blank page with the theme and the bridge). Any other kind starts from
  `fresh`. The plan's own text needs no detail: the player shows it beside the video.
- **In a walkthrough, a call's detail opens on what judges it fastest**: a behaviour change opens a
  before and after to try, a value the agent picked opens its evidence, a change to an interface or to
  data opens the code. Accept and Flag work from the page's footer too.
- **The page** loads nothing from the network, keeps the bridge script from its template, follows the
  player's light and dark theme (`?theme=dark`), and gives what a reviewer would point at a
  `data-anchor` label so a comment lands on it. `check-details`, run by `$RP build`, fails a missing page,
  a network load, a missing bridge or a page error, and a frame that marks a detail its scene does not
  have; a scene whose thing is marked nowhere is a warning, and fails on a storyboard with
  `details_check: strict` (every new one carries it).
- **Its look: the thing first.** The panel's header already shows the title and the why, so the page
  does not repeat them. At most one sentence before the content; longer setup goes at the bottom. No
  cards or boxes inside boxes; the accent colour (the darker coral) marks only what is yours or
  waiting on you, the call and the part a comment is on, never what is current or a state; say each
  number once. The templates carry the review page's look: its paper, three solid inks and coral,
  and, in the player's panel, its faces, which the player posts to the page. A page built from an older
  template takes today's look with `$RP detail restyle <video-dir>`, its own content untouched.

## 11. Before the storyboard is done

- The whole video is 3–5 minutes (a walkthrough about 2, the system video 5–8), each part about a
  minute; every beat is at least 4 s, and the holds are in `holds.json`.
- The overview says what changes before any step, and each step that needs another says so.
- One `feature_showcase` per plan step, in plan order, each with `- plan_step:` and its anchor.
- Every open question is a decision beat after its step, with its branches or summary.
- At least one quick check per step, each asking for a prediction about its step's main idea, placed
  after the next step's scenes (the last step's just before the ending), on a case the video did not show,
  with an `- explained_at:` naming where the rule was explained, a `- walk_me_through:` working the new
  case, and an `- option_x_why:` per option that says why it is right or wrong. A walkthrough: a check
  wherever the change has something to predict (a saved file or a command's output counts), just before
  the scene that runs it, and one `- open_question:` on its last beat.
- Every option card carries `data-option`, every question heading `data-question`, every call's card on
  a call, stop or list beat `data-call`; each option whose label leaves something out has an
  `- option_x_more:` that does not give the answer away. Every scene with a `- detail:` marks its thing
  `data-detail="<name>"` (§10).
- The front matter says what to know first (`before:` lines, or the system-video default, or
  `before: none`), lists this video's own words (`terms:`), and carries `terms_check: strict` and
  `details_check: strict`.
- Every word a newcomer might not know is defined where it is first said, on a beat tagged
  `- defines: <term>`, or is in a `before:` video's `terms:` (with a recap beat when it matters); no id
  is said or shown without what it is. `$RP check-terms <video-dir>` is clean (`build` runs it first).
- No sentence of this video's narration on screen (a real thing's own words may be sentences); at most 5
  new on-screen words a beat beyond the labels.
- Each scene BRIEF.md's `- Real things:` names has its thing on screen in a `data-artifact`, with its
  words pinned (`data-gloss`); a change across many files shows its map, then one or two places, never
  every file; BRIEF.md says the medium, layouts and main transition.
- At most six parts on a frame; every label is a glossary name; a tool's name is in code markup
  (`reelplanner`), every name as `names.md` shows it.
- Every frame reads (§5, "A frame a newcomer can read"): the thing, never a stand-in (no grey lines or empty box
  where words go); one reading order, the narration's; each label on its thing; a question that says what you
  decide; 40 px clear above a detail's thing, nothing on words; text readable at a glance, at most three sizes; one
  focal point, even gaps, the frame in balance. `frame-lint` checks the first and fifth; fresh eyes' designer all
  seven.
- After the build, fresh eyes looked at it and every finding is answered (the skill's **Build a video**, step 5).
- The narration fits 185–254 words a minute; `music: none`.
