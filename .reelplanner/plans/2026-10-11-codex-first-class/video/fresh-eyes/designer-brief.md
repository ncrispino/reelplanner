# Fresh eyes: the designer's brief · video

You are a designer looking at "video", a narrated video of 18 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's chips,
captions and a detail's glyph included) and what the narration says over it. Look at every picture, at the size it is.

**This is a rebuild: look only at what it changed.** Scenes 2, 5, 7, 9, 10, 11, 12, 13, 14, 16, 18 of the 18 are new or changed since
the last build, and those are what you look at. Scenes 1, 3, 4, 6, 8, 15, 17 are here for context only,
the scene just before or after a changed one: they have not changed and had their look, so list nothing on them. The
other scenes are not here: they have not changed since their own look. A finding on a scene not marked "look at
this one" is out of scope and is not counted.

## The seven rules (a frame a newcomer can read)

1. **Show the thing, never a stand-in.** Words, not grey lines or an empty box where words go.
2. **One reading order,** top to bottom, left to right, in the order the narration says it.
3. **A label sits on what it labels, and a qualifier with what it qualifies.** Never a column of chips apart from
   the things they name.
4. **A question says what you decide.** "Drop the walkthrough video after each build? Approve or not", never "you
   approve, or not" alone.
5. **Nothing covers content.** The player's "More in the guide ↓" label has room above the thing it opens; no chip
   or caption sits on words.
6. **Readable at a glance.** Text big enough to read in the picture, text inside a screenshot too, and sharp (a
   screenshot stretched soft breaks it); at most three type sizes.
7. **Pleasing.** One focal point; the same gap between like things; the frame used in balance, not a column of
   chips with an empty half.

List only what stops a viewer: a place a picture breaks rules 1–6 so that they cannot read, find or trust what is
there (cut off, covered, too small or faint to read, in an order the narration contradicts, a stand-in where the
thing should be), with the rule's number and what would fix it in a few words. What only makes a frame less
pleasing (rule 7: a gap, the balance, a nicer layout) goes after your findings under a heading `## Advisory`, a
line each with no number: the author reads it and need not answer it.

## The shape of designer.md (keep it exactly)

```
# Fresh eyes: designer · round 2 · stamp 6bc78a8c71c1

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene (only scenes 2, 5, 7, 9, 10, 11, 12, 13, 14, 16, 18). Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing.

Mark a finding `[plan]` right after its number (`- G3 [plan] · scene 9 · …`) when it is about the plan, not the
video: something the plan leaves out (a step, a case, what it costs), or a thing the video only describes where the
person would need to see it (a mock that stays grey bars, a prototype only named). The author cannot set those aside:
they go into the plan, or to the person as a question. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: The goal and the boundary · context only: it did not change, list nothing on it

Picture: `shots/scene-01.png`

> You should be able to finish the same review loop with Codex or Claude Code. This proposal changes installation, review follow-up, conversation discovery and lifecycle proof. The branch is feat/codex-first-class; integration behavior remains proposed.

### Scene 2 · look at this one

Picture: `shots/scene-02.png`

> The goal is the same review experience with either agent: watch with sound, answer choices, leave comments, press Send and see the revised video. Codex plugins install instructions. Trusted hooks trigger commands; tool connections expose services. These are extension options, not a complete hosted review system. The existing browser player handles review. We will test a browser beside Codex in the terminal. A hosted Claude page also saves reviews, checks reviewer identity and answers questions. We have not found a proven Codex replacement for those services.

### Scene 3 · part: Your chosen local scope · context only: it did not change, list nothing on it

Picture: `shots/scene-03.png`

> You chose A: finish the local Codex workflow and check portable reviews. That scope is settled. Local Send goes directly to the project and notifies Codex. Automatic delivery from a hosted page elsewhere stays outside this change.

### Scene 4 · context only: it did not change, list nothing on it

Picture: `shots/scene-04.png`

> On this machine, press Send. The project saves your answers and comments, then the waiting Codex session receives the review. That is how your first review reached us: you did not download anything. A file transfer is needed only for a disconnected portable copy reviewed elsewhere.

### Scene 5 · look at this one

Picture: `shots/scene-05.png`

> Good code means one shared review workflow: save, notify, review and fix, then commit. Small agent adapters contain only the differences: check available features, launch with the right permissions, notify the right session, and find its saved conversation. Each function receives this project and the relevant review or session, then reports what happened. Shared code owns retries and decides when work is finished. Adding another agent should mean adding those small functions. Keep one player, one server and one inbox, the saved pending reviews. Earlier answers still bind the plan; independent checks and real walkthroughs still apply. The guide holds the exact function contract.

### Scene 6 · part: Install and finish safely · context only: it did not change, list nothing on it

Picture: `shots/scene-06.png`

> Step one stands alone. Package reelplanner natively for Codex; preserve Claude’s skill install. Validate these proposed commands in an isolated Codex settings folder. The marketplace is the plugin catalog. The skill supplies instructions; CLI and video tools still need setup. Diagnostics name missing tools. Optional hooks need manual local trust; the public plugin directory excludes bundled hooks.

### Scene 7 · look at this one

Picture: `shots/scene-07.png`

> Step two uses the feature checks from step one. Starting Codex with no session open is enabled only when you ask. It must follow the allowed permissions and preserve commit signing. Here is the failure case: the files were edited, but the signing key is unavailable. The commit fails. The work is still unfinished. The review page shows Stopped before commit and the log. Keep the edits. You restore the signing key or settings; Codex then uses the guarded retry command, checking for any live worker and any work already finished. Only a successful commit allows the review to be marked done.

### Scene 8 · context only: it did not change, list nothing on it

Picture: `shots/scene-08.png`

> A teammate installs the plugin without video tools. Does installation prove the lifecycle, or should diagnostics name missing tools?

### Scene 9 · part: Deliver and find the right session · look at this one

Picture: `shots/scene-09.png`

> Step three uses installation and the safe follow-up from step two. First save the review. Then notify the session already waiting, or the verified connected Codex session. If neither is available, use an explicitly configured new run; otherwise keep the review for the next session. Only one agent handles the saved item. Notification means the message arrived, not that the work finished. Ask about this saves a question for a live session; a disconnected question waits rather than starting a new run.

### Scene 10 · look at this one

Picture: `shots/scene-10.png`

> A different change passes its checks, but Git refuses permission to create the commit. The files are edited. Is the review finished, still unfinished with its edits saved, or should the server commit for Codex?

### Scene 11 · look at this one

Picture: `shots/scene-11.png`

> Step four stands alone. A transcript is the saved conversation. Match active Codex identity and repo, not the newest session. Support current paginated history as well as observed old storage. If this file is unreadable, Codex first tries its supported read-only conversation export. If that fails, it asks you for a readable copy or path for this specific conversation and checks that it belongs to this session and project. Record the conversation’s path, fingerprint and size in the explainer’s source list. The private text stays outside Git.

### Scene 12 · look at this one

Picture: `shots/scene-12.png`

> The connected session closes, then a question arrives. Yesterday’s headless setting exists. Does the question launch work, vanish, or stay saved?

### Scene 13 · part: Prove the result before claiming support · look at this one

Picture: `shots/scene-13.png`

> Step five tests the same player in the ordinary browser and beside Codex in a terminal workspace. Watch with sound, answer choices, leave comments, and press Send. Codex receives the saved review; you see which scenes changed after revision. Check the printed address opens this plan, even when another server occupies the first port. Then test a separate portable copy elsewhere: only that disconnected copy needs a file returned to the agent. Your chosen scope A stays the same.

### Scene 14 · look at this one

Picture: `shots/scene-14.png`

> The active conversation is unreadable and its supported export fails, but a newer main conversation from this project is readable. Which source should the explainer use?

### Scene 15 · part: Evidence earns the support claim · context only: it did not change, list nothing on it

Picture: `shots/scene-15.png`

> Step six needs all five steps. A real scratch project installs, builds a narrated plan, reviews and revises, implements, passes independent code check, shows a walkthrough, fixes a flagged choice and commits. Exercise questions, headless changes, failure recovery and session discovery. Record commands, versions, durations and results. Fast and full touched specs plus Claude regressions protect existing behavior. Untested live paths and platforms remain unverified.

### Scene 16 · look at this one

Picture: `shots/scene-16.png`

> A teammate opens a portable copy with no connection to your project. They finish reviewing. Does Codex receive it automatically, or must they return the review file?

### Scene 17 · context only: it did not change, list nothing on it

Picture: `shots/scene-17.png`

> Mocked queue specs pass, but no real Codex session has answered a page question. Can the complete lifecycle be called tested?

### Scene 18 · look at this one

Picture: `shots/scene-18.png`

> The revised plan keeps your chosen local scope. Send here needs no download. One shared workflow and small agent adapters keep the code easy to extend. Failed commits remain unfinished. The guide holds the full examples and interfaces. Approve this clearer plan or ask for changes; implementation follows approval.
