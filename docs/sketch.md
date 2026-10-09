# Sketch: your picture of how it works, as input

Before an explainer, or instead of a written plan, you can show the agent how *you* think something works: draw it,
say it and type it on one canvas. `reelplanning sketch` records that and saves it into the repo as one folder, which
the next step reads like any other source. Where your picture and the code disagree is what the video is about.

Two ways in:

- **Ask your agent:** "let me sketch how upload resume works". The agent runs
  `reelplanning sketch "how upload resume works" --once` in the background: the page opens with the topic filled in,
  and when you press Send the command exits and prints `sketch: <folder>`, so the agent picks your sketch up and goes on.
- **By hand:** `reelplanning sketch`, nothing else. Type what you're explaining in the box at the top right (or leave
  it: the folder is then just `sketch`), sketch, Send, and give the folder to your agent. The page stays up for
  another sketch until Ctrl-C.

The text after `sketch` is optional either way: it only fills that box, which names the folder and heads `sketch.md`.
Other options: `--port <n>`, `--out <dir>` (where the folder goes), `--no-open` (print the URL instead of opening it).

## The page

One full-screen [Excalidraw](https://github.com/excalidraw/excalidraw) canvas (MIT), its own tools as they are, and
a bar at the bottom:

- **Record / Pause / Resume.** Records the canvas (not the toolbar) with your voice. The pointer is drawn in as an
  orange dot, so "this goes here" shows where.
- **The live caption** above the bar shows what the browser heard. The recording keeps the audio whatever it hears.
- **The note box.** Type, press Enter: the note is timed and also put on the canvas, under what is drawn.
- **Finish** pauses and shows exactly what will be sent: the recording to play back, the transcript (click a line
  to jump there), a picture at each pause, and a box for anything to flag. **Keep sketching** goes back and resumes;
  **Send to the repo** saves the folder; **Download instead** gives a `.zip` of it (also what a page opened without
  the server offers).

The question at the top right ("what are you explaining?") names the folder and heads `sketch.md`.

## The folder

Saved to `.reelplanning/sketches/<date>-<slug>/` in a repo that keeps a record, else `videos/sketches/<date>-<slug>/`.

| File | What it is | In git |
|---|---|---|
| `sketch.md` | what an agent reads first: the question, what was said with a picture at each pause, the typed notes, the final drawing as boxes and arrows, the note left at Send | yes |
| `session.json` | everything, on the recording's clock (below) | yes |
| `final.excalidraw` | the finished scene: open it in Excalidraw to keep drawing | yes |
| `recording.webm` | the canvas as drawn, with the voice; copied once by ffmpeg (when installed) so it has a duration and can be seeked | no |
| `keyframes/kf-NNN.png` | the canvas each time a thought ended | no |
| `final.png` | the finished drawing | no |

The recording and pictures stay on disk and out of git, as a render does (`sketches/.gitignore`).

### Which input for which model

- **A model that takes video with audio** (Gemini, say): `recording.webm`, with `sketch.md` for the question.
- **A model that takes images** (Claude, say): `sketch.md`, which pairs each keyframe with what was said before it,
  and the keyframes themselves. Far cheaper than every frame of the video.
- **Exact names and connections**: `final.elements` in `session.json` (or `final.excalidraw`): a label read from
  pixels can be misread; this is the text as typed and which arrow joins which box.

### `session.json` (format `reelplanning-sketch/1`)

Every `t` is seconds on the recording's clock: a `t` is that moment in `recording.webm` (the clock stops while
Finish is open, as the recording does).

```jsonc
{
  "format": "reelplanning-sketch/1",
  "id": "20261008T190024Z", "question": "how upload resume works", "created": "…", "duration_s": 74.2,
  "context": { "repoName": "my-app", "remote": "…", "commit": "3488126…", "branch": "main", "dirty": false },
  "recording": { "file": "recording.webm", "mime": "video/webm;codecs=vp9,opus", "has_audio": true, "width": 1280, "height": 800, "pointer_drawn": true },
  "transcript": { "source": "browser-speech" | "none", "lang": "en-US",
                  "segments": [{ "t0": 0.5, "t1": 1.1, "text": "the upload starts in the client", "confidence": 0.9 }] },
  "notes": [{ "t": 5.6, "text": "not sure where the chunk index is stored", "elementId": "…" }],
  "keyframes": [{ "n": 1, "t": 1.8, "said": "the upload starts in the client", "file": "keyframes/kf-001.png", "elements": 2 }],
  "events": [{ "t": 0.8, "type": "add" | "update" | "delete" | "restore", "id": "…", "kind": "rectangle", "text": "…",
               "in": "<container id>", "from": "<id>", "to": "<id>", "until": 2.1 }],
  "final": { "png": "final.png", "scene": "final.excalidraw",
             "elements": [{ "id": "…", "kind": "arrow", "x": 320, "y": 265, "w": 240, "h": 0, "label": "chunks", "from": "…", "to": "…" }] },
  "feedback": "confident about the client side, guessing on retries",
  "before_recording": 0
}
```

- A **keyframe** is taken when a spoken sentence ends, when a note is typed, or 2.5 s after the drawing stops
  changing with nothing being said. `said` is what was said or typed (`(typed) …`) since the one before.
- **Events** fold a burst of changes to one element (a drag, a stroke) into one `update`, with `until`.
- `transcript.source` is `none` when the browser has no live recognizer or it was blocked: the audio is still in the
  recording, for a transcriber to read afterwards.

## Using it

The folder is a source like any other: `reelplanning explain "<question>" <sketch-folder> <the code>` pins its
committed text (`sketch.md`, `session.json`, `final.excalidraw`) beside the code, and the explainer says where your
picture matches the code and where it does not. Without a record (`reel init`), give the agent `sketch.md`.

## Setup and privacy

- The page runs on a build of Excalidraw and React made once per machine into `~/.reelplanning/vendor/` (`reelplanning
  vendor-excalidraw`, which `sketch` runs on first use; a few seconds). Nothing is fetched from a CDN.
- The microphone is used only while recording. The live caption is the browser's own speech recognition: in Chrome
  that sends the audio to Google. The recording itself stays on your machine.
- Tested in Chromium (live caption and recording both). Firefox records but has no live caption; Safari is untested.
