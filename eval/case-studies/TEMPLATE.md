<!-- TEMPLATE.md: the write-up every case study follows. `reel case-study <slug>` copies it to the case
study's README.md, filling the words in double braces. Its nine sections are the page's, in the page's
order: `reel case-study report <slug>` builds case-study.html from them, top to bottom, warns on each
section still empty, and with --publish refuses until all nine are filled.

Under each heading, a comment says what goes there and which file feeds it. The comments never reach
the page. A blank is written _fill in: what goes here_; a section that still has one, or has no words
where it needs them, or whose file is not filled in yet, counts as empty. -->

# Case study: {{title}}

This is a case study, not an experiment. One person ran one prompt three ways, each to a finished site:
text only (Claude Code's plan mode), an HTML plan, and reelplanner's plan video. The claim under test
is narrow: that reviewing a plan and answering its questions is easier in a video than in text or in an
HTML page. The start, the agent, the model and the feedback given were kept the same where we could;
where we could not, it says so below.

How it was run, exactly: [REPLICATE.md](REPLICATE.md). The measures, fixed before the runs:
[RUBRIC.md](kit/RUBRIC.md). The blind judge's prompt: [JUDGE.md](kit/JUDGE.md).

## 1. The prompt and the empty start

<!-- Fed by prompt.md (shown as it is), start/ (what the agent started from: nothing, or a commit and
its files) and the "Preflight" block of each arm's SHEET.md (shown per arm). Filled when every arm's
preflight is pasted in. Words here are optional: anything about the start the files don't say. -->

## 2. The arms, stage by stage

<!-- Fed by data/times.json (each stage's time per arm, on the clock and yours: a bar each), data/counts.json
(questions asked, decisions recorded, and how many the code kept to, per arm) and the screenshots of each
arm's plan review (arms/<arm>/shots/02-review.png). Words: what you saw at each plan review (plan mode's
text, the HTML plan, our review page with its video), a short paragraph per arm. Filled when every number
is in and there are words. -->

_fill in: what you saw at each arm's plan review_

## 3. The feedback sheet

<!-- Fed by FEEDBACK.md: each point by each arm, raised (and where), already covered, missed, or new; and
where a format made a point easier or harder to raise. Shown as a table. Filled when every point has a
cell for every arm. Words here are optional. -->

## 4. What each review caught, and what slipped through

<!-- Words, per arm. What each review caught: what changed between the first plan and the approved one
(from the sheets). What slipped through: what the same sweep found after "done" on every site (a phone at
390 px, a desktop at 1440 px, errors in the console, broken links, the ten facts), and where the site
differs from its plan. -->

_fill in: per arm, what the review caught and what slipped through_

## 5. The sites

<!-- Fed by data/sites.json: how to run each site and its screenshots, the same three screens at phone and
desktop width (arms/<arm>/shots/site-phone-1.png … site-desktop-3.png), and each site itself, kept when its
arm ended (`reel case-study keep`, D-247): its files as plain files in arms/<arm>/site/ and its git history
as arms/<arm>/site.bundle. Shown side by side. Filled when every arm says how to run it, its screenshots
are there, and its site is kept (the files there, the bundle verifies). Words here are optional. -->

## 6. The scores, the judge and your ranking

<!-- Fed by data/judge.json (the blind judge's scores on the rubric, with a line of evidence each, its
ranking and its reasons), data/key.json (which of X, Y and Z is which arm, added once the scores are in)
and data/ranking.json (yours, made before you saw the judge's). Words: where you and the judge disagree,
a line each (or that you agree). -->

_fill in: where you and the judge disagree_

## 7. The process, and what felt different

<!-- Words, a part per arm: how you read the plan and answered it; what was misunderstood, and when it came
out (at the plan, in the build, or only in the finished site); how much work your feedback took; what you
knew about the build before you looked at the code; and your five answers from memory, a day later, checked
against the code (from each SHEET.md). Then what felt different, in your own words, for what the rubric
misses. -->

_fill in: the process, per arm, and what felt different_

## 8. What we would change

<!-- Words: what we would change in reelplanner because of this case study. Each item becomes part of a
next plan, reviewed like any other. -->

_fill in: what we would change in reelplanner_

## 9. Links

<!-- Fed by data/links.json: every artifact, per arm: the plans, the reviews, the videos, the pages, the
commits. Filled when every arm has at least one link. Words here are optional. -->
