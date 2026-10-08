# Fresh eyes: newcomer · round 3 · stamp c7231b099d64

- N1 · scene 1 · "git diff 3162f80..": a bare hash range with no word on what 3162f80 is (the commit before the build?); I guess it is the pre-build state. Without it I can't tell what "this build changed" is measured against.
  - Answer: kept: the commit is where this plan's build started; the Open chip's part lists the commits by name

- N2 · scene 1 · "Every plan video now has a page behind it, the guide": the seven rows ("plan-map, the player", "review-scope, reel record", "skills/plan-to-video") name files and pieces never introduced; "review-scope" is in no glossary or meaning. I guess these are internal modules. I can't tell which row is the main change or which the reviewer will notice. Also the plan's five steps are never listed up front, so "Step one … Step five" in scenes 2, 6, 10, 13 and 14 arrive without a map of where I am.
  - Answer: kept: each row says what its place does; Before you watch names the plan, whose five steps the video takes in order

- N3 · scene 2 · "a part a step" / "a part a kind": "part" is used for guide pages, yet the glossary also uses "part of the system" (the boxes) and "The system's parts" appear in scene 5. I guessed here it is a sub-page of the guide. Two meanings of "part" on one video is confusing. Also "4 questions", "17 parts" and "44 gaps shown on the page" are counts with no reference, so I can't tell if they are good or bad.
  - Answer: kept: "A part of the guide" is defined on this scene; the counts are the real run, and the narration says what matters in it

- N4 · scene 2 · "parts.json": never said what it holds (a list of the parts for the player?). I guessed an index. Matters because scene 11 shows it in .gitignore.
  - Answer: kept: parts.json is listed as a file the builder writes, beside the parts it lists

- N5 · scene 3 · "Expand all", "44 gaps", "28 cases · 16 interface parts": the frame is a tiny screenshot; I can't read most of the page. "gaps" has a meaning, but "Independent", "Plan | Built" and "Where step 1 sits: the parts it touches" are not explained. What "sits" or "touches" means for a step, and why finish-project and the review player are lit, is unexplained.
  - Answer: kept: round 1 cropped and enlarged the page; scene 5 is about the row of parts

- N6 · scene 3 · "one click down: every case, every part, every decision": I don't know what a "layer" looks like or that the red boxes mean "each of these opens something". I guessed the red outlines mark clickable things, but the video never says so.
  - Answer: kept: the narration says each ringed thing opens one click down

- N7 · scene 4 · "Things to do come from the plan itself" / "No thing to do is written by hand": the picture shows a drag-and-match puzzle with tiny text and buttons "Check against the plan", "Show me", "Start over". I don't know whether the viewer is meant to use it, or what "checked against the plan" does. The scene lists four choices (A1 to A4) in one breath with no time to read them.
  - Answer: kept: its label says "a thing to do", which has a meaning in the terms; each choice card comes on as its clause is said

- N8 · scene 4 · "An explainer's source kept outside the repo shows its path and size, never its text.": the sentence assumes I know an explainer, "the repo", and why a source would sit outside it. The small shot ("~/runs/0929/results.csv", "masked, for this machine only", D-249) is unreadable. I guess it is a privacy point. Why it matters is not said.
  - Answer: kept: explainer and repo are glossary rows; the reason (D-249) is on the part the scene opens

- N9 · scene 4 · "Each video has a guide of its own." vs. "The page is one flow, not boxes.": "flow of beats" and "boxes" are contrasted with no picture of the box alternative, so I can't tell what was rejected. "Flow" and "beat" appear without being shown.
  - Answer: kept: the choice is said in its card; the alternative is in walkthrough.md's table, which the choices part opens

- N10 · scene 5 · "One change from the plan." / "off-plan change D2": the frame's label says D2 but scene 11 says D1, and the choices in scenes 4/10/14 are A1..A13. I don't know what D vs A means or why this is not a choice to accept or flag. It says nothing about whether this scene pauses or what I am asked to do with it.
  - Answer: kept: "off-plan change" is on the card; a change from the plan pauses like a choice, with its own Accept and Flag on the review page

- N11 · scene 5 · "the stage drawn for the video": I never saw the stage in this video. I guess it is the diagram of system parts from the system video. "stage" has a meaning, but no picture shows what the video's stage looked like, so I can't judge the change.
  - Answer: kept: the stage has a meaning in the terms; this walkthrough shows what was built

- N12 · scene 6 · "A plan written from the thirtieth of September, twenty twenty-six, on holds every step to four blocks": is the date the day the rule started? Why a date at all (older plans excused)? Only scene 9 hints. Also "four blocks" is listed as Cases, Interface, Example, Decisions, but "block" is never defined and the picture shows only the cases table.
  - Answer: kept: the date line sits over the four blocks it qualifies; each block is named with a line saying what it holds

- N13 · scene 6 · "reel check": it is used as if I know it. The glossary only mentions `reel record` and `reel status`. I guess it is a validator run on a plan. What it checks besides these four blocks is not said.
  - Answer: kept: the reel CLI is a glossary row; `reel check` runs on scene 9

- N14 · scene 6 · "step 4's second case, its trace drawn on the stage but not in the text": the cases-table rows are readable but "trace", "guide --check" and "the case's layer" are used without a meaning. Also the picture is cropped (row 5 cut off), so I can't tell whether five rows is all.
  - Answer: kept: the table is this plan's own step 2, cropped to be readable; its rows are the plan's words

- N15 · scene 7 · "Every paragraph of the plan has to be on the page, and every layer has a button that opens it": "layer" has a meaning, but the on-screen lines ("99", "45 decisions, 8 full diffs: each opens its layer, each by a visible control") are unexplained numbers. I don't know what "8 full diffs" or "by a visible control" refers to.
  - Answer: kept: the run's lines are the real output; the narration says what the check holds to

- N16 · scene 7 · "walkthrough.md names runs/build-typed-in.txt, a run nobody saved" / "in a scratch clone": "a run nobody saved" is plain words: I guess it means a command-output file missing from the runs folder. "scratch clone" vs the glossary's "scratch repo" differ, and the reader is not told why this was staged as a fake failure (to prove the check catches it?). "category 'The build gate'" is never explained; I guessed a "category" is a "kind of change".
  - Answer: kept: the run's title says what was staged, and the narration why: name a run nobody saved, and the check fails

- N17 · scene 8 · "no interface and no line saying it has none": the quick check assumes I remember what scene 6 said about the "No interface: …" line, which was never shown as a rule, only in a table cell at reading size. Answer options ("Warns, and passes", "Passes; the guide shows a gap") also lean on the unexplained "gap on the page" and a date rule (October 1 so it is "new") that was said only aloud.
  - Answer: kept: scene 6 says the rule and its date

- N18 · scene 9 · "△ … interface part `--quiet`: no meaning · step 2: no Example · …": a warning line is shown truncated with "…"; I can't tell how a warning differs from a failure or what "1 warning(s)" is. Also "touches [cli], 1 in force, 0 superseded" is unexplained. "1 in force" I guess means decisions in force.
  - Answer: kept: the △ line is the run's own; the narration names the three failures, each ringed

- N19 · scene 9 · "quiet-output" plan and "question 1's option B": the scene introduces a whole new plan (2026-10-01-quiet-output) with a "question 1", "options" and "steps" but never says what that plan is; I'm shown red boxes and asked to believe "three failures" but the narration says "neither cases nor an interface, and one option has no example", which is three, consistent, fine, yet "option" is a new term (a choice on a question card?) and nothing shows how the author is meant to fix it.
  - Answer: kept: the run's title says it is a new plan in a scratch repo; the ✗ lines say how to fix each

- N20 · scene 10 · "A scene names its part of the guide, and in the player the part opens over the frame": "part" (a guide page) again; the picture is a tiny embedded screenshot of another video's walkthrough ("videos-that-make-sense's walkthrough, its part open") that I can't read. "The player offers a part only once the guide is built" — why would it not be built? (built by `build`, never committed, so a fresh clone has none? never said.) "the builder's parts, not the prototype's pages": "builder" and "prototype" have meanings, but the review page's "videos" and what "open" means here are unclear.
  - Answer: kept: the label under the picture says whose it is; builder and prototype have meanings in the terms

- N21 · scene 10 · "Two choices" with A8 and A9: scene 4 had A1 to A4, scene 5 "D2", scene 11 "D1", scene 13 A10 and A11, scene 14 A12 and A13, scene 16 A5-A7 and A14. The numbering skips around and I can't follow which have been shown, which paused and which are in the list. I don't know what "A" means.
  - Answer: kept: each card says its choice in words; the ids are walkthrough.md's

- N22 · scene 11 · "plan-map.json · a scene's part" with "guide": true, "frameIndex": 1, and the .gitignore lines: the frame shows raw JSON and four ignore patterns with only the second and fourth highlighted, without telling me which line matters or what "frameIndex" or "kind" mean. "the details" folder was defined as hand-written pages but no picture of it; why "guide is built each time and never committed" forces a different folder is a leap. "src" bolded vs. not, unexplained.
  - Answer: kept: the hot lines are the part's path and its guide flag; the .gitignore lines are ringed on "never committed"

- N23 · scene 12 · "the revise": "The revise step" is in the glossary, but this phrase drops "step", and "rebuild" is not said to be video scenes vs. the guide. The quick check also depends on knowing that a "case" may be shown by a scene or not; the options "Its step's scenes" vs "The guide only" can't be reasoned about from anything shown before scene 13 (the answer comes only later). Feels like testing before teaching.
  - Answer: kept: scene 10 says the rule the check applies; a check comes before the scene that runs it (style guide §8)

- N24 · scene 13 · "Edits to apply (scene numbers: the plan video's)" with "scenes 12, 20, 21, 22, 23, 26": these scene numbers refer to a plan video that I have not seen; this walkthrough only has 17. Which video are they in, and why does my video's numbering not match? Also "--out <file> → --to <file>" is a raw diff of a flag rename with no context.
  - Answer: kept: the heading says the numbers are the plan video's

- N25 · scene 13 · "ledger: +2 (D-002 --to <file>; D-003 a decision's ledger entry shown only on hover or on a long press)": "ledger" has a meaning, but the entries D-002/D-003 are the sample edit texts, and it looks like the real decisions the build recorded. I'm not told this run is a demo on the plan-guide's own review.json (the file is "review.json" and "plan-20260929T210000Z.json"; is that a real filed review?). "long press" is unexplained. The floating caption "two new decisions: an edit each" partly overlaps the command text line (visible clash).
  - Answer: fixed: the pin is gone from the run; the run's title says it was a scratch repo's review

- N26 · scene 13 · A11 "An answer given on the guide counts on the video too": what "counts" means (the answer to a question is recorded once and applies to both places? or duplicates?) is not said, and no picture shows an answer given on the guide. I guessed the answer is shared, not asked twice.
  - Answer: kept: the card says it: one answer, on the guide or the video

- N27 · scene 14 · "Built side": has a meaning, but the picture shows "Every file whole", "Changes only", "Changes", "Copy" buttons and a diff of model.mjs with "dc52612, 9b6ec48" and "Plan guide, step 1 · dc52612" that go unexplained. What the two hashes are (commits?) and why "+577 −15" here vs. "+2,910 −6,604" on scene 3 are different totals isn't said. The scene lists "6 files" yet earlier "74 files"; I couldn't reconcile them.
  - Answer: kept: the picture is the builder's own diff; the counts are its kind's, the page's are the plan's

- N28 · scene 14 · "A file the build writes is listed with its counts, not shown.": I guess a generated file is summarised only. The caption shows "not shown." and A13's example "(a plan map, a picture)" but the frame shows a shown-lines diff of the builder, which is the opposite case; it's confusing which choice the picture illustrates. Narration "kind of change" and "Everything else" get named but I see neither on screen.
  - Answer: kept: A13's card names the files listed by counts

- N29 · scene 15 · "What ran: every fast test, with a new spec": "fast test" and "spec" (two meanings in the glossary) are unclear without context; I guess "spec" = a test file since "guide.spec". "guides for five plans' nine videos, each checked in a browser" is fine but I don't know what was looked for.
  - Answer: kept: npm and a spec are glossary rows under Other words

- N30 · scene 15 · "a fresh agent's code check. It found one thing step five asked for that's missing, two hand-made things to do, now under Not done": the narration says "one thing", the picture says "two hand-made things to do: missing", and "Not done" is a list I've never seen. Which is missing, one thing or two? "hand-made" contradicts scene 4's "No thing to do is written by hand" — I guess they are the two old prototype exercises; a newcomer would ask whether this is a broken promise.
  - Answer: kept: the row names the one thing missing, the two hand-made things to do, which were prototype v5's (choice A3)

- N31 · scene 15 · "four choices to add to the table": "the table" is the choices table; picture says "A13 (paused), A14 (on the list), two small". Scene 16 then says "the other four choices are the list" but lists A5, A6, A7, A14, while A13 is called paused. So "four more written in" (A13, A14, two small) don't match the four on the list (A5, A6, A7, A14). The counts and letters don't reconcile, and "two small" never appears.
  - Answer: kept: the row names which were written in; the list names which do not pause

- N32 · scene 16 · "the list": the narration says "the other four choices are the list" and the frame title says "four choices that don't pause, each with its own Flag" — but there is no Flag button visible on any row, so I don't see how to flag one. Also "saying the video again: a sentence of eight words or more", "what counts as an example" and "a warning, even when strict" (strict has a meaning) are shorthand for rules I never saw stated (the eight-word rule especially). Why none of them pauses the video isn't said.
  - Answer: kept: on the review page each row carries its own Flag, laid by the player on the frame

- N33 · scene 17 · "Say it in Finish, or approve the build": Finish and Approve have glossary meanings, but this last scene gives no summary of what was flagged/paused and no reminder of which controls to press; the earlier scenes (5, 11) said "off-plan change" that "always stops", yet no accept/flag prompt was voiced there, so I don't know whether I was supposed to answer them.
  - Answer: kept: on the review page each paused choice and change carries its Accept and Flag; Finish is a glossary row
