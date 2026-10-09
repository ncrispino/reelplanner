# Sketch: your picture of how it works, as input

Before an explainer, or instead of a written plan, you can show the agent how *you* think something works: draw it,
say it and type it on one canvas. `reelplanner sketch` records that and saves it into the repo as one folder, which
the next step reads like any other source. Where your picture and the code disagree is what the video is about.

Two ways in:

- **Ask your agent:** "let me sketch how upload resume works". The agent runs
  `reelplanner sketch "how upload resume works" --once` in the background: the page opens with the topic filled in,
  and when you press Send the command exits and prints `sketch: <folder>`, so the agent picks your sketch up and goes on.
  If you close the page without sending (a reload is fine), or no page opens within 15 minutes, it exits 1 with no
  `sketch:` line, so the agent is never left waiting.
- **By hand:** `reelplanner sketch`, nothing else. Type what you're explaining in the box at the top right (or leave
  it: the folder is then just `sketch`), sketch, Send, and give the folder to your agent. The page stays up for
  another sketch until Ctrl-C.

The text after `sketch` is optional either way: it only fills that box, which names the folder and heads `sketch.md`.
Other options: `--port <n>`, `--out <dir>` (where the folder goes), `--no-open` (print the URL instead of opening it),
`--partner openrouter|local|off` and `--partner-model <id>` (below).

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

## Questions while you sketch

A partner model can watch and ask: at each picture it gets the canvas as an image, the boxes and arrows exactly as
typed, and what you have said and typed so far, and it may ask one short question, shown under the topic, beside the
canvas (never drawn on it). It is told to ask about *your* picture (an arrow to nowhere, a box never explained,
something you said you are unsure of) and never to explain or correct the code: where your picture and the code
differ is what the explainer is for. At most one question every 20 s, eight in all, and none until you have said or
typed something since the last. The switch under the topic turns it off (remembered in this browser).

| `--partner` | What runs | What leaves the machine |
|---|---|---|
| `openrouter` (recommended) | `anthropic/claude-sonnet-5.5` through OpenRouter, 1.5–6 s and about $0.002–0.003 a question (2.5¢ at most a sketch). Needs `OPENROUTER_API_KEY`, the key the hosted voice uses | each picture, the drawing as text, and the words so far |
| `local` | a vision model on an OpenAI-compatible server here: Ollama (`:11434`) or LM Studio (`:1234`), the first vision model it lists (`ollama pull gemma3:4b` if none) | nothing (the live caption is still the browser's: in Chrome, Google's) |
| `off` | nothing | nothing |

Why that model: the candidates were given the same picture and words, in four cases (they sounded unsure; a question
already answered; a question already asked; nothing left open), each two or three times, in October 2026. Sonnet 5.5
asked about what they were unsure of every time, held back when nothing was open or it had asked already, and when it
did ask again it found a new thread ("when an upload stops halfway and starts again, how does the client know which
chunks already arrived?"). `openai/gpt-6-luna` is the budget pick (`--partner-model openai/gpt-6-luna`: ~2.5 s, about
$0.0001 a question, a little weaker at holding back); `google/gemini-3.8-flash` held back best but took 4–15 s;
`anthropic/claude-haiku-5.5` asked about the same thing again; `qwen/qwen3.8-flash` and `z-ai/glm-5.3-flash` often
ran out of tokens thinking and answered nothing. Models that hear the voice directly (`google/gemini-3.8-flash`,
`qwen/qwen3.8-omni-flash`, `xiaomi/mimo-v2.6-flash`) asked the same questions from 18 s of the recording's audio as
from its transcript, at about the same time and cost, and none asked better than Sonnet 5.5 does from the words; so the
partner is sent the words. (`thinkingmachines/inkling-small` took text well, but its provider refused audio.)

With none named (`auto`), it is OpenRouter when `OPENROUTER_API_KEY` is set, else a local server with a vision model,
else off; `sketch` says which on start, and the page names it. Settings: `REELPLANNER_SKETCH_PARTNER`,
`REELPLANNER_SKETCH_MODEL` (any OpenRouter model id that takes images, or a local model's name),
`REELPLANNER_SKETCH_BASE_URL`, or `.reelplanner/config.json`'s `"sketch": { "partner", "model", "base_url" }`.
A partner named that cannot run (no key, no server, no vision model) stops `sketch` and says why.

A question is only useful while the picture it is about is still on the canvas: an answer later than 30 s
(`REELPLANNER_SKETCH_PARTNER_STALE_S`) is not shown, the page says so, and after two late ones the questions stop for
that sketch. That matters for `local` on a machine with no GPU: measured on 4 CPU cores, `gemma3:4b` answers in 2–5 s
on its own but in 85–100 s while the page records (Chromium's encoder takes about 1.5 cores), so there it never
keeps up. On Apple silicon or with a GPU it does; OpenRouter does anywhere. A local model is loaded when `sketch`
starts, so the first question does not also wait for that.

## The folder

Saved to `.reelplanner/sketches/<date>-<slug>/` in a repo that keeps a record, else `videos/sketches/<date>-<slug>/`.

| File | What it is | In git |
|---|---|---|
| `sketch.md` | what an agent reads first: the question; one timeline of what was said with a picture at each pause, every change to the picture (renamed, rerouted, erased, moved, restyled, brought back), the partner's questions and the pauses; the final drawing in words (frames and what is in them, shapes with their dashes and colours, arrows and loose ends, text and what it sits by, groups, what each freehand mark circles or underlines, rows of where things are); the typed notes; the note left at Send | yes |
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

### `session.json` (format `reelplanner-sketch/1`)

Every `t` is seconds on the recording's clock: a `t` is that moment in `recording.webm` (the clock stops while
Finish is open, as the recording does).

```jsonc
{
  "format": "reelplanner-sketch/1",
  "id": "20261008T190024Z", "question": "how upload resume works", "created": "…", "duration_s": 74.2,
  "context": { "repoName": "my-app", "remote": "…", "commit": "3488126…", "branch": "main", "dirty": false },
  "recording": { "file": "recording.webm", "mime": "video/webm;codecs=vp9,opus", "has_audio": true, "width": 1280, "height": 800, "pointer_drawn": true },
  "transcript": { "source": "browser-speech" | "whisper" | "api" | "none", "lang": "en-US",
                  "model": "small.en", "api": "groq", "replaced": "browser-speech",   // whisper and api only
                  "segments": [{ "t0": 0.5, "t1": 1.1, "text": "the upload starts in the client", "confidence": 0.9 }] },
  "notes": [{ "t": 5.6, "text": "not sure where the chunk index is stored", "elementId": "…" }],
  "keyframes": [{ "n": 1, "t": 1.8, "said": "the upload starts in the client", "file": "keyframes/kf-001.png", "elements": 2 }],
  "events": [{ "t": 0.8, "type": "add" | "update" | "delete" | "restore", "id": "…", "kind": "rectangle", "text": "…",
               "x": 120, "y": 220, "w": 200, "h": 90, "in": "<container id>", "from": "<id>", "to": "<id>", "until": 2.1,
               "strokeStyle": "dashed", "strokeColor": "#e03131", "backgroundColor": "#ffc9c9", "name": "<a frame's>", "frame": "<id>" }],
  "pauses": [{ "t": 39.2, "seconds": 8.1 }],
  "pointer": [{ "t0": 42.1, "t1": 43.4, "id": "<element under the pointer>" }],
  "final": { "png": "final.png", "scene": "final.excalidraw",
             "elements": [{ "id": "…", "kind": "arrow", "x": 320, "y": 265, "w": 240, "h": 0, "label": "chunks", "from": "…", "to": "…",
                            "strokeStyle": "dashed", "frame": "<id>", "groups": ["…"] }] },
  "partner": { "provider": "openrouter" | "local", "model": "anthropic/claude-sonnet-5.5", "on": true,
               "questions": [{ "t": 41.2, "after_picture": 3, "text": "Where does the chunk index live?" }],
               "late": 1, "stopped": "too slow here" },   // late, stopped: only when answers came too late
  "feedback": "confident about the client side, guessing on retries",
  "before_recording": 0
}
```

- A **keyframe** is taken when a spoken sentence ends, when a note is typed, or 2.5 s after the drawing stops
  changing with nothing being said. `said` is what was said or typed (`(typed) …`) since the one before.
- **Events** fold a burst of changes to one element (a drag, a stroke) into one `update`, with `until`. Each carries
  where the element is and how it looks (only what differs from a plain black solid outline), so a move, a restyle, a
  rename (a label's `text`) and a reroute (an arrow's `from`/`to`) can be told apart; `sketch.md` tells them as
  _changed:_ lines in its timeline, with each thing named as it was called at that moment.
- **Pauses** are kept with how long they lasted (the recording's clock stands still through one).
- **Pointer** rests (0.4–10 s on one element, not while drawing or typing a note) are kept, so "this one" has a
  referent: `sketch.md` adds _(pointing at "Resizer")_ to what was said then, or _(traced with the pointer: "App" →
  "Edge" → "Resizer")_ when it ran along three or more.
- **Numbered steps** ("1 POST /checkout" on an arrow, a "3" by a box) are gathered in `sketch.md` in their numbers'
  order, with a line when they were drawn in another order.
- `transcript.source` is `none` when the browser has no live recognizer or it was blocked, and nothing has
  transcribed the recording yet (below). `whisper` and `api` are transcripts made from the recording: each
  keyframe's `said` is then made again from their words, and `replaced` names the live one they took the place of.

## A transcript from the recording

The live caption is the browser's: Chrome sends the audio to Google for it, Firefox has none, and it can be blocked.
The voice is in `recording.webm` whichever way, and two things read it there:

- **After Send, by itself:** when there was no live transcript and whisper.cpp is installed
  (`reelplanner setup --local-voice`), `sketch` transcribes the recording with local whisper (`small.en`, or
  `REELPLANNER_WHISPER_MODEL`) and writes `session.json` and `sketch.md` again. With `--once` this happens before the
  `sketch:` line, so the agent reads the words. The voice stays on the machine; nothing hosted is used unasked.
- **Later, by hand:** `reelplanner sketch-transcribe <sketch-folder>`, for any sketch, including one with a live
  transcript (whisper's words take its place). It uses local whisper when installed, else a transcription API whose
  key is set (`GROQ_API_KEY`, `OPENAI_API_KEY` or `OPENROUTER_API_KEY`); `--api` chooses the API, `--model` a whisper
  model, `--lang` the language spoken (default: the browser's).

Whisper makes words up in silence (a long pause while drawing comes back as "I'm going to go ahead and do that",
again and again): a sentence that lies almost wholly in the recording's silence is dropped, and
`transcript.dropped_in_silence` counts the words. Sentences are given to pictures whole, each to the first picture
after its middle, never split. Words said after the last picture are listed in `sketch.md` after it, marked so.

## Using it

The folder is a source like any other: `reelplanner explain "<question>" <sketch-folder> <the code>` pins its
committed text (`sketch.md`, `session.json`, `final.excalidraw`) beside the code, and the explainer says where your
picture matches the code and where it does not. Without a record (`reel init`), give the agent `sketch.md`.

## Setup and privacy

- The page runs on a build of Excalidraw and React made once per machine into `~/.reelplanner/vendor/` (`reelplanner
  vendor-excalidraw`, which `sketch` runs on first use; a few seconds). Nothing is fetched from a CDN.
  Excalidraw and React are MIT: the bundle opens with Excalidraw's licence and keeps React's, and `fonts/LICENSES.md`
  beside it gives each font's (SIL OFL 1.1 for most; see [NOTICE](../NOTICE)). Nothing of them is committed or shipped.
- The microphone is used only while recording. The live caption is the browser's own speech recognition: in Chrome
  that sends the audio to Google. The recording itself stays on your machine, and a transcript made from it after Send
  is local whisper's; a hosted transcriber only reads it when you run `sketch-transcribe` with no whisper here, or `--api`.
- Tested in Chromium (live caption and recording both). Firefox records but has no live caption; Safari is untested.
