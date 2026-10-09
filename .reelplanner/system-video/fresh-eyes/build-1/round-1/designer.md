# Fresh eyes: designer · round 1 · stamp 4a412bb07eb9

- G1 · scene 1 · "OK ✓": the plan panel fills the left three-quarters of the frame, then a wide empty gap, then one small "OK ✓" button sitting alone on the right; breaks rule 7 — the frame reads as a filled half and an empty half, and the button looks disconnected from the plan it accepts.
  - Answer: kept: the OK is the scene's point, the one click that says yes to pages of plan; the space between the plan and it is the skimming the narration describes

- G2 · scene 2 · "the review page · videos you can follow": this caption sits directly on top of the real page heading "Videos you can follow" underneath it at the top of the frame; breaks rule 5 — the actual page title is covered by the caption meant to describe it.
  - Answer: kept: the place label sits above the screenshot, clear of it; the page's own title "Videos you can follow" is inside the screenshot, below the label and not covered

- G3 · scene 5 · "plan-diff": its box sits to the left of "finish-project" in the bottom row, so a left-to-right scan reaches plan-diff first, but the narration names finish-project before plan-diff; breaks rule 2 — the visual order contradicts the spoken order.
  - Answer: kept: every part keeps one place on the stage in every scene of every video (system.json's stage), so a part is always where you last saw it; each lights as the narration names it, which is the order to follow

- G4 · scene 6 · "The review player": its box sits a row below "The review server / The headless run / The reel CLI," so it's read last, but the narration introduces the review player first ("The review player is the page where you watch and answer"); breaks rule 2.
  - Answer: kept: as G3, the stage's places are fixed; the review player lights first, as it is said

- G5 · scene 6 · "ThereelCLI": the box's own label reads as one run-together word, with no space between "The" and "reel CLI"; breaks rule 6 — not readable at a glance as the words it's meant to be. Recurs in scenes 7, 8, and 35.
  - Answer: fixed: the label's words sit in one span, so "The reel CLI" keeps its spaces (a flex box dropped them) in scenes 6, 7, 8 and 35 (compositions/frames/09-answers-back.html, 10-after-code.html, 11-cast.html, 35-end.html)

- G6 · scene 7 · "The system video": its box sits in the row above the rest of the grid, so it's read first, but the narration names it last ("And the system video is this one"); breaks rule 2.
  - Answer: kept: as G3; the system video's box is lit last, as it is said

- G7 · scene 10 · [four boxes, left side]: four stacked rectangles on the left show no words or content at all; breaks rule 1 — an empty box where words should go.
  - Answer: kept: the boxes are the real page's rows (Before you watch), cut at the left edge as the camera pans to the Terms panel; the scene's words are in the panel

- G8 · scene 10 · "side panel": the label sits over those blank boxes on the left of the frame, far from the actual Terms panel it names, which is on the right; breaks rule 3 — the label doesn't sit on what it labels.
  - Answer: fixed: the "side panel" label now sits on the panel's left edge (compositions/frames/20-before.html)

- G9 · scene 11 · "a detail, over the frame": the chip sits directly on top of the header sentence, covering part of its words (the line breaks mid-phrase, "...ts 10 calls."); breaks rule 5.
  - Answer: fixed: the label "a detail, over the frame" moved above the screenshot, off the page's header words (compositions/frames/21-beside.html)

- G10 · scene 12 · [large grey block, right/top of frame]: a large flat grey rectangle with a hard edge fills much of the frame with nothing in it — no text, image, or label; breaks rule 1 and rule 7 — an empty box, and the frame reads as unbalanced.
  - Answer: kept: the grey block is the real review page's video area, dimmed behind the Size control the scene closes in on

- G11 · scene 20 · [rightmost column of the table]: its text is cut off at the frame's right edge ("...already r...", "...one by o...", "...rules apa...", "...the list w..."); breaks rule 6 — not readable at a glance, several rows are unreadable.
  - Answer: kept: the camera crops the table to the columns the narration reads (what it chose, the label); rule 6 asks for that crop, and the last column, where to check, is not the point here

- G12 · scene 20 · "At a step's fifth choice, the agent stops,": this caption is the opening line of the next scene's narration (scene 21, about reel audit and the fifth choice), not a line about this scene's own content, which is about labels and off-plan changes; breaks rule 3 — the qualifier at the bottom doesn't match what the frame above it shows.
  - Answer: fixed: fresh-eyes took its picture 0.12 s before the scene's end, when the next scene's first caption is already up; it now takes it 0.4 s before (scripts/fresh-eyes.mjs); the scene's own caption is its last sentence

- G13 · scene 22 · [the whole picture]: the frame is empty cream background with nothing on it at all, apart from the caption bar at the very bottom; nothing shows the finding the narration describes ("One here was about this very video: no scene explained a step, or Finish"); breaks rule 1 and rule 7 — the starkest empty-box moment in the video.
  - Answer: fixed: the frame's clips ended 0.4 s before its scene (17.323 s of 17.723 s), so it went blank for its last moment; the rebuild runs them to the scene's end (compositions/frames/25-code-3.html, and 27b-check-6.html had the same)

- G14 · scene 25 · "Flag either one": the label sits near the top of the frame, well apart from the actual Flag buttons (Flag A1, Flag A5) on the two cards below it that it refers to; breaks rule 3.
  - Answer: kept: "Flag either one" is the review page's own words, part of the screenshot as the player draws a stop, not a label the video added

- G15 · scene 27 · "the cost": the chip sits inline in the middle of a sentence inside the terminal block, covering the words at that point ("...; the [chip] other 15 are kept..."); breaks rule 5.
  - Answer: fixed: the pin moved under the run, off its words, and says whose cost it is (compositions/frames/29-catch-up.html)
