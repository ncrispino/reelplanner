# Code check brief: 2026-09-28-videos-that-make-sense

You are checking that an implementation follows its plan. You did not write it. Answer three questions,
every answer tied to a file (and a line where you can), and write them to `.reelplanning/plans/2026-09-28-videos-that-make-sense/code-check/findings.md`.

1. **Steps.** Does every plan step have a change that carries it out?
2. **Decisions.** Does every decision below hold in the code?
3. **Unexplained.** Is there anything in the diff the autonomy log does not explain? A change counts as
   explained when a step asks for it, a decision requires it, or an autonomy row names it. A choice a
   reviewer could reasonably have made the other way (a default, an error code, a library, a data
   shape, deleting instead of flagging, behaviour someone can see) needs a row; renames, file layout
   and the order of edits do not.

Report what you find, never fix it. Say "✗" only for something a reviewer would want to know; say why
in one sentence.

## The shape of findings.md (keep it exactly)

```
# Code check: 2026-09-28-videos-that-make-sense

## Steps
- Step 1 — ✓ carried by `path/to/file`, `other/file`
- Step 2 — ✗ nothing in the diff carries "<the part of the step>"; closest is `file`

## Decisions
- D-004 — ✓ holds: `path/file.mjs` (the summary frame is written in resumeAt)
- D-005 — ✗ broken: `path/file.js:120` counts a record jump as a rewind

## Unexplained
- `path/file.js` — ✗ changes the default speed from 1× to 1.25×; no step, decision or autonomy row covers it. Suggest: autonomy row "default speed 1.25×, instead of 1×".
```

Write "- none" under a section with nothing to report. Every ✗ line must start with its key: `Step N`,
a decision id, or a backticked path.

## Commits (a9896c9..HEAD, limited to scripts packages skills templates docs README.md CHANGELOG.md .gitignore .reelplanning/.gitignore .reelplanning/glossary.md .reelplanning/terms-index.json .reelplanning/system-video .reelplanning/plans/2026-09-28-videos-that-make-sense)

```
acf2dc4 Videos that make sense: walkthrough.md, the tests run and what is not done; reel audit passes but for the code check
cc0dde0 Videos that make sense, step 5: the videos we have, and the skill (D-227). The skill's Build a video has the fresh-eyes loop between build and opening the page, for every new video and every rebuild of an older one; §11's checklist has the seven rules. The system video checked now, three rounds of two fresh agents (claude -p with only their prompt, m6): 93 findings, each answered (17 fixed, 3 a meaning, 73 kept with the reason). Fixed: "The reel CLI" read "ThereelCLI" on four scenes; two scenes blank for their last moment (fix-clip-durations now restamps a frame to its slot, m7); pins moved off words or onto their thing; place labels and the ending say what they show and where the videos are; scenes 8 and 29 say "the reel CLI, which keeps the record" and "signal"; two frame-lint stand-ins now words. Glossary Other words: Recommended, The real thing, Walk me through it, npx. What is left after the third round is on Before you watch, three shown, the rest one click down (A6). The pictures are now 0.4 s before a scene's end (A2). Rebuilt only those scenes, ids kept; not published
b474ec6 Videos that make sense, step 4: frames back to basics. The style guide's §5 gets "A frame a newcomer can read": seven rules (show the thing, never a stand-in; one reading order; a label on its thing; a question says what you decide; nothing covers content; readable at a glance; pleasing), with the step 6 frame before and redrawn, and rule 3 told apart from rule 1 (the approval's check). frame-lint fails empty bars standing where words go (rule 1, A12) and anything within 40 px above a data-detail mark (rule 5, A13); the designer checks all seven on the picture. The stage templates' regions and page mocks hold words, not three grey bars (m5). visuals.spec
c430c58 Videos that make sense, step 3: find out about any phrase, in the player (D-226). A kept phrase's meaning goes in the glossary's Other words or the storyboard's terms: (checked by fresh-eyes --check) and is underlined as before. Ask about this: Q, the Ask button, a plain caption word or an underlined word's card opens it in the side panel, about the scene on screen (A8); hosted, Claude answers through the page's `sample` capability, on a click only, from the scene's narration and frame, its plan step and the glossary rows, ending with where it came from; refusals hide it, rate_limited is never retried (A9); on your machine the session waiting on `review --wait` answers (POST/GET /api/ask, `inbox answer`), none waiting and it goes with the review (A10). Every question is kept in the review's `questions`, listed in reviews/<id>.md (A11), counted in `reel memory lost` (m4); the plan map carries each scene's narration (m3). ask.spec (new, in the fast run), loop.spec, fresh-eyes.spec; hosted-review.md, reference.md, the skill's loop
df9c961 Videos that make sense, step 2: every finding is answered before the page opens (D-225). verify runs `fresh-eyes --check`: a finding with no answer, a kept with no reason, or a meaning that isn't in the glossary or terms: stops the build (A7); no run yet, agents not back, or scenes changed since they looked is a △, which build shows as a line of its own (A5). A new round keeps the last in round-<n>/, at most three (m2); what is left after the third, the findings kept with their reasons, goes in the plan map, on the page's Before you watch and in the notification (A6). docs/reference.md: Fresh eyes before you watch. access.spec, fresh-eyes.spec
4dc6bfc Videos that make sense, step 1: two fresh agents look at the video before you do. `reelplanning fresh-eyes <video-dir>` writes a newcomer's and a designer's brief, like the code check's: each scene's narration and a picture of it at rest taken through the review page (the player's tab, chips and captions in it; A2); the newcomer also the glossary, the video's own meanings, the recap lines and what viewers were lost on before, from every review in the repo (words looked up, Explain this more, "wdym", checks missed, questions asked; A4), nothing from the plan; the designer the seven rules. `--prompt newcomer|designer` starts each with only that; one numbered finding a line, answered under it (A1), stamped per scene (A3). The pictures stay out of git. fresh-eyes.spec; walkthrough.md started (A1-A4)
```

## The plan, as implemented

Read `.reelplanning/plans/2026-09-28-videos-that-make-sense/plan.md` in full. Its title is "Videos that make sense: fresh eyes before you watch, a way to ask, frames back to basics", with 5 steps.

## The decisions that apply

- **D-001** (step 3) Who checks that the code followed the plan? → **Second agent**
- **D-003** (step 6) When does the system video update? → **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?**
- **D-005** (step 6) Which video-only feedback comes first? → **Automatic rewinds**
- **D-024** (step 2) How is each detail page made? → **Types first**
- **D-064** (step 3) Who runs the loop between your reviews? → **A background agent that owns it**
  - note: would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
- **D-065** (step 4) When a system-video comment asks for the system itself to change, what happens? → **Small fixes go straight in; anything with a choice becomes a plan**
- **D-082** (step 6) What may a run nobody is watching do? → **Auto mode, inside the sandbox**
- **D-085** (step 9) How much scaffolding comes out? → **B, and the files**
- **D-106** (step 3) Where does your memory across repos live? → **A file in your home folder**
- **D-107** (step 5) When does the tool suggest a retro? → **Every five plans, or when a signal repeats three times**
- **D-109** (step 2) What may a miss with no tags stop? → **Nothing directly**
- **D-110** (step 3) A step reaches its fifth call during the build. What does the implementer do? → **Asks before going on**
- **D-127** (step 1) Which words does the viewer see: plain new ones, or today's, explained? → **Plain words on screen**
  - note: yes do A and in general we want simple language too in our plasn i think thats a good aspect, dont make more complicated than it needs to be
- **D-128** (step 2) Where is "you watched it" kept? → **This browser, and your file**
- **D-129** (step 3) Can approving ever be blocked when you answered checks wrong? → **Never; it is recorded**
- **D-142** (step 3) Which accent colour? → **A darker coral**
- **D-166** (step 1) Which scenes must show the real thing? → **The brief picks**
- **D-167** (step 3) Which look should the review page take? → **Today's, fixes only**
- **D-169** (step 3) Who reviews each arm, and in what order? → **You, ours first**
- **D-170** (step 4) How is where we end up judged? → **Rubric, blind judge, your rank**
  - note: yes we will use rubric but its also about the planning process, and also about what we think might be different than rubric
- **D-171** (step 4) How do decision numbers survive two branches? → **In order, a merge rule**
- **D-194** (step 2) What shows that a thing on the frame opens a page? → **A tab, the whole time**
- **D-195** (step 3) Where does a detail open once you click the thing? → **Over the frame, from the block**
- **D-196** (step 4) What becomes of the corner chip on a rebuilt video? → **It goes where a thing is marked**
- **D-197** (step ?) When does a quick check come, and on what case? → **Later, on a new case**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **D-198** (step ?) What does the build do about a check asked too soon, or on the case just shown? → **Two warnings**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **D-199** (step ?) Which videos take the new quick checks, and when? → **New and revised, and the system video now**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with not the recommendation (it was: new and revised only)
- **D-200** (step 1) How much does a PR ask of its contributor? → **Asked; the maintainer can make it**
- **D-201** (step 2) When the maintainer disagrees with an answer from the contributor's plan, what does the decision log keep? → **The last answer**
- **D-202** (step 3) How much does the maintainer check before trusting a contributor's video? → **CI's, and a code check**
- **D-213** (step 3) Where does a PR's built video live? → **Attached to the PR, as a zip**
  - note: the reviewer's note: "would B be easy to do? also i dont know if we want in the git history thought hats the main question"; delivered by D-215 (decided in conversation, 2026-09-27): what this decided holds, the built video never lands in git's history and the PR's branch carries only its text, but it reaches the maintainer on a throwaway branch (video/pr-<n>, never merged, deleted after the merge), not as a zip attached to the PR by hand
- **D-215** (step 3) How does a PR's built video reach the maintainer? → **A throwaway branch**
  - note: decided in conversation (2026-09-27), not in a plan review: a follow-up to the round-4 review of this plan (reviews/plan-20260927T050151Z.md); the options were laid out in the conversation and the owner chose the recommendation; it is how D-213's "not in the branch" is delivered (the PR's branch carries only the videos' text), in place of the zip attached by hand, and answers the note on D-213 ("would B be easy to do?"): yes, every step is a command
- **D-216** (step ?) What gets labelled? → **The build finds it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner gave an answer of their own ("normally the build will find this, we might track in certain repo here though like this one"), recorded as the first option
- **D-217** (step ?) What does check-terms do with a likely-jargon word said or shown with no meaning? → **Warn, fail on strict**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **D-218** (step ?) How long does a labelled word stay underlined? → **Stop once you know it**
  - note: decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **D-219** (step 1) What replaces today's walkthrough video? → **A short video of it running**
- **D-221** (step 2) What does Approve make of a choice on the list? → **Listed, not judged**
- **D-222** (step 3) Does the walkthrough test you? → **Where there's something to predict**
- **D-223** (step 4) Does a small pull request's choice need the video? → **Only a choice you'd notice**
- **D-224** (step 5) How do the plan and what was built sit together? → **One row, a Plan | Built switch**
- **D-225** (step 2) What becomes of a fresh-eyes finding nobody has answered? → **Answered before you see it**
- **D-226** (step 3) How do you find out what a phrase means? → **Those, and Ask about this**
- **D-227** (step 5) Which videos get fresh eyes? → **Every new one, and the system video now**

## The autonomy log (the implementer's own calls)

| id | step | chose | instead of | why | check |
|---|---|---|---|---|---|
| A1 | 1 | A finding is one line, `- N1 · scene 4 · "the phrase": what, why`, its phrase in double quotes; the author's answer is the indented line under it, `- Answer: fixed: …`, `meaning: …` or `kept: <the reason>`, and `verify` reads both [close] | a table per file, or the answers in a file of their own beside the findings | the plan says one numbered finding a line and the answer in the same file; a line and the one under it read as a conversation, and the quoted phrase is what a `meaning` answer is checked against | `parseFindings`, `answerProblem` in `scripts/lib/fresh-eyes.mjs`; `scripts/test/fresh-eyes.spec.mjs` |
| A2 | 1 | The pictures: the video packed with `bundle-player` and opened in headless Chromium at 1440 × 900, the Before you watch card dismissed, each scene seeked 0.4 s before its end (0.12 s at first; changed after the system video's look, whose designer read the next scene's first caption, already up, as this one's) and the player's stage photographed; without `playwright-core`, the frames alone from HyperFrames' snapshot, and the brief says the player's tab and chips are not in them [close] | the page at another size, or the frames alone every time | 1440 × 900 is a laptop, the size a viewer reads at, so "too small to read" is judged as they'd see it; the plan needs the player's tab in the picture (the Open tab that hid a row passed `frame-lint`), and a machine without a browser still gets a look | `pagePictures`, `framePictures` in `scripts/fresh-eyes.mjs` |
| A3 | 1 | What the agents saw is kept per scene in `fresh-eyes/stamp.json` (its narration line and its frame's HTML, hashed), so `verify` names the scenes changed since they looked [close] | one hash for the whole video, or a stamp line in each findings file only | a finding is about a scene, and a round-2 look is due because of the scenes a fix touched; naming them says what changed | `stampOf`, `changedSince` in `scripts/lib/fresh-eyes.mjs` |
| A4 | 1 | "Viewers were lost on these before" is read from every review in the repo (the plans' and the system video's), newest first, at most 40: words looked up, "Explain this more", an answer, comment or check note that asks what something means ("wdym", "confused", "what do you mean"), checks missed, and questions asked on the page [close] | only `reel memory lost`'s lines (words looked up in three reviews or more), or the reviewer's file across repos | the plan lists every kind; the repo's reviews hold the words themselves ("wdym dropps the video"), which a count does not, and every reviewer of this repo is who the next video is for | `lostBefore`, `LOST_WORDS` in `scripts/lib/memory.mjs` |
| m1 | 1 | The pictures (`fresh-eyes/shots/`) are kept out of git in `.reelplanning/.gitignore` and `reel init`'s template; the briefs, stamp and findings are committed | committing the pictures | each run makes them again, and a plan folder carries only its videos' text (D-213) | `.reelplanning/.gitignore`, `templates/reelplanning/gitignore` |
| A5 | 2 | Only a finding with no answer (or a bad one) stops the build; no run yet, agents not back yet, or scenes changed since they looked is a △ line, and `build` shows what verify read of fresh eyes as a line of its own [close] | stopping on no run too, or on scenes changed since | the first build has to finish before anything can be pictured, and a fix is what makes scenes change: stopping on either would stop every build; D-225's promise is about findings, which a stop keeps | `freshEyesState` in `scripts/lib/fresh-eyes.mjs`; `scripts/verify.sh` (4/6); `scripts/build.mjs` |
| A6 | 2 | What is left after the third round is that round's findings the author kept (not those given a meaning, which a click explains, nor those fixed), each with the reason: on the page's Before you watch, under the videos to watch first ("Left as they are: … Kept: …"), shown even when every video before it was watched, three on the card and the rest behind "N more" (the system video's third round left 32), and in the notification's line ("2 things fresh eyes left as they are") [visible] | every finding of every round, or a line with only the count | a kept finding is the one confusion the viewer still meets, and the reason is what they need; a meaning is already one click away | `freshLeft`, `freshLeftHtml` in `packages/player/reelplanning-player.js`; `leftAfter` in `scripts/lib/fresh-eyes.mjs`; `waitingLine` in `scripts/lib/notify.mjs`; `packages/player/test/access.spec.mjs` |
| A7 | 2 | An answer is checked, not just present: `meaning` needs its quoted phrase in the glossary (Other words included) or the storyboard's `terms:`, `fixed` needs where (two words or more), `kept` a reason (three words or more) [close] | any answer word passing | "kept" alone is exactly the silence D-225 rules out, and a meaning that was never added leaves the phrase with nothing to click | `answerProblem`, `hasMeaning` in `scripts/lib/fresh-eyes.mjs`; `scripts/test/fresh-eyes.spec.mjs` |
| m2 | 2 | A new round moves the last one's briefs, findings and stamp to `fresh-eyes/round-<n>/`, never starts while a finding of the last is unanswered, and a fourth is refused | overwriting the last round, or numbering the files | the rounds are the record of what was found and answered; the plan says at most three | `scripts/fresh-eyes.mjs` (a new round) |
| A8 | 3 | Ask about this opens in the side panel (where Terms and details open), about the scene on screen, the video paused: from an Ask button beside Terms and the key Q, from a plain caption word clicked (its caption quoted in the panel), and from an underlined word's card ("Still unclear? Ask about this", the word in the box); a click elsewhere on the frame does what it did [visible] | a box laid over the frame, or a click anywhere on the frame opening it | the side panel is where the page already explains things and leaves the frame readable; a click on the frame is drawing's (Mark), so only the captions, words the viewer reads, open it | `openAsk`, `captionAtPoint`, `renderAsk` in `packages/player/reelplanning-player.js`; `packages/player/test/ask.spec.mjs` |
| A9 | 3 | On a hosted page, one `sample` call per question, on a click only, on the quick tier: its input is the instructions (answer only from this, plain words, two to five sentences, say so when it isn't there), the question, the scene's narration and the words on its frame, its plan step's text (else the plan's problem), and the glossary rows the question and scene mention (with this video's own words); the answer's last line, "From: …", shows under it; `not_granted` and the other refusals hide the hosted path for the view, `rate_limited` is said and never retried [close] | the default tier (it thinks first, 5 to 60 s), or the whole glossary and plan in every call | the plan says answers in seconds, and the quick tier starts at once; what the scene needs is its own step and the words it says, which keeps the call small and the answer on the scene | `askClaude`, `askPrompt`, `splitFrom` in `packages/player/reelplanning-player.js`; `docs/hosted-review.md` |
| A10 | 3 | On your machine, a question goes to the session waiting on `review --wait`, which wakes on it as on a review (`inbox/questions/<id>.json`) and answers with `reelplanning inbox answer <id> "…" --from "…"`; the page asks for the answer every 2 s for two minutes at most; with no session waiting nothing is written and no headless run starts: it goes with the review [visible, close] | starting the headless agent command on a question, or a question file left for a session that starts later | the plan says a waiting session answers in seconds, and with none the question goes with the review; a headless run would take minutes to answer one line, and a file nobody polls answers nobody | `handleAsk` in `scripts/review.mjs`; `writeQuestion`, `waitingQuestions`, `answerQuestion` in `scripts/lib/inbox.mjs`; `scripts/inbox.mjs` (`answer`); `scripts/test/loop.spec.mjs` ("ask:") |
| A11 | 3 | Every question is kept in the review as `questions: [{ question, t, frame, planStep, askedAt, quote?, answer?, from?, via?, note? }]`, `answered: false` where it has no answer; `reviews/<id>.md` lists them under "Questions you asked", an unanswered one "to answer in the next version", an answered one still "make it plain there too" [hard-to-undo] | only the unanswered ones, or questions as comments on their step | the plan keeps every question (it counts in memory and goes to the next newcomer), and an answered question still says the video didn't make it plain; a field of its own keeps them apart from what the reviewer said about the plan | `exportPayload` in `packages/player/reelplanning-player.js`; `actOnMarkdown` in `scripts/lib/review-scope.mjs`; `scripts/test/fresh-eyes.spec.mjs` ("step 3") |
| m3 | 3 | The plan map carries each scene's narration (`frames[].narration`, from `SCRIPT.md`), so a question about a scene is answered from what it says | reading the captions out of the frame at question time | the captions are split and timed for the screen; the script is the words | `scripts/plan-map.mjs` |
| m4 | 3 | `reel memory lost` counts the questions asked, and lists them in its evidence, beside the words looked up | a line of their own | the plan says a question counts like a word looked up | `lostOf`, `memoryLines` in `scripts/lib/memory.mjs` |
| A12 | 4 | Rule 1 in `frame-lint`: a bar is an element with no text, under 12 px high, over 120 px wide and filled; bars stand where words go when two or more are in a box with no text, one after another in a box's flow, or stacked (left edges within 24 px, tops 14 to 60 px apart, as lines of text are); one bar alone, or two underlines 9 px apart, passes [close] | any empty bar failing, or only a box holding nothing but bars (the plan's words) | a single bar is a rule, an underline or a progress bar; the step 6 frame's two grey lines were siblings of the box's other words, not inside an empty box, so "only bars" alone would have passed the frame the owner sent | `scripts/frame-lint.mjs` (rule 1); `scripts/test/visuals.spec.mjs` |
| A13 | 4 | Rule 5 in `frame-lint`: another element with words of its own, or a filled leaf (a chip, a line), whose box ends in the 40 px above a `data-detail` mark fails; a line of words with a place but no size is measured as one line of its type; a panel holding other things, or a background behind the mark, is not in the way [close] | any element's box touching the band, or only elements whose size the CSS gives | a panel or background behind the thing is not what the tab covers, and most labels in frames are placed with no height, so they would never be seen | `scripts/frame-lint.mjs` (rule 5, `placeOf`); `scripts/test/visuals.spec.mjs` |
| m5 | 4 | "The theme's frame generator" is read as the theme's stage templates: `layout.html`'s regions (Steps, Decisions, Comments, three grey bars each) and `pipeline.html`'s page mocks now hold a line or two of real words | a new generator | they are what frames are started from, and the only three-bar cards in the theme | `templates/reelplanning/theme/stages/` |
| m6 | 5 | Each fresh agent ran as a headless `claude -p` with exactly the `--prompt` text, in a scratch folder holding only its brief and the pictures (the brief's paths kept), allowed to read there and to edit only its findings file; the findings were copied back | a subagent in this session, or `claude -p` in the repo | the prompt says to open nothing else, and a scratch folder makes that true: nothing of the plan or the code is there to read | `.reelplanning/system-video/fresh-eyes/` (stamps, rounds) |
| m7 | 5 | `fix-clip-durations` restamps a frame's root, and its full-length layers, to its slot in `index.html` when they differ | fixing the two frames by hand | the system video's fresh eyes found a scene blank for its last moment twice, both after a voice line changed length; the build had left the frame's own length behind | `scripts/fix-clip-durations.mjs` |

## The diff

Read it yourself: `git diff a9896c9..HEAD -- scripts packages skills templates docs README.md CHANGELOG.md .gitignore .reelplanning/.gitignore .reelplanning/glossary.md .reelplanning/terms-index.json .reelplanning/system-video .reelplanning/plans/2026-09-28-videos-that-make-sense` (from the repository root). The files it touches:

```
.gitignore                                         |    2 +
 .reelplanning/.gitignore                           |    4 +
 .reelplanning/glossary.md                          |    4 +
 .../walkthrough.md                                 |  220 +
 .../system-video/.hyperframes/narration.json       |   24 +-
 .reelplanning/system-video/SCRIPT.md               |    6 +-
 .reelplanning/system-video/STORYBOARD.md           |    8 +-
 .reelplanning/system-video/assets/voice/08.wav     |  Bin 602156 -> 687148 bytes
 .reelplanning/system-video/assets/voice/29.wav     |  Bin 828460 -> 830508 bytes
 .reelplanning/system-video/assets/voice/35.wav     |  Bin 477228 -> 551980 bytes
 .reelplanning/system-video/audio_engine_meta.json  |  592 +-
 .reelplanning/system-video/audio_meta.json         |  590 +-
 .reelplanning/system-video/caption_groups.json     | 7995 ++++++++++----------
 .../system-video/compositions/captions.html        |   12 +-
 .../system-video/compositions/frames/01-hook.html  |    2 +-
 .../compositions/frames/04-two-videos.html         |    8 +-
 .../compositions/frames/09-answers-back.html       |    2 +-
 .../compositions/frames/10-after-code.html         |    2 +-
 .../system-video/compositions/frames/11-cast.html  |   64 +-
 .../compositions/frames/15-review-1-3.html         |    4 +-
 .../compositions/frames/20-before.html             |    2 +-
 .../compositions/frames/21-beside.html             |    2 +-
 .../compositions/frames/25-code-3.html             |    6 +-
 .../system-video/compositions/frames/28-fix.html   |    2 +-
 .../compositions/frames/29-catch-up.html           |    2 +-
 .../compositions/frames/30-memory.html             |   26 +-
 .../compositions/frames/33-rule-ids.html           |    6 +-
 .../system-video/compositions/frames/35-end.html   |   40 +-
 .../compositions/frames/36-headless.html           |   12 +-
 .../system-video/fresh-eyes/designer-brief.md      |  247 +
 .reelplanning/system-video/fresh-eyes/designer.md  |   43 +
 .../system-video/fresh-eyes/newcomer-brief.md      |  378 +
 .reelplanning/system-video/fresh-eyes/newcomer.md  |   64 +
 .../fresh-eyes/round-1/designer-brief.md           |  247 +
 .../system-video/fresh-eyes/round-1/designer.md    |   46 +
 .../fresh-eyes/round-1/newcomer-brief.md           |  374 +
 .../system-video/fresh-eyes/round-1/newcomer.md    |   28 +
 .../system-video/fresh-eyes/round-1/stamp.json     |  183 +
 .../fresh-eyes/round-2/designer-brief.md           |  247 +
 .../system-video/fresh-eyes/round-2/designer.md    |   31 +
 .../fresh-eyes/round-2/newcomer-brief.md           |  378 +
 .../system-video/fresh-eyes/round-2/newcomer.md    |   73 +
 .../system-video/fresh-eyes/round-2/stamp.json     |  183 +
 .reelplanning/system-video/fresh-eyes/stamp.json   |  183 +
 .reelplanning/system-video/index.html              |  176 +-
 .reelplanning/system-video/plan-map.json           |  636 +-
 .reelplanning/terms-index.json                     |   68 +-
 CHANGELOG.md                                       |   12 +
 README.md                                          |    4 +
 docs/hosted-review.md                              |   21 +
 docs/project-dir.md                                |    3 +
 docs/reference.md                                  |   32 +
 docs/status.md                                     |    1 +
 packages/player/reelplanning-player.js             |  247 +-
 packages/player/test/access.spec.mjs               |    8 +
 packages/player/test/ask.spec.mjs                  |  144 +
 scripts/build.mjs                                  |    6 +-
 scripts/fix-clip-durations.mjs                     |   19 +-
 scripts/frame-lint.mjs                             |   62 +-
 scripts/fresh-eyes.mjs                             |  261 +
 scripts/inbox.mjs                                  |   20 +-
 scripts/lib/fresh-eyes.mjs                         |  160 +
 scripts/lib/inbox.mjs                              |   42 +
 scripts/lib/memory.mjs                             |   41 +-
 scripts/lib/notify.mjs                             |    3 +
 scripts/lib/review-scope.mjs                       |   13 +
 scripts/plan-map.mjs                               |    9 +
 scripts/review.mjs                                 |   31 +-
 scripts/test/fresh-eyes.spec.mjs                   |  167 +
 scripts/test/loop.spec.mjs                         |   26 +
 scripts/test/run.mjs                               |   10 +-
 scripts/test/visuals.spec.mjs                      |   19 +
 scripts/verify.sh                                  |   16 +-
 skills/plan-to-video/SKILL.md                      |   33 +-
 skills/plan-to-video/references/style-guide.md     |   40 +
 templates/reelplanning/gitignore                   |    4 +
 templates/reelplanning/theme/stages/README.md      |    4 +
 templates/reelplanning/theme/stages/layout.html    |   12 +-
 templates/reelplanning/theme/stages/pipeline.html  |   11 +-
 79 files changed, 9783 insertions(+), 4920 deletions(-)
```
