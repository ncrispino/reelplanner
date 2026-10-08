# The loop, what's left: an agent that runs it in the background, narration that redoes only what changed, and a system video you can edit the system through

## The problem

The review loop works: this repo's own plans have been through it four times. You review on the
hosted page and press Finish, the agent reads your review, records it, revises the plan or fixes the
code, rebuilds only the frames that changed, and the page offers "Play just the changes". Two things
still make it slow or manual.

- **You wait, and you relay.** A build runs while you watch the session, and nothing tells you when a
  video is ready. A review is picked up only because you tell an open agent session "I submitted".
  The repo also carries a GitHub Action, scaffolded but never run, that revises when a push changes a
  `plan.resolved.md`. But the agent writes that file when it records a review, so by the time a push
  could trigger the Action, the work is done. It would only help if reviews arrived as files someone
  commits by hand.
- **Every rebuild re-narrates every line.** Rebuilding two frames of the system video re-narrated all
  35 lines and took 11 minutes. The 33 unchanged lines came out byte-identical, so the work was
  wasted, and it is why an update to a video feels expensive.
- **The system video is watch-only.** You can mark and comment on it in the player, but the review
  has nowhere to go: intake accepts only a review of a plan, and the system video has no plan. Yet it
  is the one video that shows the whole system, so it is where you would spot what is wrong with it.

## What changes

Three changes, independent of each other; any one is useful alone. A proof at the end needs all three.

1. **Rebuilds get cheap** (step 1). Only lines whose words changed are narrated again.
2. **The loop runs itself** (steps 2 and 3). One main session hands the building, the implementing and
   the checking to background workers and tells you when a video is ready; pressing Finish reaches it, or starts a fresh run when none is
   open. You stop waiting and relaying.
3. **The system video can be reviewed** (step 4). A comment on it fixes the video or changes the
   system.

Then step 5 proves the three together on real reviews.

Steps 1–5 are built. Your review of their walkthrough added a second round, steps 6–10:

4. **A run nobody is watching gets the right powers** (step 6). Today it can edit and run any
   command, but not start its own workers or read the web.
5. **Reviews ask where you might disagree, and stop only where it matters** (steps 7 and 8). More
   quick checks, since a wrong answer shows where you expected something else; fewer stops for the
   agent's calls, since you accepted 68 of 71.
6. **Less scaffolding** (step 9). Keep the tools that do mechanical work; loosen the rules that only
   dictate format.

## Steps

### Step 1 — Narrate only the lines that changed

*Independent.*

Keep each narrated line's audio and word timings under a key made of its text, the voice, the speed
and the TTS model. On a rebuild, lines whose key is unchanged reuse what is kept; only new or edited
lines go to the TTS and the transcriber. The HyperFrames narration script is not changed: a
reelplanning step hands it only the lines that need a voice, then puts the kept ones back. `reel
status` and `spec-diff` say what an update costs in lines to narrate, not in the whole video. The
system-video update above would have narrated 2 lines instead of 35: about 40 seconds, not 11 minutes.

### Step 2 — Builds run in the background, and you are told when a video is ready

*Independent.*

One main agent session runs the work: the one you talk to. It never sits on a long job. It hands each
one to a background worker and stays free for you, then checks what comes back, runs the tests and
commits. The jobs: building a video (a plan video, a walkthrough, a system-video update, a rebuild
after a review); implementing an approved plan, split into parts that can run at once, each worker
logging the calls the plan did not make; the code check, by a fresh agent that never saw the
implementers' conversation; and fixing what you flagged. Every plan in this repo so far was run this
way, by hand; this step makes it the default. When `verify` passes and the review page
is published, reelplanning itself sends a desktop notification with the link and what is waiting
("2 choices to make, 3 min"), so it works the same under any agent. Where the agent has its own
notifications (a phone push, a message in the session), it uses those too.

### Step 3 — Pressing Finish reaches the main session, or starts one

*Needs step 2 (the session hands the work to a background worker and notifies).*

No hooks into the agent. When you press Finish:

- **A main session is open:** it hears about the review and acts on it, handing the rebuild to a
  worker. On the hosted page (a claude.ai artifact, so Claude only) the page tells the session through
  a hook the session registered when it published the page. On the local page (`reelplanning review`,
  any agent) the review is written into the repo, and the session is waiting on that review server as
  one of its background tasks.
- **No session is open** (the laptop was closed): the review server starts a fresh run of the repo's
  agent, headless, to do what the main session would have done. Claude Code, Codex and opencode all
  have one (`claude -p`, `codex exec`, `opencode run`); the repo names its command once, in
  `.reelplanning/config.json`. With nothing running at all, not even the review server, the review is
  picked up when the next session starts (D-064).

Nothing is lost between sessions: the plans, the reviews, the decision log and the videos live in
`.reelplanning/`, so a fresh run picks up exactly where the main session would have.

### Step 4 — Reviewing the system video changes the system

*Independent. Uses steps 1–3 when they exist; works without them, by hand.*

A review of the system video is accepted like a plan's. Each frame already names the spec section and
the parts it explains (its `spec_section` and `components` tags); `plan-map.json` carries them, so every
mark, comment, rewind or missed quick check lands on those parts. The agent sorts each comment:

- **The video is wrong or unclear.** It fixes the spec text or the frame and rebuilds that frame only.
  No plan.
- **The system should change.** A small change inside one part goes straight in and is shown in a
  short walkthrough to accept or flag; anything with a choice, or touching several parts, becomes a
  plan first (D-065).

Either way the next system video shows the change, and the comment is answered where you made it.

### Step 5 — Prove it on real reviews

*Needs steps 1–4.*

Remove the GitHub Action (`.github/workflows/reelplanning-revise.yml` and its template in
`templates/reelplanning/`), and say in the docs how the loop runs. Then submit two real reviews, one
of this plan's walkthrough and one of the system video, and time each from Finish to the notification
that the revised video is ready.

### Step 6 — What a run nobody is watching may do

*Independent.*

A run the review server starts has nobody to answer a permission prompt, so anything that would
prompt is refused and the run carries on without it. Today's command (`claude --permission-mode
acceptEdits --allowedTools Bash -p`) allows file edits and every shell command. It refuses three
things a run might want: starting its own workers (subagents, which inherit the run's permissions),
reading the web, and any MCP tool. It also has no fence: a shell command can write anywhere the user
can, and reach any host. This step picks the setting (question 2), writes it into this repo's
`config.json` and the one `reel init` writes, says what each agent's equivalent is (Codex `codex exec
--full-auto`, which keeps writes inside the workspace; opencode's permission config), and re-runs the
step 5 proof with it.

### Step 7 — More quick checks, and a wrong answer is a comment

*Independent.*

A quick check asks you to predict what the plan or the code will do. Get it wrong and you have found
a place where you expected something else, which is exactly what a review is for. Today the style
guide allows at most one per part, so a six-minute walkthrough asks two. This step raises that
(question 3), and asks for questions of that shape: "what happens when…", whose wrong options are
the things a reasonable person might expect instead. After any answer the sheet now offers a box
("Expected something else? Say how it should work"), and those words reach the agent as a comment
on that step: the plan is revised, or the code fixed, to match. The box was a direct request and is
built already; this step is about how many checks, and of what kind.

### Step 8 — Stop only for the calls you might overturn

*Independent.*

Of the 71 calls the agent has put to you across four walkthroughs, you accepted 68 as they were. The
other three were things you would feel or that carry risk: Escape throwing away typed words (A10,
richer review), what an unattended run may do (A11 here), and the hosted-page hook not being built
(d1 here). The plan questions did better: 3 of 12 got your own words. So the calls, not the plan
questions, are what to thin out. The agent tags each call when it logs it: *visible* (you would
notice it using the thing), *hard to undo* (data, security, permissions, a public interface),
*deviation* (the plan said otherwise), or *close* (a reasonable person could well pick the other
way). A tagged call stops the video as today. Untagged calls share one beat at the end of their part,
listed with what was chosen instead; you accept them all at once, or flag any one. Question 4 is
whether your own record also decides what stops.

### Step 9 — Less scaffolding

*Independent.*

A fresh agent audited what the skill asks of an agent. The agent reads about 12,000 words before it
starts: the skill (4,800) and the style guide (7,200). Each plan leaves about ten files of its own.
The mechanical tools earn their place: narration, timing, captions, `verify`, `plan-diff`, the review
server, intake, the ledger guard in `reel check` and the code check. So do the storyboard tags the
player reads. What is too much is text that dictates format, and files that say the same thing twice:

- **Rules that hurt.** "Autonomous mode" at the end of the skill describes this repo, but ships to
  every repo and skips the storyboard check-in there; it moves to this repo's `CLAUDE.md`. `reel
  check` reads a step only as `### Step N — ` with that exact dash, so "Step 1: …" silently has no
  steps. And a revised plan has to rename its own questions' heading to get past `reel check`,
  which should simply skip the plan's own decisions.
- **Format for its own sake.** The warnings demanding a `## What changes` heading and the exact
  `*Needs step N (why).*` line become one sentence of advice. So do the seven fixed detail kinds, the
  stage kinds, and the pixel sizes in the style guide. The plan folder's hand-ticked README checklist
  goes (it is stale in two plans; `reel status` knows the stage).
- **Said twice.** The skill walks an agent through nine build commands by hand, where one command can
  run them. The style guide reads as a changelog and contradicts itself (a 120 s video in one
  section, a series of parts in another). A review is kept three times (the annotations, a resolved
  copy of the whole plan or walkthrough, and one or two scope files).

Question 5 is how far this goes.

### Step 10 — Prove it on the next plan

*Needs steps 6–9.*

The next plan through the loop (the Bob Dylan site example, redone from scratch) uses the new quick
checks and the call filter. Count, in its review, the quick checks answered wrong and what each
changed, and the stops against the calls you accepted without stopping.

## Components touched

- **The plan-to-video skill** — background builds (step 2), being started by a review (step 3), the
  narration step (step 1)
- **The reel CLI** — `status` and `spec-diff` report cost in lines to narrate; the review server starts
  a fresh run when no session is open (step 3)
- **The review player** — Finish says what happens next; the system video can be reviewed (step 4)
- **The system video** — its reviews change the system (step 4)
- **The push-triggered workflow** — removed (step 5)
- **The reel CLI** — the headless command's permissions in `config.json` (step 6); `reel check`
  loosened (step 9); one build command (step 9)
- **The plan-to-video skill** — how many quick checks, and of what kind, in its style guide (step 7);
  calls tagged when logged (step 8); trimmed, with its templates (step 9)
- **The review player** — tagged calls stop, the rest share a beat (step 8); a note after a quick
  check (step 7)

## How each was decided

1. **How far does the first version go beyond Claude Code?** (step 3)
- **A · One setting, tested with Claude Code.** The repo names its agent's headless command, so Codex
  and opencode work by changing one line, but only Claude Code is run end to end in this plan.
- **B · Tested with all three.** Every agent is run end to end in step 5. Triples the proof, and needs
  each CLI installed and signed in.
- **C · Claude Code only.** No setting; other agents come later, with their own plan.
I recommend A: the only agent-specific part is one command, so supporting the others costs a line of
config, while testing them all is what would add the most work.

## Open questions for the reviewer

Numbered after the first round's question 1 (D-066, decided), so each keeps one number for good.

2. **What may a run nobody is watching do?** (step 6)
- **A · As now: edits and any shell command.** Simple, and the step 5 proof passed with it. It cannot
  start workers or read the web, and nothing fences what its commands touch.
- **B · Auto mode, inside the sandbox.** `--permission-mode auto --permission-prompts none`: a
  classifier approves each action, workers and the web included, and refuses risky ones (a refusal
  just skips that action). Claude Code's sandbox (`sandbox.enabled`) keeps shell writes inside the
  repo and network to named hosts. Needs auto mode on your account, and bubblewrap on Linux; no
  native Windows.
- **C · Everything, inside the sandbox.** `--dangerously-skip-permissions` with the sandbox on:
  nothing is refused, the sandbox is the only fence. Refuses to run as root; the docs recommend it
  only in a container.
- **D · A short list.** Edits, plus only `node`, `npx`, `git` and `ffmpeg` commands. The tightest;
  a command outside the list is refused, and still no workers or web.
I recommend B: the run can do everything the main session does (workers are how it splits a rebuild),
a classifier sits where you would have, and the sandbox bounds what a mistake can reach.

3. **How many quick checks does a video ask?** (step 7)
- **A · One per step, at least.** Each plan step, or each part of a walkthrough, ends with one: about
  one a minute. A six-minute walkthrough asks five or six.
- **B · Wherever there is something to predict.** No count: the agent asks one after every mechanism
  whose outcome a viewer could guess wrong. Could be two, could be twelve.
- **C · A: one per step, plus B's.** The floor of A, and more where there is something to predict.
I recommend C: the floor means no step goes unchecked, which B alone cannot promise, and the extra
ones go where a wrong answer is most likely, which A alone never adds.

4. **Does your own record also decide what stops?** (step 8)
- **A · The tags only.** A call stops when the agent tagged it. Simple and predictable; how well it
  works depends on how well the agent tags.
- **B · The tags, and your record.** The ledger already keeps every verdict. It also keeps the call's
  tags; a tag you have accepted ten times running across plans no longer stops on its own, and one
  flag brings it back. Learns what you care about; ten is a guess to tune.
- **C · Every call still stops.** Faster to get through (one key, and the untagged ones grouped), but
  nothing is left out.
I recommend B: it starts as A, and your verdicts, not a guess, decide what fades.

5. **How much scaffolding comes out?** (step 9)
- **A · Only what hurts.** Move "Autonomous mode" out, loosen the step heading, let a plan cite its
  own decisions, drop the checklist. Small and safe; the text stays as long.
- **B · A, and the text.** Also rewrite the skill and the style guide as one current guide each,
  about half as long, with the history moved to a design notes file. Format rules become goals.
- **C · B, and the files.** Also one command for the build, and a review kept once: the annotations,
  plus one short "what to act on" file instead of the resolved copies and scope files.
I recommend C: format rules and duplicate files are what an agent spends its attention on, and every
reader of the old files is covered by a test.

## Decisions in force

- **D-064** A background agent runs the loop between reviews. Steps 2 and 3.
- **D-066** One setting names the agent's headless command; only Claude Code is tested end to end. Step 3.
- **D-065** A system-video comment that asks for a change: small and local goes straight in, anything
  with a choice becomes a plan. Step 4.
- **D-003** Keeping the system video current must stay cheap; say what an update costs before
  anything runs. Step 1 is the rest of that.
- **D-005** Rewinds and slow-downs are sent automatically. Unchanged.
- **D-021** A detail opens in a side panel. Unchanged.
- **D-024** Detail pages are fixed types first. Unchanged.

## Not in this plan

Rewriting a plan from a review, rebuilding only changed frames, plan-diff and "Play just the changes":
built, and run on four plans. Re-rendering MP4s: still only on request.
