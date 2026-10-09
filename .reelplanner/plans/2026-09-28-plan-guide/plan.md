# The plan guide: the video first, and a full page behind it you can read, check and edit

## The problem

The owner, after the videos-that-make-sense plan video:

> "videos are great for an overview and truly do help a lot with understanding. but we probably want html
> on the backend, that video refers to and the more detail part can point to the interactive html. we
> might have a video then an html that is like a guide, it is one of those cool websites where as you
> scroll down, more things happen. that is on the backend. and the video can refer to it, the video is
> the main part we look at, but if we want more depth or to actually have more say in things and see
> exactly whats happening (say we have 3 classes of changes and want to enumerate what would happen in
> each, what the interface is) we will need to be able to read more. i think we want a new plan for this,
> this is a big change but makes more sense, i think we were naive to think videos would solve everythign,
> i just have less of a guarantee and too many open questions if just video is used. but if we have full
> html plan too then that will give us the completeness we desire. and the video can refer to it, and be a
> summary of the page. still the first place to go, in fact it educates us and ensures we know whats going
> on, then we can edit it. and make actual more deterministic changes like oh i can see how all this
> implemented and i can actually change and be happier with it and more in control."

### What we have

- **`plan.md`** is the whole plan, as text: 2,000 to 7,000 words for the last seven plans. It says what
  each step does, but a step's cases and its interface are there only when the agent chose to write them,
  and in whatever shape it chose.
- **The video** is a summary of it: 770 to 1,060 words of narration for the last three plans, about a
  quarter of their plan. It has to be: a video that says everything is too long to watch.
- **The plan text** beside the video (the Plan switch, L) is `plan.md`'s own words, one section a step,
  the lit step following the video, in a 340 px column (D-063). It is the same text, not more of it.
- **Detail pages** open over a paused scene for what the video cannot hold (D-194, D-195), started from
  six templates in `templates/details/`. They are one page for one scene: the last seven plan videos
  opened two in all.
- **The review page** lists each plan as one row with a Plan | Built switch (D-224, being built now).
  The review you send (answers, marks, comments) is filed by `reel record` into `reviews/<id>.md`, and
  each answer becomes an entry in the decision log (`decisions.md`). On the hosted page the review is a
  row in the page's own store, filed by `reel-intake`.

### Where the video alone left open questions

In the plan reviews since 2026-09-23, a question came back as "explain this more" instead of an answer
seven times across four plans (six asked to explain it more, and D-022 answered "confused by this, need
more information and examples", still reopened), and four plans took three or four rounds. The words are asking to see more:
what happens in each case, and what the thing is exactly.

- deep-dives: "confused by this, need more information and examples" (who writes a detail page, D-022,
  still reopened).
- better-visuals: "what is 'the real thing' mean? need mroe first".
- contributing: "im again confused here bc will they need to rebuild the whole thing then? that is
  annoying for many reasons and for voice, right?" (what happens in each case), and "would B be easy to
  do?" (what B is, exactly).
- walkthroughs-that-help: "what do you think is optimal for us? … i guess it depends." and "wdym dropps
  the video. again this dkind of thing is not explained well how ma i supposed to get more information
  about this???"

Each is a question about something the plan had, or should have had, in more depth than a scene can
give: its cases, its interface, its example. Today there is nowhere to go for that depth, except to
read `plan.md` in the repo, where it may not be written down.

### How this relates to the videos-that-make-sense plan

That plan (approved, and built while this one waited: D-225, D-226, D-227) makes each video make sense
before you see it: a newcomer and a designer, two fresh agents, read it first, and every finding is
answered before the page opens (its steps 1 and 2); a phrase gets a meaning to click, and you can ask about
anything (its step 3, "Ask about this"); seven rules for how a frame reads (its step 4). This plan does not
need it, and it does not need this one. Where both land:

- **Ask about this answers from the guide, and links to it.** The answer says where it came from as a
  link into the guide ("more on the guide · step 3 · cases"), not just "plan, step 3".
- **Its "in plain words" option was not chosen** (D-226 took meanings and Ask about this, not one plain
  sentence a scene): the guide's section is that, and more, so nothing here brings it back.
- **Fresh eyes reads the guide too.** The newcomer gets the guide beside the video; a finding the guide
  already answers is answered by a link to its section. The designer's seven rules apply to the guide's
  pictures as they do to frames (no stand-ins, a label on its thing).
- **Meanings are the same rows.** A word underlined in the captions is underlined on the guide, with the
  same meaning (the glossary and the storyboard's `terms:`).

## What changes

Three changes, in five steps.

1. **The guide** (steps 1 and 2): a page for each plan, built from `plan.md` (and, after the build, from
   its commits and its real runs). It opens with the video, and it exists for two reasons only (after the
   approval, below): it **shows more** than a video can (every case, the whole interface, and after the
   build the full diff and the real outputs, in categories of change), and you **work with it** (drag,
   fill in, predict and then see the real answer). It never says again what the video said.
2. **The video and the guide point at each other** (step 3): the review page's player is the guide's way in
   (after prototype v4, below): a part of the guide opens over the paused frame from the thing it explains, as
   a detail does, and each part has "Open the full guide" at its section; each section and category of the
   full page has "Watch this moment" back into the player; the video stays the first place to go.
3. **You edit the plan on the guide** (step 4): a comment on any line, or an edit to a step's text, a case
   or an interface, which the agent applies exactly and the decision log keeps.
4. **After the build, and which plans** (step 5): the guide gets a Built side, the real interfaces beside
   the planned ones; and which plans get a guide.

This plan comes with a prototype of its own guide: `guide-prototype.html` in this folder, one page, written
by hand (the third version, after the owner's notes below). It shows the idea, not the finished builder: a
short scroll story, then the complete plan with an outline, a search and "Expand all"; every case row opens
its trace, every interface part what it is and a try-it, every decision its ledger entry; questions
answered in place, reshaping the picture; a comment or an exact edit on any line. `research-scroll-pages.md`
is the research it follows (scroll-driven pages measured, and what makes one read as "the whole page
changes": under about 60 words a screen, one stage filling most of it), and `spike-generated-guides.md`
what a builder can make from any `plan.md` today, tried on three plans. After the approval,
`guide-v4-videos-that-make-sense.html` is the fourth prototype, made the owner's new way (below) for a plan
that is built and accepted, so it shows real diffs and real outputs: the video first, then what changed in
categories, then things to do with it. `guide-v5/` is the fifth (after prototype v4, below): the parts of the
guide the player opens over the frame, and the full page they open, built by `guide-v5/build.mjs` from git and
v4's data.

## After the owner's notes

The owner, on the first prototype (a picture beside a column of `plan.md`'s text):

> "it is just a wall of text, not interactive at all, like i meant for the whole page to change not just a
> subset of it"

And then:

> "we should be able to be interactive too on a page, and the html doesnt need to match what a video would be
> directly … video more higher level narrative, html still can have story but should be more about ensuring
> we have all information we need and all is visible. and in either case should be housing the more detailed
> information somewhere we can open w progressive disclosure, we should be able to actually see more too and
> be able to read and interact clearly."

What this revision changes:

- **Step 1** now says what the page is: not the video's scenes replayed. The video is the higher-level story;
  the guide opens with a short scroll story (the problem, the system drawing itself, what changes), then is
  the complete plan: each step's section with a picture that reacts, and every case, interface, example and
  decision visible in layers, a click opening the next (a case row to its full example, an interface part to
  its full spec, a decision to its ledger entry). Nothing is only in motion; every hidden layer has a
  visible way in. The two-column page it described before is gone.
- **Step 2's check** also fails a missing layer, a hidden layer with no visible way in, and anything shown only
  in an animation.
- **Step 3**: each beat of the guide, not only each section, has its "Watch this part".
- **Step 4**: you also answer the plan's questions on the guide, in the same review.
- **Question 2** keeps its recommendation (its own page), and option A's cost now says what beside the video
  means for a page that fills the screen.
- The prototype was rebuilt that way (the lead's; published for the owner), and the plan video's step 1 and
  the scenes that showed the first prototype were rebuilt.
- **Then a spike** built guides from three plans with no hand-written content (`spike-generated-guides.md`).
  Step 2 now states the blocks exactly where the builder needs it (a trace a case row, a meaning a line of
  each interface block, a step on every "Decisions in force" line), says what is generated and what the
  agent writes (only the four blocks and the pictures a step or a question needs), and `guide --check`
  lists every gap instead of failing on it. A plan can add its own parts to the parts picture (step 2), and
  the build warns on a missing scene picture (step 3). The cost (step 5, question 4) takes the spike's
  estimate for the deeper layers. This plan's own tables and interface blocks were written before that rule:
  they have no Trace column and no `#` meanings yet (the prototype's traces were written by hand); its
  "Decisions in force" lines now end with their step.
- **The page's words match the third prototype**: a step's full text opens in place ("The step in the
  plan's words"), not in a drawer, and "Expand all" opens every layer ("Story as text" for the story at
  the top); the page no longer has a "Read as text" switch.

## After the approval

The plan was approved (`reviews/plan-20260928T190542Z.md`): question 2 is D-228 (its own page), question 3
D-229 (suggested edits, applied exactly), question 4 D-230 (every plan, with a Built side). **Question 1 was
left unanswered** in the approval; the owner has since answered it with its recommendation, A: `plan.md` is the
one source, the guide built from it (D-244). The steps below are written with it.

**The quick check missed** (step 4): "You change one row of step 2's cases table, a row no scene shows, and
ask for changes. What is rebuilt?" was answered "Step 2's scenes, and the guide"; the answer is "the guide
only". Step 4 now says the rule so that the answer is plain: a scene is rebuilt for the words it says or
shows, not for the step it belongs to.

Then the owner, on what the guide is for:

> "i am mostly wondering on video vs plan vs guide synergy, what we can do to make sure theyre all useful,
> rn the guide a bit too much text, maybe too structured or hard to follow? like is it just copying the
> video? if it is a video we show the video, i think the idea was that we can stop and be more interactive
> somehow here? the main thing with the guide is that 1) it can show more, like more full diffs in the code
> or real outputs instead of just parts of it. and it can be longer like if we want to actually read what
> changed, and we can better summarize what changed in an organized manner that isnt as constrained as the
> text is. and 2) the user can interact with it; quick check isnt just clicking an answer, or reading the
> plan is not just scrolling but dragging things, filling in, etc. we want a real reason why this guide
> exists, and it is the two points above, but we should always have a video as the start of it, that is
> first, then we elaborate on it here, and we can click at various points in the video where we want to
> see the entire thing, like code diff summaries or split into categories of changes and summaries there
> that encode more information."

What this changes:

- **The guide has two reasons to exist, and only two.** (1) **It shows more** than a video can: all of
  it, not the part a scene has room for, and long where reading needs it, but organized. (2) **You work
  with it**: drag, fill in, put in order, predict and then see the real answer; never an answer to click,
  never a page only to scroll. Anything on the page that is neither is cut.
- **The video first.** The top of the guide is the plan's video, playing inline. Under it, its timeline
  with the moments marked; each moment has **See the entire thing**, which goes to that thing's depth
  below, and each section and category has **Watch this moment** back ("Watch this part" before). The
  scroll story that opened the page is gone: the video is the story (`research-scroll-pages.md` stays as
  the record). GSAP goes with it.
- **Never the video again.** The guide does not restate the narration: no section opens with what a scene
  already said. Its first layer is headings, short summaries with counts, and the real things.
- **Categories of change.** Each step's depth is organized as the kinds of change it makes, each with a
  summary of two or three lines and its counts, and the whole of it behind: on the plan side, the step's
  cases (each a class of change, with its full trace) and its full interface; after the build, the full
  diff of that category's files and the real outputs of its runs.
- **Manipulations, checked against the real thing.** Each step's section has something to do: drag each
  case onto what happens to it, put a trace's beats in order, fill in what a command prints, then reveal
  the plan's answer, or after the build the real output. The quick checks stay the video's.
- **Much less prose.** The step's full text is one click down ("The step in the plan's words"), not the
  page's body.
- **Where each lands:** step 1 says what the page is (the video, then two reasons); step 2 what the blocks
  and the check now need (real diffs and outputs come from the build and the runs, never written by hand;
  every manipulation's answer comes from a block or a run; nothing on the first layer repeats the
  narration); step 3 the moments and their links; step 5 the Built side, where showing more matters most
  (the full diff and the real outputs, in categories).

## After prototype v4: the guide lives in the player

The owner, on prototype v4 (`guide-v4-videos-that-make-sense.html`):

> "why does videos that make sense eschew our whole viewer and normal video thing? i dont like the videos that
> make sense guide thing it has removed some interaction, doesnt show full code easily. in top of the guide we
> want the real full video how we have it normally in the normal video viewer. actually we might just use the
> main video one and then be able to click places in the video to see parts of the html, and then the more full
> html opens"

Then, on the first build of it:

> "in the html guide part i want to be able to highlight text and it has a review box pop up, just like when we
> mark up the video and a box pops up too"

> "why is the visuals of the guide bad, it is more chunky, not fully interactive or flow-y like before, it should
> be more flow-y"

> "we will have more of a conversation with it and the video"

> "guide unifies the detail chips in the video, right?"

v4 put a bare `<video>` at the top of the guide, and lost what the review player has (the stops, the answers on
the frame, marks, captions and their meanings, details, Ask about this); its diffs hid the code behind folded
hunks. What this changes:

- **The player is the guide's way in.** The guide has no video of its own. At the moments v4 linked ("See the
  entire thing"), the player offers the guide's part for that moment the way a detail opens today: over the
  paused frame, grown from the thing it explains (the frame's `data-detail` mark), or from the corner chip where
  the frame marks nothing, or from the plan text's "Open:" list. Everything the player does stays: the stops,
  the answers, marks, captions, Terms and Ask.
- **The guide and details are one system.** Every "open more" in the player is a part of the guide, and a
  video's detail pages (`details/`) are its parts, and sections of its full page. On screen there is one name
  for what opens, **Guide** ("Guide · step 2" in the panel's header, "Open the guide: …" on the thing); the kind
  a part was started from follows it ("Guide · Table · step 3"). The glossary's row "A detail" becomes "A part
  of the guide" when this plan is built, and the system video's scene that defines it is rebuilt then.
  `check-details` checks the parts as it checks details today.
- **Each part opens the full guide at its section.** The panel's header has "Open the full guide · <the part>";
  the full page is every part, one flow, and every section and moment has "Watch this moment", which goes back to
  the review page's player at that time (`?project=<video>&t=<seconds>`), not a copy of the video. It is
  published beside the video (`<video>/guide/index.html` in the bundle), and the plan's row on the review page
  has **Guide** beside Plan | Built. A video with parts but no guide of its own gets a full page made from its
  parts.
- **Full code, easily.** In a part's diff every file is open: its changes with ten lines around them, or its
  **Whole file** (the file at the plan's last commit that touched it, the lines `git blame` gives to this kind's
  commits marked), line numbers, Copy; **Show all code** gives the diff the page's width with every file whole.
  A line's number takes a comment.
- **Highlight to review, and a conversation.** Words selected anywhere in a part (a sentence, a diff line or
  lines, a run's output, a table cell) open the player's note box on them, as a mark's box opens on the frame:
  **Comment**, **Suggest an edit** (on the plan's own words only, D-229), or **Ask**, which is Ask about this: the
  same thread and the same one who answers (Claude on a hosted page with `sample`, the waiting session on the local
  page, else the review). On the full page the box is the same, and what it keeps goes into the same review.
- **A flow, not boxes.** The page reads as v3 did: one scroll, beats on the left and a stage on the right that
  becomes each beat's real thing (the change's map, every line of it, a run as it ran, the data, something to
  do), no tabs and no cards; one column on a phone, each beat's thing under it.
- **v4's layout is dropped**: the bare video at the top, its timeline and moments list, and the depth behind tabs.
- **While a question is up** (D-246, superseding D-206): a click on a marked thing opens its part over the frame;
  the question folds, and closing the part brings it back as it was left, the words typed and the note included.
  Only where the thing lies under one of the question's cards does the card win.

`guide-v5/` builds this for videos-that-make-sense: its walkthrough video's scenes 1, 2, 3, 7, 9, 10 and 11 mark
the seven kinds of change (the map, the new command, the build gate, Ask, the frame rules, the system video,
tests; the skill sits with the map, its only place in the video), and the full page is built beside it, not
committed. Those seven scenes had fresh eyes for their marks, three rounds (D-227): the designer found the Open
tab covering the first line of what it opens, so the player now puts the tab just above the marked thing, in the
40 px frame-lint keeps clear there (rule 5), and scenes 1 and 10 give their marked things that room; the rest
of what the agents found is about the scenes as build 1 made them, and kept.

## Steps

### Step 1 — The guide: a page for each plan, built from plan.md (question 1)

*Independent.*

A new command, `reelplanning guide <plan-dir>`, builds the plan's guide, `<plan-dir>/guide/index.html`:
one self-contained page, in the review page's look (its paper, three inks and coral, D-167; light and
dark), readable on a phone. `reelplanning build` runs it for a plan video, in finish-project, after the
plan map, so the guide knows each scene's time. It takes about a second. It shares the review page's fonts
and its player, for the video at the top; with no scroll story, it carries no GSAP.

**What it is made from** is question 1. The recommendation: `plan.md` stays the one source, and the guide
is built from it each time, so every tool that reads `plan.md` today (`reel check`, `reel stage`, `reel
record`, `reel audit`, the plan map, the code check) keeps reading it.

**Two reasons, and only two** (after the approval). The video is the overview and the first place to go;
the guide never says again what it said. It is there for what a video can't do:

1. **Show more.** All of it, not the part a scene has room for: every case with its whole trace, the
   whole interface, the step's full text; after the build, the full diff and the real outputs (step 5).
   Long where reading needs it, and organized: each step's depth is its **categories of change**, each a
   summary of two or three lines with its counts (cases, interface parts; after the build files, lines + and
   −, tests), the whole thing behind it. On the plan side a step's categories are its cases (each a class
   of change) and its interface; after the build, the walkthrough's categories (step 5).
2. **Work with it.** Each step's section has something to do with the plan, checked against the plan's
   answer, or after the build against the real result: drag each case onto what happens to it, drag a
   trace's beats into order, fill in what a command prints, predict and then reveal. Never an option to
   click, never a page only to scroll.

**The video first.** The guide's way in is the review page's player (after prototype v4): at each moment
(a scene, or a run of scenes on one thing, from the plan map) the player opens that thing's part of the guide
over the paused frame, and the part opens the full page at its section. The full page has no video of its
own: each section, category and moment has **Watch this moment**, which goes back to the player at its time.

**Then one section a step**, in plan order: its heading, the moments that show it, its categories of change
(each a summary that opens to the whole), what to do with it, and its open question, answered in place. At
the end, the decisions in force and what the plan does not do. A step whose change needs a picture has one
(the plan's parts, from `reel stage`, the ones the step touches lit and its change drawn on); a picture is
there to be used (a case dropped on it lights its path), not to retell a scene.

**Everything visible, in layers (progressive disclosure).** The first layer is short: a category its
summary and counts, a case one line, an interface its command, a decision its id and what it chose. Nothing
on it repeats the video's narration. A click opens the next layer in place, never somewhere else:

- a case row opens its full example trace: the example moving through the parts, a beat at a time, what you
  see and what is saved at each;
- an interface part opens its full spec: every flag, field or argument, what it prints, and a try-it where
  it can run (choose the flags, see the output the plan says);
- a decision opens its ledger entry: chosen, not chosen, the note, the plan it came from;
- "The step in the plan's words" opens a step's whole `plan.md` text in place, under its heading;
- after the build, a category opens its full diff and its real outputs (step 5);
- "Expand all" opens every layer of the page at once (and "Collapse all" closes them). Nothing opens in a
  drawer or a separate panel: each layer opens where it is.

**Interactive.** Besides what to do with each step, you answer the plan's questions on the guide (each is a
card whose options reshape the picture into that option's world), comment on any line, and suggest edits in
place (step 4).

**Nothing is only in motion, or only by dragging.** Each picture's end state is in the page as it loads;
with reduced motion (the system setting) each picture is still. Every hidden layer is behind a control you
can see (never hover only). Every drag can be done with the keyboard (pick up with Enter, move with the
arrows or a number, drop with Enter), and every answer can be opened without doing it ("Show me"). Every
section, category and moment has an address you can link to, and Tab reaches each control. On a phone the
video stays on top, and the outline folds into a menu.

**How the agent writes it.** Nothing but `plan.md`: the builder draws the default pictures from the
plan's steps, its case tables and `system.json`. A step whose idea needs its own picture gets one, as a
fragment the agent writes from a template (`templates/guide/picture.html`, with a state per case), like a
detail page. A fragment follows the detail rules: nothing from the network, the review page's tokens, a
state per scroll position.

#### Cases

| Case | Example | What happens |
|---|---|---|
| A new plan | this plan | `reelplanning build` of its video writes `guide/index.html` beside it |
| A plan revised after review | step 3 rewritten | the guide is built again from the new `plan.md`, all of it, in about a second |
| An older plan, no video rebuild | walkthroughs-that-help | no guide until someone runs `reelplanning guide` on it; its blocks may be missing (step 2's check does not run on it) |

#### Interface

```
reelplanning guide <plan-dir> [--check] [--out <file>]
  ✓ .reelplanning/plans/2026-09-28-plan-guide/guide/index.html · 5 steps, 4 questions, 38 KB
```

- `<plan-dir>/guide/index.html`: built, never edited by hand, never committed (like a render; the plan
  folder keeps its text only, D-213).
- `<plan-dir>/guide/<step>.html`: a picture fragment the agent wrote, committed.
- `scripts/guide.mjs` builds it; `scripts/lib/plan-md.mjs` (which already reads the steps) also reads each
  step's blocks.

#### Example

This plan: `plan.md` has five steps and four questions. `reelplanning build …/video` writes the video,
then the guide: the video at the top, its moments under it, then five sections. Step 4's section has its
six cases, each a line (a class of change on the guide) that opens its trace, the edit moving from the
guide through the review, the review file and `plan.md` to what is rebuilt (or stopping at `decisions.md`,
for the edit that overturns a decision). To do with it: drag each of its four edits onto what is rebuilt
(the guide only; the guide and a scene; not applied), then reveal the plan's answers. The video's moment on
step 4 (scene 20) has "See the entire thing", which lands on step 4's cases, and each case has "Watch this
moment", which plays scene 20.

### Step 2 — Complete, and checked: every step's cases, interface, example and decisions

*Needs step 1.*

Each step in `plan.md` gets four short blocks, under its text, as `####` headings. They are what a
reviewer needs to judge the step, and what the check reads. A spike built guides from three plans with no
hand-written content (`spike-generated-guides.md`): the frame of a guide comes out of any `plan.md`, and
the deep layers stop exactly where these blocks are loose, so two of them are stated exactly:

- **Cases**: a table, one row a case: each kind of input or situation the step handles, a real example,
  what happens (what you see, what is saved), and a fourth column, **Trace**: the beats in order, what
  happens first, next and last, each a few words with a label ("you write: …; sent: …; filed: …; you see:
  …"). "Three classes of change" is three rows, and every class the step's text names has its row. The
  guide draws the trace a beat at a time; it cannot split prose into beats, so the author writes them.
- **Interface**: what someone or something else uses: a command with its flags and what it prints, a file
  with its fields, a function with its arguments, a storyboard tag, what a page shows and each control on
  it, all inside the block, one part a line, each with a one-line meaning after `#`
  (`--check   # also check the page, and list what is missing`). Or one line saying there is none: "No
  interface: wording only".
- **Example**: one worked example with real values, from start to end (this plan's own, when it can be).
- **Decisions**: generated, not written: this plan's answered questions (from the decision log, by step),
  the decisions in force this step keeps, and its open question. So every line of "Decisions in force"
  ends with the step it keeps, "(step 4)", or "(all steps)"; `reel check` warns on a line with neither.

**What is generated, and what the agent writes.** The builder makes, with nothing written for it: the video
at the top and its moments, with "See the entire thing" and "Watch this moment" (from the plan map), the
parts each step touches (from "Components touched", which already says "(steps …)"), each step's categories
and their counts, each step's Decisions, the questions, answered or open, what to do with each step (below),
and the Built side (from `walkthrough.md`, git and the runs: step 5). The agent writes the four blocks, and a
picture only where a step needs one: a fragment
for the step's own change (an edge drawn on, a file, a field), and a picture state for each option of a
question that should reshape the picture. `system.json`'s parts are the pipeline's; a plan whose story needs
its own things (here `plan.md`, the guide, `reviews/<id>.md`) lists them under an optional `## Parts`, and
the parts picture draws them too.

**Real diffs and outputs are never written by hand** (after the approval). A diff on the guide comes from
git, over the commits `walkthrough.md` names; an output shown as real comes from a run the implement step
saved (`runs/`, step 5), whole. Before the build, what a step's Interface block says a command prints is the
plan's, and the page marks it "planned", never styled as a real run.

**What to do with a step comes from its blocks**, so the agent writes nothing more for it: its Cases give
"drag each case onto what happens" (the What happens column is the answer) and "drag the beats into order"
(the Trace is the answer); its Interface's printed lines give "fill in what it prints" (the plan's lines,
then after the build the real run's); a question's options give "predict, then see that option's world".
A step with none of these (no cases, "No interface") has nothing to do, and the page doesn't invent one.

**`reel check` checks them**, on a plan written after this ships: a step with no Cases table, or no
Interface block and no "No interface" line, fails; an open question whose options have no example
fails (the "explain this more" we keep getting). A case row with no trace, an interface line with no
meaning, and a "Decisions in force" line with no step are warnings. The guide's own check, `reelplanning guide --check`, run
by the build, fails when the page drops anything `plan.md` says (every heading and every paragraph lands
in the page), a video moment points to a section that does not exist, a step has no scene and does not
say "not in the video", or the page errors, loads from the network, or scrolls sideways at 375 px. It also
fails when a layer is missing or can't be reached, in the page as built:

- every case row opens its full example, every interface part its full spec, every decision its ledger
  entry, every step its full text, and after the build every category its full diff;
- every hidden layer has a visible control (a button or link, reachable with Tab), never hover only;
- nothing is only in an animation, and nothing only by dragging: with reduced motion (and with "Expand
  all") every layer can still be opened and every picture shows its end state, and every drag can be done
  with the keyboard and its answer opened without it;
- nothing is made up: an output shown as real that has no file in `runs/`, or a diff over a commit that
  isn't in the repo, fails;
- nothing restates the video: a sentence of the narration (the plan map's) on the page's first layer
  fails.

It also **lists every gap** without failing on it, and the page shows each one where it is, as a dashed "Not
written in plan.md" box, never filled in by guessing: "step 3 · case 2: no trace", "step 1 · interface part
`--out`: no meaning", "D-213: no step", "scene 1: no picture". It fails only on what is listed above. So an
older plan run through `reelplanning guide` gets a guide with its gaps shown, as the spike's two older plans
did (16 and 21 gaps).

#### Cases

| Case | Example | What happens |
|---|---|---|
| A step with its four blocks | step 4 of this plan | passes |
| A step with no Cases table | "Step 3 — Rename the flag" with text only | `reel check` fails: add a table, even one row |
| A step with nothing anyone else uses | a step that rewords the help text | passes with "No interface: wording only" |
| A step the video leaves out | a step that only moves a file | passes when its section says "not in the video" |
| A case shown only in its animation | step 4's second case, its trace drawn on the stage but not in the text | `guide --check` fails: the trace's words go in the case's layer |
| A layer with no way in | a decision's ledger entry shown only on hover | `guide --check` fails: give it a visible control |
| A case row with no trace | step 3's second row, its Trace cell empty | `reel check` warns; the guide shows "Not written in plan.md" in its trace, and `guide --check` lists it |
| A decision in force with no step | "D-213 … not either." with no "(step N)" | `reel check` warns; the decision is listed under the whole plan's decisions, not a step's |
| An output typed in, not run | step 1's Built side showing a `guide` run no file in `runs/` holds | `guide --check` fails: save the real run, or show the plan's line marked "planned" |
| A summary that says the scene again | step 3's first line is scene 14's sentence | `guide --check` fails: the first layer says what the video didn't (counts, the classes, the real thing) |

#### Interface

```
reel check <plan-dir>
  ✗ step 3 has no Cases table (a table under "#### Cases", one row a case)
  ✗ question 2's option B has no example
  △ step 4 · case 3: no trace · step 1 · interface part --out: no meaning · D-213: no step
reelplanning guide <plan-dir> --check
  ✓ 5 sections, every paragraph of plan.md in the page; 24 scenes → 5 sections; no error at 375 px
  ✓ 17 cases, 9 interface parts, 53 decisions: each opens its layer, each by a visible control
  ✗ step 4 · case 2: its trace is only in the animation (no words in the page)
  ✗ step 1 · Built: "✓ …/guide/index.html · 5 steps" shown as a run, and no file in runs/ holds it
  gaps, shown on the page: step 4 · case 3: no trace; scene 1: no picture   (listed, not failed)
```

#### Example

Step 4 of this plan names its kinds of edit (a comment, a suggested edit applied on request changes or on
approve, and an edit that overturns a decision): its Cases table has four rows, its Interface shows the review's `edits` field and `reviews/<id>.md`'s new section,
and its Example follows one edit from the guide to `plan.md`.

### Step 3 — The video and the guide point at each other (question 2)

*Needs step 1.*

The video stays the first place to go: it explains, in order, in about four minutes. The guide is where
you go for more, and back.

- **From a scene to its section.** Every scene with a `- plan_step:` points at its step's section; a
  scene can point at a part of it with `- guide: step-3#cases`. Where the video leaves something to the
  guide, the narration says so in a clause ("the three cases are on the guide"). On the review page the
  thing a scene's part explains opens it over the frame (the frame's mark, else the corner chip, and the plan
  text's "Open:" list), a part of the guide as a detail opens today (after prototype v4); the part's header has
  "Open the full guide · <the part>", which opens the full page at that section.
- **From a section to its scene.** Each section, each category and each case has "Watch this moment
  (1:42)" (it was "Watch this part"): a small picture of the scene at that time, which goes back to the review
  page's player there (`?project=<video>&t=102`). A category with no scene of its own shows its step's first
  scene.
- **From the review page's row.** Each plan's row has Guide next to Plan | Built.
- **A missing picture is said.** "Watch this moment" shows the scene's picture from the plan map;
  `reelplanning build` warns when a scene's picture file in the plan map is missing (the spike found
  walkthroughs-that-help's map pointing 11 of its 18 scenes at files that are gone).

**Where the guide opens** was question 2, answered B (D-228): its own page, a click away, sharing the
review in progress, so a comment on the guide goes out with the same Send. After prototype v4 its parts also
open over the frame, as details do, and the full page is a click from each part; a note or a question kept on
the full page goes into the same review as the player's.

#### Cases

| Case | Example | What happens |
|---|---|---|
| You click the marked thing on a scene | scene 12, step 3 | its part of the guide opens over the paused frame |
| You click "Open the full guide" in a part | step 3's cases | the full page opens at step 3's cases |
| You click "Watch this moment" on a section | step 5 | the review page's player, at step 5's first scene |
| A question is up, and you click the marked thing | a quick check on scene 12 | its part opens over the frame; closing it brings the question back as it was (D-246) |
| A scene with no step | the opening scene | points at the guide's top (the problem) |
| A section with no scene | a step marked "not in the video" | no "Watch this moment"; the section says the video leaves it out |

#### Interface

```
STORYBOARD.md    - guide: step-3#cases           (optional; default: the scene's plan_step section)
plan-map.json    frames[i].guide = "step-3#cases"
review page      index.html?project=<video>&t=102   (opens at 1:42; "Watch this moment")
a part           <video>/details/<part>.html     (over the frame; the bridge's "select" opens the note box on words)
guide            <video>/guide/index.html#step-3 (each section's id: step-<n>, and -cases, -interface, -cat-<n>)
```

#### Example

You watch this plan's video on the review page. At step 4's scene you click its marked thing: step 4's part
of the guide opens over the frame. You press "Open the full guide": the page opens at step 4's cases. You drag
its edits onto what each rebuilds, reveal the plan's answers, select the second row and suggest an edit, press
"Watch this moment", and the player plays on from step 4.

### Step 4 — Edit the plan on the guide: comments, and edits the agent applies exactly (question 3)

*Needs step 1; step 3 for the shared review.*

You answer, comment and edit right in the page, and it all goes out in the same review as the video's:

- **An answer to a question.** Each open question is a card at the end of its step's section, its options
  with their examples; hovering or choosing an option reshapes the picture into that option (question 2's
  three places for the guide, say). Choosing one answers it, the same answer as on the video: one answer,
  whichever place you gave it, the later one kept.

What "edit it" means is question 3. With the recommendation, the guide takes two kinds of change, and a
third stays where it is today:

- **A comment on any line.** Click a sentence, a case row or a line of an interface: a note box opens on
  it, as on a detail page (the same `data-anchor` marks). It goes into the review as a comment on that
  step, and the revise step acts on it as on a comment on the video.
- **A suggested edit.** "Edit" on a step's text, a case table or an interface block makes it editable in
  place: change a word, a cell, a flag. Save keeps what it said and what you changed it to. The review
  carries each edit, `reel record` files it under **Edits to apply** in `reviews/<id>.md`, and the decision
  log keeps it as one entry (chosen: your words; not chosen: the plan's), since an edit is an answer.
  The revise step applies it to `plan.md` exactly as written, then runs `reel check`. If the edit would
  overturn a decision in force, or the plan moved since, it is not applied quietly: the next version asks
  it as a question.
- **A direct edit** is you changing `plan.md` in the repo, as you can today; the agent treats it as the
  new plan and rebuilds.

**What is rebuilt.** Two rules, and nothing else:

- **The guide, always, all of it.** It holds every word of `plan.md`, so any edit changes it; it takes a
  second.
- **A scene, only when the words it says or shows change.** Not the scenes of the step the edit is in: a
  scene belongs to a step, but it is rebuilt for its own words. The revise step looks for the edit's
  `before` in each scene's narration and frame (the plan map has both); a scene that has it is rebuilt,
  keeping its id, and no other.

So a step can change and none of its scenes: **a row of step 2's cases table that no scene shows** (scene
12 names step 2's four blocks, and shows none of its eight rows) **rebuilds the guide only**. And a scene
of another step can change: step 1's `--out` renamed `--to` is in the words or frames of scenes 12, 20 to 23
and 26 (step 2's example, step 4's edit and its question, step 5's Built side), so it rebuilds the guide and
those six, and no scene of step 1. With Approve,
nothing is rebuilt but the guide, as today: the edits go into `plan.md` and the build goes on. (This is the
quick check the approval missed: "Step 2's scenes, and the guide" was the answer given; "the guide only" is
the answer, because no scene says that row.)

#### Cases

| Case | Example | What happens |
|---|---|---|
| An answer on the guide | question 2 answered B on the guide, not yet on the video | the review carries q2 = B; the video's question 2 shows it answered |
| A comment on a line | "why 375 px?" on step 2's check | a comment on step 2, acted on by the revise step |
| A suggested edit, request changes | step 1's flag `--out` renamed `--to` | applied to `plan.md`; the guide is rebuilt; the six scenes whose words or frame have `--out` (12, 20 to 23, 26) are rebuilt |
| A suggested edit to a row no scene shows, request changes | step 2's row "A layer with no way in": its example changed | applied to `plan.md`; **the guide only** is rebuilt: no scene says or shows that row, so none of step 2's scenes is rebuilt |
| A suggested edit, approve | a case row's words changed | applied to `plan.md`; the guide is rebuilt; no scene |
| An edit that overturns a decision | removing D-213's "never committed" | not applied; the next version asks it as a question |

#### Interface

```
review (annotations.json)   edits: [{ step: 1, block: "interface", before: "--out <file>", after: "--to <file>", note?: "…" }]
reviews/<id>.md             ## Edits to apply
                            - **Step 1 · Interface**: `--out <file>` → `--to <file>`
decisions.md                D-2xx — Step 1's interface: the reviewer's edit
                            - **Chosen:** `--to <file>` · **Not chosen:** `--out <file>` (the plan's)
```

#### Example

You change step 1's `--out <file>` to `--to <file>` and ask for changes. `reel record` files it, the
decision log gets one entry, the revise step replaces those words in `plan.md`, `reel check` passes, the
guide is rebuilt, and the six scenes whose words or frame have `--out` (12, 20 to 23, 26) are rebuilt; the
video plays just that change. Had you changed a row of step 2's cases instead, the revise step would find its words in no
scene, and only the guide would be rebuilt.

### Step 5 — After the build, and which plans get a guide (question 4)

*Needs steps 1 and 2.*

After the build, each step's section gets a **Built** side, switched by the same Plan | Built switch as the
review page (D-224; every plan gets one, D-230). It is where the guide's first reason, showing more, matters
most (after the approval): the walkthrough video shows the change running in about two minutes (D-219), and
the Built side holds all of it, organized.

- **The walkthrough video first.** On Built, the video at the top is the walkthrough video, its moments
  marked, each with "See the entire thing" into the Built side.
- **Categories of change.** What landed, grouped by kind (for videos-that-make-sense: the new command, the
  build gate, the player's Ask, the frame rules, the skill, the tests), each with two or three lines and its
  counts (files, lines + and −, tests), made from git: the plan's commits, and each category's paths.
- **The full diff** behind each category, in a diff viewer: its files listed, each hunk folding, + and −
  marked. Never cut to "the interesting part" (D-023 is about the walkthrough video, which still shows code
  only where it is justified).
- **The real outputs** of the runs that show it, whole (`runs/`): the command, what it printed, its exit
  code. And full data as a table you can filter (a fresh-eyes round's findings, every one).
- **The interface as built** beside the planned one, differences marked, and the choices the agent made
  alone for that step, each with its scene in the walkthrough video.
- **To do with it, against the real thing:** predict what the build prints, then see the real run; sort
  real findings by what their author did, then see the answers; move a label onto its thing on a real frame
  while `frame-lint`'s verdict follows.

None of it is written by hand for the guide: `walkthrough.md` names the commits and the categories, and the
runs are saved as they ran (step 2).

Which plans get a guide, and whether it gets its Built side, is question 4. It costs agent time, mostly in
writing the blocks: this plan's blocks add about 1,000 words to `plan.md` (a quarter more). Our estimate
is ten minutes of the agent's time and 20,000 tokens more a plan, most of it reading the code to get each
interface right. The deeper layers step 2 asks for (a trace a case, a meaning a line of each interface, a
picture where a step or a question's options need one) add about as much again, by the spike's estimate:
10–15 minutes and 15–25k tokens more for a five-step plan. So a guide costs about 20–25 minutes and
35–45k tokens a plan in all. The builder and its check take seconds. The Built side reads
`walkthrough.md`, git and `runs/`, so it costs the implement step a few lines a step (the commits, a line a
category) and saving each run it quotes, which it already runs: minutes, not more.

#### Cases

| Case | Example | What happens |
|---|---|---|
| A plan built and walked through | this plan, once built | each section has Plan and Built; Built shows what landed |
| A step with nothing built yet | step 5 waiting on a review | its Built side says "not built yet" |
| A step built differently from the plan | an off-plan change | the Built side marks it, with its scene in the walkthrough |

#### Interface

```
walkthrough.md   ### Step 1 — … then, new: #### Interface as built (the real command, file or function)
walkthrough.md   **Commits:** 4dc6bfc df9c961 …          (the plan's commits, each step's)
walkthrough.md   ## Categories of change
                 - **The build gate** (`scripts/verify.sh`, `scripts/lib/fresh-eyes.mjs`): a finding with no answer stops it
runs/<name>.txt  $ reelplanning build …   the command, then what it printed, whole, and `exit 1`
guide            Plan | Built on each section (B); the header's switch moves every section at once
```

#### Example

Once this plan is built, step 1's Built side shows the real `reelplanning guide` command and what it
printed (`runs/guide.txt`), beside the planned one; if the flag landed as `--to`, the two lines differ and the
difference is marked. Its categories (the command, the builder, the check) each open their full diff.
`guide-v4-videos-that-make-sense.html` is what a Built side looks like for a plan built today.

## Components touched

- **The plan-to-video skill** — writing the four blocks; the guide in "Build a video"; the scene's
  `- guide:` tag (steps 2, 3)
- **The reel CLI** — `reel check`'s block rules; `reel record` filing edits (steps 2, 4)
- **finish-project** — runs `reelplanning guide` and its check after the plan map (steps 1, 2)
- **The review player** — a part of the guide over the frame, "Open the full guide", the note box on words
  selected in a part (comment, suggested edit, Ask), "Watch this moment" back (`?t=`), the Guide link on the
  row, the shared review (steps 1, 3)
- **The revise step** — applying edits exactly (step 4)
- **The implement step** — the Built side's "Interface as built", the commits and categories in
  `walkthrough.md`, each run it quotes saved in `runs/` (step 5)

The guide is a new part: the implement step adds it to `system.json` and `glossary.md` when it is built.

## Open questions for the reviewer

1. **Which is the source: plan.md, or the guide?** (step 1)
Say you want step 3 of a plan to show its three cases.
- **A · plan.md; the guide is built from it.** The agent writes a Cases table under step 3 in `plan.md`,
  and the build draws it as the section's picture. Every tool that reads `plan.md` keeps working; git
  shows the change as text. Costs: the guide can only show what `plan.md` can say, plus a picture
  fragment where a step needs one.
- **B · the guide; plan.md is taken from it.** The agent writes `guide.html` by hand, and `plan.md` is
  extracted from it. Any page is possible (a custom picture on every step). Costs: every tool reads a
  generated file, a change is an HTML diff that is hard to read, and each guide takes about twice the
  agent's time.
- **C · both, written separately, kept the same by a check.** Costs: two sources to keep in step, and a
  check that can only catch that they differ, not which is right.
I recommend A: one source, and the page is a way to read it.
*Not answered in the approval; answered A since (D-244).*

2. **Where does the guide open from the video?** (step 3)
You're on step 3's scene and want its three cases.
- **A · Beside the video, in place of the plan text.** The Plan switch (L) shows the guide, scrolled to
  step 3, in the 340 px column. One place; costs the guide's own design: a page with an outline, a text
  column and a picture, squeezed into a column as narrow as a phone beside the video.
- **B · Its own page, a click away.** "More on the guide" opens it at step 3, the video pauses; "Watch
  this part" brings you back. The review is shared, so a comment on the guide goes with the same Send.
  Costs: two tabs to move between.
- **C · Over the frame, like a detail.** The guide grows over the paused video and closes back to it.
  One place; costs room: a page made for scrolling, inside the video's box.
I recommend B: the guide needs the room, and one review keeps it one place to send from.
*Answered B (D-228). After prototype v4 its parts also open over the frame, as details do, and the full page is
a click from each (step 3).*

3. **What does an edit on the guide do?** (step 4)
You want step 1's flag `--out` to be `--to`.
- **A · Comments only.** You write "rename --out to --to" on the line; the agent rewrites the step as it
  reads the comment. Nothing new to build; costs: the agent's reading of your words, not your words.
- **B · Suggested edits, applied exactly.** You change `--out` to `--to` in the block; the agent puts
  exactly that into `plan.md`, and the decision log keeps it. Comments still work. Costs: an editor on the
  guide and a new part of the review; an edit that overturns a decision comes back as a question.
- **C · Direct edits from the page.** The local review page writes your change into `plan.md` itself and
  commits it. Costs: only on your own machine (the hosted page cannot write the repo), and no check
  against the decision log before it lands.
I recommend B: what you change is what the plan says, and it is checked and kept.
*Answered B (D-229).*

4. **How much guide does each plan get?** (step 5)
Say a plan with one step, a flag renamed, and a plan with six steps and three questions.
- **A · Every plan, the plan side only.** Both get a guide; after the build, `walkthrough.md` stays text.
  Costs about 20–25 minutes of the agent's time and 35–45k tokens a five-step plan.
- **B · Every plan, with a Built side.** Both get a guide, and after the build each section shows what
  landed beside what was planned. Costs A's, and a few lines a step in `walkthrough.md`.
- **C · Big plans only, the plan side.** Only the six-step plan gets a guide (four steps or more, or a
  question); the one-step plan is its video and `plan.md`. Costs least; a small plan with a real choice
  has no guide.
I recommend B: the guide is where you see exactly what happens, before and after the build.
*Answered B (D-230). The Built side is now the full diff and the real outputs, in categories (step 5).*

## Decisions in force

- **D-244** `plan.md` is the one source, the guide built from it (question 1). (step 1)
- **D-246** While a question is up, a click on a marked thing opens its part of the guide over the frame, and
  closing it brings the question back as it was left; supersedes D-206. (step 3)
- **D-228** The guide on its own page, a click away, the review shared: kept; its parts open over the frame
  too, and the full page is a click from each (after prototype v4). (steps 1, 3)
- **D-229** Suggested edits, applied exactly: kept; a scene is rebuilt only when its own words change.
  (step 4)
- **D-230** Every plan, with a Built side: kept; the Built side is the full diff and the real outputs, in
  categories. (step 5)
- **D-063**, **D-062** The plan text beside the video, from `plan.md`: kept; the guide is more, a click
  away, and the plan text's header links to it. (step 3)
- **D-194**, **D-195**, **D-196**, **D-208** A detail page opens over the frame from the thing it
  explains: kept; a detail is now a part of the guide, and the full guide is every part. (step 3)
- **D-024**, **D-022** Detail pages from templates, a fresh page where none fits: kept; a guide's picture
  fragment is made the same way. D-022 stays reopened: not answered here. (steps 1, 2)
- **D-224** One row, a Plan | Built switch: kept; the guide's sections take the same switch, and the row
  gets Guide. (steps 3, 5)
- **D-219** The walkthrough shows the change running, in about two minutes: kept; the Built side holds
  the rest. (step 5)
- **D-213**, **D-215** Built videos are not committed: the built guide is not either. (step 1)
- **D-167**, **D-142** Today's look and the coral: the guide uses the review page's tokens. (step 1)
- **D-127** Plain words: the guide says the glossary's on-screen words, as the video does. (step 1)
- **D-129** Approving is never blocked: kept; an edit never blocks Approve. (step 4)
- **D-166** The brief picks the real things: kept; the guide shows each step's interface in full either
  way. (step 1)
- **D-003**, **D-065** The system video kept current: kept; the guide is a new part added when built. (all steps)
- **D-001** A second, fresh agent checks the code: kept; it reads `plan.md`, which the edits change. (step 4)
- **D-064** The main session hands long jobs to workers: the guide is part of the build. (step 1)
- **D-225**, **D-226**, **D-227** Fresh eyes on every new video, every finding answered, meanings and Ask
  about this: kept; the newcomer gets the guide too, and an Ask answer links into it. (steps 1, 3)
- **D-023** A walkthrough shows code only where it is justified, and other detail where that is clearer:
  kept for the walkthrough video; the guide's Built side, not the video, holds the whole diff, behind each
  category's summary (after the approval). (step 5)
- **D-002** A flagged choice is fixed and its scenes rebuilt: kept; the Built side follows the fix. (step 5)
- **D-168**, **D-169**, **D-170** The case study (text only, an HTML plan, and ours, each to a finished
  site): kept; it has not run yet, and once this ships "ours" is the video with its guide, which its
  write-up says. (all steps)
- **D-066**, **D-171**, **D-200**, **D-201**, **D-202** Other agents, decision numbers, and pull requests:
  not touched; a contributor's plan gets a guide like any other. (all steps)
- **D-005**, **D-082**, **D-083**, **D-084**, **D-085**, **D-106**, **D-107**, **D-108**, **D-109**,
  **D-110**, **D-128**, **D-197**, **D-198**, **D-199**, **D-216**, **D-217**, **D-218**, **D-220**,
  **D-221**, **D-222**, **D-223** Rewinds, the sandbox, quick checks, less scaffolding, memory, the
  answer bar, the fifth choice, where "watched" is kept, words and labels, and what a walkthrough pauses
  on: not touched. (all steps)

## Not in this plan

A guide for the system video (it has `spec.md`; a later plan can give it one). Rebuilding older plans'
videos: an older plan gets a guide when someone runs `reelplanning guide` on it, without the check.
Changing the video's length or its quick checks.
