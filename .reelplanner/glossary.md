# Glossary

One name per thing, and no synonyms. The Term is the name in the files, commands and the decision log. Where a row has an **On screen** word, that is what a viewer sees and hears instead: narration, captions, frames and the player say *choice*, not call (D-127: plain words on screen, the files keep theirs). A plan's prose says the plain word too. Add a row when a plan introduces a part; never rename a row (add the old name under "also called", then stop using it). A row for a part that is gone is removed with it.

Every row is explained by a scene of the system video tagged `- defines: <term>`; a new row makes the system video behind until one is (`reel status`, `check-terms`).

The words under **Other words**, at the end, are the trade's own (repo, branch, merge, pull request): a meaning a viewer can open on any video, which the system video does not have to explain, and adding one never makes it behind. `check-terms` finds a word like these said or shown with no meaning anywhere (D-216); add its row there, or give it a meaning in the storyboard's `terms:` line. A phrase fresh eyes flagged, and the author kept, goes there too when other videos say it (D-226).

| Term | id (`system.json`) | Meaning | Also called (do not use) | On screen (D-127) |
|---|---|---|---|---|
| The plan-to-video skill | `skill` | The instructions the agent follows for this whole way of working: turning a plan into a video, then building the change and making its walkthrough video (`skills/plan-to-video/`, made with HyperFrames: `plan.md` in, a HyperFrames project out) | the skill, faceless-explainer (that's the layer under it) | |
| narrate | `narrate` | Voices the script, only the lines that changed since the last build; `reelplanner build` runs it, then finish-project and verify | re-narrating, rebuild-narration | |
| finish-project | `finish` | The last stage of building a video: it adds the captions and the page, ties each scene to the plan, and checks the result (`finish-project`: captions → index → plan-map → the terms index, which video explains each word → plan-diff → the details check) | | |
| plan-diff | `diff` | Content-hash diff vs. the last committed build | | |
| spec-diff | — | Which scenes of the system video a change to the system's description (`spec.md`), its parts (`system.json`) or this glossary reaches, so only those are rebuilt (`reelplanner spec-diff`); it also names a row no scene explains yet | | |
| The review player | `player` | The video player on the review page (`<reelplanner-player>`). You watch, answer the video's questions, mark and comment on what you see, and press Finish to send your review | the player | |
| The review server | `server` | `reelplanner review`: serves the review page, takes the review when you press Send, keeps it in the inbox and hands it on once; sends the notifications | the local server | |
| The headless run | `headless` | The agent's own command (from `config.json`), started by the review server when no session is waiting; auto mode, inside the sandbox, or without it (and the reviewer told) where this machine can't run it | the unattended run | |
| The reel CLI | `cli` | The command that keeps the project's record: its plans, reviews and decisions (`scripts/reel.mjs`, in `.reelplanner/`). For example, `reel record` files a review and logs your answers, and `reel status` says what is waiting | reel.mjs | |
| The revise step | `revise` | What the agent does with your review of a plan (`plan.md`). If you approved it, it works your comments into the plan; if you asked for changes, it rewrites the steps your comments touched | revision, auto-revise | |
| The implement step | `implement-step` | The agent building what the approved plan says (`plan.md`), and noting each choice the plan left open (in `walkthrough.md`). A second agent then checks the code against the plan: the code check | implementation | |
| The walkthrough fix step | `fix-step` | Acts on a walkthrough review: changes the code for each flagged call; on changes requested, rebuilds only those beats | | |
| The system video | `system-video` | One video that explains the whole project: its parts and how they work together. It is updated whenever the project's description of itself changes (`spec.md`, `system.json`, this glossary) | the main video, the overview video | |
| A review | — | One pass by a reviewer, filed once and never overwritten (`reviews/<kind>-<time>.json`, with a `.md` of what to act on). The player's download is `annotations.json` until it is filed | the resolved plan, the resolved walkthrough | |
| Approve / Request changes | — | The verdict at Finish. Approve (on a walkthrough, the build is accepted): the comments are acted on, no new video. Request changes: they are acted on, the touched beats rebuilt, and the video shown again | | |
| The inbox | — | `.reelplanner/inbox/`: reviews the review server has taken, each handed on once; not committed. A repo not set up has it in this machine's `~/.reelplanner/inbox/<repo-key>/` | | |
| The sandbox | — | The fence a headless run starts in: commands write only inside the repo, a hook keeps the file tools there too; checked before each run, and turned off, with the reviewer told, where it can't run (the hook stays) | | |
| A notification | — | A desktop notice from the review server: a video is ready, with what it will ask, or a headless run has ended | | |
| A call | — | A choice the agent made on its own while building, one the plan did not cover (one row in `walkthrough.md`). Labelled *visible*, *hard-to-undo* or *close* when you might want to overturn it | autonomy row | choice |
| reel stops | — | Which choices pause the walkthrough video: an off-plan change always, a choice labelled *visible* or *hard-to-undo*, and one sharing a label with a recent late fix; every other choice goes on the list at the end | | |
| Memory | — | What reviews show, worked out each time from the decision log and the filed reviews (`reviews/`), never kept by hand: the lines `reel status` ends with, the evidence behind each in `reel memory <id>`; the reviewer's own, across repos, from `~/.reelplanner/you.jsonl` (`--you`) | | |
| A miss | — | A late fix: something a review let through that a later plan, fix or review had to change. A recent one makes choices with its label pause the walkthrough video | | late fix |
| A tag | — | A label the agent puts on a choice it made alone, saying why you might want to look at it. Four kinds: *visible* (you'll notice it when you use the thing), *hard-to-undo* (changing it later costs real work), *close* (a toss-up: the other way was nearly as good), *deviation* (an off-plan change). A choice labelled *visible* or *hard-to-undo* pauses the walkthrough video; the rest go on the list at the end | | label |
| A deviation | — | An off-plan change: a choice where the agent did something other than what the plan said. It always stops the walkthrough video | | off-plan change |
| A beat | — | One scene of a video: a picture and a sentence or two of its voice. A video is a row of scenes; a question or a choice pauses at the end of its scene | | scene |
| A chapter | — | A stretch of one video under one title; the player shows "Chapter 2 of 4" as it begins, and N / P jump between them. Not a plan's step, and not a part of the system | a part (of a video) | |
| An area | — | One part of the system, drawn as a box: the review player, the review server and the rest of this table's ids. `system.json` calls it a component; the system video says "part" | component, a part (of the system) | part of the system |
| An id (D-056, A12, D1, k3, q2) | — | How to read one: D-056 is a decision in the decision log, numbered across the repo; A12 is the twelfth choice the agent made alone while building one plan, and D1 its first off-plan change; k3 is a video's third quick check, q2 a plan's second question. The player always says what an id is next to it | | |
| A retro | — | A plan of skill edits the memory's evidence supports, started when the status says one is due, and judged against a fixed benchmark (`reel retro`, `reel status`) | | |
| A grouped beat | — | In older walkthrough videos, one scene per chapter listing the agent's smaller choices, the ones the video doesn't stop on. You flag any you'd change, and Accept all takes the rest | | grouped scene |
| A step | — | One numbered part of a plan: one change, what it does and what it needs from another step (`### Step N` in `plan.md`); the video tells each in its own scenes. The system video tells its two loops in steps too | | |
| Finish | — | Where a review ends: you approve, or ask for changes, and send what you answered and marked. An explainer's ends instead with Done, Explain more or Plan this | | |
| The decision log | — | `decisions.md`: the record of every answer you gave and every choice you accepted, one numbered entry each (D-056). An entry is never changed; a later one can replace it | the ledger | |
| A quick check | — | A short question the video asks you about what the plan or the code will do, to check you followed. If you expected something else, you can say so, and your words go to the agent as a comment | quiz | |
| The answer band | — | The answer bar. A question is answered on the frame's cards when it has them (own words, a note, Accept / Flag beside them); a frame with no cards gets the bar in the lowest eighth it leaves empty (`data-band="bottom"`), and only an older video without that gets it under the video; the video never changes size | the sheet, the strip | answer bar |
| system-review | — | Files a review of the system video and sorts each comment: fix the video, a small change, or a new plan | | |
| A part of the guide / guide part | — | One section of the page under the video, about one thing a scene shows: click that thing in the video, or press O, and the page scrolls to its section while the video pauses. A scene can instead open a small page of its own over the video (`- guide: <part>`, built by `reelplanner guide`; `- detail:`, from a template in `templates/details/`; the frame marks the thing with `data-detail`) | a detail, deep dive, deep-dive page | part of the guide |
| The Open chip | — | The way into a detail where the frame marks nothing (an older video), or, on a phone, where the marked thing is too small to tap: a chip in the frame's corner; click it or press O. A scene that marks its thing has no chip | | |
| The side panel | — | Where the Terms and the answer bar's long words open: beside the stage on a wide window, covering it otherwise. A detail opens over the frame, not here | the drawer, the overlay | |
| The plan text | — | The plan's own words, shown beside the video with the current step highlighted (from `plan.md`). It is off until you turn it on with the Plan switch, or press L | the plan page | |
| The details check / check-details | — | The check that every detail page works and that each frame marks only its own scene's detail (`check-details`), run by finish-project and verify; a broken detail page, or a frame marking a detail its scene does not have, stops the build (under `details_check: strict`, so does a scene whose thing is marked nowhere) | | |
| The agent | — | The AI coding assistant that does the work, in chat: it writes the plan, builds the code and makes the videos. Claude Code, Codex or opencode, whichever the repo uses (`config.json` names its command) | | |
| The plan video | — | The video of a plan, made before any code is written: its steps, and a question wherever a choice is yours. You answer on the video, and the plan is revised | | |
| The walkthrough video / walkthrough | — | The video made after the code is built: what was built, step by step, and each choice the agent made alone (listed in `walkthrough.md`). You accept or flag each choice, then approve the build or ask for changes | | |
| The code check | — | A second agent, which has not seen the work, reads the built code against the plan and the earlier decisions, and lists where they differ. Each thing it finds is answered before the walkthrough video is made (`code-check`, from a short brief) | | |
| Fresh eyes | — | Two new agents that look at every new or rebuilt video before you do, knowing nothing of the plan: one lists what a newcomer couldn't follow, the other what breaks the rules for a clear frame. Everything they find is fixed or answered before the video reaches you (`reelplanner fresh-eyes`; what is kept after the third look is said on Before you watch) | | |
| The frame rules | — | The style guide's seven rules for a frame a newcomer can read (§5): show the thing, never a stand-in; one reading order; each name on its thing; a question that says what you decide; nothing covering content; readable at a glance; pleasing. frame-lint fails the two a program can see; the designer of fresh eyes checks all seven | | |
| frame-lint | — | A check that reads each frame of a video for problems a program can spot, such as an empty bar where words should be, or something in the way of a thing the video points at (`reelplanner frame-lint`) | | |
| Ask about this | — | Ask a question about the scene you're on: press Q, or click a word in the captions, and type it. An agent answers it from the plan and the scene when one is there to answer (on a hosted page, Claude), and every question is kept with your review | | |
| A brief | — | A short written description an agent starts from. A video's brief (`BRIEF.md`) says who it is for, what it shows and how it looks; the code check's agent gets one saying what to compare | | |
| The storyboard | — | A video's plan, scene by scene (`STORYBOARD.md`): what each scene shows and says, and the tags the player reads, such as a question, a quick check or a word the scene explains | | |
| reel audit / audit | — | The check on a walkthrough (`reel audit`): it fails while a finding of the code check is unanswered, or a step has five choices the agent made alone and no question asked | | |
| The explainer | `explainer` | A video that explains something already there (some code, a log, a transcript, a session's changes), made when you ask, so you understand it before deciding anything. It asks you nothing; at the end you choose Done, Explain more or Plan this, and a plan can start from it (`reelplanner explain "<what you asked>" <source> …`, in `.reelplanner/explainers/`; every fact from a named source, `check-sources`) | explainer video | |
| The guide | `guide` | The page under a video, with what the video cannot hold: every case, every command, every decision, and after the build every changed line and the real runs. Scroll down from the video to read it; the video goes on in a small player in the corner (built from `plan.md` by `reelplanner guide`, never committed; D-264). Select any words on it to comment, suggest an edit or ask | the plan guide, the full guide page | |

## Other words

General words of the trade, with the meaning a newcomer needs. The player shows each on hover and in Terms, like any row; the system video does not have to explain them, so a row here never makes it behind (`reel status`, `spec-diff`).

| Term | id | Meaning | Also called (do not use) | On screen |
|---|---|---|---|---|
| A repo / repository | — | A project's folder of code together with its whole history, kept with git (on GitHub, say) | | |
| A branch | — | A line of work kept apart from the main code until it is merged | | |
| Merge | — | To bring a branch's changes into the main code. A pull request is merged when it is accepted | | |
| A commit | — | One saved change to a repo, with a message saying what changed; a repo's history is a row of them | | |
| Clone | — | To copy a repo, with its history, onto your own computer | | |
| A diff | — | The lines a change adds and removes, shown together | | |
| A pull request / PR | — | A change someone asks to have merged into a repo; others read it and comment before it goes in | | |
| Squash | — | To merge a pull request's commits as one commit | | |
| CI | — | The checks a repo runs by itself on every pull request (its tests, say), before anyone merges it | | |
| A test suite | — | All of a project's tests, run together to check that nothing broke | | |
| A spec | — | Two meanings here: one file of tests (`scripts/test/terms.spec.mjs`), run with the others by `npm test`; or the system's own description of its parts, `spec.md` | | |
| Lint / linter | — | A check that reads code or files for mistakes without running them (`frame-lint` reads a video's scenes) | | |
| A flag | — | In a command, an option written after its name (like `--dry-run`). On a choice in the walkthrough video, Flag is the answer that says "change this" (the other is Accept) | | |
| A prompt | — | The words given to an agent to start it on a task | | |
| A template | — | A file to start from, filled in for each new use | | |
| A dependency | — | A package of someone else's code a project needs in order to run | | |
| A terminal | — | The window where you type commands | | |
| CLI | — | A command-line tool: a program you run by typing its name and options in a terminal | | |
| HTML | — | The language web pages are written in; each scene of a video is an HTML page | | |
| reelplanning | — | reelplanner's name until October 2026 (D-312). Plans, reviews, pages and videos made before then keep it, as they were written | | |
| CSS | — | The rules for how a web page looks: its colours, sizes and where things sit | | |
| JSON | — | A plain-text format for data a program reads (`plan-map.json`, say) | | |
| TTS | — | Text to speech: the voice made from a video's script | | |
| git | — | The tool that keeps a repo's history: its commits and branches | | |
| GitHub | — | The website where many repos are kept and pull requests are reviewed | | |
| npm | — | The tool that installs a JavaScript project's packages and runs its scripts (`npm test`) | | |
| Plan mode | — | Claude Code's mode where the agent plans in chat and changes nothing until you approve | | |
| npx | — | Runs a published package's command without installing it first, as in the two commands the review page shows when no review server is behind it (`npx -y reelplanner@0.2.0 reel record …`) | | |
| Recommended | — | The option a question's author suggests, marked on its card; the video plays what it leads to unless you pick another, and your memory counts how often you take it | | |
| The real thing | — | What a scene is about, shown as it is: the actual file, table, command output or screen, with its own words, instead of a picture about it | | |
| A hosted page | — | The review page published online and opened from a link (a Claude Artifact), rather than run on your own computer. There, Claude answers Ask about this, on your own account | | |
| Before you watch | — | The card the review page shows before a video first plays: the videos to watch first, and what fresh eyes left as it is (the findings the author kept), each with why | | |
| Walk me through it | — | The button under a quick check once you have answered: it works that check's own case through, step by step, in a few plain sentences | | |
