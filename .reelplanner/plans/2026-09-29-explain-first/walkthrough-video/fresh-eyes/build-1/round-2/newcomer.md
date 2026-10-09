# Fresh eyes: newcomer · round 2 · stamp 218a033e1a91

- N1 · scene 1 · "git diff 43f0e00.. · the code this build changed": I guessed this is every change since commit 43f0e00, but the video never says what 43f0e00 is or why it is the starting point. The narration also says "before any plan" without saying what an explainer is for. Nothing before this scene says why anyone would ask for a video of something already built, so I can't tell whether these seven files are the whole feature or only part of it.
  - Answer: fixed: scene 1's heading now says "The code this build changed (git diff 43f0e00..)", large; kept: scene 1's narration says what an explainer is for (a video of something already there, before any plan)

- N2 · scene 1 · "pins what you point at, in a folder of its own": "pin" has a meaning in the terms, but the scene doesn't use it that way. I guessed "pins" means it records the source. Which folder is "its own", and what is stored in it?
  - Answer: kept: "pin" has its meaning, and scene 3 shows the folder (.reelplanning/explainers/<date>-<slug>/) and what goes in it

- N3 · scene 1 · "An explainer, in the skill": I guessed "the skill" is the plan-to-video skill (SKILL.md). The video doesn't say which skill this is or what a skill does. The scene shows `reelplanning-player.js` (the review page's player) and `bundle-player.mjs` next to it, and I couldn't tell how they relate.
  - Answer: kept: the skill is this repo's plan-to-video skill, which the system video explains (before you watch); the map is one line a file

- N4 · scene 2 · "Step one. As you asked, there's no list of kinds": Which steps? Steps of what plan? "As you asked" points to a request I never saw. I guessed there was an earlier plan or review in which the viewer asked for this, but this video doesn't say so. "No list of kinds" is also unexplained: kinds of what? I guessed kinds of source (a log, a transcript, and so on).
  - Answer: kept: said in round 1's answer to the same point (fresh-eyes/round-1/newcomer.md), and the video is for the owner, who asked for this plan and approved it (question 1, answered in their own words, D-250)

- N5 · scene 2 · "D-226" listed as a source, shape "text", "3 lines": I guessed D-226 is an entry in the decision log, but the scene doesn't say so, and it sits among files with no marker. Can a decision be a source? How would I point the command at it?
  - Answer: fixed: the table now says "D-226 (a decision)"

- N6 · scene 2 · "a guide part", shown in the column "over 200 lines?": Scene 2 doesn't say what a guide part is. The glossary says it is the whole source organized to read, opened from the scene that shows it. The column sits next to sources of different shapes (files, table) and the narration says it depends on size only. Where does the viewer see it, and why do 254 lines of code and a 413-line table both need one?
  - Answer: kept: "guide part" has its meaning; the rule is size (the column's header), which is the point: a table and code both need one past 200 lines

- N7 · scene 3 · "pinned at 4f6e262 · 1 needs a guide part": I guessed 4f6e262 is a commit hash, but the sources are outside the repo (~/runs/0929), so a commit of what? The line says both "pinned at" a commit and "path and hash only", and I can't tell which one identifies the pin. "Needs a guide part" is also never followed up. Scene 13 says guide parts are not built, so I can't tell what a viewer gets today.
  - Answer: kept: "pinned at" is the repo's commit the explainer starts from, and the narration says files outside the repo are pinned by path, hash and line count; the walkthrough's Not done says guide parts wait for the plan guide's builder, as scene 13 says

- N8 · scene 3 · "`~/runs/0929/config.yaml` · text · 30 lines (outside the repo: its path and hash only, never its text)": If the text is never kept, how can the video quote anything from this file? Scene 10 says every quote must match its source. I guessed outside-repo sources can be described but not quoted, but nothing says so.
  - Answer: kept: a file outside the repo is read where it is, on this machine, when the build checks a quote (scene 10 checks against sources as pinned); only its text is kept out of git

- N9 · scene 3 · "asked again, the same day … experiment-2/": The narration calls it "a snapshot", and the terms say a snapshot is never updated. If a snapshot is never updated, what is the second folder for? I guessed it exists so that asking again doesn't overwrite. The narration and the "Not rebuilt" caption don't say that.
  - Answer: kept: scene 3's narration says asked again you get a new folder, and scene 4 is the check on why

- N10 · scene 4 · "seven commits have changed it" and options A, B and C: The question doesn't say what "plays" means: the explainer video or something else? Option C, "Nothing, until you rebuild it", reads as if the video is gone, but scene 3 said nothing is ever rebuilt. This check comes before the scene that answers it, so I'm guessing the intended answer is B.
  - Answer: kept: a quick check asks before the scene that shows it (D-222); scene 3 said nothing is ever rebuilt, and "plays" is what the review page does with a video

- N11 · scene 5 · "choice A10 · it pauses here" and "choice A1 · it pauses here": The narration says "Two choices". The picture shows two cards, with ids A10 and A1 in reverse order. I don't know what "A10" means or why choices "pause here" on a video that isn't paused. "Choice" has a glossary meaning (a choice the agent made alone), but a viewer at this point has been told nothing about it. The scene also doesn't say why two ordinary decisions, the name and the "waits under Needs you" behaviour, count as choices to review.
  - Answer: kept: "choice" has its meaning in the glossary; each card is a choice the agent made alone, which the player stops on for Accept or Flag; the ids are how your review names them

- N12 · scene 5 · "Needs you", with rows "Walkthr ough…", "Several people, one repo", "not on this page", the "Plan · Built" toggle and a "Guide" button: I guessed "Needs you" is the list of things waiting on the viewer. But I don't know what "Plan / Built" or "Guide" do, or what "not on this page" means. The top row's title is cut off ("Walkthr ough…"). The picture marks the Explainer row but doesn't name what is in the other rows.
  - Answer: kept: the crop is the review page as it is, with this repo's other plans waiting; the video points at the Explainer row, ringed

- N13 · scene 5 · "3:17 · explained at a523e4e, 5 commits since · planned: waiting-reviews": The narration says "its length, the commit it explains, five commits since, and the plan it led to". The picture shows the commit as a523e4e, but scene 3 showed 4f6e262 for a different run, and scene 4 said seven commits. Is a523e4e a commit of the review server, and where does "5 commits since" come from? I don't know what "planned: waiting-reviews" refers to. I guessed it's the plan started from this explainer, but the video has not shown that plan yet (it appears in scene 9).
  - Answer: kept: a523e4e is the commit the review server's explainer was made at (the real run), and five commits landed since; the check's seven is a made-up case; "planned" is the plan scene 9 shows

- N14 · scene 5 · "?project=2026-09-29-review-server--explainer": "Its address on the page" is shown without saying why it matters. The narration says "as a walkthrough's is", but a viewer of this video may not have seen a walkthrough's name. "Its folder's" folder name is not the same as the "2026-09-29-review-server" folder in scene 8 unless the viewer works it out.
  - Answer: kept: A1's card says the name is its folder's then "--explainer", beside the address

- N15 · scene 6 · "Finish": "Done", "Explain more" and "Plan this": The captions say "Finish" ends in three ways. The glossary defines Finish. But this scene gives "Explain more" as "The next version answers each question you asked, a scene each". Scene 6 doesn't say where those questions come from (Ask about this, per the glossary), nor how "the next version" relates to "nothing is ever rebuilt" in scene 3. It looks like a contradiction to me: is a new explainer folder made, or is the old one rebuilt?
  - Answer: kept: Explain more is a new build that you ask for; "nothing is ever rebuilt" is about the repo moving on (round 1's N16)

- N16 · scene 6 · "Nothing goes into the decision log: an explainer asks no questions, and only an answer is a decision": "Decision log" is defined, but the scene doesn't say why an answer is a decision. The choice card "A9 · What do you want next? on every explainer's Finish" is odd: the question it names is a text box, not a question with options. It also doesn't say which "choice" is being flagged: the question, or the fact it appears on every explainer.
  - Answer: kept: an explainer asks no plan questions, and scene 6's narration says the decision log holds only answers to them; A9 is that the box is on every explainer's Finish

- N17 · scene 7 · options "One entry, for the comment / Nothing / An entry marked unclear": Scene 6 just answered this on screen, so the quick check gives away its answer. I guessed B. Option C ("An entry marked unclear") refers to something I've never seen: marks on decision-log entries. "Superseded" appears in the glossary but not "unclear".
  - Answer: kept: scene 6 shows the rule, and the check is on a case it did not show (a comment of your own, then Done), as D-197 asks; "unclear" is how a plan question asks to be explained again

- N18 · scene 8 · "reel record .reelplanning/explainers/2026-09-29-review-server review.json": "reel" is the CLI, but nothing says what `review.json` is or who wrote it (I guessed the player's download, per the glossary, but the video doesn't say). "Files it beside the explainer" — the picture shows it filed under `reviews/explainer-….json` and `.md`, but I can't tell the relation between the JSON and the markdown. "1 question(s)" was never shown being asked.
  - Answer: kept: review.json is the review the page sent (any name), filed as .json with its .md beside it, both shown

- N19 · scene 8 · "ledger: nothing added": The terms give "ledger" as the decision log's other name in `reel` output. The narration and the caption say "decision log", so the two words appear side by side without a link. Also "Scene 2 (One claim a review)" is a scene title in a video I haven't seen, so its meaning is a guess. It appears again in scene 9.
  - Answer: kept: "ledger" has a meaning given in the storyboard's terms (the decision log, as reel calls it)

- N20 · scene 9 · "reel new-plan --from" and "reel prereqs …/2026-09-29-waiting-reviews": The narration names `reel new-plan --from`, but the picture shows only its output (a plan.md) and never the command. I have no idea how "Plan this" on the Finish screen leads to it. "Plan file" ("with no plan file, it writes a draft") is plain words with no meaning given: does a plan file exist before a plan is started? Where is one kept?
  - Answer: kept: the narration names the command, and plan.md's first line is its result; a plan file is the plan you already wrote, if any

- N21 · scene 9 · "before: system#part 5 | the build": The output lists two lines, one for the explainer and one for `system#part 5`. I don't know what "system#part 5" is or why it is a prerequisite. "Under Before you watch" is named in the narration, but the screen shows only command output, not the "Before you watch" card. I guessed "before:" lines are videos to watch first, but "the build" isn't a video I know.
  - Answer: kept: those are the real output's lines; the Before you watch card is made from them ("reel prereqs" has its meaning)

- N22 · scene 10 · "`build` now runs `check-sources`": "Build" is used as a command name, and "the build" also means "the thing built" (scene 13). I guessed "build" makes the video. "Check-sources" isn't in the glossary. I guessed it checks that quoted text is in the source. "As it was when it was pinned" ties back to "pin", but only if you remember scene 3.
  - Answer: kept: "build" is the command that makes the video, as every earlier walkthrough says; check-sources is shown running

- N23 · scene 10 · the highlighted word "by" in "export function claim(rp, id, by, extra = {}) {": The picture shows the source line with "by" highlighted and a retyped line without "by", and then the failure message. It works if you spot the one-word difference, but the narration says only "Retype one, and the build fails". The failure message gives `inbox.mjs:77-83` while the highlighted line is "line 77". Why 77-83, and what is `claim`? Not needed to follow, but it looks like it matters.
  - Answer: kept: 77-83 is the quote's source range the scene named; the marked word and the gap show the difference

- N24 · scene 10 · "a secret anywhere in the text stops it": "Secret" is only implied (scene 1 said "what is secret"). It doesn't say what counts as a secret or how the check knows. The caption is the last thing said and the picture shows no secret at all, so the sentence isn't shown.
  - Answer: kept: the secret is shown running in scene 12, after the check that predicts it

- N25 · scene 11 · options "Blurs it on the scene / Stops until it is masked / Warns, and builds": "Masked" has a meaning in the terms, but the viewer hasn't met "mask" in this video, and scene 10 didn't say what happens on failure beyond stopping. "GitHub access key" — I guessed a token that gives access to someone's account. The check asks about "a CI log", where CI is defined in the glossary but a CI log is never introduced (scene 2 lists ~/ci/run-1142.log without saying what it is).
  - Answer: kept: "mask" has its meaning; the check asks before the scene that shows it (D-222)

- N26 · scene 12 · "choice A6 · it pauses here" and "choice A7 · it pauses here": The narration says "Two choices", and the cards show A6 and A7. Card A7 says "A third fresh agent checks the narration against the sources", but the video only ever mentions fresh eyes in glossary terms (two agents). I don't know what the first and second fresh agents are, or when a source counts as "far longer than the video", or what this "third" agent does to a failure. It isn't shown running.
  - Answer: kept: fresh eyes has its meaning, naming the newcomer and the designer, so the checker is the third

- N27 · scene 12 · "(ghp_…REDACTED)" and "a blur would leave it in what's committed": I guessed ghp_ is the start of a GitHub token and "committed text" means the text in the video's files kept in git. I don't know why a blur would leave it there (I guessed the text is still in the files under the picture). Also unclear: "named by its kind only, never printed": is the kind "a GitHub token"?
  - Answer: kept: "mask" has its meaning (the text itself is committed); the kind is the key's prefix, ghp_

- N28 · scene 13 · "npm test: every fast spec passes; explainer.spec is new": "Spec" has two meanings in the glossary. Here I guessed a test file, and "fast" implies there are slow ones that were not run. Does that matter?
  - Answer: kept: npm test is this repo's fast run, as every walkthrough here says

- N29 · scene 13 · "code check: missing, now built: the row's length, Ask from the sources, the plan's link back": "Code check" is defined. But these three things are named without saying what they are: "the row's length" (I guessed the length shown in scene 5's row, 3:17), "Ask from the sources" (Ask about this, answered from sources; not shown anywhere), "the plan's link back" (a link from the plan to the explainer, scene 9). None of the three was shown running. The narration says "the steps asked for" — the steps are not shown, so the viewer can't tell what was expected.
  - Answer: fixed: the row is shorter; kept: the narration names the three, and each is on the plan's steps

- N30 · scene 13 · "reel audit: passes; 13 choices, one past the dozen it warns on": "Audit" is in the glossary, and the terms say it fails on five choices with no question. "A dozen" is not stated anywhere in the video, and "warns" is not the same as "fails". Is 13 a problem? I counted the cards shown (A1, A6, A7, A9, A10, A12, A13) plus the six on the list, which comes to 13, but nobody says so.
  - Answer: kept: the row says the audit passes and warns past a dozen, which is all it claims

- N31 · scene 13 · "not done: the guide parts wait for the plan guide's builder": "Plan guide" is a prior video's subject, but "the plan guide's builder" isn't explained here. I guessed it's another piece of work not yet built. If it isn't done, then scene 2 and scene 3 show "a guide part" as a working result. A viewer can't tell which parts of the seven files are unfinished.
  - Answer: kept: the Not done line says the guide parts wait; sources.json marks which need one

- N32 · scene 14 · "The list: six choices that don't pause, each with its own Flag": "The list" has a glossary meaning, but the video is the first to show it for a viewer who hasn't seen the earlier walkthrough video. What does Flag do here, and where is the button? The picture shows none (no Flag control, no Accept all). Also the ids jump (A2, A3, A11, A8, A4, A5) in no clear order.
  - Answer: kept: "the list" has its meaning (each line with its own Flag, in the player)

- N33 · scene 14 · "the end kept as the review's verdict too" (A8): I can't parse this. "The end" of what? "Verdict" is defined in the earlier videos; here I guessed it's "Done" or "Explain more" being stored with the review. Why "too"? Nothing in scenes 6 and 8 says the verdict is kept in the review. The same goes for "a quoted line: the words in a quoted block, not its labels" (A4) and "a number: a digit in the narration, not a step or scene number" (A5). A quoted line and a number are checked by what, where? Scene 10 mentions "quoted line", but the number rule appears here for the first time.
  - Answer: kept: A8, A4 and A5 are each one line on the list, with their full rows in walkthrough.md; A5 is what counts as a number, as the check says

- N34 · scene 14 · "an explainer aims at 2 to 4 minutes, 5 with a long source" (A11): Aims where? Who set that, and where does the viewer see it? Scene 5 shows an explainer at "4 min" (and 3:17), but nothing else about length.
  - Answer: kept: A11's line is the budget `build` warns against, in walkthrough.md

- N35 · scene 15 · "Seeing it run, anything you'd change?": The scene says "seeing it run", but the video showed screenshots and command output rather than a live run. I guessed "run" means the demos in scenes 3, 8, 9, 10, and 12. "Approve the build" is given as an option, but the video doesn't say what approving does next (the glossary says the comments are acted on, no new video). Are the two quick checks answered wrongly counted anywhere?
  - Answer: kept: the scenes show real runs of the change, which is what the walkthrough's ending asks about
