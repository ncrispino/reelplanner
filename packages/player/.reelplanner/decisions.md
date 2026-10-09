# Decisions

Append-only ledger. `reel record` adds entries from a plan review; a plan that changes one adds a superseding entry and says why. `reel check` enforces this.

| id | date | plan | step | question | chosen | status |
|---|---|---|---|---|---|---|
| D-001 | 2026-09-21 | 2026-09-21-review-page | 2 | When a decision is asked, what happens to the video? | **Overlay the lower third, but the question collapses and reopens** (not the recommendation) | active |
| D-002 | 2026-09-21 | 2026-09-21-review-page | 4 | Where do comments live? | **Under the video** | active |
| D-003 | 2026-09-21 | 2026-09-21-review-page | 6 | On a phone, what happens to the rail? | **One sheet you pull up** | active |

### D-001 — When a decision is asked, what happens to the video?

- **Chosen:** Overlay the lower third, but the question collapses and reopens
- **Not chosen:** The stage shrinks (the whole frame stays visible above the sheet; the picture is smaller exactly when you are studying it); The sheet overlays the lower third (the picture keeps every pixel; the sheet covers the caption band and whatever sits low in the frame); The video steps aside (the clearest reading of the question; you lose the picture you are deciding about)
- **Where:** 2026-09-21-review-page, step 2 (Never crop the frame a decision is about); components: stage, sheet
- **Status:** active

### D-002 — Where do comments live?

- **Chosen:** Under the video — always in view while watching; pushes the video up and competes with the toolbar
- **Not chosen:** In the rail, at the top (keeps the main column clean; on a narrow screen the rail is below the fold again)
- **Where:** 2026-09-21-review-page, step 4 (Comment where attention already is); components: stage, composer
- **Status:** active

### D-003 — On a phone, what happens to the rail?

- **Chosen:** One sheet you pull up — the video stays uncovered until you ask; everything is one pull away
- **Not chosen:** Tabs under the video (one list is always visible; it always costs the video that strip)
- **Where:** 2026-09-21-review-page, step 6 (On a phone, the video is the page); components: stage, page
- **Status:** active
