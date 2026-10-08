# Fresh eyes: newcomer · round 1 · stamp 397b5bfd90de

- N1 · scene 1 · "git diff 43f0e00.. · this plan's code, one line a file": "43f0e00" and ".." are never explained, and I guessed the diff is every change since that commit. "this plan's code" is unclear too: which plan? The video has not said what plan it belongs to. Without it I can't tell whether the seven files are all the change or a sample.
  - Answer: fixed: scene 1's label now says "the code this build changed", since 43f0e00; the seven rows are the files that carry it (the map of the change, one line a file)

- N2 · scene 1 · "pins what you point at, in a folder of its own": "pins" has a meaning in the list, but the scene has not said what it is pinning to, or which folder. The row "forms, shapes, the guide rule, secrets" uses "forms" and "the guide rule" before either is said. I guessed "forms" means kinds of source. Scene 2 says there are no kinds, so this seems to contradict it.
  - Answer: fixed: the row now says "how each source is pinned, its shape, what is secret"; "forms" is gone from the frame

- N3 · scene 1 · "the Explainer row on the review page" and "Finish: Done, Explain more, Plan this": I can't picture the row or the three ends yet, since neither appears until scenes 5 and 6. I guessed they are UI, and this only becomes clear later. Also "SKILL.md … An explainer, in the skill": I don't know which skill.
  - Answer: kept: scene 1 is the map of what landed; the row and the three ends are shown running in scenes 5 and 6, and the skill is this repo's plan-to-video skill, which the system video (before you watch) explains

- N4 · scene 2 · "As you asked, there's no list of kinds": who asked, and where? I guessed it was an earlier plan comment I never saw. A newcomer doesn't know what a "list of kinds" would have been, or why not having one is a decision.
  - Answer: kept: this video is for the owner, who asked (question 1 of the plan, answered in their own words, D-250); the words "as you asked" are to them

- N5 · scene 2 · "sources.json" and "three real runs'": the title says "three real runs' sources.json", but the table mixes a repo file, "D-226", and files under "~/runs/0929" and "~/ci". I can't tell which rows belong to which run. I guessed the runs are past explainer builds. "D-226" is shown as a source, but I don't know what it refers to (a decision, from the decision log). It is the odd one out.
  - Answer: fixed: the table's label now says "the sources three real runs pinned"; kept for D-226: the player glosses every id said or shown (a decision, from the decision log), and a decision is one of the shapes, text

- N6 · scene 2 · "sequence" as the shape of "~/ci/run-1142.log": "shape" is given a meaning, but the table does not make clear why a log is a sequence and a csv is a table. The "text" shape is also shown for config.yaml with no reason given.
  - Answer: kept: the meaning of "shape" says it (a sequence of entries in time order: a log; a table of rows: a CSV; plain text); the video shows each shape on a real source

- N7 · scene 2 · "a guide part" and "over 200 lines: a part, by size": "guide part" is defined as the whole of a source, organized to read. The table marks the 254-line inbox.mjs as one, but not the 379-line review.mjs by any difference. The video never says what the viewer gets from one, only that big sources have them. The 142-line log has none while the video says "a part" on every large source. Fine, but it is not obvious what the guide part does for the viewer.
  - Answer: kept: "guide part" has its meaning (the whole of a source, organized to read); review.mjs and inbox.mjs both show "a guide part" in the table's last column, and the 142-line log has none, under 200 lines

- N8 · scene 3 · "pinned at 4f6e262": the term "pin" is defined, but the terminal says "pinned at 4f6e262" for files outside the repo, which have no commit. I don't know what 4f6e262 is (a commit of the repo? a hash?). The narration says each file is pinned by "path, hash and line count", which doesn't match the single value shown. Why do I need it?
  - Answer: kept: "pinned at" names the commit the explainer starts from, and scene 3's narration says each file outside the repo is pinned by its path, hash and line count; both are in the command's real output

- N9 · scene 3 · "last night's experiment, a folder outside the repo": what an "experiment" is here is unexplained. Also "1 needs a guide part" comes up before the scene says what a guide part does. I guessed "~/runs/0929" is just example data. The video never says who produced it or why the video can be trusted about a folder outside the repo, if only path and hash are kept and not the text. If the text is not kept, how can the quotes be checked later (scene 10)?
  - Answer: kept: the check reads a file outside the repo where it is, on this machine (the plan's step 5, and scene 10); what goes into git is only its path and hash; the experiment is the example the owner named ("new experimental output")

- N10 · scene 3 · "asked again, the same day … experiment-2/ … nothing is ever rebuilt": the narration says "asked again, you get a new folder, and nothing is ever rebuilt". Why would anyone ask twice? I guessed old explainers go stale and are replaced by new ones. The link with scene 4 (Friday) is not made yet.
  - Answer: kept: scene 4 asks exactly this (Monday and Friday) and scene 5 shows the row saying commits since

- N11 · scene 4 · "quick check" answers: the quick check comes before the video says how a "snapshot" behaves against later commits. The scene 3 narration only said "nothing is ever rebuilt". Cards A and C look the same to me: "Nothing, until you rebuild it" contradicts scene 3, but I had no way to know that. A newcomer can only guess. Also this frame has a large empty band under the cards, and no "Recommended" mark.
  - Answer: kept: scene 3 says it is a snapshot and nothing is ever rebuilt, which is what the check tests; a quick check never marks a recommendation, and the space under the cards is where the player lays each answer's why

- N12 · scene 5 · "explained at a523e4e, 5 commits since · planned: waiting-reviews": the scene says "five commits since", while the quick check on scene 4 said seven. The video never explains why it is five here. I guessed different example data, but it looks like an error. "planned: waiting-reviews" is unexplained: a plan by that name, presumably from scene 9's "Plan this", but here it comes first.
  - Answer: kept: the check is a made-up case (Monday, seven commits), as every quick check is a new case (D-197); scene 5 is the real run, five commits since; "planned" is the plan scene 9 shows

- N13 · scene 5 · "choice A1 · it pauses here" and "choice A10 · it pauses here": "choice" has a meaning, but the ids A1 and A10 are not explained, nor why A1 and A10 are shown while A2–A5 are not (they turn up on scene 14 as "the list"). "It pauses here" implies the video stops on it, but the scene keeps playing. And the card A1 says "folder's plus “--explainer”" while the narration says "plus 'explainer'": with the double dash it's hard to read. What "its folder's" name is, is not shown.
  - Answer: kept: the player stops at each choice card for Accept or Flag (it pauses in the player, not in the picture), and the ids are how the list and the review name them; the card now reads "its folder's, then “--explainer”", and its address is on the frame

- N14 · scene 5 · "Needs you" row, "Explainers", "From the explainer", "Earlier plans (11)": the frame has many rows, and only one is boxed. "From the explainer · 30 Sep · no video yet · Explainer" looks like a different row from the Explainers entry, and the video never says what it is (I guessed it is the plan from scene 9). The narration says the explainer "waits under Needs you", but the boxed row sits under "Explainers", not "Needs you". The frame contradicts the words, unless it only waits there before I watch it and the shot is after.
  - Answer: fixed: scene 5 now shows two crops: the explainer waiting under Needs you before you watch it, and its own row after its review, each labelled

- N15 · scene 6 · "Finish": the picture shows the whole Finish form. The narration says "Finish on an explainer has three ends", but the picture has an extra text box, a Download button, two shell commands and "Back to the record". I don't know which are new and which are old. "reel record" appears in the picture before the next scenes explain it. "npx -y reelplanning@0.2.0" looks like an install step, and I'm unsure why the version shows or whether I must run it.
  - Answer: fixed: scene 6 now shows only the top of the Finish panel (the question, the three ends, the decision-log line), larger; the commands are out of the picture

- N16 · scene 6 · "Explain more" and "Plan this" as ends: card text says "The next version answers each question you asked, a scene each". But the "next version" contradicts scene 3 ("nothing is ever rebuilt", a new folder each time). Is Explain more a rebuild or a new snapshot? Also "its video leans on this one" is unexplained: what does a plan video lean on? "its problem" too.
  - Answer: kept: Explain more is a new build of the same explainer that you ask for; "nothing is ever rebuilt" is about the repo moving on, which never rebuilds it (scene 3); "leans on" is Plan this's, shown in scene 9

- N17 · scene 6 · "Nothing marked yet; how much you watched goes with it." "how much you watched" is new: is watch time recorded, and where does it go? Not explained anywhere.
  - Answer: fixed: that line is out of the crop

- N18 · scene 6 · "choice A9" and "choice A13": the narration calls them "that question is on every explainer's Finish" and "Done comes first, comments or not". The second reads oddly: what does "Done comes first" mean, first in the list, or the default option? I guessed it's preselected. The picture does show Done selected, but the video doesn't say the meaning, and "comments or not" has no context.
  - Answer: fixed: the card now says "Done is picked first, comments or not", and the picture shows Done picked

- N19 · scene 7 · the whole frame: the picture is completely blank, with no question, no answer cards and no caption. The narration is a quick check ("You comment 'this looks wrong' … What goes into the decision log?") but I see nothing to answer. I don't know if it is a rendering failure. Because the scene ends on a question, a viewer would see an empty page. Also note the check leans on "decision log", whose meaning is given, and on scene 6's small red line, which is easy to miss.
  - Answer: fixed: the scene went blank after its voice while the frame waits for the answer (its layers were timed to the voice, the frame to its hold); every frame's layers now run to the end of its slot

- N20 · scene 8 · "reel record" and "the ledger": the command "reel record …/2026-09-29-review-server review.json" quietly assumes a file "review.json", but scene 6 gave "annotations.json". Where does review.json come from? The output line "· ledger: nothing added" uses "ledger", which is not in the glossary or meanings. I guessed it is the decision log under another name. "reviews/explainer-20260929T154200Z.md" is a folder under the explainer that I hadn't been told about.
  - Answer: kept: "ledger" now has a meaning in the storyboard's terms (the decision log, as reel calls it); review.json is the review file in the run (any name works), and reviews/ is shown on the same frame

- N21 · scene 8 · "Scene 2 (One claim a review), at 0:38" and "answered from scripts/lib/inbox.mjs, line 79": this is the review of an explainer about the review server, but the scene says nothing about what the explainer was (it's a different video from the one I'm watching). "One claim a review" reads like a scene title I have never seen. I also can't tell how a question gets an answer "from inbox.mjs, line 79", since the viewer's question was asked while watching. The narration says "your question and its answer", so who answered it, and when?
  - Answer: kept: the command on the frame names the explainer (the review server's), and the question's answer came from Ask about this, as the plan's step 3 says; this scene is about where the review is filed

- N22 · scene 8 · "The decision log held two hundred and fifty decisions before, and the same after": I get the point, but I can't tell whether "250" is meaningful or an example. And the narration ("Only an answer to a plan's question goes there") doesn't say why an explainer's Done comment is not a decision, though scene 6 hinted "an explainer asks no questions".
  - Answer: kept: 250 is the real log's count before and after, and the scene's narration says why: only an answer to a plan's question goes there

- N23 · scene 9 · "reel new-plan --from" and "reel prereqs": the narration names the commands, but the picture shows only the outputs, and the flag "--from" is not on screen. "prereqs" is unexplained. I guessed "prerequisites", i.e. videos to watch first. The narration says "under Before you watch"; the picture shows "before: … | …" lines, not a card. The glossary explains "Before you watch" as a card on the review page, but this picture is terminal text.
  - Answer: kept: "reel prereqs" now has a meaning in the storyboard's terms (the command that writes a video's Before you watch lines); the --from flag is in the narration and the plan's first line shows its result

- N24 · scene 9 · "before: system#part 5 | the build": this second "before:" line is greyed out with no words of its own. "system#part 5" is unexplained (a part of the system, presumably from the system video, but which?). "the build" is a plain phrase with no meaning here: the build of what?
  - Answer: fixed: the second line is no longer dim; kept: "system#part 5 | the build" is the real output, the system video's part on the build

- N25 · scene 9 · "plans/2026-09-30-waiting-reviews/plan.md" against "2026-09-29-review-server": the plan is dated 30 Sep, while the explainer and the rest of the video are 29 Sep. A newcomer would ask whether the plan is a day ahead by mistake. And "Scene 2 (One claim a review): make a waiting review easy to see" quotes a scene that I have not been shown. It's the comment from scene 8's example? No, scene 8 said "this looks wrong". The two quoted comments differ, so it's unclear whether they are the same review.
  - Answer: fixed: the plan is now made on the same day (2026-09-29-waiting-reviews); kept: its quoted comment is from the second review, where the owner pressed Plan this

- N26 · scene 9 · "choice A12": "With no plan file, a draft: the problem only, for the steps to be written". Which plan file is meant: does Plan this sometimes start from an existing plan? The scene doesn't say what "the steps" are or who writes them. I guessed the agent does, later.
  - Answer: kept: the card says a draft with the problem only; the narration of scene 9 says it is for the steps to be written

- N27 · scene 10 · "check-sources" and "3 quoted pieces against 4 pinned sources": "3 quoted pieces" and "4 pinned sources" are not the numbers from any earlier scene. The word "quoted piece" is not the same as "quoted line", which the narration says. I don't know what counts. Where do the quotes live: in the video's text or on the frame? The narration says "every quoted line must be in its source, word for word, as it was when it was pinned", so the source must be kept. But scene 3 said a source outside the repo keeps "its path and hash only, never its text": how then does the check work for those? Is the check only for in-repo sources?
  - Answer: kept: a quoted line cut with "…" is checked in pieces (A4, on the list), which is why the real output counts pieces; scene 3 said files outside the repo are read where they are

- N28 · scene 10 · "“by” is missing" and "quoted line not in scripts/lib/inbox.mjs:77-83": the retyped line "export function claim(rp, id, extra = {}) {" is compared with the failing output, but the two look identical to me and I can't see "by". The call-out says "by" is missing, yet the shown text has no "by" in the source either, so I can't tell what was dropped or where. The "77-83" is also unexplained (lines 77 to 83 of the file).
  - Answer: fixed: the frame now shows the source's line with "by" marked, and the retyped quote without it

- N29 · scene 10 · "a secret anywhere in the text stops it": "secret" is only defined in the "mask" meaning, and the narration doesn't say what counts as a secret (passwords? keys?). The scene shows no secret, only text. And the picture repeats the narration in plain text and adds nothing to it.
  - Answer: kept: scene 12 shows the secret the check stops on, a GitHub token, as the narration says

- N30 · scene 11 · "A CI log's explainer" and "GitHub access key": "CI" is defined in the glossary, but the quick check assumes I know that a log may contain keys and that a video "quotes" a log line. "Stops until it is masked" is offered before "mask" was used in a scene. The video hasn't said masking means writing "ghp_…REDACTED"; that only comes with the answer in scene 12. Option A "Blurs it on the scene" also depends on a "blur", which has not appeared yet.
  - Answer: kept: a quick check asks before the scene that shows it (D-222); scene 10 said a secret stops the build, and "mask" has its meaning

- N31 · scene 12 · "ghp_…" and "ghp_…REDACTED": I could not tell that "ghp_" is the prefix of a GitHub token until the terminal text said so. The narration says "named by its kind only, never printed", yet the terminal prints "ghp_…" itself. That is a prefix, not the key, but a newcomer will find it confusing. Also "cut or masked" says two ways out, and only masking is shown.
  - Answer: kept: the prefix names the kind of key without printing any of it, which is the point the narration makes

- N32 · scene 12 · "a blur would leave it in what's committed": why would a blur leave the key in the committed text? I guessed the blur is only a visual effect on the picture, while the text stays in the files, but that link is never made in the video. "committed" also assumes the video's text is stored in git.
  - Answer: kept: the meaning of "mask" says the text itself is committed, and scene 12's narration says a blur would leave the key in what's committed

- N33 · scene 12 · "choice A6" and "choice A7": A7, "A third fresh agent checks the narration against the sources", says a "third" agent. Which are the first two? I guessed the newcomer and the designer of "fresh eyes", but this video has not said so. "where a source is far longer than the video": how long is far longer? Also the picture puts the check after the key story, and it does not connect to it.
  - Answer: fixed: the meaning of "fresh eyes" now names the two, the newcomer and the designer, so the checker is the third

- N34 · scene 13 · "npm test … every fast spec passes; explainer.spec is new": "spec" has two meanings in the glossary. I guess a file of tests here, but "fast" is unexplained: are there slow ones that didn't run? Nothing says whether they were skipped.
  - Answer: kept: "fast" is npm test's fast run, this repo's usual one; the full run is not part of this build's claim

- N35 · scene 13 · "code check … 3 things the steps asked for, missing; all built since": the narration names the three (the row's length, Ask about this from the sources, and the plan's link back), but the picture does not. The word "steps" here means the plan's steps, but I never saw the plan, and the video used "Step one … Step five" without saying what the steps were beyond the scenes. "all built since" is a claim I can't check. Was the code check run again afterwards?
  - Answer: fixed: the code check's row now names the three things, and says they are built

- N36 · scene 13 · "reel audit … passes; 13 choices, one past a dozen": "audit" is defined, but "one past a dozen" isn't clear (is 13 too many? the glossary says the audit fails at five choices in one step with no question asked). I guessed one step has 13 choices, but "past a dozen" sounds like a limit. The narration doesn't mention audit at all, so the row is silent.
  - Answer: fixed: the row now says "13 choices, one past the dozen it warns on"

- N37 · scene 13 · "the guide parts wait for the plan guide's builder": "the plan guide" is a video the header hints at, but "the plan guide's builder" is a plain phrase with no meaning here. I guessed another piece of work not yet finished. Then what happens when a source is over 200 lines (scene 2)? Scene 3's own example ("1 needs a guide part") won't work yet. That would be a big gap, and the video hides it in the last rows.
  - Answer: kept: the plan guide is approved and not built (the recap line of the plan guide's video, before you watch); the walkthrough's Not done says so, and scene 13 says it

- N38 · scene 14 · "the list": has a meaning ("one sheet at a walkthrough's end"), but the scene says "The other six choices are the list" while the scene 13 picture said "13 choices" and only 4 were shown (A1, A6, A7, A9, A10, A12, A13 = 7 seen, plus the 6 here = 13). I can't easily reconcile "the other six" with what I saw, and no ids A14+ exist. It works out only if I add the numbers myself. The video does not say how many choices there are, nor which ones already paused.
  - Answer: kept: seven choices paused in scenes 5, 6, 9 and 12, and the list's heading now says six choices that don't pause

- N39 · scene 14 · "a data-artifact's text, a label apart" (A4) and "a digit said, not a step or scene" (A5): these are terse and I can't parse them. "data-artifact" is not defined, and I don't know what "a label apart" means or what a "digit said" is. A4 and A5 seem to be about what check-sources counts, but scene 10 never mentioned numbers being checked. I guessed A5 means digits in the narration are checked against the sources.
  - Answer: fixed: A4 now reads "the words in a quoted block, not its labels" and A5 "a digit in the narration, not a step or scene number"

- N40 · scene 14 · "the end kept as the review's verdict too" (A8) and "an explainer aims at 2 to 4 minutes, 5 with a long source" (A11): "the end" and "verdict" are not tied to anything I saw. "verdict" is in the glossary, but it means Approve / Request changes for a walkthrough, and an explainer has Done. I guessed the Done/Explain more/Plan this choice is also stored as the verdict. Yet scene 8's record shows "Done; 1 comment(s), 1 question(s)". The 2-4 minutes doesn't match the 3:17 in scene 5 exactly, but that is only a guess about the target length, and no check is shown.
  - Answer: kept: A8's line says the end is kept as the review's verdict too, which is what reel record's "Done" shows

- N41 · scene 15 · "Finish: your words, or Approve": the walkthrough ends on the choice of "Approve", and the narration says "approve the build", but the video hasn't shown what changes if I approve. I guessed the glossary meaning (the build is accepted). Also "Seeing it run, anything you'd change?" doesn't say what "it" is or that the whole video was a demonstration of what was built. The last frame is bare.
  - Answer: fixed: the ending's line now says "Approve the build, or say what to change in Finish"

- N42 · scene 1–15 · the overall thing "Explain first": I never got a plain statement of the problem it solves or who an "explainer" is for (nothing says why I would want a video before a plan). The names "explain first", "explainer" and "explanation" swap freely. What the narrator calls a "part of the repo" (scene 1) is never shown as a source in scene 2 or 3.
  - Answer: kept: scene 1 says what an explainer is for (a video of something already there, before any plan), and "explainer" has its meaning; "explain first" is the plan's name
