---
title: "Several people, one repo: contributing with reelplanning"
format: 1920x1080
duration: 270s
message: "Five steps, every question decided, for any shared repo, this one first. When a pull request gets a video: only when it makes a choice a reviewer could make the other way or changes over 300 lines, which reel pr-check reads, and who makes it: the contributor, or the maintainer's agent instead (step 1, D-214, D-200); who does what with one pull request, and what lands on main (step 2, D-201); watching with no rebuild and checking with CI and a code check (D-202), and the built video out of git's history (D-213), on a throwaway branch that is never merged and is deleted after the merge (D-215), with a real run of its commands (step 3); decision numbers in order with reel renumber (step 4, D-171); the fast suite on every push, the full suite before every merge and on the release tag, and the system video on main (step 5, D-003 kept)."
arc: one person per repo, then a shared repo and someone who may not use reelplanning; what changes before how; eight earlier plans in a line each (new viewers); the line as decided, choices or size, the check on a one-line fix that now needs no video, who makes the video as decided; one pull request, who does what, what lands on main; step 1's quick check on a new case; watching and checking said plainly, the real weight of a video in git, where it lives as decided, a real run of the throwaway branch; step 2's quick check; the real merge renumbered, as decided; step 3's quick check; CI and the system video on main; step 4's and step 5's quick checks; the plan, every question decided
audience: the repo owner, who asked how several people use reelplanning on a shared repo; knows the system video; decided where the built video lives (a zip, D-213) asking whether it would be easy and whether it stays out of git's history, said small PRs need no video, then answered two follow-ups in conversation (choices or size, D-214; a throwaway branch, D-215); rewound on step 3
mode: autonomous
music: none
plan_dir: .reelplanning/plans/2026-09-26-contributing
terms: pull request, contributor, maintainer, CI; CONTRIBUTING.md = the file in a shared repo that tells a contributor how to work in it, here when a pull request needs a video; pr-check = the check every pull request gets (`reel pr-check`): it says whether the pull request needs a video, from its changed lines, the contributor's ticked box and the needs-video label, and names any new flag, command or dependency it adds; plan.md = the file a plan is written in: its problem, its steps and its questions for you; terms index = the list of which video explains each word (`terms-index.json`), written again by every build
terms_check: strict
---

## Video direction

- REAL THINGS WHERE THE BRIEF PICKS THEM (decision D-166): the real review page (10), the real sizes of this repo's videos in git (11: `du` and `git ls-files`, run in this repo), the real run of the throwaway branch in a scratch copy (13: `bundle-player` packing this plan's video, the push, the maintainer's clone, the delete, a fresh clone's size), and the real merge of two branches in a scratch copy of this repo's records, its CONFLICT lines and the decisions.md rows with two D-194s (15). CONTRIBUTING.md (4) and the pull request page (5) are not built yet and are drawn as planned; PR #42, #43, #44 and Sam are an example, and each quick check has a case of its own (Omar's #58, Lee's #61, #64, #70 and #71); the rest explain with pictures.
- MOTION LANGUAGE: a camera moves over one view clipped at y 900 and is at rest, scale 1, when a question or quick check ends; things are revealed by their own verb (typed, printed, drawn, struck, wiped); cut = a new chapter, a question or a quick check; push-slide LEFT = the next scene of the same chapter; crossfade = a branch and the ending.
- SIX CHAPTERS: one repo, several people (1–3, scene 3 for new viewers only); step 1, when a PR gets a video and who makes it (4–6); step 2, who does what and what lands (7–9); step 3, watching, checking and where the video lives (10–14); step 4, records that merge, decided (15–16); step 5, CI and the system video, the last checks, the plan (17–20).
- QUICK CHECKS (decision D-197): step N's check comes after step N+1's scenes, and step 5's just before the ending; each asks about a case the video did not show. Step 1's (9), step 2's (14), step 3's (16), step 4's (18), step 5's (19).
- QUESTIONS: none left. Decided, said as kept: D-214 (4), D-200 (6), D-201 (8), D-202 (10), D-213 and D-215 (12), D-171 (15), D-003 (17).
- ONE EXAMPLE THROUGHOUT: Sam, a contributor; PR #42, the review page's default port; PR #43, a one-line fix in the reel CLI; a newcomer's PR #44; the owner, the maintainer.
- THE ANSWER BAR: every frame's root carries data-band="bottom"; nothing below y 900 but captions. Question and quick-check headings data-question, cards data-option, outside any camera, whole and still.
- PLAIN WORDS (decision D-127): scene, chapter, choice, decision log. Words this video defines where it first says them: pull request and contributor (1), maintainer (5), CI (10).
- The look from .reelplanning/theme/frame.md and its tokens only; one coral at a time; no gradients, glows, blur or drift. No details. The final frame holds still.

## Frame 1 — One person per repo, then a shared one

- chapter_start: One repo, several people
- defines: pull request, contributor
- scene: ONE LANE, THEN TWO: 'one person' then three chips drawn on their words, plan · review · merge; on 'shared' a second lane drops in, 'a contributor', with two small chips 'uses reelplanning' · 'does not'; on 'pull request' a 'PR #42' chip with 'pull request' pinned, a line drawn from it up to 'merge' with a '?'
- voiceover: "reelplanning assumes one person per repo, who plans, reviews the videos and merges. What happens when the repo is shared, and a contributor, someone who may not use reelplanning at all, opens a pull request: a change they ask to have merged?"
- duration: 13.653s
- transition_in: cut
- status: animated
- src: compositions/frames/01-one-owner.html
- type: hook
- blueprint: compose
- layout: diagram
- focal: one person's lane; a contributor who may not use reelplanning
- sfx: none

narrativeRole: One person per repo, then a shared one.
keyMessage: reelplanning assumes one person per repo, who plans, reviews the videos and merges.

## Frame 2 — What changes

- scene: A KICKER 'any shared repo · this one first'; THREE TILES landing on their words, each with its steps: 'when a PR gets a video' (step 1 · decided); 'who reviews, what lands' (steps 2, 3 · question 1: where the video lives); 'records, and tests' (steps 4, 5 · decided)
- voiceover: "This plan is for any shared repo, this one first. Step one: when a pull request gets a video, and who makes it. Steps two and three: who reviews, what lands on main, and where the video lives. Four and five: records that merge, and tests."
- duration: 13.376s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03-what-changes.html
- type: product_intro
- blueprint: compose
- layout: diagram
- focal: three changes, five steps, one question
- sfx: none

narrativeRole: What changes.
keyMessage: This plan is for any shared repo, this one first.

## Frame 3 — Eight earlier plans

- knowledge: new
- scene: EIGHT ROWS, ONE LINE EACH, landing on their words: close the lifecycle · the system video catches up, a second agent checks; memory · per person, in the home folder; the revise loop · a quick check per step; videos you can follow · plain words; fewer, better stops · the fifth choice asks; deep dives · pages from a template; better visuals · the real thing on screen; the case study · untouched
- voiceover: "Eight earlier plans lead here. The system video catches up after every accepted walkthrough, and a second agent checks the code. Memory lives in each person's home folder. A quick check per step. Plain words on screen. At a step's fifth choice, the builder asks. Detail pages start from a template. Scenes show the real thing. And the case study stays as it is."
- duration: 20.501s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/03b-before-this-plan.html
- type: feature_showcase
- blueprint: compose
- layout: list
- focal: eight earlier plans in a line each
- sfx: none

narrativeRole: Eight earlier plans.
keyMessage: Eight earlier plans lead here.

## Frame 4 — Step 1: the line, as decided

- chapter_start: Step 1: when a PR gets a video
- plan_step: 1
- guide: step-1
- scene: KICKER 'decided · decision D-214 · choices or size'. CONTRIBUTING.md AS A PAGE (planned), a small 'from reelplanning's templates' tag: heading 'When a PR gets a video'; two rules land on their words: a choice someone could make the other way (a default, a flag) · over 300 changed lines, 'or' between them; on 'no longer' a third line, 'changes a part's files', struck in coral, 'no longer counts' beside it
- voiceover: "Step one. CONTRIBUTING.md, which reelplanning gives any shared repo, draws the line, as you decided: a pull request gets a video only when it makes a choice a reviewer could make the other way, like a default or a new flag, or when it changes over three hundred lines. Which files it touches no longer counts."
- duration: 18.283s
- transition_in: cut
- status: animated
- src: compositions/frames/04-step-1-the-rule.html
- type: feature_showcase
- blueprint: compose
- layout: document
- focal: two tests: a choice, or over 300 lines; a part's files no longer count
- sfx: none

narrativeRole: Step 1: the line, as decided.
keyMessage: Step one.

## Frame 5 — The check, on a one-line fix

- plan_step: 1
- defines: maintainer
- scene: A PR PAGE MOCK, labelled 'planned · an example': title 'Fix an off-by-one in reel status #43', '+1 −1', `scripts/reel.mjs`; the template card's box 'Makes a choice a reviewer could make the other way' lights on 'ticks', left empty; the checks card prints `reel pr-check` · '2 lines · no new flag, command or dependency: no video needed' on 'normal code review', the camera leaning in on it and back; on 'maintainer' the Labels card lights: 'needs-video · maintainers only'
- voiceover: "Its check, reel pr-check, counts the lines and looks for a new flag, command or dependency; a choice it cannot see, the contributor ticks. So pull request forty-three, a one-line fix in the reel CLI, merges on a normal code review, with no video. And a maintainer, someone who can merge, can still ask for one on any pull request, with the needs-video label."
- duration: 20.16s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-the-pr-page.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- focal: a fix that makes no choice needs no video; a maintainer can still ask for one
- sfx: none

narrativeRole: The check, on a one-line fix.
keyMessage: Its check, reel pr-check, counts the lines and looks for a new flag, command or dependency; a choice it cannot see, the contributor ticks.

## Frame 6 — Who makes the video, as decided

- plan_step: 1
- scene: KICKER 'decided · decision D-200 · asked; the maintainer can make it'. TWO LANES, each drawn on its words: 'Sam · plans with reelplanning': plan video → code → walkthrough → PR, 'reviewed before the code' pinned under the plan video; 'a newcomer · doesn't': PR #44 → the maintainer's agent: `gh pr diff 44` + its text → walkthrough.md → walkthrough video, drawn in coral; on 'turned away' a pin 'nobody turned away'
- voiceover: "Who makes the video, as you decided. A contributor who plans with reelplanning, like Sam, brings a plan video, reviewed before the code, and a walkthrough. One who doesn't just opens the pull request, and the maintainer's agent makes the walkthrough from it. Nobody is turned away."
- duration: 15.061s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06b-the-cost.html
- type: feature_showcase
- blueprint: compose
- layout: diagram
- focal: the contributor brings the videos, or the maintainer's agent makes the walkthrough
- sfx: none

narrativeRole: Who makes the video, as decided.
keyMessage: Who makes the video, as you decided.

## Frame 7 — Step 2: who does what, with one PR

- chapter_start: Step 2: who does what, and what lands
- plan_step: 2
- guide: step-2
- scene: TWO SIDES, landing on their words. LEFT 'Sam · contributor': 1 'answers the plan's questions' with 'which port? → 8790'; 2 'checks the agent's choices' with a choice card 'port taken → try the next' and 'accepted'. RIGHT on 'maintainer': 'the owner · maintainer': 'watches the walkthrough', the same choice card with Accept · Flag, Flag lit coral on 'flags'. On 'help Sam' Sam's side dims to 'advisory'; on 'count' a coral pin on the owner's side: 'the review that counts'
- voiceover: "Step two, with pull request forty-two. Sam, the contributor, answers their own plan's questions, and checks their agent's choices before opening it. The owner, the maintainer, then watches its walkthrough, and accepts or flags each choice. Sam's checks help Sam; the owner's are the ones that count."
- duration: 16.256s
- transition_in: cut
- status: animated
- src: compositions/frames/07-step-2-two-roles.html
- type: feature_showcase
- blueprint: compose
- layout: split
- focal: the contributor plans and checks for themselves; the maintainer's review counts
- sfx: none

narrativeRole: Step 2: who does what, with one PR.
keyMessage: Step two, with pull request forty-two.

## Frame 8 — What lands on main

- plan_step: 2
- scene: TWO COLUMNS over PR #42's plan folder: 'lands on main' fills on its words: plan.md · the decision log's entries · walkthrough.md · reviews/walkthrough-…json (reviewer: owner); 'stays in the PR' on 'stay': Sam's plan review and Sam's walkthrough review (reviewer: id:7f3a), struck from the branch on 'tidy', with `reel pr-check --tidy` landing; on 'last one' the entry row: 'which port? → 8790' struck, '8787' beside it, and the kicker 'decided · decision D-201 · the last answer'
- voiceover: "So what lands on main is only what counts: the plan, its final decisions, walkthrough.md, and the owner's review. Sam's own reviews stay in the pull request's history: reel pr-check --tidy takes them off the branch before the merge. And if the owner changed one of Sam's answers, the log keeps the last one, as you decided."
- duration: 19.243s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/07b-what-lands.html
- type: feature_showcase
- blueprint: compose
- layout: table
- focal: only the plan, its final decisions, the walkthrough and the maintainer's review land
- sfx: none

narrativeRole: What lands on main.
keyMessage: So what lands on main is only what counts:

## Frame 9 — Quick check: a small PR with a flag

- plan_step: 1
- scene: THE CHECK'S OWN CASE, small, top right: a PR card '#58 · Omar · +25 −0 · the reel CLI · a new flag, --quiet · no video'; the heading and three cards land, outside the camera, still
- voiceover: "Quick check, on step one. Omar's pull request is twenty-five lines, and adds a new flag to the reel CLI. He doesn't use reelplanning. What happens?"
- duration: 8.789s
- transition_in: cut
- status: animated
- src: compositions/frames/06-qc-one-line-fix.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k1
- question: Omar's PR #58 is 25 lines and adds a flag, --quiet, to the reel CLI. He doesn't use reelplanning. What happens?
- option_a: It merges on a code review: 25 lines
- option_b: It waits for Omar's video
- option_c: The maintainer makes its walkthrough
- option_c_more: The maintainer's agent writes its walkthrough from the pull request, and builds the video.
- answer: c
- explain: A new flag is a choice a reviewer could make the other way, so it gets a video at any size; Omar doesn't use reelplanning, so the maintainer's agent makes the walkthrough.
- walk_me_through: Pull request 58 is only 25 lines, but it adds a flag, and a flag is a choice a reviewer could make the other way, so it crosses the line; size is only the other test. Omar doesn't use reelplanning, so he just opens it. The maintainer's agent writes its walkthrough from the diff and the pull request's text, and nothing waits on Omar.
- option_a_why: Size is one test of two: a choice, like a new flag, crosses the line at any size.
- option_b_why: Nobody is turned away: a contributor who doesn't use reelplanning is never asked for a video.
- option_c_why: Right: a flag is a choice, and the maintainer's agent makes the walkthrough from the pull request.
- explained_at: 6
- focal: three predictions, on a case the video did not show
- sfx: none

narrativeRole: Quick check: a small PR with a flag.
keyMessage: Quick check, on step one.

## Frame 10 — Step 3: watching and checking, as decided

- chapter_start: Step 3: watching, checking, and where the video lives
- plan_step: 3
- guide: step-3
- defines: CI
- scene: RIGHT, THE REAL REVIEW PAGE (a real screenshot, data-artifact) wipes in on 'serves', 'no rebuild · no voice engine' under it. LEFT, on 'decided' the kicker 'decided · decision D-202 · CI's checks, and a code check', then TWO ROWS landing on their words: 'in CI' · `reel pr-check` · `reel audit` · 'the video matches the plan' · every PR, seconds; 'the code check' · 'a fresh agent reads the code' · the maintainer, minutes; a pin 'CI · the checks GitHub runs on every PR' on 'CI'
- voiceover: "Step three. The maintainer watches a contributor's video without building anything: reelplanning review just serves the files. Then, as you decided, two checks. On every pull request, CI, the checks GitHub runs, confirms the video matches the plan, in seconds. And before accepting, the maintainer's own code check: a fresh agent reads the code, in minutes."
- duration: 20.117s
- transition_in: cut
- status: animated
- src: compositions/frames/13-step-3-where.html
- type: feature_showcase
- blueprint: compose
- layout: screen
- focal: watched with no rebuild; two checks: CI's, then the maintainer's code check
- sfx: none

narrativeRole: Step 3: watching and checking, as decided.
keyMessage: Step three.

## Frame 11 — The video is heavy in git

- plan_step: 3
- scene: A REAL RUN IN THIS REPO (terminal-run, data-artifact), each command typed and its answer printed on its words: `du -sh …/video/assets/voice` → 15M on 'voice alone'; `du -sh .git` → 893M on 'history'; `git ls-files '*.wav' | wc -l` → 779; the two sizes ringed in coral; a pin 'in git for good' on 'good'
- voiceover: "But where does the built video live? Today the branch carries it, voice files and all, in git for good. This plan's video has fifteen megabytes of voice alone, and this repo's history is already eight hundred and ninety-three megabytes."
- duration: 12.8s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/13b-heavy.html
- type: pain_point
- blueprint: compose
- layout: terminal
- focal: a built video in the branch is heavy, and stays
- sfx: none

narrativeRole: The video is heavy in git.
keyMessage: But where does the built video live?

## Frame 12 — Where it lives, as decided

- plan_step: 3
- scene: KICKER 'decided · decision D-213 · decision D-215 · a throwaway branch'. MAIN AS A LINE across the top; on 'text' a branch 'pr-42 · the text, 1 MB' drawn off main and back into it ('squash and merge'); on 'throwaway' a second lane under it, 'video/pr-42 · the packed video, 5 MB', drawn dashed and never joining main, 'never merged' pinned; on 'clones' an arrow from it to 'the maintainer: git clone · reelplanning review'; on 'deleted' the lane is struck in coral, 'deleted after the merge'
- voiceover: "As you decided, the built video never lands in main's history. The pull request's branch carries only the video's text. The built video goes on a throwaway branch of its own, never merged: the maintainer clones it and runs reelplanning review, and it is deleted after the merge."
- duration: 15.787s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/15-q-where-video.html
- type: feature_showcase
- blueprint: compose
- layout: diagram
- focal: the text rides with the PR; the built video on a branch that is never merged, then deleted
- sfx: none

narrativeRole: Where it lives, as decided.
keyMessage: As you decided, the built video never lands in main's history.

## Frame 13 — Would it be easy? A real run

- plan_step: 3
- scene: A REAL RUN IN A SCRATCH COPY (terminal-run, data-artifact), each command typed and its answer printed on its words: `reelplanning bundle-player ../pr-42-video …` → '71 files, 5.2 MB' on 'five megabytes'; `git init … && git commit`; `git push --force "$url" video/pr-42` → '* [new branch]'; the maintainer's `git clone -q --depth 1 -b video/pr-42 …`; `git push origin --delete video/pr-42` → '- [deleted]' on 'after'; `git clone … && du -sh ../fresh/.git` → its size in kilobytes on 'kilobytes', ringed; a pin 'every step a command' on 'command'; on 'catch' a coral pin 'after the merge: gone · rebuild from its text'
- voiceover: "Would it be easy? Yes: every step is a command an agent runs, nothing by hand. In a real run the packed video is about five megabytes; a clone gets it only while its branch exists, and after, a fresh clone is back to main's text alone: kilobytes, not megabytes. The catch: once it is deleted, watching it again means rebuilding it."
- duration: 18.752s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/17-branch-where-b.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: every step is a command; a fresh clone is back to kilobytes once the branch is deleted
- sfx: none

narrativeRole: Would it be easy? A real run.
keyMessage: Would it be easy?

## Frame 14 — Quick check: what main holds

- plan_step: 2
- scene: THE CHECK'S OWN CASE, small, top right: 'PR #61 · Lee: 4 accepted · the owner: 1 flagged, then fixed'; the heading and three cards land, still
- voiceover: "Quick check, on step two. Lee accepted all four of their agent's choices; the owner flagged one, and it was fixed. After the merge, what reviews does main hold?"
- duration: 8.939s
- transition_in: cut
- status: animated
- src: compositions/frames/08-qc-two-reviews.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k2
- question: Lee accepted all 4 choices in PR #61's walkthrough; the owner flagged one, and it was fixed. What reviews does main hold?
- option_a: Lee's and the owner's
- option_b: Only the owner's
- option_c: None: only the code
- answer: b
- explain: The owner's review is the one that counts, and lands with the plan; Lee's own reviews stay in the pull request's history.
- walk_me_through: Lee's accepts helped Lee fix things before the pull request; they decide nothing. The owner's review, the flag and the accept after the fix, is the one that counts, so it lands on main with the plan, its decisions and walkthrough.md. Lee's own reviews stay in pull request 61's history: reel pr-check --tidy takes them off the branch before the merge.
- option_a_why: Lee's reviews are Lee's own checks: they stay in the pull request's history, off main.
- option_b_why: Right: the owner's review counts, and lands; Lee's stay in the pull request.
- option_c_why: The plan, its final decisions, walkthrough.md and the owner's review all land with the code.
- explained_at: 8
- focal: three predictions, on a case the video did not show
- sfx: none

narrativeRole: Quick check: what main holds.
keyMessage: Quick check, on step two.

## Frame 15 — Step 4: records that merge, as decided

- chapter_start: Step 4: records that merge
- plan_step: 4
- guide: step-4
- scene: KICKER 'decided · decision D-171 · in order, a merge rule'. THE REAL MERGE (terminal-run, data-artifact): the two CONFLICT lines, then the decisions.md rows: <<<<<<< HEAD, | D-194 | … 2026-09-27-cache …, =======, | D-194 | … 2026-09-27-port … 8790 …, >>>>>>> sam, both ids ringed on 'D-194'; on 'renumber' `reel renumber` lands and the second row's D-194 is struck, D-195 wiped in beside it. Under it, on 'terms index', a row: `terms-index.json` · 'take main's · write again' with `reelplanning terms-index`
- voiceover: "Step four, as you decided: numbers stay in order. In a real run, two branches each wrote decision D-194. The one merged second runs reel renumber, and its entry becomes decision D-195. The terms index, which builds write, is never merged by hand: take main's copy and write it again."
- duration: 18.261s
- transition_in: cut
- status: animated
- src: compositions/frames/19-step-4-records.html
- type: feature_showcase
- blueprint: compose
- layout: terminal
- focal: the second PR renumbers; the terms index is written again, never merged
- sfx: none

narrativeRole: Step 4: records that merge, as decided.
keyMessage: Step four, as you decided:

## Frame 16 — Quick check: a walkthrough that is wrong

- plan_step: 3
- scene: THE CHECK'S OWN CASE, small, top right: 'PR #61 · the walkthrough: a missing file is skipped · the code: stops with an error · CI ✓'; the heading and three cards land, still
- voiceover: "Quick check, on step three. Lee's walkthrough says a missing file is skipped, but the code stops with an error. CI's checks pass. What finds it?"
- duration: 7.893s
- transition_in: cut
- status: animated
- src: compositions/frames/14-qc-private-link.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k3
- question: PR #61's walkthrough says a missing file is skipped; the code stops with an error. CI's checks pass. What finds it?
- option_a: Nothing: CI passed
- option_b: The maintainer's code check
- option_c: A rebuild of the video
- answer: b
- explain: CI's checks compare the video with the plan's files, which agree; only the code check reads the code.
- walk_me_through: CI's checks compare the video with plan.md and walkthrough.md, and all three say a missing file is skipped, so they pass. Only a check that reads the code sees that it stops with an error: the maintainer's own code check, a fresh agent, finds it. A rebuild is made from the same walkthrough.md, so it would say 'skipped' again.
- option_a_why: CI's checks read the video and the plan's files, not the code, so they cannot see it.
- option_b_why: Right: the code check is the one that reads the code.
- option_c_why: A rebuild is made from the same walkthrough.md, so it says 'skipped' again.
- explained_at: 10
- focal: three predictions, on a case the video did not show
- sfx: none

narrativeRole: Quick check: a walkthrough that is wrong.
keyMessage: Quick check, on step three.

## Frame 17 — Step 5: CI, the merge, the system video

- chapter_start: Step 5: CI, the merge, the system video
- plan_step: 5
- guide: step-5
- scene: THREE LANES landing on their words: 'every push' → `npm test` · 19 script specs + 8 player specs · `reel pr-check` · `reel audit`; 'before a merge · required' → `npm run test:full` · 19 + 23 specs · about 5 min, in coral; 'the release tag' → `npm run test:full` → `npm publish`. UNDER THEM, MAIN AS A LINE on 'system video': kicker 'decided · decision D-003'; 'PR #41 merged', 'PR #42 merged' dots, then one box 'one rebuild on main': `reelplanning spec-diff` → `reelplanning build`
- voiceover: "Step five: CI runs the fast suite on every push. Before a merge, it runs the full suite, every test, about five minutes, and the merge needs it to pass; and again on the release tag. The system video catches up on main after the merges, as decision D-003 keeps it."
- duration: 16.683s
- transition_in: cut
- status: animated
- src: compositions/frames/25-step-5-ci.html
- type: feature_showcase
- blueprint: compose
- layout: timeline
- focal: the fast suite on every push, the full suite before every merge; the system video on main
- sfx: none

narrativeRole: Step 5: CI, the merge, the system video.
keyMessage: Step five:

## Frame 18 — Quick check: two branches, one number

- plan_step: 4
- scene: THE CHECK'S OWN CASE, small, top right: 'PR #70 · decision D-210 · merged' over 'PR #71 · decision D-210'; the heading and three cards land, still
- voiceover: "Quick check, on step four. Two pull requests each recorded a decision D-210, and one has merged. What does the other's contributor do?"
- duration: 8.299s
- transition_in: cut
- status: animated
- src: compositions/frames/20-qc-terms-index.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k4
- question: PRs #70 and #71 each recorded a decision D-210, and #70 has merged. What does #71's contributor do?
- option_a: Keep both rows
- option_b: Run reel renumber
- option_c: Renumber #70's entry on main
- option_b_more: reel renumber, after rebasing on main.
- answer: b
- explain: A number on main never changes; reel renumber puts #71's entry after main's last, with the next number.
- walk_me_through: Main now has pull request 70's decision D-210, and a number never changes once it is on main. So 71's contributor rebases on main and runs reel renumber: 71's entry goes after main's last, as decision D-211, and its mentions in 71's plan folder follow. Keeping both rows would leave two decisions under one number.
- option_a_why: Two rows under one number: a later plan that cites D-210 would mean two things.
- option_b_why: Right: #71's entry takes the next number, after main's last.
- option_c_why: A number on main never changes; the branch merged second renumbers its own.
- explained_at: 15
- focal: three predictions, on a case the video did not show
- sfx: none

narrativeRole: Quick check: two branches, one number.
keyMessage: Quick check, on step four.

## Frame 19 — Quick check: the full suite

- plan_step: 5
- scene: THE CHECK'S OWN CASE, small, top right: 'PR #64 · the fast suite ✓ · a test of the full suite ✗'; the heading and three cards land, still
- voiceover: "Last quick check, on step five. A pull request passes the fast suite, but a test only the full suite runs is failing. Can it merge?"
- duration: 7.531s
- transition_in: cut
- status: animated
- src: compositions/frames/27-qc-player-pr.html
- type: social_proof
- blueprint: compose
- layout: cards
- quiz: k5
- question: PR #64 passes the fast suite, but a test only the full suite runs fails. Can it merge?
- option_a: Yes: the fast suite passed
- option_b: Not before the full suite passes
- option_c: Yes; the release tag catches it
- answer: b
- explain: The full suite runs before every merge, and the merge needs it to pass.
- walk_me_through: The fast suite runs on every push, and pull request 64 passes it. But before a merge the full suite runs, every test, and the merge needs it to pass. One of its tests fails, so 64 cannot merge until it is fixed and the full suite passes on its last commit.
- option_a_why: The fast suite is for every push; a merge needs the full suite too.
- option_b_why: Right: the merge needs the full suite to pass.
- option_c_why: The release tag runs it again, but the merge needs it first, so main never breaks.
- explained_at: 17
- focal: three predictions, on a case the video did not show
- sfx: none

narrativeRole: Quick check: the full suite.
keyMessage: Last quick check, on step five.

## Frame 20 — The plan

- guide: decisions
- scene: THE STEPS AND THEIR DECISIONS, still: five rows (data-plan-step 1 to 5) at reading size: step 1 'when a PR gets a video' 'decided: choices or size'; step 2 'who does what, what lands' 'decided: the last answer'; step 3 'watching, checking, where it lives' 'decided: a throwaway branch'; step 4 'records that merge' 'decided: in order'; step 5 'CI, the merge, the system video' 'the full suite before a merge'; 'draw a note · approve' on 'approve'. Holds still.
- voiceover: "That is the plan: five steps, every question decided. Draw on any step to leave a note, or approve."
- duration: 8s
- transition_in: crossfade
- status: animated
- src: compositions/frames/28-the-plan.html
- type: cta
- blueprint: compose
- layout: list
- focal: the five steps, every question decided
- sfx: none

narrativeRole: The plan.
keyMessage: That is the plan:
