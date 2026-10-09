# Decisions

Append-only ledger. `reel record` adds entries from a plan review; a plan that changes one adds a superseding entry and says why. `reel check` enforces this.

| id | date | plan | step | question | chosen | status |
|---|---|---|---|---|---|---|
| D-001 | 2026-09-22 | 2026-09-22-close-the-lifecycle | 3 | Who checks that the code followed the plan? | **Second agent** | active |
| D-002 | 2026-09-22 | 2026-09-22-close-the-lifecycle | 5 | What happens to a flagged call? | **Fix and rebuild** | active |
| D-003 | 2026-09-22 | 2026-09-22-close-the-lifecycle | 6 | When does the system video update? | **i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?** (not the recommendation) | active |
| D-004 | 2026-09-23 | 2026-09-22-richer-review | 2 | After a pick-all-that-apply answer, what does the video play? | **One summary frame** | active |
| D-005 | 2026-09-23 | 2026-09-22-richer-review | 6 | Which video-only feedback comes first? | **Automatic rewinds** | active |
| D-006 | 2026-09-23 | 2026-09-22-richer-review | 4 | The player ignores the old saved mute setting and keeps mute under a new name, or deleting the old key? (the agent's own call A15, accepted in the walkthrough) | **The player ignores the old saved mute setting and keeps mute under a new name** | active |
| D-007 | 2026-09-23 | 2026-09-22-richer-review | 1 | resolve-plan finds your chosen option by its letter when the label does not match, or matching the exact label only? (the agent's own call A1, accepted in the walkthrough) | **resolve-plan finds your chosen option by its letter when the label does not match** | active |
| D-008 | 2026-09-23 | 2026-09-22-richer-review | 1 | Four options sit 2 × 2, and go 4 across only when the video is at least 1200 px wide, or 4-across at 1440? (the agent's own call A7, accepted in the walkthrough) | **Four options sit 2 × 2, and go 4 across only when the video is at least 1200 px wide** | active |
| D-009 | 2026-09-23 | 2026-09-22-richer-review | 2 | A pick-all question has no branch beats; the video goes straight to its summary frame, or allowing branches on a pick-all question? (the agent's own call A2, accepted in the walkthrough) | **A pick-all question has no branch beats; the video goes straight to its summary frame** | active |
| D-010 | 2026-09-23 | 2026-09-22-richer-review | 2 | A pick-all answer is one entry in the decision ledger, holding every pick, or one entry per pick? (the agent's own call A3, accepted in the walkthrough) | **A pick-all answer is one entry in the decision ledger, holding every pick** | active |
| D-011 | 2026-09-23 | 2026-09-22-richer-review | 2 | A summary frame shows the picks one line each in a list, or joined with commas anywhere else, or a template convention per item? (the agent's own call A8, accepted in the walkthrough) | **A summary frame shows the picks one line each in a list, or joined with commas anywhere else** | active |
| D-012 | 2026-09-23 | 2026-09-22-richer-review | 2 | On a replay, an answer with no branch of its own skips from the question to its summary, or routing only pick-one answers with branches? (the agent's own call A9, accepted in the walkthrough) | **On a replay, an answer with no branch of its own skips from the question to its summary** | active |
| D-013 | 2026-09-23 | 2026-09-22-richer-review | 5 | The lint counts the parts named in a frame's code; a whole-system beat can opt out, or counting what is visible at each moment in the browser? (the agent's own call A5, accepted in the walkthrough) | **The lint counts the parts named in a frame's code; a whole-system beat can opt out** | active |
| D-014 | 2026-09-23 | 2026-09-22-richer-review | 5 | Four frames of the close-the-lifecycle video that now break the 6-part rule are left as they are, or something else? (the agent's own call D1, accepted in the walkthrough) | **Four frames of the close-the-lifecycle video that now break the 6-part rule are left as they are** | active |
| D-015 | 2026-09-23 | 2026-09-22-richer-review | 6 | A rewind is a scrub or a key press that goes back more than 2 s; jumps from the record do not count, or every backwards seek? (the agent's own call A11, accepted in the walkthrough) | **A rewind is a scrub or a key press that goes back more than 2 s; jumps from the record do not count** | active |
| D-016 | 2026-09-23 | 2026-09-22-richer-review | 6 | Speed changes within 3 s merge into one moment, and only slowing below 1× counts, or one moment per change below 1×? (the agent's own call A12, accepted in the walkthrough) | **Speed changes within 3 s merge into one moment, and only slowing below 1× counts** | active |
| D-017 | 2026-09-23 | 2026-09-22-richer-review | 6 | The resolved plan lists hard-to-follow moments by step, with their times, or listed in time order, or merged into the step comments? (the agent's own call A4, accepted in the walkthrough) | **The resolved plan lists hard-to-follow moments by step, with their times** | active |
| D-018 | 2026-09-23 | 2026-09-22-richer-review | 1 | A note on an answer sends its step to the revise step, just like a comment, or notes as record-only? (the agent's own call A6, accepted in the walkthrough) | **A note on an answer sends its step to the revise step, just like a comment** | active |
| D-019 | 2026-09-23 | 2026-09-22-richer-review | 1 | A note on its own still lets you approve when the review is finished, or treating a note like a comment? (the agent's own call A13, accepted in the walkthrough) | **A note on its own still lets you approve when the review is finished** | active |
| D-020 | 2026-09-23 | 2026-09-22-richer-review | 1 | Notes are offered on plan questions only, not on quick checks or on the agent's calls, or a note on every beat? (the agent's own call A14, accepted in the walkthrough) | **Notes are offered on plan questions only, not on quick checks or on the agent's calls** | active |
| D-021 | 2026-09-23 | 2026-09-23-deep-dives | 1 | Where does a detail open? | **Side panel** | superseded by D-195 |
| D-022 | 2026-09-23 | 2026-09-23-deep-dives | 2 | Who writes a detail page? | **confused by this, need more information and examples** (not the recommendation) | reopened |
| D-023 | 2026-09-23 | 2026-09-23-deep-dives | 4 | What code does a walkthrough show? | **oh we shoulndt ALWAYS show the code, and we should not ONLY be showing the code as the thing we are showing more detail for. like there could be other thigns where detail is important. and code might not come with everything, only if it is relevant, and ppl often dont l ook at the full code there like it really should be justified. and other details could be important that are clearer, like going into more interactive depth.** (not the recommendation) | active |
| D-024 | 2026-09-23 | 2026-09-23-deep-dives | 2 | How is each detail page made? | **Types first** | active |
| D-025 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 2 | The skill runs its tools as npx -y reelplanning@0.1.0, pinned to the package version, or the local `reelplanning` bin on PATH? (the agent's own call A18, accepted in the walkthrough) | **The skill runs its tools as npx -y reelplanning@0.1.0, pinned to the package version** | active |
| D-026 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | The checker's whole world is one file, code-check/brief.md, or letting the checker explore the repo and history freely? (the agent's own call A1, accepted in the walkthrough) | **The checker's whole world is one file, code-check/brief.md** | active |
| D-027 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | The brief includes the implementer's autonomy log, but nothing else from the implementer, or giving the checker nothing from the implementer? (the agent's own call A2, accepted in the walkthrough) | **The brief includes the implementer's autonomy log, but nothing else from the implementer** | active |
| D-028 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | The brief shows plan.md, the plan as implemented, or `plan.resolved.md` when it exists? (the agent's own call A19, accepted in the walkthrough) | **The brief shows plan.md, the plan as implemented** | active |
| D-029 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | The code check leaves accepted agent calls out of the decisions it checks, or including them? (the agent's own call A15, accepted in the walkthrough) | **The code check leaves accepted agent calls out of the decisions it checks** | active |
| D-030 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | A diff over 400k characters is cut, with the command to read the rest, or always the full diff? (the agent's own call A3, accepted in the walkthrough) | **A diff over 400k characters is cut, with the command to read the rest** | active |
| D-031 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | -- <paths> narrows the diff, or the whole range only? (the agent's own call A4, accepted in the walkthrough) | **-- <paths> narrows the diff** | active |
| D-032 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | Findings in a fixed shape, every ✗ keyed by Step N, a decision id or a path, or free prose? (the agent's own call A5, accepted in the walkthrough) | **Findings in a fixed shape, every ✗ keyed by Step N, a decision id or a path** | active |
| D-033 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | No findings file is a warning in reel audit, not a failure, or failing? (the agent's own call A6, accepted in the walkthrough) | **No findings file is a warning in reel audit, not a failure** | active |
| D-034 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | reel audit asks for a named file only for this plan's own decisions, in their step's entry; a cited decision in force needs a mention, or a file per decision in force? (the agent's own call A14, accepted in the walkthrough) | **reel audit asks for a named file only for this plan's own decisions, in their step's entry; a cited decision in force needs a mention** | active |
| D-035 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | Deviation from step 3: reel audit asks a named file only of this plan's own decisions (A14), or something else? (the agent's own call D2, accepted in the walkthrough) | **Deviation from step 3: reel audit asks a named file only of this plan's own decisions (A14)** | active |
| D-036 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | A part labelled with a file name fails the lint; any other label that is not its glossary name is only a note; a mock of a file or page is left alone, or failing every label that differs from the glossary? (the agent's own call A11, accepted in the walkthrough) | **A part labelled with a file name fails the lint; any other label that is not its glossary name is only a note; a mock of a file or page is left alone** | active |
| D-037 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 3 | A step the reviewer rewound or slowed down on goes to the revise, to be said more plainly, without changing what it decides, or leaving those signals in the resolved plan only? (the agent's own call A12, accepted in the walkthrough) | **A step the reviewer rewound or slowed down on goes to the revise, to be said more plainly, without changing what it decides** | active |
| D-038 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 5 | The fix step is skill instructions, not a script, or a script that applies fixes? (the agent's own call A7, accepted in the walkthrough) | **The fix step is skill instructions, not a script** | active |
| D-039 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 5 | A fixed call's row is updated in place ("changed after review: …"), or a new row for the fix? (the agent's own call A8, accepted in the walkthrough) | **A fixed call's row is updated in place ("changed after review: …")** | active |
| D-040 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 5 | A note with no step, within 15 s after a flag, is taken to be about that flag, or only notes on the flag's step? (the agent's own call A9, accepted in the walkthrough) | **A note with no step, within 15 s after a flag, is taken to be about that flag** | active |
| D-041 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 5 | An accepted agent call warns a later plan in reel check that touches its part, or failing, like a reviewed decision? (the agent's own call A13, accepted in the walkthrough) | **An accepted agent call warns a later plan in reel check that touches its part** | superseded by D-221 |
| D-042 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 5 | A flag becomes a new plan when the reviewer's words contain a ledger id or any option label (over 3 letters) of an active decision, or only the chosen option, or only this plan's decisions? (the agent's own call A16, accepted in the walkthrough) | **A flag becomes a new plan when the reviewer's words contain a ledger id or any option label (over 3 letters) of an active decision** | active |
| D-043 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 5 | An answer in the reviewer's own words on an agent's call is a fix, with those words as the instruction, or an accept with a note? (the agent's own call A17, accepted in the walkthrough) | **An answer in the reviewer's own words on an agent's call is a fix, with those words as the instruction** | active |
| D-044 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 6 | The system video is behind when spec.md changed after the video did (git commit times, file times when uncommitted), or a content hash of what the video says? (the agent's own call A10, accepted in the walkthrough) | **The system video is behind when spec.md changed after the video did (git commit times, file times when uncommitted)** | active |
| D-045 | 2026-09-23 | 2026-09-22-close-the-lifecycle | 6 | Deviation from D-003: a rebuild regenerates narration for the whole video, or something else? (the agent's own call D1, accepted in the walkthrough) | **Deviation from D-003: a rebuild regenerates narration for the whole video** | active |
| D-046 | 2026-09-23 | 2026-09-23-deep-dives | 1 | The Open chip's key is O; while a question sheet is up, O keeps meaning "answer in my own words", so the chip waits behind it, or E (the plan's key, which is Export today), or moving Export off E? (the agent's own call A1, accepted in the walkthrough) | **The Open chip's key is O; while a question sheet is up, O keeps meaning "answer in my own words", so the chip waits behind it** | active |
| D-047 | 2026-09-23 | 2026-09-23-deep-dives | 1 | Close plays again only if the video was playing when the detail opened and the playhead is still where it was; no seek back, or always play on close, or always seek back to the opening moment? (the agent's own call A4, accepted in the walkthrough) | **Close plays again only if the video was playing when the detail opened and the playhead is still where it was; no seek back** | active |
| D-048 | 2026-09-23 | 2026-09-23-deep-dives | 1 | While the panel is open the video's keys are off (no play, draw or answer); O and Esc close it, or letting space/A–D/N act on the hidden video? (the agent's own call A5, accepted in the walkthrough) | **While the panel is open the video's keys are off (no play, draw or answer); O and Esc close it** | active |
| D-049 | 2026-09-23 | 2026-09-23-deep-dives | 2 | A seventh template, fresh.html: the base styles, theme and bridge with an empty body, for kind fresh, or writing the bridge from scratch each time? (the agent's own call A10, accepted in the walkthrough) | **A seventh template, fresh.html: the base styles, theme and bridge with an empty body, for kind fresh** | active |
| D-050 | 2026-09-23 | 2026-09-23-deep-dives | 2 | Data pages are filled by one JSON block (rp-data); a prototype by two slots, markup and behaviour; explore by one optional script, or HTML slots everywhere, or JSON only? (the agent's own call A11, accepted in the walkthrough) | **Data pages are filled by one JSON block (rp-data); a prototype by two slots, markup and behaviour; explore by one optional script** | active |
| D-051 | 2026-09-23 | 2026-09-23-deep-dives | 2 | Each template's sample is the uploads plan (risks, the 8/16/32 MB staging runs, parts.ts line 14, before/after drop, manifest explorer, a step's text), marked "Sample content", or lorem ipsum? (the agent's own call A12, accepted in the walkthrough) | **Each template's sample is the uploads plan (risks, the 8/16/32 MB staging runs, parts.ts line 14, before/after drop, manifest explorer, a step's text), marked "Sample content"** | active |
| D-052 | 2026-09-23 | 2026-09-23-deep-dives | 3 | A detail comment is kind: "note" with detail: { name, anchor, text }; Enter or Esc keeps the words, the × discards them; a click on another anchor keeps what was typed on the first, or a new kind (`detail-note`), or Esc discarding? (the agent's own call A6, accepted in the walkthrough) | **A detail comment is kind: "note" with detail: { name, anchor, text }; Enter or Esc keeps the words, the × discards them; a click on another anchor keeps what was typed on the first** | active |
| D-053 | 2026-09-23 | 2026-09-23-deep-dives | 3 | A click on a control (button, a, input, select, textarea, label, summary, [data-no-anchor]) inside an anchored element does not post an anchor; the anchor element itself does, or posting on every click inside an anchor? (the agent's own call A9, accepted in the walkthrough) | **A click on a control (button, a, input, select, textarea, label, summary, [data-no-anchor]) inside an anchored element does not post an anchor; the anchor element itself does** | active |
| D-054 | 2026-09-23 | 2026-09-23-deep-dives | 3 | plan-text renders a Markdown link as its text plus the address in grey, never an <a href>, or a working link? (the agent's own call A15, accepted in the walkthrough) | **plan-text renders a Markdown link as its text plus the address in grey, never an <a href>** | active |
| D-055 | 2026-09-23 | 2026-09-23-deep-dives | 4 | Accept / Flag in the panel are one-shot like the sheet's: once a verdict is on the record the buttons show it and are disabled; if that call's sheet is waiting, the panel's verdict answers it too, or letting the panel change a verdict, or leaving the sheet waiting? (the agent's own call A7, accepted in the walkthrough) | **Accept / Flag in the panel are one-shot like the sheet's: once a verdict is on the record the buttons show it and are disabled; if that call's sheet is waiting, the panel's verdict answers it too** | active |
| D-056 | 2026-09-23 | 2026-09-23-deep-dives | 5 | The plan text goes beside the stage (a 340 px column) when the stage loses under 10 % of its width for it; otherwise it is a section in the record, under Steps, or always below the player in the page flow (the plan's words)? (the agent's own call A3, accepted in the walkthrough) | **The plan text goes beside the stage (a 340 px column) when the stage loses under 10 % of its width for it; otherwise it is a section in the record, under Steps** | superseded by D-063 |
| D-057 | 2026-09-23 | 2026-09-23-deep-dives | 5 | Deviation from step 5: the plan text sits beside the stage when the window is wide, in the record otherwise (A3), or something else? (the agent's own call D2, accepted in the walkthrough) | **Deviation from step 5: the plan text sits beside the stage when the window is wide, in the record otherwise (A3)** | active |
| D-058 | 2026-09-23 | 2026-09-23-deep-dives | 6 | The check fails on eight more ways a page can break than the four named before the build (the detail lists every rule), or only missing page / network / bridge text / page error? (the agent's own call A13, accepted in the walkthrough) | **The check fails on eight more ways a page can break than the four named before the build (the detail lists every rule)** | active |
| D-059 | 2026-09-23 | 2026-09-23-deep-dives | 6 | Without playwright-core (or when Chromium will not start) the static checks still run and the result says the pages were not opened, or failing the build? (the agent's own call A14, accepted in the walkthrough) | **Without playwright-core (or when Chromium will not start) the static checks still run and the result says the pages were not opened** | active |
| D-060 | 2026-09-23 | 2026-09-23-deep-dives | 1 | Deviation from step 1: the Open chip's key is O, or something else? (the agent's own call D1, accepted in the walkthrough) | **Deviation from step 1: the Open chip's key is O** | active |
| D-061 | 2026-09-23 | 2026-09-23-deep-dives | 1 | The panel is fixed to the window's right edge, full height, min(560px, 44vw) wide, and the stage shrinks beside it; where that would leave the stage under 640 px (a window under about 1250 px) or on a phone, it covers the window, or a panel inside the stage's own height, or an overlay on the stage? (the agent's own call A2, accepted in the walkthrough) | **The panel is fixed to the window's right edge, full height, min(560px, 44vw) wide, and the stage shrinks beside it; where that would leave the stage under 640 px (a window under about 1250 px) or on a phone, it covers the window** | active |
| D-062 | 2026-09-23 | 2026-09-23-deep-dives | 5 | The plan beside the video reads plan.md, never plan.resolved.md, or the resolved file when it exists? (the agent's own call A8, accepted in the walkthrough) | **The plan beside the video reads plan.md, never plan.resolved.md** | active |
| D-063 | 2026-09-23 | 2026-09-23-deep-dives | 5 | The plan text goes beside the stage when the stage loses under 15 % of its width for it (under 10 % before the restyle), or keep 10 %? (after the review page restyle; the reviewer left it to the agent) | **Beside the stage when that costs it under 15 % of its width; otherwise in the record** | active, supersedes D-056 |
| D-064 | 2026-09-24 | 2026-09-22-m3-revise-loop | 3 | Who runs the loop between your reviews? | **A background agent that owns it** | active |
| D-065 | 2026-09-24 | 2026-09-22-m3-revise-loop | 4 | When a system-video comment asks for the system itself to change, what happens? | **Small fixes go straight in; anything with a choice becomes a plan** | active |
| D-066 | 2026-09-24 | 2026-09-22-m3-revise-loop | 3 | How far does the first version go beyond Claude Code? | **One setting, tested with Claude Code** | active |
| D-067 | 2026-09-24 | 2026-09-22-m3-revise-loop | 1 | The kept narration is the project's own committed assets/voice/NN.wav and audio_meta.json, indexed by a small committed record, .hyperframes/narration.json (frame → key, text, wav sha256), or a per-repo, gitignored store (`.reelplanning/cache/narration/`)? (the agent's own call A1, accepted in the walkthrough) | **The kept narration is the project's own committed assets/voice/NN.wav and audio_meta.json, indexed by a small committed record, .hyperframes/narration.json (frame → key, text, wav sha256)** | active |
| D-068 | 2026-09-24 | 2026-09-22-m3-revise-loop | 1 | The key is sha256 of {text, voice, speed, model}, with model = the TTS model plus the whisper model (kokoro-v1.0 + whisper small.en), read from the pinned HyperFrames CLI, or the HyperFrames version as the model? (the agent's own call A2, accepted in the walkthrough) | **The key is sha256 of {text, voice, speed, model}, with model = the TTS model plus the whisper model (kokoro-v1.0 + whisper small.en), read from the pinned HyperFrames CLI** | active |
| D-069 | 2026-09-24 | 2026-09-22-m3-revise-loop | 1 | A video narrated before the record existed is adopted from git: the SCRIPT.md of the commit that last wrote audio_meta.json, only when audio_meta.json and assets/voice/ are exactly that commit's; --adopt does the same from the working SCRIPT.md, outside git, or re-narrating every line once, to create the record? (the agent's own call A3, accepted in the walkthrough) | **A video narrated before the record existed is adopted from git: the SCRIPT.md of the commit that last wrote audio_meta.json, only when audio_meta.json and assets/voice/ are exactly that commit's; --adopt does the same from the working SCRIPT.md, outside git** | active |
| D-070 | 2026-09-24 | 2026-09-22-m3-revise-loop | 1 | The cost is one phrase shared by spec-diff ("cost: …") and reel status ("with …"): the lines of the frames spec-diff names, plus any line already edited and not yet voiced, with seconds of speech and an estimate of time to make; spec-diff --json carries it as narration, or counting only the named frames' lines? (the agent's own call A4, accepted in the walkthrough) | **The cost is one phrase shared by spec-diff ("cost: …") and reel status ("with …"): the lines of the frames spec-diff names, plus any line already edited and not yet voiced, with seconds of speech and an estimate of time to make; spec-diff --json carries it as narration** | active |
| D-071 | 2026-09-24 | 2026-09-22-m3-revise-loop | 2 | The notification fires from reelplanning review <video-dir> once the server is listening (the page is up and its URL known), and from reelplanning notify <video-dir> --url <artifact-url>, run by the skill after publishing a hosted page; review with no folder (the library) does not notify; --no-notify turns it off, or firing at the end of `verify.sh` or `finish-project.sh`? (the agent's own call A5, accepted in the walkthrough) | **The notification fires from reelplanning review <video-dir> once the server is listening (the page is up and its URL known), and from reelplanning notify <video-dir> --url <artifact-url>, run by the skill after publishing a hosted page; review with no folder (the library) does not notify; --no-notify turns it off** | active |
| D-072 | 2026-09-24 | 2026-09-22-m3-revise-loop | 3 | The inbox is .reelplanning/inbox/<id>.json, gitignored with its claims, heartbeats and run logs; reel-intake is what turns a row into committed files, or committing inbox rows? (the agent's own call A6, accepted in the walkthrough) | **The inbox is .reelplanning/inbox/<id>.json, gitignored with its claims, heartbeats and run logs; reel-intake is what turns a row into committed files** | active |
| D-073 | 2026-09-24 | 2026-09-22-m3-revise-loop | 3 | "A session is waiting" = a heartbeat file inbox/.waiters/<pid>.json, rewritten every 2 s by review --wait, and counted when it is under 10 s old and (same host) its pid is alive, or a plain pid lock file, or a socket the waiter holds open? (the agent's own call A7, accepted in the walkthrough) | **"A session is waiting" = a heartbeat file inbox/.waiters/<pid>.json, rewritten every 2 s by review --wait, and counted when it is under 10 s old and (same host) its pid is alive** | active |
| D-074 | 2026-09-24 | 2026-09-22-m3-revise-loop | 3 | With a waiter alive, the server leaves the review to it, then looks again after 15 s: still unclaimed and no live waiter → it starts the headless run, or trusting the first look? (the agent's own call A8, accepted in the walkthrough) | **With a waiter alive, the server leaves the review to it, then looks again after 15 s: still unclaimed and no live waiter → it starts the headless run** | active |
| D-075 | 2026-09-24 | 2026-09-22-m3-revise-loop | 3 | One handler per review, enforced by an exclusive-create claim file inbox/<id>.claim (open(…, "wx")): the waiting session, the headless start and the session-start pickup all have to win it, or a lock held in the server's memory? (the agent's own call A9, accepted in the walkthrough) | **One handler per review, enforced by an exclusive-create claim file inbox/<id>.claim (open(…, "wx")): the waiting session, the headless start and the session-start pickup all have to win it** | active |
| D-076 | 2026-09-24 | 2026-09-22-m3-revise-loop | 3 | POST /api/review accepts only content-type: application/json, a Host of 127.0.0.1 or localhost on its port, and no foreign Origin; 5 MB cap; the body must carry review.annotations, or accepting any POST? (the agent's own call A10, accepted in the walkthrough) | **POST /api/review accepts only content-type: application/json, a Host of 127.0.0.1 or localhost on its port, and no foreign Origin; 5 MB cap; the body must carry review.annotations** | active |
| D-077 | 2026-09-24 | 2026-09-22-m3-revise-loop | 3 | On a local page, Finish POSTs the row to /api/review only when the review server marked the page as its own (a meta tag) and a GET /api/review on load answered {ok:true}; a failed POST is dropped quietly and the download stays, or posting blind from every localhost page? (the agent's own call A15, accepted in the walkthrough) | **On a local page, Finish POSTs the row to /api/review only when the review server marked the page as its own (a meta tag) and a GET /api/review on load answered {ok:true}; a failed POST is dropped quietly and the download stays** | active |
| D-078 | 2026-09-24 | 2026-09-22-m3-revise-loop | 4 | Intake checks a system-video target: inside the repo, directly in a .reelplanning/, with a STORYBOARD.md whose front matter says kind: system and a plan-map.json, and every mark's frame.compositionId one of that video's frames; system-review runs with the checked folder, never the row's claim, or believing the path once it matches? (the agent's own call A12, accepted in the walkthrough) | **Intake checks a system-video target: inside the repo, directly in a .reelplanning/, with a STORYBOARD.md whose front matter says kind: system and a plan-map.json, and every mark's frame.compositionId one of that video's frames; system-review runs with the checked folder, never the row's claim** | active |
| D-079 | 2026-09-24 | 2026-09-22-m3-revise-loop | 4 | The first sort is a keyword hint: rewinds, slow-downs, missed checks and wordless marks → video; words asking for a change → change, and then a choice word (or, which, either…) or a frame with 2+ parts (1 when the mark sits on a part) → plan, else small; each hint prints its reason; the agent decides, or no hint, or a model call? (the agent's own call A13, accepted in the walkthrough) | **The first sort is a keyword hint: rewinds, slow-downs, missed checks and wordless marks → video; words asking for a change → change, and then a choice word (or, which, either…) or a frame with 2+ parts (1 when the mark sits on a part) → plan, else small; each hint prints its reason; the agent decides** | active |
| D-080 | 2026-09-24 | 2026-09-22-m3-revise-loop | 4 | The "short walkthrough" for a small change is a one-step plan from reel new-plan, with its own walkthrough.md and walkthrough video, or a walkthrough with no plan directory? (the agent's own call A14, accepted in the walkthrough) | **The "short walkthrough" for a small change is a one-step plan from reel new-plan, with its own walkthrough.md and walkthrough video** | active |
| D-081 | 2026-09-24 | 2026-09-22-m3-revise-loop | 4 | After a rebuild, "Play just the changes" is on by default when the build is a revision (some beats changed, not all) and the reviewer has not already sent a review of this same build; the toggle is remembered per video only for that build, or on only when a sent round exists, or remembering "whole video" for good? (the agent's own call A16, accepted in the walkthrough) | **After a rebuild, "Play just the changes" is on by default when the build is a revision (some beats changed, not all) and the reviewer has not already sent a review of this same build; the toggle is remembered per video only for that build** | active |
| D-082 | 2026-09-24 | 2026-09-22-m3-revise-loop | 6 | What may a run nobody is watching do? | **Auto mode, inside the sandbox** | active |
| D-083 | 2026-09-24 | 2026-09-22-m3-revise-loop | 7 | How many quick checks does a video ask? | **One per step, plus wherever there is something to predict** | superseded by D-222 |
| D-084 | 2026-09-24 | 2026-09-22-m3-revise-loop | 8 | Does your own record also decide what stops? | **The tags, and your record** | superseded by D-220 |
| D-085 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | How much scaffolding comes out? | **B, and the files** | active |
| D-086 | 2026-09-24 | 2026-09-22-m3-revise-loop | 6 | Deviation from step 6: the re-run of the step 5 proof used enableWeakerNestedSandbox, which the shipped setting does not carry, because this container runs as root and the strict sandbox leaves such a run with no working shell, or something else? (the agent's own call D4, accepted in the walkthrough) | **Deviation from step 6: the re-run of the step 5 proof used enableWeakerNestedSandbox, which the shipped setting does not carry, because this container runs as root and the strict sandbox leaves such a run with no working shell** [deviation] | active |
| D-087 | 2026-09-24 | 2026-09-22-m3-revise-loop | 6 | The sandbox settings are inline in the command's --settings, not a committed .claude/settings.json, or a committed `.claude/settings.json`? (the agent's own call A17, accepted in the walkthrough) | **The sandbox settings are inline in the command's --settings, not a committed .claude/settings.json** [visible, close] | active |
| D-088 | 2026-09-24 | 2026-09-22-m3-revise-loop | 6 | allowUnsandboxedCommands: false: nothing runs outside the fence, so a commit signed through a local agent fails, or letting the classifier approve an unsandboxed retry? (the agent's own call A19, accepted in the walkthrough) | **allowUnsandboxedCommands: false: nothing runs outside the fence, so a commit signed through a local agent fails** [hard-to-undo, close] | active |
| D-089 | 2026-09-24 | 2026-09-22-m3-revise-loop | 6 | The review server tells the reviewer when the run it started ends (ready, or stopped with its log); review --detach inside a run does nothing, or the run notifying through `review --detach`? (the agent's own call A20, accepted in the walkthrough) | **The review server tells the reviewer when the run it started ends (ready, or stopped with its log); review --detach inside a run does nothing** [visible] | active |
| D-090 | 2026-09-24 | 2026-09-22-m3-revise-loop | 6 | No list of allowed hosts: in auto mode the classifier reviews each host a command names, or the plan's "network to named hosts"? (the agent's own call D3, accepted in the walkthrough) | **No list of allowed hosts: in auto mode the classifier reviews each host a command names** [deviation] | active |
| D-091 | 2026-09-24 | 2026-09-22-m3-revise-loop | 8 | Flagged and own-words calls enter the ledger with status flagged/own; a new verdict on a call supersedes its earlier accept, or keeping only accepted calls? (the agent's own call A22, accepted in the walkthrough) | **Flagged and own-words calls enter the ledger with status flagged/own; a new verdict on a call supersedes its earlier accept** [hard-to-undo, close] | active |
| D-092 | 2026-09-24 | 2026-09-22-m3-revise-loop | 8 | The grouped sheet has a Flag per call and one Accept all (A), no own-words box; taking a flag back clears the verdict, or own words and a key per call? (the agent's own call A24, accepted in the walkthrough) | **The grouped sheet has a Flag per call and one Accept all (A), no own-words box; taking a flag back clears the verdict** [visible, close] | active |
| D-093 | 2026-09-24 | 2026-09-22-m3-revise-loop | 8 | Tags go in brackets at the end of the "chose" cell, or a seventh column? (the agent's own call A21, accepted in the walkthrough) | **Tags go in brackets at the end of the "chose" cell** | active |
| D-094 | 2026-09-24 | 2026-09-22-m3-revise-loop | 8 | A tag's run of accepts counts across all plans in the order they were judged; entries without tags count for nothing, or per plan, or by date? (the agent's own call A23, accepted in the walkthrough) | **A tag's run of accepts counts across all plans in the order they were judged; entries without tags count for nothing** | active |
| D-095 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | Reviews are filed as reviews/plan-<time>.json / walkthrough-<time>.json with an .md beside each, and migrate-reviews ships as a command that moved all six plans, or reading both layouts? (the agent's own call A25, accepted in the walkthrough) | **Reviews are filed as reviews/plan-<time>.json / walkthrough-<time>.json with an .md beside each, and migrate-reviews ships as a command that moved all six plans** [visible, hard-to-undo] | active |
| D-096 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | resolve-plan and resolve-walkthrough are deleted; revise-scope and walkthrough-scope stay as JSON printers, or keeping all four? (the agent's own call A26, accepted in the walkthrough) | **resolve-plan and resolve-walkthrough are deleted; revise-scope and walkthrough-scope stay as JSON printers** [visible] | active |
| D-097 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | detail_kind is free-form and detail new --kind <anything> starts from the blank page; --step is gone, or a closed list of seven kinds? (the agent's own call A30, accepted in the walkthrough) | **detail_kind is free-form and detail new --kind <anything> starts from the blank page; --step is gone** [visible] | active |
| D-098 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | Two details on one beat warn instead of failing the build; the last one opens, or failing the build? (the agent's own call A31, accepted in the walkthrough) | **Two details on one beat warn instead of failing the build; the last one opens** [visible, close] | active |
| D-099 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | detail new with no --kind starts from the blank page (fresh), or requiring a template? (the agent's own call A32, accepted in the walkthrough) | **detail new with no --kind starts from the blank page (fresh)** [close] | active |
| D-100 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | `build` retimes against the narration the frames were timed to, kept in `.hyperframes/frames-timed-to.json` until retime passes, or always against HEAD? (the agent's own call A27, accepted in the walkthrough) | **`build` retimes against the narration the frames were timed to, kept in `.hyperframes/frames-timed-to.json` until retime passes** | active |
| D-101 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | One on-screen budget: five new words per beat beyond labels, or eight? (the agent's own call A28, accepted in the walkthrough) | **One on-screen budget: five new words per beat beyond labels** | active |
| D-102 | 2026-09-24 | 2026-09-22-m3-revise-loop | 5 | Step 5's second proof is still owed: only the system video's review has been through a headless run and timed (9 min 13 s, then 12 min 20 s on step 6's command); a review of a plan's walkthrough has not, or something else? (the agent's own call D5, accepted in the walkthrough) | **Step 5's second proof is still owed: only the system video's review has been through a headless run and timed (9 min 13 s, then 12 min 20 s on step 6's command); a review of a plan's walkthrough has not** [deviation] | active |
| D-103 | 2026-09-24 | 2026-09-22-m3-revise-loop | 6 | failIfUnavailable: true: where the sandbox cannot run (native Windows, Linux without bubblewrap), there is no headless run at all, or the default, which runs unsandboxed with a warning? (the agent's own call A18, answered in the reviewer's own words in the walkthrough) | **failIfUnavailable: true: where the sandbox cannot run (native Windows, Linux without bubblewrap), there is no headless run at all** [visible, hard-to-undo, close] | own |
| D-104 | 2026-09-24 | 2026-09-22-m3-revise-loop | 6 | Codex's equivalent is codex exec --sandbox workspace-write, not the plan's codex exec --full-auto, or the plan's flag? (the agent's own call D2, answered in the reviewer's own words in the walkthrough) | **Codex's equivalent is codex exec --sandbox workspace-write, not the plan's codex exec --full-auto** [deviation] | own |
| D-105 | 2026-09-24 | 2026-09-22-m3-revise-loop | 9 | CLAUDE.md also tells an agent here to run this checkout's tooling rather than the published $RP, or moving only the autonomous-mode section? (the agent's own call A29, answered in the reviewer's own words in the walkthrough) | **CLAUDE.md also tells an agent here to run this checkout's tooling rather than the published $RP** [close] | own |
| D-106 | 2026-09-24 | 2026-09-24-memory | 3 | Where does your memory across repos live? | **A file in your home folder** | active |
| D-107 | 2026-09-24 | 2026-09-24-memory | 5 | When does the tool suggest a retro? | **Every five plans, or when a signal repeats three times** | active |
| D-108 | 2026-09-24 | 2026-09-24-answer-on-the-video | 2 | Where do the answers the frame can't take go? | **i like the pricnicple of A, not messing w video, but we probably need it to be bigger. if we can design videos in a way where this bar is larger and more graceful in the video that might be best?** (not the recommendation) | superseded by the plan 2026-09-25-answer-in-the-frame |
| D-109 | 2026-09-25 | 2026-09-25-fewer-better-stops | 2 | What may a miss with no tags stop? | **Nothing directly** | active |
| D-110 | 2026-09-25 | 2026-09-25-fewer-better-stops | 3 | A step reaches its fifth call during the build. What does the implementer do? | **Asks before going on** | active |
| D-111 | 2026-09-25 | 2026-09-24-memory | 1 | The stamp is one `recorded` object in the filed review, { reviewer, via, reelplanning }, where `via` says whether the reviewer came from the page's viewer or git's user.email; the same review filed again with a different stamp (another person's intake, an upgrade) is still the same review, not a second file, or top-level `reviewer` and `version` fields, or a file beside the review? (the agent's own call A5, accepted in the walkthrough) | **The stamp is one `recorded` object in the filed review, { reviewer, via, reelplanning }, where `via` says whether the reviewer came from the page's viewer or git's user.email; the same review filed again with a different stamp (another person's intake, an upgrade) is still the same review, not a second file** [hard-to-undo] | active |
| D-112 | 2026-09-25 | 2026-09-24-memory | 1 | The version is the reelplanning that records the review (its package.json), or the version that built the video, as the plan says? (the agent's own call A6, accepted in the walkthrough) | **The version is the reelplanning that records the review (its package.json)** [close] | active |
| D-113 | 2026-09-25 | 2026-09-24-memory | 1 | migrate-reviews files old reviews unstamped (stamp: false), or stamping them with whoever runs the migration? (the agent's own call A8, accepted in the walkthrough) | **migrate-reviews files old reviews unstamped (stamp: false)** [close] | active |
| D-114 | 2026-09-25 | 2026-09-24-memory | 1 | The page's viewer is read from the row's `viewer` (a string, or `{ email }` / `{ name }`), else the export's; the player is not changed to send one, or a player change that puts the viewer on every row? (the agent's own call A7, accepted in the walkthrough) | **The page's viewer is read from the row's `viewer` (a string, or `{ email }` / `{ name }`), else the export's; the player is not changed to send one** | active |
| D-115 | 2026-09-25 | 2026-09-24-memory | 2 | The five lines' ids are words: recommended, own-words, rewinds, checks, misses (and flagged for yours across repos), so `reel memory own-words` says what it prints, or numbered ids (`m1` … `m5`)? (the agent's own call A1, accepted in the walkthrough) | **The five lines' ids are words: recommended, own-words, rewinds, checks, misses (and flagged for yours across repos), so `reel memory own-words` says what it prints** [visible] | active |
| D-116 | 2026-09-25 | 2026-09-24-memory | 2 | Why a question was answered in own words is read from the words and the options: 'unclear, asked for more', 'an option, with a condition', otherwise 'the question framed otherwise'; the words are always shown with it, or no reason, only the words; or a reason the reviewer picks? (the agent's own call A2, accepted in the walkthrough) | **Why a question was answered in own words is read from the words and the options: 'unclear, asked for more', 'an option, with a condition', otherwise 'the question framed otherwise'; the words are always shown with it** [close] | active |
| D-117 | 2026-09-25 | 2026-09-24-memory | 2 | 'Rewound again after a revision' is the same step of the same plan's same video rewound or slowed in two different reviews of it; a rewind with no step is left out of the line, or counting rewinds twice within one review; or including rewinds with no step? (the agent's own call A4, accepted in the walkthrough) | **'Rewound again after a revision' is the same step of the same plan's same video rewound or slowed in two different reviews of it; a rewind with no step is left out of the line** [close] | active |
| D-118 | 2026-09-25 | 2026-09-24-memory | 2 | A call counts once, by the first verdict it was given (a later round that re-judges it does not count again); plan questions count per review, or every verdict in every walkthrough review? (the agent's own call A3, accepted in the walkthrough) | **A call counts once, by the first verdict it was given (a later round that re-judges it does not count again); plan questions count per review** | active |
| D-119 | 2026-09-25 | 2026-09-24-memory | 3 | Your file (~/.reelplanning/you.jsonl) gets a summary only for a review recorded inside a git repo (the repo is named by its git top level), once per repo, plan and review, and `reel record` says so on one line each time ('a summary of this review added to …', 'already in …', or 'not in a git repo'), or a summary for every review recorded anywhere? (the agent's own call A9, accepted in the walkthrough) | **Your file (~/.reelplanning/you.jsonl) gets a summary only for a review recorded inside a git repo (the repo is named by its git top level), once per repo, plan and review, and `reel record` says so on one line each time ('a summary of this review added to …', 'already in …', or 'not in a git repo')** [visible, hard-to-undo, close] | active |
| D-120 | 2026-09-25 | 2026-09-24-memory | 3 | Across repos (`reel memory --you`) the fifth line is `flagged`, the kinds of call flagged or answered in own words, by tag, instead of misses, or misses across repos too? (the agent's own call A10, accepted in the walkthrough) | **Across repos (`reel memory --you`) the fifth line is `flagged`, the kinds of call flagged or answered in own words, by tag, instead of misses** [visible, close] | active |
| D-121 | 2026-09-25 | 2026-09-24-memory | 4 | A miss is recent while the plan that showed it is one of the last five plan folders, retros not counted, or a number of days, or until the next retro? (the agent's own call A11, accepted in the walkthrough) | **A miss is recent while the plan that showed it is one of the last five plan folders, retros not counted** [close] | active |
| D-122 | 2026-09-25 | 2026-09-24-memory | 4 | A call's kind is its tags and the components its step names; a recent miss stops a tagged call that shares a tag with it, or, when the miss has no tags (a plan question, or a call logged before tags), a component. An untagged call still never stops (D-084). Right now no miss has tags, so D-056 → D-063 (component player) stops every tagged player call: all 22 of answer-on-the-video's calls, and m3's step 6 stops 13 of this plan's 15, or tags only (every miss so far has none, so nothing would change); or making untagged calls stop too? (the agent's own call A12, accepted in the walkthrough) | **A call's kind is its tags and the components its step names; a recent miss stops a tagged call that shares a tag with it, or, when the miss has no tags (a plan question, or a call logged before tags), a component. An untagged call still never stops (D-084). Right now no miss has tags, so D-056 → D-063 (component player) stops every tagged player call: all 22 of answer-on-the-video's calls, and m3's step 6 stops 13 of this plan's 15** [visible, close] | active |
| D-123 | 2026-09-25 | 2026-09-24-memory | 4 | 'A part reworked soon after' is read as a step whose walkthrough quick check the reviewer disagreed with in their own words (it worked otherwise than the plan they approved led them to expect, and was reworked), traced to that step's plan questions; a call accepted in review whose row later says '(changed after review: …)' counts as an accepted call reversed. Not read from git history, or parts whose files a later commit changed within some days? (the agent's own call D1, accepted in the walkthrough) | **'A part reworked soon after' is read as a step whose walkthrough quick check the reviewer disagreed with in their own words (it worked otherwise than the plan they approved led them to expect, and was reworked), traced to that step's plan questions; a call accepted in review whose row later says '(changed after review: …)' counts as an accepted call reversed. Not read from git history** [deviation] | active |
| D-124 | 2026-09-25 | 2026-09-24-memory | 5 | A signal is one of: a question answered in own words for the same reason, a step rewound again after a revision, a quick check answered wrong on the same component, a miss of the same kind (tag, else component), a call flagged with the same tag; each counted over the plans since the last retro, and three of one makes a retro due, or any line's count reaching three (rewinds and wrong checks reach it in every repo)? (the agent's own call A13, accepted in the walkthrough) | **A signal is one of: a question answered in own words for the same reason, a step rewound again after a revision, a quick check answered wrong on the same component, a miss of the same kind (tag, else component), a call flagged with the same tag; each counted over the plans since the last retro, and three of one makes a retro due** [close] | active |
| D-125 | 2026-09-25 | 2026-09-24-memory | 5 | `reel retro` names its folder <date>-retro (then -retro-2 …); its draft cites the active plan decisions on the skill as in force, so `reel check` passes it as written; the benchmark's parts are found by their files, in the repo or else in reelplanning's own checkout, or a fixed list of what is missing; a draft that fails `reel check` until the agent cites decisions? (the agent's own call A14, accepted in the walkthrough) | **`reel retro` names its folder <date>-retro (then -retro-2 …); its draft cites the active plan decisions on the skill as in force, so `reel check` passes it as written; the benchmark's parts are found by their files, in the repo or else in reelplanning's own checkout** [visible] | active |
| D-126 | 2026-09-25 | 2026-09-24-memory | 3 | Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory, or failing the record; or keeping a pending copy in the repo to add later? (the agent's own call A15, answered in the reviewer's own words in the walkthrough) | **Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory** [visible, close] | own |
| D-127 | 2026-09-25 | 2026-09-25-videos-you-can-follow | 1 | Which words does the viewer see: plain new ones, or today's, explained? | **Plain words on screen** | active |
| D-128 | 2026-09-25 | 2026-09-25-videos-you-can-follow | 2 | Where is "you watched it" kept? | **This browser, and your file** | active |
| D-129 | 2026-09-25 | 2026-09-25-videos-you-can-follow | 3 | Can approving ever be blocked when you answered checks wrong? | **Never; it is recorded** | active |
| D-130 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 1 | The glossary's plain words are a fifth column, "On screen", read into each plan map `glossary[]` row as `display` (only where a row has one), with the on-screen word's forms after the term's in `forms`, so `forms[0]` stays the key, plus `definedIn`, or a separate mapping file; or `display` on every row? (the agent's own call A1, accepted in the walkthrough) | **The glossary's plain words are a fifth column, "On screen", read into each plan map `glossary[]` row as `display` (only where a row has one), with the on-screen word's forms after the term's in `forms`, so `forms[0]` stays the key, plus `definedIn`** [hard-to-undo] | active |
| D-131 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 1 | Plain words beyond D-127's six: answer bar, off-plan change, grouped scene, and "part of the system" for an area, or only the six D-127 names; or "part" for an area? (the agent's own call A2, accepted in the walkthrough) | **Plain words beyond D-127's six: answer bar, off-plan change, grouped scene, and "part of the system" for an area** [visible, close] | active |
| D-132 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 1 | The list of which video explains each word is `.reelplanning/terms-index.json`, written by a new `reelplanning terms-index` that finish-project runs after the plan map, the system video's scenes first, or a list inside every plan map; or worked out by the player? (the agent's own call A3, accepted in the walkthrough) | **The list of which video explains each word is `.reelplanning/terms-index.json`, written by a new `reelplanning terms-index` that finish-project runs after the plan map, the system video's scenes first** [hard-to-undo] | active |
| D-133 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 1 | The system video says the plain words throughout, not only where it defines them ("Chapter 2 of 5", choices, labels, scenes, "Question 1" on the decision mock); to stay under eight minutes the headless-run scene lost two sentences, the review loop's scene its "a plan's review hasn't made that trip yet", and rule two its reopened-by-hand story, or rename only the defining scenes; or let it run past eight minutes? (the agent's own call A4, accepted in the walkthrough) | **The system video says the plain words throughout, not only where it defines them ("Chapter 2 of 5", choices, labels, scenes, "Question 1" on the decision mock); to stay under eight minutes the headless-run scene lost two sentences, the review loop's scene its "a plan's review hasn't made that trip yet", and rule two its reopened-by-hand story** [visible] | superseded by the plan 2026-09-27-walkthroughs-that-help |
| D-134 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 2 | `reel prereqs` picks the system video's chapter by the words the plan's steps share with the chapter's scenes (and a second within 90% of it); the parts touched only break a tie, or the parts touched alone? (the agent's own call A5, accepted in the walkthrough) | **`reel prereqs` picks the system video's chapter by the words the plan's steps share with the chapter's scenes (and a second within 90% of it); the parts touched only break a tie** [close] | active |
| D-135 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 2 | A plan it builds on: its "Decisions in force" and "Supersedes" ids, except a bullet that says "not touched"; most decisions first, then the one cited first; only earlier plans; a decision on a call points at that plan's walkthrough video, or every id cited; or the newest plan first? (the agent's own call A6, accepted in the walkthrough) | **A plan it builds on: its "Decisions in force" and "Supersedes" ids, except a bullet that says "not touched"; most decisions first, then the one cited first; only earlier plans; a decision on a call points at that plan's walkthrough video** [close] | active |
| D-136 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 2 | `reel prereqs` writes the lines into the storyboard's front matter, replacing the `before:` lines there (`--dry-run` only prints; with no storyboard yet it prints them to paste), and keeps the files' `#part N` while reading `#chapter N` too, or print only, for the author to paste? (the agent's own call A7, accepted in the walkthrough) | **`reel prereqs` writes the lines into the storyboard's front matter, replacing the `before:` lines there (`--dry-run` only prints; with no storyboard yet it prints them to paste), and keeps the files' `#part N` while reading `#chapter N` too** [visible] | active |
| D-137 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 3 | `lost` is a sixth memory line beside `checks`, so `reel status` ends with at most six lines, not five; `checks` keeps the count, `lost` says it per plan with the rest, or `lost` replacing `checks`, keeping five lines? (the agent's own call A8, accepted in the walkthrough) | **`lost` is a sixth memory line beside `checks`, so `reel status` ends with at most six lines, not five; `checks` keeps the count, `lost` says it per plan with the rest** [visible, close] | active |
| D-138 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 3 | Two review fields for the player to send: `confusion.termsLookedUp` (the glossary keys opened) and `watched` (`[{ video, seen?, sent? }]`, the browser's marks, on the review or on a hosted row beside it); the reviewed video counts as watched at 80%, the player's own rule, or a count only (today's `termsOpened`); or only the reviewed video? (the agent's own call A9, accepted in the walkthrough) | **Two review fields for the player to send: `confusion.termsLookedUp` (the glossary keys opened) and `watched` (`[{ video, seen?, sent? }]`, the browser's marks, on the review or on a hosted row beside it); the reviewed video counts as watched at 80%, the player's own rule** [hard-to-undo] | active |
| D-139 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 3 | What your file knows (videos watched, words looked up) is the last line of `reel memory --you` and the "(your file: watched)" note of `reel prereqs`, not a memory line, or a memory line of its own? (the agent's own call A10, accepted in the walkthrough) | **What your file knows (videos watched, words looked up) is the last line of `reel memory --you` and the "(your file: watched)" note of `reel prereqs`, not a memory line** [close] | active |
| D-140 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 4 | "The answer was not shown": a word of the right answer (four letters or more, not a common word, stemmed, a number read as digits) that the `explained_at` scene, else the scene before the check, never says or shows; a warning, or an exact phrase; or any scene before the check? (the agent's own call A11, accepted in the walkthrough) | **"The answer was not shown": a word of the right answer (four letters or more, not a common word, stemmed, a number read as digits) that the `explained_at` scene, else the scene before the check, never says or shows; a warning** [close] | active |
| D-141 | 2026-09-26 | 2026-09-25-videos-you-can-follow | 4 | The id warning is for `explain` only; a `walk_me_through` may name a choice by its number beside its word ("choice A3 moved…"), or `explain` and `walk_me_through`? (the agent's own call A12, accepted in the walkthrough) | **The id warning is for `explain` only; a `walk_me_through` may name a choice by its number beside its word ("choice A3 moved…")** [close] | active |
| D-142 | 2026-09-26 | 2026-09-26-better-visuals | 3 | Which accent colour? | **A darker coral** | active |
| D-143 | 2026-09-26 | 2026-09-24-answer-on-the-video | 1 | The frame's cards are answered through transparent buttons the player lays over them in its own page, placed from each card's box in the frame (percent of the stage), with the hover and focus ring drawn by the player, or listeners and a hover style injected into the frame's own document? (the agent's own call A1, accepted in the walkthrough) | **The frame's cards are answered through transparent buttons the player lays over them in its own page, placed from each card's box in the frame (percent of the stage), with the hover and focus ring drawn by the player** [close] | active |
| D-144 | 2026-09-26 | 2026-09-24-answer-on-the-video | 1 | Cards are matched by data-option, then by data-plan-option (the letter the system video, every walkthrough check and the bob-dylan check already carry), then by an id ending -opt-a / -option-a / -choice-a / -chip-a, and only then by the order of the elements whose class ends in -opt; a rule counts only when it finds exactly one card per option, each with a box, or `data-option` then the order of `-opt` elements only? (the agent's own call A2, accepted in the walkthrough) | **Cards are matched by data-option, then by data-plan-option (the letter the system video, every walkthrough check and the bob-dylan check already carry), then by an id ending -opt-a / -option-a / -choice-a / -chip-a, and only then by the order of the elements whose class ends in -opt; a rule counts only when it finds exactly one card per option, each with a box** [close] | active |
| D-145 | 2026-09-26 | 2026-09-24-answer-on-the-video | 1 | A card on the frame shows its state as its button in the (hidden) sheet does: ticked or your answer ringed in ink, the right answer to an answered quick check in coral, with a small tag ("picked", "your answer", "the answer"); "recommended" is not tagged, the frame says it, or no state on the frame, only words in the strip? (the agent's own call A6, accepted in the walkthrough) | **A card on the frame shows its state as its button in the (hidden) sheet does: ticked or your answer ringed in ink, the right answer to an answered quick check in coral, with a small tag ("picked", "your answer", "the answer"); "recommended" is not tagged, the frame says it** [visible] | active |
| D-146 | 2026-09-26 | 2026-09-24-answer-on-the-video | 1 | "Show the frame" is kept in the strip, and there it puts the question aside: the strip folds to one line ("Still to answer") and the cards and keys stop answering, so the frame can be marked; a mark tool that is on also takes the clicks from the cards (changed after review: under the video the band folds to that one line in its kept room; in the frame it folds to a pill in the corner of the empty eighth, m3), or dropping "Show the frame" (the frame is no longer covered), or cards that answer while drawing? (the agent's own call A11, accepted in the walkthrough) | **"Show the frame" is kept in the strip, and there it puts the question aside: the strip folds to one line ("Still to answer") and the cards and keys stop answering, so the frame can be marked; a mark tool that is on also takes the clicks from the cards (changed after review: under the video the band folds to that one line in its kept room; in the frame it folds to a pill in the corner of the empty eighth, m3)** [close] | active |
| D-147 | 2026-09-26 | 2026-09-24-answer-on-the-video | 2 | A video leaves its lowest eighth for the band by data-band="bottom" on each frame's root (or once, on the video's own root); the band goes in the frame only when every frame that asks something carries it, decided once, when the runtime has mounted those frames (looked for up to about 8 s after ready); until then, and otherwise, it goes under the video, or a field in the storyboard's front matter lifted into the plan map, or a place decided per question? (the agent's own call A13, accepted in the walkthrough) | **A video leaves its lowest eighth for the band by data-band="bottom" on each frame's root (or once, on the video's own root); the band goes in the frame only when every frame that asks something carries it, decided once, when the runtime has mounted those frames (looked for up to about 8 s after ready); until then, and otherwise, it goes under the video** [visible, close] | active |
| D-148 | 2026-09-26 | 2026-09-24-answer-on-the-video | 2 | The band is an eighth of the video high, never under 72 px. Under the video its room (.bandroom) is kept for the whole video and the stage's height formula leaves exactly it (--band-k 8/9, --band-min 72 px), so the page still fits the window; what does not fit scrolls inside the band rather than growing it. On a phone it is in the page's flow, at least 104 px, and grows by a line when needed, or a band that grows with what it holds, or a fixed pixel height? (the agent's own call A14, accepted in the walkthrough) | **The band is an eighth of the video high, never under 72 px. Under the video its room (.bandroom) is kept for the whole video and the stage's height formula leaves exactly it (--band-k 8/9, --band-min 72 px), so the page still fits the window; what does not fit scrolls inside the band rather than growing it. On a phone it is in the page's flow, at least 104 px, and grows by a line when needed** [visible, close] | active |
| D-149 | 2026-09-26 | 2026-09-24-answer-on-the-video | 2 | The band's layout: two lines. First the kicker, the question in its own words on one line in the serif (the whole question in its title) and Show the frame; then the hint and the acts, the act that goes on (Continue, Confirm) at the right in ink. Answered, the feedback (two lines at most) takes the question's place. Type scales with the video (cqw): the question 15–22 px, buttons 30–40 px, or the question in full, wrapping; or the strip's one line? (the agent's own call A15, accepted in the walkthrough) | **The band's layout: two lines. First the kicker, the question in its own words on one line in the serif (the whole question in its title) and Show the frame; then the hint and the acts, the act that goes on (Continue, Confirm) at the right in ink. Answered, the feedback (two lines at most) takes the question's place. Type scales with the video (cqw): the question 15–22 px, buttons 30–40 px** [visible] | active |
| D-150 | 2026-09-26 | 2026-09-24-answer-on-the-video | 2 | In the frame, the captions are hidden while the band is up (not while it is folded), and come back when it goes, or leaving the captions? (the agent's own call A16, accepted in the walkthrough) | **In the frame, the captions are hidden while the band is up (not while it is folded), and come back when it goes** [visible, close] | active |
| D-151 | 2026-09-26 | 2026-09-24-answer-on-the-video | 2 | A call always gets the strip, though its frame has no cards: Accept (A) and Flag (B) in it, and the call's "Instead of", "Why" and "Check" leave the player for the kicker's tooltip, since the call's frame shows them (changed after review: the strip is now the band; what the call chose is its one line of words there, in the serif, and its Accept and Flag are clear buttons), or keeping the sheet for calls, or listing those facts in the strip? (the agent's own call A3, accepted in the walkthrough) | **A call always gets the strip, though its frame has no cards: Accept (A) and Flag (B) in it, and the call's "Instead of", "Why" and "Check" leave the player for the kicker's tooltip, since the call's frame shows them (changed after review: the strip is now the band; what the call chose is its one line of words there, in the serif, and its Accept and Flag are clear buttons)** [visible, close] | active |
| D-152 | 2026-09-26 | 2026-09-24-answer-on-the-video | 2 | A group of calls in the strip: Accept all, then one "Flag A21" per call, named by its id as the frame names it; what each chose and replaced is in its button's title (changed after review: in the band, with "N more calls from this part." as its line of words), or the sheet's list of the calls with a Flag on each row? (the agent's own call A4, accepted in the walkthrough) | **A group of calls in the strip: Accept all, then one "Flag A21" per call, named by its id as the frame names it; what each chose and replaced is in its button's title (changed after review: in the band, with "N more calls from this part." as its line of words)** [visible] | active |
| D-153 | 2026-09-26 | 2026-09-24-answer-on-the-video | 2 | On a touch screen the strip says "Tap a card." with no keys named, and its buttons drop their key caps (changed after review: the band's words; on a phone every key cap in the band goes, and its buttons are 44 px high), or the desktop wording ("Click a card, or press A, B or C.")? (the agent's own call A12, accepted in the walkthrough) | **On a touch screen the strip says "Tap a card." with no keys named, and its buttons drop their key caps (changed after review: the band's words; on a phone every key cap in the band goes, and its buttons are 44 px high)** [visible] | active |
| D-154 | 2026-09-26 | 2026-09-24-answer-on-the-video | 2 | While the strip is up the stage gives it its height, so the page still fits the window: the frame shrinks by the strip (about 52 px at 1440×1000; more while an answered quick check shows its explanation, which takes a second line). On a phone the strip is simply in the page's flow (changed after review: removed; the owner saw the video shrink and grow back. The band's room is kept for the whole video instead, A14, and the video never changes size), or keeping the frame's size and letting the page scroll under the strip? (the agent's own call A5, accepted in the walkthrough) | **While the strip is up the stage gives it its height, so the page still fits the window: the frame shrinks by the strip (about 52 px at 1440×1000; more while an answered quick check shows its explanation, which takes a second line). On a phone the strip is simply in the page's flow (changed after review: removed; the owner saw the video shrink and grow back. The band's room is kept for the whole video instead, A14, and the video never changes size)** [visible, close] | active |
| D-155 | 2026-09-26 | 2026-09-24-answer-on-the-video | 5 | The 10 s wait is for a quick check answered just now; a question met again, already answered, keeps 4 s, or 10 s for every answered question met again? (the agent's own call A17, accepted in the walkthrough) | **The 10 s wait is for a quick check answered just now; a question met again, already answered, keeps 4 s** [visible, close] | active |
| D-156 | 2026-09-26 | 2026-09-24-answer-on-the-video | 5 | "On the band" is the pointer over it, or the keyboard on any control in it but Continue; while held the count starts again from the top when let go, and the hint says "Waits while you are here". Only the band: the sheet (a frame with no cards) keeps counting under a resting pointer, or Continue counting too; or pausing and resuming the count where it was? (the agent's own call A18, accepted in the walkthrough) | **"On the band" is the pointer over it, or the keyboard on any control in it but Continue; while held the count starts again from the top when let go, and the hint says "Waits while you are here". Only the band: the sheet (a frame with no cards) keeps counting under a resting pointer** [close] | active |
| D-157 | 2026-09-26 | 2026-09-24-answer-on-the-video | 5 | "Back to where this was explained": explained_at is a frame number or a composition id, lifted into the plan map as that frame's start (explainedAt, explainedFrame; one naming no frame warns and is left out). Without it: the first beat of the check's plan_step before it that is not a branch or a quick check, else its part's start. The video plays from there at once. In the record it is on the answered quick checks' rows, the only ones listed there, or a time in seconds in the storyboard; landing paused? (the agent's own call A19, accepted in the walkthrough) | **"Back to where this was explained": explained_at is a frame number or a composition id, lifted into the plan map as that frame's start (explainedAt, explainedFrame; one naming no frame warns and is left out). Without it: the first beat of the check's plan_step before it that is not a branch or a quick check, else its part's start. The video plays from there at once. In the record it is on the answered quick checks' rows, the only ones listed there** [close] | active |
| D-158 | 2026-09-26 | 2026-09-24-answer-on-the-video | 5 | The trip back is sent as a rewind (D-005), or not counting it? (the agent's own call A20, accepted in the walkthrough) | **The trip back is sent as a rewind (D-005)** [close] | active |
| D-159 | 2026-09-26 | 2026-09-24-answer-on-the-video | 5 | Reached again after "Back to where this was explained", a quick check waits with no count even when it was answered, as when opened from its mark, or the usual 4 s for an answered one? (the agent's own call A21, accepted in the walkthrough) | **Reached again after "Back to where this was explained", a quick check waits with no count even when it was answered, as when opened from its mark** [visible] | active |
| D-160 | 2026-09-26 | 2026-09-24-answer-on-the-video | 5 | An open question the video leaves while playing (Play pressed with it up, or a seek away and then Play) gives way, and stops the video again when reached; a seek while paused still leaves it up, the frame moving under it; the rule that a question asked once and left open is never asked again is dropped, or closing it on any seek, or Play doing nothing while a question waits? (the agent's own call A22, accepted in the walkthrough) | **An open question the video leaves while playing (Play pressed with it up, or a seek away and then Play) gives way, and stops the video again when reached; a seek while paused still leaves it up, the frame moving under it; the rule that a question asked once and left open is never asked again is dropped** [close] | active |
| D-161 | 2026-09-26 | 2026-09-24-answer-on-the-video | 3 | "change" opens a small editor under the answer: the question's options (a click saves; a pick-all ticks, then "Save the picks") and a line for own words (Enter saves); Esc closes it unchanged; no "Explain this more" there. Changing it while that question is up on the video closes the question, or a select, or reopening the question on the video as before? (the agent's own call A7, accepted in the walkthrough) | **"change" opens a small editor under the answer: the question's options (a click saves; a pick-all ticks, then "Save the picks") and a line for own words (Enter saves); Esc closes it unchanged; no "Explain this more" there. Changing it while that question is up on the video closes the question** [visible] | active |
| D-162 | 2026-09-26 | 2026-09-24-answer-on-the-video | 3 | An answer that was in own words, changed in the record, drops the comment those words made at the question; new own words make a new one, or leaving the old comment, or rewording it in place? (the agent's own call A8, accepted in the walkthrough) | **An answer that was in own words, changed in the record, drops the comment those words made at the question; new own words make a new one** [close] | active |
| D-163 | 2026-09-26 | 2026-09-24-answer-on-the-video | 3 | A call's verdict switches with one link beside it, "accept instead" or "flag instead"; a call answered in own words can be switched to either, and its comment goes, or a toggle, or reopening the call on the video? (the agent's own call A9, accepted in the walkthrough) | **A call's verdict switches with one link beside it, "accept instead" or "flag instead"; a call answered in own words can be switched to either, and its comment goes** [close] | active |
| D-164 | 2026-09-26 | 2026-09-24-answer-on-the-video | 3 | After a send, "Send the change" is offered at the head of the record as well as in the Finish panel, on the local review page only, or the Finish panel only; or the hosted page too? (the agent's own call A10, accepted in the walkthrough) | **After a send, "Send the change" is offered at the head of the record as well as in the Finish panel, on the local review page only** [visible] | active |
| D-165 | 2026-09-26 | 2026-09-24-answer-on-the-video | 4 | The new spec plays four videos through (this plan's, the revise-loop plan and walkthrough, the system video); the other videos on the review page were checked once, by a script, for their cards being matched (all were), and are not in the spec, or every video on the review page in the spec? (the agent's own call D1, accepted in the walkthrough) | **The new spec plays four videos through (this plan's, the revise-loop plan and walkthrough, the system video); the other videos on the review page were checked once, by a script, for their cards being matched (all were), and are not in the spec** [deviation] | active |
| D-166 | 2026-09-26 | 2026-09-26-better-visuals | 1 | Which scenes must show the real thing? | **The brief picks** (not the recommendation) | active |
| D-167 | 2026-09-26 | 2026-09-26-better-visuals | 3 | Which look should the review page take? | **Today's, fixes only** (not the recommendation) | active |
| D-168 | 2026-09-26 | 2026-09-26-case-study | 2 | Do the text-only and HTML arms go all the way to a finished site? | **All the way, fixes included** | active |
| D-169 | 2026-09-26 | 2026-09-26-case-study | 3 | Who reviews each arm, and in what order? | **You, ours first** | active |
| D-170 | 2026-09-26 | 2026-09-26-case-study | 4 | How is where we end up judged? | **Rubric, blind judge, your rank** | active |
| D-171 | 2026-09-27 | 2026-09-26-contributing | 4 | How do decision numbers survive two branches? | **In order, a merge rule** | active |
| D-172 | 2026-09-27 | 2026-09-26-better-visuals | 1 | The pinned word is marked `data-gloss="<the thing's own word>"`, its text the plain word (`<em data-gloss="misses">late fixes</em>` on the `misses` token); frame-lint notes one outside any `data-artifact`, or a `data-pin` or `data-term` attribute, or the attribute holding the plain word? (the agent's own call A1, accepted in the walkthrough) | **The pinned word is marked `data-gloss="<the thing's own word>"`, its text the plain word (`<em data-gloss="misses">late fixes</em>` on the `misses` token); frame-lint notes one outside any `data-artifact`** [visible] | active |
| D-173 | 2026-09-27 | 2026-09-26-better-visuals | 1 | BRIEF.md's three lines are `- Medium:`, `- Layouts:`, `- Main transition:` under Customizations, a starting point at `templates/video/BRIEF.md`, and `build` warns (△) when one is missing, or skill text only? (the agent's own call A3, accepted in the walkthrough) | **BRIEF.md's three lines are `- Medium:`, `- Layouts:`, `- Main transition:` under Customizations, a starting point at `templates/video/BRIEF.md`, and `build` warns (△) when one is missing** [visible] | active |
| D-174 | 2026-09-27 | 2026-09-26-better-visuals | 1 | `variety` reads BRIEF.md's `- Real things:` as an optional fourth line: when there, `build` prints it as a ✓ line ("BRIEF.md picks the real things: …"); when not, nothing; build warnings stay the three existing lines, or not reading it at all, or warning when it is missing? (the agent's own call A25, accepted in the walkthrough) | **`variety` reads BRIEF.md's `- Real things:` as an optional fourth line: when there, `build` prints it as a ✓ line ("BRIEF.md picks the real things: …"); when not, nothing; build warnings stay the three existing lines** [visible] | active |
| D-175 | 2026-09-27 | 2026-09-26-better-visuals | 2 | The variety warning reads a scene's layout from a new optional `- layout:` storyboard line, else a `- blueprint:` other than `compose`; transitions by type (push-slide LEFT and UP are one); under 5 scenes is not judged; `build` prints it after the length, or reading `- blueprint:` alone? (the agent's own call A7, accepted in the walkthrough) | **The variety warning reads a scene's layout from a new optional `- layout:` storyboard line, else a `- blueprint:` other than `compose`; transitions by type (push-slide LEFT and UP are one); under 5 scenes is not judged; `build` prints it after the length** [visible, close] | active |
| D-176 | 2026-09-27 | 2026-09-26-better-visuals | 3 | The dark theme's coral is `#D2693F` (same hue, lighter: 5.2:1 on the dark paper, 4.5 and 4.0 on its tiles), light stays `#B8552E` (4.6 on paper, 4.0 and 3.8 on the tiles), or `#B8552E` in both themes? (the agent's own call A9, accepted in the walkthrough) | **The dark theme's coral is `#D2693F` (same hue, lighter: 5.2:1 on the dark paper, 4.5 and 4.0 on its tiles), light stays `#B8552E` (4.6 on paper, 4.0 and 3.8 on the tiles)** [visible, close] | active |
| D-177 | 2026-09-27 | 2026-09-26-better-visuals | 3 | The page's fonts are today's three families (Inter, EB Garamond, JetBrains Mono) as fontsource 5.3.0's variable latin woff2, upright only (133 KB with their OFL texts), committed in `packages/player/fonts/`, or an npm devDependency (@fontsource-variable/*), which an `npx reelplanning` install does not carry, or the videos' static 400/700 files, which have no 500/600 for the chrome's weights; italics (+143 KB) left out? (the agent's own call A21, accepted in the walkthrough) | **The page's fonts are today's three families (Inter, EB Garamond, JetBrains Mono) as fontsource 5.3.0's variable latin woff2, upright only (133 KB with their OFL texts), committed in `packages/player/fonts/`** [hard-to-undo] | active |
| D-178 | 2026-09-27 | 2026-09-26-better-visuals | 3 | The right answer to a quick check takes a `--right` token, ink by default: a 4 px ink ring on its card, its why ringed in ink and headed "✓ The answer"; your wrong pick keeps its ink why and gets "✕", and its card a dashed ring (the tick and cross are CSS content, so the words in the page, which the specs read, are unchanged), or staying coral (D-145), which D-142 now keeps for what is yours, or Reading desk's green (a new hue, one look's choice)? (the agent's own call A23, accepted in the walkthrough) | **The right answer to a quick check takes a `--right` token, ink by default: a 4 px ink ring on its card, its why ringed in ink and headed "✓ The answer"; your wrong pick keeps its ink why and gets "✕", and its card a dashed ring (the tick and cross are CSS content, so the words in the page, which the specs read, are unchanged)** [visible] | active |
| D-179 | 2026-09-27 | 2026-09-26-better-visuals | 3 | Where coral stays and where it goes: it stays on the questions waiting on the timeline, the waiting status, "Changed" (to rewatch), your flags, your own words, your marks, Mark while on, the card under your pointer or focus, "Still to answer" and resend; it leaves the current part's number, the current step and record row, the current video in the Videos list, the Terms panel's "this scene" bar, links (ink, underlined), the agent's "recommended", a size or speed off its default, "Copied", "Sent", "Watched" and the walk-through's kicker, or a lighter pass that only darkens the colour? (the agent's own call A24, accepted in the walkthrough) | **Where coral stays and where it goes: it stays on the questions waiting on the timeline, the waiting status, "Changed" (to rewatch), your flags, your own words, your marks, Mark while on, the card under your pointer or focus, "Still to answer" and resend; it leaves the current part's number, the current step and record row, the current video in the Videos list, the Terms panel's "this scene" bar, links (ink, underlined), the agent's "recommended", a size or speed off its default, "Copied", "Sent", "Watched" and the walk-through's kicker** [visible] | active |
| D-180 | 2026-09-27 | 2026-09-26-better-visuals | 3 | Small coral text (`--rp-coral-deep`) becomes `#9C4524` on cream (5.0:1 on the darker tile), `#E3A184` kept for dark; the detail pages' templates (`templates/details/*.html`) keep `#CC785C` for now, or recolouring the detail templates now? (the agent's own call A10, accepted in the walkthrough) | **Small coral text (`--rp-coral-deep`) becomes `#9C4524` on cream (5.0:1 on the darker tile), `#E3A184` kept for dark; the detail pages' templates (`templates/details/*.html`) keep `#CC785C` for now** [close] | active |
| D-181 | 2026-09-27 | 2026-09-26-better-visuals | 3 | The faces are one manifest, `packages/player/fonts/faces.json` (roles sans/serif/mono → family + fallback; faces → file, weight, style, range, licence). The player declares them in the page's `<head>` itself (a `<style data-rp-fonts>`, and `--rp-sans/--rp-serif/--rp-mono` on `:root` that its `--sans/--serif/--mono` read); the bundle copies the files and licences to `fonts/`, inlines the manifest in the page and preloads the files, so the declaration is synchronous there, or the bundle writing the `@font-face` rules itself (a second builder, and a dev page or any other host of the player without fonts), or a hand-written fonts.css beside a list? (the agent's own call A22, accepted in the walkthrough) | **The faces are one manifest, `packages/player/fonts/faces.json` (roles sans/serif/mono → family + fallback; faces → file, weight, style, range, licence). The player declares them in the page's `<head>` itself (a `<style data-rp-fonts>`, and `--rp-sans/--rp-serif/--rp-mono` on `:root` that its `--sans/--serif/--mono` read); the bundle copies the files and licences to `fonts/`, inlines the manifest in the page and preloads the files, so the declaration is synchronous there** [close] | active |
| D-182 | 2026-09-27 | 2026-09-26-better-visuals |  | Past Fit the stage keeps Fit's box and the picture is zoomed inside it, in a view that scrolls (`.zport` > `.zin`, `--zoom-k`): the player, the drawing canvas, the cards' buttons, a mark's words and, while zoomed, the answer-on-frame layer are inside the picture and move with it; the band, the sheets, the chips, the poster and the corner stay on the view; a card's "More" and a word's meaning close when the view scrolls, or growing the stage itself inside a scrolling box (the band, chips and corner would scroll away with it), or a CSS transform on the stage (text in the band would grow and every rect-based placement would mix scaled and unscaled boxes)? (the agent's own call A30, accepted in the walkthrough) | **Past Fit the stage keeps Fit's box and the picture is zoomed inside it, in a view that scrolls (`.zport` > `.zin`, `--zoom-k`): the player, the drawing canvas, the cards' buttons, a mark's words and, while zoomed, the answer-on-frame layer are inside the picture and move with it; the band, the sheets, the chips, the poster and the corner stay on the view; a card's "More" and a word's meaning close when the view scrolls** [visible] | active |
| D-183 | 2026-09-27 | 2026-09-26-better-visuals |  | A question asked while zoomed in keeps the zoom; the view scrolls once to it: its heading and cards where both fit in the view, else the cards (centred where they fit, else their top-left corner; clear of the band's eighth where the band is in the frame), or resetting to Fit while a question is up? (the agent's own call A31, accepted in the walkthrough) | **A question asked while zoomed in keeps the zoom; the view scrolls once to it: its heading and cards where both fit in the view, else the cards (centred where they fit, else their top-left corner; clear of the band's eighth where the band is in the frame)** [visible] | active |
| D-184 | 2026-09-27 | 2026-09-26-better-visuals |  | When no why fits anywhere by the cards ("none"), each card's verdict ("Your answer · not quite, it is B", "The answer") rides on its card's tag on the top edge (the ink tag the cards already had, ✕ or ✓ before it), and "Read why in full" opens the words, or hiding the verdicts and leaving the rings alone to say it? (the agent's own call A35, accepted in the walkthrough) | **When no why fits anywhere by the cards ("none"), each card's verdict ("Your answer · not quite, it is B", "The answer") rides on its card's tag on the top edge (the ink tag the cards already had, ✕ or ✓ before it), and "Read why in full" opens the words** [visible] | active |
| D-185 | 2026-09-27 | 2026-09-26-better-visuals |  | The names list is its own file, `.reelplanning/names.md` (template `templates/reelplanning/names.md`; `reel init` copies it; a repo with none uses the package's), read by `scripts/lib/names.mjs`, or a "Names" section in `glossary.md`? (the agent's own call A40, accepted in the walkthrough) | **The names list is its own file, `.reelplanning/names.md` (template `templates/reelplanning/names.md`; `reel init` copies it; a repo with none uses the package's), read by `scripts/lib/names.mjs`** [hard-to-undo] | active |
| D-186 | 2026-09-27 | 2026-09-26-better-visuals |  | Code (chip, own spelling): `reelplanning`, `reel`, `hyperframes`, `npm`, `npx`, `git`, `claude` (lowercase: the command), `codex`, `opencode`, `ffmpeg`. Plain, with their case: HyperFrames (the framework), GitHub, Claude, Claude Code, Kokoro, Whisper, GSAP, CLI, JSON, JSONL, HTML, CSS, TTS, API, URL, macOS; a plain name has its case fixed and is not highlighted (the question left at the fifth call; stands as built), or Whisper as code; `reel` left out (it is also an English word); plain names in bold, in full ink? (the agent's own call A41, accepted in the walkthrough) | **Code (chip, own spelling): `reelplanning`, `reel`, `hyperframes`, `npm`, `npx`, `git`, `claude` (lowercase: the command), `codex`, `opencode`, `ffmpeg`. Plain, with their case: HyperFrames (the framework), GitHub, Claude, Claude Code, Kokoro, Whisper, GSAP, CLI, JSON, JSONL, HTML, CSS, TTS, API, URL, macOS; a plain name has its case fixed and is not highlighted (the question left at the fifth call; stands as built)** [visible, close] | active |
| D-187 | 2026-09-27 | 2026-09-26-better-visuals |  | The caption markup is `<code class="cap-code">` inside the word's own span: JetBrains Mono at 0.8em on a `--rp-tile-2` chip, its colour following the karaoke state. A command's next words join the same chip (`reel status`, `npx reelplanning build`), with punctuation outside it, or the name alone as a chip (`reel` status); a full-ink chip ahead of the spoken word? (the agent's own call A42, accepted in the walkthrough) | **The caption markup is `<code class="cap-code">` inside the word's own span: JetBrains Mono at 0.8em on a `--rp-tile-2` chip, its colour following the karaoke state. A command's next words join the same chip (`reel status`, `npx reelplanning build`), with punctuation outside it** [visible] | active |
| D-188 | 2026-09-27 | 2026-09-26-better-visuals |  | The on-screen check lives in check-terms as a △ warning that never fails. It flags a code name outside `<code>`/`<pre>`/`<kbd>`/`<samp>` or a mono face, and a listed name spelled another way. Text inside a `data-artifact` and words inside a path are left alone, or a frame-lint finding? (the agent's own call A43, accepted in the walkthrough) | **The on-screen check lives in check-terms as a △ warning that never fails. It flags a code name outside `<code>`/`<pre>`/`<kbd>`/`<samp>` or a mono face, and a listed name spelled another way. Text inside a `data-artifact` and words inside a path are left alone** [visible] | active |
| D-189 | 2026-09-27 | 2026-09-26-better-visuals |  | Moving around: the view's own (thin) scroll bars, the wheel and a trackpad; the wheel over what sits on the view (the poster's play button, the chips, the corner) is passed to the view; no drag-to-pan; the arrow keys stay the player's (seek), or drag-to-pan, or arrow keys that pan? (the agent's own call A32, accepted in the walkthrough) | **Moving around: the view's own (thin) scroll bars, the wheel and a trackpad; the wheel over what sits on the view (the poster's play button, the chips, the corner) is passed to the view; no drag-to-pan; the arrow keys stay the player's (seek)** [close] | active |
| D-190 | 2026-09-27 | 2026-09-26-better-visuals |  | The corner's drag scales the size by the corner's move as a share of the stage's box from where it started (the same as before at Fit and under, where the corner stays under the pointer; dragged out from Fit it zooms in); `=`/`-` step 5% up to Fit and 25% past it, to 200% and 40% (**changed after the owner's answer** to the question left at the fifth call: 5% everywhere at first; `981f364`); the slider has a tick at Fit; a change of zoom keeps the middle of the view in the middle; a phone ignores a stored zoom, or a separate zoom control? (the agent's own call A33, accepted in the walkthrough) | **The corner's drag scales the size by the corner's move as a share of the stage's box from where it started (the same as before at Fit and under, where the corner stays under the pointer; dragged out from Fit it zooms in); `=`/`-` step 5% up to Fit and 25% past it, to 200% and 40% (**changed after the owner's answer** to the question left at the fifth call: 5% everywhere at first; `981f364`); the slider has a tick at Fit; a change of zoom keeps the middle of the view in the middle; a phone ignores a stored zoom** [close] | active |
| D-191 | 2026-09-27 | 2026-09-26-better-visuals |  | Cause: `layoutFrame` laid each why (and the note on your pick) under its card and only checked that it stayed above the frame's foot, never whether it met the card under it, so with cards stacked in a column the whys sat over the next card's words. Now a try whose whys or note meet another card or another why is passed over, like one that runs past the foot (the old last try, verdicts only under the cards whatever the room, included); then come "longin" (verdicts only, in each card's corner under its words) and last "none". Where nothing meets a card the tries and their order are as before, so cards in a row lay out as they did (the row still folds behind "…" at 1024 × 660), or shrinking the whys to fit the gap between cards, or covering each card whole with its why? (the agent's own call A34, accepted in the walkthrough) | **Cause: `layoutFrame` laid each why (and the note on your pick) under its card and only checked that it stayed above the frame's foot, never whether it met the card under it, so with cards stacked in a column the whys sat over the next card's words. Now a try whose whys or note meet another card or another why is passed over, like one that runs past the foot (the old last try, verdicts only under the cards whatever the room, included); then come "longin" (verdicts only, in each card's corner under its words) and last "none". Where nothing meets a card the tries and their order are as before, so cards in a row lay out as they did (the row still folds behind "…" at 1024 × 660)** [close] | active |
| D-192 | 2026-09-27 | 2026-09-26-better-visuals |  | `reel audit` counts a step's question as asked when it is already answered in the decision log (a decision of this plan on that step), as it counts one still open in `plan.md`, or counting only `plan.md`'s open questions? (the agent's own call A44, accepted in the walkthrough) | **`reel audit` counts a step's question as asked when it is already answered in the decision log (a decision of this plan on that step), as it counts one still open in `plan.md`** [close] | active |
| D-193 | 2026-09-27 | 2026-09-26-better-visuals |  | Calls outside the plan's steps are counted per ask, by their step column's word ("zoom" 4, "overlap" 2, "captions" 4), and an ask at its fifth call is a warning (its question goes to the owner, not `plan.md`); the load warning names the busiest step or ask, or lumping them as one step "?" (10 calls here, a failure no question could answer)? (the agent's own call A45, accepted in the walkthrough) | **Calls outside the plan's steps are counted per ask, by their step column's word ("zoom" 4, "overlap" 2, "captions" 4), and an ask at its fifth call is a warning (its question goes to the owner, not `plan.md`); the load warning names the busiest step or ask** [close] | active |
| D-194 | 2026-09-27 | 2026-09-27-details-in-the-frame | 2 | What shows that a thing on the frame opens a page? | **A tab, the whole time** | superseded by D-266 |
| D-195 | 2026-09-27 | 2026-09-27-details-in-the-frame | 3 | Where does a detail open once you click the thing? | **Over the frame, from the block** | active, supersedes D-021 |
| D-196 | 2026-09-27 | 2026-09-27-details-in-the-frame | 4 | What becomes of the corner chip on a rebuilt video? | **It goes where a thing is marked** | active |
| D-197 | 2026-09-27 | 2026-09-27-conversation |  | When does a quick check come, and on what case? | **Later, on a new case** | active |
| D-198 | 2026-09-27 | 2026-09-27-conversation |  | What does the build do about a check asked too soon, or on the case just shown? | **Two warnings** | active |
| D-199 | 2026-09-27 | 2026-09-27-conversation |  | Which videos take the new quick checks, and when? | **New and revised, and the system video now** (not the recommendation) | active |
| D-200 | 2026-09-27 | 2026-09-26-contributing | 1 | How much does a PR ask of its contributor? | **Asked; the maintainer can make it** | active |
| D-201 | 2026-09-27 | 2026-09-26-contributing | 2 | When the maintainer disagrees with an answer from the contributor's plan, what does the decision log keep? | **The last answer** | active |
| D-202 | 2026-09-27 | 2026-09-26-contributing | 3 | How much does the maintainer check before trusting a contributor's video? | **CI's, and a code check** | active |
| D-203 | 2026-09-27 | 2026-09-27-details-in-the-frame | 1 | `frame-lint` measures a marked thing from the frame's CSS (px `left`/`top`/`width`/`height`, insets, its parents'), padding counted unless `border-box`; a mark whose size or place the CSS does not say is a note, not a finding, or measuring each frame in a browser, or failing an unmeasured mark? (the agent's own call A1, accepted in the walkthrough) | **`frame-lint` measures a marked thing from the frame's CSS (px `left`/`top`/`width`/`height`, insets, its parents'), padding counted unless `border-box`; a mark whose size or place the CSS does not say is a note, not a finding** [close] | active |
| D-204 | 2026-09-27 | 2026-09-27-details-in-the-frame | 1 | Two things marked with one name in a frame fail `frame-lint`, or a note, or the player taking the first? (the agent's own call A2, accepted in the walkthrough) | **Two things marked with one name in a frame fail `frame-lint`** [close] | active |
| D-205 | 2026-09-27 | 2026-09-27-details-in-the-frame | 2 | "Landed" is read from the frame as it plays: the thing and everything holding it shown, at full opacity (≥ 0.95); until then there is neither the button nor the chip, or the end of its reveal read from the scene's timeline, or the button from the scene's start? (the agent's own call A3, accepted in the walkthrough) | **"Landed" is read from the frame as it plays: the thing and everything holding it shown, at full opacity (≥ 0.95); until then there is neither the button nor the chip** [visible, close] | active |
| D-206 | 2026-09-27 | 2026-09-27-details-in-the-frame | 2 | The button hides for as long as a question's box is up, an answered quick check counting down included, and comes back when it closes, or only while the question is unanswered? (the agent's own call A5, accepted in the walkthrough) | **The button hides for as long as a question's box is up, an answered quick check counting down included, and comes back when it closes** [visible] | superseded by D-246 |
| D-207 | 2026-09-27 | 2026-09-27-details-in-the-frame | 2 | The button stays in the picture's layer, and the tab order reaches it by a hop: Tab from Play goes to it, Tab from it to what follows Play, Shift+Tab back (`tabHop`), or moving the button after the controls in the page and placing it by script? (the agent's own call A4, accepted in the walkthrough) | **The button stays in the picture's layer, and the tab order reaches it by a hop: Tab from Play goes to it, Tab from it to what follows Play, Shift+Tab back (`tabHop`)** [close] | active |
| D-208 | 2026-09-27 | 2026-09-27-details-in-the-frame | 3 | Every way in opens the page over the frame, the chip's and the plan text's too, grown from what was clicked (the chip, the thing; a list's opens without growing); the Terms and the band's long words keep the side panel, or over the frame only from the thing, the side panel from the chip and the list? (the agent's own call A6, accepted in the walkthrough) | **Every way in opens the page over the frame, the chip's and the plan text's too, grown from what was clicked (the chip, the thing; a list's opens without growing); the Terms and the band's long words keep the side panel** [visible, close] | active |
| D-209 | 2026-09-27 | 2026-09-27-details-in-the-frame | 3 | The ink ring is on the thing's button while its page is open, under the page (which covers the frame, D-195): it shows as the page grows and shrinks, and focus is on it once closed, or keeping the ring a few seconds after the page closes? (the agent's own call A8, accepted in the walkthrough) | **The ink ring is on the thing's button while its page is open, under the page (which covers the frame, D-195): it shows as the page grows and shrinks, and focus is on it once closed** [visible, close] | active |
| D-210 | 2026-09-27 | 2026-09-27-details-in-the-frame | 3 | O is logged by the way the scene offers: `from: "frame"` where its thing is marked, `"chip"` where the chip shows; a comment's link to its page in the record counts as `"list"`, or a fourth value for the key? (the agent's own call A7, accepted in the walkthrough) | **O is logged by the way the scene offers: `from: "frame"` where its thing is marked, `"chip"` where the chip shows; a comment's link to its page in the record counts as `"list"`** [close] | active |
| D-211 | 2026-09-27 | 2026-09-27-details-in-the-frame |  | Each own-words field grows with its words to a cap and then scrolls inside the same box: 3 lines for the two note fields under an answer (the note on an answer, "Expected something else?"), 4 for the others (your own answer, a call's own words, the comment line, the record's editor); a note field is as wide as its placeholder, never its words, or one cap for every field, or growing with no cap? (the agent's own call A9, accepted in the walkthrough) | **Each own-words field grows with its words to a cap and then scrolls inside the same box: 3 lines for the two note fields under an answer (the note on an answer, "Expected something else?"), 4 for the others (your own answer, a call's own words, the comment line, the record's editor); a note field is as wide as its placeholder, never its words** [visible] | active |
| D-212 | 2026-09-27 | 2026-09-27-details-in-the-frame |  | Enter still saves (or keeps a note) and Shift+Enter starts a new line; what is saved keeps its line breaks, runs of spaces folded to one and three or more breaks to two (`keepLines`), and the record's quick-check note no longer folds them away, or Enter for a new line with a button to save, or every break folded to a space as before? (the agent's own call A10, accepted in the walkthrough) | **Enter still saves (or keeps a note) and Shift+Enter starts a new line; what is saved keeps its line breaks, runs of spaces folded to one and three or more breaks to two (`keepLines`), and the record's quick-check note no longer folds them away** [visible, close] | active |
| D-213 | 2026-09-27 | 2026-09-26-contributing | 3 | Where does a PR's built video live? | **Attached to the PR, as a zip** | active |
| D-214 | 2026-09-27 | 2026-09-26-contributing | 1 | When does a PR need a video? | **Choices or size only** | superseded by D-223 |
| D-215 | 2026-09-27 | 2026-09-26-contributing | 3 | How does a PR's built video reach the maintainer? | **A throwaway branch** | active |
| D-216 | 2026-09-27 | 2026-09-27-conversation |  | What gets labelled? | **The build finds it** (not the recommendation) | active |
| D-217 | 2026-09-27 | 2026-09-27-conversation |  | What does check-terms do with a likely-jargon word said or shown with no meaning? | **Warn, fail on strict** | active |
| D-218 | 2026-09-27 | 2026-09-27-conversation |  | How long does a labelled word stay underlined? | **Stop once you know it** | active |
| D-219 | 2026-09-27 | 2026-09-27-walkthroughs-that-help | 1 | What replaces today's walkthrough video? | **A short video of it running** | active |
| D-220 | 2026-09-27 | 2026-09-27-walkthroughs-that-help | 2 | Which choices make it pause? | **i dont like specifically saying 'five' i mean i think there's a lot that changes per plan i dont think being too specific is good** (not the recommendation) | active, supersedes D-084 |
| D-221 | 2026-09-27 | 2026-09-27-walkthroughs-that-help | 2 | What does Approve make of a choice on the list? | **Listed, not judged** | active, supersedes D-041 |
| D-222 | 2026-09-27 | 2026-09-27-walkthroughs-that-help | 3 | Does the walkthrough test you? | **Where there's something to predict** | active, supersedes D-083 |
| D-223 | 2026-09-27 | 2026-09-27-walkthroughs-that-help | 4 | Does a small pull request's choice need the video? | **Only a choice you'd notice** | active, supersedes D-214 |
| D-224 | 2026-09-27 | 2026-09-27-walkthroughs-that-help | 5 | How do the plan and what was built sit together? | **One row, a Plan | Built switch** | active |
| D-225 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 2 | What becomes of a fresh-eyes finding nobody has answered? | **Answered before you see it** | active |
| D-226 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 3 | How do you find out what a phrase means? | **Those, and Ask about this** | active |
| D-227 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 5 | Which videos get fresh eyes? | **Every new one, and the system video now** | active |
| D-228 | 2026-09-28 | 2026-09-28-plan-guide | 3 | Where does the guide open from the video? | **Its own page, a click away** | superseded by D-264 |
| D-229 | 2026-09-28 | 2026-09-28-plan-guide | 4 | What does an edit on the guide do? | **Suggested edits, applied exactly** | active |
| D-230 | 2026-09-28 | 2026-09-28-plan-guide | 5 | How much guide does each plan get? | **Every plan, with a Built side** | active |
| D-231 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 2 | What is left after the third round is that round's findings the author kept (not those given a meaning, which a click explains, nor those fixed), each with the reason: on the page's Before you watch, under the videos to watch first ("Left as they are: … Kept: …"), shown even when every video before it was watched, three on the card and the rest behind "N more" (the system video's third round left 32), and in the notification's line ("2 things fresh eyes left as they are"), or every finding of every round, or a line with only the count? (the agent's own call A6, accepted in the walkthrough) | **What is left after the third round is that round's findings the author kept (not those given a meaning, which a click explains, nor those fixed), each with the reason: on the page's Before you watch, under the videos to watch first ("Left as they are: … Kept: …"), shown even when every video before it was watched, three on the card and the rest behind "N more" (the system video's third round left 32), and in the notification's line ("2 things fresh eyes left as they are")** [visible] | active |
| D-232 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 3 | Ask about this opens in the side panel (where Terms and details open), about the scene on screen, the video paused: from an Ask button beside Terms and the key Q, from a plain caption word clicked (its caption quoted in the panel), and from an underlined word's card ("Still unclear? Ask about this", the word in the box); a click elsewhere on the frame does what it did, or a box laid over the frame, or a click anywhere on the frame opening it? (the agent's own call A8, accepted in the walkthrough) | **Ask about this opens in the side panel (where Terms and details open), about the scene on screen, the video paused: from an Ask button beside Terms and the key Q, from a plain caption word clicked (its caption quoted in the panel), and from an underlined word's card ("Still unclear? Ask about this", the word in the box); a click elsewhere on the frame does what it did** [visible] | active |
| D-233 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 3 | On your machine, a question goes to the session waiting on `review --wait`, which wakes on it as on a review (`inbox/questions/<id>.json`) and answers with `reelplanning inbox answer <id> "…" --from "…"`; the page asks for the answer every 2 s for two minutes at most; with no session waiting nothing is written and no headless run starts: it goes with the review, or starting the headless agent command on a question, or a question file left for a session that starts later? (the agent's own call A10, accepted in the walkthrough) | **On your machine, a question goes to the session waiting on `review --wait`, which wakes on it as on a review (`inbox/questions/<id>.json`) and answers with `reelplanning inbox answer <id> "…" --from "…"`; the page asks for the answer every 2 s for two minutes at most; with no session waiting nothing is written and no headless run starts: it goes with the review** [visible, close] | active |
| D-234 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 3 | Every question is kept in the review as `questions: [{ id, question, t, frame, planStep, askedAt, quote?, answer?, from?, via?, answeredAt?, note? }]`, `answered: false` where it has no answer (the page's own state and the review server's id for a question, `status` and `askId`, are left out); `reviews/<id>.md` lists them under "Questions you asked", an unanswered one "to answer in the next version", an answered one still "make it plain there too", or only the unanswered ones, or questions as comments on their step? (the agent's own call A11, accepted in the walkthrough) | **Every question is kept in the review as `questions: [{ id, question, t, frame, planStep, askedAt, quote?, answer?, from?, via?, answeredAt?, note? }]`, `answered: false` where it has no answer (the page's own state and the review server's id for a question, `status` and `askId`, are left out); `reviews/<id>.md` lists them under "Questions you asked", an unanswered one "to answer in the next version", an answered one still "make it plain there too"** [hard-to-undo] | active |
| D-235 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 1 | A finding is one line, `- N1 · scene 4 · "the phrase": what, why`, its phrase in double quotes; the author's answer is the indented line under it, `- Answer: fixed: …`, `meaning: …` or `kept: <the reason>`, and `verify` reads both, or a table per file, or the answers in a file of their own beside the findings? (the agent's own call A1, listed, not judged, in the walkthrough) | **A finding is one line, `- N1 · scene 4 · "the phrase": what, why`, its phrase in double quotes; the author's answer is the indented line under it, `- Answer: fixed: …`, `meaning: …` or `kept: <the reason>`, and `verify` reads both** [close] | listed |
| D-236 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 1 | The pictures: the video packed with `bundle-player` and opened in headless Chromium at 1440 × 900, the Before you watch card dismissed, each scene seeked 0.4 s before its end (0.12 s at first; changed after the system video's look, whose designer read the next scene's first caption, already up, as this one's) and the player's stage photographed; without `playwright-core`, the frames alone from HyperFrames' snapshot, and the brief says the player's tab and chips are not in them, or the page at another size, or the frames alone every time? (the agent's own call A2, listed, not judged, in the walkthrough) | **The pictures: the video packed with `bundle-player` and opened in headless Chromium at 1440 × 900, the Before you watch card dismissed, each scene seeked 0.4 s before its end (0.12 s at first; changed after the system video's look, whose designer read the next scene's first caption, already up, as this one's) and the player's stage photographed; without `playwright-core`, the frames alone from HyperFrames' snapshot, and the brief says the player's tab and chips are not in them** [close] | listed |
| D-237 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 1 | What the agents saw is kept per scene in `fresh-eyes/stamp.json` (its narration line and its frame's HTML, hashed), so `verify` names the scenes changed since they looked, or one hash for the whole video, or a stamp line in each findings file only? (the agent's own call A3, listed, not judged, in the walkthrough) | **What the agents saw is kept per scene in `fresh-eyes/stamp.json` (its narration line and its frame's HTML, hashed), so `verify` names the scenes changed since they looked** [close] | listed |
| D-238 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 1 | "Viewers were lost on these before" is read from every review in the repo (the plans' and the system video's), newest first, at most 40: words looked up, "Explain this more", an answer, comment or check note that asks what something means ("wdym", "confused", "what do you mean"), checks missed, and questions asked on the page, or only `reel memory lost`'s lines (words looked up in three reviews or more), or the reviewer's file across repos? (the agent's own call A4, listed, not judged, in the walkthrough) | **"Viewers were lost on these before" is read from every review in the repo (the plans' and the system video's), newest first, at most 40: words looked up, "Explain this more", an answer, comment or check note that asks what something means ("wdym", "confused", "what do you mean"), checks missed, and questions asked on the page** [close] | listed |
| D-239 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 2 | Only a finding with no answer (or a bad one) stops the build; no run yet, agents not back yet, or scenes changed since they looked is a △ line, and `build` shows what verify read of fresh eyes as a line of its own, or stopping on no run too, or on scenes changed since? (the agent's own call A5, listed, not judged, in the walkthrough) | **Only a finding with no answer (or a bad one) stops the build; no run yet, agents not back yet, or scenes changed since they looked is a △ line, and `build` shows what verify read of fresh eyes as a line of its own** [close] | listed |
| D-240 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 2 | An answer is checked, not just present: `meaning` needs its quoted phrase in the glossary (Other words included) or the storyboard's `terms:`, `fixed` needs where (two words or more), `kept` a reason (three words or more), or any answer word passing? (the agent's own call A7, listed, not judged, in the walkthrough) | **An answer is checked, not just present: `meaning` needs its quoted phrase in the glossary (Other words included) or the storyboard's `terms:`, `fixed` needs where (two words or more), `kept` a reason (three words or more)** [close] | listed |
| D-241 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 3 | On a hosted page, one `sample` call per question, on a click only, on the quick tier: its input is the instructions (answer only from this, plain words, two to five sentences, say so when it isn't there), the question, the scene's narration and the words on its frame, its plan step's text (else the plan's problem), and the glossary rows the question and scene mention (with this video's own words); the answer's last line, "From: …", shows under it; `not_granted` and the other refusals hide the hosted path for the view, `rate_limited` is said and never retried, or the default tier (it thinks first, 5 to 60 s), or the whole glossary and plan in every call? (the agent's own call A9, listed, not judged, in the walkthrough) | **On a hosted page, one `sample` call per question, on a click only, on the quick tier: its input is the instructions (answer only from this, plain words, two to five sentences, say so when it isn't there), the question, the scene's narration and the words on its frame, its plan step's text (else the plan's problem), and the glossary rows the question and scene mention (with this video's own words); the answer's last line, "From: …", shows under it; `not_granted` and the other refusals hide the hosted path for the view, `rate_limited` is said and never retried** [close] | listed |
| D-242 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 4 | Rule 1 in `frame-lint`: a bar is an element with no text, under 12 px high, over 120 px wide and filled; bars stand where words go when two or more are in a box with no text, one after another in a box's flow, or stacked (left edges within 24 px, tops 14 to 60 px apart, as lines of text are); one bar alone, or two underlines 9 px apart, passes, or any empty bar failing, or only a box holding nothing but bars (the plan's words)? (the agent's own call A12, listed, not judged, in the walkthrough) | **Rule 1 in `frame-lint`: a bar is an element with no text, under 12 px high, over 120 px wide and filled; bars stand where words go when two or more are in a box with no text, one after another in a box's flow, or stacked (left edges within 24 px, tops 14 to 60 px apart, as lines of text are); one bar alone, or two underlines 9 px apart, passes** [close] | listed |
| D-243 | 2026-09-28 | 2026-09-28-videos-that-make-sense | 4 | Rule 5 in `frame-lint`: another element with words of its own, or a filled leaf (a chip, a line), whose box ends in the 40 px above a `data-detail` mark fails; a line of words with a place but no size is measured as one line of its type; a panel holding other things, or a background behind the mark, is not in the way, or any element's box touching the band, or only elements whose size the CSS gives? (the agent's own call A13, listed, not judged, in the walkthrough) | **Rule 5 in `frame-lint`: another element with words of its own, or a filled leaf (a chip, a line), whose box ends in the 40 px above a `data-detail` mark fails; a line of words with a place but no size is measured as one line of its type; a panel holding other things, or a background behind the mark, is not in the way** [close] | listed |
| D-244 | 2026-09-29 | 2026-09-28-plan-guide | 1 | Which is the source: plan.md, or the guide? | **plan.md; the guide is built from it** | active |
| D-245 | 2026-09-29 | 2026-09-28-videos-that-make-sense | 2 | What does Before you watch show of the findings the author kept? | **Only new ones** | active |
| D-246 | 2026-09-29 | 2026-09-28-plan-guide | 3 | While a question is up, what does a click on a marked thing on the frame do? | **Opens its part of the guide** | active, supersedes D-206 |
| D-247 | 2026-09-29 | 2026-09-26-case-study | 1 | How is each arm’s finished site kept in this repo? | **Plain files and a site.bundle** | active |
| D-248 | 2026-09-29 | 2026-09-29-explain-first | 4 | After Plan this, how far does the plan lean on the explainer? | **Lean on it** | active |
| D-249 | 2026-09-29 | 2026-09-29-explain-first | 5 | What of an explainer goes into git? | **Its text, never the transcript** | active |
| D-250 | 2026-09-29 | 2026-09-29-explain-first | 1 | Is an explainer's whole source there to read, behind the video? | **General principles, not a list of kinds: you say what you want explained, and the principles say what goes in the video and what goes in its guide** (not the recommendation) | active |
| D-251 | 2026-09-29 | 2026-09-29-explain-first | 2 | An explainer's name on the review page, and in `before:` lines, is `<name>--explainer`, like `<plan>--walkthrough`, or `explainer:<name>`, as the plan's interface wrote it? (the agent's own call A1, accepted in the walkthrough) | **An explainer's name on the review page, and in `before:` lines, is `<name>--explainer`, like `<plan>--walkthrough`** [hard-to-undo, close] | active |
| D-252 | 2026-09-29 | 2026-09-29-explain-first | 2 | An explainer waits under **Needs you** until it is reviewed, and again when it was rebuilt after its review (Explain more), or never under Needs you (nothing to decide)? (the agent's own call A10, accepted in the walkthrough) | **An explainer waits under **Needs you** until it is reviewed, and again when it was rebuilt after its review (Explain more)** [visible] | active |
| D-253 | 2026-09-29 | 2026-09-29-explain-first | 4 | `new-plan --from` without `--plan` writes a draft: the title, the line, the problem quoting the review, and an empty step for the agent to write, or requiring `--plan`? (the agent's own call A12, accepted in the walkthrough) | **`new-plan --from` without `--plan` writes a draft: the title, the line, the problem quoting the review, and an empty step for the agent to write** [visible] | active |
| D-254 | 2026-09-29 | 2026-09-29-explain-first | 5 | A secret, an email address (not `example.com`) or a home path stops the build anywhere in the video's text: frames, narration, storyboard, script, `explain.md`, details; the check prints it cut short, or only inside a quoted line, as the plan's words say? (the agent's own call A6, accepted in the walkthrough) | **A secret, an email address (not `example.com`) or a home path stops the build anywhere in the video's text: frames, narration, storyboard, script, `explain.md`, details; the check prints it cut short** [hard-to-undo] | active |
| D-255 | 2026-09-29 | 2026-09-29-explain-first | 5 | The fact check is a third fresh-eyes role, `checker` (F1 …), whose round waits for it, only for an explainer with a source that needs a guide part, or a separate command, or a fact check on every explainer? (the agent's own call A7, accepted in the walkthrough) | **The fact check is a third fresh-eyes role, `checker` (F1 …), whose round waits for it, only for an explainer with a source that needs a guide part** [visible] | active |
| D-256 | 2026-09-29 | 2026-09-29-explain-first | 1 | A source needs a guide part past 200 lines: a file by its lines, a folder's files each on their own (`parts`), a change by its changed lines, `since:` by its log's lines, or a fixed number of scenes' worth, or one rule for a whole folder? (the agent's own call A2, listed, not judged, in the walkthrough) | **A source needs a guide part past 200 lines: a file by its lines, a folder's files each on their own (`parts`), a change by its changed lines, `since:` by its log's lines** [close] | listed |
| D-257 | 2026-09-29 | 2026-09-29-explain-first | 1 | A file of the repo is shape `files`; a file's shape otherwise is read from what it holds: `.jsonl`/`.ndjson`/`.log` a sequence, `.csv`/`.tsv` or a JSON array of rows a table, anything else text, or asking for the shape on the command line? (the agent's own call A3, listed, not judged, in the walkthrough) | **A file of the repo is shape `files`; a file's shape otherwise is read from what it holds: `.jsonl`/`.ndjson`/`.log` a sequence, `.csv`/`.tsv` or a JSON array of rows a table, anything else text** [close] | listed |
| D-258 | 2026-09-29 | 2026-09-29-explain-first | 2 | An explainer's length: aim 2–4 minutes, "long" past 4, "too long" past 7; with a source that needs a guide part, 2–5, past 5 and past 8, or the plan video's 3–5? (the agent's own call A11, listed, not judged, in the walkthrough) | **An explainer's length: aim 2–4 minutes, "long" past 4, "too long" past 7; with a source that needs a guide part, 2–5, past 5 and past 8** [close] | listed |
| D-259 | 2026-09-29 | 2026-09-29-explain-first | 3 | The end is kept as the review's `verdict` too ("done", "more", "plan"), beside `end`, or `end` alone? (the agent's own call A8, listed, not judged, in the walkthrough) | **The end is kept as the review's `verdict` too ("done", "more", "plan"), beside `end`** [close] | listed |
| D-260 | 2026-09-29 | 2026-09-29-explain-first | 5 | A quoted line is the text of a `data-artifact`, block by block (a `div`, `p`, `li`, a cell); a label on it that is no quote carries `data-label` (and a pinned word `data-gloss`); "…" cuts a line into pieces checked on their own; a piece naming the source (its id, path, commit) passes; a repo file is read at the pinned commit, one with changes not committed then from disk with its hash checked, or checking every word in the frame, or only elements marked as quotes? (the agent's own call A4, listed, not judged, in the walkthrough) | **A quoted line is the text of a `data-artifact`, block by block (a `div`, `p`, `li`, a cell); a label on it that is no quote carries `data-label` (and a pinned word `data-gloss`); "…" cuts a line into pieces checked on their own; a piece naming the source (its id, path, commit) passes; a repo file is read at the pinned commit, one with changes not committed then from disk with its hash checked** [close] | listed |
| D-261 | 2026-09-29 | 2026-09-29-explain-first | 5 | "States a number" is a digit in the scene's narration, other than a step, scene, part, question or line number and an id (D-233, A4, k1); a scene that quotes a thing with no `- source:` is treated the same; and `check-sources` runs on any video with a `- source:`, not only an explainer [close] (changed after the code check: the quote and the where said here), or number words ("three") too; a quote with no source left alone; explainers only? (the agent's own call A5, listed, not judged, in the walkthrough) | **"States a number" is a digit in the scene's narration, other than a step, scene, part, question or line number and an id (D-233, A4, k1); a scene that quotes a thing with no `- source:` is treated the same; and `check-sources` runs on any video with a `- source:`, not only an explainer [close] (changed after the code check: the quote and the where said here)** | listed |
| D-262 | 2026-09-30 | 2026-09-29-explain-first | 3 | "What you want next" is the walkthrough's open-question box, asked on every explainer's Finish, kept as a note with `open: true` (changed after review: under Explain more and Plan this, the box follows this video's own suggestions, made at build time from its scenes, long sources and `explain.md`'s open threads and refined by what you did while watching; a pick fills the box to edit, or you write your own, and the review carries it as `next`), or a box shown only under Explain more or Plan this? (the agent's own call A9, accepted in the walkthrough) | **"What you want next" is the walkthrough's open-question box, asked on every explainer's Finish, kept as a note with `open: true` (changed after review: under Explain more and Plan this, the box follows this video's own suggestions, made at build time from its scenes, long sources and `explain.md`'s open threads and refined by what you did while watching; a pick fills the box to edit, or you write your own, and the review carries it as `next`)** [visible] | active |
| D-263 | 2026-09-30 | 2026-09-29-explain-first | 3 | An explainer's Finish offers Done first, comments or not; the missed-checks guard's "Ask the agent to explain it again" picks Explain more (changed after review: Done still comes first, and Explain more and Plan this each say what they would mean for this video, their first suggestion, in place of a fixed line; the guard's Explain more starts from the missed check's suggestion), or Explain more first when there are comments, as a plan's Finish offers Request changes? (the agent's own call A13, accepted in the walkthrough) | **An explainer's Finish offers Done first, comments or not; the missed-checks guard's "Ask the agent to explain it again" picks Explain more (changed after review: Done still comes first, and Explain more and Plan this each say what they would mean for this video, their first suggestion, in place of a fixed line; the guard's Explain more starts from the missed check's suggestion)** [visible, close] | active |
| D-264 | 2026-09-30 | 2026-09-28-plan-guide | 3 | Where does the guide open from the video? | **Under the video, on the same page: scrolling down reads the guide while the video shrinks to a small player that stays in view; the video is never replaced** | active, supersedes D-228 |
| D-265 | 2026-09-30 | 2026-09-28-plan-guide |  | What does the guide hold that the video does not? | **More than the video, never a restatement of it: concrete, in depth, with worked examples for each case, full and thorough, with diagrams of how the thing works, and the page's HTML used to its fullest (diagrams you can step through and click, before/after, try-it examples from real runs); any words on it can be highlighted to leave a note, the same box as a mark on the video, sent with the review** | active |
| D-266 | 2026-09-30 | 2026-09-28-plan-guide |  | How does a thing in the video that leads to the guide show itself? | **Quietly: nothing drawn while the video plays; a faint arrow when paused; on hover a thin ring on the thing and a small grey "More in the guide ↓"; a first tap shows it on a phone, a second opens it; the focus ring stays for the keyboard** | active, supersedes D-194 |
| D-267 | 2026-10-04 | 2026-09-28-plan-guide | 1 | A step's picture is the system's parts as a row of names, the ones the step touches lit, and the step's own fragment where it has one; a case dropped on it does not light a path, or the stage `reel stage` draws, the step's change drawn on, a case lighting its path? (the agent's own call D2, accepted in the walkthrough) | **A step's picture is the system's parts as a row of names, the ones the step touches lit, and the step's own fragment where it has one; a case dropped on it does not light a path** [deviation] | active |
| D-268 | 2026-10-04 | 2026-09-28-plan-guide | 3 | A part the builder makes is `guide/<part>.html`, not `details/<part>.html` as step 3's interface wrote it; a page started from a template stays in `details/`, or `details/<part>.html`? (the agent's own call D1, accepted in the walkthrough) | **A part the builder makes is `guide/<part>.html`, not `details/<part>.html` as step 3's interface wrote it; a page started from a template stays in `details/`** [deviation] | active |
| D-269 | 2026-10-04 | 2026-09-28-plan-guide | 1 | Each video has its own guide, `<video-dir>/guide/` (the full page, a part a file, `parts.json`); a plan folder builds each of its videos'; a plan with no video, `<plan-dir>/guide/index.html`, or one guide a plan at `<plan-dir>/guide/index.html`, as step 1's interface wrote it? (the agent's own call A1, accepted in the walkthrough) | **Each video has its own guide, `<video-dir>/guide/` (the full page, a part a file, `parts.json`); a plan folder builds each of its videos'; a plan with no video, `<plan-dir>/guide/index.html`** [visible] | active |
| D-270 | 2026-10-04 | 2026-09-28-plan-guide | 1 | The page is prototype v5's flow made general: a rail (outline, Expand all, gaps), then What changed (Built), a section a step, a section a kind of change, every choice, the decisions in force and the rest of `plan.md`; each a column of beats beside a stage, one column under 900 px; a layer a `<details>` with its summary; Expand all opens every layer, both sides of each section, each thing under its beat, or v3's outline, text column and picture? (the agent's own call A2, accepted in the walkthrough) | **The page is prototype v5's flow made general: a rail (outline, Expand all, gaps), then What changed (Built), a section a step, a section a kind of change, every choice, the decisions in force and the rest of `plan.md`; each a column of beats beside a stage, one column under 900 px; a layer a `<details>` with its summary; Expand all opens every layer, both sides of each section, each thing under its beat** [visible, close] | active |
| D-271 | 2026-10-04 | 2026-09-28-plan-guide | 1 | Things to do are made from the blocks and the real runs, never written for a plan: the first six cases dragged onto What happens, the longest trace (three beats or more) put in order, the numbers and ✓/✗ words of the first printing interface part filled in, each question's options predicted; on the Built side six files sorted into their kind and a real run's ✓/✗ lines filled in, or prototypes v4 and v5's, built by hand for one plan? (the agent's own call A3, accepted in the walkthrough) | **Things to do are made from the blocks and the real runs, never written for a plan: the first six cases dragged onto What happens, the longest trace (three beats or more) put in order, the numbers and ✓/✗ words of the first printing interface part filled in, each question's options predicted; on the Built side six files sorted into their kind and a real run's ✓/✗ lines filled in** [visible, close] | active |
| D-272 | 2026-10-04 | 2026-09-28-plan-guide | 1 | An explainer's source kept outside the repo (a transcript) shows its path, hash and lines, not its text; `--outside` builds a copy with it, masked, for this machine, or its text, masked, in every guide? (the agent's own call A4, accepted in the walkthrough) | **An explainer's source kept outside the repo (a transcript) shows its path, hash and lines, not its text; `--outside` builds a copy with it, masked, for this machine** [hard-to-undo] | active |
| D-273 | 2026-10-04 | 2026-09-28-plan-guide | 3 | A scene opens a part with `- guide: <part>[#<place>]`: a detail whose page is `guide/<part>.html` in the plan map (`guide: true`); the player offers it only once `guide/index.html` answers, and lists each step's part under the plan text's "Open:", or a chip on every step's scene? (the agent's own call A8, accepted in the walkthrough) | **A scene opens a part with `- guide: <part>[#<place>]`: a detail whose page is `guide/<part>.html` in the plan map (`guide: true`); the player offers it only once `guide/index.html` answers, and lists each step's part under the plan text's "Open:"** [visible] | active |
| D-274 | 2026-10-04 | 2026-09-28-plan-guide | 3 | videos-that-make-sense's walkthrough: its seven prototype parts are the builder's now, same names (`- guide:` for `- detail:`, the frames' marks kept); their hand-built things to do go with them, or keeping the prototype's pages? (the agent's own call A9, accepted in the walkthrough) | **videos-that-make-sense's walkthrough: its seven prototype parts are the builder's now, same names (`- guide:` for `- detail:`, the frames' marks kept); their hand-built things to do go with them** [visible] | active |
| D-275 | 2026-10-04 | 2026-09-28-plan-guide | 4 | A suggested edit's step and block come from its place ("step 1 · interface · …"); its ledger entry is kind `edit`, the reviewer's words chosen and the plan's the other option, active, or a list of edits the page writes apart? (the agent's own call A10, accepted in the walkthrough) | **A suggested edit's step and block come from its place ("step 1 · interface · …"); its ledger entry is kind `edit`, the reviewer's words chosen and the plan's the other option, active** [hard-to-undo] | active |
| D-276 | 2026-10-04 | 2026-09-28-plan-guide | 4 | An answer given on the guide goes into the plan video's record in this browser (`:decisions`, `via: "guide"`), the later kept; a part sends it to the player (`answer`), or answers only on the video? (the agent's own call A11, accepted in the walkthrough) | **An answer given on the guide goes into the plan video's record in this browser (`:decisions`, `via: "guide"`), the later kept; a part sends it to the player (`answer`)** [visible, hard-to-undo] | active |
| D-277 | 2026-10-04 | 2026-09-28-plan-guide | 5 | walkthrough.md's Categories of change: `- **<name>** {<id>} (<paths>) (<commits>) (step N): <two lines>`, `Runs:` under it; a category claims a change of the plan's commits by its path and, where it names commits, only theirs; the first to claim it has it, and what none claims is "Everything else", or a category a folder, or a commit? (the agent's own call A12, accepted in the walkthrough) | **walkthrough.md's Categories of change: `- **<name>** {<id>} (<paths>) (<commits>) (step N): <two lines>`, `Runs:` under it; a category claims a change of the plan's commits by its path and, where it names commits, only theirs; the first to claim it has it, and what none claims is "Everything else"** [hard-to-undo] | active |
| D-278 | 2026-10-04 | 2026-09-28-plan-guide | 5 | On the Built side a file the build writes (a plan map, captions, snapshots, pictures, audio, a rendered page) is listed with its counts, not shown; a changed line over 2,000 characters shows its first 400 and how many more; a file over 1.5 MB has no whole text, its changes still shown, or every line of every file? (the agent's own call A13, accepted in the walkthrough) | **On the Built side a file the build writes (a plan map, captions, snapshots, pictures, audio, a rendered page) is listed with its counts, not shown; a changed line over 2,000 characters shows its first 400 and how many more; a file over 1.5 MB has no whole text, its changes still shown** [visible, close] | active |
| D-279 | 2026-10-04 | 2026-09-28-plan-guide | 2 | The blocks are required of a plan whose folder is dated 2026-09-30 or later; `reel check --blocks` holds any plan to them, or a marker in `plan.md`, or every plan? (the agent's own call A5, accepted in the walkthrough) | **The blocks are required of a plan whose folder is dated 2026-09-30 or later; `reel check --blocks` holds any plan to them** [close] | active |
| D-280 | 2026-10-04 | 2026-09-28-plan-guide | 2 | An option has an example when its text has a value, a quote, a command or a number (or "say", "e.g."), or a word of five letters or more of the question's "Say …" setup, or an `Example:` line under each option? (the agent's own call A6, accepted in the walkthrough) | **An option has an example when its text has a value, a quote, a command or a number (or "say", "e.g."), or a word of five letters or more of the question's "Say …" setup** [close] | active |
| D-281 | 2026-10-04 | 2026-09-28-plan-guide | 2 | "Says the video again" is a sentence of eight words or more of either video's narration found, letters and digits only, in the page's first layer (the beats, closed layers left out), or any sentence, or the stage too? (the agent's own call A7, accepted in the walkthrough) | **"Says the video again" is a sentence of eight words or more of either video's narration found, letters and digits only, in the page's first layer (the beats, closed layers left out)** [close] | active |
| D-282 | 2026-10-04 | 2026-09-28-plan-guide | 3 | A scene's guide part whose frame marks nothing is a △ under `details_check: strict`, where an unmarked detail fails; the player shows the corner chip for it, or failing it, as a detail? (the agent's own call A14, accepted in the walkthrough) | **A scene's guide part whose frame marks nothing is a △ under `details_check: strict`, where an unmarked detail fails; the player shows the corner chip for it** [close] | active |
| D-283 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 2 | The list's sheet: one row per choice (its id, what it chose, "instead of" what) with only a Flag, and one Go on (key A) under the rows; no own words on it (words go in a comment, as on a grouped beat); on a frame that draws a card per choice, each Flag hangs from its card, or an Accept and a Flag per row, or the grouped beat's row of Flag buttons with the words only on hover? (the agent's own call A3, accepted in the walkthrough) | **The list's sheet: one row per choice (its id, what it chose, "instead of" what) with only a Flag, and one Go on (key A) under the rows; no own words on it (words go in a comment, as on a grouped beat); on a frame that draws a card per choice, each Flag hangs from its card** [visible] | active |
| D-284 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 3 | The open question is asked where the review is finished: first in a walkthrough's Finish panel, with a box for your words, the ending beat saying it aloud; the words are one note on no step (`open: true`), under "Seeing it run" in `reviews/<id>.md`, or a pause on the ending frame with its own box, or a new field in the review file? (the agent's own call A5, accepted in the walkthrough) | **The open question is asked where the review is finished: first in a walkthrough's Finish panel, with a box for your words, the ending beat saying it aloud; the words are one note on no step (`open: true`), under "Seeing it run" in `reviews/<id>.md`** [visible, close] | active |
| D-285 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 4 | A small PR's other choices go under a new "## Other choices" in the PR template, one line each (what it chose, instead of what); the maintainer accepts them by ticking "The other choices above are accepted", and `reel pr-check` waits until then (fails with `--merge`); a line that does not say "instead of" is a note, not a failure, or the choices in a comment on the PR, or no tick (reading them is accepting them)? (the agent's own call A6, accepted in the walkthrough) | **A small PR's other choices go under a new "## Other choices" in the PR template, one line each (what it chose, instead of what); the maintainer accepts them by ticking "The other choices above are accepted", and `reel pr-check` waits until then (fails with `--merge`); a line that does not say "instead of" is a note, not a failure** [visible, close] | active |
| D-286 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 5 | One control: the header's Plan–Built switch is the jump (its Built segment is "See it built" on a plan scene, its Plan segment "See the plan" on the walkthrough), following the step on screen; no separate button laid on the scenes, or a "See it built" button on each plan scene beside the switch? (the agent's own call A8, accepted in the walkthrough) | **One control: the header's Plan–Built switch is the jump (its Built segment is "See it built" on a plan scene, its Plan segment "See the plan" on the walkthrough), following the step on screen; no separate button laid on the scenes** [visible, close] | active |
| D-287 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 5 | The list's order: what needs you first (a plan waiting on you says what to review and how long), then the system video and the five newest plans, the rest behind "Earlier plans (N)" (open when the video playing is in it); each row one line (name, date, one word; changed before review, the lead's look: the word says what waits and on whom, every row waiting on you is under "Needs you" its video here or not, names wrap to two lines, and a row whose videos are not here says "not on this page" instead of a switch), and on a phone the word under the name, or every plan in date order, two rows each, or a search box? (the agent's own call A9, accepted in the walkthrough) | **The list's order: what needs you first (a plan waiting on you says what to review and how long), then the system video and the five newest plans, the rest behind "Earlier plans (N)" (open when the video playing is in it); each row one line (name, date, one word; changed before review, the lead's look: the word says what waits and on whom, every row waiting on you is under "Needs you" its video here or not, names wrap to two lines, and a row whose videos are not here says "not on this page" instead of a switch), and on a phone the word under the name** [visible] | active |
| D-288 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 1 | A walkthrough video's length: aim 1–2 minutes, "long" past 3, "too long" past 5 (both a △ after the build, never a stop), or keeping "too long" at 10 minutes, or no "too long" at all? (the agent's own call A1, accepted in the walkthrough) | **A walkthrough video's length: aim 1–2 minutes, "long" past 3, "too long" past 5 (both a △ after the build, never a stop)** | active |
| D-289 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 2 | The list is its own storyboard line, `- autonomy_list: a1, a4`, one beat at the end of the video; `- autonomy_group:` (one per chapter, Accept all) still plays in older videos, or reusing `- autonomy_group:` for the list, or no beat at all (the list only in the Finish panel)? (the agent's own call A2, accepted in the walkthrough) | **The list is its own storyboard line, `- autonomy_list: a1, a4`, one beat at the end of the video; `- autonomy_group:` (one per chapter, Accept all) still plays in older videos** [close] | active |
| D-290 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 2 | "Listed" is recorded when the viewer presses Go on (every choice not flagged), and `reel record` lists a choice the viewer never reached only when the review approves; a review asking for changes leaves those "never judged", or only at Approve, or listing unreached choices whatever the verdict? (the agent's own call A4, accepted in the walkthrough) | **"Listed" is recorded when the viewer presses Go on (every choice not flagged), and `reel record` lists a choice the viewer never reached only when the review approves; a review asking for changes leaves those "never judged"** [close] | active |
| D-291 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 5 | The switch lands on the first scene tagged with that plan step (in the walkthrough, its running scene; in the plan video, the step's first scene), a tenth of a second in; a step the walkthrough tags no scene with is "Nothing to run for this step". `bundle-player` works the table out into `library.json` (`steps`), or a scene the walkthrough marks as the step's running one, or the player fetching the other video's plan map as it plays? (the agent's own call A7, accepted in the walkthrough) | **The switch lands on the first scene tagged with that plan step (in the walkthrough, its running scene; in the plan video, the step's first scene), a tenth of a second in; a step the walkthrough tags no scene with is "Nothing to run for this step". `bundle-player` works the table out into `library.json` (`steps`)** [close] | active |
| D-292 | 2026-10-04 | 2026-09-27-walkthroughs-that-help | 6 | The bar is judged per review, over the first three walkthrough reviews whose pauses are timed (`shownAt`): each clears it with a pause held 5 s or more (its middle value) and at least one flag, own words or comment; "due" only when all three miss, or pooling the three reviews' pauses into one middle value and one count, or counting reviews from before pauses were timed? (the agent's own call A10, accepted in the walkthrough) | **The bar is judged per review, over the first three walkthrough reviews whose pauses are timed (`shownAt`): each clears it with a pause held 5 s or more (its middle value) and at least one flag, own words or comment; "due" only when all three miss** | active |
| D-293 | 2026-10-04 | 2026-09-26-contributing | 1 | A PR over the line with no video, or still waiting for a maintainer to accept its walkthrough, prints △ and passes; `--merge`, in the full-suite job, makes it a failure, or fail on every push until a video is reviewed? (the agent's own call A2, accepted in the walkthrough) | **A PR over the line with no video, or still waiting for a maintainer to accept its walkthrough, prints △ and passes; `--merge`, in the full-suite job, makes it a failure** [visible, close] | active |
| D-294 | 2026-10-04 | 2026-09-26-contributing | 2 | This repo's `maintainers` is `["owner"]`, no email: a review recorded by git's user.email (the local page's Send, filed on some machine) counts as a contributor's until that email is added; `reel record` says so, and recording it again then adds its calls, or listing the owner's email, or the agent's git email? (the agent's own call A3, accepted in the walkthrough) | **This repo's `maintainers` is `["owner"]`, no email: a review recorded by git's user.email (the local page's Send, filed on some machine) counts as a contributor's until that email is added; `reel record` says so, and recording it again then adds its calls** [visible, close] | active |
| D-295 | 2026-10-04 | 2026-09-26-contributing | 3 | This repo's plan folders dated up to 2026-09-27 keep their videos' media committed (negated lines in `.gitignore`); a plan started after that follows the rule, or the template's lines alone, for every plan folder? (the agent's own call A6, accepted in the walkthrough) | **This repo's plan folders dated up to 2026-09-27 keep their videos' media committed (negated lines in `.gitignore`); a plan started after that follows the rule** [visible, hard-to-undo] | active |
| D-296 | 2026-10-04 | 2026-09-26-contributing | 5 | The full-suite job runs on every PR event and fails at once without `ready-to-merge`, or skip the job until the label is on? (the agent's own call A9, accepted in the walkthrough) | **The full-suite job runs on every PR event and fails at once without `ready-to-merge`** [visible, close] | superseded by D-311 |
| D-297 | 2026-10-04 | 2026-09-26-contributing | 5 | The workflow is `.github/workflows/ci.yml`, or `.github/workflows/test.yml`, as the plan names it? (the agent's own call D1, accepted in the walkthrough) | **The workflow is `.github/workflows/ci.yml`** [deviation] | active |
| D-298 | 2026-10-04 | 2026-09-26-contributing | 1 | The 300 lines leave out tests (test folders, `*.spec.*`, `*.test.*`), docs (`docs/`, Markdown and text files, the licence), the whole `.reelplanning/` record, `videos/` and media, lockfiles and `dist/`, and any file `.gitattributes` marks `linguist-generated` or `linguist-documentation`, or a fixed list of test, doc, video and generated paths only? (the agent's own call A1, accepted in the walkthrough) | **The 300 lines leave out tests (test folders, `*.spec.*`, `*.test.*`), docs (`docs/`, Markdown and text files, the licence), the whole `.reelplanning/` record, `videos/` and media, lockfiles and `dist/`, and any file `.gitattributes` marks `linguist-generated` or `linguist-documentation`** [close] | active |
| D-299 | 2026-10-04 | 2026-09-26-contributing | 3 | Each video is checked against its text only until it is approved: a plan video once a plan review approved it, a walkthrough once a maintainer accepted it, or check every video the PR carries, always? (the agent's own call A4, accepted in the walkthrough) | **Each video is checked against its text only until it is approved: a plan video once a plan review approved it, a walkthrough once a maintainer accepted it** [close] | active |
| D-300 | 2026-10-04 | 2026-09-26-contributing | 3 | The hashes compare what the map already carries (the plan's title, problem and steps; each stop's chose, instead of, why and check) with `plan.md` and `walkthrough.md`; no new field in `plan-map.json`, or a hash of the whole of `plan.md` and `walkthrough.md`, written into the map by the build? (the agent's own call A5, accepted in the walkthrough) | **The hashes compare what the map already carries (the plan's title, problem and steps; each stop's chose, instead of, why and check) with `plan.md` and `walkthrough.md`; no new field in `plan-map.json`** [close] | active |
| D-301 | 2026-10-04 | 2026-09-26-contributing | 4 | `reel renumber` takes an entry as the branch's own when the base holds none that decided the same thing (plan, question, date, answer), and reads the branch's log from whichever side of the conflict holds such entries, or the entries after the merge-base's last id? (the agent's own call A7, accepted in the walkthrough) | **`reel renumber` takes an entry as the branch's own when the base holds none that decided the same thing (plan, question, date, answer), and reads the branch's log from whichever side of the conflict holds such entries** [close] | active |
| D-302 | 2026-10-04 | 2026-09-26-contributing | 4 | A pending memory line moves when it names no email, or this machine's git user.email; one naming `owner` or an id moves as before, or hold every line whose reviewer is not in `maintainers`? (the agent's own call A8, accepted in the walkthrough) | **A pending memory line moves when it names no email, or this machine's git user.email; one naming `owner` or an id moves as before** [close] | active |
| D-303 | 2026-10-04 | 2026-09-28-videos-that-make-sense |  | When what's built has to be installed, does its video show the install? | **Yes: a video of something people install shows the real install commands, run and working, as a step of the system; this repo's system video walks through installing reelplanning** | active |
| D-304 | 2026-10-04 | 2026-09-26-case-study |  | What does the README say about the name? | **It says reelplanning sounds like "real planning": a plan as long text is too hard to take in, and a video of it is what makes real planning possible** | active |
| D-305 | 2026-10-04 | 2026-09-26-contributing |  | How does the repo go public when its history holds about 1 GB of narration audio and renders? | **A slimmed history: every .wav, .mp4 and renders/ file removed from all commits (about 70 MB left), with the commit hashes the record cites rewritten to the new ones, pushed to a new public remote as one branch; this private repo keeps its full history. From then on no voice files or renders are committed anywhere (the exception for plans before 2026-09-28 ends): finished videos people should watch go up as release files or on the hosted page** | active |
| D-306 | 2026-10-04 | 2026-09-26-contributing |  | How does the decision log scale to thousands of decisions? | **Owner answers stay binding; accepted agent calls become history, raised again only when a change touches the lines their commits wrote; a component's binding decisions can be folded into a section of spec.md the owner approves, which a plan then cites instead of each id** | active |
| D-307 | 2026-10-05 | 2026-09-22-richer-review | 4 | clicking away or starting another mark keeps the words typed; only Escape discards (**changed after review:** Escape keeps them too; a × discards), or blur discards? (the agent's own call A10, accepted in the walkthrough) | **clicking away or starting another mark keeps the words typed; only Escape discards (**changed after review:** Escape keeps them too; a × discards)** | active |
| D-308 | 2026-10-05 | 2026-09-24-memory | 3 | Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory (**changed after review:** you answered "we still want to write somewhere, just somewhere we can access". The summary now goes to `.reelplanning/you.pending.jsonl` in the repo, once, and the line says so; the next `reel record` or `reel memory --you` that can write your file moves the pending lines in, deduplicated by repo, plan and review, and removes the file; until then `--you` reads both. The pending file is committed, not gitignored: a run fenced to the repo is the review server's headless run or a cloud session, and what reaches you from there is what it commits; a gitignored file would stay on that machine, gone with a cloud container. It holds nothing `reviews/` does not already carry. If two machines of yours pull it, the first that can write its home takes the lines), or failing the record; or keeping a pending copy in the repo to add later? (the agent's own call A15, accepted in the walkthrough) | **Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory (**changed after review:** you answered "we still want to write somewhere, just somewhere we can access". The summary now goes to `.reelplanning/you.pending.jsonl` in the repo, once, and the line says so; the next `reel record` or `reel memory --you` that can write your file moves the pending lines in, deduplicated by repo, plan and review, and removes the file; until then `--you` reads both. The pending file is committed, not gitignored: a run fenced to the repo is the review server's headless run or a cloud session, and what reaches you from there is what it commits; a gitignored file would stay on that machine, gone with a cloud container. It holds nothing `reviews/` does not already carry. If two machines of yours pull it, the first that can write its home takes the lines)** [visible, close] | active |
| D-309 | 2026-10-05 | 2026-09-25-fewer-better-stops |  | The walkthroughs still open at the release: watch each, or accept them as they are? | **Accepted as they are, given in conversation, not watched; `reel audit` treats a walkthrough the owner has accepted as settled history: its rule breaks are notes (△), not failures, and a walkthrough not yet accepted is held to every rule** | active |
| D-310 | 2026-10-08 | 2026-09-26-contributing |  | What does the public repo hold, and what is it called? | **The public repo is ncrispino/reelplanning, lowercase, and its main is one commit holding the current tree (`scripts/release/make-public.mjs` builds it, never pushes it); this private repo keeps its full history as an internal archive and is renamed first (e.g. to reelplanning-dev), since GitHub names ignore case. From then on all work happens on the public repo, with an ordinary history on top of that first commit: no later exports. This replaces D-305's slimmed history for the public repo; D-305's other half stands: no voice files or renders are committed anywhere. Commit ids the record cites name the development history, which is not public, and the public repo's .reelplanning/README.md says so** | active |
| D-311 | 2026-10-08 | 2026-09-26-contributing |  | How does a pull request reach the full suite, and what else does it need before it merges? | **The full suite runs on every push to a pull request, with no label: a PR's checks are green or red for its code, never red for waiting on a maintainer. `.github/workflows/ci.yml` holds the tests (the fast and full suites) and starts only on pushes; `reel pr-check` and the video branch's cleanup move to `.github/workflows/pr.yml`, which also runs when the PR's text or labels change, so no such event records a skipped test check (GitHub counts a skipped required check as passed). Main requires a pull request with one approving review, and the fast suite, the full suite and `reel pr-check` passed on its last commit, up to date with main; the owner may merge their own with the admin bypass. The maintainer runs `reel pr-check --merge` before merging (the PR template), not CI** | active, supersedes D-296 |
| D-312 | 2026-10-08 | 2026-09-26-contributing |  | What is the project called? | **reelplanner, said "reel planner": the npm package, the command `reelplanner` (`reel` stays), the GitHub repo ncrispino/reelplanner, the case-studies repo ncrispino/reelplanner-case-studies (its site at ncrispino.github.io/reelplanner-case-studies), the Claude Code plugin and its marketplace, a repo's project folder `.reelplanner/`, the machine's folder `~/.reelplanner` and the settings `REELPLANNER_*`. The old names are still read for a while: a repo's `.reelplanning/` when it has no `.reelplanner/` (said once, with the `git mv .reelplanning .reelplanner` that renames it), `~/.reelplanning` while there is no `~/.reelplanner`, a `REELPLANNING_*` setting, in the shell or a .env file, when its new name is unset, and the `reelplanning` command, which says the new name on stderr and runs it. The review page keeps its saved marks' storage keys (`reelplanning:annotations:…`), so a review begun before the rename is still there after it** | active |

### D-001 — Who checks that the code followed the plan?

- **Chosen:** Second agent — a fresh reader catches what the implementer rationalised; one more agent run per implementation
- **Not chosen:** Self-report (cheaper and faster; an agent rarely flags its own drift)
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-002 — What happens to a flagged call?

- **Chosen:** Fix and rebuild — the loop stays tight and the comment is the instruction; a larger change goes through with no plan video of its own (escalate to B when the comment would supersede a ledger decision)
- **Not chosen:** New plan first (every change is planned before it is made; a full plan cycle for what is often a one-line fix)
- **Where:** 2026-09-22-close-the-lifecycle, step 5 (Act on the walkthrough review); components: diff, revise
- **Status:** active

### D-003 — When does the system video update?

- **Chosen:** i want after every accept except i am wondering how costly this is to do? like will it be easy if we usually only change a bit of the video each time? just be cognizant of cost, like do we want to do somethings in background so it is ready to  build again, but where the contents in backend is ready to buidl? just not full thing rendered yet?
- **Not chosen:** After every accept (never stale; a partial rebuild on every accepted change, including ones that only touch internals); On demand (costs nothing until someone asks; it drifts until someone does)
- **Where:** 2026-09-22-close-the-lifecycle, step 6 (Keep the system video current); components: diff, system-video
- **Status:** active

### D-004 — After a pick-all-that-apply answer, what does the video play?

- **Chosen:** One summary frame — short and always the same length; costs seeing what each pick means in the plan
- **Not chosen:** Every picked branch (you see the consequence of each pick; costs watch time that grows with every tick); Branchless only (simplest to build and to watch; costs the richer questions that need branches)
- **Where:** 2026-09-22-richer-review, step 2 (Pick-all-that-apply questions); components: resolve
- **Status:** active

### D-005 — Which video-only feedback comes first?

- **Chosen:** Automatic rewinds — no extra effort from the reviewer; costs precision: a rewind can mean 'interesting' as well as 'lost me'
- **Not chosen:** A lost-me button (clear intent; costs a button the reviewer has to remember to press (the old 'Wait, what?' button was dropped for being unused)); Both (the most signal; costs the most to build and to read)
- **Where:** 2026-09-22-richer-review, step 6 (Feedback only a video can give); components: player
- **Status:** active

### D-006 — The player ignores the old saved mute setting and keeps mute under a new name, or deleting the old key? (the agent's own call A15, accepted in the walkthrough)

- **Chosen:** The player ignores the old saved mute setting and keeps mute under a new name — a mute saved while typing "m" in a comment (an old bug) kept the sound off
- **Not chosen:** deleting the old key
- **Where:** 2026-09-22-richer-review, step 4 (Type on the mark); components: finish
- **Status:** active

### D-007 — resolve-plan finds your chosen option by its letter when the label does not match, or matching the exact label only? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** resolve-plan finds your chosen option by its letter when the label does not match — "← chosen" never matched real plans, which write `A · Label`
- **Not chosen:** matching the exact label only
- **Where:** 2026-09-22-richer-review, step 1 (Questions with up to four options); components: resolve, player
- **Status:** active

### D-008 — Four options sit 2 × 2, and go 4 across only when the video is at least 1200 px wide, or 4-across at 1440? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** Four options sit 2 × 2, and go 4 across only when the video is at least 1200 px wide — four ~240px cards wrap each reason onto 4–5 lines
- **Not chosen:** 4-across at 1440
- **Where:** 2026-09-22-richer-review, step 1 (Questions with up to four options); components: resolve, player
- **Status:** active

### D-009 — A pick-all question has no branch beats; the video goes straight to its summary frame, or allowing branches on a pick-all question? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** A pick-all question has no branch beats; the video goes straight to its summary frame — D-004 is one summary frame whatever is picked
- **Not chosen:** allowing branches on a pick-all question
- **Where:** 2026-09-22-richer-review, step 2 (Pick-all-that-apply questions); components: resolve
- **Status:** active

### D-010 — A pick-all answer is one entry in the decision ledger, holding every pick, or one entry per pick? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** A pick-all answer is one entry in the decision ledger, holding every pick — the question was asked once, and `reel check`'s re-ask guard compares questions
- **Not chosen:** one entry per pick
- **Where:** 2026-09-22-richer-review, step 2 (Pick-all-that-apply questions); components: resolve
- **Status:** active

### D-011 — A summary frame shows the picks one line each in a list, or joined with commas anywhere else, or a template convention per item? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** A summary frame shows the picks one line each in a list, or joined with commas anywhere else — the simplest rule a frame author can rely on; style guide §19 says it
- **Not chosen:** a template convention per item
- **Where:** 2026-09-22-richer-review, step 2 (Pick-all-that-apply questions); components: resolve
- **Status:** active

### D-012 — On a replay, an answer with no branch of its own skips from the question to its summary, or routing only pick-one answers with branches? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** On a replay, an answer with no branch of its own skips from the question to its summary — a 4-option question may have options without branches; this also stopped own-words answers replaying every branch
- **Not chosen:** routing only pick-one answers with branches
- **Where:** 2026-09-22-richer-review, step 2 (Pick-all-that-apply questions); components: resolve
- **Status:** active

### D-013 — The lint counts the parts named in a frame's code; a whole-system beat can opt out, or counting what is visible at each moment in the browser? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** The lint counts the parts named in a frame's code; a whole-system beat can opt out — the lint is cheap and runs per frame as it lands; a whole-system beat can say so
- **Not chosen:** counting what is visible at each moment in the browser
- **Where:** 2026-09-22-richer-review, step 5 (Diagrams a newcomer can follow); components: system-video
- **Status:** active

### D-014 — Four frames of the close-the-lifecycle video that now break the 6-part rule are left as they are, or something else? (the agent's own call D1, accepted in the walkthrough)

- **Chosen:** Four frames of the close-the-lifecycle video that now break the 6-part rule are left as they are
- **Not chosen:** —
- **Where:** 2026-09-22-richer-review, step 5 (Diagrams a newcomer can follow); components: system-video
- **Status:** active

### D-015 — A rewind is a scrub or a key press that goes back more than 2 s; jumps from the record do not count, or every backwards seek? (the agent's own call A11, accepted in the walkthrough)

- **Chosen:** A rewind is a scrub or a key press that goes back more than 2 s; jumps from the record do not count — those are navigation, not "lost me here"
- **Not chosen:** every backwards seek
- **Where:** 2026-09-22-richer-review, step 6 (Feedback only a video can give); components: player
- **Status:** active

### D-016 — Speed changes within 3 s merge into one moment, and only slowing below 1× counts, or one moment per change below 1×? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** Speed changes within 3 s merge into one moment, and only slowing below 1× counts — speeding back up is not a signal
- **Not chosen:** one moment per change below 1×
- **Where:** 2026-09-22-richer-review, step 6 (Feedback only a video can give); components: player
- **Status:** active

### D-017 — The resolved plan lists hard-to-follow moments by step, with their times, or listed in time order, or merged into the step comments? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** The resolved plan lists hard-to-follow moments by step, with their times — the revise works step by step; a moment is a signal, not a comment
- **Not chosen:** listed in time order, or merged into the step comments
- **Where:** 2026-09-22-richer-review, step 6 (Feedback only a video can give); components: player
- **Status:** active

### D-018 — A note on an answer sends its step to the revise step, just like a comment, or notes as record-only? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** A note on an answer sends its step to the revise step, just like a comment — a note usually qualifies the answer ("only until accounts exist"), which the plan must then say
- **Not chosen:** notes as record-only
- **Where:** 2026-09-22-richer-review, step 1 (Questions with up to four options); components: resolve, player
- **Status:** active

### D-019 — A note on its own still lets you approve when the review is finished, or treating a note like a comment? (the agent's own call A13, accepted in the walkthrough)

- **Chosen:** A note on its own still lets you approve when the review is finished — a note clarifies an answer; it is not a change request
- **Not chosen:** treating a note like a comment
- **Where:** 2026-09-22-richer-review, step 1 (Questions with up to four options); components: resolve, player
- **Status:** active

### D-020 — Notes are offered on plan questions only, not on quick checks or on the agent's calls, or a note on every beat? (the agent's own call A14, accepted in the walkthrough)

- **Chosen:** Notes are offered on plan questions only, not on quick checks or on the agent's calls — the review data defines `note` on decisions only
- **Not chosen:** a note on every beat
- **Where:** 2026-09-22-richer-review, step 1 (Questions with up to four options); components: resolve, player
- **Status:** active

### D-021 — Where does a detail open?

- **Chosen:** Side panel — you keep the frame in view while you read; costs room: code gets about half the width, and on a phone the panel covers the video anyway
- **Not chosen:** Full size (the most room for code and prototypes; costs the frame: you lose what the video was showing while you read); New tab (simplest to build, and the page works on its own; costs the review: comments in the tab do not reach the player, and you have to come back)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): superseded by D-195, not D-194, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-23-deep-dives, step 1 (Deep-dive beats); components: player
- **Status:** superseded, superseded by D-195 on 2026-09-27

### D-022 — Who writes a detail page?

- **Chosen:** confused by this, need more information and examples
- **Not chosen:** Free HTML (anything is possible, like the html-effectiveness examples; costs consistency and tokens, and every page needs its own comment wiring); 4 templates (consistent, cheap, and comments work everywhere; costs anything the templates did not foresee); Both (most details stay consistent, and the odd one that needs something new can have it; costs a free page having weaker comments (whole-page only))
- **Where:** 2026-09-23-deep-dives, step 2 (A small set of detail kinds); components: diff
- **Status:** reopened

### D-023 — What code does a walkthrough show?

- **Chosen:** oh we shoulndt ALWAYS show the code, and we should not ONLY be showing the code as the thing we are showing more detail for. like there could be other thigns where detail is important. and code might not come with everything, only if it is relevant, and ppl often dont l ook at the full code there like it really should be justified. and other details could be important that are clearer, like going into more interactive depth.
- **Not chosen:** Full diff (the reviewer sees everything that changed; costs length: a big step's diff is long, and the calls can get lost in it); Just the calls (short and focused on what the reviewer is judging; costs the rest of the change, which nobody sees in the video)
- **Where:** 2026-09-23-deep-dives, step 4 (Walkthroughs show the real code); components: diff, implement-step
- **Status:** active

### D-024 — How is each detail page made?

- **Chosen:** Types first — the risk list is a table page and the manifest explorer is written fresh; costs a fresh page getting comments on the whole page only, not on a line
- **Not chosen:** Written fresh (anything is possible; costs the most time and tokens per video, pages vary in quality, and each page wires its own comments); Fixed types only (fast, consistent, and comments work the same everywhere; costs anything the types did not foresee: the manifest explorer becomes a plain table)
- **Where:** 2026-09-23-deep-dives, step 2 (Kinds of detail, most of them things to try); components: player, skill, finish, resolve, implement-step
- **Status:** active

### D-025 — The skill runs its tools as npx -y reelplanning@0.1.0, pinned to the package version, or the local `reelplanning` bin on PATH? (the agent's own call A18, accepted in the walkthrough)

- **Chosen:** The skill runs its tools as npx -y reelplanning@0.1.0, pinned to the package version — the npm packaging (asked for separately) makes the skill work in any agent without an installer; **it needs the package published first**, until then the commands fail as written
- **Not chosen:** the local `reelplanning` bin on PATH
- **Where:** 2026-09-22-close-the-lifecycle, step 2 (Implement to the plan, and log calls as they are made); components: skill
- **Status:** active

### D-026 — The checker's whole world is one file, code-check/brief.md, or letting the checker explore the repo and history freely? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** The checker's whole world is one file, code-check/brief.md — a fresh context is only fresh if what goes into it is fixed; one file also makes the check repeatable
- **Not chosen:** letting the checker explore the repo and history freely
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-027 — The brief includes the implementer's autonomy log, but nothing else from the implementer, or giving the checker nothing from the implementer? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** The brief includes the implementer's autonomy log, but nothing else from the implementer — question 3 ("anything the log does not explain?") needs the log; the reasons in the implementer's conversation stay out
- **Not chosen:** giving the checker nothing from the implementer
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-028 — The brief shows plan.md, the plan as implemented, or `plan.resolved.md` when it exists? (the agent's own call A19, accepted in the walkthrough)

- **Chosen:** The brief shows plan.md, the plan as implemented — found by this plan's own code check: `plan.resolved.md` records the review before the last revise, so the checker saw the old step 6
- **Not chosen:** `plan.resolved.md` when it exists
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-029 — The code check leaves accepted agent calls out of the decisions it checks, or including them? (the agent's own call A15, accepted in the walkthrough)

- **Chosen:** The code check leaves accepted agent calls out of the decisions it checks — they are defaults, warned about by `reel check`; the brief stays about what this plan's reviewer decided. Worth revisiting once accepted calls pile up
- **Not chosen:** including them
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-030 — A diff over 400k characters is cut, with the command to read the rest, or always the full diff? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** A diff over 400k characters is cut, with the command to read the rest — a whole-repo diff can be megabytes; the checker can read any file with git
- **Not chosen:** always the full diff
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-031 — -- <paths> narrows the diff, or the whole range only? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** -- <paths> narrows the diff — a branch often carries unrelated work (richer review's range also held the status page)
- **Not chosen:** the whole range only
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-032 — Findings in a fixed shape, every ✗ keyed by Step N, a decision id or a path, or free prose? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** Findings in a fixed shape, every ✗ keyed by Step N, a decision id or a path — `reel audit` can then check each one is answered
- **Not chosen:** free prose
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-033 — No findings file is a warning in reel audit, not a failure, or failing? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** No findings file is a warning in reel audit, not a failure — plans walked through before the check existed must still pass
- **Not chosen:** failing
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-034 — reel audit asks for a named file only for this plan's own decisions, in their step's entry; a cited decision in force needs a mention, or a file per decision in force? (the agent's own call A14, accepted in the walkthrough)

- **Chosen:** reel audit asks for a named file only for this plan's own decisions, in their step's entry; a cited decision in force needs a mention — a cited decision was checked in its own plan's walkthrough; this one only has to say it still holds
- **Not chosen:** a file per decision in force
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-035 — Deviation from step 3: reel audit asks a named file only of this plan's own decisions (A14), or something else? (the agent's own call D2, accepted in the walkthrough)

- **Chosen:** Deviation from step 3: reel audit asks a named file only of this plan's own decisions (A14)
- **Not chosen:** —
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-036 — A part labelled with a file name fails the lint; any other label that is not its glossary name is only a note; a mock of a file or page is left alone, or failing every label that differs from the glossary? (the agent's own call A11, accepted in the walkthrough)

- **Chosen:** A part labelled with a file name fails the lint; any other label that is not its glossary name is only a note; a mock of a file or page is left alone — a mock or a branch may shorten a name on purpose; a file name on a node is never right
- **Not chosen:** failing every label that differs from the glossary
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-037 — A step the reviewer rewound or slowed down on goes to the revise, to be said more plainly, without changing what it decides, or leaving those signals in the resolved plan only? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** A step the reviewer rewound or slowed down on goes to the revise, to be said more plainly, without changing what it decides — the first code check showed the revise never saw them, so "hard to follow" changed nothing
- **Not chosen:** leaving those signals in the resolved plan only
- **Where:** 2026-09-22-close-the-lifecycle, step 3 (Check the diff against the plan before the walkthrough); components: diff
- **Status:** active

### D-038 — The fix step is skill instructions, not a script, or a script that applies fixes? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** The fix step is skill instructions, not a script — rewriting code is agent work; `walkthrough-scope` already does the sorting a script can do
- **Not chosen:** a script that applies fixes
- **Where:** 2026-09-22-close-the-lifecycle, step 5 (Act on the walkthrough review); components: diff, revise
- **Status:** active

### D-039 — A fixed call's row is updated in place ("changed after review: …"), or a new row for the fix? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** A fixed call's row is updated in place ("changed after review: …") — one row per call keeps the ledger and the video's beat ids lined up
- **Not chosen:** a new row for the fix
- **Where:** 2026-09-22-close-the-lifecycle, step 5 (Act on the walkthrough review); components: diff, revise
- **Status:** active

### D-040 — A note with no step, within 15 s after a flag, is taken to be about that flag, or only notes on the flag's step? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** A note with no step, within 15 s after a flag, is taken to be about that flag — reviewers flag, then type; the note often lands on no step
- **Not chosen:** only notes on the flag's step
- **Where:** 2026-09-22-close-the-lifecycle, step 5 (Act on the walkthrough review); components: diff, revise
- **Status:** active

### D-041 — An accepted agent call warns a later plan in reel check that touches its part, or failing, like a reviewed decision? (the agent's own call A13, accepted in the walkthrough)

- **Chosen:** An accepted agent call warns a later plan in reel check that touches its part — an accepted call is a ratified default, not an answer to a question; blocking every later plan on it would make accepting costly
- **Not chosen:** failing, like a reviewed decision
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): superseded by D-221, not D-219, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-22-close-the-lifecycle, step 5 (Act on the walkthrough review); components: diff, revise
- **Status:** superseded, superseded by D-221 on 2026-09-27

### D-042 — A flag becomes a new plan when the reviewer's words contain a ledger id or any option label (over 3 letters) of an active decision, or only the chosen option, or only this plan's decisions? (the agent's own call A16, accepted in the walkthrough)

- **Chosen:** A flag becomes a new plan when the reviewer's words contain a ledger id or any option label (over 3 letters) of an active decision — overturning any recorded choice, chosen or not, is a plan-level change; a false escalation costs a question, a missed one costs an unreviewed reversal
- **Not chosen:** only the chosen option, or only this plan's decisions
- **Where:** 2026-09-22-close-the-lifecycle, step 5 (Act on the walkthrough review); components: diff, revise
- **Status:** active

### D-043 — An answer in the reviewer's own words on an agent's call is a fix, with those words as the instruction, or an accept with a note? (the agent's own call A17, accepted in the walkthrough)

- **Chosen:** An answer in the reviewer's own words on an agent's call is a fix, with those words as the instruction — the reviewer rewrote the call; reading it as an accept dropped the richer-review A10 change (found in that review)
- **Not chosen:** an accept with a note
- **Where:** 2026-09-22-close-the-lifecycle, step 5 (Act on the walkthrough review); components: diff, revise
- **Status:** active

### D-044 — The system video is behind when spec.md changed after the video did (git commit times, file times when uncommitted), or a content hash of what the video says? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** The system video is behind when spec.md changed after the video did (git commit times, file times when uncommitted) — cheap, and the spec is the only source the video is built from
- **Not chosen:** a content hash of what the video says
- **Where:** 2026-09-22-close-the-lifecycle, step 6 (Keep the system video current); components: diff, system-video
- **Status:** active

### D-045 — Deviation from D-003: a rebuild regenerates narration for the whole video, or something else? (the agent's own call D1, accepted in the walkthrough)

- **Chosen:** Deviation from D-003: a rebuild regenerates narration for the whole video
- **Not chosen:** —
- **Where:** 2026-09-22-close-the-lifecycle, step 6 (Keep the system video current); components: diff, system-video
- **Status:** active

### D-046 — The Open chip's key is O; while a question sheet is up, O keeps meaning "answer in my own words", so the chip waits behind it, or E (the plan's key, which is Export today), or moving Export off E? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** The Open chip's key is O; while a question sheet is up, O keeps meaning "answer in my own words", so the chip waits behind it — O is the chip's own first letter and is free outside a question; moving E would break a key reviewers and `review-keys.spec.mjs` already rely on. A question on screen owns its letters, so the chip waits behind it
- **Not chosen:** E (the plan's key, which is Export today), or moving Export off E
- **Where:** 2026-09-23-deep-dives, step 1 (Deep-dive beats); components: player
- **Status:** active

### D-047 — Close plays again only if the video was playing when the detail opened and the playhead is still where it was; no seek back, or always play on close, or always seek back to the opening moment? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** Close plays again only if the video was playing when the detail opened and the playhead is still where it was; no seek back — "resumes where you were": a reviewer who opened it from a paused frame, or who moved the video while reading, would be surprised by a video that starts or jumps on its own
- **Not chosen:** always play on close, or always seek back to the opening moment
- **Where:** 2026-09-23-deep-dives, step 1 (Deep-dive beats); components: player
- **Status:** active

### D-048 — While the panel is open the video's keys are off (no play, draw or answer); O and Esc close it, or letting space/A–D/N act on the hidden video? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** While the panel is open the video's keys are off (no play, draw or answer); O and Esc close it — keys meant for the page should not start or answer the video under it. Once focus is inside the sandboxed page its keys are the page's own: Esc then works after one click on the panel's header, and × always works
- **Not chosen:** letting space/A–D/N act on the hidden video
- **Where:** 2026-09-23-deep-dives, step 1 (Deep-dive beats); components: player
- **Status:** active

### D-049 — A seventh template, fresh.html: the base styles, theme and bridge with an empty body, for kind fresh, or writing the bridge from scratch each time? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** A seventh template, fresh.html: the base styles, theme and bridge with an empty body, for kind fresh — the contract says a fresh page still carries the bridge; copying it is the reliable way
- **Not chosen:** writing the bridge from scratch each time
- **Where:** 2026-09-23-deep-dives, step 2 (Kinds of detail, most of them things to try); components: finish
- **Status:** active

### D-050 — Data pages are filled by one JSON block (rp-data); a prototype by two slots, markup and behaviour; explore by one optional script, or HTML slots everywhere, or JSON only? (the agent's own call A11, accepted in the walkthrough)

- **Chosen:** Data pages are filled by one JSON block (rp-data); a prototype by two slots, markup and behaviour; explore by one optional script — data pages (table, evidence, code, plan text) are data; a prototype is markup and behaviour, and 90 steps are a loop, not a list
- **Not chosen:** HTML slots everywhere, or JSON only
- **Where:** 2026-09-23-deep-dives, step 2 (Kinds of detail, most of them things to try); components: finish
- **Status:** active

### D-051 — Each template's sample is the uploads plan (risks, the 8/16/32 MB staging runs, parts.ts line 14, before/after drop, manifest explorer, a step's text), marked "Sample content", or lorem ipsum? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** Each template's sample is the uploads plan (risks, the 8/16/32 MB staging runs, parts.ts line 14, before/after drop, manifest explorer, a step's text), marked "Sample content" — a copied template already shows what good looks like for its kind; the check passes the templates as they are
- **Not chosen:** lorem ipsum
- **Where:** 2026-09-23-deep-dives, step 2 (Kinds of detail, most of them things to try); components: finish
- **Status:** active

### D-052 — A detail comment is kind: "note" with detail: { name, anchor, text }; Enter or Esc keeps the words, the × discards them; a click on another anchor keeps what was typed on the first, or a new kind (`detail-note`), or Esc discarding? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** A detail comment is kind: "note" with detail: { name, anchor, text }; Enter or Esc keeps the words, the × discards them; a click on another anchor keeps what was typed on the first — an ordinary annotation per the contract, so resolve-plan and every existing view read it as a comment; words are only thrown away on purpose
- **Not chosen:** a new kind (`detail-note`), or Esc discarding
- **Where:** 2026-09-23-deep-dives, step 3 (Comments inside a detail); components: resolve, player
- **Status:** active

### D-053 — A click on a control (button, a, input, select, textarea, label, summary, [data-no-anchor]) inside an anchored element does not post an anchor; the anchor element itself does, or posting on every click inside an anchor? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** A click on a control (button, a, input, select, textarea, label, summary, [data-no-anchor]) inside an anchored element does not post an anchor; the anchor element itself does — sorting a table, copying a cell or pressing a prototype's button should not open a comment box; commenting on the region still works by clicking or selecting text in it
- **Not chosen:** posting on every click inside an anchor
- **Where:** 2026-09-23-deep-dives, step 3 (Comments inside a detail); components: resolve, player
- **Status:** active

### D-054 — plan-text renders a Markdown link as its text plus the address in grey, never an <a href>, or a working link? (the agent's own call A15, accepted in the walkthrough)

- **Chosen:** plan-text renders a Markdown link as its text plus the address in grey, never an <a href> — the contract counts an http(s) href as a network load, and a sandboxed panel cannot open it anyway
- **Not chosen:** a working link
- **Where:** 2026-09-23-deep-dives, step 3 (Comments inside a detail); components: resolve, player
- **Status:** active

### D-055 — Accept / Flag in the panel are one-shot like the sheet's: once a verdict is on the record the buttons show it and are disabled; if that call's sheet is waiting, the panel's verdict answers it too, or letting the panel change a verdict, or leaving the sheet waiting? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** Accept / Flag in the panel are one-shot like the sheet's: once a verdict is on the record the buttons show it and are disabled; if that call's sheet is waiting, the panel's verdict answers it too — the sheet has no "change" for a call either; one verdict per call keeps the export and the Flag note consistent
- **Not chosen:** letting the panel change a verdict, or leaving the sheet waiting
- **Where:** 2026-09-23-deep-dives, step 4 (Walkthroughs open onto what changed, not always the code); components: player, skill, finish, resolve, implement-step
- **Status:** active

### D-056 — The plan text goes beside the stage (a 340 px column) when the stage loses under 10 % of its width for it; otherwise it is a section in the record, under Steps, or always below the player in the page flow (the plan's words)? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** The plan text goes beside the stage (a 340 px column) when the stage loses under 10 % of its width for it; otherwise it is a section in the record, under Steps — the record sheet is fixed and rests at a peek that fills the window under the controls, so anything in the page flow below the player sits behind it and nobody finds it; beside, the reviewer reads the lit step while the video plays, and the controls and Finish stay where they were
- **Not chosen:** always below the player in the page flow (the plan's words)
- **Where:** 2026-09-23-deep-dives, step 5 (The whole plan as a page beside the video); components: player
- **Status:** superseded, superseded by D-063 on 2026-09-23

### D-057 — Deviation from step 5: the plan text sits beside the stage when the window is wide, in the record otherwise (A3), or something else? (the agent's own call D2, accepted in the walkthrough)

- **Chosen:** Deviation from step 5: the plan text sits beside the stage when the window is wide, in the record otherwise (A3)
- **Not chosen:** —
- **Where:** 2026-09-23-deep-dives, step 5 (The whole plan as a page beside the video); components: player
- **Status:** active

### D-058 — The check fails on eight more ways a page can break than the four named before the build (the detail lists every rule), or only missing page / network / bridge text / page error? (the agent's own call A13, accepted in the walkthrough)

- **Chosen:** The check fails on eight more ways a page can break than the four named before the build (the detail lists every rule) — each is a way the Open chip leads to a broken page; the last two test the bridge by running it, not by reading it
- **Not chosen:** only missing page / network / bridge text / page error
- **Where:** 2026-09-23-deep-dives, step 6 (Every detail works before you see it); components: player, skill, finish, resolve, implement-step
- **Status:** active

### D-059 — Without playwright-core (or when Chromium will not start) the static checks still run and the result says the pages were not opened, or failing the build? (the agent's own call A14, accepted in the walkthrough)

- **Chosen:** Without playwright-core (or when Chromium will not start) the static checks still run and the result says the pages were not opened — the contract says "when available"; under npx the dev dependency is not installed
- **Not chosen:** failing the build
- **Where:** 2026-09-23-deep-dives, step 6 (Every detail works before you see it); components: player, skill, finish, resolve, implement-step
- **Status:** active

### D-060 — Deviation from step 1: the Open chip's key is O, or something else? (the agent's own call D1, accepted in the walkthrough)

- **Chosen:** Deviation from step 1: the Open chip's key is O
- **Not chosen:** —
- **Where:** 2026-09-23-deep-dives, step 1 (Deep-dive beats); components: player
- **Status:** active

### D-061 — The panel is fixed to the window's right edge, full height, min(560px, 44vw) wide, and the stage shrinks beside it; where that would leave the stage under 640 px (a window under about 1250 px) or on a phone, it covers the window, or a panel inside the stage's own height, or an overlay on the stage? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** The panel is fixed to the window's right edge, full height, min(560px, 44vw) wide, and the stage shrinks beside it; where that would leave the stage under 640 px (a window under about 1250 px) or on a phone, it covers the window — a detail is read or tried at length: the stage's 16:9 height is too short for a page, and covering the stage would lose the frame it belongs to
- **Not chosen:** a panel inside the stage's own height, or an overlay on the stage
- **Where:** 2026-09-23-deep-dives, step 1 (Deep-dive beats); components: player
- **Status:** active

### D-062 — The plan beside the video reads plan.md, never plan.resolved.md, or the resolved file when it exists? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** The plan beside the video reads plan.md, never plan.resolved.md — the contract says plan.md; the resolved file appends review sections the page beside the video should not carry
- **Not chosen:** the resolved file when it exists
- **Where:** 2026-09-23-deep-dives, step 5 (The whole plan as a page beside the video); components: player
- **Status:** active

### D-063 — The plan text goes beside the stage when the stage loses under 15 % of its width for it (under 10 % before the restyle), or keep 10 %? (after the review page restyle; the reviewer left it to the agent)

- **Chosen:** Beside the stage when that costs it under 15 % of its width; otherwise in the record — the slimmer controls made the stage larger, so at 1440x900 a 10 % limit would move the plan into the record, which is where A3 said nobody finds it
- **Not chosen:** Keep 10 %
- **Where:** 2026-09-23-deep-dives, step 5 (The whole plan as a page beside the video); components: player
- **Status:** active; supersedes D-056

### D-064 — Who runs the loop between your reviews?

- **Chosen:** A background agent that owns it — builds run in the background, a notification says when a video is ready, and Finish wakes the agent to record, revise and rebuild; you never say "I submitted" or watch a build. Costs an agent session that stays alive, locally or in the cloud; with none running, a review waits for the next session
- **Not chosen:** The agent in your session, when you ask (today's way: no new machinery, but you wait while it builds and tell it when you have submitted); The GitHub Action on push (reviews arrive as files committed to the repo, and CI revises them. Costs an API key as a repo secret, and a way for reviews to reach the repo that the hosted page does not have today)
- **Note:** would this be supported on other clis too besides just claude? like codex, opencode? just want to make sure we are not adding too much here. i know all have ability to be backgrounded. but not sure about hooks
- **Where:** 2026-09-22-m3-revise-loop, step 3 (Pressing Finish wakes the agent); components: finish
- **Status:** active

### D-065 — When a system-video comment asks for the system itself to change, what happens?

- **Chosen:** Small fixes go straight in; anything with a choice becomes a plan — a change inside one part with no decision to make (a wrong default, a confusing message, a missing check) is fixed right away and shown to you in a short walkthrough to accept or flag; anything that needs a choice, or touches more than one part, becomes a plan with its own plan video first
- **Not chosen:** Every change becomes a plan first (nothing changes until you have reviewed a plan video, even for a one-line fix. Safer, and slower for the small things you would just want fixed); Every change goes straight in (the fastest, and the walkthrough is the only review. Costs a plan-level choice made without asking you)
- **Where:** 2026-09-22-m3-revise-loop, step 4 (Reviewing the system video changes the system); components: system-video
- **Status:** active

### D-066 — How far does the first version go beyond Claude Code?

- **Chosen:** One setting, tested with Claude Code — the repo names its agent's headless command in .reelplanning/config.json, so Codex and opencode work by changing one line, but only Claude Code is run end to end in this plan
- **Not chosen:** Tested with all three (every agent is run end to end in step 5. Triples the proof, and needs each CLI installed and signed in); Claude Code only (no setting; the review server always runs Claude Code, and other agents come later with their own plan)
- **Where:** 2026-09-22-m3-revise-loop, step 3 (Pressing Finish reaches the main session, or starts one); components: finish
- **Status:** active

### D-067 — The kept narration is the project's own committed assets/voice/NN.wav and audio_meta.json, indexed by a small committed record, .hyperframes/narration.json (frame → key, text, wav sha256), or a per-repo, gitignored store (`.reelplanning/cache/narration/`)? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** The kept narration is the project's own committed assets/voice/NN.wav and audio_meta.json, indexed by a small committed record, .hyperframes/narration.json (frame → key, text, wav sha256) — cloud sessions start from a fresh clone, so a gitignored cache is empty exactly when the system video gets rebuilt. The wavs are already committed, so a committed key record makes them the cache, with no second copy
- **Not chosen:** a per-repo, gitignored store (`.reelplanning/cache/narration/`)
- **Where:** 2026-09-22-m3-revise-loop, step 1 (Narrate only the lines that changed); components: diff, system-video
- **Status:** active

### D-068 — The key is sha256 of {text, voice, speed, model}, with model = the TTS model plus the whisper model (kokoro-v1.0 + whisper small.en), read from the pinned HyperFrames CLI, or the HyperFrames version as the model? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** The key is sha256 of {text, voice, speed, model}, with model = the TTS model plus the whisper model (kokoro-v1.0 + whisper small.en), read from the pinned HyperFrames CLI — a HyperFrames upgrade that keeps kokoro-v1.0 should not re-narrate every video. Whisper is in the key because the word timings come from it
- **Not chosen:** the HyperFrames version as the model
- **Where:** 2026-09-22-m3-revise-loop, step 1 (Narrate only the lines that changed); components: diff, system-video
- **Status:** active

### D-069 — A video narrated before the record existed is adopted from git: the SCRIPT.md of the commit that last wrote audio_meta.json, only when audio_meta.json and assets/voice/ are exactly that commit's; --adopt does the same from the working SCRIPT.md, outside git, or re-narrating every line once, to create the record? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** A video narrated before the record existed is adopted from git: the SCRIPT.md of the commit that last wrote audio_meta.json, only when audio_meta.json and assets/voice/ are exactly that commit's; --adopt does the same from the working SCRIPT.md, outside git — every existing video (the system video included) would pay the 11 minutes once more on its first rebuild. The committed pair is the evidence of what the wavs were made from, and any later touch to the wavs disqualifies it
- **Not chosen:** re-narrating every line once, to create the record
- **Where:** 2026-09-22-m3-revise-loop, step 1 (Narrate only the lines that changed); components: diff, system-video
- **Status:** active

### D-070 — The cost is one phrase shared by spec-diff ("cost: …") and reel status ("with …"): the lines of the frames spec-diff names, plus any line already edited and not yet voiced, with seconds of speech and an estimate of time to make; spec-diff --json carries it as narration, or counting only the named frames' lines? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** The cost is one phrase shared by spec-diff ("cost: …") and reel status ("with …"): the lines of the frames spec-diff names, plus any line already edited and not yet voiced, with seconds of speech and an estimate of time to make; spec-diff --json carries it as narration — an edit already made to SCRIPT.md is part of the cost too, and the record knows it exactly (D-003: say the cost first)
- **Not chosen:** counting only the named frames' lines
- **Where:** 2026-09-22-m3-revise-loop, step 1 (Narrate only the lines that changed); components: diff, system-video
- **Status:** active

### D-071 — The notification fires from reelplanning review <video-dir> once the server is listening (the page is up and its URL known), and from reelplanning notify <video-dir> --url <artifact-url>, run by the skill after publishing a hosted page; review with no folder (the library) does not notify; --no-notify turns it off, or firing at the end of `verify.sh` or `finish-project.sh`? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** The notification fires from reelplanning review <video-dir> once the server is listening (the page is up and its URL known), and from reelplanning notify <video-dir> --url <artifact-url>, run by the skill after publishing a hosted page; review with no folder (the library) does not notify; --no-notify turns it off — verify and finish-project know no URL and run again and again while findings are fixed; "ready" in the plan means verify passed *and* the page is up, and the skill always runs `review` right after verify passes
- **Not chosen:** firing at the end of `verify.sh` or `finish-project.sh`
- **Where:** 2026-09-22-m3-revise-loop, step 2 (Builds run in the background, and you are told when a video is ready); components: system-video
- **Status:** active

### D-072 — The inbox is .reelplanning/inbox/<id>.json, gitignored with its claims, heartbeats and run logs; reel-intake is what turns a row into committed files, or committing inbox rows? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** The inbox is .reelplanning/inbox/<id>.json, gitignored with its claims, heartbeats and run logs; reel-intake is what turns a row into committed files — a row is untrusted and machine-local until intake checks it; committing it would also let a push look like a new review
- **Not chosen:** committing inbox rows
- **Where:** 2026-09-22-m3-revise-loop, step 3 (Pressing Finish reaches the main session, or starts one); components: finish
- **Status:** active

### D-073 — "A session is waiting" = a heartbeat file inbox/.waiters/<pid>.json, rewritten every 2 s by review --wait, and counted when it is under 10 s old and (same host) its pid is alive, or a plain pid lock file, or a socket the waiter holds open? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** "A session is waiting" = a heartbeat file inbox/.waiters/<pid>.json, rewritten every 2 s by review --wait, and counted when it is under 10 s old and (same host) its pid is alive — a killed session (SIGKILL, the laptop lid) leaves a stale file that ages out by itself; the pid check catches a clean exit sooner; one file per waiter so two sessions never overwrite each other
- **Not chosen:** a plain pid lock file, or a socket the waiter holds open
- **Where:** 2026-09-22-m3-revise-loop, step 3 (Pressing Finish reaches the main session, or starts one); components: finish
- **Status:** active

### D-074 — With a waiter alive, the server leaves the review to it, then looks again after 15 s: still unclaimed and no live waiter → it starts the headless run, or trusting the first look? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** With a waiter alive, the server leaves the review to it, then looks again after 15 s: still unclaimed and no live waiter → it starts the headless run — a waiter that dies between the look and its next poll would otherwise strand the review until someone opens a session
- **Not chosen:** trusting the first look
- **Where:** 2026-09-22-m3-revise-loop, step 3 (Pressing Finish reaches the main session, or starts one); components: finish
- **Status:** active

### D-075 — One handler per review, enforced by an exclusive-create claim file inbox/<id>.claim (open(…, "wx")): the waiting session, the headless start and the session-start pickup all have to win it, or a lock held in the server's memory? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** One handler per review, enforced by an exclusive-create claim file inbox/<id>.claim (open(…, "wx")): the waiting session, the headless start and the session-start pickup all have to win it — it survives the server restarting and settles the race between a waiter and a headless start; the loser simply does nothing
- **Not chosen:** a lock held in the server's memory
- **Where:** 2026-09-22-m3-revise-loop, step 3 (Pressing Finish reaches the main session, or starts one); components: finish
- **Status:** active

### D-076 — POST /api/review accepts only content-type: application/json, a Host of 127.0.0.1 or localhost on its port, and no foreign Origin; 5 MB cap; the body must carry review.annotations, or accepting any POST? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** POST /api/review accepts only content-type: application/json, a Host of 127.0.0.1 or localhost on its port, and no foreign Origin; 5 MB cap; the body must carry review.annotations — the endpoint can start an agent run, so a page in another tab must not reach it: a text/plain form post skips the CORS preflight, and the Host check stops DNS rebinding. The plan directory is still checked by `reel-intake`, not here
- **Not chosen:** accepting any POST
- **Where:** 2026-09-22-m3-revise-loop, step 3 (Pressing Finish reaches the main session, or starts one); components: finish
- **Status:** active

### D-077 — On a local page, Finish POSTs the row to /api/review only when the review server marked the page as its own (a meta tag) and a GET /api/review on load answered {ok:true}; a failed POST is dropped quietly and the download stays, or posting blind from every localhost page? (the agent's own call A15, accepted in the walkthrough)

- **Chosen:** On a local page, Finish POSTs the row to /api/review only when the review server marked the page as its own (a meta tag) and a GET /api/review on load answered {ok:true}; a failed POST is dropped quietly and the download stays — `npm run review` serves the player with python's http.server, which would answer every POST with a 501; the download and commands are still a complete answer
- **Not chosen:** posting blind from every localhost page
- **Where:** 2026-09-22-m3-revise-loop, step 3 (Pressing Finish reaches the main session, or starts one); components: finish
- **Status:** active

### D-078 — Intake checks a system-video target: inside the repo, directly in a .reelplanning/, with a STORYBOARD.md whose front matter says kind: system and a plan-map.json, and every mark's frame.compositionId one of that video's frames; system-review runs with the checked folder, never the row's claim, or believing the path once it matches? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** Intake checks a system-video target: inside the repo, directly in a .reelplanning/, with a STORYBOARD.md whose front matter says kind: system and a plan-map.json, and every mark's frame.compositionId one of that video's frames; system-review runs with the checked folder, never the row's claim — the same rule as for plans (checked, not believed); the frame check refuses a plan video's review sent to the system video by mistake
- **Not chosen:** believing the path once it matches
- **Where:** 2026-09-22-m3-revise-loop, step 4 (Reviewing the system video changes the system); components: system-video
- **Status:** active

### D-079 — The first sort is a keyword hint: rewinds, slow-downs, missed checks and wordless marks → video; words asking for a change → change, and then a choice word (or, which, either…) or a frame with 2+ parts (1 when the mark sits on a part) → plan, else small; each hint prints its reason; the agent decides, or no hint, or a model call? (the agent's own call A13, accepted in the walkthrough)

- **Chosen:** The first sort is a keyword hint: rewinds, slow-downs, missed checks and wordless marks → video; words asking for a change → change, and then a choice word (or, which, either…) or a frame with 2+ parts (1 when the mark sits on a part) → plan, else small; each hint prints its reason; the agent decides — the plan asks for a sort the agent overrides; crude and explainable beats clever
- **Not chosen:** no hint, or a model call
- **Where:** 2026-09-22-m3-revise-loop, step 4 (Reviewing the system video changes the system); components: system-video
- **Status:** active

### D-080 — The "short walkthrough" for a small change is a one-step plan from reel new-plan, with its own walkthrough.md and walkthrough video, or a walkthrough with no plan directory? (the agent's own call A14, accepted in the walkthrough)

- **Chosen:** The "short walkthrough" for a small change is a one-step plan from reel new-plan, with its own walkthrough.md and walkthrough video — walkthroughs, `reel record`, the ledger and the library all hang off a plan directory; a one-step plan is the smallest thing they already accept
- **Not chosen:** a walkthrough with no plan directory
- **Where:** 2026-09-22-m3-revise-loop, step 4 (Reviewing the system video changes the system); components: system-video
- **Status:** active

### D-081 — After a rebuild, "Play just the changes" is on by default when the build is a revision (some beats changed, not all) and the reviewer has not already sent a review of this same build; the toggle is remembered per video only for that build, or on only when a sent round exists, or remembering "whole video" for good? (the agent's own call A16, accepted in the walkthrough)

- **Chosen:** After a rebuild, "Play just the changes" is on by default when the build is a revision (some beats changed, not all) and the reviewer has not already sent a review of this same build; the toggle is remembered per video only for that build — a reviewer who downloaded instead of sending, or opens the revised video in a new browser, has no round on record but still wants the changes; a "whole video" kept from last round would hide the next round's changes
- **Not chosen:** on only when a sent round exists, or remembering "whole video" for good
- **Where:** 2026-09-22-m3-revise-loop, step 4 (Reviewing the system video changes the system); components: system-video
- **Status:** active

### D-082 — What may a run nobody is watching do?

- **Chosen:** Auto mode, inside the sandbox — --permission-mode auto --permission-prompts none: a classifier approves each action, workers and the web included, and refuses risky ones; Claude Code's sandbox keeps shell writes inside the repo and network to named hosts. Needs auto mode on your account, and bubblewrap on Linux; no native Windows
- **Not chosen:** As now: edits and any shell command (simple, and the step 5 proof passed with it; it cannot start workers or read the web, and nothing fences what its commands touch); Everything, inside the sandbox (--dangerously-skip-permissions with the sandbox on: nothing is refused, the sandbox is the only fence. Refuses to run as root; the docs recommend it only in a container); A short list (edits, plus only node, npx, git and ffmpeg commands. The tightest; a command outside the list is refused, and still no workers or web)
- **Where:** 2026-09-22-m3-revise-loop, step 6 (What a run nobody is watching may do); components: skill, cli, player, system-video, action
- **Status:** active

### D-083 — How many quick checks does a video ask?

- **Chosen:** One per step, plus wherever there is something to predict — the floor of A, and more where there is something to predict
- **Not chosen:** One per step, at least (each plan step, or each part of a walkthrough, ends with one: about one a minute. A six-minute walkthrough asks five or six); Wherever there is something to predict (no count: the agent asks one after every mechanism whose outcome a viewer could guess wrong. Could be two, could be twelve)
- **Note:** changed by D-197 to D-199 (decided in conversation, 2026-09-27): the count holds, but each check now comes after the next step's scenes (the last step's at the end, before the ending) and asks about a case the video did not show; the style guide's "It comes right after the beat that sets it up", "Use the same names and numbers as that beat's case" and "on a case the video showed" are replaced; corrected (walkthroughs-that-help's ledger-corrections-proposed.md): superseded by D-222, not D-219, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-22-m3-revise-loop, step 7 (More quick checks, and a wrong answer is a comment); components: skill, cli, player, system-video, action
- **Status:** superseded, superseded by D-222 on 2026-09-27

### D-084 — Does your own record also decide what stops?

- **Chosen:** The tags, and your record — the ledger keeps every verdict and the call's tags; a tag you have accepted ten times running across plans no longer stops on its own, and one flag brings it back. Learns what you care about; ten is a guess to tune
- **Not chosen:** The tags only (a call stops when the agent tagged it. Simple and predictable; how well it works depends on how well the agent tags); Every call still stops (faster to get through (one key, and the untagged ones grouped), but nothing is left out)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): superseded by D-220, not D-219, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-22-m3-revise-loop, step 8 (Stop only for the calls you might overturn); components: skill, cli, player, system-video, action
- **Status:** superseded, superseded by D-220 on 2026-09-27

### D-085 — How much scaffolding comes out?

- **Chosen:** B, and the files — also one command for the build, and a review kept once: the annotations, plus one short "what to act on" file instead of the resolved copies and scope files
- **Not chosen:** Only what hurts (move "Autonomous mode" out, loosen the step heading, let a plan cite its own decisions, drop the checklist. Small and safe; the text stays as long); A, and the text (also rewrite the skill and the style guide as one current guide each, about half as long, with the history moved to a design notes file. Format rules become goals)
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** active

### D-086 — Deviation from step 6: the re-run of the step 5 proof used enableWeakerNestedSandbox, which the shipped setting does not carry, because this container runs as root and the strict sandbox leaves such a run with no working shell, or something else? (the agent's own call D4, accepted in the walkthrough)

- **Chosen:** Deviation from step 6: the re-run of the step 5 proof used enableWeakerNestedSandbox, which the shipped setting does not carry, because this container runs as root and the strict sandbox leaves such a run with no working shell
- **Not chosen:** —
- **Where:** 2026-09-22-m3-revise-loop, step 6 (What a run nobody is watching may do); components: skill, cli, player, system-video, action
- **Status:** active

### D-087 — The sandbox settings are inline in the command's --settings, not a committed .claude/settings.json, or a committed `.claude/settings.json`? (the agent's own call A17, accepted in the walkthrough)

- **Chosen:** The sandbox settings are inline in the command's --settings, not a committed .claude/settings.json — only the run nobody is watching is fenced, not every session in the repo; `reel init` already writes the one line
- **Not chosen:** a committed `.claude/settings.json`
- **Where:** 2026-09-22-m3-revise-loop, step 6 (What a run nobody is watching may do); components: skill, cli, player, system-video, action
- **Status:** active

### D-088 — allowUnsandboxedCommands: false: nothing runs outside the fence, so a commit signed through a local agent fails, or letting the classifier approve an unsandboxed retry? (the agent's own call A19, accepted in the walkthrough)

- **Chosen:** allowUnsandboxedCommands: false: nothing runs outside the fence, so a commit signed through a local agent fails — otherwise the fence is advice
- **Not chosen:** letting the classifier approve an unsandboxed retry
- **Where:** 2026-09-22-m3-revise-loop, step 6 (What a run nobody is watching may do); components: skill, cli, player, system-video, action
- **Status:** active

### D-089 — The review server tells the reviewer when the run it started ends (ready, or stopped with its log); review --detach inside a run does nothing, or the run notifying through `review --detach`? (the agent's own call A20, accepted in the walkthrough)

- **Chosen:** The review server tells the reviewer when the run it started ends (ready, or stopped with its log); review --detach inside a run does nothing — a sandboxed run cannot see or reach the server: the first real run sent a dead link
- **Not chosen:** the run notifying through `review --detach`
- **Where:** 2026-09-22-m3-revise-loop, step 6 (What a run nobody is watching may do); components: skill, cli, player, system-video, action
- **Status:** active

### D-090 — No list of allowed hosts: in auto mode the classifier reviews each host a command names, or the plan's "network to named hosts"? (the agent's own call D3, accepted in the walkthrough)

- **Chosen:** No list of allowed hosts: in auto mode the classifier reviews each host a command names — a list needs upkeep; untested here, the sandbox had no network in this container
- **Not chosen:** the plan's "network to named hosts"
- **Where:** 2026-09-22-m3-revise-loop, step 6 (What a run nobody is watching may do); components: skill, cli, player, system-video, action
- **Status:** active

### D-091 — Flagged and own-words calls enter the ledger with status flagged/own; a new verdict on a call supersedes its earlier accept, or keeping only accepted calls? (the agent's own call A22, accepted in the walkthrough)

- **Chosen:** Flagged and own-words calls enter the ledger with status flagged/own; a new verdict on a call supersedes its earlier accept — the stop rule needs flags; the old rule left an accept in force after a later flag
- **Not chosen:** keeping only accepted calls
- **Where:** 2026-09-22-m3-revise-loop, step 8 (Stop only for the calls you might overturn); components: skill, cli, player, system-video, action
- **Status:** active

### D-092 — The grouped sheet has a Flag per call and one Accept all (A), no own-words box; taking a flag back clears the verdict, or own words and a key per call? (the agent's own call A24, accepted in the walkthrough)

- **Chosen:** The grouped sheet has a Flag per call and one Accept all (A), no own-words box; taking a flag back clears the verdict — keeps the sheet short; a comment still works
- **Not chosen:** own words and a key per call
- **Where:** 2026-09-22-m3-revise-loop, step 8 (Stop only for the calls you might overturn); components: skill, cli, player, system-video, action
- **Status:** active

### D-093 — Tags go in brackets at the end of the "chose" cell, or a seventh column? (the agent's own call A21, accepted in the walkthrough)

- **Chosen:** Tags go in brackets at the end of the "chose" cell — old tables and every reader keep working
- **Not chosen:** a seventh column
- **Where:** 2026-09-22-m3-revise-loop, step 8 (Stop only for the calls you might overturn); components: skill, cli, player, system-video, action
- **Status:** active

### D-094 — A tag's run of accepts counts across all plans in the order they were judged; entries without tags count for nothing, or per plan, or by date? (the agent's own call A23, accepted in the walkthrough)

- **Chosen:** A tag's run of accepts counts across all plans in the order they were judged; entries without tags count for nothing — dates tie within a review; the rule is about the reviewer, not the plan
- **Not chosen:** per plan, or by date
- **Where:** 2026-09-22-m3-revise-loop, step 8 (Stop only for the calls you might overturn); components: skill, cli, player, system-video, action
- **Status:** active

### D-095 — Reviews are filed as reviews/plan-<time>.json / walkthrough-<time>.json with an .md beside each, and migrate-reviews ships as a command that moved all six plans, or reading both layouts? (the agent's own call A25, accepted in the walkthrough)

- **Chosen:** Reviews are filed as reviews/plan-<time>.json / walkthrough-<time>.json with an .md beside each, and migrate-reviews ships as a command that moved all six plans — one layout to read; other repos get the same path
- **Not chosen:** reading both layouts
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** active

### D-096 — resolve-plan and resolve-walkthrough are deleted; revise-scope and walkthrough-scope stay as JSON printers, or keeping all four? (the agent's own call A26, accepted in the walkthrough)

- **Chosen:** resolve-plan and resolve-walkthrough are deleted; revise-scope and walkthrough-scope stay as JSON printers — the resolved copies are gone; the sorting is still used
- **Not chosen:** keeping all four
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** active

### D-097 — detail_kind is free-form and detail new --kind <anything> starts from the blank page; --step is gone, or a closed list of seven kinds? (the agent's own call A30, accepted in the walkthrough)

- **Chosen:** detail_kind is free-form and detail new --kind <anything> starts from the blank page; --step is gone — the kinds were a starting point, not a rule
- **Not chosen:** a closed list of seven kinds
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** active

### D-098 — Two details on one beat warn instead of failing the build; the last one opens, or failing the build? (the agent's own call A31, accepted in the walkthrough)

- **Chosen:** Two details on one beat warn instead of failing the build; the last one opens — a second detail is a slip, not a broken page; the warning names it
- **Not chosen:** failing the build
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** active

### D-099 — detail new with no --kind starts from the blank page (fresh), or requiring a template? (the agent's own call A32, accepted in the walkthrough)

- **Chosen:** detail new with no --kind starts from the blank page (fresh) — kinds are free-form now; the guide still says start from a template when one fits (D-024)
- **Not chosen:** requiring a template
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** active

### D-100 — `build` retimes against the narration the frames were timed to, kept in `.hyperframes/frames-timed-to.json` until retime passes, or always against HEAD? (the agent's own call A27, accepted in the walkthrough)

- **Chosen:** `build` retimes against the narration the frames were timed to, kept in `.hyperframes/frames-timed-to.json` until retime passes — a second build before a commit would move a frame twice
- **Not chosen:** always against HEAD
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** active

### D-101 — One on-screen budget: five new words per beat beyond labels, or eight? (the agent's own call A28, accepted in the walkthrough)

- **Chosen:** One on-screen budget: five new words per beat beyond labels — the later rule, from a review
- **Not chosen:** eight
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** active

### D-102 — Step 5's second proof is still owed: only the system video's review has been through a headless run and timed (9 min 13 s, then 12 min 20 s on step 6's command); a review of a plan's walkthrough has not, or something else? (the agent's own call D5, accepted in the walkthrough)

- **Chosen:** Step 5's second proof is still owed: only the system video's review has been through a headless run and timed (9 min 13 s, then 12 min 20 s on step 6's command); a review of a plan's walkthrough has not
- **Not chosen:** —
- **Where:** 2026-09-22-m3-revise-loop, step 5 (Prove it on real reviews); components: finish, revise, action, system-video
- **Status:** active

### D-103 — failIfUnavailable: true: where the sandbox cannot run (native Windows, Linux without bubblewrap), there is no headless run at all, or the default, which runs unsandboxed with a warning? (the agent's own call A18, answered in the reviewer's own words in the walkthrough)

- **Chosen:** failIfUnavailable: true: where the sandbox cannot run (native Windows, Linux without bubblewrap), there is no headless run at all — D-082 chose the fence; no run should go unfenced quietly
- **Not chosen:** the default, which runs unsandboxed with a warning
- **The reviewer's words:** ah there should be one just we should note this in the readme or something and hwen running so ppl are aware of that
- **Where:** 2026-09-22-m3-revise-loop, step 6 (What a run nobody is watching may do); components: skill, cli, player, system-video, action
- **Status:** own

### D-104 — Codex's equivalent is codex exec --sandbox workspace-write, not the plan's codex exec --full-auto, or the plan's flag? (the agent's own call D2, answered in the reviewer's own words in the walkthrough)

- **Chosen:** Codex's equivalent is codex exec --sandbox workspace-write, not the plan's codex exec --full-auto — `--full-auto` is deprecated and prints a warning
- **Not chosen:** the plan's flag
- **The reviewer's words:** i believe codex has an auto mode type permission too; we'll leave that for when the codex agent actually works on this
- **Where:** 2026-09-22-m3-revise-loop, step 6 (What a run nobody is watching may do); components: skill, cli, player, system-video, action
- **Status:** own

### D-105 — CLAUDE.md also tells an agent here to run this checkout's tooling rather than the published $RP, or moving only the autonomous-mode section? (the agent's own call A29, answered in the reviewer's own words in the walkthrough)

- **Chosen:** CLAUDE.md also tells an agent here to run this checkout's tooling rather than the published $RP — a plan here should be built with the code it changes
- **Not chosen:** moving only the autonomous-mode section
- **The reviewer's words:** confused here, i guess this is about doing a local vs npx one? its fine to allow both, and ofc local used when we are editing
- **Where:** 2026-09-22-m3-revise-loop, step 9 (Less scaffolding); components: skill, diff, player
- **Status:** own

### D-106 — Where does your memory across repos live?

- **Chosen:** A file in your home folder — ~/.reelplanning/you.jsonl, one line per review; any agent reads it through reel memory --you. Stays on this machine.
- **Not chosen:** Claude's own memory (Claude Code's user memory holds it: nothing new to keep, but only Claude reads it.); Not yet (The repo's memory first; yours waits for a later plan.)
- **Where:** 2026-09-24-memory, step 3 (Your memory, across repos); components: skill
- **Status:** active

### D-107 — When does the tool suggest a retro?

- **Chosen:** Every five plans, or when a signal repeats three times — Whichever comes first. A schedule catches slow drift that no single signal shows, and you still decide.
- **Not chosen:** Only when a signal repeats three times (No schedule; evidence only.); Never; you ask for one (reel retro exists, and nothing suggests it.)
- **Where:** 2026-09-24-memory, step 5 (A retro you start, checked against a fixed benchmark); components: skill
- **Status:** active

### D-108 — Where do the answers the frame can't take go?

- **Chosen:** i like the pricnicple of A, not messing w video, but we probably need it to be bigger. if we can design videos in a way where this bar is larger and more graceful in the video that might be best?
- **Not chosen:** A thin strip under the video (Own words, Explain this more, a note, Confirm, Show the frame, and a call's Accept and Flag, on one line under the frame, never over it. The frame is whole.); A small card in a corner of the frame (The same things in a compact card over the frame's top-right corner. Closer to where you look, but it covers a little of the frame.); Keep the sheet, restyled (No clicking on the frame's cards is needed; the sheet stays and only gets lighter and smaller.)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): superseded by the plan 2026-09-25-answer-in-the-frame as a whole, not by D-143 (another plan's call), with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-24-answer-on-the-video, step 2 (The sheet stops repeating the question); components: player, skill
- **Status:** superseded, superseded by the plan 2026-09-25-answer-in-the-frame as a whole on 2026-09-26

### D-109 — What may a miss with no tags stop?

- **Chosen:** Nothing directly — A miss stops only calls that share one of its tags; a miss with no tags still shapes the next plan's questions (memory step 4), but stops no call.
- **Not chosen:** Close calls on its part (It counts as a close miss on its components: it stops the calls there tagged close (15 of the answer-on-the-video's 22).); As now (Every tagged call on its components stops, for five plans.)
- **Where:** 2026-09-25-fewer-better-stops, step 2 (A miss stops calls of its own kind); components: cli, finish, player, skill
- **Status:** active

### D-110 — A step reaches its fifth call during the build. What does the implementer do?

- **Chosen:** Asks before going on — That step waits; its biggest open choice goes into plan.md as a question for you, and the other steps carry on.
- **Not chosen:** Builds on, and says so (The walkthrough opens with the count and the step; reel audit warns.)
- **Where:** 2026-09-25-fewer-better-stops, step 3 (Too many calls in one step is asked, not made); components: skill
- **Status:** active

### D-111 — The stamp is one `recorded` object in the filed review, { reviewer, via, reelplanning }, where `via` says whether the reviewer came from the page's viewer or git's user.email; the same review filed again with a different stamp (another person's intake, an upgrade) is still the same review, not a second file, or top-level `reviewer` and `version` fields, or a file beside the review? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** The stamp is one `recorded` object in the filed review, { reviewer, via, reelplanning }, where `via` says whether the reviewer came from the page's viewer or git's user.email; the same review filed again with a different stamp (another person's intake, an upgrade) is still the same review, not a second file — the filed review is the player's export plus what intake adds; one key keeps the two apart, and a refile must not turn one review into two
- **Not chosen:** top-level `reviewer` and `version` fields, or a file beside the review
- **Where:** 2026-09-24-memory, step 1 (Every review records its reviewer and the skill version); components: skill
- **Status:** active

### D-112 — The version is the reelplanning that records the review (its package.json), or the version that built the video, as the plan says? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** The version is the reelplanning that records the review (its package.json) — no build writes which version built a video (`video/meta.json` has none); with the pinned `npx` or this checkout, the two are the same version
- **Not chosen:** the version that built the video, as the plan says
- **Where:** 2026-09-24-memory, step 1 (Every review records its reviewer and the skill version); components: skill
- **Status:** active

### D-113 — migrate-reviews files old reviews unstamped (stamp: false), or stamping them with whoever runs the migration? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** migrate-reviews files old reviews unstamped (stamp: false) — old reviews stay as they are: who recorded them then is not known, and today's email and version would be wrong
- **Not chosen:** stamping them with whoever runs the migration
- **Where:** 2026-09-24-memory, step 1 (Every review records its reviewer and the skill version); components: skill
- **Status:** active

### D-114 — The page's viewer is read from the row's `viewer` (a string, or `{ email }` / `{ name }`), else the export's; the player is not changed to send one, or a player change that puts the viewer on every row? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** The page's viewer is read from the row's `viewer` (a string, or `{ email }` / `{ name }`), else the export's; the player is not changed to send one — the plan asks intake to use a viewer when the row has one; the player is being changed elsewhere right now, and a row that carries one works as soon as a page sends it
- **Not chosen:** a player change that puts the viewer on every row
- **Where:** 2026-09-24-memory, step 1 (Every review records its reviewer and the skill version); components: skill
- **Status:** active

### D-115 — The five lines' ids are words: recommended, own-words, rewinds, checks, misses (and flagged for yours across repos), so `reel memory own-words` says what it prints, or numbered ids (`m1` … `m5`)? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** The five lines' ids are words: recommended, own-words, rewinds, checks, misses (and flagged for yours across repos), so `reel memory own-words` says what it prints — an id you type is easier to remember as a word, and it stays the same when a line has nothing to say and is left out
- **Not chosen:** numbered ids (`m1` … `m5`)
- **Where:** 2026-09-24-memory, step 2 (The repo's memory: `reel status` says what reviews show); components: skill
- **Status:** active

### D-116 — Why a question was answered in own words is read from the words and the options: 'unclear, asked for more', 'an option, with a condition', otherwise 'the question framed otherwise'; the words are always shown with it, or no reason, only the words; or a reason the reviewer picks? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** Why a question was answered in own words is read from the words and the options: 'unclear, asked for more', 'an option, with a condition', otherwise 'the question framed otherwise'; the words are always shown with it — the plan's own problem statement sorts D-022, D-003 and D-023 this way, and all three land where it put them (D-108, "the principle of A … but bigger", lands on "with a condition"); a heuristic that shows its evidence can be wrong in the open
- **Not chosen:** no reason, only the words; or a reason the reviewer picks
- **Where:** 2026-09-24-memory, step 2 (The repo's memory: `reel status` says what reviews show); components: skill
- **Status:** active

### D-117 — 'Rewound again after a revision' is the same step of the same plan's same video rewound or slowed in two different reviews of it; a rewind with no step is left out of the line, or counting rewinds twice within one review; or including rewinds with no step? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** 'Rewound again after a revision' is the same step of the same plan's same video rewound or slowed in two different reviews of it; a rewind with no step is left out of the line — a second review of a video is what follows a revision; two rewinds in one sitting are one hard part, and a moment with no step cannot be said about any step
- **Not chosen:** counting rewinds twice within one review; or including rewinds with no step
- **Where:** 2026-09-24-memory, step 2 (The repo's memory: `reel status` says what reviews show); components: skill
- **Status:** active

### D-118 — A call counts once, by the first verdict it was given (a later round that re-judges it does not count again); plan questions count per review, or every verdict in every walkthrough review? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** A call counts once, by the first verdict it was given (a later round that re-judges it does not count again); plan questions count per review — "how often a recommendation was taken" is about the call as the agent first made it; deep-dives' second round re-judged all its calls
- **Not chosen:** every verdict in every walkthrough review
- **Where:** 2026-09-24-memory, step 2 (The repo's memory: `reel status` says what reviews show); components: skill
- **Status:** active

### D-119 — Your file (~/.reelplanning/you.jsonl) gets a summary only for a review recorded inside a git repo (the repo is named by its git top level), once per repo, plan and review, and `reel record` says so on one line each time ('a summary of this review added to …', 'already in …', or 'not in a git repo'), or a summary for every review recorded anywhere? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** Your file (~/.reelplanning/you.jsonl) gets a summary only for a review recorded inside a git repo (the repo is named by its git top level), once per repo, plan and review, and `reel record` says so on one line each time ('a summary of this review added to …', 'already in …', or 'not in a git repo') — a summary names its repo, and outside git there is none to name; it also keeps the player's `finish.spec` (a scratch folder, no git) out of the real home without touching the player; the line makes it plain what reached the file
- **Not chosen:** a summary for every review recorded anywhere
- **Where:** 2026-09-24-memory, step 3 (Your memory, across repos); components: skill
- **Status:** active

### D-120 — Across repos (`reel memory --you`) the fifth line is `flagged`, the kinds of call flagged or answered in own words, by tag, instead of misses, or misses across repos too? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** Across repos (`reel memory --you`) the fifth line is `flagged`, the kinds of call flagged or answered in own words, by tag, instead of misses — a miss is found in a repo's ledger history (what superseded what, rows changed after review), which a one-line summary per review does not carry; the plan's step 3 lists "the kinds of call flagged" as what the summary holds
- **Not chosen:** misses across repos too
- **Where:** 2026-09-24-memory, step 3 (Your memory, across repos); components: skill
- **Status:** active

### D-121 — A miss is recent while the plan that showed it is one of the last five plan folders, retros not counted, or a number of days, or until the next retro? (the agent's own call A11, accepted in the walkthrough)

- **Chosen:** A miss is recent while the plan that showed it is one of the last five plan folders, retros not counted — plans are the unit the retro rule already counts (D-107), and days mean nothing in a repo worked on in bursts; on this repo it keeps D-056 → D-063 and m3's step 6, and lets close-the-lifecycle's two go
- **Not chosen:** a number of days, or until the next retro
- **Where:** 2026-09-24-memory, step 4 (Misses decide what stops); components: system-video
- **Status:** active

### D-122 — A call's kind is its tags and the components its step names; a recent miss stops a tagged call that shares a tag with it, or, when the miss has no tags (a plan question, or a call logged before tags), a component. An untagged call still never stops (D-084). Right now no miss has tags, so D-056 → D-063 (component player) stops every tagged player call: all 22 of answer-on-the-video's calls, and m3's step 6 stops 13 of this plan's 15, or tags only (every miss so far has none, so nothing would change); or making untagged calls stop too? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** A call's kind is its tags and the components its step names; a recent miss stops a tagged call that shares a tag with it, or, when the miss has no tags (a plan question, or a call logged before tags), a component. An untagged call still never stops (D-084). Right now no miss has tags, so D-056 → D-063 (component player) stops every tagged player call: all 22 of answer-on-the-video's calls, and m3's step 6 stops 13 of this plan's 15 — the plan traces a question's miss to its components, so a component is the only way such a miss can reach a call; untagged calls are the ones the agent judged a reviewer would not care about, and the streak is what the exception overrides
- **Not chosen:** tags only (every miss so far has none, so nothing would change); or making untagged calls stop too
- **Where:** 2026-09-24-memory, step 4 (Misses decide what stops); components: system-video
- **Status:** active

### D-123 — 'A part reworked soon after' is read as a step whose walkthrough quick check the reviewer disagreed with in their own words (it worked otherwise than the plan they approved led them to expect, and was reworked), traced to that step's plan questions; a call accepted in review whose row later says '(changed after review: …)' counts as an accepted call reversed. Not read from git history, or parts whose files a later commit changed within some days? (the agent's own call D1, accepted in the walkthrough)

- **Chosen:** 'A part reworked soon after' is read as a step whose walkthrough quick check the reviewer disagreed with in their own words (it worked otherwise than the plan they approved led them to expect, and was reworked), traced to that step's plan questions; a call accepted in review whose row later says '(changed after review: …)' counts as an accepted call reversed. Not read from git history — every plan here touches the player and the CLI, so "changed again within days" would call every plan a miss; the disagreed check is the record of a part that worked otherwise than approved, and it finds the owner's own example (m3's step 6, the file tools, k3)
- **Not chosen:** parts whose files a later commit changed within some days
- **Where:** 2026-09-24-memory, step 4 (Misses decide what stops); components: system-video
- **Status:** active

### D-124 — A signal is one of: a question answered in own words for the same reason, a step rewound again after a revision, a quick check answered wrong on the same component, a miss of the same kind (tag, else component), a call flagged with the same tag; each counted over the plans since the last retro, and three of one makes a retro due, or any line's count reaching three (rewinds and wrong checks reach it in every repo)? (the agent's own call A13, accepted in the walkthrough)

- **Chosen:** A signal is one of: a question answered in own words for the same reason, a step rewound again after a revision, a quick check answered wrong on the same component, a miss of the same kind (tag, else component), a call flagged with the same tag; each counted over the plans since the last retro, and three of one makes a retro due — a repeat has to be the same thing three times to say something the skill should learn; counting from the last retro means a retro answers the signals before it
- **Not chosen:** any line's count reaching three (rewinds and wrong checks reach it in every repo)
- **Where:** 2026-09-24-memory, step 5 (A retro you start, checked against a fixed benchmark); components: skill
- **Status:** active

### D-125 — `reel retro` names its folder <date>-retro (then -retro-2 …); its draft cites the active plan decisions on the skill as in force, so `reel check` passes it as written; the benchmark's parts are found by their files, in the repo or else in reelplanning's own checkout, or a fixed list of what is missing; a draft that fails `reel check` until the agent cites decisions? (the agent's own call A14, accepted in the walkthrough)

- **Chosen:** `reel retro` names its folder <date>-retro (then -retro-2 …); its draft cites the active plan decisions on the skill as in force, so `reel check` passes it as written; the benchmark's parts are found by their files, in the repo or else in reelplanning's own checkout — a benchmark that gains its baselines should stop being called missing without a code change; a draft that fails its own check is scaffolding to clean up
- **Not chosen:** a fixed list of what is missing; a draft that fails `reel check` until the agent cites decisions
- **Where:** 2026-09-24-memory, step 5 (A retro you start, checked against a fixed benchmark); components: skill
- **Status:** active

### D-126 — Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory, or failing the record; or keeping a pending copy in the repo to add later? (the agent's own call A15, answered in the reviewer's own words in the walkthrough)

- **Chosen:** Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory — recording the review is the job; the summary is a copy, and a pending file in the repo would be one more thing kept by hand
- **Not chosen:** failing the record; or keeping a pending copy in the repo to add later
- **The reviewer's words:** we still wantt o write somewhere, just somewhere we can access i guess
- **Where:** 2026-09-24-memory, step 3 (Your memory, across repos); components: skill
- **Status:** own

### D-127 — Which words does the viewer see: plain new ones, or today's, explained?

- **Chosen:** Plain words on screen — What you see and hear says choice (not call), label (not tag), accepted in a row (not streak), late fix (not miss), chapter (not part) and scene (not beat); files, commands and the decision log keep today's names, and the glossary lists both. Costs two names for each thing.
- **Not chosen:** Today's words, explained (One name everywhere; the explanation card, the words panel and step one's click do the work, in every video, for every new viewer.)
- **Note:** yes do A and in general we want simple language too in our plasn i think thats a good aspect, dont make more complicated than it needs to be
- **Where:** 2026-09-25-videos-you-can-follow, step 1 (Every word is explained once, in the system video, and one click away); components: finish, system-video
- **Status:** active

### D-128 — Where is "you watched it" kept?

- **Chosen:** This browser, and your file — The page ticks a video off the moment you finish it; when you send a review, your file across repos records it too, so any repo's tool can read it.
- **Not chosen:** Only reviews you send (A review already records how much you watched; a video you finish without sending a review counts as not watched.)
- **Where:** 2026-09-25-videos-you-can-follow, step 2 (The tool picks what to watch first); components: revise, system-video
- **Status:** active

### D-129 — Can approving ever be blocked when you answered checks wrong?

- **Chosen:** Never; it is recorded — Approve works as always; the review says approved with 3 of 3 checks missed, and memory's lost line counts it.
- **Not chosen:** Blocked when all are missed (When every check was answered wrong, Approve waits until you open each missed check's explanation.)
- **Where:** 2026-09-25-videos-you-can-follow, step 3 (The tool remembers where you got lost); components: skill, system-video
- **Status:** active

### D-130 — The glossary's plain words are a fifth column, "On screen", read into each plan map `glossary[]` row as `display` (only where a row has one), with the on-screen word's forms after the term's in `forms`, so `forms[0]` stays the key, plus `definedIn`, or a separate mapping file; or `display` on every row? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** The glossary's plain words are a fifth column, "On screen", read into each plan map `glossary[]` row as `display` (only where a row has one), with the on-screen word's forms after the term's in `forms`, so `forms[0]` stays the key, plus `definedIn` — one table stays the one list of names ("the glossary lists both", D-127), and the player already reads `glossary[]`
- **Not chosen:** a separate mapping file; or `display` on every row
- **Where:** 2026-09-25-videos-you-can-follow, step 1 (Every word is explained once, in the system video, and one click away); components: skill, finish, player, system-video
- **Status:** active

### D-131 — Plain words beyond D-127's six: answer bar, off-plan change, grouped scene, and "part of the system" for an area, or only the six D-127 names; or "part" for an area? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** Plain words beyond D-127's six: answer bar, off-plan change, grouped scene, and "part of the system" for an area — the plan's own words for the first two; "part of the system", so an older video's "Part two" is never underlined as a piece of the system
- **Not chosen:** only the six D-127 names; or "part" for an area
- **Where:** 2026-09-25-videos-you-can-follow, step 1 (Every word is explained once, in the system video, and one click away); components: skill, finish, player, system-video
- **Status:** active

### D-132 — The list of which video explains each word is `.reelplanning/terms-index.json`, written by a new `reelplanning terms-index` that finish-project runs after the plan map, the system video's scenes first, or a list inside every plan map; or worked out by the player? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** The list of which video explains each word is `.reelplanning/terms-index.json`, written by a new `reelplanning terms-index` that finish-project runs after the plan map, the system video's scenes first — one file every tool reads (`reel prereqs`, the plan map's `definedIn`), rebuilt on every build
- **Not chosen:** a list inside every plan map; or worked out by the player
- **Where:** 2026-09-25-videos-you-can-follow, step 1 (Every word is explained once, in the system video, and one click away); components: skill, finish, player, system-video
- **Status:** active

### D-133 — The system video says the plain words throughout, not only where it defines them ("Chapter 2 of 5", choices, labels, scenes, "Question 1" on the decision mock); to stay under eight minutes the headless-run scene lost two sentences, the review loop's scene its "a plan's review hasn't made that trip yet", and rule two its reopened-by-hand story, or rename only the defining scenes; or let it run past eight minutes? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** The system video says the plain words throughout, not only where it defines them ("Chapter 2 of 5", choices, labels, scenes, "Question 1" on the decision mock); to stay under eight minutes the headless-run scene lost two sentences, the review loop's scene its "a plan's review hasn't made that trip yet", and rule two its reopened-by-hand story — D-127 is what you see and hear; the budget is the system video's
- **Not chosen:** rename only the defining scenes; or let it run past eight minutes
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): superseded by the plan 2026-09-27-walkthroughs-that-help as a whole (its step 7 has no decision), not by D-221, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-25-videos-you-can-follow, step 1 (Every word is explained once, in the system video, and one click away); components: skill, finish, player, system-video
- **Status:** superseded, superseded by the plan 2026-09-27-walkthroughs-that-help as a whole on 2026-09-27

### D-134 — `reel prereqs` picks the system video's chapter by the words the plan's steps share with the chapter's scenes (and a second within 90% of it); the parts touched only break a tie, or the parts touched alone? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** `reel prereqs` picks the system video's chapter by the words the plan's steps share with the chapter's scenes (and a second within 90% of it); the parts touched only break a tie — every chapter shows the review player or the reel CLI, so parts alone picked "why a video" for most plans; words pick the build loop for fewer-better-stops, the plan's example
- **Not chosen:** the parts touched alone
- **Where:** 2026-09-25-videos-you-can-follow, step 2 (The tool picks what to watch first); components: finish, revise, system-video
- **Status:** active

### D-135 — A plan it builds on: its "Decisions in force" and "Supersedes" ids, except a bullet that says "not touched"; most decisions first, then the one cited first; only earlier plans; a decision on a call points at that plan's walkthrough video, or every id cited; or the newest plan first? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** A plan it builds on: its "Decisions in force" and "Supersedes" ids, except a bullet that says "not touched"; most decisions first, then the one cited first; only earlier plans; a decision on a call points at that plan's walkthrough video — plans list "unchanged; not touched here" decisions for completeness, not because the video leans on them; this gives the plan's example, the revise-loop video for fewer-better-stops
- **Not chosen:** every id cited; or the newest plan first
- **Where:** 2026-09-25-videos-you-can-follow, step 2 (The tool picks what to watch first); components: finish, revise, system-video
- **Status:** active

### D-136 — `reel prereqs` writes the lines into the storyboard's front matter, replacing the `before:` lines there (`--dry-run` only prints; with no storyboard yet it prints them to paste), and keeps the files' `#part N` while reading `#chapter N` too, or print only, for the author to paste? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** `reel prereqs` writes the lines into the storyboard's front matter, replacing the `before:` lines there (`--dry-run` only prints; with no storyboard yet it prints them to paste), and keeps the files' `#part N` while reading `#chapter N` too — the plan says the author no longer guesses; the files keep their names (D-127)
- **Not chosen:** print only, for the author to paste
- **Where:** 2026-09-25-videos-you-can-follow, step 2 (The tool picks what to watch first); components: finish, revise, system-video
- **Status:** active

### D-137 — `lost` is a sixth memory line beside `checks`, so `reel status` ends with at most six lines, not five; `checks` keeps the count, `lost` says it per plan with the rest, or `lost` replacing `checks`, keeping five lines? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** `lost` is a sixth memory line beside `checks`, so `reel status` ends with at most six lines, not five; `checks` keeps the count, `lost` says it per plan with the rest — D-115, an accepted call, names the five ids with `checks` among them, and the plan asks for a new line; the memory plan's "at most five" was written before there was a sixth thing to say
- **Not chosen:** `lost` replacing `checks`, keeping five lines
- **Where:** 2026-09-25-videos-you-can-follow, step 3 (The tool remembers where you got lost); components: skill, system-video
- **Status:** active

### D-138 — Two review fields for the player to send: `confusion.termsLookedUp` (the glossary keys opened) and `watched` (`[{ video, seen?, sent? }]`, the browser's marks, on the review or on a hosted row beside it); the reviewed video counts as watched at 80%, the player's own rule, or a count only (today's `termsOpened`); or only the reviewed video? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** Two review fields for the player to send: `confusion.termsLookedUp` (the glossary keys opened) and `watched` (`[{ video, seen?, sent? }]`, the browser's marks, on the review or on a hosted row beside it); the reviewed video counts as watched at 80%, the player's own rule — three reviews looking up one word needs the word; D-128 needs the browser's list to reach your file
- **Not chosen:** a count only (today's `termsOpened`); or only the reviewed video
- **Where:** 2026-09-25-videos-you-can-follow, step 3 (The tool remembers where you got lost); components: skill, system-video
- **Status:** active

### D-139 — What your file knows (videos watched, words looked up) is the last line of `reel memory --you` and the "(your file: watched)" note of `reel prereqs`, not a memory line, or a memory line of its own? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** What your file knows (videos watched, words looked up) is the last line of `reel memory --you` and the "(your file: watched)" note of `reel prereqs`, not a memory line — memory's lines say what reviews show about plans; this is what you know
- **Not chosen:** a memory line of its own
- **Where:** 2026-09-25-videos-you-can-follow, step 3 (The tool remembers where you got lost); components: skill, system-video
- **Status:** active

### D-140 — "The answer was not shown": a word of the right answer (four letters or more, not a common word, stemmed, a number read as digits) that the `explained_at` scene, else the scene before the check, never says or shows; a warning, or an exact phrase; or any scene before the check? (the agent's own call A11, accepted in the walkthrough)

- **Chosen:** "The answer was not shown": a word of the right answer (four letters or more, not a common word, stemmed, a number read as digits) that the `explained_at` scene, else the scene before the check, never says or shows; a warning — it catches the plan's example (fewer-better-stops' "Twice") without asking for the answer's exact words
- **Not chosen:** an exact phrase; or any scene before the check
- **Note:** kept, and changed by D-198 (decided in conversation, 2026-09-27): the rule must still be explained at explained_at, but the check's own new case (a word of its question, a count worked out from a question that gives numbers) is no longer held to that scene; two warnings join it: a check right after the scene that explains it, and one on that scene's own case
- **Where:** 2026-09-25-videos-you-can-follow, step 4 (Quick checks test the main idea, on the case just shown); components: skill
- **Status:** active

### D-141 — The id warning is for `explain` only; a `walk_me_through` may name a choice by its number beside its word ("choice A3 moved…"), or `explain` and `walk_me_through`? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** The id warning is for `explain` only; a `walk_me_through` may name a choice by its number beside its word ("choice A3 moved…") — the plan asks for `explain`'s reason in words; a walk-through works the case, and the bare-id rule still holds for what is said
- **Not chosen:** `explain` and `walk_me_through`
- **Where:** 2026-09-25-videos-you-can-follow, step 4 (Quick checks test the main idea, on the case just shown); components: skill
- **Status:** active

### D-142 — Which accent colour?

- **Chosen:** A darker coral — The same hue, dark enough to pass on the page; the videos take it too.
- **Not chosen:** Today's coral (The videos and the page stay one colour; it fails 3 to 1 contrast on a light grey page.); Tally's orange (A brighter signal on the page; the videos keep coral, so two oranges.)
- **Where:** 2026-09-26-better-visuals, step 3 (The review page's look, with its fonts); components: player
- **Status:** active

### D-143 — The frame's cards are answered through transparent buttons the player lays over them in its own page, placed from each card's box in the frame (percent of the stage), with the hover and focus ring drawn by the player, or listeners and a hover style injected into the frame's own document? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** The frame's cards are answered through transparent buttons the player lays over them in its own page, placed from each card's box in the frame (percent of the stage), with the hover and focus ring drawn by the player — the frame's document is rebuilt by the runtime (a theme switch, a reload) and sits under the HyperFrames player's own click handling; the player's buttons are tabbable, keep the keyboard in the player, and need nothing from the frame but its boxes
- **Not chosen:** listeners and a hover style injected into the frame's own document
- **Where:** 2026-09-24-answer-on-the-video, step 1 (Click an option on the frame to answer); components: player
- **Status:** active

### D-144 — Cards are matched by data-option, then by data-plan-option (the letter the system video, every walkthrough check and the bob-dylan check already carry), then by an id ending -opt-a / -option-a / -choice-a / -chip-a, and only then by the order of the elements whose class ends in -opt; a rule counts only when it finds exactly one card per option, each with a box, or `data-option` then the order of `-opt` elements only? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** Cards are matched by data-option, then by data-plan-option (the letter the system video, every walkthrough check and the bob-dylan check already carry), then by an id ending -opt-a / -option-a / -choice-a / -chip-a, and only then by the order of the elements whose class ends in -opt; a rule counts only when it finds exactly one card per option, each with a box — a survey of every question frame on the review page: order alone matched none of the quick checks in the walkthroughs or the system video, and a letter already written on the card is safer than counting; a frame where no rule finds every option keeps the sheet
- **Not chosen:** `data-option` then the order of `-opt` elements only
- **Where:** 2026-09-24-answer-on-the-video, step 1 (Click an option on the frame to answer); components: player
- **Status:** active

### D-145 — A card on the frame shows its state as its button in the (hidden) sheet does: ticked or your answer ringed in ink, the right answer to an answered quick check in coral, with a small tag ("picked", "your answer", "the answer"); "recommended" is not tagged, the frame says it, or no state on the frame, only words in the strip? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** A card on the frame shows its state as its button in the (hidden) sheet does: ticked or your answer ringed in ink, the right answer to an answered quick check in coral, with a small tag ("picked", "your answer", "the answer"); "recommended" is not tagged, the frame says it — the reviewer answered on the card, so the answer is marked there; reading the sheet's buttons (a MutationObserver) keeps both in step with one source
- **Not chosen:** no state on the frame, only words in the strip
- **Where:** 2026-09-24-answer-on-the-video, step 1 (Click an option on the frame to answer); components: player
- **Status:** active

### D-146 — "Show the frame" is kept in the strip, and there it puts the question aside: the strip folds to one line ("Still to answer") and the cards and keys stop answering, so the frame can be marked; a mark tool that is on also takes the clicks from the cards (changed after review: under the video the band folds to that one line in its kept room; in the frame it folds to a pill in the corner of the empty eighth, m3), or dropping "Show the frame" (the frame is no longer covered), or cards that answer while drawing? (the agent's own call A11, accepted in the walkthrough)

- **Chosen:** "Show the frame" is kept in the strip, and there it puts the question aside: the strip folds to one line ("Still to answer") and the cards and keys stop answering, so the frame can be marked; a mark tool that is on also takes the clicks from the cards (changed after review: under the video the band folds to that one line in its kept room; in the frame it folds to a pill in the corner of the empty eighth, m3) — the plan lists it; without it a reviewer who wants to draw on a question's frame would answer it by accident
- **Not chosen:** dropping "Show the frame" (the frame is no longer covered), or cards that answer while drawing
- **Where:** 2026-09-24-answer-on-the-video, step 1 (Click an option on the frame to answer); components: player
- **Status:** active

### D-147 — A video leaves its lowest eighth for the band by data-band="bottom" on each frame's root (or once, on the video's own root); the band goes in the frame only when every frame that asks something carries it, decided once, when the runtime has mounted those frames (looked for up to about 8 s after ready); until then, and otherwise, it goes under the video, or a field in the storyboard's front matter lifted into the plan map, or a place decided per question? (the agent's own call A13, accepted in the walkthrough)

- **Chosen:** A video leaves its lowest eighth for the band by data-band="bottom" on each frame's root (or once, on the video's own root); the band goes in the frame only when every frame that asks something carries it, decided once, when the runtime has mounted those frames (looked for up to about 8 s after ready); until then, and otherwise, it goes under the video — the attribute is on what actually leaves the room, so a frame built without it cannot claim it; a video mixing places would still have to keep the room under it for its older frames, so it is one place per video
- **Not chosen:** a field in the storyboard's front matter lifted into the plan map, or a place decided per question
- **Where:** 2026-09-24-answer-on-the-video, step 2 (A band, not a sheet: large enough to read, and the video never resizes); components: player, skill
- **Status:** active

### D-148 — The band is an eighth of the video high, never under 72 px. Under the video its room (.bandroom) is kept for the whole video and the stage's height formula leaves exactly it (--band-k 8/9, --band-min 72 px), so the page still fits the window; what does not fit scrolls inside the band rather than growing it. On a phone it is in the page's flow, at least 104 px, and grows by a line when needed, or a band that grows with what it holds, or a fixed pixel height? (the agent's own call A14, accepted in the walkthrough)

- **Chosen:** The band is an eighth of the video high, never under 72 px. Under the video its room (.bandroom) is kept for the whole video and the stage's height formula leaves exactly it (--band-k 8/9, --band-min 72 px), so the page still fits the window; what does not fit scrolls inside the band rather than growing it. On a phone it is in the page's flow, at least 104 px, and grows by a line when needed — growing would move the transport under it, and a fixed height would be too small on a large screen or too large on a small one; on a phone the frame is the page's width, so a growing band still never resizes it
- **Not chosen:** a band that grows with what it holds, or a fixed pixel height
- **Where:** 2026-09-24-answer-on-the-video, step 2 (A band, not a sheet: large enough to read, and the video never resizes); components: player, skill
- **Status:** active

### D-149 — The band's layout: two lines. First the kicker, the question in its own words on one line in the serif (the whole question in its title) and Show the frame; then the hint and the acts, the act that goes on (Continue, Confirm) at the right in ink. Answered, the feedback (two lines at most) takes the question's place. Type scales with the video (cqw): the question 15–22 px, buttons 30–40 px, or the question in full, wrapping; or the strip's one line? (the agent's own call A15, accepted in the walkthrough)

- **Chosen:** The band's layout: two lines. First the kicker, the question in its own words on one line in the serif (the whole question in its title) and Show the frame; then the hint and the acts, the act that goes on (Continue, Confirm) at the right in ink. Answered, the feedback (two lines at most) takes the question's place. Type scales with the video (cqw): the question 15–22 px, buttons 30–40 px — an eighth of the video holds two lines of reading-size type; the frame shows the question in full already, so the band's line says which question waits
- **Not chosen:** the question in full, wrapping; or the strip's one line
- **Where:** 2026-09-24-answer-on-the-video, step 2 (A band, not a sheet: large enough to read, and the video never resizes); components: player, skill
- **Status:** active

### D-150 — In the frame, the captions are hidden while the band is up (not while it is folded), and come back when it goes, or leaving the captions? (the agent's own call A16, accepted in the walkthrough)

- **Chosen:** In the frame, the captions are hidden while the band is up (not while it is folded), and come back when it goes — the caption pill sits at y 880–1040, so the band (from y 945) would leave its top edge showing above it; while a question waits the band carries the words
- **Not chosen:** leaving the captions
- **Where:** 2026-09-24-answer-on-the-video, step 2 (A band, not a sheet: large enough to read, and the video never resizes); components: player, skill
- **Status:** active

### D-151 — A call always gets the strip, though its frame has no cards: Accept (A) and Flag (B) in it, and the call's "Instead of", "Why" and "Check" leave the player for the kicker's tooltip, since the call's frame shows them (changed after review: the strip is now the band; what the call chose is its one line of words there, in the serif, and its Accept and Flag are clear buttons), or keeping the sheet for calls, or listing those facts in the strip? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** A call always gets the strip, though its frame has no cards: Accept (A) and Flag (B) in it, and the call's "Instead of", "Why" and "Check" leave the player for the kicker's tooltip, since the call's frame shows them (changed after review: the strip is now the band; what the call chose is its one line of words there, in the serif, and its Accept and Flag are clear buttons) — the plan puts a call's Accept and Flag in the strip; every walkthrough frame for a call already draws what it chose, what it replaced and where to check
- **Not chosen:** keeping the sheet for calls, or listing those facts in the strip
- **Where:** 2026-09-24-answer-on-the-video, step 2 (A band, not a sheet: large enough to read, and the video never resizes); components: player, skill
- **Status:** active

### D-152 — A group of calls in the strip: Accept all, then one "Flag A21" per call, named by its id as the frame names it; what each chose and replaced is in its button's title (changed after review: in the band, with "N more calls from this part." as its line of words), or the sheet's list of the calls with a Flag on each row? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** A group of calls in the strip: Accept all, then one "Flag A21" per call, named by its id as the frame names it; what each chose and replaced is in its button's title (changed after review: in the band, with "N more calls from this part." as its line of words) — the grouped frame lists the calls; the list over it is what step 2 removes
- **Not chosen:** the sheet's list of the calls with a Flag on each row
- **Where:** 2026-09-24-answer-on-the-video, step 2 (A band, not a sheet: large enough to read, and the video never resizes); components: player, skill
- **Status:** active

### D-153 — On a touch screen the strip says "Tap a card." with no keys named, and its buttons drop their key caps (changed after review: the band's words; on a phone every key cap in the band goes, and its buttons are 44 px high), or the desktop wording ("Click a card, or press A, B or C.")? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** On a touch screen the strip says "Tap a card." with no keys named, and its buttons drop their key caps (changed after review: the band's words; on a phone every key cap in the band goes, and its buttons are 44 px high) — there are no keys to press on a phone
- **Not chosen:** the desktop wording ("Click a card, or press A, B or C.")
- **Where:** 2026-09-24-answer-on-the-video, step 2 (A band, not a sheet: large enough to read, and the video never resizes); components: player, skill
- **Status:** active

### D-154 — While the strip is up the stage gives it its height, so the page still fits the window: the frame shrinks by the strip (about 52 px at 1440×1000; more while an answered quick check shows its explanation, which takes a second line). On a phone the strip is simply in the page's flow (changed after review: removed; the owner saw the video shrink and grow back. The band's room is kept for the whole video instead, A14, and the video never changes size), or keeping the frame's size and letting the page scroll under the strip? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** While the strip is up the stage gives it its height, so the page still fits the window: the frame shrinks by the strip (about 52 px at 1440×1000; more while an answered quick check shows its explanation, which takes a second line). On a phone the strip is simply in the page's flow (changed after review: removed; the owner saw the video shrink and grow back. The band's room is kept for the whole video instead, A14, and the video never changes size) — the page's rule is the biggest frame that fits the window with its chrome; a strip pushing the timeline and Finish below the window breaks it
- **Not chosen:** keeping the frame's size and letting the page scroll under the strip
- **Where:** 2026-09-24-answer-on-the-video, step 2 (A band, not a sheet: large enough to read, and the video never resizes); components: player, skill
- **Status:** active

### D-155 — The 10 s wait is for a quick check answered just now; a question met again, already answered, keeps 4 s, or 10 s for every answered question met again? (the agent's own call A17, accepted in the walkthrough)

- **Chosen:** The 10 s wait is for a quick check answered just now; a question met again, already answered, keeps 4 s — the owner's words were about reading a quick check's explanation after answering; a rewatch past a run of answered questions would otherwise stop 10 s at each
- **Not chosen:** 10 s for every answered question met again
- **Where:** 2026-09-24-answer-on-the-video, step 5 (Questions keep pace with you); components: player, skill
- **Status:** active

### D-156 — "On the band" is the pointer over it, or the keyboard on any control in it but Continue; while held the count starts again from the top when let go, and the hint says "Waits while you are here". Only the band: the sheet (a frame with no cards) keeps counting under a resting pointer, or Continue counting too; or pausing and resuming the count where it was? (the agent's own call A18, accepted in the walkthrough)

- **Chosen:** "On the band" is the pointer over it, or the keyboard on any control in it but Continue; while held the count starts again from the top when let go, and the hint says "Waits while you are here". Only the band: the sheet (a frame with no cards) keeps counting under a resting pointer — the player puts the keyboard on Continue after every answer, so counting it would mean it never goes on; a sheet is answered by clicking on it, so the pointer is always there
- **Not chosen:** Continue counting too; or pausing and resuming the count where it was
- **Where:** 2026-09-24-answer-on-the-video, step 5 (Questions keep pace with you); components: player, skill
- **Status:** active

### D-157 — "Back to where this was explained": explained_at is a frame number or a composition id, lifted into the plan map as that frame's start (explainedAt, explainedFrame; one naming no frame warns and is left out). Without it: the first beat of the check's plan_step before it that is not a branch or a quick check, else its part's start. The video plays from there at once. In the record it is on the answered quick checks' rows, the only ones listed there, or a time in seconds in the storyboard; landing paused? (the agent's own call A19, accepted in the walkthrough)

- **Chosen:** "Back to where this was explained": explained_at is a frame number or a composition id, lifted into the plan map as that frame's start (explainedAt, explainedFrame; one naming no frame warns and is left out). Without it: the first beat of the check's plan_step before it that is not a branch or a quick check, else its part's start. The video plays from there at once. In the record it is on the answered quick checks' rows, the only ones listed there — a frame survives a retime and a time does not; the reviewer asked for the rewind to be automatic, so it plays
- **Not chosen:** a time in seconds in the storyboard; landing paused
- **Where:** 2026-09-24-answer-on-the-video, step 5 (Questions keep pace with you); components: player, skill
- **Status:** active

### D-158 — The trip back is sent as a rewind (D-005), or not counting it? (the agent's own call A20, accepted in the walkthrough)

- **Chosen:** The trip back is sent as a rewind (D-005) — it is one, and the review's "rewound here" is the same signal: something there wanted saying more plainly
- **Not chosen:** not counting it
- **Where:** 2026-09-24-answer-on-the-video, step 5 (Questions keep pace with you); components: player, skill
- **Status:** active

### D-159 — Reached again after "Back to where this was explained", a quick check waits with no count even when it was answered, as when opened from its mark, or the usual 4 s for an answered one? (the agent's own call A21, accepted in the walkthrough)

- **Chosen:** Reached again after "Back to where this was explained", a quick check waits with no count even when it was answered, as when opened from its mark — the reviewer went back to look at it again; it should be there when they arrive
- **Not chosen:** the usual 4 s for an answered one
- **Where:** 2026-09-24-answer-on-the-video, step 5 (Questions keep pace with you); components: player, skill
- **Status:** active

### D-160 — An open question the video leaves while playing (Play pressed with it up, or a seek away and then Play) gives way, and stops the video again when reached; a seek while paused still leaves it up, the frame moving under it; the rule that a question asked once and left open is never asked again is dropped, or closing it on any seek, or Play doing nothing while a question waits? (the agent's own call A22, accepted in the walkthrough)

- **Chosen:** An open question the video leaves while playing (Play pressed with it up, or a seek away and then Play) gives way, and stops the video again when reached; a seek while paused still leaves it up, the frame moving under it; the rule that a question asked once and left open is never asked again is dropped — `review-keys.spec.mjs` keeps the question up under ← and →, so a reviewer can look back before answering; Play is the reviewer choosing to go on without answering, and the question then comes back where it belongs
- **Not chosen:** closing it on any seek, or Play doing nothing while a question waits
- **Where:** 2026-09-24-answer-on-the-video, step 5 (Questions keep pace with you); components: player, skill
- **Status:** active

### D-161 — "change" opens a small editor under the answer: the question's options (a click saves; a pick-all ticks, then "Save the picks") and a line for own words (Enter saves); Esc closes it unchanged; no "Explain this more" there. Changing it while that question is up on the video closes the question, or a select, or reopening the question on the video as before? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** "change" opens a small editor under the answer: the question's options (a click saves; a pick-all ticks, then "Save the picks") and a line for own words (Enter saves); Esc closes it unchanged; no "Explain this more" there. Changing it while that question is up on the video closes the question — the options are what the question offered, and the record is written as a fresh answer would be, so the video routes by it; asking for more is the question's own act
- **Not chosen:** a select, or reopening the question on the video as before
- **Where:** 2026-09-24-answer-on-the-video, step 3 (Edit the record where it is listed); components: player, skill
- **Status:** active

### D-162 — An answer that was in own words, changed in the record, drops the comment those words made at the question; new own words make a new one, or leaving the old comment, or rewording it in place? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** An answer that was in own words, changed in the record, drops the comment those words made at the question; new own words make a new one — the answer and that comment are the same words; left behind, the export would carry two different answers to one question
- **Not chosen:** leaving the old comment, or rewording it in place
- **Where:** 2026-09-24-answer-on-the-video, step 3 (Edit the record where it is listed); components: player, skill
- **Status:** active

### D-163 — A call's verdict switches with one link beside it, "accept instead" or "flag instead"; a call answered in own words can be switched to either, and its comment goes, or a toggle, or reopening the call on the video? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** A call's verdict switches with one link beside it, "accept instead" or "flag instead"; a call answered in own words can be switched to either, and its comment goes — one click makes the same record the strip makes (`recordVerdict`), so the flag's note on its step is added or removed with it
- **Not chosen:** a toggle, or reopening the call on the video
- **Where:** 2026-09-24-answer-on-the-video, step 3 (Edit the record where it is listed); components: player, skill
- **Status:** active

### D-164 — After a send, "Send the change" is offered at the head of the record as well as in the Finish panel, on the local review page only, or the Finish panel only; or the hosted page too? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** After a send, "Send the change" is offered at the head of the record as well as in the Finish panel, on the local review page only — edits are made in the record, so the offer is where they are made; a hosted page has no second send today (a new comment is not offered there either), and adding one is a change to what the hosted store receives
- **Not chosen:** the Finish panel only; or the hosted page too
- **Where:** 2026-09-24-answer-on-the-video, step 3 (Edit the record where it is listed); components: player, skill
- **Status:** active

### D-165 — The new spec plays four videos through (this plan's, the revise-loop plan and walkthrough, the system video); the other videos on the review page were checked once, by a script, for their cards being matched (all were), and are not in the spec, or every video on the review page in the spec? (the agent's own call D1, accepted in the walkthrough)

- **Chosen:** The new spec plays four videos through (this plan's, the revise-loop plan and walkthrough, the system video); the other videos on the review page were checked once, by a script, for their cards being matched (all were), and are not in the spec — the four are the kinds there are (plan, walkthrough with calls and groups, system); each more video adds about a minute to `npm test`, and the matching they would test is the same code
- **Not chosen:** every video on the review page in the spec
- **Where:** 2026-09-24-answer-on-the-video, step 4 (Check it on the videos already there); components: finish, system-video
- **Status:** active

### D-166 — Which scenes must show the real thing?

- **Chosen:** The brief picks — Each video's brief lists which scenes show the real thing; a scene left off the list, like the table scene, can stay boxes, and nothing warns.
- **Not chosen:** Every scene, checked (Every scene that has a real thing shows it: the storyboard names it per scene, and the build warns on a scene that draws only boxes, so the table scene shows the table.); Rules only (Only the style guide and the motion language change; nothing checks, so the table scene comes out however the rule is read, as today.)
- **Where:** 2026-09-26-better-visuals, step 1 (A scene shows the real thing, with plain words pinned to it); components: diff, player
- **Status:** active

### D-167 — Which look should the review page take?

- **Chosen:** Today's, fixes only — Today's look with its fonts shipped, text in solid dark shades and a real scale of sizes; it fixes harder to read, not unoriginal.
- **Not chosen:** Tally (One plain sans (Archivo) with headings in wide capitals and numbers in a mono face, a cool grey console round the video, the right answer ringed in solid black with a tick; readable and new; 228 KB of fonts.); Reading desk (A very clear sans (Atkinson Hyperlegible) and a book serif (Literata) on a warm beige desk, the right answer ringed in green with a tick; readable, but still close to today's page; 170 KB of fonts.)
- **Where:** 2026-09-26-better-visuals, step 3 (The review page's look, with its fonts); components: player
- **Status:** active

### D-168 — Do the text-only and HTML arms go all the way to a finished site?

- **Chosen:** All the way, fixes included — A fair comparison of where each ends up; about two more builds and two more fix rounds of your time.
- **Not chosen:** Stop at the approved plan (Cheap; compares plans only, so where we end up is ours alone.); Build once, no fixes (Shows what slipped through the first build at half the cost; the end point is not what you would ship.)
- **Where:** 2026-09-26-case-study, step 2 (The text-only and HTML arms, from the same prompt to a finished site); components: diff, headless, revise
- **Status:** active

### D-169 — Who reviews each arm, and in what order?

- **Chosen:** You, ours first — What you learn on ours helps the two others, so a win for ours is not from practice. A day between arms.
- **Not chosen:** You, ours last (One reviewer, one taste; but by ours you have seen the prompt twice, which helps ours.); You ours; another the rest (Nothing carries over; but two people differ in taste and speed, which muddies the times.)
- **Where:** 2026-09-26-case-study, step 3 (Our arm: the whole lifecycle, every stage captured); components: skill, system-video
- **Status:** active

### D-170 — How is where we end up judged?

- **Chosen:** Rubric, blind judge, your rank — Three views that can disagree; you rank before you see the judge's scores.
- **Not chosen:** You alone, with the rubric (Fast; but you built ours, so the result is easy to doubt.); A blind judge alone (The same for any plan and cheap to repeat; misses what only a person using the site notices.)
- **Note:** yes we will use rubric but its also about the planning process, and also about what we think might be different than rubric
- **Where:** 2026-09-26-case-study, step 4 (Where each ends up: measured the same way, judged blind, written up); components: cli
- **Status:** active

### D-171 — How do decision numbers survive two branches?

- **Chosen:** In order, a merge rule — The PR merged second runs reel renumber: D-171 becomes D-172, and its mentions follow. A number never changes once it is on main.
- **Not chosen:** Numbered after the merge (A branch writes D-new-1; a job on main gives the real numbers after each merge, in a commit of its own.); Plan's own until merge (A branch writes D-contributing-1; the maintainer runs reel renumber when merging.)
- **Where:** 2026-09-26-contributing, step 4 (Records that merge: decision numbers, generated files, the glossary); components: cli, skill, system-video
- **Status:** active

### D-172 — The pinned word is marked `data-gloss="<the thing's own word>"`, its text the plain word (`<em data-gloss="misses">late fixes</em>` on the `misses` token); frame-lint notes one outside any `data-artifact`, or a `data-pin` or `data-term` attribute, or the attribute holding the plain word? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** The pinned word is marked `data-gloss="<the thing's own word>"`, its text the plain word (`<em data-gloss="misses">late fixes</em>` on the `misses` token); frame-lint notes one outside any `data-artifact` — the attribute names what is glossed (the file's word), the text is what the viewer reads, which check-terms already holds to the rules
- **Not chosen:** a `data-pin` or `data-term` attribute, or the attribute holding the plain word
- **Where:** 2026-09-26-better-visuals, step 1 (A scene shows the real thing, with plain words pinned to it); components: diff, player
- **Status:** active

### D-173 — BRIEF.md's three lines are `- Medium:`, `- Layouts:`, `- Main transition:` under Customizations, a starting point at `templates/video/BRIEF.md`, and `build` warns (△) when one is missing, or skill text only? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** BRIEF.md's three lines are `- Medium:`, `- Layouts:`, `- Main transition:` under Customizations, a starting point at `templates/video/BRIEF.md`, and `build` warns (△) when one is missing — a line nothing reads drifts; a warning never stops a build, so old videos only get a △
- **Not chosen:** skill text only
- **Where:** 2026-09-26-better-visuals, step 1 (A scene shows the real thing, with plain words pinned to it); components: diff, player
- **Status:** active

### D-174 — `variety` reads BRIEF.md's `- Real things:` as an optional fourth line: when there, `build` prints it as a ✓ line ("BRIEF.md picks the real things: …"); when not, nothing; build warnings stay the three existing lines, or not reading it at all, or warning when it is missing? (the agent's own call A25, accepted in the walkthrough)

- **Chosen:** `variety` reads BRIEF.md's `- Real things:` as an optional fourth line: when there, `build` prints it as a ✓ line ("BRIEF.md picks the real things: …"); when not, nothing; build warnings stay the three existing lines — D-166 says nothing warns; a line nothing reads drifts (A3), and repeating it in the build output lets whoever builds see the brief's pick next to the frames
- **Not chosen:** not reading it at all, or warning when it is missing
- **Where:** 2026-09-26-better-visuals, step 1 (A scene shows the real thing, with plain words pinned to it); components: diff, player
- **Status:** active

### D-175 — The variety warning reads a scene's layout from a new optional `- layout:` storyboard line, else a `- blueprint:` other than `compose`; transitions by type (push-slide LEFT and UP are one); under 5 scenes is not judged; `build` prints it after the length, or reading `- blueprint:` alone? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** The variety warning reads a scene's layout from a new optional `- layout:` storyboard line, else a `- blueprint:` other than `compose`; transitions by type (push-slide LEFT and UP are one); under 5 scenes is not judged; `build` prints it after the length — every storyboard says `blueprint: compose` whatever it draws (the better-visuals video too), so blueprint alone warned on every video, varied or not
- **Not chosen:** reading `- blueprint:` alone
- **Where:** 2026-09-26-better-visuals, step 2 (What each move means, written down; checks that keep the answer safe); components: player
- **Status:** active

### D-176 — The dark theme's coral is `#D2693F` (same hue, lighter: 5.2:1 on the dark paper, 4.5 and 4.0 on its tiles), light stays `#B8552E` (4.6 on paper, 4.0 and 3.8 on the tiles), or `#B8552E` in both themes? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** The dark theme's coral is `#D2693F` (same hue, lighter: 5.2:1 on the dark paper, 4.5 and 4.0 on its tiles), light stays `#B8552E` (4.6 on paper, 4.0 and 3.8 on the tiles) — it clears 3:1 on the dark grounds too, but only just (3.0 on the darker dark tile)
- **Not chosen:** `#B8552E` in both themes
- **Where:** 2026-09-26-better-visuals, step 3 (The review page: today's look, made readable, with its fonts); components: player
- **Status:** active

### D-177 — The page's fonts are today's three families (Inter, EB Garamond, JetBrains Mono) as fontsource 5.3.0's variable latin woff2, upright only (133 KB with their OFL texts), committed in `packages/player/fonts/`, or an npm devDependency (@fontsource-variable/*), which an `npx reelplanning` install does not carry, or the videos' static 400/700 files, which have no 500/600 for the chrome's weights; italics (+143 KB) left out? (the agent's own call A21, accepted in the walkthrough)

- **Chosen:** The page's fonts are today's three families (Inter, EB Garamond, JetBrains Mono) as fontsource 5.3.0's variable latin woff2, upright only (133 KB with their OFL texts), committed in `packages/player/fonts/` — the bundle must work from an installed package offline, and the chrome sets 500 and 600; italics only show in glossary `<i>`, which the browser slants
- **Not chosen:** an npm devDependency (@fontsource-variable/*), which an `npx reelplanning` install does not carry, or the videos' static 400/700 files, which have no 500/600 for the chrome's weights; italics (+143 KB) left out
- **Where:** 2026-09-26-better-visuals, step 3 (The review page: today's look, made readable, with its fonts); components: player
- **Status:** active

### D-178 — The right answer to a quick check takes a `--right` token, ink by default: a 4 px ink ring on its card, its why ringed in ink and headed "✓ The answer"; your wrong pick keeps its ink why and gets "✕", and its card a dashed ring (the tick and cross are CSS content, so the words in the page, which the specs read, are unchanged), or staying coral (D-145), which D-142 now keeps for what is yours, or Reading desk's green (a new hue, one look's choice)? (the agent's own call A23, accepted in the walkthrough)

- **Chosen:** The right answer to a quick check takes a `--right` token, ink by default: a 4 px ink ring on its card, its why ringed in ink and headed "✓ The answer"; your wrong pick keeps its ink why and gets "✕", and its card a dashed ring (the tick and cross are CSS content, so the words in the page, which the specs read, are unchanged) — ink is the neutral both looks can start from (Tally keeps it; Reading desk sets `--right` to its green in one line), and the tick, the cross and the dashed ring say it without colour
- **Not chosen:** staying coral (D-145), which D-142 now keeps for what is yours, or Reading desk's green (a new hue, one look's choice)
- **Where:** 2026-09-26-better-visuals, step 3 (The review page: today's look, made readable, with its fonts); components: player
- **Status:** active

### D-179 — Where coral stays and where it goes: it stays on the questions waiting on the timeline, the waiting status, "Changed" (to rewatch), your flags, your own words, your marks, Mark while on, the card under your pointer or focus, "Still to answer" and resend; it leaves the current part's number, the current step and record row, the current video in the Videos list, the Terms panel's "this scene" bar, links (ink, underlined), the agent's "recommended", a size or speed off its default, "Copied", "Sent", "Watched" and the walk-through's kicker, or a lighter pass that only darkens the colour? (the agent's own call A24, accepted in the walkthrough)

- **Chosen:** Where coral stays and where it goes: it stays on the questions waiting on the timeline, the waiting status, "Changed" (to rewatch), your flags, your own words, your marks, Mark while on, the card under your pointer or focus, "Still to answer" and resend; it leaves the current part's number, the current step and record row, the current video in the Videos list, the Terms panel's "this scene" bar, links (ink, underlined), the agent's "recommended", a size or speed off its default, "Copied", "Sent", "Watched" and the walk-through's kicker — D-142 and the plan make coral mean one thing, "yours, waiting on you"; each of these was coral for "current" or "state"
- **Not chosen:** a lighter pass that only darkens the colour
- **Where:** 2026-09-26-better-visuals, step 3 (The review page: today's look, made readable, with its fonts); components: player
- **Status:** active

### D-180 — Small coral text (`--rp-coral-deep`) becomes `#9C4524` on cream (5.0:1 on the darker tile), `#E3A184` kept for dark; the detail pages' templates (`templates/details/*.html`) keep `#CC785C` for now, or recolouring the detail templates now? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** Small coral text (`--rp-coral-deep`) becomes `#9C4524` on cream (5.0:1 on the darker tile), `#E3A184` kept for dark; the detail pages' templates (`templates/details/*.html`) keep `#CC785C` for now — the detail pages follow the review page's look, which waited on question 2 when this was made (decided since, D-167: see Not done)
- **Not chosen:** recolouring the detail templates now
- **Note:** changed after review (2026-09-27, 04b9826): the detail pages' templates take today's look too: #B8552E / #D2693F, #9C4524 / #E3A184 at text size, the three solid inks, coral only for the call and the part a comment is on, and the review page's faces in the player's panel
- **Where:** 2026-09-26-better-visuals, step 3 (The review page: today's look, made readable, with its fonts); components: player
- **Status:** active

### D-181 — The faces are one manifest, `packages/player/fonts/faces.json` (roles sans/serif/mono → family + fallback; faces → file, weight, style, range, licence). The player declares them in the page's `<head>` itself (a `<style data-rp-fonts>`, and `--rp-sans/--rp-serif/--rp-mono` on `:root` that its `--sans/--serif/--mono` read); the bundle copies the files and licences to `fonts/`, inlines the manifest in the page and preloads the files, so the declaration is synchronous there, or the bundle writing the `@font-face` rules itself (a second builder, and a dev page or any other host of the player without fonts), or a hand-written fonts.css beside a list? (the agent's own call A22, accepted in the walkthrough)

- **Chosen:** The faces are one manifest, `packages/player/fonts/faces.json` (roles sans/serif/mono → family + fallback; faces → file, weight, style, range, licence). The player declares them in the page's `<head>` itself (a `<style data-rp-fonts>`, and `--rp-sans/--rp-serif/--rp-mono` on `:root` that its `--sans/--serif/--mono` read); the bundle copies the files and licences to `fonts/`, inlines the manifest in the page and preloads the files, so the declaration is synchronous there — one list and one builder, and every page that hosts the player gets the faces; swapping to Tally or Reading desk is new files plus this JSON
- **Not chosen:** the bundle writing the `@font-face` rules itself (a second builder, and a dev page or any other host of the player without fonts), or a hand-written fonts.css beside a list
- **Where:** 2026-09-26-better-visuals, step 3 (The review page: today's look, made readable, with its fonts); components: player
- **Status:** active

### D-182 — Past Fit the stage keeps Fit's box and the picture is zoomed inside it, in a view that scrolls (`.zport` > `.zin`, `--zoom-k`): the player, the drawing canvas, the cards' buttons, a mark's words and, while zoomed, the answer-on-frame layer are inside the picture and move with it; the band, the sheets, the chips, the poster and the corner stay on the view; a card's "More" and a word's meaning close when the view scrolls, or growing the stage itself inside a scrolling box (the band, chips and corner would scroll away with it), or a CSS transform on the stage (text in the band would grow and every rect-based placement would mix scaled and unscaled boxes)? (the agent's own call A30, accepted in the walkthrough)

- **Chosen:** Past Fit the stage keeps Fit's box and the picture is zoomed inside it, in a view that scrolls (`.zport` > `.zin`, `--zoom-k`): the player, the drawing canvas, the cards' buttons, a mark's words and, while zoomed, the answer-on-frame layer are inside the picture and move with it; the band, the sheets, the chips, the poster and the corner stay on the view; a card's "More" and a word's meaning close when the view scrolls — nothing under the video moves; everything placed from the picture's box (boxesOf, More, a mark's words) now reads `picRect()`, so it follows the zoom with one change each
- **Not chosen:** growing the stage itself inside a scrolling box (the band, chips and corner would scroll away with it), or a CSS transform on the stage (text in the band would grow and every rect-based placement would mix scaled and unscaled boxes)
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-183 — A question asked while zoomed in keeps the zoom; the view scrolls once to it: its heading and cards where both fit in the view, else the cards (centred where they fit, else their top-left corner; clear of the band's eighth where the band is in the frame), or resetting to Fit while a question is up? (the agent's own call A31, accepted in the walkthrough)

- **Chosen:** A question asked while zoomed in keeps the zoom; the view scrolls once to it: its heading and cards where both fit in the view, else the cards (centred where they fit, else their top-left corner; clear of the band's eighth where the band is in the frame) — the reviewer chose the zoom to read; the cards' buttons line up at any size (checked at 200%), and the heading's words are one click away in "Full question"
- **Not chosen:** resetting to Fit while a question is up
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-184 — When no why fits anywhere by the cards ("none"), each card's verdict ("Your answer · not quite, it is B", "The answer") rides on its card's tag on the top edge (the ink tag the cards already had, ✕ or ✓ before it), and "Read why in full" opens the words, or hiding the verdicts and leaving the rings alone to say it? (the agent's own call A35, accepted in the walkthrough)

- **Chosen:** When no why fits anywhere by the cards ("none"), each card's verdict ("Your answer · not quite, it is B", "The answer") rides on its card's tag on the top edge (the ink tag the cards already had, ✕ or ✓ before it), and "Read why in full" opens the words — at 1440 × 900 this plan's own k1–k4 land here; without the words a dashed ring does not say "yours, and wrong"
- **Not chosen:** hiding the verdicts and leaving the rings alone to say it
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-185 — The names list is its own file, `.reelplanning/names.md` (template `templates/reelplanning/names.md`; `reel init` copies it; a repo with none uses the package's), read by `scripts/lib/names.mjs`, or a "Names" section in `glossary.md`? (the agent's own call A40, accepted in the walkthrough)

- **Chosen:** The names list is its own file, `.reelplanning/names.md` (template `templates/reelplanning/names.md`; `reel init` copies it; a repo with none uses the package's), read by `scripts/lib/names.mjs` — a `glossary.md` edit marks the system video behind (`reel status` compares dates), and frame-lint, system-review and spec-diff each parse every table row in it
- **Not chosen:** a "Names" section in `glossary.md`
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-186 — Code (chip, own spelling): `reelplanning`, `reel`, `hyperframes`, `npm`, `npx`, `git`, `claude` (lowercase: the command), `codex`, `opencode`, `ffmpeg`. Plain, with their case: HyperFrames (the framework), GitHub, Claude, Claude Code, Kokoro, Whisper, GSAP, CLI, JSON, JSONL, HTML, CSS, TTS, API, URL, macOS; a plain name has its case fixed and is not highlighted (the question left at the fifth call; stands as built), or Whisper as code; `reel` left out (it is also an English word); plain names in bold, in full ink? (the agent's own call A41, accepted in the walkthrough)

- **Chosen:** Code (chip, own spelling): `reelplanning`, `reel`, `hyperframes`, `npm`, `npx`, `git`, `claude` (lowercase: the command), `codex`, `opencode`, `ffmpeg`. Plain, with their case: HyperFrames (the framework), GitHub, Claude, Claude Code, Kokoro, Whisper, GSAP, CLI, JSON, JSONL, HTML, CSS, TTS, API, URL, macOS; a plain name has its case fixed and is not highlighted (the question left at the fifth call; stands as built) — you named command names as code. Whisper is the model's own name, and its tool, whisper-cli, is a path-like word that is left alone anyway. An exact spelling picks its row first, so HyperFrames stays the framework and `hyperframes` stays the command; one kind of mark in a caption line reads as "this is the tool"
- **Not chosen:** Whisper as code; `reel` left out (it is also an English word); plain names in bold, in full ink
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-187 — The caption markup is `<code class="cap-code">` inside the word's own span: JetBrains Mono at 0.8em on a `--rp-tile-2` chip, its colour following the karaoke state. A command's next words join the same chip (`reel status`, `npx reelplanning build`), with punctuation outside it, or the name alone as a chip (`reel` status); a full-ink chip ahead of the spoken word? (the agent's own call A42, accepted in the walkthrough)

- **Chosen:** The caption markup is `<code class="cap-code">` inside the word's own span: JetBrains Mono at 0.8em on a `--rp-tile-2` chip, its colour following the karaoke state. A command's next words join the same chip (`reel status`, `npx reelplanning build`), with punctuation outside it — it reads as one command, the way the frames' terminal shows it. Following the karaoke keeps the viewer's place in the line
- **Not chosen:** the name alone as a chip (`reel` status); a full-ink chip ahead of the spoken word
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-188 — The on-screen check lives in check-terms as a △ warning that never fails. It flags a code name outside `<code>`/`<pre>`/`<kbd>`/`<samp>` or a mono face, and a listed name spelled another way. Text inside a `data-artifact` and words inside a path are left alone, or a frame-lint finding? (the agent's own call A43, accepted in the walkthrough)

- **Chosen:** The on-screen check lives in check-terms as a △ warning that never fails. It flags a code name outside `<code>`/`<pre>`/`<kbd>`/`<samp>` or a mono face, and a listed name spelled another way. Text inside a `data-artifact` and words inside a path are left alone — check-terms already walks each frame's on-screen lines and knows `data-artifact`, and build runs it first. On the system video it flagged six sans labels "The reel CLI", fixed in `eebb945`
- **Not chosen:** a frame-lint finding
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-189 — Moving around: the view's own (thin) scroll bars, the wheel and a trackpad; the wheel over what sits on the view (the poster's play button, the chips, the corner) is passed to the view; no drag-to-pan; the arrow keys stay the player's (seek), or drag-to-pan, or arrow keys that pan? (the agent's own call A32, accepted in the walkthrough)

- **Chosen:** Moving around: the view's own (thin) scroll bars, the wheel and a trackpad; the wheel over what sits on the view (the poster's play button, the chips, the corner) is passed to the view; no drag-to-pan; the arrow keys stay the player's (seek) — a drag already draws (Mark), answers (a card) and resizes (the corner); the wheel is what every zoomed viewer on a laptop offers
- **Not chosen:** drag-to-pan, or arrow keys that pan
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-190 — The corner's drag scales the size by the corner's move as a share of the stage's box from where it started (the same as before at Fit and under, where the corner stays under the pointer; dragged out from Fit it zooms in); `=`/`-` step 5% up to Fit and 25% past it, to 200% and 40% (**changed after the owner's answer** to the question left at the fifth call: 5% everywhere at first; `981f364`); the slider has a tick at Fit; a change of zoom keeps the middle of the view in the middle; a phone ignores a stored zoom, or a separate zoom control? (the agent's own call A33, accepted in the walkthrough)

- **Chosen:** The corner's drag scales the size by the corner's move as a share of the stage's box from where it started (the same as before at Fit and under, where the corner stays under the pointer; dragged out from Fit it zooms in); `=`/`-` step 5% up to Fit and 25% past it, to 200% and 40% (**changed after the owner's answer** to the question left at the fifth call: 5% everywhere at first; `981f364`); the slider has a tick at Fit; a change of zoom keeps the middle of the view in the middle; a phone ignores a stored zoom — one control, one set of keys, as the owner's words ("zoom into video as well") put it; the tick lets a drag land back on Fit; twenty presses from Fit to 200% were too many
- **Not chosen:** a separate zoom control
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-191 — Cause: `layoutFrame` laid each why (and the note on your pick) under its card and only checked that it stayed above the frame's foot, never whether it met the card under it, so with cards stacked in a column the whys sat over the next card's words. Now a try whose whys or note meet another card or another why is passed over, like one that runs past the foot (the old last try, verdicts only under the cards whatever the room, included); then come "longin" (verdicts only, in each card's corner under its words) and last "none". Where nothing meets a card the tries and their order are as before, so cards in a row lay out as they did (the row still folds behind "…" at 1024 × 660), or shrinking the whys to fit the gap between cards, or covering each card whole with its why? (the agent's own call A34, accepted in the walkthrough)

- **Chosen:** Cause: `layoutFrame` laid each why (and the note on your pick) under its card and only checked that it stayed above the frame's foot, never whether it met the card under it, so with cards stacked in a column the whys sat over the next card's words. Now a try whose whys or note meet another card or another why is passed over, like one that runs past the foot (the old last try, verdicts only under the cards whatever the room, included); then come "longin" (verdicts only, in each card's corner under its words) and last "none". Where nothing meets a card the tries and their order are as before, so cards in a row lay out as they did (the row still folds behind "…" at 1024 × 660) — a why that covers a card hides what it is the why of; the tries already had the order "under, inside, verdict only", this makes each of them honest about the cards
- **Not chosen:** shrinking the whys to fit the gap between cards, or covering each card whole with its why
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-192 — `reel audit` counts a step's question as asked when it is already answered in the decision log (a decision of this plan on that step), as it counts one still open in `plan.md`, or counting only `plan.md`'s open questions? (the agent's own call A44, accepted in the walkthrough)

- **Chosen:** `reel audit` counts a step's question as asked when it is already answered in the decision log (a decision of this plan on that step), as it counts one still open in `plan.md` — at its fifth call a step asks, and once the owner answers, the question leaves `plan.md` for the decision log; step 1 (seven calls, D-166) and step 3 (six, D-167) failed an audit that had already been satisfied
- **Not chosen:** counting only `plan.md`'s open questions
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-193 — Calls outside the plan's steps are counted per ask, by their step column's word ("zoom" 4, "overlap" 2, "captions" 4), and an ask at its fifth call is a warning (its question goes to the owner, not `plan.md`); the load warning names the busiest step or ask, or lumping them as one step "?" (10 calls here, a failure no question could answer)? (the agent's own call A45, accepted in the walkthrough)

- **Chosen:** Calls outside the plan's steps are counted per ask, by their step column's word ("zoom" 4, "overlap" 2, "captions" 4), and an ask at its fifth call is a warning (its question goes to the owner, not `plan.md`); the load warning names the busiest step or ask — the three asks were separate, each asked at its fifth (A33, A41); every other plan's audit output is unchanged
- **Not chosen:** lumping them as one step "?" (10 calls here, a failure no question could answer)
- **Where:** 2026-09-26-better-visuals, step ?; components: skill, finish, player, system-video
- **Status:** active

### D-194 — What shows that a thing on the frame opens a page?

- **Chosen:** A tab, the whole time — You see it without looking for it; a small ink tab on every scene with a detail.
- **Not chosen:** A ring once, then hover (A clean frame; missed if you looked away for those two seconds.); Only on hover or focus (The cleanest frame; a reviewer watching hands-off never learns the block opens.)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes nothing (D-021 was linked to it by mistake), with the owner's approval in conversation on 2026-10-04; superseded by D-266 (quiet marks), with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-27-details-in-the-frame, step 2 (The player makes the marked thing a button); components: player
- **Status:** superseded, superseded by D-266 on 2026-10-04

### D-195 — Where does a detail open once you click the thing?

- **Chosen:** Over the frame, from the block — The page gets the video's whole box, about twice the room, and opens where you clicked; the frame is hidden while you read.
- **Not chosen:** Beside the video, as today (You see what you clicked while you read; the file gets less than half the width (560 px at 1440).); A preview, then the page (Quick looks stay small; a second click for anything you would use.)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-021, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-27-details-in-the-frame, step 3 (A click pauses the video and opens the page); components: player, finish, skill
- **Status:** active; supersedes D-021

### D-196 — What becomes of the corner chip on a rebuilt video?

- **Chosen:** It goes where a thing is marked — One way in on each scene; the chip stays where nothing is marked and on a phone where the thing is too small.
- **Not chosen:** It stays, beside the click (Nothing to relearn; two ways to do one thing on every scene with a detail.); It goes everywhere (The simplest frame; a phone reviewer goes to the plan text's list, away from the video.)
- **Where:** 2026-09-27-details-in-the-frame, step 4 (The corner chip and the plan text's list; older videos and phones); components: player
- **Status:** active

### D-197 — When does a quick check come, and on what case?

- **Chosen:** Later, on a new case — step N's check comes after step N+1's scenes (the last step's at the end, before the ending) and asks about a case the video did not show, so the viewer applies the rule instead of recalling the last sentence; the rule itself must have been explained, in words the video defined; the same number of checks, so no longer videos
- **Not chosen:** Right after, on a new case (the check still follows the scene that explains it, but asks about names and numbers the video did not show; the explanation is still in your ear); Later, on the same case (step N's check comes after step N+1's scenes, on the example step N showed; you remember the example's answer rather than work it out); Right after, plus two or three at the end (today's checks stay, and a few more at the end test what stuck; longer videos)
- **Note:** decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **Where:** 2026-09-27-conversation, step ? (Quick checks that measure learning, not recall); components: skill, system-video
- **Status:** active

### D-198 — What does the build do about a check asked too soon, or on the case just shown?

- **Chosen:** Two warnings — keep "the answer was not shown" (D-140: the rule must have been explained, at explained_at), and warn when a check sits right after the scene that explains it (its explained_at scene, or the scene before, is the one just before it), or reuses that scene's exact case (its distinctive names and numbers, the same file name or the same counts, appear in that scene's narration or on-screen text); warnings only
- **Not chosen:** Rules only (the style guide says it; nothing in the build checks it); Fail the build (the same two checks, failing: no video ships with a check that only tests recall; a false match stops a build)
- **Note:** decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with the recommendation was the first option offered
- **Where:** 2026-09-27-conversation, step ? (Quick checks that measure learning, not recall); components: skill
- **Status:** active

### D-199 — Which videos take the new quick checks, and when?

- **Chosen:** New and revised, and the system video now — videos take it when next built or revised; the system video's seven quick checks are rewritten and moved now, since it is what every new viewer starts with
- **Not chosen:** New and revised only (each video takes it when next built or revised; the system video waits for its next rebuild)
- **Note:** decided in conversation (2026-09-27), not in a plan review: the owner's point was that a quick check right after the explanation only asks you to remember what was just said, which does not measure learning; the options were laid out in the conversation and the owner chose, with not the recommendation (it was: new and revised only)
- **Where:** 2026-09-27-conversation, step ? (Quick checks that measure learning, not recall); components: skill, system-video
- **Status:** active

### D-200 — How much does a PR ask of its contributor?

- **Chosen:** Asked; the maintainer can make it — Whoever plans with reelplanning is reviewed before the code; nobody is turned away; the maintainer makes a video only for a PR over the line that has none.
- **Not chosen:** Nothing: the maintainer makes it (The lowest barrier; but no plan is reviewed before the code, so a wrong choice is found only once it is written, and every video is the maintainer's to make.); Required over the line (Every PR over the line is planned before the code, but a contributor with no reelplanning, agent or voice engine cannot send even a one-line fix without them.)
- **Where:** 2026-09-26-contributing, step 1 (When a PR gets a video, and who makes it); components: skill, diff, player, server, cli
- **Status:** active

### D-201 — When the maintainer disagrees with an answer from the contributor's plan, what does the decision log keep?

- **Chosen:** The last answer — Sam's agent changes the code and the entry on the branch; it reads 8787, changed after the maintainer's review, and Sam's 8790 stays in Sam's review file. Nothing new.
- **Not chosen:** Both; Sam's overruled (The log keeps Sam's 8790 as overruled, with Sam's words, beside the owner's 8787: every later plan sees the disagreement; reel record gains two statuses.); Only a maintainer's (Sam's answers never enter the log: the plan's questions come back in the owner's walkthrough, and the owner's pick is the entry. Every question is answered twice.)
- **Where:** 2026-09-26-contributing, step 2 (Who does what: the contributor plans, the maintainer reviews the PR); components: cli, skill, system-video
- **Status:** active

### D-202 — How much does the maintainer check before trusting a contributor's video?

- **Chosen:** CI's, and a code check — A few minutes: a fresh agent reads the code, finds that it exits instead of trying the next port, and the owner flags the choice.
- **Not chosen:** CI's checks only (Seconds, nothing to run by hand; but the video was built from the PR's files and every row has its stop, so both pass, and nobody sees the choice's words don't match the code.); A rebuild, every time (Several minutes a video, with the voice engine; the rebuild says the same words, so it catches only a video that is out of date, which pr-check already catches.)
- **Where:** 2026-09-26-contributing, step 3 (Watching a contributor's video, and checking it, without rebuilding it); components: diff, player
- **Status:** active

### D-203 — `frame-lint` measures a marked thing from the frame's CSS (px `left`/`top`/`width`/`height`, insets, its parents'), padding counted unless `border-box`; a mark whose size or place the CSS does not say is a note, not a finding, or measuring each frame in a browser, or failing an unmeasured mark? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** `frame-lint` measures a marked thing from the frame's CSS (px `left`/`top`/`width`/`height`, insets, its parents'), padding counted unless `border-box`; a mark whose size or place the CSS does not say is a note, not a finding — frame-lint is the cheap static check run as each frame lands, as its camera and card rules are; failing every unsized span would fail most pinned words, and the player guards at run time (no button on a thing too small to tap on a phone)
- **Not chosen:** measuring each frame in a browser, or failing an unmeasured mark
- **Where:** 2026-09-27-details-in-the-frame, step 1 (The frame marks the thing a detail explains, and the checks hold it); components: skill, finish, player
- **Status:** active

### D-204 — Two things marked with one name in a frame fail `frame-lint`, or a note, or the player taking the first? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** Two things marked with one name in a frame fail `frame-lint` — the plan says one marked thing per detail, and the button goes over one box; a second would silently never open
- **Not chosen:** a note, or the player taking the first
- **Where:** 2026-09-27-details-in-the-frame, step 1 (The frame marks the thing a detail explains, and the checks hold it); components: skill, finish, player
- **Status:** active

### D-205 — "Landed" is read from the frame as it plays: the thing and everything holding it shown, at full opacity (≥ 0.95); until then there is neither the button nor the chip, or the end of its reveal read from the scene's timeline, or the button from the scene's start? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** "Landed" is read from the frame as it plays: the thing and everything holding it shown, at full opacity (≥ 0.95); until then there is neither the button nor the chip — the page shows what is on screen whatever the timeline says (a fade, a camera, a later reveal), and a button over a thing still at 72 % would open a page about something not yet there
- **Not chosen:** the end of its reveal read from the scene's timeline, or the button from the scene's start
- **Where:** 2026-09-27-details-in-the-frame, step 2 (The player makes the marked thing a button); components: player
- **Status:** active

### D-206 — The button hides for as long as a question's box is up, an answered quick check counting down included, and comes back when it closes, or only while the question is unanswered? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** The button hides for as long as a question's box is up, an answered quick check counting down included, and comes back when it closes — while the box is up its cards carry the answer and their whys; one thing at a time on the frame
- **Not chosen:** only while the question is unanswered
- **Where:** 2026-09-27-details-in-the-frame, step 2 (The player makes the marked thing a button); components: player
- **Status:** superseded, superseded by D-246 on 2026-09-29

### D-207 — The button stays in the picture's layer, and the tab order reaches it by a hop: Tab from Play goes to it, Tab from it to what follows Play, Shift+Tab back (`tabHop`), or moving the button after the controls in the page and placing it by script? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** The button stays in the picture's layer, and the tab order reaches it by a hop: Tab from Play goes to it, Tab from it to what follows Play, Shift+Tab back (`tabHop`) — in the picture's layer it moves with the zoomed picture as the cards' buttons do, with nothing to keep in step; the hop gives the order the plan asks for
- **Not chosen:** moving the button after the controls in the page and placing it by script
- **Where:** 2026-09-27-details-in-the-frame, step 2 (The player makes the marked thing a button); components: player
- **Status:** active

### D-208 — Every way in opens the page over the frame, the chip's and the plan text's too, grown from what was clicked (the chip, the thing; a list's opens without growing); the Terms and the band's long words keep the side panel, or over the frame only from the thing, the side panel from the chip and the list? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** Every way in opens the page over the frame, the chip's and the plan text's too, grown from what was clicked (the chip, the thing; a list's opens without growing); the Terms and the band's long words keep the side panel — one place for a page whichever way it was opened; D-195 supersedes D-021's side panel, and the Terms and the band's words are not details
- **Not chosen:** over the frame only from the thing, the side panel from the chip and the list
- **Where:** 2026-09-27-details-in-the-frame, step 3 (A click pauses the video and opens the page); components: player, finish, skill
- **Status:** active

### D-209 — The ink ring is on the thing's button while its page is open, under the page (which covers the frame, D-195): it shows as the page grows and shrinks, and focus is on it once closed, or keeping the ring a few seconds after the page closes? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** The ink ring is on the thing's button while its page is open, under the page (which covers the frame, D-195): it shows as the page grows and shrinks, and focus is on it once closed — the plan's ring was written for a page beside the frame; with the page over it, the grow, the shrink and the focus back on the thing say what the page was about
- **Not chosen:** keeping the ring a few seconds after the page closes
- **Where:** 2026-09-27-details-in-the-frame, step 3 (A click pauses the video and opens the page); components: player, finish, skill
- **Status:** active

### D-210 — O is logged by the way the scene offers: `from: "frame"` where its thing is marked, `"chip"` where the chip shows; a comment's link to its page in the record counts as `"list"`, or a fourth value for the key? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** O is logged by the way the scene offers: `from: "frame"` where its thing is marked, `"chip"` where the chip shows; a comment's link to its page in the record counts as `"list"` — the record says which way in reviewers use, and O is the key for whichever the scene shows; the plan names three values
- **Not chosen:** a fourth value for the key
- **Where:** 2026-09-27-details-in-the-frame, step 3 (A click pauses the video and opens the page); components: player, finish, skill
- **Status:** active

### D-211 — Each own-words field grows with its words to a cap and then scrolls inside the same box: 3 lines for the two note fields under an answer (the note on an answer, "Expected something else?"), 4 for the others (your own answer, a call's own words, the comment line, the record's editor); a note field is as wide as its placeholder, never its words, or one cap for every field, or growing with no cap? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** Each own-words field grows with its words to a cap and then scrolls inside the same box: 3 lines for the two note fields under an answer (the note on an answer, "Expected something else?"), 4 for the others (your own answer, a call's own words, the comment line, the record's editor); a note field is as wide as its placeholder, never its words — the two note fields sit under an answer's cards, where more lines would push the cards and the controls; the owner asked to "keep same text box just be able to scroll it"
- **Not chosen:** one cap for every field, or growing with no cap
- **Where:** 2026-09-27-details-in-the-frame, step ?; components: player, finish, skill
- **Status:** active

### D-212 — Enter still saves (or keeps a note) and Shift+Enter starts a new line; what is saved keeps its line breaks, runs of spaces folded to one and three or more breaks to two (`keepLines`), and the record's quick-check note no longer folds them away, or Enter for a new line with a button to save, or every break folded to a space as before? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** Enter still saves (or keeps a note) and Shift+Enter starts a new line; what is saved keeps its line breaks, runs of spaces folded to one and three or more breaks to two (`keepLines`), and the record's quick-check note no longer folds them away — Enter already saved every field, so a reviewer's habit stays; words in paragraphs say more, and a runaway paste stays readable
- **Not chosen:** Enter for a new line with a button to save, or every break folded to a space as before
- **Where:** 2026-09-27-details-in-the-frame, step ?; components: player, finish, skill
- **Status:** active

### D-213 — Where does a PR's built video live?

- **Chosen:** Attached to the PR, as a zip — Nothing lands in git, and the video stays with its PR after the merge; attaching the zip is one step by hand, since an agent cannot attach a file to a PR.
- **Not chosen:** In the branch, as today (Nothing new to learn; but every video adds 15 to 50 MB to the repo's history for good, and every clone downloads it all: .git is already 893 MB.); In Git LFS (Clones stay small and the owner watches as today; but LFS counts against the account's quota, every contributor needs git lfs install, and a file in LFS is kept for good too.)
- **Note:** the reviewer's note: "would B be easy to do? also i dont know if we want in the git history thought hats the main question"; delivered by D-215 (decided in conversation, 2026-09-27): what this decided holds, the built video never lands in git's history and the PR's branch carries only its text, but it reaches the maintainer on a throwaway branch (video/pr-<n>, never merged, deleted after the merge), not as a zip attached to the PR by hand
- **Where:** 2026-09-26-contributing, step 3 (Watching a contributor's video, checking it, and where it lives); components: skill, diff, player, system-video
- **Status:** active

### D-214 — When does a PR need a video?

- **Chosen:** Choices or size only — a PR gets a video only when it makes a choice a reviewer could make the other way (a default, a command or flag, a file format, a data shape, a dependency the package ships) or changes over 300 lines; touching a part's files alone no longer counts, so a 40-line bug fix in the review player merges on a normal code review; a maintainer can still ask for a video on any PR
- **Not chosen:** Only when the maintainer asks (no line at all: every PR merges on a normal code review unless a maintainer asks for a video; the fewest videos, but nothing tells a contributor in advance, and a choice slips through when the maintainer does not spot it); Keep today's line (a PR that changes a part's files, makes a choice, or changes over 300 lines gets a video; a one-line fix in a part crosses it and needs a maintainer's small-fix label to skip it)
- **Note:** decided in conversation (2026-09-27), not in a plan review: a follow-up to the round-4 review of this plan (reviews/plan-20260927T050151Z.md); the options were laid out in the conversation and the owner chose the recommendation; it answers the owner's note on quick check 1 ("eh idk i still feel like small ones just not needed really? what do you think"): reel pr-check reads the size and the choices it can see, not a part's files, and the small-fix label gives way to needs-video (a maintainer asks) and no-video (a check that asked by mistake); corrected (walkthroughs-that-help's ledger-corrections-proposed.md): superseded by D-223, not D-221, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-26-contributing, step 1 (When a PR gets a video, and who makes it); components: skill, cli
- **Status:** superseded, superseded by D-223 on 2026-09-27

### D-215 — How does a PR's built video reach the maintainer?

- **Chosen:** A throwaway branch — the contributor's agent pushes the built video (the bundle) to a branch like video/pr-42 that is never merged; the maintainer fetches it and runs reelplanning review on it; it is deleted after the merge, so it never lands in main's history and fresh clones never download it; every step is a command an agent can run
- **Not chosen:** A zip attached by hand (the contributor drags a zip of the packed video into the PR's description; it stays on the PR after the merge, but it is a person's step on every video, since GitHub has no command to attach a file there); A GitHub release asset (the video uploaded to a release; an agent can do it with gh release upload, but it needs write access to the repo, which a contributor from a fork does not have, and releases are for versions)
- **Note:** decided in conversation (2026-09-27), not in a plan review: a follow-up to the round-4 review of this plan (reviews/plan-20260927T050151Z.md); the options were laid out in the conversation and the owner chose the recommendation; it is how D-213's "not in the branch" is delivered (the PR's branch carries only the videos' text), in place of the zip attached by hand, and answers the note on D-213 ("would B be easy to do?"): yes, every step is a command
- **Where:** 2026-09-26-contributing, step 3 (Watching a contributor's video, checking it, and where it lives); components: skill, server, cli
- **Status:** active

### D-216 — What gets labelled?

- **Chosen:** The build finds it — the build detects the jargon a video says or shows (acronyms, code, technical compounds, common software words and reelplanning's own), and asks for a meaning where it has none; a repo that tracks its words, like this one, keeps their meanings in its glossary, the trade's own under "Other words", which the system video need not explain; elsewhere a storyboard's terms: line gives them (terms: branch = …)
- **Not chosen:** Two hand-kept lists (the repo's glossary plus a common developer word list shipped with reelplanning, each kept by hand; a word on neither is never labelled); reelplanning's own words only (label the system's own words (walkthrough, plan video, code check, brief, storyboard); general words like merge and branch stay unlabelled)
- **Note:** decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner gave an answer of their own ("normally the build will find this, we might track in certain repo here though like this one"), recorded as the first option
- **Where:** 2026-09-27-conversation, step ? (Jargon the build finds, labelled until you know it); components: skill, system-video
- **Status:** active

### D-217 — What does check-terms do with a likely-jargon word said or shown with no meaning?

- **Chosen:** Warn, fail on strict — check-terms names each word, where it is first said or shown and how often, and suggests adding a meaning (a glossary row, or terms: x = … in the storyboard); a storyboard with terms_check: strict fails, as a bare id does
- **Not chosen:** Always a warning (a △ line on every video, never stopping a build; a word can ship unlabelled); Always fail (every build stops until each word has a meaning, older videos included)
- **Note:** decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **Where:** 2026-09-27-conversation, step ? (Jargon the build finds, labelled until you know it); components: skill
- **Status:** active

### D-218 — How long does a labelled word stay underlined?

- **Chosen:** Stop once you know it — a word stays underlined until the viewer has looked it up or watched the scene that defines it; then it shows plainly (still in the Terms panel), so new jargon stands out
- **Not chosen:** First use per scene (underline a word the first time each scene says it, known or not); Drop the simplest rows (take the simple words (chapter, step, Finish) out of the glossary so they are never underlined)
- **Note:** decided in conversation (2026-09-27), not in a plan review: the owner's point was that the highlighted words were too simple while a lot of the jargon stayed unlabelled ("i noticed that we are often highlighting terms which is good but these seem too simple. a lot of the jargon remains unlabeled, you can check it yourself"): across the five videos on the review page, agent, walkthrough, merge, flag, repo, prompt, branch, HTML, brief, test suite, diff, code check and more were said with no label; the options were laid out in the conversation and the owner chose the recommendation
- **Where:** 2026-09-27-conversation, step ? (Jargon the build finds, labelled until you know it); components: player, server
- **Status:** active

### D-219 — What replaces today's walkthrough video?

- **Chosen:** A short video of it running — About two minutes of the change on the real screen; costs capturing it each build.
- **Not chosen:** No video: what changed, in text (A few lines beside the plan video; costs never seeing it run unless you run it.); Today's, sorted harder (The least work; costs the retelling, and fewer pauses did not help last time.); A clip per step, on the PR (Costs a pull request for every plan, and the same retelling, cut up.)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes nothing (D-084, D-083 and D-041 were linked to it by mistake), with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-27-walkthroughs-that-help, step 1 (The walkthrough shows the change running, in about two minutes); components: skill, player, cli, fix-step, system-video
- **Status:** active

### D-220 — Which choices make it pause?

- **Chosen:** i dont like specifically saying 'five' i mean i think there's a lot that changes per plan i dont think being too specific is good
- **Not chosen:** Off-plan, and 3 you'd notice (Pauses on what you'd see or can't undo, shown running; the rest on the list.); Off-plan changes only (The shortest; costs never pausing on what you'd see.); Keep today's rule (Labels pause until ten accepted in a row, and every label is already there.)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): never superseded (it was linked to D-221 by mistake), active again; supersedes D-084, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-27-walkthroughs-that-help, step 2 (Only choices you'd notice pause it, at most three); components: skill, player, cli, fix-step, system-video
- **Status:** active; supersedes D-084

### D-221 — What does Approve make of a choice on the list?

- **Chosen:** Listed, not judged — Logged as listed, not judged; the drafts plan just decides. A flag still gets it fixed.
- **Not chosen:** A decision, as today (Logged as your decision; the drafts plan is warned and must keep or overturn it.)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-041 only (D-220, D-214 and D-133 were linked to it by mistake), with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-27-walkthroughs-that-help, step 2 (A choice pauses the video when you'd notice it); components: skill, player, cli, fix-step, system-video
- **Status:** active; supersedes D-041

### D-222 — Does the walkthrough test you?

- **Chosen:** Where there's something to predict — Escape gets a check just before it runs; the renamed helper gets none. It tests how it works.
- **Not chosen:** None; one open question (Neither asks a check; both end on the open question. Never tests how it works.); As today, one per chapter (Both ask one per chapter, on what the chapter just said.)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-083, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-27-walkthroughs-that-help, step 3 (A quick check where there is something to predict); components: skill, player, cli, fix-step, system-video
- **Status:** active; supersedes D-083

### D-223 — Does a small pull request's choice need the video?

- **Chosen:** Only a choice you'd notice — The speed change needs it; the inside default is a line in the pull request's text.
- **Not chosen:** Keep today's line (Any choice a reviewer could make the other way needs the short walkthrough: both do.)
- **Note:** corrected (walkthroughs-that-help's ledger-corrections-proposed.md): supersedes D-214, with the owner's approval in conversation on 2026-10-04
- **Where:** 2026-09-27-walkthroughs-that-help, step 4 (Pull requests get the short walkthrough); components: skill, player, cli, fix-step, system-video
- **Status:** active; supersedes D-214

### D-224 — How do the plan and what was built sit together?

- **Chosen:** One row, a Plan | Built switch — Step 3's plan scene has See it built, and its running scene See the plan; two separate reviews.
- **Not chosen:** One video (Step 3 runs right after its plan scenes; the plan video is rebuilt after every build.); Two rows, as today (Nothing changes; you move between them yourself.)
- **Where:** 2026-09-27-walkthroughs-that-help, step 5 (The plan and what was built, in one place); components: player
- **Status:** active

### D-225 — What becomes of a fresh-eyes finding nobody has answered?

- **Chosen:** Answered before you see it — The build stops until each finding is fixed, given a meaning, or kept with a reason.
- **Not chosen:** A warning only (The build warns and goes on; the page opens with the phrase unexplained.); Fixed, every one (Every finding must be fixed; a reason to keep it is not allowed.)
- **Where:** 2026-09-28-videos-that-make-sense, step 2 (Every finding is answered before the page opens (question 1)); components: skill, cli, player, server, system-video
- **Status:** active

### D-226 — How do you find out what a phrase means?

- **Chosen:** Those, and Ask about this — Also: type a question on any scene and get an answer from the plan and the scene.
- **Not chosen:** Meanings for flagged phrases (A phrase the newcomer flagged gets a meaning you can click; any other stays a dead end.); Those, and a plain line a scene (Also: one plain sentence for every scene, which you can open.)
- **Where:** 2026-09-28-videos-that-make-sense, step 3 (Find out about any phrase, in the player (question 2)); components: player
- **Status:** active

### D-227 — Which videos get fresh eyes?

- **Chosen:** Every new one, and the system video now — Plan, walkthrough and system videos from now on; the system video is checked now and fixed.
- **Not chosen:** New plan videos only (Only where you decide; walkthroughs and the system video keep what they have.); Every new one, and all 26 now (Every video on the review page is checked now, and rebuilt wherever a finding is fixed.)
- **Where:** 2026-09-28-videos-that-make-sense, step 5 (The videos we have, and the skill (question 3)); components: skill
- **Status:** active

### D-228 — Where does the guide open from the video?

- **Chosen:** Its own page, a click away — The room a scrolling page needs, and one review to send.
- **Not chosen:** Beside the video, in the plan text's place (One place; a full-screen page in a 340 px column.); Over the frame, like a detail (One place, inside the video's box.)
- **Where:** 2026-09-28-plan-guide, step 3 (The video and the guide point at each other (question 2)); components: player
- **Status:** superseded, superseded by D-264 on 2026-09-30

### D-229 — What does an edit on the guide do?

- **Chosen:** Suggested edits, applied exactly — What you change is what the plan says, checked and kept.
- **Not chosen:** Comments only (Nothing new; the words in the plan are the agent's.); Direct edits from the page (Your change lands at once, on your machine only, unchecked.)
- **Where:** 2026-09-28-plan-guide, step 4 (Edit the plan on the guide: comments, and edits the agent applies exactly (question 3)); components: revise
- **Status:** active

### D-230 — How much guide does each plan get?

- **Chosen:** Every plan, with a Built side — Before and after the build, in one place.
- **Not chosen:** Every plan, the plan side only (A guide for every plan; what was built stays text.); Big plans only (The least cost; a small plan with a real choice has none.)
- **Where:** 2026-09-28-plan-guide, step 5 (After the build, and which plans get a guide (question 4)); components: implement-step
- **Status:** active

### D-231 — What is left after the third round is that round's findings the author kept (not those given a meaning, which a click explains, nor those fixed), each with the reason: on the page's Before you watch, under the videos to watch first ("Left as they are: … Kept: …"), shown even when every video before it was watched, three on the card and the rest behind "N more" (the system video's third round left 32), and in the notification's line ("2 things fresh eyes left as they are"), or every finding of every round, or a line with only the count? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** What is left after the third round is that round's findings the author kept (not those given a meaning, which a click explains, nor those fixed), each with the reason: on the page's Before you watch, under the videos to watch first ("Left as they are: … Kept: …"), shown even when every video before it was watched, three on the card and the rest behind "N more" (the system video's third round left 32), and in the notification's line ("2 things fresh eyes left as they are") — a kept finding is the one confusion the viewer still meets, and the reason is what they need; a meaning is already one click away
- **Not chosen:** every finding of every round, or a line with only the count
- **Where:** 2026-09-28-videos-that-make-sense, step 2 (Every finding is answered before the page opens (question 1)); components: skill, cli, player, server, system-video
- **Status:** active

### D-232 — Ask about this opens in the side panel (where Terms and details open), about the scene on screen, the video paused: from an Ask button beside Terms and the key Q, from a plain caption word clicked (its caption quoted in the panel), and from an underlined word's card ("Still unclear? Ask about this", the word in the box); a click elsewhere on the frame does what it did, or a box laid over the frame, or a click anywhere on the frame opening it? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** Ask about this opens in the side panel (where Terms and details open), about the scene on screen, the video paused: from an Ask button beside Terms and the key Q, from a plain caption word clicked (its caption quoted in the panel), and from an underlined word's card ("Still unclear? Ask about this", the word in the box); a click elsewhere on the frame does what it did — the side panel is where the page already explains things and leaves the frame readable; a click on the frame is drawing's (Mark), so only the captions, words the viewer reads, open it
- **Not chosen:** a box laid over the frame, or a click anywhere on the frame opening it
- **Where:** 2026-09-28-videos-that-make-sense, step 3 (Find out about any phrase, in the player (question 2)); components: player
- **Status:** active

### D-233 — On your machine, a question goes to the session waiting on `review --wait`, which wakes on it as on a review (`inbox/questions/<id>.json`) and answers with `reelplanning inbox answer <id> "…" --from "…"`; the page asks for the answer every 2 s for two minutes at most; with no session waiting nothing is written and no headless run starts: it goes with the review, or starting the headless agent command on a question, or a question file left for a session that starts later? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** On your machine, a question goes to the session waiting on `review --wait`, which wakes on it as on a review (`inbox/questions/<id>.json`) and answers with `reelplanning inbox answer <id> "…" --from "…"`; the page asks for the answer every 2 s for two minutes at most; with no session waiting nothing is written and no headless run starts: it goes with the review — the plan says a waiting session answers in seconds, and with none the question goes with the review; a headless run would take minutes to answer one line, and a file nobody polls answers nobody
- **Not chosen:** starting the headless agent command on a question, or a question file left for a session that starts later
- **Where:** 2026-09-28-videos-that-make-sense, step 3 (Find out about any phrase, in the player (question 2)); components: player
- **Status:** active

### D-234 — Every question is kept in the review as `questions: [{ id, question, t, frame, planStep, askedAt, quote?, answer?, from?, via?, answeredAt?, note? }]`, `answered: false` where it has no answer (the page's own state and the review server's id for a question, `status` and `askId`, are left out); `reviews/<id>.md` lists them under "Questions you asked", an unanswered one "to answer in the next version", an answered one still "make it plain there too", or only the unanswered ones, or questions as comments on their step? (the agent's own call A11, accepted in the walkthrough)

- **Chosen:** Every question is kept in the review as `questions: [{ id, question, t, frame, planStep, askedAt, quote?, answer?, from?, via?, answeredAt?, note? }]`, `answered: false` where it has no answer (the page's own state and the review server's id for a question, `status` and `askId`, are left out); `reviews/<id>.md` lists them under "Questions you asked", an unanswered one "to answer in the next version", an answered one still "make it plain there too" — the plan keeps every question (it counts in memory and goes to the next newcomer), and an answered question still says the video didn't make it plain; a field of its own keeps them apart from what the reviewer said about the plan
- **Not chosen:** only the unanswered ones, or questions as comments on their step
- **Where:** 2026-09-28-videos-that-make-sense, step 3 (Find out about any phrase, in the player (question 2)); components: player
- **Status:** active

### D-235 — A finding is one line, `- N1 · scene 4 · "the phrase": what, why`, its phrase in double quotes; the author's answer is the indented line under it, `- Answer: fixed: …`, `meaning: …` or `kept: <the reason>`, and `verify` reads both, or a table per file, or the answers in a file of their own beside the findings? (the agent's own call A1, listed, not judged, in the walkthrough)

- **Chosen:** A finding is one line, `- N1 · scene 4 · "the phrase": what, why`, its phrase in double quotes; the author's answer is the indented line under it, `- Answer: fixed: …`, `meaning: …` or `kept: <the reason>`, and `verify` reads both — the plan says one numbered finding a line and the answer in the same file; a line and the one under it read as a conversation, and the quoted phrase is what a `meaning` answer is checked against
- **Not chosen:** a table per file, or the answers in a file of their own beside the findings
- **Where:** 2026-09-28-videos-that-make-sense, step 1 (Two fresh agents look at the video before you do); components: player, system-video
- **Status:** listed

### D-236 — The pictures: the video packed with `bundle-player` and opened in headless Chromium at 1440 × 900, the Before you watch card dismissed, each scene seeked 0.4 s before its end (0.12 s at first; changed after the system video's look, whose designer read the next scene's first caption, already up, as this one's) and the player's stage photographed; without `playwright-core`, the frames alone from HyperFrames' snapshot, and the brief says the player's tab and chips are not in them, or the page at another size, or the frames alone every time? (the agent's own call A2, listed, not judged, in the walkthrough)

- **Chosen:** The pictures: the video packed with `bundle-player` and opened in headless Chromium at 1440 × 900, the Before you watch card dismissed, each scene seeked 0.4 s before its end (0.12 s at first; changed after the system video's look, whose designer read the next scene's first caption, already up, as this one's) and the player's stage photographed; without `playwright-core`, the frames alone from HyperFrames' snapshot, and the brief says the player's tab and chips are not in them — 1440 × 900 is a laptop, the size a viewer reads at, so "too small to read" is judged as they'd see it; the plan needs the player's tab in the picture (the Open tab that hid a row passed `frame-lint`), and a machine without a browser still gets a look
- **Not chosen:** the page at another size, or the frames alone every time
- **Where:** 2026-09-28-videos-that-make-sense, step 1 (Two fresh agents look at the video before you do); components: player, system-video
- **Status:** listed

### D-237 — What the agents saw is kept per scene in `fresh-eyes/stamp.json` (its narration line and its frame's HTML, hashed), so `verify` names the scenes changed since they looked, or one hash for the whole video, or a stamp line in each findings file only? (the agent's own call A3, listed, not judged, in the walkthrough)

- **Chosen:** What the agents saw is kept per scene in `fresh-eyes/stamp.json` (its narration line and its frame's HTML, hashed), so `verify` names the scenes changed since they looked — a finding is about a scene, and a round-2 look is due because of the scenes a fix touched; naming them says what changed
- **Not chosen:** one hash for the whole video, or a stamp line in each findings file only
- **Where:** 2026-09-28-videos-that-make-sense, step 1 (Two fresh agents look at the video before you do); components: player, system-video
- **Status:** listed

### D-238 — "Viewers were lost on these before" is read from every review in the repo (the plans' and the system video's), newest first, at most 40: words looked up, "Explain this more", an answer, comment or check note that asks what something means ("wdym", "confused", "what do you mean"), checks missed, and questions asked on the page, or only `reel memory lost`'s lines (words looked up in three reviews or more), or the reviewer's file across repos? (the agent's own call A4, listed, not judged, in the walkthrough)

- **Chosen:** "Viewers were lost on these before" is read from every review in the repo (the plans' and the system video's), newest first, at most 40: words looked up, "Explain this more", an answer, comment or check note that asks what something means ("wdym", "confused", "what do you mean"), checks missed, and questions asked on the page — the plan lists every kind; the repo's reviews hold the words themselves ("wdym dropps the video"), which a count does not, and every reviewer of this repo is who the next video is for
- **Not chosen:** only `reel memory lost`'s lines (words looked up in three reviews or more), or the reviewer's file across repos
- **Where:** 2026-09-28-videos-that-make-sense, step 1 (Two fresh agents look at the video before you do); components: player, system-video
- **Status:** listed

### D-239 — Only a finding with no answer (or a bad one) stops the build; no run yet, agents not back yet, or scenes changed since they looked is a △ line, and `build` shows what verify read of fresh eyes as a line of its own, or stopping on no run too, or on scenes changed since? (the agent's own call A5, listed, not judged, in the walkthrough)

- **Chosen:** Only a finding with no answer (or a bad one) stops the build; no run yet, agents not back yet, or scenes changed since they looked is a △ line, and `build` shows what verify read of fresh eyes as a line of its own — the first build has to finish before anything can be pictured, and a fix is what makes scenes change: stopping on either would stop every build; D-225's promise is about findings, which a stop keeps
- **Not chosen:** stopping on no run too, or on scenes changed since
- **Where:** 2026-09-28-videos-that-make-sense, step 2 (Every finding is answered before the page opens (question 1)); components: skill, cli, player, server, system-video
- **Status:** listed

### D-240 — An answer is checked, not just present: `meaning` needs its quoted phrase in the glossary (Other words included) or the storyboard's `terms:`, `fixed` needs where (two words or more), `kept` a reason (three words or more), or any answer word passing? (the agent's own call A7, listed, not judged, in the walkthrough)

- **Chosen:** An answer is checked, not just present: `meaning` needs its quoted phrase in the glossary (Other words included) or the storyboard's `terms:`, `fixed` needs where (two words or more), `kept` a reason (three words or more) — "kept" alone is exactly the silence D-225 rules out, and a meaning that was never added leaves the phrase with nothing to click
- **Not chosen:** any answer word passing
- **Where:** 2026-09-28-videos-that-make-sense, step 2 (Every finding is answered before the page opens (question 1)); components: skill, cli, player, server, system-video
- **Status:** listed

### D-241 — On a hosted page, one `sample` call per question, on a click only, on the quick tier: its input is the instructions (answer only from this, plain words, two to five sentences, say so when it isn't there), the question, the scene's narration and the words on its frame, its plan step's text (else the plan's problem), and the glossary rows the question and scene mention (with this video's own words); the answer's last line, "From: …", shows under it; `not_granted` and the other refusals hide the hosted path for the view, `rate_limited` is said and never retried, or the default tier (it thinks first, 5 to 60 s), or the whole glossary and plan in every call? (the agent's own call A9, listed, not judged, in the walkthrough)

- **Chosen:** On a hosted page, one `sample` call per question, on a click only, on the quick tier: its input is the instructions (answer only from this, plain words, two to five sentences, say so when it isn't there), the question, the scene's narration and the words on its frame, its plan step's text (else the plan's problem), and the glossary rows the question and scene mention (with this video's own words); the answer's last line, "From: …", shows under it; `not_granted` and the other refusals hide the hosted path for the view, `rate_limited` is said and never retried — the plan says answers in seconds, and the quick tier starts at once; what the scene needs is its own step and the words it says, which keeps the call small and the answer on the scene
- **Not chosen:** the default tier (it thinks first, 5 to 60 s), or the whole glossary and plan in every call
- **Where:** 2026-09-28-videos-that-make-sense, step 3 (Find out about any phrase, in the player (question 2)); components: player
- **Status:** listed

### D-242 — Rule 1 in `frame-lint`: a bar is an element with no text, under 12 px high, over 120 px wide and filled; bars stand where words go when two or more are in a box with no text, one after another in a box's flow, or stacked (left edges within 24 px, tops 14 to 60 px apart, as lines of text are); one bar alone, or two underlines 9 px apart, passes, or any empty bar failing, or only a box holding nothing but bars (the plan's words)? (the agent's own call A12, listed, not judged, in the walkthrough)

- **Chosen:** Rule 1 in `frame-lint`: a bar is an element with no text, under 12 px high, over 120 px wide and filled; bars stand where words go when two or more are in a box with no text, one after another in a box's flow, or stacked (left edges within 24 px, tops 14 to 60 px apart, as lines of text are); one bar alone, or two underlines 9 px apart, passes — a single bar is a rule, an underline or a progress bar; the step 6 frame's two grey lines were siblings of the box's other words, not inside an empty box, so "only bars" alone would have passed the frame the owner sent
- **Not chosen:** any empty bar failing, or only a box holding nothing but bars (the plan's words)
- **Where:** 2026-09-28-videos-that-make-sense, step 4 (Frames back to basics: seven rules, checked where they can be); components: player
- **Status:** listed

### D-243 — Rule 5 in `frame-lint`: another element with words of its own, or a filled leaf (a chip, a line), whose box ends in the 40 px above a `data-detail` mark fails; a line of words with a place but no size is measured as one line of its type; a panel holding other things, or a background behind the mark, is not in the way, or any element's box touching the band, or only elements whose size the CSS gives? (the agent's own call A13, listed, not judged, in the walkthrough)

- **Chosen:** Rule 5 in `frame-lint`: another element with words of its own, or a filled leaf (a chip, a line), whose box ends in the 40 px above a `data-detail` mark fails; a line of words with a place but no size is measured as one line of its type; a panel holding other things, or a background behind the mark, is not in the way — a panel or background behind the thing is not what the tab covers, and most labels in frames are placed with no height, so they would never be seen
- **Not chosen:** any element's box touching the band, or only elements whose size the CSS gives
- **Where:** 2026-09-28-videos-that-make-sense, step 4 (Frames back to basics: seven rules, checked where they can be); components: player
- **Status:** listed

### D-244 — Which is the source: plan.md, or the guide?

- **Chosen:** plan.md; the guide is built from it — one source; every tool that reads plan.md keeps working and a change shows as text in git
- **Not chosen:** The guide; plan.md is taken from it (any page is possible; tools read a generated file and a change is an HTML diff); Both, kept the same by a check (two sources to keep in step)
- **Note:** decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; question 1 was left unanswered when the plan was approved (reviews/plan-20260928T190542Z.md), so it was asked again
- **Where:** 2026-09-28-plan-guide, step 1 (The guide: a page for each plan, built from plan.md); components: skill, cli
- **Status:** active

### D-245 — What does Before you watch show of the findings the author kept?

- **Chosen:** Only new ones — a kept finding shows only if it was not already kept with the same reason in an earlier round of that build; repeats fold into one line with a count
- **Not chosen:** Three, rest collapsed (every finding kept in round 3, three on the card and the rest behind N more, as D-231 has it); None unless asked (the card says how many were kept and the list opens on a click)
- **Note:** decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; narrows D-231 (which listed every finding kept in the third round): after the rebuild of the system video it listed 28, mostly the agents repeating points already kept with the same reason; D-231 otherwise stands
- **Where:** 2026-09-28-videos-that-make-sense, step 2 (Every finding answered before you see it); components: skill, cli, player
- **Status:** active

### D-246 — While a question is up, what does a click on a marked thing on the frame do?

- **Chosen:** Opens its part of the guide — the thing opens its part over the frame; closing it brings the question back as it was left
- **Not chosen:** Nothing, as today (one thing at a time: the thing opens only after you answer (D-206))
- **Note:** decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; supersedes D-206 (the button hidden while a question is up); raised when the details-in-the-frame build found the click did nothing during a question
- **Where:** 2026-09-28-plan-guide, step 3 (The video and the guide point at each other); components: player
- **Status:** active; supersedes D-206

### D-247 — How is each arm’s finished site kept in this repo?

- **Chosen:** Plain files and a site.bundle — the finished site as plain files you can open, and its git history saved beside it as site.bundle (git bundle)
- **Not chosen:** Plain files only (just the finished site, no history); A branch per arm (each arm’s site on its own branch, history and all)
- **Note:** decided in conversation (2026-09-29), not in a plan review: the owner was asked with options and chose the recommendation; question 4 of the case-study plan had waited on the owner since step 1
- **Where:** 2026-09-26-case-study, step 1 (The kit); components: cli
- **Status:** active

### D-248 — After Plan this, how far does the plan lean on the explainer?

- **Chosen:** Lean on it — The plan's video starts at what changes; the explainer is under Before you watch, with two lines for new viewers.
- **Not chosen:** A recap chapter (About 40 seconds of the explainer's scenes open the plan's video.); Stand alone (The plan's video explains it all again, about a minute.)
- **Where:** 2026-09-29-explain-first, step 4 (Plan this: a plan that starts from the explainer (question 2)); components: server
- **Status:** active

### D-249 — What of an explainer goes into git?

- **Chosen:** Its text, never the transcript — The explainer's text is committed, with its 12 quoted lines; the transcript never is.
- **Not chosen:** The transcript too (All 21,562 lines are committed, for a teammate to read.); Nothing, until kept (Nothing is committed until you keep the explainer or plan from it.)
- **Where:** 2026-09-29-explain-first, step 5 (Honest and private: facts from their sources, a transcript kept out of git (question 3)); components: server
- **Status:** active

### D-250 — Is an explainer's whole source there to read, behind the video?

- **Chosen:** General principles, not a list of kinds: you say what you want explained, and the principles say what goes in the video and what goes in its guide — an explainer can be of anything (files changed in or outside an agent session, new experimental output, a transcript, a log, a period); the plan gives the principles for turning any new kind into a video and a guide, instead of enumerating kinds
- **Not chosen:** —
- **Note:** the plan review answered q1 in the reviewer's own words; asked again in conversation (2026-09-29) with three readings, the owner answered in their own words
- **The reviewer's words:** i think we need to note the explainer is for many different things; we might not always be doing changes within an agent session, we might be doing outside of it, so its different what we want to see, it might be files changed, might be new experimental output, etc. want to make it general — then, asked in conversation: oh we'll probably say what we want texplained, we jsut want general proniciples as to what to put and how to guide so we know how to take new kind and turn that into it. we dont want to enumerate here
- **Where:** 2026-09-29-explain-first, step 1 (What an explainer is for, and what it shows (question 1)); components: explainer
- **Status:** active

### D-251 — An explainer's name on the review page, and in `before:` lines, is `<name>--explainer`, like `<plan>--walkthrough`, or `explainer:<name>`, as the plan's interface wrote it? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** An explainer's name on the review page, and in `before:` lines, is `<name>--explainer`, like `<plan>--walkthrough` — a name is also a folder in the packed page, and a colon is not allowed in a folder name on Windows; `--explainer` reads like the walkthrough's
- **Not chosen:** `explainer:<name>`, as the plan's interface wrote it
- **Where:** 2026-09-29-explain-first, step 2 (Ask for one: the skill, a command, and a folder of its own); components: skill, server, explainer
- **Status:** active

### D-252 — An explainer waits under **Needs you** until it is reviewed, and again when it was rebuilt after its review (Explain more), or never under Needs you (nothing to decide)? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** An explainer waits under **Needs you** until it is reviewed, and again when it was rebuilt after its review (Explain more) — it waits on you to watch it, and you asked for it
- **Not chosen:** never under Needs you (nothing to decide)
- **Where:** 2026-09-29-explain-first, step 2 (Ask for one: the skill, a command, and a folder of its own); components: skill, server, explainer
- **Status:** active

### D-253 — `new-plan --from` without `--plan` writes a draft: the title, the line, the problem quoting the review, and an empty step for the agent to write, or requiring `--plan`? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** `new-plan --from` without `--plan` writes a draft: the title, the line, the problem quoting the review, and an empty step for the agent to write — Plan this has the review before any plan text exists; the agent writes the steps from the quotes
- **Not chosen:** requiring `--plan`
- **Where:** 2026-09-29-explain-first, step 4 (Plan this: a plan that starts from the explainer (question 2)); components: server, explainer
- **Status:** active

### D-254 — A secret, an email address (not `example.com`) or a home path stops the build anywhere in the video's text: frames, narration, storyboard, script, `explain.md`, details; the check prints it cut short, or only inside a quoted line, as the plan's words say? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** A secret, an email address (not `example.com`) or a home path stops the build anywhere in the video's text: frames, narration, storyboard, script, `explain.md`, details; the check prints it cut short — all of that text is committed (D-249); a key said in the narration or typed on a card is as public as one quoted
- **Not chosen:** only inside a quoted line, as the plan's words say
- **Where:** 2026-09-29-explain-first, step 5 (Honest and private: facts from their sources, a transcript kept out of git (question 3)); components: server, explainer
- **Status:** active

### D-255 — The fact check is a third fresh-eyes role, `checker` (F1 …), whose round waits for it, only for an explainer with a source that needs a guide part, or a separate command, or a fact check on every explainer? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** The fact check is a third fresh-eyes role, `checker` (F1 …), whose round waits for it, only for an explainer with a source that needs a guide part — it is fresh eyes' loop (briefs, answers, rounds) with another brief; the plan gives it to an explainer that sums up more than it quotes
- **Not chosen:** a separate command, or a fact check on every explainer
- **Where:** 2026-09-29-explain-first, step 5 (Honest and private: facts from their sources, a transcript kept out of git (question 3)); components: server, explainer
- **Status:** active

### D-256 — A source needs a guide part past 200 lines: a file by its lines, a folder's files each on their own (`parts`), a change by its changed lines, `since:` by its log's lines, or a fixed number of scenes' worth, or one rule for a whole folder? (the agent's own call A2, listed, not judged, in the walkthrough)

- **Chosen:** A source needs a guide part past 200 lines: a file by its lines, a folder's files each on their own (`parts`), a change by its changed lines, `since:` by its log's lines — the plan says "over about 200 lines"; a folder of six small files and one long one needs a part for the long one only, as its review-server example says
- **Not chosen:** a fixed number of scenes' worth, or one rule for a whole folder
- **Where:** 2026-09-29-explain-first, step 1 (What an explainer is for, and what it shows (question 1)); components: server, system-video, explainer
- **Status:** listed

### D-257 — A file of the repo is shape `files`; a file's shape otherwise is read from what it holds: `.jsonl`/`.ndjson`/`.log` a sequence, `.csv`/`.tsv` or a JSON array of rows a table, anything else text, or asking for the shape on the command line? (the agent's own call A3, listed, not judged, in the walkthrough)

- **Chosen:** A file of the repo is shape `files`; a file's shape otherwise is read from what it holds: `.jsonl`/`.ndjson`/`.log` a sequence, `.csv`/`.tsv` or a JSON array of rows a table, anything else text — no flag to get wrong, and a new kind of file lands on the shape its contents have; a repo file is shown and guided as a file (whole, its lines marked)
- **Not chosen:** asking for the shape on the command line
- **Where:** 2026-09-29-explain-first, step 1 (What an explainer is for, and what it shows (question 1)); components: server, system-video, explainer
- **Status:** listed

### D-258 — An explainer's length: aim 2–4 minutes, "long" past 4, "too long" past 7; with a source that needs a guide part, 2–5, past 5 and past 8, or the plan video's 3–5? (the agent's own call A11, listed, not judged, in the walkthrough)

- **Chosen:** An explainer's length: aim 2–4 minutes, "long" past 4, "too long" past 7; with a source that needs a guide part, 2–5, past 5 and past 8 — the plan's numbers; the two outer lines copy the plan video's gaps
- **Not chosen:** the plan video's 3–5
- **Where:** 2026-09-29-explain-first, step 2 (Ask for one: the skill, a command, and a folder of its own); components: skill, server, explainer
- **Status:** listed

### D-259 — The end is kept as the review's `verdict` too ("done", "more", "plan"), beside `end`, or `end` alone? (the agent's own call A8, listed, not judged, in the walkthrough)

- **Chosen:** The end is kept as the review's `verdict` too ("done", "more", "plan"), beside `end` — the player's Finish, Send and the review server already carry `verdict`; `end` is what the plan's interface names
- **Not chosen:** `end` alone
- **Where:** 2026-09-29-explain-first, step 3 (Review it: the same player, and Finish says what comes next); components: finish, player, server, explainer
- **Status:** listed

### D-260 — A quoted line is the text of a `data-artifact`, block by block (a `div`, `p`, `li`, a cell); a label on it that is no quote carries `data-label` (and a pinned word `data-gloss`); "…" cuts a line into pieces checked on their own; a piece naming the source (its id, path, commit) passes; a repo file is read at the pinned commit, one with changes not committed then from disk with its hash checked, or checking every word in the frame, or only elements marked as quotes? (the agent's own call A4, listed, not judged, in the walkthrough)

- **Chosen:** A quoted line is the text of a `data-artifact`, block by block (a `div`, `p`, `li`, a cell); a label on it that is no quote carries `data-label` (and a pinned word `data-gloss`); "…" cuts a line into pieces checked on their own; a piece naming the source (its id, path, commit) passes; a repo file is read at the pinned commit, one with changes not committed then from disk with its hash checked — the theme's blocks already put the real thing in a `data-artifact`; a file's name in its bar is not a quote; "…" is how a long line is cut to fit; an old explainer must not fail when the code moves on
- **Not chosen:** checking every word in the frame, or only elements marked as quotes
- **Where:** 2026-09-29-explain-first, step 5 (Honest and private: facts from their sources, a transcript kept out of git (question 3)); components: server, explainer
- **Status:** listed

### D-261 — "States a number" is a digit in the scene's narration, other than a step, scene, part, question or line number and an id (D-233, A4, k1); a scene that quotes a thing with no `- source:` is treated the same; and `check-sources` runs on any video with a `- source:`, not only an explainer [close] (changed after the code check: the quote and the where said here), or number words ("three") too; a quote with no source left alone; explainers only? (the agent's own call A5, listed, not judged, in the walkthrough)

- **Chosen:** "States a number" is a digit in the scene's narration, other than a step, scene, part, question or line number and an id (D-233, A4, k1); a scene that quotes a thing with no `- source:` is treated the same; and `check-sources` runs on any video with a `- source:`, not only an explainer [close] (changed after the code check: the quote and the where said here) — digits are what a source can hold word for word; "step 2" is the video's own structure, not a fact; a quote with no source cannot be checked; `- source:` is a tag any storyboard may use
- **Not chosen:** number words ("three") too; a quote with no source left alone; explainers only
- **Where:** 2026-09-29-explain-first, step 5 (Honest and private: facts from their sources, a transcript kept out of git (question 3)); components: server, explainer
- **Status:** listed

### D-262 — "What you want next" is the walkthrough's open-question box, asked on every explainer's Finish, kept as a note with `open: true` (changed after review: under Explain more and Plan this, the box follows this video's own suggestions, made at build time from its scenes, long sources and `explain.md`'s open threads and refined by what you did while watching; a pick fills the box to edit, or you write your own, and the review carries it as `next`), or a box shown only under Explain more or Plan this? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** "What you want next" is the walkthrough's open-question box, asked on every explainer's Finish, kept as a note with `open: true` (changed after review: under Explain more and Plan this, the box follows this video's own suggestions, made at build time from its scenes, long sources and `explain.md`'s open threads and refined by what you did while watching; a pick fills the box to edit, or you write your own, and the review carries it as `next`) — one box the page already has; the words matter for both ends, and are empty for Done
- **Not chosen:** a box shown only under Explain more or Plan this
- **Where:** 2026-09-29-explain-first, step 3 (Review it: the same player, and Finish says what comes next); components: finish, player, server, explainer
- **Status:** active

### D-263 — An explainer's Finish offers Done first, comments or not; the missed-checks guard's "Ask the agent to explain it again" picks Explain more (changed after review: Done still comes first, and Explain more and Plan this each say what they would mean for this video, their first suggestion, in place of a fixed line; the guard's Explain more starts from the missed check's suggestion), or Explain more first when there are comments, as a plan's Finish offers Request changes? (the agent's own call A13, accepted in the walkthrough)

- **Chosen:** An explainer's Finish offers Done first, comments or not; the missed-checks guard's "Ask the agent to explain it again" picks Explain more (changed after review: Done still comes first, and Explain more and Plan this each say what they would mean for this video, their first suggestion, in place of a fixed line; the guard's Explain more starts from the missed check's suggestion) — the plan's Done is "you know what you wanted to know", and a comment on an explainer asks for nothing by itself (it is kept, D-249; step 3); a reviewer who wants more picks it with one click
- **Not chosen:** Explain more first when there are comments, as a plan's Finish offers Request changes
- **Where:** 2026-09-29-explain-first, step 3 (Review it: the same player, and Finish says what comes next); components: finish, player, server, explainer
- **Status:** active

### D-264 — Where does the guide open from the video?

- **Chosen:** Under the video, on the same page: scrolling down reads the guide while the video shrinks to a small player that stays in view; the video is never replaced — the video stays the start and stays with you; the guide is what you scroll to for more, not a separate place
- **Not chosen:** Beside the video, in the plan text's place (One place; a full-screen page in a 340 px column.); Its own page, a click away (The room a scrolling page needs, and one review to send.); Over the frame, like a detail (One place, inside the video's box.)
- **Note:** decided in conversation (2026-09-30), after the plan guide was built: the owner found the guide pages unclear and asked for them to be redone for clarity, with the guide under the video
- **The reviewer's words:** Also I think it should be under the video, maybe the video is minimized when we scroll nicely. Don't replace the video. Or video can hover over it?
- **Where:** 2026-09-28-plan-guide, step 3 (The video and the guide point at each other (question 2)); components: player
- **Status:** active; supersedes D-228

### D-265 — What does the guide hold that the video does not?

- **Chosen:** More than the video, never a restatement of it: concrete, in depth, with worked examples for each case, full and thorough, with diagrams of how the thing works, and the page's HTML used to its fullest (diagrams you can step through and click, before/after, try-it examples from real runs); any words on it can be highlighted to leave a note, the same box as a mark on the video, sent with the review — the video is the overview; the guide is where you go to understand it properly
- **Not chosen:** —
- **Note:** decided in conversation (2026-09-30), after the first rewrite of the guide for clarity
- **The reviewer's words:** i want to be able to highlight anything in the guide and a text box pops up just like when we mark in a video; then we can submit that. also the screenshots in the guide are blurry. and remember the guide should not just restate the video but make more sense, do more concrete, more in depth, more examples more full and thorough. and big thing we are missing is more diagrams and using the html to its fullest extent
- **Where:** 2026-09-28-plan-guide, step ?; components: —
- **Status:** active

### D-266 — How does a thing in the video that leads to the guide show itself?

- **Chosen:** Quietly: nothing drawn while the video plays; a faint arrow when paused; on hover a thin ring on the thing and a small grey "More in the guide ↓"; a first tap shows it on a phone, a second opens it; the focus ring stays for the keyboard — the click area should not take away from the video
- **Not chosen:** —
- **Note:** decided in conversation (2026-09-30); replaces the black "Open · <title>" tab and outline drawn over the frame; linked as superseding D-194, with the owner's approval in conversation on 2026-10-04
- **The reviewer's words:** also i dont like the click to highlight within the video for the guide, i think it takes away from the video the click area should be a bit more subtle
- **Where:** 2026-09-28-plan-guide, step ?; components: player
- **Status:** active; supersedes D-194

### D-267 — A step's picture is the system's parts as a row of names, the ones the step touches lit, and the step's own fragment where it has one; a case dropped on it does not light a path, or the stage `reel stage` draws, the step's change drawn on, a case lighting its path? (the agent's own call D2, accepted in the walkthrough)

- **Chosen:** A step's picture is the system's parts as a row of names, the ones the step touches lit, and the step's own fragment where it has one; a case dropped on it does not light a path — the stage's drawing is sized for a 1920 px frame, not a column; what a step changes is in its blocks, and the fragment is where a step draws its own
- **Not chosen:** the stage `reel stage` draws, the step's change drawn on, a case lighting its path
- **Where:** 2026-09-28-plan-guide, step 1 (The guide: a page for each plan, built from plan.md (question 1)); components: finish, diff, player, guide
- **Status:** active

### D-268 — A part the builder makes is `guide/<part>.html`, not `details/<part>.html` as step 3's interface wrote it; a page started from a template stays in `details/`, or `details/<part>.html`? (the agent's own call D1, accepted in the walkthrough)

- **Chosen:** A part the builder makes is `guide/<part>.html`, not `details/<part>.html` as step 3's interface wrote it; a page started from a template stays in `details/` — `details/` is committed with the video, and the guide is built, never committed (D-213)
- **Not chosen:** `details/<part>.html`
- **Where:** 2026-09-28-plan-guide, step 3 (The video and the guide point at each other (question 2)); components: player, guide
- **Status:** active

### D-269 — Each video has its own guide, `<video-dir>/guide/` (the full page, a part a file, `parts.json`); a plan folder builds each of its videos'; a plan with no video, `<plan-dir>/guide/index.html`, or one guide a plan at `<plan-dir>/guide/index.html`, as step 1's interface wrote it? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** Each video has its own guide, `<video-dir>/guide/` (the full page, a part a file, `parts.json`); a plan folder builds each of its videos'; a plan with no video, `<plan-dir>/guide/index.html` — the player and the review page open a video's guide beside it (after prototype v4); each video's page starts on its own side, its own moments first
- **Not chosen:** one guide a plan at `<plan-dir>/guide/index.html`, as step 1's interface wrote it
- **Where:** 2026-09-28-plan-guide, step 1 (The guide: a page for each plan, built from plan.md (question 1)); components: finish, diff, player, guide
- **Status:** active

### D-270 — The page is prototype v5's flow made general: a rail (outline, Expand all, gaps), then What changed (Built), a section a step, a section a kind of change, every choice, the decisions in force and the rest of `plan.md`; each a column of beats beside a stage, one column under 900 px; a layer a `<details>` with its summary; Expand all opens every layer, both sides of each section, each thing under its beat, or v3's outline, text column and picture? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** The page is prototype v5's flow made general: a rail (outline, Expand all, gaps), then What changed (Built), a section a step, a section a kind of change, every choice, the decisions in force and the rest of `plan.md`; each a column of beats beside a stage, one column under 900 px; a layer a `<details>` with its summary; Expand all opens every layer, both sides of each section, each thing under its beat — the owner's direction after v4 was a flow, not boxes, and v5 was that flow; a `<details>` opens without a script and from the keyboard
- **Not chosen:** v3's outline, text column and picture
- **Where:** 2026-09-28-plan-guide, step 1 (The guide: a page for each plan, built from plan.md (question 1)); components: finish, diff, player, guide
- **Status:** active

### D-271 — Things to do are made from the blocks and the real runs, never written for a plan: the first six cases dragged onto What happens, the longest trace (three beats or more) put in order, the numbers and ✓/✗ words of the first printing interface part filled in, each question's options predicted; on the Built side six files sorted into their kind and a real run's ✓/✗ lines filled in, or prototypes v4 and v5's, built by hand for one plan? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** Things to do are made from the blocks and the real runs, never written for a plan: the first six cases dragged onto What happens, the longest trace (three beats or more) put in order, the numbers and ✓/✗ words of the first printing interface part filled in, each question's options predicted; on the Built side six files sorted into their kind and a real run's ✓/✗ lines filled in — step 2: what to do comes from the blocks, so the agent writes nothing more; a hand-built one does not carry to another plan
- **Not chosen:** prototypes v4 and v5's, built by hand for one plan
- **Where:** 2026-09-28-plan-guide, step 1 (The guide: a page for each plan, built from plan.md (question 1)); components: finish, diff, player, guide
- **Status:** active

### D-272 — An explainer's source kept outside the repo (a transcript) shows its path, hash and lines, not its text; `--outside` builds a copy with it, masked, for this machine, or its text, masked, in every guide? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** An explainer's source kept outside the repo (a transcript) shows its path, hash and lines, not its text; `--outside` builds a copy with it, masked, for this machine — the guide is published with the review page; D-249 keeps the transcript out of git, and a published page is no more private
- **Not chosen:** its text, masked, in every guide
- **Where:** 2026-09-28-plan-guide, step 1 (The guide: a page for each plan, built from plan.md (question 1)); components: finish, diff, player, guide
- **Status:** active

### D-273 — A scene opens a part with `- guide: <part>[#<place>]`: a detail whose page is `guide/<part>.html` in the plan map (`guide: true`); the player offers it only once `guide/index.html` answers, and lists each step's part under the plan text's "Open:", or a chip on every step's scene? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** A scene opens a part with `- guide: <part>[#<place>]`: a detail whose page is `guide/<part>.html` in the plan map (`guide: true`); the player offers it only once `guide/index.html` answers, and lists each step's part under the plan text's "Open:" — the guide is never committed (D-213), so a clone has none until it is built; a scene says which part is its, as a detail does
- **Not chosen:** a chip on every step's scene
- **Where:** 2026-09-28-plan-guide, step 3 (The video and the guide point at each other (question 2)); components: player, guide
- **Status:** active

### D-274 — videos-that-make-sense's walkthrough: its seven prototype parts are the builder's now, same names (`- guide:` for `- detail:`, the frames' marks kept); their hand-built things to do go with them, or keeping the prototype's pages? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** videos-that-make-sense's walkthrough: its seven prototype parts are the builder's now, same names (`- guide:` for `- detail:`, the frames' marks kept); their hand-built things to do go with them — the prototype is replaced; the same scenes open the same kinds of change, made from git and `runs/`
- **Not chosen:** keeping the prototype's pages
- **Where:** 2026-09-28-plan-guide, step 3 (The video and the guide point at each other (question 2)); components: player, guide
- **Status:** active

### D-275 — A suggested edit's step and block come from its place ("step 1 · interface · …"); its ledger entry is kind `edit`, the reviewer's words chosen and the plan's the other option, active, or a list of edits the page writes apart? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** A suggested edit's step and block come from its place ("step 1 · interface · …"); its ledger entry is kind `edit`, the reviewer's words chosen and the plan's the other option, active — the note box already keeps an edit with its words and place (prototype v5); one field fewer for every page to carry
- **Not chosen:** a list of edits the page writes apart
- **Where:** 2026-09-28-plan-guide, step 4 (Edit the plan on the guide: comments, and edits the agent applies exactly (question 3)); components: revise, guide
- **Status:** active

### D-276 — An answer given on the guide goes into the plan video's record in this browser (`:decisions`, `via: "guide"`), the later kept; a part sends it to the player (`answer`), or answers only on the video? (the agent's own call A11, accepted in the walkthrough)

- **Chosen:** An answer given on the guide goes into the plan video's record in this browser (`:decisions`, `via: "guide"`), the later kept; a part sends it to the player (`answer`) — step 4: one answer, whichever place gave it
- **Not chosen:** answers only on the video
- **Where:** 2026-09-28-plan-guide, step 4 (Edit the plan on the guide: comments, and edits the agent applies exactly (question 3)); components: revise, guide
- **Status:** active

### D-277 — walkthrough.md's Categories of change: `- **<name>** {<id>} (<paths>) (<commits>) (step N): <two lines>`, `Runs:` under it; a category claims a change of the plan's commits by its path and, where it names commits, only theirs; the first to claim it has it, and what none claims is "Everything else", or a category a folder, or a commit? (the agent's own call A12, accepted in the walkthrough)

- **Chosen:** walkthrough.md's Categories of change: `- **<name>** {<id>} (<paths>) (<commits>) (step N): <two lines>`, `Runs:` under it; a category claims a change of the plan's commits by its path and, where it names commits, only theirs; the first to claim it has it, and what none claims is "Everything else" — step 5's interface named the line; one file's changes can be two kinds (the player in videos-that-make-sense), and nothing is left out
- **Not chosen:** a category a folder, or a commit
- **Where:** 2026-09-28-plan-guide, step 5 (After the build, and which plans get a guide (question 4)); components: skill, diff, player, implement-step, guide
- **Status:** active

### D-278 — On the Built side a file the build writes (a plan map, captions, snapshots, pictures, audio, a rendered page) is listed with its counts, not shown; a changed line over 2,000 characters shows its first 400 and how many more; a file over 1.5 MB has no whole text, its changes still shown, or every line of every file? (the agent's own call A13, accepted in the walkthrough)

- **Chosen:** On the Built side a file the build writes (a plan map, captions, snapshots, pictures, audio, a rendered page) is listed with its counts, not shown; a changed line over 2,000 characters shows its first 400 and how many more; a file over 1.5 MB has no whole text, its changes still shown — a plan's diff is mostly generated (a video's plan map alone is near 3,000 lines); step 5's "never cut" is about what a person wrote, which is always whole
- **Not chosen:** every line of every file
- **Where:** 2026-09-28-plan-guide, step 5 (After the build, and which plans get a guide (question 4)); components: skill, diff, player, implement-step, guide
- **Status:** active

### D-279 — The blocks are required of a plan whose folder is dated 2026-09-30 or later; `reel check --blocks` holds any plan to them, or a marker in `plan.md`, or every plan? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** The blocks are required of a plan whose folder is dated 2026-09-30 or later; `reel check --blocks` holds any plan to them — "a plan written after this ships": the folder's date is when it was written, and the plans before pass as they did
- **Not chosen:** a marker in `plan.md`, or every plan
- **Where:** 2026-09-28-plan-guide, step 2 (Complete, and checked: every step's cases, interface, example and decisions); components: diff, implement-step, guide
- **Status:** active

### D-280 — An option has an example when its text has a value, a quote, a command or a number (or "say", "e.g."), or a word of five letters or more of the question's "Say …" setup, or an `Example:` line under each option? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** An option has an example when its text has a value, a quote, a command or a number (or "say", "e.g."), or a word of five letters or more of the question's "Say …" setup — the plans' questions set up one example and answer it per option; this passes those and fails "It stops."
- **Not chosen:** an `Example:` line under each option
- **Where:** 2026-09-28-plan-guide, step 2 (Complete, and checked: every step's cases, interface, example and decisions); components: diff, implement-step, guide
- **Status:** active

### D-281 — "Says the video again" is a sentence of eight words or more of either video's narration found, letters and digits only, in the page's first layer (the beats, closed layers left out), or any sentence, or the stage too? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** "Says the video again" is a sentence of eight words or more of either video's narration found, letters and digits only, in the page's first layer (the beats, closed layers left out) — a short phrase (a step's title) is a heading by design; the stage is the real thing, not the page's words
- **Not chosen:** any sentence, or the stage too
- **Where:** 2026-09-28-plan-guide, step 2 (Complete, and checked: every step's cases, interface, example and decisions); components: diff, implement-step, guide
- **Status:** active

### D-282 — A scene's guide part whose frame marks nothing is a △ under `details_check: strict`, where an unmarked detail fails; the player shows the corner chip for it, or failing it, as a detail? (the agent's own call A14, accepted in the walkthrough)

- **Chosen:** A scene's guide part whose frame marks nothing is a △ under `details_check: strict`, where an unmarked detail fails; the player shows the corner chip for it — the videos on the review page were given their parts after they were built, and their frames mark the step's thing, not the part; a new frame marks it as a detail's (`data-detail`)
- **Not chosen:** failing it, as a detail
- **Where:** 2026-09-28-plan-guide, step 3 (The video and the guide point at each other (question 2)); components: player, guide
- **Status:** active

### D-283 — The list's sheet: one row per choice (its id, what it chose, "instead of" what) with only a Flag, and one Go on (key A) under the rows; no own words on it (words go in a comment, as on a grouped beat); on a frame that draws a card per choice, each Flag hangs from its card, or an Accept and a Flag per row, or the grouped beat's row of Flag buttons with the words only on hover? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** The list's sheet: one row per choice (its id, what it chose, "instead of" what) with only a Flag, and one Go on (key A) under the rows; no own words on it (words go in a comment, as on a grouped beat); on a frame that draws a card per choice, each Flag hangs from its card — the plan says each choice in one line with its own Flag, and Approve takes the rest; hover-only words were the thing that made choices hard to judge
- **Not chosen:** an Accept and a Flag per row, or the grouped beat's row of Flag buttons with the words only on hover
- **Where:** 2026-09-27-walkthroughs-that-help, step 2 (A choice pauses the video when you'd notice it or can't easily undo it); components: skill, player, cli, fix-step, system-video
- **Status:** active

### D-284 — The open question is asked where the review is finished: first in a walkthrough's Finish panel, with a box for your words, the ending beat saying it aloud; the words are one note on no step (`open: true`), under "Seeing it run" in `reviews/<id>.md`, or a pause on the ending frame with its own box, or a new field in the review file? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** The open question is asked where the review is finished: first in a walkthrough's Finish panel, with a box for your words, the ending beat saying it aloud; the words are one note on no step (`open: true`), under "Seeing it run" in `reviews/<id>.md` — the plan cuts pauses, and Finish is where every review ends anyway; a note needs no new field, reaches the agent like any comment, and counts as your words (so Finish suggests Request changes once you have written some)
- **Not chosen:** a pause on the ending frame with its own box, or a new field in the review file
- **Where:** 2026-09-27-walkthroughs-that-help, step 3 (A quick check where there is something to predict); components: skill, player, cli, fix-step, system-video
- **Status:** active

### D-285 — A small PR's other choices go under a new "## Other choices" in the PR template, one line each (what it chose, instead of what); the maintainer accepts them by ticking "The other choices above are accepted", and `reel pr-check` waits until then (fails with `--merge`); a line that does not say "instead of" is a note, not a failure, or the choices in a comment on the PR, or no tick (reading them is accepting them)? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** A small PR's other choices go under a new "## Other choices" in the PR template, one line each (what it chose, instead of what); the maintainer accepts them by ticking "The other choices above are accepted", and `reel pr-check` waits until then (fails with `--merge`); a line that does not say "instead of" is a note, not a failure — a line in the PR's text is where the plan puts them, and a tick is something `pr-check` can read, so accepting is never forgotten at merge
- **Not chosen:** the choices in a comment on the PR, or no tick (reading them is accepting them)
- **Where:** 2026-09-27-walkthroughs-that-help, step 4 (Pull requests get the short walkthrough); components: skill, player, cli, fix-step, system-video
- **Status:** active

### D-286 — One control: the header's Plan–Built switch is the jump (its Built segment is "See it built" on a plan scene, its Plan segment "See the plan" on the walkthrough), following the step on screen; no separate button laid on the scenes, or a "See it built" button on each plan scene beside the switch? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** One control: the header's Plan–Built switch is the jump (its Built segment is "See it built" on a plan scene, its Plan segment "See the plan" on the walkthrough), following the step on screen; no separate button laid on the scenes — the owner asked for switching to be clean and obvious, with no competing links; the switch already says where you are, and the same click then lands on the same step
- **Not chosen:** a "See it built" button on each plan scene beside the switch
- **Where:** 2026-09-27-walkthroughs-that-help, step 5 (The plan and what was built, in one row); components: player
- **Status:** active

### D-287 — The list's order: what needs you first (a plan waiting on you says what to review and how long), then the system video and the five newest plans, the rest behind "Earlier plans (N)" (open when the video playing is in it); each row one line (name, date, one word; changed before review, the lead's look: the word says what waits and on whom, every row waiting on you is under "Needs you" its video here or not, names wrap to two lines, and a row whose videos are not here says "not on this page" instead of a switch), and on a phone the word under the name, or every plan in date order, two rows each, or a search box? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** The list's order: what needs you first (a plan waiting on you says what to review and how long), then the system video and the five newest plans, the rest behind "Earlier plans (N)" (open when the video playing is in it); each row one line (name, date, one word; changed before review, the lead's look: the word says what waits and on whom, every row waiting on you is under "Needs you" its video here or not, names wrap to two lines, and a row whose videos are not here says "not on this page" instead of a switch), and on a phone the word under the name — the owner asked for what waits first and the rest folded; five is about the last week of plans here, and one word keeps a row on one line
- **Not chosen:** every plan in date order, two rows each, or a search box
- **Where:** 2026-09-27-walkthroughs-that-help, step 5 (The plan and what was built, in one row); components: player
- **Status:** active

### D-288 — A walkthrough video's length: aim 1–2 minutes, "long" past 3, "too long" past 5 (both a △ after the build, never a stop), or keeping "too long" at 10 minutes, or no "too long" at all? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** A walkthrough video's length: aim 1–2 minutes, "long" past 3, "too long" past 5 (both a △ after the build, never a stop) — the plan aims for about two minutes and the build warns past 3; a walkthrough past 5 is as long as today's, the thing this plan replaces, so it says so more firmly
- **Not chosen:** keeping "too long" at 10 minutes, or no "too long" at all
- **Where:** 2026-09-27-walkthroughs-that-help, step 1 (The walkthrough shows the change running); components: skill, player, cli, fix-step, system-video
- **Status:** active

### D-289 — The list is its own storyboard line, `- autonomy_list: a1, a4`, one beat at the end of the video; `- autonomy_group:` (one per chapter, Accept all) still plays in older videos, or reusing `- autonomy_group:` for the list, or no beat at all (the list only in the Finish panel)? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** The list is its own storyboard line, `- autonomy_list: a1, a4`, one beat at the end of the video; `- autonomy_group:` (one per chapter, Accept all) still plays in older videos — the list is judged differently from a grouped beat (Flag or leave, never Accept), so the player and `reel record` must tell them apart; older walkthroughs keep playing as they were
- **Not chosen:** reusing `- autonomy_group:` for the list, or no beat at all (the list only in the Finish panel)
- **Where:** 2026-09-27-walkthroughs-that-help, step 2 (A choice pauses the video when you'd notice it or can't easily undo it); components: skill, player, cli, fix-step, system-video
- **Status:** active

### D-290 — "Listed" is recorded when the viewer presses Go on (every choice not flagged), and `reel record` lists a choice the viewer never reached only when the review approves; a review asking for changes leaves those "never judged", or only at Approve, or listing unreached choices whatever the verdict? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** "Listed" is recorded when the viewer presses Go on (every choice not flagged), and `reel record` lists a choice the viewer never reached only when the review approves; a review asking for changes leaves those "never judged" — Go on is the list's Accept all; "Approve takes the rest" is the plan's words, and a review asking for changes has not taken anything
- **Not chosen:** only at Approve, or listing unreached choices whatever the verdict
- **Where:** 2026-09-27-walkthroughs-that-help, step 2 (A choice pauses the video when you'd notice it or can't easily undo it); components: skill, player, cli, fix-step, system-video
- **Status:** active

### D-291 — The switch lands on the first scene tagged with that plan step (in the walkthrough, its running scene; in the plan video, the step's first scene), a tenth of a second in; a step the walkthrough tags no scene with is "Nothing to run for this step". `bundle-player` works the table out into `library.json` (`steps`), or a scene the walkthrough marks as the step's running one, or the player fetching the other video's plan map as it plays? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** The switch lands on the first scene tagged with that plan step (in the walkthrough, its running scene; in the plan video, the step's first scene), a tenth of a second in; a step the walkthrough tags no scene with is "Nothing to run for this step". `bundle-player` works the table out into `library.json` (`steps`) — every built walkthrough already tags its scenes by step, so older ones jump right too; the page is built from both maps anyway, and a tenth in keeps the seek off the scene before
- **Not chosen:** a scene the walkthrough marks as the step's running one, or the player fetching the other video's plan map as it plays
- **Where:** 2026-09-27-walkthroughs-that-help, step 5 (The plan and what was built, in one row); components: player
- **Status:** active

### D-292 — The bar is judged per review, over the first three walkthrough reviews whose pauses are timed (`shownAt`): each clears it with a pause held 5 s or more (its middle value) and at least one flag, own words or comment; "due" only when all three miss, or pooling the three reviews' pauses into one middle value and one count, or counting reviews from before pauses were timed? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** The bar is judged per review, over the first three walkthrough reviews whose pauses are timed (`shownAt`): each clears it with a pause held 5 s or more (its middle value) and at least one flag, own words or comment; "due" only when all three miss — "the next three walkthroughs" means reviews made after this change, and "3 of 3" in the status message counts reviews; one review that was looked at is enough to keep the video
- **Not chosen:** pooling the three reviews' pauses into one middle value and one count, or counting reviews from before pauses were timed
- **Where:** 2026-09-27-walkthroughs-that-help, step 6 (Measure whether it worked, and what happens if it didn't); components: skill, player, cli, fix-step, system-video
- **Status:** active

### D-293 — A PR over the line with no video, or still waiting for a maintainer to accept its walkthrough, prints △ and passes; `--merge`, in the full-suite job, makes it a failure, or fail on every push until a video is reviewed? (the agent's own call A2, accepted in the walkthrough)

- **Chosen:** A PR over the line with no video, or still waiting for a maintainer to accept its walkthrough, prints △ and passes; `--merge`, in the full-suite job, makes it a failure — the plan says "needs a video" is what is missing, not the contributor's failure; the check required before a merge still holds it
- **Not chosen:** fail on every push until a video is reviewed
- **Where:** 2026-09-26-contributing, step 1 (When a PR gets a video, and who makes it); components: skill, diff, player, cli
- **Status:** active

### D-294 — This repo's `maintainers` is `["owner"]`, no email: a review recorded by git's user.email (the local page's Send, filed on some machine) counts as a contributor's until that email is added; `reel record` says so, and recording it again then adds its calls, or listing the owner's email, or the agent's git email? (the agent's own call A3, accepted in the walkthrough)

- **Chosen:** This repo's `maintainers` is `["owner"]`, no email: a review recorded by git's user.email (the local page's Send, filed on some machine) counts as a contributor's until that email is added; `reel record` says so, and recording it again then adds its calls — the owner reviews on the hosted page (19 reviews filed as `owner`); an email in a public `config.json` shows it to everyone, and the agent's email is every Claude session's
- **Not chosen:** listing the owner's email, or the agent's git email
- **Where:** 2026-09-26-contributing, step 2 (Who does what, and what lands on main); components: cli, server, skill, system-video
- **Status:** active

### D-295 — This repo's plan folders dated up to 2026-09-27 keep their videos' media committed (negated lines in `.gitignore`); a plan started after that follows the rule, or the template's lines alone, for every plan folder? (the agent's own call A6, accepted in the walkthrough)

- **Chosen:** This repo's plan folders dated up to 2026-09-27 keep their videos' media committed (negated lines in `.gitignore`); a plan started after that follows the rule — a rebuild of an older video would leave its new voice files out while its committed `index.html` names them; the plan keeps this repo's committed videos as they are
- **Not chosen:** the template's lines alone, for every plan folder
- **Where:** 2026-09-26-contributing, step 3 (Watching a contributor's video, checking it, and where it lives); components: skill, player, system-video
- **Status:** active

### D-296 — The full-suite job runs on every PR event and fails at once without `ready-to-merge`, or skip the job until the label is on? (the agent's own call A9, accepted in the walkthrough)

- **Chosen:** The full-suite job runs on every PR event and fails at once without `ready-to-merge` — GitHub counts a skipped required check as passed, so a skipped full suite would let a PR merge untested
- **Not chosen:** skip the job until the label is on
- **Where:** 2026-09-26-contributing, step 5 (CI, the merge, and the system video); components: diff, player, system-video
- **Status:** superseded, superseded by D-311 on 2026-10-08

### D-297 — The workflow is `.github/workflows/ci.yml`, or `.github/workflows/test.yml`, as the plan names it? (the agent's own call D1, accepted in the walkthrough)

- **Chosen:** The workflow is `.github/workflows/ci.yml` — the task named ci.yml; it runs more than the tests
- **Not chosen:** `.github/workflows/test.yml`, as the plan names it
- **Where:** 2026-09-26-contributing, step 5 (CI, the merge, and the system video); components: diff, player, system-video
- **Status:** active

### D-298 — The 300 lines leave out tests (test folders, `*.spec.*`, `*.test.*`), docs (`docs/`, Markdown and text files, the licence), the whole `.reelplanning/` record, `videos/` and media, lockfiles and `dist/`, and any file `.gitattributes` marks `linguist-generated` or `linguist-documentation`, or a fixed list of test, doc, video and generated paths only? (the agent's own call A1, accepted in the walkthrough)

- **Chosen:** The 300 lines leave out tests (test folders, `*.spec.*`, `*.test.*`), docs (`docs/`, Markdown and text files, the licence), the whole `.reelplanning/` record, `videos/` and media, lockfiles and `dist/`, and any file `.gitattributes` marks `linguist-generated` or `linguist-documentation` — the record is plans, reviews, videos and the log, none of it code; the attributes let any repo mark its own generated files
- **Not chosen:** a fixed list of test, doc, video and generated paths only
- **Where:** 2026-09-26-contributing, step 1 (When a PR gets a video, and who makes it); components: skill, diff, player, cli
- **Status:** active

### D-299 — Each video is checked against its text only until it is approved: a plan video once a plan review approved it, a walkthrough once a maintainer accepted it, or check every video the PR carries, always? (the agent's own call A4, accepted in the walkthrough)

- **Chosen:** Each video is checked against its text only until it is approved: a plan video once a plan review approved it, a walkthrough once a maintainer accepted it — after an approval `plan.md` takes the folded comments and a row gets "(changed after review)", with no new video by design; checking then would fail every approved plan
- **Not chosen:** check every video the PR carries, always
- **Where:** 2026-09-26-contributing, step 3 (Watching a contributor's video, checking it, and where it lives); components: skill, player, system-video
- **Status:** active

### D-300 — The hashes compare what the map already carries (the plan's title, problem and steps; each stop's chose, instead of, why and check) with `plan.md` and `walkthrough.md`; no new field in `plan-map.json`, or a hash of the whole of `plan.md` and `walkthrough.md`, written into the map by the build? (the agent's own call A5, accepted in the walkthrough)

- **Chosen:** The hashes compare what the map already carries (the plan's title, problem and steps; each stop's chose, instead of, why and check) with `plan.md` and `walkthrough.md`; no new field in `plan-map.json` — a map built before this plan checks the same, and a line added to "How each was decided" changes nothing the video says, so should not fail it
- **Not chosen:** a hash of the whole of `plan.md` and `walkthrough.md`, written into the map by the build
- **Where:** 2026-09-26-contributing, step 3 (Watching a contributor's video, checking it, and where it lives); components: skill, player, system-video
- **Status:** active

### D-301 — `reel renumber` takes an entry as the branch's own when the base holds none that decided the same thing (plan, question, date, answer), and reads the branch's log from whichever side of the conflict holds such entries, or the entries after the merge-base's last id? (the agent's own call A7, accepted in the walkthrough)

- **Chosen:** `reel renumber` takes an entry as the branch's own when the base holds none that decided the same thing (plan, question, date, answer), and reads the branch's log from whichever side of the conflict holds such entries — the same in a rebase (where ours and theirs swap) and a merge, with no merge-base to find while a rebase is under way
- **Not chosen:** the entries after the merge-base's last id
- **Where:** 2026-09-26-contributing, step 4 (Records that merge: decision numbers, generated files, the glossary); components: cli, server, skill, system-video
- **Status:** active

### D-302 — A pending memory line moves when it names no email, or this machine's git user.email; one naming `owner` or an id moves as before, or hold every line whose reviewer is not in `maintainers`? (the agent's own call A8, accepted in the walkthrough)

- **Chosen:** A pending memory line moves when it names no email, or this machine's git user.email; one naming `owner` or an id moves as before — the hosted page calls whoever published it `owner`, on anyone's page, so only an email tells two people apart
- **Not chosen:** hold every line whose reviewer is not in `maintainers`
- **Where:** 2026-09-26-contributing, step 4 (Records that merge: decision numbers, generated files, the glossary); components: cli, server, skill, system-video
- **Status:** active

### D-303 — When what's built has to be installed, does its video show the install?

- **Chosen:** Yes: a video of something people install shows the real install commands, run and working, as a step of the system; this repo's system video walks through installing reelplanning — installing is a crucial part of the system for anyone who will use it
- **Not chosen:** —
- **Note:** decided in conversation (2026-10-04); a rule for every video the skill makes, not only this repo's
- **The reviewer's words:** in the system video I think in general it's good practice if something is being built that is installed, it shows real, working installation commands in the video. Eg our reelplanning repo is a repo where this is truez where we have to install it so the system video should guide thru that as it's important crucial part of system
- **Where:** 2026-09-28-videos-that-make-sense, step ?; components: skill, system-video
- **Status:** active

### D-304 — What does the README say about the name?

- **Chosen:** It says reelplanning sounds like "real planning": a plan as long text is too hard to take in, and a video of it is what makes real planning possible — the name carries the point of the project
- **Not chosen:** —
- **Note:** decided in conversation (2026-10-04)
- **The reviewer's words:** I do want to use reelplanning somewhere in readme the fact that it sounds like real planning in the sense that planning with long text is too hard to understand and this video can really unlock things
- **Where:** 2026-09-26-case-study, step ?; components: skill
- **Status:** active

### D-305 — How does the repo go public when its history holds about 1 GB of narration audio and renders?

- **Chosen:** A slimmed history: every .wav, .mp4 and renders/ file removed from all commits (about 70 MB left), with the commit hashes the record cites rewritten to the new ones, pushed to a new public remote as one branch; this private repo keeps its full history. From then on no voice files or renders are committed anywhere (the exception for plans before 2026-09-28 ends): finished videos people should watch go up as release files or on the hosted page — a public clone should be small, and the record's commit citations should still open
- **Not chosen:** —
- **Note:** decided in conversation (2026-10-04), choosing the recommended way over a single fresh commit; extends D-213
- **The reviewer's words:** go with slimmed history, I'll set up the public remote in a bit.
- **Where:** 2026-09-26-contributing, step ?; components: cli, skill, system-video
- **Status:** active

### D-306 — How does the decision log scale to thousands of decisions?

- **Chosen:** Owner answers stay binding; accepted agent calls become history, raised again only when a change touches the lines their commits wrote; a component's binding decisions can be folded into a section of spec.md the owner approves, which a plan then cites instead of each id — at 305 decisions a plan touching one component already faced about 150 warnings; at thousands nobody reads them
- **Not chosen:** —
- **Note:** decided in conversation (2026-10-04), built without a plan video
- **The reviewer's words:** lets just do this without a new video plan for now maybe, some things might not need i think personally im fine w overriding rn. im fine w changing these things.
- **Where:** 2026-09-26-contributing, step ?; components: cli, skill
- **Status:** active

### D-307 — clicking away or starting another mark keeps the words typed; only Escape discards (**changed after review:** Escape keeps them too; a × discards), or blur discards? (the agent's own call A10, accepted in the walkthrough)

- **Chosen:** clicking away or starting another mark keeps the words typed; only Escape discards (**changed after review:** Escape keeps them too; a × discards) — clicking away should not lose words
- **Not chosen:** blur discards
- **Where:** 2026-09-22-richer-review, step 4 (Type on the mark); components: finish
- **Status:** active

### D-308 — Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory (**changed after review:** you answered "we still want to write somewhere, just somewhere we can access". The summary now goes to `.reelplanning/you.pending.jsonl` in the repo, once, and the line says so; the next `reel record` or `reel memory --you` that can write your file moves the pending lines in, deduplicated by repo, plan and review, and removes the file; until then `--you` reads both. The pending file is committed, not gitignored: a run fenced to the repo is the review server's headless run or a cloud session, and what reaches you from there is what it commits; a gitignored file would stay on that machine, gone with a cloud container. It holds nothing `reviews/` does not already carry. If two machines of yours pull it, the first that can write its home takes the lines), or failing the record; or keeping a pending copy in the repo to add later? (the agent's own call A15, accepted in the walkthrough)

- **Chosen:** Where your file cannot be written (a run fenced to the repo by D-082's sandbox, a read-only home), `reel record` records the review all the same and says, on its last line, that this one is not in your memory (**changed after review:** you answered "we still want to write somewhere, just somewhere we can access". The summary now goes to `.reelplanning/you.pending.jsonl` in the repo, once, and the line says so; the next `reel record` or `reel memory --you` that can write your file moves the pending lines in, deduplicated by repo, plan and review, and removes the file; until then `--you` reads both. The pending file is committed, not gitignored: a run fenced to the repo is the review server's headless run or a cloud session, and what reaches you from there is what it commits; a gitignored file would stay on that machine, gone with a cloud container. It holds nothing `reviews/` does not already carry. If two machines of yours pull it, the first that can write its home takes the lines) — recording the review is the job; the summary is a copy, and a pending file in the repo would be one more thing kept by hand
- **Not chosen:** failing the record; or keeping a pending copy in the repo to add later
- **Where:** 2026-09-24-memory, step 3 (Your memory, across repos); components: skill
- **Status:** active

### D-309 — The walkthroughs still open at the release: watch each, or accept them as they are?

- **Chosen:** Accepted as they are, given in conversation, not watched; `reel audit` treats a walkthrough the owner has accepted as settled history: its rule breaks are notes (△), not failures, and a walkthrough not yet accepted is held to every rule — the release's record closes without the owner watching each walkthrough again; any of them can be worked on later if needed
- **Not chosen:** —
- **Note:** decided in conversation (2026-10-05)
- **The reviewer's words:** for our stuff thats open, i think for this release lets just accept all the walkthru i dont wanna watch those really, we'll work on those later if needed.
- **Where:** 2026-09-25-fewer-better-stops, step ?; components: cli
- **Status:** active

### D-310 — What does the public repo hold, and what is it called?

- **Chosen:** The public repo is ncrispino/reelplanning, lowercase, and its main is one commit holding the current tree (`scripts/release/make-public.mjs` builds it, never pushes it); this private repo keeps its full history as an internal archive and is renamed first (e.g. to reelplanning-dev), since GitHub names ignore case. From then on all work happens on the public repo, with an ordinary history on top of that first commit: no later exports. This replaces D-305's slimmed history for the public repo; D-305's other half stands: no voice files or renders are committed anywhere. Commit ids the record cites name the development history, which is not public, and the public repo's .reelplanning/README.md says so — a public repo without the case-study history reads as more professional, and one lowercase name matches the name on the repo page
- **Not chosen:** —
- **Note:** decided in conversation (2026-10-08); supersedes in part D-305 (its slimmed public history, with the record's commit citations rewritten), so it is not linked as superseding it: D-305 stays active for its rule that no voice file or render is committed anywhere; the owner renames this repo and creates the public one
- **The reviewer's words:** for the github repo can we make it just one commit so they dont see any of the case study repo history? just more professional that way. probably will rename to just reelplanning too without capitalisation? ... we need something uniform, as the main github page has lowercase 'reelplanning' at the top. ... like we said before i believe we will release a different version of this repo, so we can do the one commit there, not here, here we keep the history. ... we will just work directly on the public one, this private was just internal beforehand
- **Where:** 2026-09-26-contributing, step ?; components: cli
- **Status:** active

### D-311 — How does a pull request reach the full suite, and what else does it need before it merges?

- **Chosen:** The full suite runs on every push to a pull request, with no label: a PR's checks are green or red for its code, never red for waiting on a maintainer. `.github/workflows/ci.yml` holds the tests (the fast and full suites) and starts only on pushes; `reel pr-check` and the video branch's cleanup move to `.github/workflows/pr.yml`, which also runs when the PR's text or labels change, so no such event records a skipped test check (GitHub counts a skipped required check as passed). Main requires a pull request with one approving review, and the fast suite, the full suite and `reel pr-check` passed on its last commit, up to date with main; the owner may merge their own with the admin bypass. The maintainer runs `reel pr-check --merge` before merging (the PR template), not CI — a check that fails until a label is added reads as broken to the maintainer and the contributor alike; the full suite takes about 10 minutes on a public repo's free runner, so it can run on every push, and an approving review is GitHub's usual gate for a maintainer's say
- **Not chosen:** —
- **Note:** decided in conversation (2026-10-08); supersedes D-296 (the full-suite job failing at once until a maintainer added `ready-to-merge`), and D-297 in part (ci.yml stays the tests' workflow; the pull request's checks move to pr.yml), so D-297 is not linked as superseded and stays active for the tests' workflow's name
- **The reviewer's words:** do you think the ready to merge label is good? is that standard? are there other things that are better bc it might make it look off and wierd bc if the maintainer is looking they dont know if the checks look good bc one always fails. ... yes lets do what you reccomend
- **Where:** 2026-09-26-contributing, step ?; components: cli
- **Status:** active; supersedes D-296

### D-312 — What is the project called?

- **Chosen:** reelplanner, said "reel planner": the npm package, the command `reelplanner` (`reel` stays), the GitHub repo ncrispino/reelplanner, the case-studies repo ncrispino/reelplanner-case-studies (its site at ncrispino.github.io/reelplanner-case-studies), the Claude Code plugin and its marketplace, a repo's project folder `.reelplanner/`, the machine's folder `~/.reelplanner` and the settings `REELPLANNER_*`. The old names are still read for a while: a repo's `.reelplanning/` when it has no `.reelplanner/` (said once, with the `git mv .reelplanning .reelplanner` that renames it), `~/.reelplanning` while there is no `~/.reelplanner`, a `REELPLANNING_*` setting, in the shell or a .env file, when its new name is unset, and the `reelplanning` command, which says the new name on stderr and runs it. The review page keeps its saved marks' storage keys (`reelplanning:annotations:…`), so a review begun before the rename is still there after it — search: reelplanning.com is already a business, so reelplanner is the easier name to find, and this early the rename is cheap
- **Not chosen:** —
- **Note:** decided in conversation (2026-10-08); it changes the name D-310 gave the public repo and the code chip D-186 shows, which are not linked as superseded: their other rules stand. The record's history keeps the old name as written: the entries before D-312, the plans, the reviews and the videos' narration. The owner renames the GitHub repos (GitHub redirects a renamed repo's old address; a GitHub Pages site's old address is not redirected)
- **The reviewer's words:** im thinking we should name it reelplanner instead of reelplanning bc seo a bit better with that (ie there is already a reelplanning.com thats a business). i know this is kind of a big ask, but its early and defeinitly efeasible.
- **Where:** 2026-09-26-contributing, step ?; components: cli
- **Status:** active
