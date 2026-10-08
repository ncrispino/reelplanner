# Fresh eyes: newcomer · round 3 · stamp 636b396fde0f

- N1 · scene 1 · "seven rules": The narration says frames follow seven rules, but nothing on screen lists them. I guessed frame-lint checks each one automatically. By the end I've only ever seen two named (rule 1 in scene 9, rules 1 and 5 in scene 12) — I still don't know what the other five check.
  - Answer: kept: as rounds 1 and 2: the seven rules are the style guide's (§5) and the plan's step 4; this video shows the change running

- N2 · scene 1 · "the places that carry it": The diff table's header calls the six listed files "this plan's code, the places that carry it." I guessed it means every file that uses this plan's code, but nothing says how that list was made, or whether these six are all of them.
  - Answer: kept: the map's heading says where it comes from, git diff from the plan's first commit; the rows are the places that carry the change, as the style guide's map shows a change across many files

- N3 · scene 2 · "40 things viewers were lost on before": The terminal output reports this count with no source given at this point. I guessed it means past reviewer confusion logged somewhere. Scene 12's A4 later says "lost before: every review in the repo," but by scene 2 I had no way to know that yet.
  - Answer: kept: as round 2's N2: fresh-eyes' own output; the list says where they come from

- N4 · scene 3 · "4/6 fresh eyes": The progress line counts "4/6" with no list of the six steps anywhere on screen. I guessed fresh-eyes runs through six internal stages, but I can't say what they are or which four had finished.
  - Answer: kept: as round 2's N3: the build's own output, shown as it prints it

- N5 · scene 7 · "Your answers go on record": This bolded phrase appears twice in the Ask modal, beside a scene number and a timestamp, with no explanation attached. I guessed it means the question and its answer get saved somewhere permanent, but I can't tell if that's the saved review file, the decision log, or something else — or why it's shown per question.
  - Answer: kept: it is the title of the system video's scene the question was about, as the panel names it

- N6 · scene 9 · "its step 6": The on-screen caption reads "another plan's video, its step 6," matching the narration's "step six's frame," but the frame-lint command right above it targets a file named "...30-step-5-did-it-work.html." I guessed steps might be numbered from 0, so step-5 is the sixth step, but nothing says so, and the mismatch reads like an error.
  - Answer: kept: the file's name is its own (frames are numbered from the video's first); the label says which step of that video it shows

- N7 · scene 10 · "ninety-three findings": The narration says "the system video, checked now: three rounds, ninety-three findings, every one answered," but scenes 2 through 5 showed fresh-eyes running three rounds on that same system video and ending, in scene 3, with "35 findings answered (3 fixed, 32 kept)." I can't tell if scene 10 is a later, separate check or the same one with different numbers.
  - Answer: fixed: the line said only the last round's count; fresh-eyes now says "round 3's 35 findings" (scripts/lib/fresh-eyes.mjs), and the frame shows it (compositions/frames/03-step-2-build-stops.html)

- N8 · scene 10 · "ThereelCLI": The "before" diagram's third box reads "ThereelCLI" with no space, while the "after" box reads "The reel CLI." I guessed the missing space is the bug being fixed, matching "like this label" in the narration, but the video never says so — it could just as easily be a mistake in the diagram itself.
  - Answer: fixed: the before picture is labelled "spaces lost" (compositions/frames/10-step-5-system-video.html)

- N9 · scene 12 · "stamped scene by scene": A3 says fresh-eyes records "what they saw, stamped scene by scene." I guessed a stamp is some kind of hash or timestamp taken of each scene, used to tell later whether it changed, but the video never names what a stamp actually is or what it's used for.
  - Answer: kept: as round 2's N7: A3's row in walkthrough.md says it, and a Flag asks about it

- N10 · scene 12 · "an answer is checked, not only there": A7 gives no further detail than this line. I guessed it means fresh-eyes checks that an answer actually addresses the finding, not just that the "Answer:" field isn't empty, but I don't know what a failing check looks like, or what runs it.
  - Answer: kept: A7's row in walkthrough.md says it (a kept needs its reason, a meaning must exist); the build's line in scene 3 is it running
