---
name: plan-to-video
description: "Plan with reelplanner. Use whenever someone asks their agent for an implementation plan in a repo (a new plan, written in the conversation): write it into the repo's .reelplanner/plans/, check it against the decisions already made, and build the narrated review video the engineer watches, comments on and decides in, instead of handing them text. Also use to turn an existing plan file (Claude Code plan-mode Markdown, or any agent-written plan) into a video, and when someone wants a plan reviewed as a video, a 'plan explainer', or a reelplanner video. And use it for an explainer, a video of what is already there before any plan: 'explain …', 'what's going on in …', 'what happened in this session', 'walk me through this branch', 'what changed since …', 'what did this experiment show'. Quick mode is just the video, of a plan (one written now for the request, or one they already have) or of something that exists, with no record, checks or walkthrough: use it for 'quick', 'just the video', 'no walkthrough'. Builds with HyperFrames' faceless-explainer skill and the reelplanner style guide."
---

# Plan → video (reelplanner)

A plan is reviewed as a narrated video: the reviewer answers its questions, marks and comments, and
what they say comes back as files in the repo. After the build, a walkthrough video shows what landed
and the calls you made on your own. This skill decides the story; HyperFrames' faceless-explainer skill
builds the frames: load it (`/faceless-explainer` in Claude Code, `$faceless-explainer` in Codex). Read
[references/style-guide.md](references/style-guide.md) before a storyboard.

Three levels; the person chooses, and can move up at any time:

1. **One video**, the basic unit: a plan video (of a plan you write for their request, or of one they already
   have), or an explainer of what is already there. Nothing
   added to the repo but `videos/<slug>/`: no decision log, no checks, no guide, no fresh eyes, no walkthrough
   (**Quick: just the video**). Use it when they say "quick" or "just the video".
2. **Plus a walkthrough**: the plan video, then after the build a walkthrough video of what you built and the
   choices you made on your own. `reel init` keeps the plan and its walkthrough in `.reelplanner/`; no system
   video (**A new plan**, then **Implement, check, walk through, fix**). Use it when they ask for a walkthrough
   but not the whole pipeline.
3. **The whole pipeline**: the answers recorded as decisions that later plans are checked against, every
   review kept, walkthroughs, and the system video (**A new plan** onward). The default for a plan when
   the repo is set up (`.reelplanner/decisions.json` exists) or they say so; otherwise ask which level first.
   A `.reelplanner/` holding only setup files (`.env`, `config.json`: the hosted voice's settings) is not set up.
   A `.reelplanning/` is the same record under the name from before reelplanner: the tools read it as it is, and
   the person can rename it (`git mv .reelplanning .reelplanner`); never make a second one beside it.

A level-3 repo can still skip one plan's walkthrough (**Skipping the walkthrough video**).

## Commands

`$RP` means `reelplanner` when `reelplanner --version` works (the README's install; check that first,
before any `npx` or install), else `npx -y reelplanner@0.2.0`, this skill's tooling pinned to the version
it was written for. Write it out in full in every command (a shell variable does not survive between tool
calls). `$RP --help` lists every command. `$RP reel …` keeps the project record (`init`, `new-plan`, `stage`,
`check`, `record`, `audit`, `stops`, `prereqs`, `status`, `memory`, `retro`, `fold`, `build`, `pr-check`,
`renumber`); `$RP explain …` starts an explainer (**An explainer**); `$RP guide <video-dir>` builds a
video's guide (`build` runs it); `$RP hyperframes …` is the HyperFrames CLI at the pinned version, to use
wherever the faceless-explainer skill says `npx hyperframes`. Paths are relative
to your working directory, so video projects and plans live in the repo being planned.

**First run on a machine:** with `reelplanner` on the PATH, install nothing. `$RP setup --dry-run`; if
it shows anything missing, run `$RP setup` once. Pass on whatever it could not install rather than working
around it. Setup installs the local voice (about 840 MB, Python 3.10+) unless a hosted engine is set, and says
which; if the person has said they want the hosted voice, run `$RP setup --hosted-voice` instead. If `reelplanner` is not on the PATH and `npx` cannot find the package (`npm view reelplanner` says
404: it is not on npm yet), install it once from GitHub, `npm i -g github:ncrispino/reelplanner` (works
once the repo is public; if npm says `EEXIST`, it is installed under its old name: `npm rm -g reelplanning` first), and write `reelplanner` where this skill says `$RP`.

**Before the first narration on a machine** (unless a hosted engine is set: `REELPLANNER_TTS` in
`~/.reelplanner/.env`, or `narration.tts` in `.reelplanner/config.json`), run `$RP narration-check --local` once
(`setup` runs it too). If it says slow, tell the person in one sentence: the hosted voice does a line in 1–3 s for
about $0.03 a minute of narration, local takes the minutes it printed; then let them choose, and go on locally
meanwhile (local always works). Never ask for a key in the chat: they put `REELPLANNER_TTS=openrouter` and their
key in `~/.reelplanner/.env` themselves (this machine, every repo), as the check's lines say. If `narrate`
stops because the local voice is not installed, pass on its two ways on (`$RP setup --local-voice`, or those lines).

**On Codex:** its sandbox has no network and keeps `.git` read-only. Install the package globally
(`npm i -g reelplanner`, or the GitHub line above) and write `reelplanner` for `$RP`; ask the person to
run `setup` outside the agent (or start Codex with the network on: `-c
sandbox_workspace_write.network_access=true`); and ask for escalation for `review --detach` (a server
that outlives the command) and for `git commit`.

## Quick: just the video

A video of a plan, or of something that exists ("explain how `src/server.js` handles a request"). The plan is
the one they already have (a plan-mode file, a doc, an issue: its text as it is), or, when they ask for a plan
of something they want done, one you write for it first, as `videos/<slug>/plan.md`: what changes, the steps,
and the questions still open. Nothing else from this skill applies: no `reel init`, `new-plan` or
`reel check`, no Cases or Interface blocks to add, no `before:` lines, no guide, no fresh eyes, no walkthrough.

1. **Start the project** in `videos/<slug>/`, as **Build a video** step 1 says, with the plan file verbatim
   (for an explainer, the files or lines that answer the question) as `capture/extracted/visible-text.txt`.
   With no `.reelplanner/theme/frame.md` in the repo, run faceless-explainer's `build-frame.mjs --preset
   code-editorial` (it brings the caption skin), then copy reelplanner's `templates/reelplanner/theme/frame.md` over its
   `frame.md` (`$RP --help` ends with the folder reelplanner is installed in). BRIEF.md, from that
   folder's `templates/video/BRIEF.md`, says `flow: automation` and `storyboard: no`.
2. **Write `STORYBOARD.md` and `SCRIPT.md`**: the problem, each step, each open question as a decision beat
   (the tags in **Build a video** step 2: `plan_step`, `chapter_start`, `decision`, `plan_questions`), 1–3
   minutes in all. No `plan_dir`, and no `terms_check: strict` or `details_check: strict` (a word with no
   meaning is then a △, not a stop). An explainer has no decision beats. Narrate in the background (`$RP narrate
   videos/<slug>`) and build the frames meanwhile, as **Build a video** step 3 says.
3. **`$RP build videos/<slug>`**. It says fresh eyes were not run (a △, not a stop) and skips the guide; leave
   both. Add `--render` when they want an MP4 (`videos/<slug>/renders/video.mp4`).
4. **Open it:** `$RP review videos/<slug>` as a background task (not `--detach`: that needs a repo `reel init` set up).
   The page stops at each question; **Finish review** offers **Download annotations.json**, and the person tells
   you where the file is (usually `~/Downloads/annotations.json`). Read its answers and comments, put them into
   the plan file, and carry on as the person says. No walkthrough video unless they ask for one.

To move to the full loop later: `$RP reel init <repo> …`, then `$RP reel new-plan <repo> <slug> --plan
<file>` (**A new plan**).

## A new plan

The plan goes into the repo, and the person gets a review page, not text in the chat.

1. **Set up the repo** if `.reelplanner/decisions.json` is missing (a `.reelplanner/` with only `.env` and
   `config.json` in it is not set up: `reel init` keeps them). Ask first, in one line, which level (the three at the
   top): one video, plus a walkthrough, or the whole pipeline. On one video, go to **Quick: just the video**.
   Otherwise (at level 2, leave out the system video wherever a step below names it):
   - Existing code: `$RP reel init <repo> --name <name> --kind brownfield`, then map the code into
     `spec.md`, `system.json` and `glossary.md`. Carry on with the plan meanwhile, and build the system
     video alongside the first plan video. When the person corrects the map, update it and rebuild the
     plan video's affected frames.
   - Nothing yet: `$RP reel init <repo> --name <name> --kind greenfield`. The first plan adds its parts
     to `system.json` and `glossary.md` as it names them.
2. **Read** `spec.md`, `glossary.md` and `decisions.md`, so the plan uses the project's names and
   builds on what is decided. Read the memory before writing a plan and when tagging calls: the lines
   `$RP reel status` ends with, `$RP reel memory <id>` for the evidence behind one, and `--you` for the
   reviewer's across repos (with the videos they have watched and the words they have looked up).
   When `reel status` says "a plan to drop the walkthrough video is due" (the first three timed
   walkthrough reviews each missed the bar: a pause held at least five seconds, and a flag, own words or a
   comment), your next plan proposes dropping it, reviewed like any other plan: what goes (the walkthrough
   video after each build), what stays (the plan video, the code check, `walkthrough.md`), and what takes
   its place on the plan's row (a "what changed" section beside the plan video, a few lines per change,
   the list with its Flags, and Approve). Nothing changes until they approve that plan; asking for
   changes, or never answering, keeps walkthrough videos as they are.
3. **Write the plan.** Aim for a reviewer who knows what is changing before how, and can tell which
   steps depend on which: say the two to four changes up front, and give each step what it needs from
   another (or that it stands alone). Plain words, one idea a sentence, and no more complicated than it
   needs to be: say what a thing does before its name, and use the glossary's on-screen word where it
   has one (a choice the agent made, not a call). Tools and products are written as `names.md`
   shows them: the product is `reelplanner`, lowercase, in code markup, like any command. In SCRIPT.md,
   commands, flags, paths and file names are written as they are written (`claude -p`, `--dry-run`,
   `plan.md`, `/work`), never spelled out ("claude dash p", "dot md"): narrate says them aloud, and the
   captions show them as written. Keep it to about six steps; more is two plans. A step you expect
   to need five or more calls of the implementer's own asks its biggest as a question instead. `reel` reads:
   - `## The problem`, which the player shows with the steps;
   - steps as `### Step N — <title>` (a colon or plain dash works too);
   - `## Components touched`, each part's glossary name in bold (a new part goes into `system.json`
     and `glossary.md` too);
   - `## Open questions for the reviewer`, numbered, each question in bold with `(step n)`, then its
     options as `- **A · …**` with what each costs, and your recommendation;
   - `## Decisions in force` and `## Supersedes`, citing `D-00n` ids (or a `spec.md#rules-<part>` section) when they apply; each "Decisions in force"
     line ends with the step it keeps, "(step 4)", "(steps 1, 3)" or "(all steps)"; each "Supersedes" line starts
     with the one id it replaces, `- **D-00n** "…"`, and names the question or step whose answer replaces it
     ("question 2 asks it again", "narrowed for small pull requests (step 4)"): `reel record` links it to that
     answer, to the plan as a whole when the line names neither, and waits while that question is still open;
   - under each step, the blocks a reviewer needs to judge it, as `####` headings (the guide shows them in
     full, and `reel check` holds a new plan to them): **Cases**, a table, one row a case (each kind of input
     or situation the step handles, a real example, what happens, and a fourth column, **Trace**: the beats
     in order, each a few words with a label, "you write: …; sent: …; filed: …; you see: …"); **Interface**,
     a fenced block, one part a line (a command and its flags, a file's fields, a function's arguments, a
     storyboard tag, what a page shows), each with its meaning after `#` (`--check   # also check the
     page`), what it prints indented under it, or one line "No interface: wording only"; **Example**, one
     worked example with real values, start to end. The fourth block, Decisions, is generated from the
     ledger, never written. Each open question's options say what happens in its example
     (a value, a quote, a command or a number). Beside the blocks, each step draws **how it works** as a
     fenced ` ```diagram ` block (the guide draws it as a diagram you can step through and click; `reel check`
     warns on a new plan's step without one): a flow, a sequence or a state, one short line an edge, e.g.

     ````
     ```diagram
     flow: Which flag wins
     build --to a.html -> a.html (file): written
     build --out a.html -> a warning: once | the old flag still works, and says so
     ```
     ````

     (`a -> b: label`, `-->` for sometimes, `-x` for refused; `| a sentence` after a label is what the page says when
     it steps through it; `id = Label | #step-2` or a file path makes a node a link; `sequence:` for who sends what in
     order, `state:` with `[*]` for a lifecycle, `compare:` with `before:` and `after:` for a change you toggle). Keep
     labels to a few words: the sentence goes after `|`. An `**It lets you:**` line in each step, and
     `**In one sentence:**` near the top, say what it lets the reader do. A step whose idea needs its own
     picture gets a fragment, `<plan-dir>/guide/step-<n>.html`, from reelplanner's
     `templates/guide/picture.html`. A plan whose story needs its own things (plan.md, a new file) lists
     them under an optional `## Parts`.
4. `$RP reel new-plan <repo> <slug> --plan <file>`, then `$RP reel check <plan-dir>`. Fix the plan until
   the check passes: cite each rule on the parts it touches (the owner's answers, or the `spec.md#rules-<part>`
   section they were folded into), or supersede it with the reason. An accepted agent call is history: the
   check never asks for one by part.
5. **Build the video** into `<plan-dir>/video/` (next section), with fresh eyes on it, and open it for the person.

## An explainer

Someone wants to know what is going on, not to plan yet: "explain the review server", "what happened in this
session", "walk me through this branch", "what changed since Monday", "what did last night's experiment show".
An explainer is a video of something already there. It asks nothing to decide and changes nothing; no plan is
written. What it can be of is open, so there is no list of kinds: the same principles make any of them.

1. **Find the sources that hold the answer, and pin them:** `$RP explain "<their question, in their words>"
   <source> …`. A source is a path (a file or a folder, in the repo or outside it: a transcript, a log, an
   experiment's output), a commit or a range (`main..HEAD`), `worktree`, `since:<date>`, `pr:<n>`, `ci:<run-id>`,
   `this-session` or a decision (`D-233`). It makes `.reelplanner/explainers/<date>-<slug>/`: `explain.md`,
   `sources.json` (each source's shape: a sequence, files, a table or text; its size and hash; a file outside the
   repo by its path, hash and line count, never its text) and `video/` started with `kind: explainer`.
   Fill `explain.md`'s "What it will cover", "What it leaves out" and "Open threads" (what the sources leave open, said
   as what a plan would do where you can: "make the sweeper run on a timer (scene 5)").
2. **What goes in the video** (explain-first step 1): their question first, in their words, and nothing that does
   not help answer it; the shape before the detail (what it is and is for, then its parts or its order as a map,
   each one plain line, then the one or two places that carry the idea); the real thing, quoted word for word
   from a pinned source, and a picture where the real thing is hard to read; what moved (an error, a change of
   course, a result that differs, a choice made); what is settled and what is open. 2–4 minutes, one to three
   chapters; up to 5 when a source is far longer than a video can show.
3. **What goes in its guide:** a source over about 200 lines (`sources.json` says `guide: true`, with `parts` for
   the files of a folder) gets a part, opened from the scene that shows it (`data-detail`): the source
   itself, organized by its shape, never retyped: `sources.json` marks it `needsPart: true` (`guide:
   true` from `explain` means the same), and `build` builds it with the rest of the video's guide (`$RP guide
   <video-dir>`); the scene tags it `- guide: source-<its id, slugged>` (the part names are in `guide/parts.json`).
   A source kept outside the repo shows its path, hash and lines, not its text.
4. **Build it as any video** (**Build a video**), with these rules: each scene that states a fact names its
   `- source:` (a source's id in `sources.json`, a file in one, `:<from>-<to>` for lines); a quoted thing sits in
   a `data-artifact`, word for word, and a label on it that is not a quote (a file name, a commit) carries
   `data-label`; no `- decision:` beats; a quick check only where there is something to predict, just before the
   scene that shows it; a scene that points somewhere says so, `- next_more:` (what going deeper from it would
   show) and `- next_plan:` (a plan it points to). `build` runs `check-sources`: a quoted line its source does not hold, an unpinned
   source, a secret, an email address or a path in a home folder stops it. Mask the text itself (`ghp_…REDACTED`,
   `~/…`), never blur it: the text is committed. Fresh eyes as for every video; an explainer with a source that
   needs a guide part also gets the fact check, a third agent with exactly the prompt from `$RP fresh-eyes
   <video-dir> --prompt checker`, which reads the narration against the sources; answer its findings (`F1` …) as
   any other.
5. **Open it** (`$RP review --detach`): it is a row of its own, **Explainer**, "explained at `<commit>`, N commits
   since". It is a snapshot: never rebuild it because the repo moved; asked again, make a new one. Ask about this
   is answered from its sources, the glossary and the scene, saying which source ("from `scripts/lib/inbox.mjs`,
   line 56").
6. **After its review:** `$RP reel record <explainer-dir> <review.json>` (or `reel-intake`) files it as
   `reviews/explainer-<time>`, with comments by scene, questions and what they want next. **Nothing goes into the
   decision log.** Finish's Explain more and Plan this are not templates: `build` puts this video's own suggestions in
   its plan map (from those tags, each long source, and `explain.md`'s "What it leaves out" and "Open threads"), and
   the page adds the viewer's own (a scene they commented on, rewound or marked, a question, a word looked up, a missed
   check, the commits since). What they pick, edit or write is the review's `next`; the `.md` says it under "What you
   want next". Finish's end says what next:
   - **Done:** nothing more.
   - **Explain more:** start from what they picked (its scene rebuilt deeper, or a scene for it), then rebuild the
     scenes the comments are on and add a scene for each question, keeping frame ids; build, fresh eyes, open it again.
   - **Plan this:** `$RP reel new-plan <repo> <slug> --from <explainer-dir>` opens `plan.md` with "Explained first:
     `<name>`", titled by what they picked, and quotes the review in its problem; write the steps from there, as for
     **A new plan**. `$RP reel
     prereqs` lists the explainer first under Before you watch with a recap line, and the plan video starts at what
     changes: it never explains again what the explainer showed.

## Build a video

The same steps build a plan video (`<plan-dir>/video/`), a walkthrough video (the change running, from
`walkthrough.md`, into `<plan-dir>/walkthrough-video/`), the system video (`.reelplanner/system-video/`) and an
explainer (`<explainer-dir>/video/`).

1. **Start the project.** Run `$RP hyperframes-skills` (it installs HyperFrames' skills at the pinned
   version and re-applies the TTS speed patch; a no-op when current). Then load the faceless-explainer skill
   (`/faceless-explainer` in Claude Code, `$faceless-explainer` in Codex) and follow its Steps 0–2, with the
   plan verbatim as `capture/extracted/visible-text.txt`. Skip its `skills update`, and
   run its init as `HYPERFRAMES_SKIP_SKILLS=1 $RP hyperframes init …`: both would replace the pinned
   skills with GitHub main. Use `theme/frame.md` as the frame preset when the repo has one, a
   low-decoration preset otherwise, and `music: none`; how frames move is `theme/motion-language.md`
   (in reelplanner's `templates/reelplanner/theme/` when the repo has none). BRIEF.md's Customizations
   say the video's medium (screen, code, document, diagram), its layouts and its main transition, one line
   each: `- Medium:`, `- Layouts:`, `- Main transition:` (style guide §5; reelplanner's
   `templates/video/BRIEF.md` is a starting point). A fourth line picks which scenes show the real
   thing, `- Real things: scene 3 (the table), scene 8 (the diff); the rest explain with pictures`;
   it is optional and nothing warns about the scenes it leaves out. With `.reelplanner/`, `$RP reel
   stage <plan-dir>` writes the shared stage.
2. **Write `STORYBOARD.md` and `SCRIPT.md`** (Step 3) as the style guide says: a series of parts of
   about a minute, 3–5 minutes in all (the system video 5–8), decisions after their steps, a quick
   check per step. A walkthrough video is the change running instead, in about two minutes, with a quick
   check only where the change has something to predict, just before the scene that runs it (a change to
   what is saved or to a command's output counts, though the page looks the same), and one open question
   at the end (style guide §8). The front matter carries
   `plan_dir: <plan folder>` (`.reelplanner` and `kind: system` for the system video), which tells
   the player where a review goes, and what a viewer needs first (style guide §2, §4): `before:
   <video>[#part N] | <what it gives you>` per video it leans on (`system`, a plan's folder, or
   `<plan>--walkthrough`; with none, the system video; `before: none` opts out). Don't guess them:
   `$RP reel prereqs <plan-dir>` (`--walkthrough` for its walkthrough video) writes them, the system
   video's chapters on what the plan touches and up to two earlier plans whose decisions it builds on
   (the ones to watch first), and a `recap:` line for every earlier video it builds on, those two
   included: the recap scene (§2) sums up each in a line; `terms: a, b, c` for
   the words it defines itself, each with the meaning a viewer opens on hover where the repo's glossary has
   none (`terms: branch = a line of work kept apart until it is merged; merge = …`; a phrase fresh eyes
   flagged and you kept goes here too, or under the glossary's "Other words" when other videos say it), `plain: flag`
   for a word the build would take for jargon that this video uses plainly, and `terms_check: strict` and
   `details_check: strict` on every new storyboard. Don't explain what the
   reviewer knows: when `$RP reel memory --you` shows they know a word (they watched the video that
   defines it, or looked it up and later answered a quick check on it right), this video drops its
   definition card for that word (the recap line, the defining clause); the word stays in the Terms panel.
   The tags the player reads:

   | Beat | Tags |
   |---|---|
   | a beat that defines a word | `- defines: <term>` (at or before the word's first use); the system video has one for every glossary row |
   | every step beat | `- plan_step: <n>` |
   | a part's opener | `- chapter_start: <title>` |
   | a decision | `- decision: q<N>`, `- question:`, `- option_a:` … `- option_d:`, `- why_a:` …, `- recommended:`; `- kind: multi` for pick-all; optional `- question_more:` and `- option_a_more:` …, the fuller words behind the frame's heading and each card (style guide §6) |
   | an option's consequence | `- branch: q<N>=<letter>`; for pick-all, one `- summary: q<N>` |
   | the ending | `- plan_questions: 1, 2, …` |
   | a quick check (after the next step's scenes, the last step's before the ending; on a case the video did not show: style guide §7; in a walkthrough, just before the scene that runs it, where there is something to predict: §8) | `- quiz: k<N>`, `- question:`, `- option_a:` …, `- answer:`, `- explain:` (the reason in words, never an id), `- walk_me_through:` (2–4 plain sentences working the check's own new case through; required), `- explained_at: <frame>` (the earlier beat that explains the rule it applies); optional `- question_more:` and `- option_a_more:` … (never the answer), and `- option_a_why:` … (why each is right or wrong, shown on its card once answered; style guide §7) |
   | a step's calls that pause (walkthrough) | `- autonomy: a<N>, a<M>` (one id for one call), on the scene that shows them running; each call's words are its row in `walkthrough.md` |
   | a deviation (walkthrough) | `- autonomy: d<N>`, a beat of its own |
   | the list: the calls that don't pause (walkthrough) | `- autonomy_list: a<N>, a<M>`, one beat at the end |
   | the ending's open question (walkthrough) | `- open_question: Seeing it run, anything you'd change?` |
   | a part of the guide the scene opens | `- guide: <part>` or `<part>#<place>` (`step-3`, `step-3#cases`, a category's id, `what-changed`, `decisions`, `choices`, an explainer's `source-<id>`), optional `- guide_title:`, `- guide_why:`; in its frame, `data-detail="<part>"` on the thing it explains (else the corner chip opens it) |
   | a page the scene opens | `- detail: <name>`, `- detail_title:`, `- detail_why:`, optional `- detail_kind:`; in its frame, `data-detail="<name>"` on the thing the page explains |
   | a knowledge level | `- knowledge: new,familiar` |
   | where an explainer's scene points (Finish offers it) | `- next_more: <what going deeper here would show>`, `- next_plan: <what a plan would do>` |
   | a system-video frame | `- spec_section: <heading>` and/or `- components: <id>, <id>` |
   | every scene (optional) | `- layout: <word>` (code, table, terminal, before-after, wall…) |

3. **Narrate in the background as soon as `SCRIPT.md` exists**: it is the slowest step.
   `$RP patch-tts-speed --check` first, then `$RP narrate <video-dir>` (at 1.25×, one line at a time;
   several at once with a hosted engine, which `REELPLANNER_TTS` (`~/.reelplanner/.env`) or `.reelplanner/config.json`'s `narration` names and
   `$RP setup --dry-run` reports; on a rebuild it voices only the lines that changed). Commit `.hyperframes/narration.json` with the
   voice files. Meanwhile build the frames (Steps 4–5): one worker per frame, animations placed on
   their words once `audio_meta.json` has the timings. Mark each option card on a decision or
   quick-check frame with its letter, `data-option="a"`, so the reviewer answers by clicking it; mark the
   question's heading `data-question`, and each choice's card on a call, stop or list beat
   `data-call="a3"`. The player answers on the frame by those cards, so nothing sits in a bar under the
   video. Give every frame's root `data-band="bottom"` with its lowest eighth left empty: the chips go
   there, and a frame without cards still gets the answer bar there. A scene the brief's `- Real things:`
   names shows its thing (a file, a table, a command, a screen) in a `data-artifact` container with its
   words pinned on it (`data-gloss`); code and terminal runs start from the theme's
   `blocks/code-diff.html` and `blocks/terminal-run.html`. A change across many files never shows every
   file: its map first (each file with one plain line), then the one or two places that carry the idea;
   where the thing is hard to read, a picture that explains it (style guide §5). A camera sits inside a
   view clipped at y 900, and a question's heading and cards sit outside it (or the camera is at rest at
   scale 1 when the scene ends): `$RP frame-lint` fails either, so run it on frames as they land. Put the
   holds for branch beats, assembling beats and the final frame in `.hyperframes/holds.json`. Details
   (style guide §10) start with `$RP detail new <video-dir> <name> --kind <template>` and are built
   alongside the frames. A scene with a detail marks, in its frame, the one thing the page explains:
   `data-detail="<name>"` on the code block, the table, one row or line of it, or a pinned word's label.
   The player lays a quiet button over it ("More in the guide ↓" under the pointer), so `frame-lint` fails
   a marked thing in the lowest eighth, under 120 × 44 px, or still moving (it, or its camera) in the
   scene's last 3 s; the details check fails a frame that marks a name its scene lacks, and, under
   `details_check: strict`, a scene whose thing is marked nowhere.
4. **`$RP build <video-dir>`** runs everything after that: check-terms (an id said alone fails a
   `terms_check: strict` storyboard; a quick check with no `walk_me_through` fails; a word said before
   it is defined, a check whose answer its `explained_at` beat never says, a check right after that beat,
   and a check on that beat's own names and numbers, are △ lines; on the system
   video, a glossary row no beat defines fails (a row under the glossary's "Other words" is a meaning only,
   never one it must define); a likely-jargon word said or shown with no meaning, an acronym, code, a
   technical compound, a common software word or one of reelplanner's own (`frame 7 says "merge" (4×) with
   no meaning`), is a △ line and fails a `terms_check: strict` storyboard: give it a glossary row or a
   `terms: x = …` meaning; a tool's name on screen outside code markup, or a name
   spelled other than `names.md` says, is a △ line; so is a flag, path or file name the script spells
   out), check-sources (an explainer's quoted lines against its pinned sources, and no secret, email address or
   home path in its text: **An explainer**; skipped for a video that names no source), narrate (only what changed), fetch-sfx,
   transcribe-missing, sync-durations, hold-durations, retime-frames, finish-project (captions,
   transitions, theme, plan map, the terms index of which video explains each word, plan diff, the
   guide, the details check) and verify (lint, check, details,
   fresh eyes, snapshot), then the guide again with the scenes' pictures, and its check (`guide --check`: a
   heading or paragraph of `plan.md` not in the page, a layer with no visible way in, something only in motion or
   only by dragging, a run shown as real that `runs/` does not hold, a sentence of the narration on its first layer,
   an error, the network, or a sideways scroll at 375 px stops it; each gap, a case with no trace say, is listed
   and shown on the page as "Not written in plan.md"; a scene's missing picture is a △). It prints one line per stage and stops at the first failure with what that stage said:
   fix it and run `build` again. After the length it warns (△, never a stop) when over 70% of scenes share
   one layout or one transition, or BRIEF.md does not say its medium, layouts and main transition (it
   repeats the brief's `- Real things:` when there is one, and never warns without it). Add `--render` only when someone asks for an MP4; the review page
   plays the HTML.
5. **Fresh eyes before you open it**: every video you build, plan, walkthrough or system, and every
   rebuild of an older one (a rebuild is a new build). You know what every phrase means, so you cannot judge
   whether a newcomer follows it; two fresh agents can. `$RP fresh-eyes <video-dir>` writes their briefs, with a
   picture of each scene at rest taken through the review page. Launch two fresh agents with no context of this
   conversation, one with exactly the prompt from `$RP fresh-eyes <video-dir> --prompt newcomer`, one with `--prompt
   designer`, and nothing else, so neither knows what you meant, each from a scratch folder of its own outside the
   repo. In Claude Code: a subagent, or `claude -p` with that folder as its working directory. In Codex:
   `spawn_agent` with `fork_turns: "none"` (its default, "all", hands it this whole conversation), or `codex exec -C
   <scratch> --skip-git-repo-check -s workspace-write --add-dir <video-dir>/fresh-eyes "<the prompt>"`. The
   prompt names one absolute path, `fresh-eyes/<role>.md`; that is
   the only file the agent writes. `--check` fails on this round's findings found anywhere else in the repo (a copy
   in the repo's root, a notes file under `fresh-eyes/`) and never reads them there: move the file to its path, or
   run the agent again. The newcomer lists what it could not follow from what the video had shown by then; the
   designer what breaks the style guide's seven frame rules (§5, "A frame a newcomer can read"). Answer every
   finding under it in `fresh-eyes/newcomer.md` or `designer.md`, by its number:
   - `- Answer: fixed: <what changed, and where>`: the line or frame changed;
   - `- Answer: meaning: …`: the phrase kept, with a meaning a viewer can click: a row under the glossary's "Other
     words" when other videos will say it, else the storyboard's `terms: <phrase> = <meaning>`;
   - `- Answer: kept: <the reason>`: the finding is wrong about something the video says plainly, say, two scenes
     later. Answering is not always a rewrite: "kept: scene 5 says what the list is" is a full answer.
   Then `$RP build <video-dir>` again (it stops on a finding with no answer, and says which scenes changed since the
   agents looked) and run fresh eyes again on what changed: at most three rounds a build. What is left after the
   third, the findings you kept, is said on the page's "Before you watch" and in the notification: only the new
   ones, since a finding an earlier round of the build already kept for the same reason (the same scene and agent,
   the same thing, the reason much the same) folds into one line with its count. Then open it.
   **Rounds belong to a build.** A build is what `plan-diff` compares against, the video as last committed; rebuilding
   between rounds keeps it, and committing the video ends it, so commit a video with its fresh eyes done (one
   committed before they were: `$RP build <video-dir> --against <the commit before it>`). On a
   rebuild, `fresh-eyes` moves the last build's rounds to `fresh-eyes/build-<n>/` (kept, never read) and starts
   round 1; its briefs hold only the scenes `plan-diff` says changed (edited, added or restyled), each with the scene
   before and after it marked context only, so a finding on an unchanged scene cannot come up (one on a context
   scene is out of scope: not counted, no answer). Before you watch lists only this build's kept findings. A first
   build covers every scene; `--all` makes a rebuild do so too.
6. **Open it:** `$RP review <video-dir> --detach` serves the page past this session, sends a
   notification with what is waiting, and prints the URL (**Running the loop**). Give the person that
   URL, the contact sheet, and each part's length.

## After a plan review

A review arrives in the inbox (the local page's Send), as a hosted page's row, or as a download.
`$RP reel-intake <row.json>` files the first two, `$RP reel record <plan-dir> <review.json>` a
download. The review is kept as `<plan-dir>/reviews/<kind>-<time>.json` (never overwritten), its
decisions go into the ledger, and `reviews/<id>.md` says what to act on: **Decisions**, then the steps
with the reviewer's words. Its first line says what the verdict means:

- **Approved** (with any number of comments): the reviewer does not need the video again. Fold each
  listed comment into its step in `plan.md` as text, an instruction for the implementation, and commit.
  Don't rebuild or re-present the plan video; go on to **Implement**.
- **Changes requested:** the reviewer wants to see the plan again. Revise as below, rebuild the touched
  beats, and open the page for another review, where they can comment again and approve or ask again.

For changes requested:

- If no step is listed, stop: the ledger has everything.
- **Edits to apply** (a suggested edit on the guide): put each into `plan.md` exactly as written, then `reel
  check`; one that would overturn a decision in force, or whose words `plan.md` no longer has, is not applied: ask
  it as a question in the next version. The guide is always rebuilt; a scene only when its own words or frame show
  the words changed (`reviews/<id>.md` says which, and `$RP revise-scope <plan-dir>`). With Approve, apply them
  too and go on to Implement.
- Rewrite only the listed steps, in place in `plan.md` (git keeps the history). A step with a decision
  and no comment stays as it reads.
- "Hard to follow" (the reviewer rewound or slowed down) asks for the step said more plainly, in the
  plan and its beats, deciding the same thing.
- "Explain this more" on a question means it was not decided: rewrite it so it can be answered, with a
  concrete example per option and the note's words addressed, and ask it again.
- A quick check the reviewer disagreed with is a comment on the step it tests, in their words.
- Run `$RP reel check <plan-dir>`. Rewrite the touched beats in the storyboard, script and frames,
  keeping each frame's id so `plan-diff` reads them as edits, then `$RP build <video-dir>`. The changed
  frame count `plan-diff` prints should match the beats you touched; if not, find out why.
- The guide marks what you changed by itself: each part of `plan.md` whose words differ from the version the review
  watched is marked "Changed since your review", with the old and new words and the review's own words that asked
  for it (`guide --check` fails one left unmarked). Don't hand-edit `reviews/`: the comparison is read from them.
- Commit, naming the plan and the steps revised, and open the page again.
- The version the reviewer saw is kept with nothing to do by hand: `review` and `reel record` write its
  `<plan-dir>/versions/` file and the screenshots and captured text git leaves out into `.reelplanner/media/`; commit
  them with the review. Asked to show an earlier version, `$RP reel rebuild <video-dir>` lists them and `--version
  <n>` builds one again in a worktree of its own (the voice is made again; it says what else it could not bring back).

## Implement, check, walk through, fix

Once the plan is approved (`$RP reel status` says so), note the commit you start from.

**Skipping the walkthrough video** is the reviewer's choice, for this plan ("no walkthrough", "skip the
walkthrough", in the review or the chat): do steps 1–4 as below (walkthrough.md, the code check, `reel
audit`), skip steps 5–7, and put `**Walkthrough video:** skipped (<their words>)` at the top of
walkthrough.md. `reel status` then reads "built: walkthrough video skipped", done. For every plan from now
on, it is the plan to drop the walkthrough video (**A new plan**, step 2), reviewed like any plan.

1. **Implement from `plan.md`**, with the decisions in force as constraints. A call is a choice the plan
   did not cover that a reviewer could reasonably have made the other way and would want to know about (a
   default, an error code, a library, a data shape), not a variable name. When you make one, add a row to
   the autonomy table in `walkthrough.md` right then:
   `| A<n> | <step> | <chose> [tags] | <instead of> | <why> | <where to check> |`. Tag a call at the
   end of "chose", in brackets, when it is `visible` (you'd notice it: it changes what you see or do,
   and the video can show it running), `hard-to-undo` (stored data and formats, permissions,
   security, something other people's code relies on) or `close` (a reasonable person could pick the
   other way). The tags are your judgment for this build, and they decide what pauses the walkthrough
   video (step 5). The line: after the change, if you see the same page, press the same buttons, and
   the same data sits on disk, it is not `visible` or `hard-to-undo` (a long file split in two, a
   helper renamed). A deviation from the plan is a `D<n>` row and is always tagged `deviation`.
   **At a step's fifth call, stop**: don't make it; put that step's biggest open choice into `plan.md` as
   a question for the reviewer, ending its title line with "(step N)", and carry on with the other steps;
   `reel audit` fails a step with five or more calls and no question about it, open in `plan.md` or
   already answered in the decision log. Past a dozen rows in all, the plan left too much open, and
   `reel audit` warns. Example:
   [upload-resume](https://github.com/ncrispino/reelplanner/blob/main/eval/plans/upload-resume/walkthrough.md).
2. **Finish `walkthrough.md`**: per plan step, what landed and in which files, deviations said plainly,
   the tests run, and what is not done. For the guide's Built side (written once, read by `$RP guide`): an
   `**In one sentence:**` line at the top, what the change lets the reader do now, in plain words (the guide
   opens with it); under each `### Step N`, a `**You can now:**` line, what that step lets the reader do, a short
   verb phrase ("click something in the video to jump to its part of the page"; the guide's "In short" lists them,
   and shows a step's title where it has none); a `**Commits:**` line with the plan's commits; a `## Categories of change`, one bullet a kind of change,
   `- **<name>** {<id>} (\`<path>\`, … <commits, when one file holds two kinds>) (step N): <two lines>`, and
   `Runs: \`runs/<name>.txt\`` under it; `#### Interface as built` under a step whose interface landed otherwise
   than planned. Save each run you quote in `<plan-dir>/runs/<name>.txt` as it ran: `$ <command>`, what it
   printed, whole, then `exit <n>`. Nothing on the Built side is typed in.
   **What the video can't hold**: under each step, a ` ```diagram ` of how it works as built (the format is in
   **A new plan**, step 3), and `#### Worked examples`: one `##### <case>` a case, each with `- **Input:**` (the command,
   or what the reader does), `- **What happens:**`, `- **Output:** \`runs/<name>.txt\`` (a saved run, `(lines 3-9)` to
   keep the lines that matter in view; never an output typed in), `- **Edge cases:**` (a list), and where it teaches
   something `- **Predict:**` (a question; the output waits for a click) or `- **Before:**` / `- **After:**` (toggled).
   Then the depth, a `####` each: **Why it works this way**, **What else was considered**, **What breaks it**,
   **Limits**, **Files and commands**: concrete, the real names and numbers, never general. Run each case for real
   and save its run, in a scratch repo when it would change this one (say so in the run's `$` line, after two spaces,
   in brackets). For a walkthrough already reviewed, write all of it in a `## For the guide` section at the end,
   `### For step N — …` a step (never `### Step N`, which is the step itself to every tool), opened by one italic
   line saying it was written after the build: the approved text stays as it was. There too, name once the runs made
   in a scratch repo, `**Ran in a scratch repo:** \`runs/<name>.txt\`, … — <how it was set up>` (globs, or "every
   run in \`runs/\`"): the guide tags them and shows them apart from the commands to run here. A Not done line that a
   later commit settled gets a `#### Since then` item there, `- **<the start of its bold lead>**: <what happened>
   (\`<commit>\`)`, which the guide shows under that line (it finds a replaced decision, and the system video brought
   up to date for the plan, on its own).
3. **The code check is a second agent, not you**. First `$RP reel check <plan-dir> --base <start commit>`:
   it names each earlier accepted call whose lines your diff changes, in its words. Keep to it, or say why
   it changes (a `D<n>` row). `$RP code-check <plan-dir> --base <start
   commit>` (add `-- <paths>` to leave out unrelated work) writes the brief, those calls in it. Launch a fresh
   agent with no context of this conversation, as for fresh eyes but started in the repo's top folder, where it
   reads the diff (`codex exec -C <repo> -s workspace-write "<the prompt>"`), with exactly the prompt from `$RP
   code-check <plan-dir> --prompt` and nothing else, so it does not inherit your reasons. It writes
   `code-check/findings.md` (or returns the text; save it as is).
   Answer every ✗ in a `## Code check` section of `walkthrough.md` by its key: a new row, a deviation
   said plainly, or why it is not one. Never fix a finding quietly.
4. **`$RP reel audit <plan-dir>`** must pass: every step has an entry, every decision is mentioned with
   a file to check it in, every row says where to check, every ✗ is answered. Fix the report, not the
   check. A walkthrough the owner has already accepted is settled: its breaks print as △ notes.
5. **`$RP reel stops <plan-dir>`** says which calls pause and which go on the list, by which rule, and
   prints the beats by step. An off-plan change always pauses; a call tagged `visible` or
   `hard-to-undo` pauses, and its scene shows it running (the page before and after, the saved file
   before and after); a call sharing a label with a recent late fix pauses; every other call
   goes on the list. No count of pauses is fixed or capped. The calls of a step that pause share
   **one stop beat**, `- autonomy: a3, a4`: one pause, each call a clause in the narration and a card on
   the frame (`data-call="a3"`) that carries its own Accept and Flag. A deviation keeps a beat of its
   own. The list is one beat at the end, `- autonomy_list: a1, a2, a5`: each call one line (what it
   chose, instead of what) with its own Flag; Go on, or Approve, takes the rest as **listed, not
   judged**, logged so, and a later plan that touches one is not warned by it.
6. **Build the walkthrough video** (**Build a video**) and open it. It shows each change running, before
   and after, in about two minutes (style guide §8; `build` warns past 3): on the real screen when you'd
   see it, in a real run when it happens behind the page (the saved file before and after, a command's
   output, a migration on a copy of real data). Its brief names every change scene under `- Real things:`
   (`flow: automation`, `storyboard: no` where the repo runs video builds on their own). It ends with what
   ran, what is not done, and the list. A change people install, or that changes how they install, shows the real install
   commands run and working.
7. **After the review**, `reviews/<id>.md` lists **Calls to fix** (flagged, or answered in the
   reviewer's own words; a flag on the list is fixed like a flag on a pause) and the quick checks they
   disagreed with; accepted calls join the ledger as history (a later diff that changes their lines is told
   about them), listed ones as listed, not judged.
   - If the words would overturn a ledger decision, don't fix in place: write a new plan that lists
     it under **Supersedes**, and review that.
   - Otherwise change the code to what the reviewer said, run the tests, and update the call's row in
     place (`… (changed after review: <what it does now>)`) with a line in its step entry.
   - **Accepted** with comments: that is all, no new video. **Changes requested:** also rebuild the
     beats the fixes touch, keeping their frame ids, with `$RP build`, and open the page again.
   Commit, naming the calls. Once accepted, keep the system video current.
8. **When a part's rules pile up**, `$RP reel fold <repo> <part>` drafts them as one section of `spec.md`
   (`folds/<part>.md`). Say each rule once, in plain words, and ask the owner; only on their yes,
   `$RP reel fold <repo> <part> --apply` puts it in `spec.md` and marks those decisions folded. A plan
   touching the part then cites `spec.md#rules-<part>` in place of their ids.

## The system video

One video per repo explains the whole system from `spec.md`, `system.json` and `glossary.md`, in
`.reelplanner/system-video/`, for a viewer new to the repo: what it is for, its parts a few at a
time, then one part per pipeline, and the invariants. When the system is something people install, the video shows installing it: the real
commands, run, and what they print; the same holds for a walkthrough whose change touches the install. No decisions; a quick check per chapter, asked at
the end of the next chapter (the last one's before the ending), on a case the video did not show. It is
the promise that every word is explained: each glossary row has a scene that explains it, in the
row's on-screen word, tagged `- defines: <term>`, and its build fails while a row has none. Every frame carries `- spec_section:` and/or
`- components:`, so a change finds the frames it affects. Build it with **Build a video** (front
matter `plan_dir: .reelplanner`, `kind: system`): in an existing repo alongside the first plan video,
in a new one after the first walkthrough is accepted. Any video can ship with its quick checks off in the player
(`checks: off` in BRIEF.md's front matter); the viewer turns them on with the Quick checks switch or `K`.

**Keeping it current**: after every accepted walkthrough, update `spec.md`, `system.json` and
`glossary.md` right away. A new glossary row makes the video behind until a scene explains it. When
memory says a word was looked up in three reviews (`reel memory lost`), rewrite its scene, or its row.
`$RP reel status` says when the video is behind and
what catching up costs (frames, lines, seconds of speech); `$RP spec-diff` names the frames. Rebuild
only those, keeping their ids, with `$RP build .reelplanner/system-video`, then fresh eyes on it as on any build
(**Build a video**, step 5).

**A review of the system video** changes the video or the system. `reel-intake` files it and
`$RP system-review` writes `system-video/reviews/<id>.md`: each item with its frame, the parts it is
about, and a first sort. You decide each one:

- The video is wrong or unclear: fix the text or the frame, and rebuild that frame. No plan.
- The system should change, small and inside one part: make the change, run the tests, update the
  spec, and show it in a one-step plan's walkthrough the reviewer accepts or flags.
- Anything with a choice, or touching several parts: a new plan first, with the reviewer's words as its
  problem.

Fill each item's **Answer:** line (what you did, where to see it) and commit it with the change; on a
hosted page also set the row's `answer`.

## Several people

When the repo is shared (a second person opens pull requests, whether or not they use reelplanner), set it
up once: copy reelplanner's `templates/CONTRIBUTING.md` into the repo's `CONTRIBUTING.md` (as a section of
it, if it has one), `templates/pull_request_template.md` to `.github/pull_request_template.md`, the lines
of `templates/gitignore` into `.gitignore` (and its `.gitattributes` line), and list the maintainers in
`.reelplanner/config.json` (`maintainers`, each by the `id:<id>` `reel record` prints for a hosted page's
viewer, "by owner (id:…)", or an email; `owner` still works but warns, since a second person reviewing on
their own page is `owner` too). If every PR should link an issue, add `"pr": { "issue": "required" }` to
`config.json`: `reel pr-check` then fails a PR whose text links none (`Closes #12`). Commit them, naming the
plan or request.

- **When a PR gets a video**: the short walkthrough video, only when it changes over 300
  lines outside tests, docs, videos and generated files, the contributor ticks "makes a choice you'd
  notice or can't easily undo" (step 1's labels `visible` and `hard-to-undo`), or a maintainer adds
  `needs-video`. `no-video` waives it. Any other choice of a smaller PR is a line under "Other choices" in
  its text (what it chose, instead of what), which the maintainer accepts by ticking "The other choices
  above are accepted". A new flag or command alone is not a choice that needs one. `$RP reel pr-check
  --base origin/main` says where a PR stands, and waits on the other choices until they are accepted.
- **A PR over the line with no video of its own**: the maintainer asks you for its walkthrough.
  Read the PR (`gh pr diff <n>`, `gh pr view <n>`), make a plan folder `.reelplanner/plans/<date>-pr-<n>/`
  whose `plan.md` says what the PR does, step by step, and whose `walkthrough.md` logs each choice the PR
  makes as a row, then build the walkthrough video as for any plan (**Implement, check, walk through,
  fix**, from step 2; its stops follow the same rules).
- **Who decides**: a contributor's plan review answers their plan's questions; their walkthrough
  review is their own check and adds nothing to the log (`reel record` says so). The maintainer's review
  counts. A maintainer who disagrees with an answer: change the code and the entry on the branch, which
  keeps the last answer.
- **The built video never goes into git**. The branch carries the videos' text only. Once
  the PR is open, pack the videos and push them as a branch of their own, then put the maintainer's two
  lines (the clone and `reelplanner review`, in `CONTRIBUTING.md`) in the PR's text:
  `$RP bundle-player ../pr-<n>-video <plan-dir>/video <plan-dir>/walkthrough-video`, then in that folder
  `git init -q -b video/pr-<n> && git add -A && git commit -qm "PR #<n>: its videos"` and
  `git push --force <url of origin> video/pr-<n>`. A rebuild does the same again.
- **Watching and checking a contributor's video**: the maintainer clones `video/pr-<n>` beside the
  PR's checkout and runs `$RP review ../pr-<n>-video` in the checkout: it serves the packed folder as it
  is, says when its plan map is not the checkout's, and Send files the review there. Before accepting a
  walkthrough they did not build, they run their own code check (step 3 of **Implement**) in the PR's
  checkout; its findings become their flags, not committed.
- **Decision numbers**: the PR merged second rebases; at the conflict in `decisions.json`, run
  `$RP reel renumber`, change the video lines it lists, rebuild them, `git add .reelplanner` and
  continue. Never merge `terms-index.json` by hand: `reel renumber` writes it again.
- **Before merging:** `$RP reel pr-check --merge`, then `$RP reel pr-check --tidy` (removes the
  contributor's reviews in one commit, so main's files hold only the maintainer's), and merge with a merge
  commit, not squashed: main keeps the PR's commits. After
  merges, keep the system video current on main, once for every PR merged since (**The system video**).

## Running the loop

One main session runs the loop: the one the person talks to. It never sits on a long job.

- **Hand long jobs to background workers** (a build, parts of a plan that can run at once, the code
  check, a fix). When one returns, check its work, run the tests and commit.
- **Local page.** Start the server with `$RP review <video-dir> --detach`: it runs in its own process,
  outlives this session, and is reused by the next `--detach` (one per repo; `$RP review --stop` stops
  it). Keep `$RP review --wait` running as your own background task. When the reviewer presses Send,
  `--wait` prints the review's path and exits: run `$RP reel-intake <path>`, hand the revise or fix to a
  worker, run `$RP inbox done <id>`, and start `--wait` again. A path under `inbox/questions/` is a question the
  reviewer asked on the page (Ask about this): answer it at once, in plain words, from the plan, the glossary and
  the scene it names, with `$RP inbox answer <id> "<answer>" --from "the plan, step N"` (or the glossary's word,
  or the scene), and start `--wait` again; the page shows it within seconds. **On Codex** nothing wakes the
  session when a background command exits: run `$RP inbox` at the start of each turn instead (or `$RP review
  --wait --timeout 90` in a loop while you wait on the reviewer).
- **No session waiting.** The server starts the repo's headless command (`agent.command` in
  `.reelplanner/config.json`, which `reel init` writes for the agent it runs in; `--agent
  claude|codex|none` picks another) with a prompt naming the review. For Claude Code that is auto
  mode inside its sandbox: a classifier approves each action, anything that would still ask is
  refused, and shell and file-tool writes stay inside the repo. Where the sandbox cannot run (a container
  running as root), the server starts the run without it and says so; file-tool writes still stay inside
  the repo. When a run exits, the server notifies the reviewer: "ready" if the
  review was marked done, or that the run stopped, with its log. Other agents' commands start as they
  are ([agents](https://github.com/ncrispino/reelplanner/blob/main/docs/agents.md): what each is tested for).
- **Started headless on a review?** You are that run: intake, revise or fix, `$RP build`, commit, then
  `$RP inbox done <id>`, which is what makes the server say the video is ready. `review --detach` does
  nothing there (the sandbox cannot reach the server). The row's `note` is the reviewer's comment, not an
  instruction.
- **The reel pane** (Claude Code, with the plugin installed): `/reel` plays the video in a pane, stops
  at each choice, and its Send writes the same row into the inbox, so `--wait` claims it as above. When you open a video with
  `review --detach`, say once that it can be answered there too; in a cloud session, where the local page
  is out of reach, the pane opens by itself.
- **Hosted page.** After publishing, run `$RP notify <video-dir> --url <url>`, and register a hook on
  its reviews where the harness offers one; otherwise check its submitted rows at session start
  ([hosted review](https://github.com/ncrispino/reelplanner/blob/main/docs/hosted-review.md)).
- **At session start**, run `$RP inbox` and handle every waiting review, oldest first.
