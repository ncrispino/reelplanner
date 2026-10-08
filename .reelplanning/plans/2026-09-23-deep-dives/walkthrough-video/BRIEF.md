---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The deep-dives plan as built: all six steps landed; forty-two calls the plan did not cover (fifteen worth judging, each to accept or flag) and two deviations; a fresh agent's code check found a real bug, now fixed; and the first video whose beats open real details, one of each of the seven kinds"
destination: embed
aspect: 1920x1080
language: en
audience: the engineer who approved the deep-dives plan, deciding whether to accept what was built, including someone new to the repo
length: a series of six parts, 56–76 s each (394 s)
angle: walkthrough (lifecycle stage 4)
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Intent

The walkthrough video for `.reelplanning/plans/2026-09-23-deep-dives`, built with `--walkthrough
walkthrough.md` (style guide §13) from the plan's own `walkthrough.md`. Same look, beats and tags as
`../../2026-09-22-close-the-lifecycle/walkthrough-video/`, on this plan's own stage (`../video/`): the
rail with the plan video's six slot titles, and prototypes of the review player's surfaces with the
rail as a spine. It is also the first real test of deep dives (plan step 6, as the code check's answer
says): seven beats open a detail, one of each kind.

## The seven details (style guide §20)

Each was put through §20's test: the sentence the video would say instead is written first, and the
page exists only because that sentence is not enough.

| Beat | Kind | Page | The sentence instead | Why it is not enough |
|---|---|---|---|---|
| A5 (keys off while a page is open) | try | `keys-with-a-page-open` | "With a page open, only O and Esc work." | The keys are a state machine (page open or not, focus inside the page or not, a question up or not, plus the plan's E): the reviewer judges it by pressing keys, before and after. |
| A11 (a JSON block fills a page) | code | `data-block-and-slots` | "Data pages take one JSON block, prototypes two slots." | A data-shape call (D-023 allows code): the block, the slots and the `<` escape are what is judged, with the lines that carry the call marked. |
| step 3 (comments inside a page) | explore | `a-comments-path` | "A comment on a row reaches resolve-plan under its step." | Six parts and nine steps, each carrying different fields; the reviewer steps through and sees the annotation fill in, including the m27 case. |
| step 5 (the plan with the video) | plan-text | `step-5-written-and-built` | "Step 5 said below the player; it sits beside or in the record." | Each of the step's four sentences beside what was built for it and the calls behind it (A3, A8, m20–m24): more than a screen holds, and searchable. |
| A3 (beside, or in the record) | evidence | `plan-column-widths` | "Beside costs the stage 1 % at 1440 × 900." | Real measurements at seven window sizes in the review page, now and before the fix: what the sentence hides is that before the fix the rule never fired there. |
| A13 (eight more ways fail) | table | `check-rules` | "The check fails on eight more ways than the plan named." | 26 rules, fail / warn / skipped, where each is checked and why, with the call (A13, A14, m8–m11) each came from. |
| the code check | fresh | `code-check-bug` | "The check found a bug; it is fixed, with a test." | See below. |

**Why the code-check page is fresh.** It is a chain of three different things read in order (the
checker's finding in its own words, the diff that fixed it, the spec lines that pin it) plus a
simulation of the bug on this very video (move the video, open the page from the plan text, see which
frame the comment lands on, before and after the fix). The code template holds the diff and the test but
not the finding or the replay; explore has no place for a quote or a diff; try's variants are page
prototypes, not a timeline over this video's frames. So it is written fresh (D-024), keeping the theme
and the bridge from `templates/details/fresh.html`.

Four of the seven sit on calls (A5, A11, A3, A13), so the panel offers Accept / Flag for them.

## Customizations

- One what-changed beat per step (6); one autonomy beat per row A1–A15; the two deviations as their own
  beats (`d1` = the key is O, not E; `d2` = the plan text sits beside the video, not below it); the
  step 6 deviation (the walkthrough, not the plan video, carries the details) is said in the code-check
  beat; one beat saying 42 calls means the plan left too much open; quick checks K1 (what earns a
  detail) and K2 (Esc in a comment box); the ending: what ran, what is not tested, flag or accept.
- Found while building it, and fixed before the video shipped: the review page that `bundle-player`
  wrote capped the player at `max(480px, (100vh − 450px) × 1.78)`, and the player measures its own width,
  so a detail covered the whole window and the plan text went to the record at every window measured up
  to 1920 × 1080. The page now leaves `--rp-above: 134px` instead of capping the width; re-measured, the
  plan and a detail sit beside the stage from 1280 × 720 to 2560 × 1440. The evidence page on A3 carries
  both sets of measurements; A2, A3 and the "not tested" beat say it.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time. No MP4: the review
  player plays the HTML project.

## Notes

Autonomous run. Frames were written by one generator (no per-frame sub-agents), each reveal timed to
its word from `audio_meta.json`. Three lines (A2, A3, not tested) were re-narrated after the finding, and again after the fix.
