# Fresh eyes: the designer's brief · Explain first: what was built

You are a designer looking at "Explain first: what was built", a narrated video of 15 scenes, before anyone reviews it. For
each scene you get a picture of it at rest (its last moment, as the review page shows it: the player's Open tab,
chips and captions included) and what the narration says over it. Look at every picture, at the size it is.

## The seven rules (a frame a newcomer can read)

1. **Show the thing, never a stand-in.** Words, not grey lines or an empty box where words go.
2. **One reading order,** top to bottom, left to right, in the order the narration says it.
3. **A label sits on what it labels, and a qualifier with what it qualifies.** Never a column of chips apart from
   the things they name.
4. **A question says what you decide.** "Drop the walkthrough video after each build? Approve or not", never "you
   approve, or not" alone.
5. **Nothing covers content.** The player's Open tab has room above the thing it opens; no chip or caption sits on
   words.
6. **Readable at a glance.** Text big enough to read in the picture, text inside a screenshot too; at most three
   type sizes.
7. **Pleasing.** One focal point; the same gap between like things; the frame used in balance, not a column of
   chips with an empty half.

List every place a picture breaks one, with the rule's number and what would fix it in a few words.

## The shape of designer.md (keep it exactly)

```
# Fresh eyes: designer · round 3 · stamp c640abdefaac

- G1 · scene 4 · "the phrase or thing": what you saw, and which rule it breaks; why it matters
- G2 · scene 7 · …
```

One finding a line, numbered G1, G2 … in scene order, each starting with its scene. Put the phrase or
the thing on screen in double quotes. Write "- none" if you have nothing. Leave room under each line: the
author answers each one there. Do not answer or fix anything yourself.

## The video, scene by scene

### Scene 1 · part: What landed

Picture: `shots/scene-01.png`

> Explain first, built. You can now ask for a video of something that's already there, before any plan: a part of the repo, a branch, a transcript, a log, last night's experiment. Seven files carry it, one line each.

### Scene 2

Picture: `shots/scene-02.png`

> Step one. As you asked, there's no list of kinds. The command knows sources. Each is pinned by what it is, a file, a commit range, a log, and described by its shape: a sequence, files, a table, or text. A source over two hundred lines gets a guide part. That's its size, never its kind.

### Scene 3 · part: Ask for one

Picture: `shots/scene-03.png`

> Step two, running. `reelplanning explain` takes your question and what holds the answer; here, last night's experiment, a folder outside the repo. Each file is pinned by its path, hash and line count, never its text. It's a snapshot: asked again, you get a new folder, and nothing is ever rebuilt.

### Scene 4

Picture: `shots/scene-04.png`

> Quick check. On Monday you ask about the review server. By Friday, seven commits have changed it. What plays on Friday?

### Scene 5

Picture: `shots/scene-05.png`

> On the review page, it's a row of its own: its length, the commit it explains, five commits since, and the plan it led to. Two choices. Its name is its folder's plus "explainer", as a walkthrough's is. And it waits under Needs you until you've watched it.

### Scene 6 · part: Review it, then plan

Picture: `shots/scene-06.png`

> Step three. Finish on an explainer has three ends: Done, Explain more, and Plan this. It says nothing goes into the decision log, and asks what you want next. Two choices: that question is on every explainer's Finish, and Done comes first, comments or not.

### Scene 7

Picture: `shots/scene-07.png`

> Quick check. You comment "this looks wrong" on an explainer and press Done. What goes into the decision log?

### Scene 8

Picture: `shots/scene-08.png`

> `reel record` files it beside the explainer: your comment by scene, your question and its answer. The decision log held two hundred and fifty decisions before, and the same after. Only an answer to a plan's question goes there.

### Scene 9

Picture: `shots/scene-09.png`

> Step four, Plan this. `reel new-plan --from` opens the plan with the explainer's name, and quotes what you said, by scene. `reel prereqs` puts the explainer first under Before you watch, so the plan video starts at what changes. One choice: with no plan file, it writes a draft, the problem only.

### Scene 10 · part: Honest and private

Picture: `shots/scene-10.png`

> Step five. `build` now runs `check-sources`. Every quoted line must be in its source, word for word, as it was when it was pinned. Retype one, and the build fails. And a secret anywhere in the text stops it.

### Scene 11

Picture: `shots/scene-11.png`

> Quick check. A CI log's explainer quotes a line holding a GitHub access key. What does the build do?

### Scene 12

Picture: `shots/scene-12.png`

> Here it is. The key stops the build, named by its kind only, never printed. Masked in the text, it passes; a blur would leave it in what's committed. Two choices: that holds anywhere in the video's text, not just in quotes. And where a source is far longer than the video, a third fresh agent checks the narration against the sources.

### Scene 13 · part: What ran

Picture: `shots/scene-13.png`

> What ran: every fast test, with a new spec, and a fresh agent's code check. It found three things the steps asked for that were missing: the row's length, Ask about this from the sources, and the plan's link back. All three are built now. Not done: the guide parts wait for the plan guide's builder.

### Scene 14

Picture: `shots/scene-14.png`

> The other six choices are the list: the two-hundred-line rule, how a file's shape is read, the length an explainer aims for, the end kept as its verdict, what counts as a quoted line, and what counts as a number. Flag any you'd change.

### Scene 15

Picture: `shots/scene-15.png`

> Seeing it run, anything you'd change? Say it in Finish, or approve the build.
