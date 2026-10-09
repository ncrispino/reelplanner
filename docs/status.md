# Status: what's built and what's left

The [README](../README.md) describes the whole workflow. This page shows how much of it works today.
Every stage below has run on this repo's own plans (`.reelplanning/plans/`); `reelplanning reel status .`
lists them, each with its stage, reviews and decisions.

| Stage | Status |
|---|---|
| Ask for a plan, get a video | ✅ The skill writes the plan into `.reelplanning/plans/`, checks it against past decisions and builds the video. It takes over whenever the agent picks the skill for a planning request; plans made in Claude Code's plan mode are not routed to it automatically yet. |
| An existing plan → video | ✅ load the plan-to-video skill: `/plan-to-video path/to/plan.md` in Claude Code, `$plan-to-video path/to/plan.md` in Codex. |
| An explainer of what is already there | ✅ `reelplanning explain "<question>" <sources…>` pins the sources, and the video quotes them word for word; `check-sources` stops a line its source does not hold. |
| The review page opens by itself | ✅ `reelplanning review <video-dir>` bundles the player with the video, serves it locally and opens the browser; the skill runs it when a video is ready. |
| First plan in an existing repo | 🟡 The skill maps the code into `.reelplanning/` and builds the system video from that map alongside the first plan video, so you can correct the map while you review the plan. Not yet run on an existing repo other than this one. |
| Fresh eyes before you watch | ✅ `fresh-eyes` gives two fresh subagents, a newcomer and a designer, only what a viewer gets (each scene's narration and a picture of it at rest, through the review page); every finding is answered before the page opens, and `verify` stops on one that isn't. |
| Watch, comment, decide | ✅ Local player, hosted player, one-click handoff to Claude from a published Artifact. Questions take 2–4 options or "pick all that apply" and are answered on the frame itself, with a click or A–D; any answer can carry a note. Rewinds and slow-downs reach the agent in `reviews/<id>.md` as steps to say more plainly. A quick check you miss marks that step for the next video. |
| The guide under the video | ✅ Each video's guide sits under it on the same page: the plan's cases, interface and worked examples, diagrams you can step through, saved runs, and after the build what changed and what the agent decided alone. Any words on it can be highlighted to leave a note. A scene can also open a detail page over the paused frame. |
| Revise the plan, rebuild the changed scenes | ✅ Only the frames a review changed are rebuilt, and narration is cached per line. The player plays just the changes by default. Sending from the local page reaches the open session, or starts the repo's headless agent when none is open (tested with Claude Code, through a real headless `claude -p` run to the notification). |
| Implement to the plan | ✅ Decisions are constraints; the agent logs each of its own choices as it makes it, in `walkthrough.md`. |
| Check the code against the plan | ✅ `code-check` writes a short brief that a fresh subagent, which never saw the implementer's conversation, answers. `reel audit` fails until every ✗ it found is answered. It has found real gaps. |
| Walkthrough video | ✅ The change running, before and after, in about two minutes (style guide §8); it pauses only for what you'd notice or can't easily undo (`reel stops`), the rest a list at the end; a quick check where there is something to predict. |
| Accept / flag → code rewritten | ✅ `walkthrough-scope` sorts the verdicts, flagged code is fixed, only the changed beats are rebuilt, and accepted choices join the decision log. |
| System video, kept current | ✅ [Built](../.reelplanning/system-video/). `spec-diff` names the frames a spec change affects and `reel status` says when the video is behind and how much an update would rebuild. |
| Several people | ✅ A pull request gets a video only over the line (`reel pr-check`); decision numbers renumber at a rebase (`reel renumber`); CI runs the fast suite on each push to `main` and to a pull request, the full suite on each push to a pull request (`.github/workflows/ci.yml`), and `reel pr-check` on each pull request (`.github/workflows/pr.yml`); pushes to other branches are not tested. |

The original milestones (M0–M4) and layers (L0–L4) are in the [original plan](./history/original-plan.md) §2.1 and §6.

## Before going public

Done:

- **The Bob Dylan case study**, published in [reelplanning-case-studies](https://github.com/ncrispino/reelplanning-case-studies)
  ([its pages](https://ncrispino.github.io/reelplanning-case-studies/bob-dylan/)): an interactive site from an empty
  folder through four plans, seven videos, each reviewed, with the project, the reviews and the session. The kit for
  it is [`eval/case-studies/`](../eval/case-studies/).
- **Codex's flags and commands are checked** against codex-cli 0.160.0's own help and a run of its sandbox
  with no model ([agents](./agents.md#codex)).

Left, for the owner ([`docs/releasing.md`](./releasing.md), "Going public"):

- **The switch:** rename this repo (e.g. `reelplanning-dev`), create the empty public `ncrispino/reelplanning`, run
  `node scripts/release/make-public.mjs` and the push it prints, then check the install on a fresh machine.
- **Announce it:** the post and replies drafted in [`docs/releasing.md`](./releasing.md#announcing-it), once the
  install works from a fresh machine.
- **The repo page's About box:** `sh scripts/release/github-about.sh` (`--dry-run` first) sets the description and
  the 20 topics from `docs/github-topics.txt`, with your own `gh` login (setting topics needs admin rights on the
  repo, so no session can do it).

## Later (open work, not for the first release)

- **"Pause between parts" through a stalled page.** A question is met however late the player's clock ticks
  (`tickDecisions`, packages/player/test/stall.spec.mjs); the end-of-part pause (off by default) still uses only its
  time window, so a stall over a part's end can carry past it. It needs the same crossing test, and a rule for when a
  question and a part's end are crossed in one jump.

- **The comparison arms of the case study:** the same Bob Dylan prompt planned as plain text and as an HTML page, set
  beside the reelplanning run, as the kit allows ([`eval/case-studies/bob-dylan-site/`](../eval/case-studies/bob-dylan-site/README.md)).
- **A Codex run end to end** (and one more agent): install with `npx skills add`, then run a plan through. Not
  possible in the cloud sessions so far (no Codex CLI or key there).
- **The sample videos under `videos/` hosted where they play in the browser**; today they play on the local review
  page (`npm run review`), and the case study's videos are hosted on its pages.

- **Learn from edits made in the agent session, per person, and pass reelplanning-wide lessons upstream.** Today
  memory comes only from what a review records: `reel record` adds a summary of each review to your own file,
  `~/.reelplanning/you.jsonl` (answers, rewinds, words looked up, quick checks missed), `reel memory --you` reads
  it across repos, and `reel retro` proposes skill edits for the repo where the evidence is. What is missed:
  the changes you ask for in the conversation itself ("slower here", "no jargon on this frame", "show the real
  command"). Two halves:
  1. *Your taste:* when you ask your agent to change a video, keep the request as a line of your memory (with
     the scene and the change), so the next video you get, in any repo, starts closer to it; `reel memory --you`
     shows it and lets you remove a line.
  2. *Upstream:* when the same kind of change comes up for several people or videos, the agent drafts a
     suggested change to reelplanning itself (the skill, the style guide, a frame rule) as an issue or pull
     request text, with the evidence, for the person to send or not. Nothing leaves the machine without them.
  Where to start: `scripts/lib/memory.mjs` (`reviewFacts`, `recordYou`), `scripts/reel.mjs` (`memory`,
  `retro`), and the skill's "After a plan review".
- **Fresh eyes before narration, so the voice is made once.** Fresh eyes reads each scene's narration as text and
  looks at stills of the frames at rest; neither needs the audio. Running it on the script and the frames
  (scene lengths from the script's estimate) before `narrate`, and narrating after its fixes, saves re-voicing
  the lines it rewords, which on a small machine costs minutes a line. Where to start: `scripts/build.mjs`
  (the order of its steps), `scripts/fresh-eyes.mjs` (the shots), the skill's "Build a video".
- **An audio check, and a way to fix what it finds.** Nothing listens to the narration today: the build checks
  that each line has audio and that captions line up, not how it sounds. Every line is already transcribed for
  its word timings, so comparing that transcript with the script costs nothing extra: a word heard as something
  else is usually a mispronunciation ("Hibbing" heard as "hit being"); the timings give the pace (words per
  minute), long silences and clipped endings. The build would flag those lines. Ways to fix a flagged line, in
  the order to try them: (1) a spoken form for the word in the project's names table, which `narrate` hands the
  voice while the captions keep the written word, as `scripts/lib/say.mjs` already does for commands and file
  names; (2) phonemes for a word the spelling can't fix (Kokoro takes IPA input; a hosted voice like OpenAI's
  takes pronunciation instructions); (3) rewording the line; (4) another voice or provider. Each fix re-voices
  only that line, and the check runs again, so the loop can run without the person. Where to start:
  `scripts/narrate.mjs`, `scripts/lib/say.mjs`, `scripts/lib/narration.mjs`, `.reelplanning/names.md`.
  The two items above are independent and can be built in parallel.
- **Watch and review from the terminal: a Claude Code mod.** Today the review page opens in a browser. A Claude Code
  mod (a plugin of function hooks that draws a pane, band, status line or toast inside the terminal or the desktop
  Code tab) could bring the loop into the session itself: the review's state as the page now shows it after Send
  (waiting, working, ready), the questions still open with their options to pick by key, the walkthrough's calls to
  accept or flag, and a link or key that opens the video at the right moment. The video itself stays in a browser
  or the desktop app's panel; the mod is for everything around it, so a person who never leaves the terminal can
  still answer. Where to start: `GET /api/review/status` and `/api/review` in `scripts/review.mjs` (the state and
  where a review goes), `scripts/lib/inbox.mjs`, and the player's `reviewRow()` (the shape a review must have).
- **Live feedback while watching, and speaking it.** Today a review is comments left on the video, sent, then a
  wait while the agent revises and rebuilds. Two steps toward answering on the spot: (1) voice input, in general
  and for comments: hold a key and say it, transcribed (the transcribers `narrate` already uses with a key) and
  placed at the moment it was said; (2) a small, fast model that takes a comment as it is made and edits that scene
  then and there (its narration line, a label, the order of two steps), re-voicing one line with a hosted voice in
  a second or two, while larger changes still go to the agent as today. What it needs first: scene edits that
  rebuild one frame without a full build, and a clear line between what the small model may change in place and
  what must go back to the plan. Where to start: the player's annotation flow, `scripts/narrate.mjs` (one line at a
  time), `scripts/build.mjs`.
