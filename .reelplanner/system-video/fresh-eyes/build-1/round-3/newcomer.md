# Fresh eyes: newcomer · round 3 · stamp 0cabc5bbfb38

- N1 · scene 2 · "Mark 0": I couldn't explain what pressing Mark does, or how it differs from typing in "Comment at this moment..." right beside it. I guessed it bookmarks the current instant separately from a comment. It matters because this button sits in the toolbar of every frame from here on, and I never learn what it records or where the "0" counts from.
  - Answer: kept: Mark is the page's own control, part of the screenshot; this video is about answering and the record, and the page says what Mark does where it sits ("Draw on the video")

- N2 · scene 2 · "Record · 4 steps · 0/3 decided · 0 comments": I couldn't explain what "Record" refers to. I guessed it's a running summary of this review-in-progress, maybe the same thing the decision log or the reel CLI reads later. It matters because it's the persistent bottom bar on nearly every frame, and its relationship to "the decision log" (named much later) is never stated.
  - Answer: kept: the Record bar is the page's running summary of this review (steps, what is decided, comments), part of the screenshot; scene 16 says what the reel CLI does with a sent review

- N3 · scene 5 · "system.json": I couldn't explain what this file is or how it relates to "spec.md," which the glossary's "A spec" entry says is "the system's own description of its parts." I guessed system.json is that same description in a different file. It matters because the "twelve parts" diagram is drawn straight from it, and system.json itself is never named in the glossary.
  - Answer: kept: system.json is named where it is shown, the stage's own label "system.json · the parts", the file the parts are drawn from; each part it draws is defined as it appears (scenes 5 to 7), and spec.md has its row under "A spec"

- N4 · scene 8 · "the two loops": the picture at this scene's last moment shows nothing but the closing caption — no diagram of which parts make up the review loop versus the build loop is on screen to check the narration against. I guessed the diagram simply hadn't drawn in yet when the shot was taken. It matters because this is the one scene meant to show how the two loops connect.
  - Answer: fixed: the frame went blank for its last 1.4 s: its voice line (re-voiced in round 2) outgrew the frame's own length; fix-clip-durations now restamps a frame to its slot in index.html (scripts/fix-clip-durations.mjs), and the diagram stays to the end

- N5 · scene 10 · "Videos · 2 need you": I couldn't explain what makes a video "need" me, or what the "2" is counting. I guessed it's a queue of videos across plans still waiting on a review. It matters because it's visible from the very first frame of the review page, and even scene 35 ("open any plan's video from Videos") never explains the counter.
  - Answer: kept: the page's own list, part of the screenshot; its words say what it counts (videos that need you), and the last scene says to open videos from it

- N6 · scene 11 · "frame-lint": I couldn't explain what this is — a tool, a script, a rule set? I guessed it's an internal check behind the "Check" column that verifies layout rules like a mark's position. It matters because several pass/fail rows cite it as the authority, and it's never introduced on its own.
  - Answer: kept: frame-lint is a word in the real detail page's own table, shown as written, and it has a glossary row (under "Lint / linter"); the scene says the details check tries every mark

- N7 · scene 12 · "Walk me through it" isn't visible: the narration says this button appears once you answer a quick check, but the picture at this scene's last moment shows only a "Size" slider popup and a large blank pane — no such button anywhere. I guessed the shot was taken at the wrong moment or the button is hidden under the slider. It matters because I still don't know what it looks like or where it sits.
  - Answer: kept: the scene's sentence ends on Size, and its picture is Size, the last thing said; Walk me through it has a glossary row (round 1)

- N8 · scene 13 · "the review page, opened without its server": I couldn't explain when or why someone would be looking at the review page with no server behind it. I guessed it's a plain hosted/static copy of a video with no reelplanning backend attached. It matters because the fallback it triggers — download the file, then run two commands yourself — is a materially different workflow from everything shown before it.
  - Answer: kept: the label says when: the page opened without its server; npx and the two commands have glossary rows; the other scenes show the page with its server

- N9 · scene 17 · "a plain pick": I couldn't explain what makes an answer a "plain pick," which is the reason given for why step one wasn't rewritten. I guessed it means picking a card with no comment attached, maybe the recommended one. It matters because it's the dividing line for the rule that the revise step "touches only a step your words landed on," and the term itself is never defined.
  - Answer: kept: scene 17 says it: "Step one got a plain pick, and stayed as it was", a card picked with no words, set against the steps "your words landed on"

- N10 · scene 18 · "2 choices to make": this notification, for a rebuilt plan video, uses "choices" for what the rest of the video calls a plan video's "questions" — the glossary keeps "a question" (plan video) and "a choice" (walkthrough accept/flag) separate. I guessed it's just loose wording for "2 things to answer." It matters because it blurs two terms the rest of the video is careful to keep apart.
  - Answer: kept: the notification's own words, shown as it prints them; on the frame, what it counts is the plan video's questions

- N11 · scene 20 · the walkthrough.md table is cut off at the right edge: every visible row's rightmost column is truncated mid-word ("a new autonomyStops list", "the recor... already r... one by or...", "the word... rules apa...", etc.), and no column headers are in frame. I guessed the missing text explains how each row's rule actually plays out, but I can't read it. It matters because this table is the picture illustrating the whole "a choice becomes a row" mechanic.
  - Answer: kept: as rounds 1 and 2: the camera crops the table to the columns the narration reads; rule 6 asks for that crop

- N12 · scene 20 · "plan-map.json" / "autonomyGroups": I couldn't explain what this file or field is, only that a "stop beat" is "carried" in it. I guessed it's where reel stops keeps its rules between builds. It matters because the mechanic just being introduced (labels, off-plan changes) apparently depends on this file, and it's named nowhere else.
  - Answer: kept: as rounds 1 and 2: the real walkthrough.md's own words, shown as the file writes them

- N13 · scene 21 · cut-off audit command and "18 cited, 0 own decision(s)": the `grep -E` pattern and part of the failure message run off the right edge of the frame, and I can't explain what "cited" versus "own decision(s)" are counting. I guessed "cited" means decisions referenced from elsewhere and "own decision(s)" means ones this plan itself logged. It matters because these are the numbers reel audit uses to fail a plan, and neither is defined or fully visible.
  - Answer: kept: reel audit's own output, shown as it prints it; the scene's pins say what to read ("5 choices", "no question")

- N14 · scene 22 · "`- defines:`": used in backticks as if it's a known field, alongside "a step" and "Finish" as things a scene can "define." I guessed it's a line in the storyboard file marking which word a given scene explains. It matters because the whole finding on screen hinges on whether a scene has this field, and it's never introduced by itself.
  - Answer: kept: the real findings.md's own words, shown as written; the scene reads its one ✗ line and what it asked for

- N15 · scene 22 · "the new build check": I couldn't tell whether this is the same thing as "the details check" (defined in the glossary as run by finish-project and verify), a renamed version of it, or something not yet added. I guessed it's the same check under a different name. It matters because the finding says this check "does not hold the system video" to certain scenes — a gap I can't place in whichever check it is.
  - Answer: kept: as N14, the finding's own words

- N16 · scene 24 · "A1"–"A5" versus "D1": I couldn't explain why the off-plan change is labelled "D1" while every other row is "A#". I guessed "D" stands for "deviation." It matters because it's the only place these id prefixes appear, and misreading the scheme would make a real reel stops output confusing.
  - Answer: kept: its label on the row says what it is, "off-plan change"; the letter is the file's own id

- N17 · scene 25 · "STEP 1 · NO LABEL, NO PAUSE" and its "grouped scene" tag: the frame's own header and tag seem to say these two choices (A1, A5) carry no label and don't pause — but this same scene's narration says the opposite, that step one's two choices are exactly the ones that "stop" and "pause once," and a "grouped scene" is elsewhere used for choices that don't stop. I guessed the on-screen header is a stale default the frame didn't update. It matters because it directly contradicts what I'm being told in the same breath.
  - Answer: kept: the scene's screenshot and words are from before walkthroughs-that-help, which made the rest of the choices one list at the end; that plan's step 7, this video's update for it, waits on its walkthrough's acceptance (D-003) and rewrites this scene

- N18 · scene 27 · scene numbers "18…36" and "22 of 37 lines to narrate": the sorted list and the cost line both go past 35, but this video only has 35 scenes. I guessed the system video actually has a few extra scenes (maybe an intro or outro) that aren't among the 35 I was shown. It matters because it undercuts my count of "this video" as exactly 35 scenes long.
  - Answer: kept: the run is of this video before a rebuild, and says so on its label ("this video, before this rebuild"); its line numbers are the script's, not its scenes

- N19 · scene 29 · "a fixed benchmark": the glossary itself says a retro is "judged against a fixed benchmark," but nothing on screen says what that benchmark is or measures. I guessed it's some standard test set the skill is graded against. It matters because it's the pass/fail bar for whether a retro's changes get kept.
  - Answer: kept: the glossary's own row says what a retro is judged against; the scene is about memory, and the retro is one line of it

- N20 · scene 29 · "[recommended]" / "[lost]" section headers: I couldn't explain what makes something count under "Lost" versus "Recommended" beyond what this one example's text happens to say. I guessed "Lost" tracks places I got confused or missed a check, and "Recommended" tracks how often I took the suggested card. It matters because these read like fixed categories memory always reports, not labels made up just for this example.
  - Answer: kept: reel memory's own headings, shown as it prints them; the lines under each say what it counts

- N21 · scene 31 · Step 5 tagged "rewound", Step 6 tagged "box": this scene's narration only talks about "a step your words landed on" (a comment), matching the "comment" tags shown on steps 2 and 4 — but steps 5 and 6 carry different tags I can't map to anything said so far. I guessed "rewound" means the step's scene was replayed, and "box" means it was answered in the own-words box. It matters because if these are different ways of "landing on" a step, that's a distinction the rule depends on but never spells out.
  - Answer: kept: the review's own tags on the steps, as the file shows them; the scene is about which steps the words landed on
