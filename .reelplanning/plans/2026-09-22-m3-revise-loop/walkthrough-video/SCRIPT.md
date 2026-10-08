# SCRIPT — the revise-loop walkthrough (ten parts: round 1, then round 2 added after it)

**Voice:** am_michael (Kokoro, local; synthesised at speed 1.25)
**Voice settings:** default
**Voice direction:** Plain and even. The agent that built the plan, reporting to the owner who approved it: what landed per track and step, each call it made on its own in one sentence with the other way and why, what is still pending. No hedging, no flourish.

---

## Line 1 — What landed, by track (Frame 1)

**Delivery:** Plain.

    What landed, by track. Cheap rebuilds: step one, done. The loop runs itself: steps two and three, done, with one deviation. A reviewable system video: step four, done. Step five is half done: the Action is removed, and one of two real reviews is proven.

## Line 2 — Step 1: narrate only the lines that changed (Frame 2)

**Delivery:** Plain.

    Step one is a new command, narrate. Each line's audio and timings are kept under a key of its text, voice, speed and model; only changed lines are voiced. One edited line took thirty-two seconds, not six hundred seventy-five.

## Line 3 — Call A1: the kept audio is committed (Frame 3)

**Delivery:** Plain.

    The kept audio is the committed voice files, indexed by a committed record, rather than a gitignored cache. A cloud session starts from a fresh clone, where that cache is empty.

## Line 4 — Call A2: the key names the voice and whisper models (Frame 4)

**Delivery:** Plain.

    The key's model is the voice model plus the whisper model, rather than the HyperFrames version. An upgrade that keeps the same voice should not re-narrate every video.

## Line 5 — Call A3: an older video is adopted from git (Frame 5)

**Delivery:** Plain.

    A video narrated before the record existed is adopted from git, rather than narrated again: the commit that wrote its voice files says what they were made from.

## Line 6 — Call A4: the cost counts lines already edited (Frame 6)

**Delivery:** Plain.

    The cost prints first: lines to narrate, and about how long. It counts lines already edited, not only the frames spec-diff names. The runs behind the estimate are one click away.

## Line 7 — Next: part 2 (Frame 7)

**Delivery:** Plain.

    Next, part two: the loop runs itself.

## Line 8 — Part 2 of 5 (Frame 8)

**Delivery:** Plain.

    Part two of five. Rebuilds are reported. Now the loop runs itself.

## Line 9 — Step 2: background workers, and a notification (Frame 9)

**Delivery:** Plain.

    Step two. The main session hands every long job to a background worker and stays free. When a review page is up, reelplanning sends a notification saying what waits: here, seventeen calls to accept or flag.

## Line 10 — Call A5: notified when the page is up (Frame 10)

**Delivery:** Plain.

    The notification fires once the page is up and its address is known, rather than when verify passes. Verify knows no address, and runs again while findings are fixed.

## Line 11 — Step 3: Send reaches the session, or starts one (Frame 11)

**Delivery:** Plain.

    Step three needs step two. Send on the local page posts the review to the review server, into its inbox. A waiting session takes it; with none, the server starts claude dash p; with no server, the next session does.

## Line 12 — Call A6: the inbox is not committed (Frame 12)

**Delivery:** Plain.

    The inbox is gitignored, not committed. A review is untrusted until intake checks it, and a committed one would let a push look like a new review.

## Line 13 — Call A7: a waiting session is a fresh heartbeat (Frame 13)

**Delivery:** Plain.

    A session counts as waiting while its heartbeat file is under ten seconds old and its process lives, rather than a lock file. A killed session's heartbeat just ages out.

## Line 14 — Call A8: the server looks again after 15 s (Frame 14)

**Delivery:** Plain.

    With a session waiting, the server leaves it the review, then looks again after fifteen seconds. Still unclaimed, it starts the headless run, so a dying session strands nothing.

## Line 15 — Next: part 3 (Frame 15)

**Delivery:** Plain.

    Next, part three: the rules around the server, and one deviation.

## Line 16 — Part 3 of 5 (Frame 16)

**Delivery:** Plain.

    Part three of five. Send reaches a session. Now the rules around it.

## Line 17 — Call A9: one claim file, one handler (Frame 17)

**Delivery:** Plain.

    Each review is handled once: whoever creates its claim file first wins, rather than a lock in the server's memory. The file survives a restart, and the loser does nothing.

## Line 18 — Call A10: the endpoint takes JSON from this machine only (Frame 18)

**Delivery:** Plain.

    The endpoint takes only JSON, from this machine's own address, with no foreign origin, up to five megabytes. It can start an agent, so another tab's page must not reach it.

## Line 19 — Call A11: claude -p, with no permission flags (Frame 19)

**Delivery:** Plain.

    The setting was claude dash p, with no permission flags, since how much a headless run may do is your call. The real run showed the cost: a bare claude dash p is denied every edit, so the flags are in now.

## Line 20 — Call A15: the page posts only to its own server (Frame 20)

**Delivery:** Plain.

    The page posts only when the review server marked it as its own and answered; otherwise the download stays. The Finish panel's three lines are there to try.

## Line 21 — Deviation: the hosted page's hook is written down, not built (Frame 21)

**Delivery:** Plain.

    One deviation, said plainly: step three's hook for the hosted page is not built. The skill tells the agent to register one where its harness allows, and to check submitted rows at session start.

## Line 22 — Quick check: Send twice (Frame 22)

**Delivery:** Plain.

    Quick check. You press Send twice on the same review. How many runs start?

## Line 23 — Next: part 4 (Frame 23)

**Delivery:** Plain.

    Next, part four: the system video, and playing just the changes.

## Line 24 — Part 4 of 5 (Frame 24)

**Delivery:** Plain.

    Part four of five. The loop is reported. Now the system video.

## Line 25 — Step 4: a system-video review changes the system (Frame 25)

**Delivery:** Plain.

    Step four. A system-video review now goes through intake like a plan's. A real comment on frame eight was filed with that frame's spec section and its four parts, and sorted as: fix the video.

## Line 26 — Call A12: intake checks a system-video review (Frame 26)

**Delivery:** Plain.

    Intake checks a system-video review, rather than believing its path: the folder, a storyboard marked system, and every mark on that video's own frames.

## Line 27 — Call A13: the first sort is a keyword hint (Frame 27)

**Delivery:** Plain.

    The first sort is a keyword hint, rather than a model call: rewinds mean fix the video; a choice word, or two parts or more, means a plan. I decide each.

## Line 28 — Call A14: a small change gets a one-step plan (Frame 28)

**Delivery:** Plain.

    A small change is shown in a one-step plan with its own walkthrough, rather than a walkthrough with no plan: the ledger and the library hang off a plan folder.

## Line 29 — Asked in the review: play just the changes (Frame 29)

**Delivery:** Plain.

    Not in the plan: you asked for it in the review. After a rebuild, the player plays just the changes, with one button for the whole video. A seek to an unchanged beat still plays it.

## Line 30 — Call A16: just the changes, for any revision not yet sent (Frame 30)

**Delivery:** Plain.

    Just the changes is on for any revision you have not already sent a review of, rather than only after a sent round: a reviewer who downloaded still wants the changes.

## Line 31 — Next: part 5 (Frame 31)

**Delivery:** Plain.

    Next, the last part: step five, the code check, and what is still to come.

## Line 32 — Part 5 of 5 (Frame 32)

**Delivery:** Plain.

    Part five of five. Four steps are reported. Now step five, and the checks.

## Line 33 — Step 5: the Action is removed; one real review is proven (Frame 33)

**Delivery:** Plain.

    Step five needs all four. The Action is gone, with its template and install. A real review, with no session open, started claude dash p: nine minutes thirteen from Finish to the notification. The second is your Finish on this one.

## Line 34 — 60 calls: the plan left too much open (Frame 34)

**Delivery:** Plain.

    Said plainly: the workers made sixty calls the plan did not, five times the dozen the rules allow. The plan left too much open: where narration is kept, who wins a review, how a system review is filed.

## Line 35 — The code check: two gaps, five problems (Frame 35)

**Delivery:** Plain.

    A fresh agent checked the code against the plan: two step gaps, and five real problems. Four were bugs, each now fixed with a test; one: a second system-video review would overwrite the first. The findings and answers are one click away.

## Line 36 — Quick check: two reviews back to back (Frame 36)

**Delivery:** Plain.

    Quick check. Two system-video reviews arrive back to back. What happens to the first one's answers?

## Line 37 — What ran (Frame 37)

**Delivery:** Plain.

    What ran: this plan's five spec files pass; the full suite was not run again. A real post woke a waiting session, and a real review, with no session open, started claude dash p.

## Line 38 — Still to come, and your call (Frame 38)

**Delivery:** Plain.

    Still to come: the second timed review, which is your Finish on this video. Re-timing the frames took three and a half of the nine minutes, by hand, and is not fixed. Flag a call, or accept.

## Line 39 — Round 2: what your review asked for (Frame 39)

**Delivery:** Plain.

    Round two. Your review of round one asked what a run nobody is watching may do, and the plan grew five steps: six to ten.

## Line 40 — Four decisions: D-082 to D-085 (Frame 40)

**Delivery:** Plain.

    You decided four questions. A run nobody is watching runs in auto mode, inside the sandbox. A quick check per step, plus wherever there is something to predict. Tagged calls stop, and your record decides which tags fade. And the text and the files are trimmed.

## Line 41 — What landed in round 2 (Frame 41)

**Delivery:** Plain.

    Steps six to nine are built, in four commits, and step ten waits for the next plan. The build made sixteen calls the plan did not, and four deviations. Twelve calls and every deviation stop for you; the other four calls share a sheet at the end of their part.

## Line 42 — Next: part 7 (Frame 42)

**Delivery:** Plain.

    Next, part seven: step six, the run nobody is watching.

## Line 43 — Part 7: step 6 (Frame 43)

**Delivery:** Plain.

    Part seven: step six, what a run nobody is watching may do.

## Line 44 — Step 6: auto mode, inside the sandbox; the file tools fenced too (Frame 44)

**Delivery:** Plain.

    Step six. The run nobody is watching is Claude Code in auto mode, in its sandbox: a classifier approves each action, and anything that would prompt is refused. Shell writes stay in the repo, and since your review, a hook keeps the file tools there too. Tried for real: a write in the repo went through; writes to the temp folder, to your home folder, and from a subagent were refused.

## Line 45 — Quick check: a write outside the repo (Frame 45)

**Delivery:** Plain.

    Quick check. The run writes a file outside the repo with its file tool, not the shell. What happens?

## Line 46 — Step 6: its three limits, as you decided (Frame 46)

**Delivery:** Plain.

    You decided each limit the proof found. The file tools, at your request, are now fenced too, by that hook. Git commit runs outside the sandbox, so commits stay signed. Where the strict sandbox cannot start, no run starts, and a review waits for a session. Codex and opencode commands skip that check; the reference's Other agents section says what is Claude Code's alone.

## Line 47 — Deviation: the proof ran on a weaker sandbox (Frame 47)

**Delivery:** Plain.

    One deviation, said plainly: the proof ran on a weaker sandbox than the one that ships. This container runs as root, where the strict sandbox leaves the run no working shell. The shipped setting is untested on a normal machine.

## Line 48 — Call A17: the sandbox settings are in the command (Frame 48)

**Delivery:** Plain.

    The sandbox settings sit inline in the command, rather than in a committed Claude settings file: only the run nobody is watching is fenced, not every session in the repo.

## Line 49 — Call A18: no sandbox, no run, and now it says so (Frame 49)

**Delivery:** Plain.

    Where the sandbox cannot run, such as native Windows or Linux without bubblewrap, there is no headless run at all, rather than one that runs unfenced with a warning. As you asked, that is now said: in a note in the README, and in one line when the review server starts: unattended runs are off on this machine, and why.

## Line 50 — Call A19: nothing runs outside the fence (Frame 50)

**Delivery:** Plain.

    Nothing runs outside the fence, rather than letting the classifier approve a retry outside it. Otherwise the fence is only advice. The one exception is now git commit, so signed commits work: your answer, built since.

## Line 51 — Call A20: the server says when the run ends (Frame 51)

**Delivery:** Plain.

    The review server tells you when the run it started ends: ready, or stopped, with its log. Before, the run notified itself, but a sandboxed run cannot reach the server: the first real one sent a dead link.

## Line 52 — Deviation D2: Codex's flag (Frame 52)

**Delivery:** Plain.

    A small deviation: the note names Codex's equivalent as its workspace-write sandbox, not the plan's full-auto flag, which is deprecated and prints a warning. Like the plan's, it is untested. Codex's own auto and approval modes wait, as you said, until a Codex agent works on this.

## Line 53 — Deviation D3: no list of allowed hosts (Frame 53)

**Delivery:** Plain.

    And one more: no list of allowed hosts, rather than the plan's network to named hosts. In auto mode the classifier reviews each host a command names; a list needs upkeep. The sandbox's network was not tested here.

## Line 54 — Next: part 8 (Frame 54)

**Delivery:** Plain.

    Next, part eight: more quick checks, and fewer stops.

## Line 55 — Part 8: steps 7 and 8 (Frame 55)

**Delivery:** Plain.

    Part eight: step seven, more quick checks, and step eight, fewer stops.

## Line 56 — Step 7: a quick check per step, and a wrong answer is a comment (Frame 56)

**Delivery:** Plain.

    Step seven is about quick checks. Every step gets at least one, plus one wherever you could guess wrong. Answer one wrong, and the player asks how you expected it to work; your words reach me as a comment on that step. Your answer at step six did just that: you expected the file tools kept in the repo, so now they are.

## Line 57 — Quick check: a wrong answer with a note (Frame 57)

**Delivery:** Plain.

    Quick check. You answer a check wrong, and type how you expected it to work. What happens to your words?

## Line 58 — Step 8: tagged calls stop (Frame 58)

**Delivery:** Plain.

    Step eight. Each call now carries tags: visible, hard to undo, close, or deviation. A deviation always stops. An untagged call never does: it joins one sheet at the end of its part. A tagged call stops, and your record in the ledger decides which tags fade.

## Line 59 — Quick check: a tag accepted ten times (Frame 59)

**Delivery:** Plain.

    Quick check. Your last ten calls tagged visible were all accepted. The next call is tagged only visible. What happens to it?

## Line 60 — Call A22: every verdict goes in the ledger (Frame 60)

**Delivery:** Plain.

    The ledger now keeps every verdict, flags and your own words included, and a new verdict on a call replaces its earlier accept, rather than keeping only accepted calls. The stop rule needs the flags.

## Line 61 — Call A24: the grouped sheet (Frame 61)

**Delivery:** Plain.

    On the grouped sheet, each call has its own Flag, and one Accept all, with no box for your own words, rather than words and a key per call. Accept all takes only the calls you have not flagged: flag A21, press Accept all, and A23 is accepted while A21 stays flagged. A comment still works.

## Line 62 — Quick check: flag one, then Accept all (Frame 62)

**Delivery:** Plain.

    Quick check. On that sheet you flag A21, then press Accept all. What happens to A21?

## Line 63 — Step 8's other calls: A21 and A23 (Frame 63)

**Delivery:** Plain.

    Two more calls from step eight don't stop: where a call's tags are written, and how a run of accepts is counted. They share one sheet.

## Line 64 — Next: part 9 (Frame 64)

**Delivery:** Plain.

    Next, part nine: step nine, less scaffolding.

## Line 65 — Part 9: step 9 (Frame 65)

**Delivery:** Plain.

    Part nine: step nine, less scaffolding.

## Line 66 — Step 9: half the text, one build, each review its own file (Frame 66)

**Delivery:** Plain.

    Step nine trims the text and the files. The skill and the style guide are each about half as long, with the history moved to design notes. One command, build, runs narration through verify. And each review gets its own file, named by its time: a second review goes beside the first, never over it.

## Line 67 — Quick check: a second review of the same plan (Frame 67)

**Delivery:** Plain.

    Quick check. You send a second review of the same plan. Where is it filed?

## Line 68 — Call A25: one layout for reviews, migrated (Frame 68)

**Delivery:** Plain.

    Reviews are filed by kind and time, each with a short note beside it, and a migrate command moved all six plans to that layout, rather than reading both layouts. Other repos get the same path.

## Line 69 — Call A26: two resolve commands deleted (Frame 69)

**Delivery:** Plain.

    The resolve-plan and resolve-walkthrough commands are deleted, rather than kept, since the resolved copies are gone. The two scope commands stay, printing JSON: the sorting is still used.

## Line 70 — Call A29: this checkout's tooling, in this repo (Frame 70)

**Delivery:** Plain.

    This repo's instructions for agents tell one working here to run this checkout's own tooling, rather than the published version. You asked if that is local against npx: yes, and both work. Outside this repo, the published package; inside it, this checkout's tools, so a plan here is built with the code it changes. No change.

## Line 71 — Call A30: a detail's kind is a free word (Frame 71)

**Delivery:** Plain.

    A detail's kind is now a free word, and a kind with no template starts from the blank page, rather than a closed list of seven. The kinds were a starting point, not a rule.

## Line 72 — Call A31: two details on one beat warn (Frame 72)

**Delivery:** Plain.

    Two details on one beat now warn, instead of failing the build, and the last one opens. A second detail is a slip, not a broken page. The code check found this call; it is logged now.

## Line 73 — Call A32: no kind, the blank page (Frame 73)

**Delivery:** Plain.

    And detail new with no kind starts from the blank page, rather than requiring a template. The guide still says to start from a template when one fits.

## Line 74 — Step 9's other calls: A27 and A28 (Frame 74)

**Delivery:** Plain.

    Two more from step nine don't stop: what build retimes against before a commit, and one budget for on-screen words. They share one sheet.

## Line 75 — Next: part 10 (Frame 75)

**Delivery:** Plain.

    Next, the last part: the code check, and what is not done.

## Line 76 — Part 10: the code check, and what is not done (Frame 76)

**Delivery:** Plain.

    Part ten, the last: what the code check found in round two, and what is not done.

## Line 77 — Round 2's code check: three gaps, two calls, one bug (Frame 77)

**Delivery:** Plain.

    A fresh agent checked round two. Steps one to four and seven to nine carried, and all eleven decisions hold. It found three step gaps, two calls I had not logged, now A31 and A32, and one bug in migrate-reviews, now fixed with a test.

## Line 78 — Deviation: one of step 5's two real reviews is still owed (Frame 78)

**Delivery:** Plain.

    One deviation carried from step five: only the system video's review has been through a headless run. A review of a plan's walkthrough has not; the next one you send from the local page will be it.

## Line 79 — Not done (Frame 79)

**Delivery:** Plain.

    Not done. Step ten waits for the next plan, the Bob Dylan site redone from scratch. The strict sandbox is untested on a normal machine. The new hook fences Claude Code's own file tools, not an MCP server that writes files. Codex and opencode have not run; only a stand-in has. And a headless run uses the published tool, older than this code.

## Line 80 — What Accept means now (Frame 80)

**Delivery:** Plain.

    Asked in your review: what accepting means now. Approve with comments, and they go into the plan or the fix, with no new video. Request changes, as you did, and the fixes are made, the beats they touch rebuilt, and shown again: these beats. And three errors in your review's summary are fixed.

## Line 81 — Round 2: built, and your call (Frame 81)

**Delivery:** Plain.

    Round two is built: steps six to nine, with the full test suite passing, and step ten waits for the next plan. Twelve calls and four deviations stop for you, and four calls sit on two sheets. Flag a call, or accept.
