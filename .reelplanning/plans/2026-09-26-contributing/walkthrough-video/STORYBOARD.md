---
title: "Several people, one repo: what was built"
format: 1920x1080
duration: 290s
message: "All five steps of the contributing plan are built: when a pull request gets a video, and the check that reads it (step 1); who decides, and what lands on main (step 2); where the built video goes and how a maintainer watches it (step 3); decision numbers after a rebase (step 4); CI (step 5). Ten choices: four stop, one off-plan change stops on its own, five wait in grouped scenes. CI has never run on GitHub, and who owner is once a second person reviews is an open point."
arc: the change's map first (twenty-six files, one line a place); step 1 on the real pull request template and CONTRIBUTING.md, then real reel pr-check runs under and over the line, whose run opens everything the check counts; step 2 on a real reel record of a contributor's review and the check's two columns; step 3 on the maintainer's real commands and a real reelplanning review of a packed folder, with the page it serves; step 4 on a real rebase stopping at decisions.json and reel renumber fixing it; step 5 on ci.yml, its map of jobs first, then the one step that holds the full suite, which opens the whole file; each step's quick check after the next step's scenes, on a new case; the code check; what ran, what is not done, and the ask
audience: the repo owner, who asked how several people use reelplanning on a shared repo and approved this plan; knows the system video and the review page
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-26-contributing
terms: contributor = someone who sends a pull request to a repo they do not look after; maintainer = someone who can merge pull requests into the repo, listed under maintainers in its config.json; pr-check = the check every pull request gets (`reel pr-check`): whether it needs a video, from its changed lines, the ticked box and the needs-video label. It names a new flag, command or dependency and fails what must not merge; rebase = to move a branch's commits so they start from the main code as it is now, and git stops at each file both sides changed; renumber = the command that fixes decision numbers after a rebase (`reel renumber`): main's log as it is, the branch's own decisions after its last; gh = GitHub's command-line tool (`gh pr checkout 42` copies pull request 42's branch onto your computer); checkout = the repo's files as one branch has them, on your computer; plan map = the file a video's build writes, what each scene says and shows (`plan-map.json`), checked against plan.md; plan.md = the file a plan is written in: its problem, its steps and its questions for you; walkthrough.md = the file where the agent writes what it built, step by step, and each choice it made alone, one row each; CONTRIBUTING.md = the file in a shared repo that tells a contributor how to work in it, here when a pull request needs a video; config.json = the project record's settings file (`.reelplanning/config.json`), where the maintainers are listed; decisions.json = the decision log as data, one entry per decision (`decisions.md` is written from it); ci.yml = the file that tells GitHub which checks to run, and when (`.github/workflows/ci.yml`); ready-to-merge = the label a maintainer adds when their review is done, which starts the full suite; needs-video = the label a maintainer adds to ask for a video on any pull request; no-video = the label a maintainer adds to waive a video; full suite = every test of this repo, run in a browser, several minutes long (the fast suite runs the quick ones on every push)
terms_check: strict
details_check: strict
before: system#part 5 | the build, with the reel CLI
before: system#part 7 | memory, and six rules, with the reel CLI, the plan-to-video skill
before: 2026-09-22-m3-revise-loop | decisions D-065, D-082, D-083, D-084, D-085: when a system-video comment asks for the system itself to…
before: 2026-09-25-videos-you-can-follow | decisions D-127, D-128, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-22-m3-revise-loop | The loop, what's left: an agent that runs it in the…: decisions D-065, D-082, D-083, D-084, D-085: when a system-video comment asks for the system itself to…
recap: 2026-09-25-videos-you-can-follow | Videos you can follow: decisions D-127, D-128, D-129: which words does the viewer see: plain new ones, or…
recap: 2026-09-22-close-the-lifecycle | Close the lifecycle: implement to the plan, walk it…: decisions D-003, D-001: when does the system video update?
recap: 2026-09-24-memory | Memory: learn which questions are the right ones, from…: decisions D-106, D-107: where does your memory across repos live?
recap: 2026-09-25-fewer-better-stops | The right calls stop, and the walkthrough stays short: decisions D-110, D-109: a step reaches its fifth call during the build. What does…
recap: 2026-09-26-case-study | A case study for any plan: text only, HTML and ours, from…: decisions D-169, D-170: who reviews each arm, and in what order?
recap: 2026-09-23-deep-dives | Deep dives: the video opens into HTML where a video falls…: decision D-024: how is each detail page made?
---

## Video direction

- REAL THINGS WHERE THE BRIEF PICKS THEM (decision D-166): the change's map from `git diff --numstat 6ffbc60..e7904a3` over the plan's paths (1); the pull request template's "A video?" and `CONTRIBUTING.md`'s "When a PR gets a video" (2); two real `reel pr-check` runs on a scratch repo with a bare origin, Omar's 25-line `--quiet` under the line and Ana's ticked box over it (3, marked `data-detail="step-1"`); a real `reel record` of a contributor's walkthrough review and the check's "lands on main / stays in the PR" (6); the maintainer's three commands, a real `reelplanning review` of the contributing plan's video packed by `bundle-player`, and the review page it serves at 1440 × 900 (9); a real `git rebase origin/main` stopping at `decisions.json` and the real `reel renumber` (13); `.github/workflows/ci.yml`, its four jobs as a map first, then the `full` job's first step (16, marked `data-detail="ci"`); the code check's counts and `reel audit` (20).
- PARTS OF THE GUIDE IN THE FRAME (D-264, D-266): each scene with a `- guide:` part marks its real thing `data-detail="<part>"`: scene 3's terminal run leads to `step-1` (everything `reel pr-check` counts, names, waits on and fails; once the detail page `the-line`), scene 16's workflow slab to `ci` (the whole `ci.yml`; once the page `ci-workflow`). All at rest, outside any camera, above the lowest eighth, 40 px clear above.
- THE STOPS `reel stops` prints: step 1 `- autonomy: a2` (4); step 2 `- autonomy: a3` (7); step 3 `- autonomy: a6` (10); step 5 `- autonomy: a9` (17) and the off-plan change `- autonomy: d1` on its own (18). Grouped at each part's end: `a1` (5), `a4, a5` (12), `a7, a8` (15).
- QUICK CHECKS BY THE NEW RULE (style guide §7, decision D-197): step N's check after step N+1's scenes, the last just before the ending, each on a case the video did not show, `explained_at` the scene that explained its rule: k1 step 1, 280 lines of code and 400 of tests (8, explained at 2); k2 step 2, Sam accepts four choices in his own walkthrough review (11, explained at 6); k3 step 3, a video packed before plan.md changed (14, explained at 9); k4 step 4, two decisions renumbered after main's D-231 (19, explained at 13); k5 step 5, a required full suite with no ready-to-merge (21, explained at 17).
- SIX CHAPTERS: what was built, and step 1 (1–5); step 2, who decides (6–8); step 3, watching a contributor's video (9–12); step 4, decision numbers (13–15); step 5, CI (16–19); checked (20–22).
- MOTION LANGUAGE: things revealed by their own verb (typed, wiped, counted, struck); cut = a chapter, a quick check or a stop scene; push-slide LEFT = the next scene of a chapter; crossfade = the ending. No camera.
- THE ANSWER BAR: every frame's root carries `data-band="bottom"`; nothing is drawn below y 900 but the captions. Headings `data-question`, option cards `data-option`, choice cards `data-call`, whole and still.
- PLAIN WORDS (decision D-127): choice, scene, chapter, quick check, off-plan change. No id without what it is. Tool names in code markup on screen (`reel pr-check`, `reel renumber`, `reelplanning review`, `gh pr checkout 42`), as `.reelplanning/names.md` lists them.
- The look from `.reelplanning/theme/frame.md` and its tokens only; light and dark. One coral at a time; no gradients, glows, blur or drift. The final frame holds still.

## Frame 1 — What was built: its map

- guide: what-changed
- chapter_start: What was built, and step 1
- defines: contributor, maintainer, step
- scene: THE MAP (the real change, one row a place): a place label 'git diff --numstat 6ffbc60..e7904a3 · the plan's paths'; six rows, each a path in mono, one plain line and its count: `scripts/pr-check.mjs` · the check every pull request gets · +241; `scripts/renumber.mjs` · decision numbers after a rebase · +112; `scripts/reel.mjs` · `review.mjs` · `lib/` · who counts, a packed video served · +109 −14; `CONTRIBUTING.md` · the PR template · 2 templates · the rules, in plain words · +257; `.github/workflows/ci.yml` · the checks on every pull request · +111; `contributing.spec.mjs` · 39 new checks · +213; the total '26 files' counts up on 'twenty-six'; rows land on 'map'; each lights in turn on its words, the rest dimmed
- voiceover: "The contributing plan is built, all five steps, so a repo can take pull requests from other people. A contributor sends one; a maintainer, listed in the repo's settings, can merge it. Twenty-six files changed: the new check, the numbering command, who counts, the rules, the checks GitHub runs, and thirty-nine tests."
- duration: 16.875s
- transition_in: cut
- status: animated
- src: compositions/frames/01-the-map.html
- type: hook
- blueprint: compose
- layout: map
- focal: the change's map, one row a place
- sfx: none

narrativeRole: What was built: its map.
keyMessage: The contributing plan is built.

## Frame 2 — Step 1: when a pull request gets a video

- plan_step: 1
- guide: pr-check
- defines: review
- scene: THE REAL FILES: a place label 'step 1 · the pull request template, CONTRIBUTING.md'; left, the pull request template's "A video?" section as a document (its two boxes, the first ticked on 'ticks'); right, `CONTRIBUTING.md`'s "When a PR gets a video" as a document, its two bullets; on 'three hundred' '300 lines' underlined (the one coral); on 'needs-video' two label chips land: `needs-video` · asks, `no-video` · waives; on 'normal code review' the line 'Everything else merges on a normal code review' ringed in ink
- voiceover: "Step one. A pull request gets a video only when the contributor ticks this box, naming a choice a reviewer could make the other way, or it changes over three hundred lines of code: tests, docs, videos and generated files don't count. A maintainer can also add needs-video, or no-video to waive it. Everything else merges on a normal code review."
- duration: 20.331s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/02-step-1-the-rules.html
- type: feature_showcase
- blueprint: compose
- layout: document
- focal: the ticked box and the 300 lines
- sfx: none

narrativeRole: Step 1: when a pull request gets a video.
keyMessage: Step one: when a pull request gets a video.

## Frame 3 — Step 1: the check reads the line

- plan_step: 1
- defines: agent
- guide: step-1
- scene: TWO REAL RUNS (the slab marked data-detail="step-1"): a place label 'step 1 · a scratch repo · two pull requests'; one slab, `reel pr-check` twice: first `reel pr-check --base origin/main` on Omar's branch typed on 'Omar', printing '· under the line: a normal code review, no video (25 line(s) of 300, …)' and '· seen in the diff, not a reason by itself: a new flag: `--quiet`', 'under the line' underlined (the one coral) on 'under'; then on 'Ana' the same command on her branch, printing '· over the line (ticked: a choice (the port by default, 8790))' and '△ needs a video (…): the contributor brings one, or a maintainer's agent makes a walkthrough …'; the coral moves to 'needs a video' on 'needs'
- voiceover: "The new check, reel pr-check, reads the line. Omar's twenty-five lines add a --quiet flag, box unticked: under the line. Ana ticks the box for a default port: over the line, so it needs a video, from her or from a maintainer's agent. Click the run to see everything the check counts."
- duration: 17.088s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-step-1-the-check.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: the two runs, under and over the line
- sfx: none

narrativeRole: Step 1: the check reads the line.
keyMessage: The new check reads the line.

## Frame 4 — Step 1: a choice stops

- plan_step: 1
- autonomy: a2
- scene: STOP SCENE, ONE CHOICE CARD: a place label 'walkthrough.md · step 1 · 1 of 2 choices stops'; one card (data-call a2): 'choice A2 · waiting, not failing, until the merge check'; lands on its id
- voiceover: "Choice A2 stops. Over the line with no video yet, the check waits and passes, rather than failing every push; reel pr-check --merge, before a merge, fails it."
- duration: 9.963s
- transition_in: cut
- status: animated
- src: compositions/frames/04-step-1-stop.html
- type: cta
- blueprint: compose
- layout: cards
- focal: one choice, one pause
- sfx: none

narrativeRole: Step 1: a choice stops.
keyMessage: One choice in step one stops.

## Frame 5 — Step 1: the choice that doesn't stop

- plan_step: 1
- autonomy_group: a1
- scene: GROUPED SCENE: a place label 'step 1 · 1 choice, no pause'; one row (data-call a1): 'choice A1 · what the 300 lines leave out'
- voiceover: "One doesn't stop. Choice A1: the three hundred lines leave out tests, docs, the project record, videos and generated files."
- duration: 7.595s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-step-1-grouped.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- focal: one choice in the list
- sfx: none

narrativeRole: Step 1: the choice that doesn't stop.
keyMessage: One doesn't stop.

## Frame 6 — Step 2: who decides, and what lands

- chapter_start: Step 2: who decides
- plan_step: 2
- guide: who-decides
- defines: decision log
- scene: TWO REAL RUNS: a place label 'step 2 · Ana's pull request'; top slab, `reel record` on Ana's walkthrough review typed on 'files', printing '△ a contributor's walkthrough review (id:ana is not in config.json's maintainers: owner): … add nothing to the decision log' and '✓ ledger: +0 (nothing new), 2 total'; '+0' underlined (the one coral) on 'nothing'; on 'maintainer's' the pinned word 'counts: the maintainer's'; bottom slab on 'lists', `reel pr-check`'s two lines: '· lands on main: 2026-09-27-port: plan.md, walkthrough.md, the videos' text …' and '· stays in the PR: …/reviews/plan-… (id:ana)'; on '--tidy' a chip '`reel pr-check --tidy` · one commit'
- voiceover: "Step two: who decides. A contributor's plan review answers their plan's questions. Their walkthrough review is their own check: reel record adds nothing to the decision log; only a maintainer's review counts. The check lists what lands on main, and --tidy removes the contributor's reviews in one commit."
- duration: 17.685s
- transition_in: cut
- status: animated
- src: compositions/frames/06-step-2-who-decides.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: a contributor's review adds nothing to the log
- sfx: none

narrativeRole: Step 2: who decides, and what lands.
keyMessage: Step two: who decides.

## Frame 7 — Step 2: a choice stops

- plan_step: 2
- autonomy: a3
- scene: STOP SCENE, ONE CHOICE CARD: a place label 'walkthrough.md · step 2 · 1 choice stops'; above the card, the real line of `.reelplanning/config.json` in a small slab: '"maintainers": ["owner"]'; one card (data-call a3): 'choice A3 · maintainers: owner, no email'; lands on its id
- voiceover: "Choice A3 stops. The maintainers list says owner, with no email, so a review sent from the local page, under your git email, counts as a contributor's until that email is added. The other way was your email in a public file."
- duration: 13.504s
- transition_in: cut
- status: animated
- src: compositions/frames/07-step-2-stop.html
- type: cta
- blueprint: compose
- layout: cards
- focal: one choice, one pause
- sfx: none

narrativeRole: Step 2: a choice stops.
keyMessage: Choice A3 stops.

## Frame 8 — Quick check: tests and code

- plan_step: 1
- quiz: k1
- defines: quick check
- scene: QUICK CHECK: behind, a picture of a pull request's files, dimmed: two bars, 'code 280' and 'tests 400', an empty box; the heading 'A pull request: 280 lines of code, 400 of tests.' (data-question); three cards (data-option a to c): 'Needs a video: 680 is over 300', 'No video: the tests don't count', 'Needs one only if it adds a flag'
- voiceover: "Quick check, a question that asks you to predict. A pull request edits two hundred and eighty lines of code and adds four hundred lines of tests, box unticked. Does it need a video?"
- duration: 10.197s
- transition_in: cut
- status: animated
- src: compositions/frames/08-quick-check-k1.html
- type: social_proof
- blueprint: compose
- layout: quiz
- question: A pull request edits 280 lines of code and adds 400 lines of tests, box unticked, and no maintainer asked. Does it need a video?
- option_a: Needs a video: 680 is over 300
- option_b: No video: the tests don't count
- option_c: Needs one only if it adds a flag
- answer: b
- explain: Only lines outside tests, docs, videos and generated files count toward the 300, so this pull request has 280: under the line, a normal code review.
- option_a_why: 680 counts the tests; the line counts only the 280 lines of code, which is under 300.
- option_b_why: Right: tests are left out of the count, so 280 lines is under the line, and the box is unticked.
- option_c_why: A new flag is only named by the check, never a reason for a video by itself.
- walk_me_through: The line counts changed lines outside tests, docs, videos and generated files. Here that leaves the 280 lines of code; the 400 lines of tests are left out. 280 is under 300, the box is unticked and nobody added needs-video, so it merges on a normal code review.
- explained_at: 2
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: tests and code.
keyMessage: Quick check.

## Frame 9 — Step 3: watching a contributor's video

- chapter_start: Step 3: watching a contributor's video
- plan_step: 3
- guide: watching
- scene: THE REAL COMMANDS AND THE REAL PAGE: a place label 'step 3 · pull request 42 · the maintainer'; left, a slab of the maintainer's three commands typed on their words: `gh pr checkout 42` on 'checkout', `git clone -q --depth 1 -b video/pr-42 <url> ../pr-42-video` on 'clones', `reelplanning review ../pr-42-video` on 'review', then its real lines: '· ../pr-42-video: packed already (1 video), served as it is', '✓ 2026-09-26-contributing: its plan map is the checkout's …' ('the checkout's' underlined, the one coral, on 'matches'), and on 'another version' the real line from a pack whose map is older: '△ … built from another version of the plan …; ask for a rebuild'; right, the review page it serves (real screenshot, 1440 × 900) wiped in on 'serves'; on 'git' at the start a small chip 'git: the videos' text only'
- voiceover: "Step three. The built video never goes into git. The contributor packs it onto a branch of its own, video/pr-42. The maintainer runs gh pr checkout 42, clones that branch beside it, and runs reelplanning review on it. It serves the folder as it is, and says whether its plan map matches the checkout's, or was built from another version of the plan and needs a rebuild."
- duration: 21.632s
- transition_in: cut
- status: animated
- src: compositions/frames/09-step-3-watching.html
- type: feature_showcase
- blueprint: compose
- layout: before-after
- focal: a packed video, served as it is
- sfx: none

narrativeRole: Step 3: watching a contributor's video.
keyMessage: The built video never goes into git.

## Frame 10 — Step 3: a choice stops

- plan_step: 3
- autonomy: a6
- scene: STOP SCENE, ONE CHOICE CARD: a place label 'walkthrough.md · step 3 · 1 of 3 choices stops'; above the card, the real lines of `.gitignore` in a small slab: '.reelplanning/plans/*/*video/assets/' and '!.reelplanning/plans/2026-09-2[0-7]-*/*video/assets/'; one card (data-call a6): 'choice A6 · older plan folders keep their media'; lands on its id
- voiceover: "Choice A6 stops. This repo's plan folders up to September the twenty-seventh keep their voice files and pictures in git; later plans follow the rule. So a rebuild of an older video never leaves out voice files its page names."
- duration: 13.419s
- transition_in: cut
- status: animated
- src: compositions/frames/10-step-3-stop.html
- type: cta
- blueprint: compose
- layout: cards
- focal: one choice, one pause
- sfx: none

narrativeRole: Step 3: a choice stops.
keyMessage: Choice A6 stops.

## Frame 11 — Quick check: Sam's own review

- plan_step: 2
- quiz: k2
- scene: QUICK CHECK: behind, a picture of a walkthrough's four choice cards, dimmed, each with a tick; the heading 'Sam, not a maintainer, accepts all 4 choices of his own walkthrough.' (data-question); three cards (data-option a to c): 'Four entries join the log', 'None join the log', 'Four join once it merges'
- voiceover: "Quick check. Sam is not a maintainer. In his own walkthrough review, he accepts all four choices his agent made. How many join the decision log?"
- duration: 8.469s
- transition_in: cut
- status: animated
- src: compositions/frames/11-quick-check-k2.html
- type: social_proof
- blueprint: compose
- layout: quiz
- question: Sam is not a maintainer. In his own walkthrough review, he accepts all four choices his agent made. How many join the decision log?
- option_a: Four entries join the log
- option_b: None join the log
- option_c: Four join once it merges
- answer: b
- explain: A contributor's walkthrough review is a check for them: reel record files it and adds nothing to the decision log; only a maintainer's review counts.
- option_a_why: Only a maintainer's accepts join the log; Sam's review is his own check.
- option_b_why: Right: reel record files a contributor's walkthrough review and adds nothing to the decision log.
- option_c_why: Merging carries the maintainer's reviews to main; the contributor's own are removed before it, and never joined the log.
- walk_me_through: Sam is not listed as a maintainer, so his walkthrough review is a check for him. reel record files it and adds none of its four choices to the decision log. They join it only when a maintainer accepts them in a review of their own.
- explained_at: 6
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: Sam's own review.
keyMessage: Quick check.

## Frame 12 — Step 3: the choices that don't stop

- plan_step: 3
- autonomy_group: a4, a5
- scene: GROUPED SCENE: a place label 'step 3 · 2 choices, no pause'; two rows (data-call a4, a5): 'choice A4 · checked until it is approved', 'choice A5 · compared by what the map carries'; rows land on their ids
- voiceover: "Two choices in step three don't stop. Each video is also checked against the text it was built from. Choice A4: only until it is approved. Choice A5: by what its plan map already carries."
- duration: 11.733s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/12-step-3-grouped.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- focal: two choices in one list
- sfx: none

narrativeRole: Step 3: the choices that don't stop.
keyMessage: Two choices in step three don't stop.

## Frame 13 — Step 4: decision numbers

- chapter_start: Step 4: decision numbers
- plan_step: 4
- guide: renumber
- scene: THE REAL REBASE AND THE REAL RUN: a place label 'step 4 · two plans, one decision number'; left, two small tiles 'main · the cache plan · D-001' and 'Ana's branch · the port plan · D-001' land on 'both'; right, one slab: `git rebase origin/main` typed on 'rebases', printing 'CONFLICT (content): Merge conflict in .reelplanning/decisions.json' (ringed in ink on 'conflict'); then `reel renumber` typed on 'runs', printing its real lines: '✓ took origin/main's log (1 entries, the last D-001) and add this branch's 1 after it …', '✓ renumbered: D-001 → D-002' ('D-002' underlined, the one coral, on 'becomes'), '✓ rewrote their mentions in …/walkthrough.md, …/reviews/plan-….md', '△ the videos still say an old id; …', '  …/walkthrough-video/STORYBOARD.md:7 says D-001'
- voiceover: "Step four. Main's cache plan and Ana's port plan both made decision D-001. Ana's branch, merged second, rebases, stops at the conflict in decisions.json, and runs reel renumber: main's log stays as it is, and Ana's decision becomes decision D-002, after main's last. Its mentions are rewritten, and the video lines to rebuild are listed."
- duration: 22.763s
- transition_in: cut
- status: animated
- src: compositions/frames/13-step-4-renumber.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: D-001 becomes D-002, after main's last
- sfx: none

narrativeRole: Step 4: decision numbers.
keyMessage: Step four: decision numbers.

## Frame 14 — Quick check: a video packed too early

- plan_step: 3
- quiz: k3
- scene: QUICK CHECK: behind, a picture of two folders, dimmed: 'video/pr-57 · packed Monday' and 'the pull request · plan.md changed Tuesday'; the heading 'Pull request 57's plan.md changed after its video was packed.' (data-question); three cards (data-option a to c): 'Its plan map is the checkout's', 'Built from another version: ask for a rebuild', 'It rebuilds the video first'
- voiceover: "Quick check. Pull request fifty-seven changed its plan.md after its video was packed. You run reelplanning review on that video in its checkout. What does it say?"
- duration: 9.365s
- transition_in: cut
- status: animated
- src: compositions/frames/14-quick-check-k3.html
- type: social_proof
- blueprint: compose
- layout: quiz
- question: Pull request 57 changed its plan.md after its video was packed. You run reelplanning review on that video in its checkout. What does it say?
- option_a: Its plan map is the checkout's
- option_b: Built from another version: ask for a rebuild
- option_c: It rebuilds the video first
- answer: b
- explain: reelplanning review compares the packed video's plan map with the checkout's; when they differ, it says the video was built from another version of the plan.
- option_a_why: The packed plan map was written before plan.md changed, so it no longer matches the checkout's.
- option_b_why: Right: the plan maps differ, so it says the video was built from another version of the plan, and to ask for a rebuild.
- option_c_why: It serves the packed folder as it is and rebuilds nothing; the contributor rebuilds and pushes again.
- walk_me_through: The video was packed before plan.md changed, so its plan map describes the old plan. reelplanning review compares that map with the one in the pull request's checkout, and they differ. It says the video was built from another version of the plan, and to ask for a rebuild before trusting it.
- explained_at: 9
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: a video packed too early.
keyMessage: Quick check.

## Frame 15 — Step 4: the choices that don't stop

- plan_step: 4
- autonomy_group: a7, a8
- scene: GROUPED SCENE: a place label 'step 4 · 2 choices, no pause'; two rows (data-call a7, a8): 'choice A7 · the branch's own: none on main decided it', 'choice A8 · a memory line moves to its own reviewer'; rows land on their ids
- voiceover: "Two choices in step four don't stop. Choice A7: reel renumber takes an entry as the branch's own when main holds none deciding the same thing. Choice A8: a waiting memory line moves only to the reviewer it names."
- duration: 13.355s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/15-step-4-grouped.html
- type: benefit_highlight
- blueprint: compose
- layout: list
- focal: two choices in one list
- sfx: none

narrativeRole: Step 4: the choices that don't stop.
keyMessage: Two choices in step four don't stop.

## Frame 16 — Step 5: the checks GitHub runs

- chapter_start: Step 5: CI
- plan_step: 5
- guide: ci
- scene: THE REAL FILE, MAP FIRST (the slab marked data-detail="ci"): a place label '.github/workflows/ci.yml · 4 jobs'; left, the file's map, four rows landing on their words: 'fast suite · every push · npm test' on 'fast', 'reel pr-check · every pull request · with reel audit' on 'pr-check', 'full suite · once ready-to-merge' on 'full', 'video's branch · deleted when it closes' on 'closes'; right, the slab of the `full` job's first lines, as written: 'full:', '  name: full suite', '  steps:', '    - name: A maintainer's ready-to-merge', '      if: ${{ !contains(…labels.*.name, 'ready-to-merge') }}', '      run: |', '        echo "The full suite runs once a maintainer adds …"', '        exit 1'; 'exit 1' underlined (the one coral) on 'waits'
- voiceover: "Step five. CI runs the checks on GitHub by itself: the fast suite on every push; reel pr-check and reel audit on every pull request; the full suite once a maintainer adds ready-to-merge; and a closed pull request's video branch is deleted. Click the file to read it whole."
- duration: 16.64s
- transition_in: cut
- status: animated
- src: compositions/frames/16-step-5-ci.html
- type: feature_showcase
- blueprint: compose
- layout: code
- focal: four jobs, and the step that holds the full suite
- sfx: none

narrativeRole: Step 5: the checks GitHub runs.
keyMessage: Step five: CI, the checks GitHub runs by itself.

## Frame 17 — Step 5: a choice stops

- plan_step: 5
- autonomy: a9
- scene: STOP SCENE, ONE CHOICE CARD: a place label 'walkthrough.md · step 5 · 1 choice stops'; one card (data-call a9): 'choice A9 · no ready-to-merge: fails at once'; lands on its id
- voiceover: "Choice A9 stops. Without ready-to-merge, the full suite fails at once instead of being skipped. GitHub counts a skipped required check as passed, so a skipped suite would let a pull request merge untested."
- duration: 11.392s
- transition_in: cut
- status: animated
- src: compositions/frames/17-step-5-stop.html
- type: cta
- blueprint: compose
- layout: cards
- focal: one choice, one pause
- sfx: none

narrativeRole: Step 5: a choice stops.
keyMessage: Choice A9 stops.

## Frame 18 — Step 5: an off-plan change

- plan_step: 5
- autonomy: d1
- defines: off-plan change
- scene: STOP SCENE, THE OFF-PLAN CHANGE: a place label 'walkthrough.md · step 5 · off-plan'; one card (data-call d1): 'off-plan change D1 · ci.yml, not test.yml'; the name 'test.yml' struck on 'named'
- voiceover: "And one off-plan change, where the build did other than the plan: the file is ci.yml, not test.yml as the plan named it, since it runs more than the tests."
- duration: 9.621s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/18-step-5-off-plan.html
- type: cta
- blueprint: compose
- layout: cards
- focal: the off-plan change, on its own
- sfx: none

narrativeRole: Step 5: an off-plan change.
keyMessage: And one off-plan change.

## Frame 19 — Quick check: two numbers after the rebase

- plan_step: 4
- quiz: k4
- scene: QUICK CHECK: behind, a picture of two logs, dimmed: 'main · decisions … D-230, D-231' and 'your branch · decisions D-230, D-231'; the heading 'Main's log ends at decision D-231. Your branch also made decisions D-230, D-231.' (data-question); three cards (data-option a to c): 'Unchanged, as they were', 'After main's last', 'Main's two are renumbered'
- voiceover: "Quick check. Main's log ends at decision D-231. Your branch also recorded decisions D-230 and D-231. After reel renumber, what are yours?"
- duration: 11.349s
- transition_in: cut
- status: animated
- src: compositions/frames/19-quick-check-k4.html
- type: social_proof
- blueprint: compose
- layout: quiz
- question: Main's decision log ends at decision D-231. Your branch also recorded decisions D-230 and D-231. After reel renumber, what are yours?
- option_a: Unchanged, as they were
- option_b: After main's last
- option_c: Main's two are renumbered
- answer: b
- explain: reel renumber keeps main's log as it is and puts the branch's own decisions after main's last.
- option_a_why: Two entries cannot share an id; main's D-230 and D-231 are already on main.
- option_b_why: Right: main's log stays as it is, and your two go after its last, D-231: they become D-232 and D-233.
- option_c_why: An id on main never changes; only the branch's own entries are renumbered.
- walk_me_through: Main's log already holds D-230 and D-231, and an id on main never changes. reel renumber keeps main's log as it is and puts your branch's own two after its last, D-231. So yours become D-232 and D-233, and their mentions in your plan folder are rewritten.
- explained_at: 13
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: two numbers after the rebase.
keyMessage: Quick check.

## Frame 20 — Checked: the code check and the walkthrough check

- chapter_start: Checked
- defines: code check
- scene: THE REAL COUNTS: a place label 'code-check/findings.md · reel audit'; the code check's counts from findings.md as rows landing on their words: 'Steps · 5 of 5 ✓' on 'five steps', 'Decisions · 33 of 33 ✓' on 'thirty-three', 'Unexplained · 0' on 'nothing'; the slab below: `reel audit .reelplanning/plans/2026-09-26-contributing` typed on 'walkthrough check', printing its real line '✓ 2026-09-26-contributing: 5 step(s), 7 own decision(s), 35 cited, 0 failure(s)'
- voiceover: "A second agent checked the code against the plan: all five steps and thirty-three decisions hold, and it found nothing unexplained. The walkthrough check passes."
- duration: 8.789s
- transition_in: cut
- status: animated
- src: compositions/frames/20-checked.html
- type: benefit_highlight
- blueprint: compose
- layout: terminal
- focal: the checks, passing
- sfx: none

narrativeRole: Checked: the code check and the walkthrough check.
keyMessage: A second agent checked the code against the plan.

## Frame 21 — Quick check: no ready-to-merge

- plan_step: 5
- quiz: k5
- scene: QUICK CHECK: behind, a picture of a pull request's checks, dimmed: 'fast suite ✓', 'reel pr-check ✓', 'full suite · required'; the heading 'The full suite is required. Nobody added ready-to-merge.' (data-question); three cards (data-option a to c): 'Yes: the suite was skipped', 'No: the full suite fails', 'Yes, if it needs no video'
- voiceover: "Quick check. The full suite is marked required. A pull request passed its fast suite and reel pr-check, but nobody added ready-to-merge. Can it merge?"
- duration: 8.448s
- transition_in: cut
- status: animated
- src: compositions/frames/21-quick-check-k5.html
- type: social_proof
- blueprint: compose
- layout: quiz
- question: The full suite is marked required. A pull request passed its fast suite and reel pr-check, but nobody added ready-to-merge. Can it merge?
- option_a: Yes: the suite was skipped
- option_b: No: the full suite fails
- option_c: Yes, if it needs no video
- answer: b
- explain: Without ready-to-merge the full suite fails at once instead of being skipped, and a required check that failed blocks the merge.
- option_a_why: The full suite is never skipped: without the label it fails at once, since GitHub would count a skipped required check as passed.
- option_b_why: Right: without ready-to-merge the full suite fails at once, and a failed required check blocks the merge.
- option_c_why: The full suite is required for every pull request, whether or not it needs a video.
- walk_me_through: The full suite is the required check. Without ready-to-merge it does not skip; it fails at once, so the pull request shows a failed required check. It can merge only after a maintainer adds the label and the full suite passes on its last commit.
- explained_at: 17
- focal: the question and three predictions
- sfx: none

narrativeRole: Quick check: no ready-to-merge.
keyMessage: Quick check.

## Frame 22 — What ran, what is not done, and the ask

- guide: choices
- scene: WHAT RAN + NOT DONE + THE ASK: the five steps as rows (data-plan-step 1 to 5), each 'built'; right, rows on their words: 'tests · every fast spec · pass · 39 new' on 'test', 'not done · CI never ran on GitHub' on 'never', 'yours · 3 labels, the full suite required' on 'labels', 'open · who owner is, once 2 review' on 'open'; on 'Flag' the ask 'Flag a choice, or accept' outlined coral (the one coral); holds still
- voiceover: "Every test passed, thirty-nine new checks among them. Not done: CI has never run on GitHub, and the three labels and the required full suite are yours to set. One open point: the hosted page calls whoever publishes it owner, so a second reviewer there can't be told apart from you. Flag a choice, or accept the build."
- duration: 21.4s
- transition_in: crossfade
- status: animated
- src: compositions/frames/22-end.html
- type: cta
- blueprint: compose
- layout: steps
- focal: five steps built, what is not done, the ask
- sfx: none

narrativeRole: What ran, what is not done, and the ask.
keyMessage: Every test ran and passed.
