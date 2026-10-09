# Fresh eyes: newcomer · round 1 · stamp 04915629a390

- N1 · scene 1 · "plan.md · a plan like this one, as the agent wrote it": the example plan is titled 'The plan guide: the video first, and a full page behind it…' and its steps are about 'the guide', which nothing has introduced yet; 'a plan like this one' also leaves me unsure which plan 'this one' is. I guessed it is a real plan for building this tool's own guide page. It matters because the very first frame makes me wonder whether I should follow the plan's content (a guide? whose?) or only notice its length and its four questions.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N2 · scene 2 · "an example plan's video: an upload that resumes": the narration says reelplanner turns 'that plan' (scene 1's plan, five steps and four questions) into a video, but the picture shows a different plan's video, about uploads, with three steps and one question. I guessed it is a second, simpler example, but nothing says the plan changed; it matters because I try to map scene 1's steps and questions onto these cards and they don't fit.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N3 · scene 2 · "The ending: every answer on its step": I can't tell what this last card means. I guessed the video ends with a recap showing each answer you gave beside the step it changes; it matters because it's the only card whose subtitle isn't a plain topic, and it hints at something done with answers that is never explained.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N4 · scene 4 · "just the video: no guide, no record": scene 2 said the rest of the plan goes on a page under the video, the guide, but here level 1 is 'no guide'. Does a plan video at level 1 come with its guide or not? And 'record' hasn't been said yet (scene 6 is the first 'keeps the project's record'). I guessed the guide comes only with level 3; it matters because this is the frame I'd use to decide which level I want.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N5 · scene 5 · "its sandboxed run on a normal machine": the narration and the table ('its sandbox, as it ships, is untested on a normal macOS or Linux machine'): what is a normal machine, as opposed to what it was tested on? I guessed it was only tested in a cloud container or CI; it matters because I want to know whether it works on my own laptop.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N6 · scene 5 · "The flags and commands below are checked": the Codex row points to flags and commands 'below', but nothing below it on the frame shows any. I guessed it is copied from a doc that has a table under it; it matters because I can't tell what of Codex was actually checked.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N7 · scene 5 · "open work": a black chip beside the dotted box of untested agents. I guessed it means 'still to do, help wanted'; it matters because it reads like a button or a link, and doesn't say whether those agents work at all.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N8 · scene 6 · "this shot: a fresh Ubuntu machine, as the README says": which README, and what does it say: that reelplanner needs Ubuntu? Scene 5 just spoke of macOS or Linux. I guessed the README's install steps were run on Ubuntu for this screenshot; it matters because a Mac user can't tell whether these exact commands apply to them.
  - Answer: fixed: the note now says 'shot on a fresh Linux machine (Ubuntu 24.04)', so it no longer reads as the README asking for Ubuntu

- N9 · scene 7 · "patched ~/.agents/skills/media-use/…/tts.mjs": setup says it patched a file inside another tool's installed skills, and the narration never mentions it. I guessed reelplanner changes HyperFrames' voice script to use its local voice; it matters because changing another tool's files without saying why would worry me, and I'd want to know whether updating HyperFrames undoes it.
  - Answer: kept: the line is the real run's own output (D-303: the install is shown as it ran, on a fresh machine); setup patches HyperFrames' voice script so Kokoro takes the video's speed

- N10 · scene 7 · "sudo apt-get install -y ffmpeg": the narration lists a voice, a transcriber, a browser and HyperFrames' skills, but the frame also installs ffmpeg, with sudo. I guessed ffmpeg joins the voice and the frames into the video file; it matters because setup asking for my password is something I'd want to be told, and I don't know what ffmpeg is for or what setup does on a Mac instead of apt-get.
  - Answer: kept: the line is the real run's own output (D-303: the install is shown as it ran, on a fresh machine): on a new machine setup installs ffmpeg itself, with sudo, and prints the command

- N11 · scene 8 · "Done! Review skills before use; they run with full agent permissions.": the install ends on a warning, and the video moves on without a word about it. I guessed it is the skills installer's generic warning; it matters because a newcomer will ask whether they should read plan-to-video before using it, and what it is allowed to do.
  - Answer: kept: the skills installer's own last line, shown as it ran

- N12 · scene 9 · "a review sent while no session waits starts `claude`; --agent claude|codex|none picks another": the first time 'session' appears, and the first time I hear that a review can start my agent by itself; and what does 'none' do? I guessed 'session' is an open chat with the agent and 'none' means the review just waits; it matters because I'm picking this flag here, long before scene 27 says what happens to a review.
  - Answer: kept: the line is the real run's own output (D-303: the install is shown as it ran, on a fresh machine); scene 26 shows how a review reaches the agent when no session waits

- N13 · scene 9 · "names.md", "theme/", "decisions.json", "plans/": reel init writes these, and they're the only entries with no label. I guessed names.md overlaps glossary.md, theme/ is the videos' look, decisions.json is the log as data; it matters because 'decisions.json' next to 'decisions.md (the decision log)' makes me wonder which one is the log I read.
  - Answer: kept: the line is the real run's own output (D-303: the install is shown as it ran, on a fresh machine); the pins name the files the scene is about

- N14 · scene 11 · "At step 4's scene you click its marked thing": the example sits under '### Step 3' but talks about step 4's scene, and 'its marked thing' is new (nothing yet has said a scene can mark a thing). And with the chip 'as written, before question 2 was answered', the example already has the guide opening 'over the frame', which is option C. I guessed the example assumed an answer before you gave it; it matters because I can't tell whether step 3's example is wrong or the plan pre-picks the answer to its own question.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N15 · scene 11 · "STORYBOARD.md - guide: step-3#cases" and "index.html?project=<video>&t=102": these two rows are the only interface the video shows, and I can read neither: the storyboard isn't mentioned until scene 13, the review page until scene 15. I guessed a storyboard scene names its part of the guide, and the link opens the page at 1:42; it matters because the narration says every step has an interface, and this is my one example of what one is.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N16 · scene 12 · "0 failure(s), 0 warning(s)": what does reel check fail on, and what happens when it does? The narration says the plan must cite each rule or say why it replaces one, not what happens when it doesn't. I guessed the agent fixes the plan before making the video; it matters because I can't tell whether I would ever see a failing check, or a rule the plan replaced.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N17 · scene 13 · "narrate: voices the script": the agent writes BRIEF.md, STORYBOARD.md and the frames, but none of them is a script, so I can't tell where the script comes from; BRIEF.md isn't in the narration either. I guessed the script is the spoken lines inside STORYBOARD.md; it matters a little, as the one input the build reads that the frame doesn't show.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N18 · scene 14 · "Before you watch" and "scene 11 · … scene 10, just before": the example finding uses 'Before you watch', a name the video hasn't introduced, and talks of scenes 10 and 11 that aren't this video's scenes 10 and 11 (a login-page quick check and the plan). I guessed it's the card the review page shows first (from the glossary) and the numbers are an earlier build's; it matters because the example is there to show what an answer looks like, and I spend the scene decoding it instead.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N19 · scene 14 · "one reading order", "each name on its thing": the two frame rules float on the right with nothing pointing at them, and no designer finding is shown, only the newcomer's. I guessed 'each name on its thing' means a label sits on the thing it names; 'one reading order' I can't guess well (left to right? one path for the eye?); it matters because the narration gives them as the examples of the frame rules.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N20 · scene 15 · "4 choices to make, 5 quick checks, … 5 min" vs "Nothing needs you · Every video here is reviewed": the notification says 'The plan guide' is ready to review, but the page behind it says nothing waits on you and lists 'The plan guide · 28 Sep · approved'. I guessed the notification is from a day earlier than the page; it matters because the frame shows the same video waiting and done, and I can't tell what the page looks like when something really waits.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N21 · scene 15 · "4 choices to make": scene 1 called these 'four questions', and the glossary's 'choice' is something the agent decided alone while building. Here, and at scene 24 ('with your choices', '4 choices still open'), 'choice' means my answer to a plan's question. I guessed both are meant; it matters because by scene 31 'choice' is the agent's again, and scene 39 adds a third ('a choice: a new plan'), so I lose track of whose choice is meant.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N22 · scene 15 · "not on this page", "Plan | Built", "Guide": some approved videos say 'not on this page', others have a Plan/Built switch and a Guide button. I guessed 'not on this page' means its video files weren't kept, and 'Built' is the walkthrough video; it matters because I'd want to know why some reviewed videos can't be watched, and what Built opens.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N23 · scene 16 · "In a second repo": the 'repo one' box has no check marks, and the question says only the three machine commands were run. Did reel init run in repo one? I guessed yes; it matters because if it didn't, the 'second' repo is no different from the first and the question reads as a trick.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N24 · scene 19 · "reelplanning guide <plan-dir>", "reelplanning build": the plan text says 'reelplanning', while the video, its commands and the folder (scenes 6 and 9) all say 'reelplanner'. I guessed it's an older name; it matters because I'd type the wrong command, or think there are two tools.
  - Answer: kept: the picture is the plan guide's own page from September, whose record keeps the name it was written with (D-312), so a shot taken again shows it too; 'reelplanning' itself now has a meaning on hover and in Terms (the glossary's Other words: reelplanner's name until October 2026)

- N25 · scene 19 · "Plays the whole video · Play just the changes", "Trace ▲", "a comment on step 2, acted on by the revise step": the half-hidden page left of the plan text has buttons and a 'Trace' toggle nothing has explained, and its text is cut off mid-word. I guessed it's the guide, with a table of what happens to each kind of comment; it matters because the scene is about Terms, Ask and Plan, but its last moment shows an unexplained page and no Terms or Ask at all.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N26 · scene 23 · "same box as a mark": what is 'a mark'? The video said you can draw on a frame, but never named 'a mark' as a thing. I guessed a mark is a drawing on a frame, and this is the comment box that opens with it; it matters because the chip explains the box by a word I don't have.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N27 · scene 23 · "suggest an edit": the narration says you can leave a note, suggest an edit, or ask, but the box shown has only Ask and Save. I guessed an edit is a note worded a certain way; it matters because I wouldn't find how to suggest one, and scene 24's table treats 'A suggested edit' differently from a comment.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N28 · scene 23 · "reelplanning guide .reelplanning/plans/2026-09-28-plan-guide/video": the guide's command and path use '.reelplanning/', but scene 9 showed reel init writing '.reelplanner/'. I guessed the guide was made before a rename; it matters because this line has a Copy button, and what I copy names a folder and a command the video never showed me.
  - Answer: kept: the picture is the plan guide's own page from September, whose record keeps the name it was written with (D-312), so a shot taken again shows it too; 'reelplanning' itself now has a meaning on hover and in Terms (the glossary's Other words: reelplanner's name until October 2026)

- N29 · scene 24 · "4 choices still open — they stay questions in the plan.": I can approve without answering, and the questions stay. What does the agent build for an unanswered question: wait, take the recommended option, or decide alone? I guessed it takes the recommended one; it matters because Approve with 0/4 decided is right there, and I don't know what it commits me to.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N30 · scene 24 · "Do it yourself instead": an unexplained line under Send. I guessed it shows how to file the review by hand (scene 26's download); it matters because it's on the one screen where I decide how my review leaves.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N31 · scene 24 · "The plan goes ahead as it stands, with your choices.": the Approve card says the plan goes ahead as it stands, but the narration says Approve has the agent work my comments into the plan. I guessed both are true (comments applied, no new video); it matters because 'as it stands' sounds like my comments are dropped.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N32 · scene 26 · "Claude only": does it mean the hosted page needs a Claude (claude.ai) account, or that it only works for repos whose agent is Claude Code, not Codex? I guessed it's hosted on claude.ai; it matters because a Codex user can't tell whether this way is open to them.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N33 · scene 26 · "a review sent from that link: filed by reel-intake": the Send way goes on to 'the next scene', but the hosted way stops at reel-intake: who runs it, and how does my agent learn that a review arrived on claude.ai? Also 'reel-intake' is hyphenated where every other command is 'reel <word>'. I guessed the agent runs it when I tell it to; it matters because I'd send a review from my phone and not know whether anything picks it up.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N34 · scene 26 · "a download you hand it": what is downloaded, from where, and how do I hand it to the agent (paste a path in the chat? drop it in a folder?). I guessed Finish offers a file (annotations.json, from the glossary) and I tell the agent where it is; it matters because it's the way that works when nothing else does, and the frame gives no step.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N35 · scene 28 · "213 history: the agent's choices": scene 9 called the decision log 'every answer you give', but most of it here is the agent's choices. How do the agent's choices get into my decision log: when I accept them in a walkthrough? I guessed yes; it matters because the bar's biggest part is something I was told the log isn't.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N36 · scene 28 · "raised again only when a change rewrites their code": raised where, and to whom? I guessed reel check makes a plan mention an old choice of the agent's when the plan touches the code that choice made; it matters because 'history' vs 'rules' is the scene's point, and I can't say what 'raised again' does to a plan.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N37 · scene 28 · "you approve" (in the reel fold row): how do I approve the folded spec section: a review, a video, a yes in chat? The meaning given for reel fold says 'once the owner says yes', and 'owner' is never explained. I guessed a yes in chat from whoever owns the repo; it matters because it's the one step in that row that's mine.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N38 · scene 29 · "7 of 33 scenes changed" and the row of seven boxes with 3 and 6 marked: the boxes look like scenes, only two are marked, yet the banner says seven changed. I guessed the boxes are steps, or a cut-down sample; it matters because the scene is about how much you rewatch, and the picture gives two different counts.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N39 · scene 30 · "A black tab is drawn on it": all through this video, things are marked with black chips ('step', 'scene', 'cases', 'interface'), so option A looks right from what I have seen. I guessed those chips are the video's own drawing, not the player's; it matters because the check is about the player's ring, and the video's own style points the other way.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N40 · scene 31 · "one step's choices: at the fifth, the agent stops and asks you": how does that question reach me in the middle of a build: a new plan video, a notification, a chat message? And do the other steps go on while that one waits? I guessed the agent adds it to plan.md and a short plan video is made for it; it matters because it's the one time the build waits on me, and I don't know where to look.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N41 · scene 32 · "“0 failure(s)”: every ✗ answered": the findings file shows a ✗ on step 5, and the audit passes because it's 'answered'. Answered how, and by whom: fixed in the code, or a reason written by the agent? Do I ever see the answer? I guessed the agent writes a reply under each finding; it matters because a ✗ could be waved away by the same agent whose work was checked.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N42 · scene 32 · "7 own decision(s), 62 cited": what is a plan's 'own decision'? I guessed the decisions from this plan's own review (its answers), against 62 older ones it cites; it matters because it sits next to the agent's choices on screen and could mean either.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N43 · scene 34 · "D1 step 3 pauses an off-plan change always pauses [deviation]": the other rows have A-ids (the agent's choices), but the off-plan change is 'D1', and D- ids so far meant decision log entries (D-264, D-127). I guessed D stands for deviation; it matters because 'D1' reads as the first entry of my decision log.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N44 · scene 34 · "10 call(s) pause, in 4 stop beat(s) (one per step)": ten pausing choices but four stops: does one stop show several choices at once? The next scene says 'A pause shows the choice running', singular. I guessed each step's pausing choices share one stop; it matters because from the rule just given I'd expect ten pauses.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N45 · scene 38 · "This repo's own older plans still hold theirs, until its public history leaves them out": hold their what (guides, video files?), and what is 'its public history leaving them out': will history be rewritten? And is 'this repo' reelplanner's own or mine? I guessed reelplanner's own early plans still have committed video files that will be cut from its history later; it matters because it sounds like something will happen to a repo's history, and I can't tell whose.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N46 · scene 38 · "runs/", "terms-index.json", "walkthrough-video/", "names.md", "theme/": the listing names more than the narration covers. I guessed runs/ holds the real runs a walkthrough shows and terms-index.json is built for Terms; it matters because the scene's point is what is committed and what isn't, and I can't sort these.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N47 · scene 38 · "the voice" (built again, never committed): setup (scene 7) installed 'a voice'; here 'the voice' is built again and never committed. I guessed it means the spoken audio files; it matters because it reads as if the voice tool itself is rebuilt each time.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N48 · scene 39 · "frames to rebuild: 4 — The skill, and which agents · 5 — The tooling, once per machine · 25 — Handed on once, and fenced": these numbers don't match this video's scenes (the skill is scene 5, the tooling scene 6, handed on once scene 27), and the narration says 'scenes' where the output says 'frames'. I guessed frames are numbered differently from scenes; it matters because a newcomer checks the numbers against the video and finds them wrong.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N49 · scene 39 · "a small change: a one-step plan · a choice: a new plan": the narration's three sorts are 'fix the video, a small change, or a new plan'; on screen the third is 'a choice', a third meaning of 'choice' in this video. What makes my comment a small change rather than a new plan, and does a one-step plan get its own video? I guessed it's by size; it matters because it decides what my comment on this video turns into.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N50 · scene 41 · "pins its sources": what does pinning mean (fixed to a commit? a copy of the log?). I guessed it records exactly which version of each source the facts came from; it matters because 'every fact from a named source' is the explainer's promise, and 'pins' is the only word for how.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N51 · scene 41 · "Done · Explain more · Plan this": what does each do, and does pressing one leave anything in the decision log? I guessed Done ends it with nothing recorded, Explain more makes a new explainer, Plan this starts a plan from it; it matters because it's a review with no questions, and I don't know whether my comments on it go anywhere.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N52 · scene 44 · "You accept a walkthrough that adds a new part": who writes the scheduler into the parts and the glossary: does accepting the walkthrough do it, or the agent during the build? And does this video then rebuild by itself, or wait for someone to run spec-diff? I guessed the agent edits them in the build and spec-diff runs after; it matters because the right answer depends on a step the video never showed.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N53 · scene 45 · "a record that keeps everything": scene 38 just said the inbox, the guides, the voice and the video files are never committed. I guessed 'everything' means every answer and every review; it matters a little: it's the closing promise, and it says more than scene 38 did.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content
