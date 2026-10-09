---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "The revise-loop plan as built: steps 1–4 landed and step 5 is half done; sixty calls the plan did not make (sixteen worth judging, each to accept or flag) and one deviation; the owner's ask, play just the changes, is in; a fresh agent's code check found two step gaps and five real problems; one of the two timed reviews is proven for real, and the second is the reviewer's Finish on this video"
destination: embed
aspect: 1920x1080
language: en
audience: the repo owner who approved the revise-loop plan, deciding whether to accept what was built, including someone new to the repo
length: a series of five parts, about 60–75 s each
angle: walkthrough (lifecycle stage 4)
narration: yes
style_preset: .reelplanning/theme/frame.md (the project theme)
music: none
---

## Round 2 (steps 6–9 as built)

Round 1's 38 frames are kept byte for byte, narration included; round 2 is five parts added after
them (frames 39–80), so "Play just the changes" plays only round 2. Part 6 opens round 2: what the
review asked, the four decisions (D-082 to D-085), what landed. Parts 7–9 are steps 6, 7 and 8, and
9, on the plan video's round-2 rail (steps 6–10). Part 10 is round 2's code check, what is not done,
and the end.

- **Calls:** `reel stops` decides. Twelve calls stop (A17–A20, A22, A24, A25, A26, A29–A32), each
  with its own beat; the four that don't share one `autonomy_group` beat at the end of their part
  (a21, a23 in part 8; a27, a28 in part 9). Deviations stop: D2 and D3 from the table, and the two said
  only in prose, as round 1's d1 was: d4 (step 6's proof ran on a weaker sandbox) and d5 (step 5's
  second real review is still owed).
- **The owner's three answers on step 6's limits** (walkthrough.md, "Decided by the owner during round
  2's build") are one beat in part 7, not calls: nothing to accept or flag. Answers 2 and 3 were built
  while this video was made (`fbcb8bc`: `excludedCommands: ["git commit *"]`, and the server's sandbox
  check before a run), and the beat says so; A19's line says git commit is now the one exception.
- **Quick checks (D-083):** one per step, plus one where there is something to predict: k3 (step 6, a
  write outside the repo with the file tool), k4 (step 7, a wrong answer with a note), k5 (step 8, a
  tag accepted ten times running), k6 (step 8, flag one call then Accept all), k7 (step 9, a second
  review of the same plan).
- No new detail pages.

## After round 2's review (changes requested)

The owner's review (`reviews/walkthrough-20260924T071728Z.md`) asked for fixes (`c7e805f`); the beats
they touch are rebuilt in place, each keeping its frame id so "Play just the changes" plays only them:
44, 45, 46 (step 6: the file tools now fenced by a hook, k3's answer now "it is refused", answer 1
changed, other agents), 49 (A18), 52 (D2), 56–57 (step 7, said more plainly: the owner rewound
there), 61–62 (A24 and k6: a flagged call stays flagged on Accept all), 66–67 (step 9 and k7: a second
review goes beside the first), 70 (A29: both work), 79 (not done). One new beat in part 10 before the
end, "What Accept means now" (`81-verdicts`, frame 80). Nothing else changes.

## Intent

The walkthrough video for `.reelplanning/plans/2026-09-22-m3-revise-loop`, built with `--walkthrough
walkthrough.md` (style guide §13) from the plan's own `walkthrough.md`, with the look, beats and tags of
`../../2026-09-23-deep-dives/walkthrough-video/`, on this plan's own stage (`../video/`): the plan video's
five slot titles, its overview's three lanes, and a five-tick spine.

It opens on the overview (style guide §2): what landed by track, the three tracks done and the proof
half done. Each step beat says what it needs only where it needs it (step 3 needs step 2; step 5 needs
all four).

## The three details (style guide §20)

| Beat | Kind | Page | The sentence instead | Why it is not enough |
|---|---|---|---|---|
| A4 (the cost counts edited lines) | evidence | `narration-timing` | "One line took 32 s; all 35 took 675 s." | The estimate spec-diff prints (13 s + 19 s a line, m11) is a value the agent picked: the page puts the two measured runs, the plan's 40 s guess and the estimate side by side, so the reviewer judges the number from the runs. |
| A15 (the page posts only to its own server) | try | `finish-panel` | "The panel says who picks the review up, before you send." | The panel has four states (a session waiting, none, no command, a plain server) and a second state after a send (Send the change): a behaviour change is judged by using it. |
| The code check | table | `code-check-findings` | "Two step gaps and five problems, four of them bugs, fixed." | Nine keys, each with the checker's words, the answer and the test that pins it: more than a screen holds, and each answer is what the reviewer judges. |

## Customizations

- One what-changed beat per step (5); one autonomy beat per row A1–A16; the deviation as its own beat
  (`d1` = the hosted page's hook is written in the skill, not built); the owner's ask (play just the
  changes) as its own beat before A16; one beat saying the sixty calls mean the plan left too much open;
  the code check shown working; quick checks K1 (Send twice) and K2 (two system-video reviews back to
  back); the ending: what ran, what is still to come (the second timed review), flag a call or accept.
- A16's step in `walkthrough.md` is "ask" (no plan step); `plan-map.json` needs a number, so it and the
  ask's beat are filed under step 4, the part they sit in.
- The step 5 proof landed while this video was being built (commit `df94160`, `walkthrough.md`'s Code
  check): one real review, no session open, picked up by `claude -p`, 9 min 13 s from Finish to the
  notification; D-066 now holds. The overview, A11 (what the proof changed: `config.json` now allows edits
  and Bash, `-p` last), step 5, the code-check rows, what ran and the ending say so; the second timed
  review is the reviewer's Finish on this video.
- `music: none`. Kokoro `am_michael`, synthesised at speed 1.25, one line at a time
  (`reelplanning narrate`). No MP4: the review player plays the HTML project.

## Notes

Autonomous run. Frames were written by one generator from a spec of the beats (no per-frame
sub-agents), each reveal timed to its word from `audio_meta.json`.
