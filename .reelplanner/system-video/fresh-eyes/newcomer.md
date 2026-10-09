# Fresh eyes: newcomer · round 2 · stamp 62a0dd40efaf

- N1 · scene 1 · "The plan guide: the video first, and a full page behind it you can read, check and edit": the example plan's title and step titles ('The guide: a page for each plan', 'The video and the guide point at each other') talk about "the video" and "the guide" before the narration has said reelplanner makes videos at all. I guessed it is reelplanner's own plan for one of its features, but in the first ten seconds it reads as if the plan is describing the tool, and I couldn't tell whether "the guide" is something I'm meant to know already.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N2 · scene 2 · "an example plan's video: an upload that resumes": the narration says reelplanner turns "that plan" into a video, meaning scene 1's plan (five steps, four questions), but the frame shows a different plan (an upload that resumes, three steps, one question 'Postgres, or S3?'). I guessed it is a smaller stand-in, but nothing says so, and a newcomer wonders why scene 1's plan isn't the one shown.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N3 · scene 2 · "The ending · every answer on its step": I couldn't tell what this last card is. My guess: every video ends with a recap scene listing my answers step by step. Does every video have one? ('the manifest' and 'the sweeper' are never explained either; I took them as made-up example content.)
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N4 · scene 4 · "just the video: no guide, no record": scene 2 had just said the rest of the plan goes on a page under the video, the guide. Here level 1 has "no guide". So does a basic plan video come with a guide or not? "no record" also comes before anything has said what the record is (scene 6 is the first to say reel "keeps the project's record"). I guessed the record means the decision log and the saved reviews.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N5 · scene 4 · "you pick: each level is optional": if level 1 is optional too, what is the least I can use? The "+" makes the levels look stacked, so can I take a walkthrough (level 2) without a plan video, or after an explainer, which has no build?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N6 · scene 5 · "not yet its sandboxed run on a normal machine": nothing has said yet what a sandboxed (or headless) run is; that comes at scene 27. The frame adds 'the headless review run', 'a system-video review', 'the hosted review page' and 'as it ships', none of them shown yet. What is a "normal" machine, as against the one it was tested on? I guessed the author's machine has a special setup. A newcomer's practical question: will the part that runs while I'm away work, safely, on my Mac?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N7 · scene 5 · "The flags and commands below are checked" / "open work": "below" points at nothing on the frame (the rows below are other agents), so which flags and commands? The "open work" tag beside the untested rows: is it the project's to-do list, an invitation to contribute, or a warning not to use those agents?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N8 · scene 6 · "reelplanner and reel: two commands": the narration says what `reel` does (keeps the project's record) but not what `reelplanner` itself is for, or how I'd know which of the two to type. I guessed reelplanner makes and serves the videos (setup, build, review, explain) and reel handles plans, reviews and decisions. The frame also shows '.reelplanner/ directory' three scenes before it is explained.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N9 · scene 7 · "sudo apt-get install -y ffmpeg": the only line on the frame with no label. What is ffmpeg for, and will setup ask for my password (sudo)? The frame is Linux, so what happens on a Mac? This matters before I run the command.
  - Answer: kept: the line is the real run's own output (D-303: the install is shown as it ran, on a fresh machine): on a new machine setup installs ffmpeg itself, with sudo, and prints the command

- N10 · scene 7 · "patched ~/.agents/skills/media-use/…/tts.mjs" / "HyperFrames' skills": setup edits a file that belongs to another skill in my home folder, and nothing says why. Why does reelplanner install another project's skills into ~/.agents/skills, and do all my agents get them? I guessed the agent needs HyperFrames' instructions to write the frames, and the patch switches in the local voice.
  - Answer: kept: the line is the real run's own output (D-303: the install is shown as it ran, on a fresh machine); setup patches HyperFrames' voice script so Kokoro takes the video's speed

- N11 · scene 8 · "universal: Pi, Amp, … +16 more" / "symlinked: AiderDesk, … +50 more": the narration says the command "copies" the skill. The frame says some copies are symlinked and that it installs into about 70 agents, though scene 5 said only Claude Code is tested. What do "universal" and "symlinked" mean, and does it put the skill into agents I don't have or use?
  - Answer: kept: the skills installer's own lines, shown as it ran

- N12 · scene 8 · "Review skills before use; they run with full agent permissions.": the narration passes over this warning on screen. What permissions does the plan-to-video skill use, and should I read it before going on? A newcomer would want one sentence saying whether this is safe.
  - Answer: kept: the skills installer's own last line, shown as it ran

- N13 · scene 9 · "a review sent while no session waits starts `claude`" / "when a review arrives": this is the first use of "session" (it comes back in scenes 15, 24, 27 and 41), and the video never says what one is. I guessed it means a chat with my agent open in a terminal. "A review arrives" from where? The review page hasn't been shown yet. An agent starting itself while I'm away is a big deal for a newcomer: what can it do then? Scene 27 answers that, but nothing here points ahead to it.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N14 · scene 9 · "names.md", "theme/", "decisions.json", "README.md", "plans/": these files have no labels, while the files beside them do. Why are there two decision files (decisions.json and decisions.md, with only .md labelled "the decision log")? What is names.md, next to glossary.md ("its words")? What is theme/? And "brownfield: code that exists": what is the other kind, and what changes with it?
  - Answer: kept: the line is the real run's own output (D-303: the install is shown as it ran, on a fresh machine); the pins name the files the scene is about

- N15 · scene 11 · "You click the marked thing on a scene" / "Open the full guide" / "STORYBOARD.md · guide: step-3#cases" / "review page index.html?project=<video>&t=102" / "Over the frame, like a detail": the example step comes from reelplanner's own plan, so its cases, interface and example are all about review-page features the video hasn't shown yet (marked things come at scene 22, the storyboard at 13, the review page at 15, and a "detail" never). I couldn't follow the example, so the scene's point, what a case, an interface and an example look like, got lost. Also "as written, before question 2 was answered": the example already has the guide opening "over the frame" (option C). Was it changed after the answer, or does the example take one option for granted?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N16 · scene 12 · "or say why it replaces one": a plan can replace one of my earlier answers just by giving a reason. Am I asked (a question in the video), or can the agent overturn my answer on its own and only explain why? It's the first thing I'd ask, because it decides whether my answers really bind.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N17 · scene 12 · "rules" / "touches [player]": scene 3 said answers become "decisions". Here they are "rules", and the box says "Your answers". I guessed rules are decisions still in force, but that isn't said until scene 28. "[player]" is the id of a part not shown yet (the review player comes at scene 17). And from "0 failure(s), 0 warning(s)": what would make reel check fail?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N18 · scene 13 · "voices the script": the agent writes a brief, a storyboard and the frames, and none of them is a script. So what script does narrate voice, and who writes it? I guessed the narration lines live in STORYBOARD.md.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N19 · scene 13 · "since the last build" / "reelplanner build": "build" here means building the video, but scenes 3, 4 and 10 used "the build" for the agent building the code. When a later scene says "the build", which one is it? Scene 10's "the build · done" now reads both ways.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N20 · scene 14 · "N2 · scene 1 · plan.md, as first written…" / "N4 · scene 11 · Before you watch … scene 10, just before, says it comes before the first play": the example findings quote scene numbers and lines from an earlier build that don't match this video's scenes 1, 10 and 11 (this scene 10 is a quick check about a login page), so they read as findings about something I didn't watch. The narration never says "Before you watch". "round 1": how many rounds happen before I see a video?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N21 · scene 14 · "given a meaning" / "kept with a reason": what does "given a meaning" do: add the word to the glossary, or to the Terms panel? The frame shows only "fixed" and "kept". And are kept findings, with their reasons, shown to me before I watch? The narration doesn't say, yet scene 25's quick check asks exactly what happens before the review page opens.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N22 · scene 15 · "Nothing needs you · Every video here is reviewed" beside the notification 'The plan guide … 4 choices to make, 5 quick checks, … 5 min': the notification says a video is ready for review, but the list says nothing is waiting and The plan guide was "approved" on 28 Sep. So is a video waiting or not? I guessed the notification is an old one, but the frame shows both at the same moment.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N23 · scene 15 · "4 choices to make": scene 1 called these four "questions" for me, while the glossary (and scene 31) uses "choice" for a call the agent made on its own. Are "choices to make" my questions or the agent's choices? The same clash comes back at scene 24 ('4 choices still open').
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N24 · scene 15 · "Plan / Built" / "Guide" / "not on this page" / "Earlier plans (12)": the list's controls are never explained. I guessed Plan is the plan video and Built is the walkthrough video. Why are some approved videos "not on this page", and where are they? And how do I open the review page in the first place: a URL, or a click on the notification?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N25 · scene 16 · "So in a second repo" (frame: 'repo one', 'repo two'): the question says what has run on the laptop, but not whether repo one ever had `reel init`, and the picture shows repo one with no ticks. Why a "second" repo? The wording suggests something happened in repo one that the question doesn't say.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N26 · scene 19 · "Play just the changes" / "Trace ▲" / "Independent." / "plan map" / "D-167": none of these is explained by this point. Playing only the changed scenes comes at 29 and decision ids at 28; Trace, "Independent." and "plan map" are never explained. The left panel is cut off mid-word ('…ox?" on the line of step 2's check…', '…d files it with the review in …d>.md; no decision-log entry'), so I can't read what it says.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N27 · scene 23 · "suggest an edit": the selection box shows a note, Ask and Save, and I see no way to suggest an edit. How is a suggested edit different from a note, and where is the control for it?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N28 · scene 23 · "same box as a mark": the narration never says "mark". Scene 17 said "Draw on a frame", and the player has a 'Mark D' button. I guessed a mark is a comment pinned to a spot on the frame, and that this label means notes on the guide and on the video are the same kind of comment.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N29 · scene 23 · "A video's guide · A plan folder, both videos, checked · A plan with no video yet": these look like the guide page's own tabs. My guess is that they are the cases of one step, one per tab. Here a newcomer can't tell the guide's own controls from the plan's content (also 'INPUT', 'WHAT HAPPENS', 'Copy').
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N30 · scene 24 · "4 choices still open — they stay questions in the plan.": so I can approve with every question unanswered. Then what happens: does the agent build with the questions open, take the recommended option, or ask me again later? It is the most practical question on the screen, and nothing answers it.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N31 · scene 24 · "Do it yourself instead": not explained. I guessed it shows a command for filing the review by hand. When would I need it?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N32 · scene 24 · "Record · 5 steps · 0/4 decided · 1 comment": this bar is called "Record", the same word scene 6 used for "the project's record" that reel keeps. Is it the same record? I guessed it is only this review's running tally.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N33 · scene 26 · "Claude only": does the hosted page work only when my agent is Claude Code, or does it mean the page lives on claude.ai and needs a Claude account? What does a Codex user do?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N34 · scene 26 · "a review sent from that link: filed by reel-intake": who runs reel-intake, and when? A review sent from a web link isn't on my machine, so how does it reach my repo or my agent, and am I told when it arrives? It seems to skip the review server and the inbox shown at scene 27.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N35 · scene 26 · "a download you hand it": what download is this, where is its button and what file does it give? How do I "hand it" to the agent: paste the path, or drop the file into the chat? When would I choose this over Send?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N36 · scene 28 · "back only when a change rewrites their code" (frame: 'raised again only when a change rewrites their code'): back where, and to whom? Does the old choice come back to me as a question in the new plan's video, or only to the agent through reel check? The narration also never mentions the bar's '31 not in force'; I guessed those are my answers that later answers replaced.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N37 · scene 28 · "you approve" (the reel fold row): how do I approve a folded spec section: in a video, on the review page, or in chat? Once the rules are folded, are the 26 separate answers gone from view, or still in the log?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N38 · scene 29 · "7 of 33 scenes changed": the boxes below show scenes 1–7 with only 3 and 6 marked. Is it seven changed scenes or two? The two numbers on one frame don't agree for a newcomer.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N39 · scene 29 · "Approved: … no new video": do I get to see how my comments were worked into plan.md before the agent starts building, or does the build begin straight away?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N40 · scene 29 · "this stage: the revise step": on this same frame "step" means a numbered part of a plan ('your comment on step 3'), and here it is also a stage of the loop (scene 31 does the same with 'the implement step'). One word for two things on one frame.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N41 · scene 30 · "A black tab is drawn on it": all through the video, frames put black tags on things ('step', 'scene', 'the basic unit', 'cases', 'interface', 'example', 'no new video'), and nothing says what they mean. So option A looks as likely as B: a newcomer can't tell whether a black tag means "this leads to the guide".
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N42 · scene 31 · "the agent stops and asks you": how does that question reach me: a new plan video, a notification, or the chat? Does the rest of the build go on while that step waits, and do the step's first four choices stand?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N43 · scene 31 · "| check |" (the choices table's last column) and the cut-off rows: the column that holds the labels is headed "check", a word the video already uses for quick checks, reel check and the code check. Every row is also cut off mid-sentence ('The blocks are required of a plan whose folder is dated …', 'A scene opens a part with `- guide: <part>[#<place>]`: …'), so I can't see what any choice was or why it got its label.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N44 · scene 32 · "every finding is answered" (frame: 'every ✗ answered'): answered by whom, and how: the agent fixing the code, or writing a reason? Do I ever see the findings and their answers, for example in the walkthrough?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N45 · scene 32 · "7 own decision(s), 62 cited": what is an "own decision", as against a cited one? I guessed own decisions are this plan's answered questions and cited ones are earlier decisions it names.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N46 · scene 34 · "D1 step 3 pauses … [deviation]": "D1" looks like a decision-log id (scene 28's D-264), but here it names an off-plan change. Is an off-plan change a decision? Two different kinds of thing share the "D" prefix.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N47 · scene 34 · "10 call(s) pause, in 4 stop beat(s) (one per step)": the narration says each such choice pauses the video, but this line groups ten pausing choices into four stops. Does the walkthrough pause ten times or four? "stop beat" is never explained (the glossary only says a beat is a scene). And "a recent late fix": how recent counts as recent?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N48 · scene 38 · "This repo's own older plans still hold theirs, until its public history leaves them out.": does "theirs" mean their guides and video files? Does "its public history leaves them out" mean the repo's history will be rewritten? Does any of this affect my repo, or is it a note about this one project? I couldn't follow it.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N49 · scene 38 · "on your machine, never committed: the inbox" / "built again, never committed: each video's guide/, the voice, the finished video files": none of these appears in the listing beside the labels (they sit next to system.json, terms-index.json and theme/), so I can't tell where the inbox or the built files live. The listing's 'runs/', 'code-check/', 'walkthrough-video/', 'terms-index.json' and 'system-video/' are new and have no labels.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N50 · scene 38 · "the voice … never committed": if the voice and the video files aren't committed, does a teammate who clones the repo have to rebuild (and re-voice) every video before watching it? Do they need setup on their machine for that?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N51 · scene 39 · "frames to rebuild: 4 — The skill, and which agents … 5 — The tooling, once per machine … 25 — Handed on once, and fenced": those numbers don't match this video's scenes (here the skill and agents scene is 5, the tooling is 6, handed on once is 27), and the output says "frames" where the narration says "scenes". Also 'cost: 36 of 43 lines' (43 lines for 45 scenes?), '~Install, ~Parts, ~Pipelines' (what does ~ mean?) and '33dd648 (the system video's last commit, overridden by --since)'. I guessed the output comes from an older build of this video.
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N52 · scene 39 · "a small change: a one-step plan" / "a choice: a new plan": both end up as plans, so what is the difference? Who decides which kind my comment is, and can my comment become a new plan without my agreeing?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N53 · scene 39 · "every word, with a scene that explains it": the glossary I can open has words like Squash, CSS, npx, Plan mode and TTS that no scene I watched explains. Is it every word, or only every word about the system?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N54 · scene 41 · "pins its sources": what does pinning do: freeze the branch at one commit, so the explainer doesn't change when the branch moves on? If I ask for an explainer on Monday and watch it on Friday, which code does it show?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N55 · scene 41 · "Done, Explain more, or Plan this": the narration names the three endings but not what each one does. Does Explain more make a second explainer, and about what? Does Plan this start a plan (plan.md and a plan video) from it? Does Done, or a comment I leave, go into the decision log?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content

- N56 · scene 44 · "A walkthrough you accept adds a new part": accepting a walkthrough doesn't add a part; the build does. Who adds the part to system.json and the glossary, and when? Scene 39 said spec-diff names scenes to rebuild, but never that a new part gets a new scene. So in option B ('one explains the scheduler'), is that a new scene or an old one rebuilt? And does the rebuild start by itself once I accept, or does it need a plan?
  - Answer: kept: this rebuild renames the tool and shoots the install again (D-312); the scene's words and layout are as build 9 left them, and this goes to the next pass on the video's content
