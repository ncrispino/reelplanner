# Fresh eyes: designer · round 3 · stamp 0cabc5bbfb38

- G1 · scene 1 · "OK ✓": a lone black button floats alone in empty space, far right of the plan text and its three unanswered questions, with the right two-thirds of the frame empty; breaks rule 7 — two disconnected focal points, unbalanced frame.
  - Answer: kept: as rounds 1 and 2: the OK is the scene's point

- G2 · scene 3 · "Full question": narration says "More on a card says what picking it means," but the picture shows one "Full question" chip sitting above both cards, not a "More" affordance on each card; breaks rule 3 — the qualifier isn't with each card it should qualify.
  - Answer: kept: "Full question" is the page's own control in the screenshot, not the video's label; More is on each card, in the same picture

- G3 · scene 5 · the eight dashed boxes: eight of the twelve "parts" in the system grid are empty dashed outlines with no words in them; breaks rule 1 — an empty box where a word should go.
  - Answer: kept: the dashed boxes are the parts not yet drawn: the stage shows its twelve places from the start and fills them a few at a time, as the narration names them

- G4 · scene 6 · "The review player": named first in the narration, but sits in the third row, read after review server / headless run / reel CLI in the row above it; breaks rule 2 — reading order doesn't match narration order.
  - Answer: kept: as rounds 1 and 2: the stage keeps each part in one place in every scene

- G5 · scene 7 · "The system video": drawn top-most and outlined in red, the most prominent box in the frame, yet it's the last thing the narration names ("And the system video is this one"); breaks rule 2.
  - Answer: kept: as G4, the stage keeps each part in one place

- G6 · scene 8 · the frame at rest: almost entirely empty cream space, with only a floating caption ("with the fix step in place of the revise step") — no loop diagram, arrows, or labels visible; breaks rule 1 — the thing itself isn't shown.
  - Answer: fixed: as N4: the frame's layers now last its whole slot (scripts/fix-clip-durations.mjs)

- G7 · scene 10 · "side panel": the callout chip sits directly on top of the definition heading in the Terms panel, hiding all but the word "check" (should read "Quick check"); breaks rule 5.
  - Answer: fixed: "side panel" moved again, onto the panel's left edge and off its words (compositions/frames/20-before.html); round 1's move had put it on "Quick check"

- G8 · scene 13 · "Flag either one": a fragment of an unrelated control (a flag tooltip, from the walkthrough flow) is visibly cut off at the very top of the frame, before and disconnected from this scene's Approve / Request changes content; breaks rule 7 — a stray element competing for focus.
  - Answer: kept: "Flag either one" is the review page's own words at the top of the screenshot, where the camera crops it

- G9 · scene 15 · "The review server": the sentence's subject and named first in the narration, but sits in the second row, read after "a waiting session" and "outside the repo" in the row above; breaks rule 2.
  - Answer: kept: as G4: the review server keeps its place; the waiting session and "outside the repo" come from it

- G10 · scene 18 · "Video ready to review": the notification card sits top-right, the first thing the eye meets, though the narration names it third, after narrate and plan-diff; breaks rule 2.
  - Answer: kept: the notification is the thing the scene ends on, drawn where a notification appears; the narration names it as it lands

- G11 · scene 20 · the choices table: both the top row and the right-hand column of every row run off the edge of the frame ("...one by o", "...rules apa", "...plan was"); breaks rule 6 — not readable at a glance, the words are literally cut off.
  - Answer: kept: as N11, the camera crops to the columns read

- G12 · scene 21 · the terminal output: the audit command and its finding both cut off at the right edge ("grep -E", "...about it: a"); breaks rule 6.
  - Answer: kept: the camera pushes in on the two lines the narration reads, both whole

- G13 · scene 25 · "fewer-better-stops walkthrough · step 1 · 2 choices, 1 pause": this top caption bar sits over the page's own on-screen heading; a sliver of the covered heading text is visible peeking out above it; breaks rule 5.
  - Answer: kept: the place label covers the screenshot's own title, which says the same ("Fewer, better stops: what was built")

- G14 · scene 30 · the crossed-out edit icon: the X mark covers most of the word inside the circle, leaving only "...it" legible; breaks rule 6.
  - Answer: kept: the crossed-out word is "edit", struck on purpose: rule one of the scene is that a revise never edits a past entry
