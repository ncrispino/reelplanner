#!/usr/bin/env node
// The sketch page (`reelplanner sketch`, docs/sketch.md), end to end in a headless browser with a fake microphone and
// a stand-in speech recognizer:
//   - the page loads its Excalidraw from the machine's vendor build, with the question and the repo's commit shown
//   - recording composes the canvas with the voice: a webm with a video and an audio stream, seekable (ffmpeg's copy)
//   - each spoken sentence ends a keyframe, paired with what was said; a typed note is timed, said, and on the canvas
//   - edits are events on the recording's clock; an element that leaves the scene is a delete
//   - Finish pauses the clock (and the recording); Keep sketching resumes it
//   - Send saves the folder: sketch.md (boxes, the arrow between them by label, the note), session.json, the
//     scene, the pictures; in a repo with a record, under .reelplanner/sketches/, with a .gitignore for the media
//   - Download gives the same folder as a .zip
//   - --once (how an agent runs it): with no question the box starts empty, and after Send the command exits 0 with
//     `sketch: <folder>` as its last line; without it, the command stays up
//   - no live transcript (no recognizer in the browser): after Send, local whisper (a stand-in for HyperFrames'
//     `transcribe`) makes one from the recording before that last line; sketch.md pairs its words with the pictures
//   - `sketch-transcribe <folder>` makes one for a saved sketch (replacing the browser's), and says so when nothing
//     here can (no whisper.cpp, no API key)
//   - --once and the page closed without Send: the command exits 1 after a grace a reload stays within, and it
//     exits 1 when no page opens at all
//   - the partner (a stand-in OpenAI-style server as the local model): the page names it, sends it the picture, the
//     boxes and arrows and the words at a picture, shows its question beside the canvas and keeps it; NONE shows
//     nothing; sketch.md lists the question in its place. OpenRouter: the recommended model and the key, by default;
//     a partner named that cannot run says why; off shows no switch
// usage: node scripts/test/sketch.spec.mjs
import { chromium } from "playwright-core";
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chmodSync } from "node:fs";
import { createServer } from "node:http";
import { launchOpts, testPort, serverUp, ROOT } from "../lib/env.mjs";
import { resolvePartner, askPartner, RECOMMENDED } from "../lib/sketch-partner.mjs";
import { describeScene, sceneChanges } from "../lib/sketch-scene.mjs";
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };

// ---------- the picture and its changes in words (no browser): what sketch.md and the partner are told ----------
{
  const R = (id, label, x, y, more = {}) => ({ id, kind: "rectangle", label, x, y, w: 160, h: 80, ...more });
  const scene = [
    { id: "f", kind: "frame", name: "Region A", x: 40, y: 80, w: 500, h: 200 },
    R("q", "Queue", 60, 120, { frame: "f", strokeStyle: "dashed" }), R("w", "Fetcher", 320, 120, { frame: "f" }),
    R("db", "DB", 60, 400, { strokeColor: "#e03131", backgroundColor: "#ffc9c9", groups: ["g1"] }), { id: "c", kind: "ellipse", label: "Cache", x: 320, y: 400, w: 160, h: 80, groups: ["g1"] },
    { id: "a", kind: "arrow", from: "q", to: "w", label: "pulls", x: 220, y: 160, w: 100, h: 0 }, { id: "a2", kind: "arrow", from: "w", x: 480, y: 160, w: 120, h: 40 },
    { id: "t", kind: "text", text: "~50k/s", x: 240, y: 130, w: 60, h: 20 }, { id: "u", kind: "freedraw", x: 60, y: 486, w: 150, h: 8 },
    { id: "o", kind: "freedraw", x: 300, y: 390, w: 200, h: 100 },
  ];
  const md = describeScene(scene).join("\n");
  ok(md.includes(`frame "Region A": "Queue", "Fetcher"`) && md.includes(`rectangle "Queue" (dashed)`) && md.includes(`rectangle "DB" (red, filled light red)`), "scene: a frame by its name with what is in it; dashed and colours said in words");
  ok(md.includes(`"Fetcher" → (nothing: a loose end)`) && md.includes(`"~50k/s" (next to the arrow "Queue" → "Fetcher")`) && md.includes(`- "DB", "Cache"`), "scene: a loose arrow end, a note tied to the arrow it sits by, a group");
  ok(md.includes(`a freehand stroke: under "DB"`) && md.includes(`a freehand stroke: around "Cache"`) && /row 1: "Queue", "~50k\/s", "Fetcher"/.test(md), `scene: an underline and a circle by what they mark; rows left to right — ${md.split("\n").filter((l) => /freehand|row/.test(l)).join(" | ")}`);
  const steps = describeScene([R("b", "Browser", 40, 100), R("g", "Gateway", 300, 100), R("o", "Orders", 560, 100),
    { id: "a1", kind: "arrow", from: "b", to: "g", label: "1 POST /checkout", x: 200, y: 140, w: 100, h: 0 }, { id: "a3", kind: "arrow", from: "o", to: "b", label: "3 done", x: 300, y: 200, w: 260, h: 0 },
    { id: "a2", kind: "arrow", from: "g", to: "o", label: "2. create order", x: 460, y: 140, w: 100, h: 0 }]).join("\n");
  ok(steps.includes(`- 1: "Browser" → "Gateway" "POST /checkout"\n- 2: "Gateway" → "Orders" "create order"\n- 3: "Orders" → "Browser" "done"`) && steps.includes("Drawn in another order: 1, 3, 2"),
    "scene: numbered arrows gathered in their numbers' order, and drawn out of order said so");
  const ev = (t, type, id, more) => ({ t, type, id, ...more });
  const redo = sceneChanges({ events: [
    ev(1, "add", "a", { kind: "rectangle", x: 0, y: 0, w: 100, h: 60 }), ev(1, "add", "b", { kind: "rectangle", x: 300, y: 0, w: 100, h: 60 }),
    ev(1, "add", "al", { kind: "text", in: "a", text: "API" }), ev(1, "add", "bl", { kind: "text", in: "b", text: "DB" }),
    ev(2, "add", "x", { kind: "arrow", from: "a", to: "b" }), ev(2, "add", "xl", { kind: "text", in: "x", text: "async" }),
    ev(4, "delete", "x", { kind: "arrow" }), ev(4, "delete", "xl", { kind: "text" }),
    ev(30, "add", "y", { kind: "arrow", from: "b", to: "a" }), ev(30, "add", "yl", { kind: "text", in: "y", text: "sync" }),
    ev(60, "delete", "y", { kind: "arrow" }), ev(61, "add", "z", { kind: "arrow", from: "a", to: "b" }), ev(61, "add", "zl", { kind: "text", in: "z", text: "write" }),
  ] }).map((c) => c.text);
  ok(redo[0] === `took back the arrow "async" ("API" → "DB"), drawn moments before` && redo[1] === `erased the arrow "sync" ("DB" → "API"), replaced by a new arrow "write" ("API" → "DB")`,
    `changes: something erased right after it was drawn is taken back; an erase then a new one of its kind is a replacement — ${redo.join(" | ")}`);
  const changes = sceneChanges({ events: [
    ev(1, "add", "w", { kind: "rectangle", x: 100, y: 100, w: 160, h: 80 }), ev(1, "add", "wl", { kind: "text", in: "w", text: "Worker" }),
    ev(1, "add", "s", { kind: "rectangle", x: 400, y: 100, w: 160, h: 80 }), ev(1, "add", "sl", { kind: "text", in: "s", text: "Store" }),
    ev(1, "add", "a", { kind: "arrow", from: "w", to: "s", x: 260, y: 140, w: 140, h: 0 }),
    ev(5, "update", "wl", { kind: "text", in: "w", text: "Fetch" }), ev(6, "update", "wl", { kind: "text", in: "w", text: "Fetcher" }),
    ev(9, "add", "p", { kind: "rectangle", x: 100, y: 400, w: 160, h: 80 }), ev(9, "add", "pl", { kind: "text", in: "p", text: "Parser" }),
    ev(12, "update", "a", { kind: "arrow", from: "w", to: "p", x: 180, y: 180, w: 0, h: 220 }),
    ev(14, "update", "s", { kind: "rectangle", x: 400, y: 100, w: 160, h: 80, strokeStyle: "dashed" }),
    ev(16, "update", "p", { kind: "rectangle", x: 600, y: 400, w: 160, h: 80 }),
    ev(20, "delete", "s", { kind: "rectangle" }), ev(20, "delete", "sl", { kind: "text" }),
    ev(22, "restore", "s", { kind: "rectangle", x: 400, y: 100, w: 160, h: 80 }), ev(22, "restore", "sl", { kind: "text", in: "s", text: "Store" }),
  ] }).map((c) => c.text);
  ok(changes.join(" | ") === [`renamed the rectangle "Worker" → "Fetcher"`, `rerouted the arrow ("Fetcher" → "Store") → now ("Fetcher" → "Parser")`, `restyled "Store": plain → dashed`,
    `moved "Parser" (now below "Store")`, `erased the rectangle "Store"`, `brought back "Store" (undo or redo)`].join(" | "),
    `changes: a rename in bursts told once, first name → last; a reroute; a restyle; a move by its new neighbour; an erase and an undo, each once — ${changes.join(" | ")}`);
}

// a scratch repo that keeps a record
const repo = mkdtempSync(join(tmpdir(), "rp-sketch-"));
execFileSync("git", ["init", "-q"], { cwd: repo });
writeFileSync(join(repo, "a.txt"), "x\n");
mkdirSync(join(repo, ".reelplanner")); writeFileSync(join(repo, ".reelplanner", "decisions.json"), "[]\n");
execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "add", "."], { cwd: repo });
execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "init"], { cwd: repo });
const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).trim();

// a stand-in for HyperFrames' `transcribe` (local whisper) and a whisper.cpp for it to be found by: two sentences, the
// second said after the last picture; and an environment with neither, nor any transcription API key
const tools = mkdtempSync(join(tmpdir(), "rp-sketch-tools-"));
// never this machine's ~/.reelplanner (its .env may hold a real OPENROUTER_API_KEY): the runner sets a home of its own,
// and run alone the spec makes one, for itself and every command it starts
process.env.REELPLANNER_HOME ||= join(tools, "home");
const FAKE_HF = join(tools, "fake-hyperframes.mjs");
writeFileSync(FAKE_HF, `import { writeFileSync, mkdirSync, appendFileSync } from "node:fs";
import { join } from "node:path";
const [cmd, ...a] = process.argv.slice(2), val = (f) => a[a.indexOf(f) + 1];
appendFileSync(${JSON.stringify(join(tools, "calls.log"))}, JSON.stringify({ cmd, a }) + "\\n");
if (cmd !== "transcribe") process.exit(2);
mkdirSync(val("--dir"), { recursive: true });
const w = (text, start) => ({ text, start, end: start + 0.08 });
const silent = process.env.FAKE_SILENCE === "1";   // a voice for 3 s, then words made up in the silence after it
writeFileSync(join(val("--dir"), "transcript.json"), JSON.stringify(silent
  ? [w("Jobs", 0.5), w("go", 0.8), w("in", 1.1), w("the", 1.4), w("queue.", 1.7), w("I'm", 5), w("going", 5.5), w("to", 6), w("go", 6.5), w("ahead.", 7)]
  : [w("The", 0.05), w("worker", 0.15), w("polls.", 0.25), w("Then", 30), w("it", 30.1), w("sleeps.", 30.2)]));
`);
const WHISPER = join(tools, "whisper-cli"); writeFileSync(WHISPER, "#!/bin/sh\nexit 0\n"); chmodSync(WHISPER, 0o755);
const clean = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^HYPERFRAMES_/.test(k) && !/_API_KEY$/.test(k)));
// a stand-in for a local model server (Ollama's OpenAI-style API): it lists a text model and a vision one, asks one
// question, then has none
const calls = []; let warmups = 0, slowMs = 0;
const fakeModel = createServer((req, res) => {
  let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
    res.setHeader("content-type", "application/json");
    if (req.url === "/v1/models") return res.end(JSON.stringify({ data: [{ id: "llama3:8b" }, { id: "qwen2.5vl:7b" }] }));
    const j = JSON.parse(body || "{}");
    if (j.messages?.length === 1) { warmups++; return res.end(JSON.stringify({ choices: [{ message: { content: "NONE" } }] })); }   // the warm-up at start
    calls.push({ auth: req.headers.authorization || null, body: j });
    if (slowMs) return setTimeout(() => res.end(JSON.stringify({ choices: [{ message: { content: "A question about a picture long gone?" } }] })), slowMs);
    res.end(JSON.stringify({ choices: [{ message: { content: calls.length === 1 ? "Where does the chunk index live?" : "NONE" } }] }));
  });
});
await new Promise((r) => fakeModel.listen(0, "127.0.0.1", r));
const FAKE_BASE = `http://127.0.0.1:${fakeModel.address().port}/v1`;
const WITH_WHISPER = { ...clean, REELPLANNER_HYPERFRAMES_BIN: FAKE_HF, HYPERFRAMES_WHISPER_PATH: WHISPER, REELPLANNER_SKETCH_PARTNER: "off" };
const NO_WHISPER = { ...clean, HOME: tools, PATH: join(tools, "empty-path"), REELPLANNER_SYSTEM_ROOT: join(tools, "no-system"), REELPLANNER_SKETCH_PARTNER: "off" };
const PARTNER_LOCAL = { ...clean, REELPLANNER_SKETCH_PARTNER: "local", REELPLANNER_SKETCH_BASE_URL: FAKE_BASE, REELPLANNER_SKETCH_PARTNER_GAP_S: "0" };
const run = (args, env) => { try { return { code: 0, out: execFileSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), ...args], { cwd: repo, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };

const port = testPort(8793);
const srv = spawn(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "sketch", "how upload resume works", "--port", String(port), "--no-open"], { cwd: repo, env: PARTNER_LOCAL, stdio: ["ignore", "pipe", "pipe"] });
let said = ""; srv.stdout.on("data", (c) => (said += c));
await serverUp(port, { child: srv, timeout: 120000 });

const b = await chromium.launch(launchOpts({ args: [...launchOpts().args, "--use-fake-ui-for-media-stream", "--use-fake-device-for-media-stream"] }));
try {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  const page = await ctx.newPage();
  const errors = []; page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    // a stand-in recognizer: it hears three sentences in all (across a pause and resume), each first as interim then final
    const lines = ["the upload starts in the client", "it sends each chunk to the API", "a failed chunk is retried"];
    window.SpeechRecognition = class { start() { if (this.on) return; this.on = 1; window.__heard ??= 0;
      const r = (text, fin) => { const x = [{ transcript: text, confidence: 0.9 }]; x.isFinal = fin; return x; };
      const say = () => { if (!this.on || window.__heard >= lines.length) return; const t = lines[window.__heard++];
        this.onresult?.({ resultIndex: 0, results: [r(t, false)] });
        setTimeout(() => { this.onresult?.({ resultIndex: 0, results: [r(t, true)] }); setTimeout(say, 1200); }, 400); };
      setTimeout(say, 400); } stop() { this.on = 0; } };
  });
  await page.goto(`http://127.0.0.1:${port}/`);
  await page.waitForFunction(() => window.reelSketch?.api, null, { timeout: 60000 });
  ok(await page.inputValue("#question") === "how upload resume works", "the question from the command line is filled in");
  ok((await page.textContent("#ctx")).includes(head.slice(0, 7)), `the repo's commit is shown — ${await page.textContent("#ctx")}`);
  ok(await page.isVisible("#partner") && (await page.textContent("#partner-label")).includes("qwen2.5vl:7b on this machine"),
    `the page names the partner, the local server's vision model — ${await page.textContent("#partner-label")}`);

  await page.click("#rec");
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const K = window.ExcalidrawKit, api = window.reelSketch.api;
    api.updateScene({ elements: K.convertToExcalidrawElements([{ type: "rectangle", id: "scratch", x: 40, y: 40, label: { text: "Scratch" } }], { regenerateIds: false }) });
  });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    const K = window.ExcalidrawKit, api = window.reelSketch.api;
    api.updateScene({ elements: K.convertToExcalidrawElements([
      { type: "rectangle", id: "client", x: 120, y: 220, width: 200, height: 90, label: { text: "Client" } },
      { type: "rectangle", id: "api", x: 560, y: 220, width: 200, height: 90, label: { text: "Upload API" } },
      { type: "arrow", x: 320, y: 265, width: 240, height: 0, label: { text: "chunks" }, start: { id: "client" }, end: { id: "api" } },
      { type: "rectangle", id: "ps", x: 120, y: 440, width: 90, height: 70, label: { text: "PaymentService" } },   // too narrow: Excalidraw wraps it
    ], { regenerateIds: false }) });
  });
  await page.waitForTimeout(4200); // the three sentences
  ok(await page.isVisible("#ask") && (await page.textContent("#ask-text")) === "Where does the chunk index live?", `the partner's question is shown beside the canvas — ${await page.textContent("#ask")}`);
  const first = calls[0]?.body, userText = first?.messages?.[1]?.content?.[0]?.text || "";
  ok(first?.model === "qwen2.5vl:7b" && !calls[0].auth && first.messages[1].content.some((c) => c.type === "image_url" && c.image_url.url.startsWith("data:image/png;base64,")),
    "…asked of the local model, with no key, with the picture");
  ok(warmups === 1, `…which was loaded once when the command started — ${warmups}`);
  ok(calls.some((c) => { const t = c.body.messages[1].content[0].text; return t.includes(`"Client" → "Upload API" (labeled "chunks")`) && t.includes("the upload starts in the client") && t.includes("how upload resume works"); }),
    `…and the boxes and arrows as typed, the words, the topic — ${userText.slice(0, 400)}`);
  ok(calls.length >= 2 && calls.slice(1).some((c) => c.body.messages[1].content[0].text.includes("- Where does the chunk index live?")), `…a later picture is asked again, told what it already asked (${calls.length} calls)`);
  await page.mouse.move(220, 265, { steps: 6 }); await page.waitForTimeout(700);   // pointing at Client, then the API
  await page.mouse.move(660, 265, { steps: 6 }); await page.waitForTimeout(700);
  await page.fill("#note", "not sure where the chunk index lives");
  await page.press("#note", "Enter");
  await page.waitForTimeout(800);

  await page.click("#finish");
  await page.waitForSelector("#review.open");
  const c1 = await page.evaluate(() => window.reelSketch.clock()); await page.waitForTimeout(700);
  const c2 = await page.evaluate(() => window.reelSketch.clock());
  ok(c1 === c2, `the clock stops while Finish is open (${c1} then ${c2})`);
  await page.click("#keep"); await page.waitForTimeout(700);
  ok(await page.evaluate(() => window.reelSketch.clock()) > c2, "Keep sketching starts the clock again");
  await page.click("#finish"); await page.waitForSelector("#review.open");
  ok((await page.locator("#transcript p").count()) === 5 && (await page.locator("#transcript p.asked").count()) === 1, "the panel lists the three sentences, the note and the question asked");
  ok((await page.locator("#frames .kf img").count()) >= 3, `a picture at each pause — ${await page.locator("#frames .kf").count()}`);
  await page.fill("#feedback", "guessing on retries");
  await page.click("#send");
  await page.waitForFunction(() => document.querySelector("#sent").style.display === "block", null, { timeout: 60000 });
  ok((await page.textContent("#sent")).includes(".reelplanner/sketches/"), `Send says where it went — ${await page.textContent("#sent")}`);
  ok(!errors.length, `no page errors — ${errors.join(" | ")}`);

  const base = join(repo, ".reelplanner", "sketches"), name = readdirSync(base).find((n) => !n.startsWith("."));
  const dir = join(base, name || "none");
  ok(/^\d{4}-\d{2}-\d{2}-upload-resume-works$/.test(name || ""), `the folder is named by the day and the question — ${name}`);
  for (const f of ["sketch.md", "session.json", "final.excalidraw", "final.png", "recording.webm", "keyframes/kf-001.png"]) ok(existsSync(join(dir, f)), `saved ${f}`);
  ok(readFileSync(join(base, ".gitignore"), "utf8").includes("*/recording.*"), "the recording and pictures are kept out of git");
  const s = JSON.parse(readFileSync(join(dir, "session.json"), "utf8"));
  ok(s.format === "reelplanner-sketch/1" && s.context.commit === head && s.feedback === "guessing on retries", "session.json: format, commit, the note at Send");
  ok(s.transcript.segments.map((x) => x.text).join("|") === "the upload starts in the client|it sends each chunk to the API|a failed chunk is retried", `the transcript, in order — ${JSON.stringify(s.transcript.segments)}`);
  ok(s.transcript.segments.every((x, i, a) => x.t1 >= x.t0 && (!i || x.t0 >= a[i - 1].t1)), "each sentence has a start and an end, in order, on one clock");
  ok(s.keyframes.some((k) => k.said === "the upload starts in the client" && k.file), `a keyframe pairs a picture with what was said — ${JSON.stringify(s.keyframes)}`);
  ok(s.notes.length === 1 && s.notes[0].elementId && s.keyframes.some((k) => k.said.includes("(typed) not sure")), "the typed note is timed, on the canvas, and in a keyframe");
  ok(s.events.some((e) => e.type === "delete" && e.id === "scratch"), "an element replaced out of the scene is a delete");
  ok(s.events.some((e) => e.type === "add" && e.kind === "arrow" && e.from === "client" && e.to === "api"), "the arrow's ends are in its add event");
  ok(s.final.elements.find((e) => e.id === "ps")?.label === "PaymentService" && !s.events.some((e) => /PaymentServic\n/.test(e.text || "")),
    `a label wrapped to fit its box is kept as typed — ${JSON.stringify(s.final.elements.find((e) => e.id === "ps")?.label)}`);
  ok(s.partner?.provider === "local" && s.partner.model === "qwen2.5vl:7b" && s.partner.on === true && s.partner.questions.length === 1
    && s.partner.questions[0].text === "Where does the chunk index live?" && s.partner.questions[0].after_picture >= 1, `session.json keeps the question, after which picture — ${JSON.stringify(s.partner)}`);
  const md = readFileSync(join(dir, "sketch.md"), "utf8");
  ok(md.includes(`"Client" → "Upload API" (labeled "chunks")`) && md.includes("> guessing on retries") && md.includes("not sure where the chunk index lives"), "sketch.md: the arrow by its boxes' labels, the note, the typed text");
  ok(s.pointer.some((p) => p.id === "client") && s.pointer.some((p) => p.id === "api") && /\(typed\) not sure where the chunk index lives _\(pointing at "Client", "Upload API"\)_/.test(md),
    `the pointer resting on a box is kept, and told with what was said then — ${JSON.stringify(s.pointer)} ${md.split("\n").find((l) => /pointing/.test(l))}`);
  ok(/\*\*\d:\d\d\*\* _changed:_ took back the rectangle "Scratch", drawn moments before/.test(md) && /\*\*Where things are\*\*/.test(md), `sketch.md: the box drawn and replaced moments later is told as taken back, in its place; and where things are — ${md.split("\n").filter((l) => /_changed:_/.test(l)).join(" | ")}`);
  ok(/\*\*Questions while sketching:\*\* 1 from qwen2\.5vl:7b on their machine/.test(md) && /\*\*\d:\d\d\*\* _asked:_ Where does the chunk index live\?/.test(md), "sketch.md: who asked, and the question in its place");
  try {
    const probe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type:format=duration", "-of", "json", join(dir, "recording.webm")], { encoding: "utf8" });
    const p = JSON.parse(probe), kinds = p.streams.map((x) => x.codec_type).sort().join();
    ok(kinds === "audio,video" && Number(p.format.duration) > 3, `the recording has the canvas and the voice, with a duration — ${kinds}, ${p.format.duration}`);
  } catch { console.log("· no ffprobe here: the recording's streams are not checked"); }
  ok(said.includes("✓ sketch saved") && said.includes("reelplanner explain"), "the command says where it went and what to run next");
  ok(!said.includes("transcribing"), "with a live transcript, nothing is transcribed after Send");

  // sketch-transcribe: nothing here to do it; then local whisper, in place of the browser's transcript
  const rel = join(".reelplanner", "sketches", name);
  const none = run(["sketch-transcribe", rel], NO_WHISPER);
  ok(none.code === 1 && /nothing here can transcribe it: whisper\.cpp is not installed .*no transcription API key/.test(none.out), `sketch-transcribe with no whisper and no key says so — ${none.out}`);
  const tx = run(["sketch-transcribe", rel], WITH_WHISPER);
  const s2 = JSON.parse(readFileSync(join(dir, "session.json"), "utf8")), md2 = readFileSync(join(dir, "sketch.md"), "utf8");
  ok(tx.code === 0 && /✓ 6 words in 2 sentences \(local whisper small\.en\)/.test(tx.out), `sketch-transcribe runs local whisper — ${tx.out}`);
  ok(s2.transcript.source === "whisper" && s2.transcript.replaced === "browser-speech" && s2.transcript.lang === "en"
    && s2.transcript.segments.map((x) => x.text).join("|") === "The worker polls.|Then it sleeps.", `…its sentences replace the browser's — ${JSON.stringify(s2.transcript)}`);
  ok(s2.keyframes[0].said.startsWith("The worker polls.") && s2.keyframes.some((k) => k.said.includes("(typed) not sure")), `…each picture's words made again, the typed note kept — ${JSON.stringify(s2.keyframes.map((k) => k.said))}`);
  // whisper makes words up in silence: a sentence wholly in it is dropped, a real one kept whole
  const quiet = join(repo, "quiet"); mkdirSync(quiet);
  execFileSync("ffmpeg", ["-v", "error", "-f", "lavfi", "-i", "sine=frequency=300:duration=3", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono", "-filter_complex", "[1]atrim=duration=6[s];[0][s]concat=n=2:v=0:a=1", "-c:a", "libopus", join(quiet, "recording.webm")]);
  writeFileSync(join(quiet, "session.json"), JSON.stringify({ format: "reelplanner-sketch/1", question: "q", recording: { file: "recording.webm", has_audio: true }, transcript: { source: "none", lang: "en-US", segments: [] }, notes: [], keyframes: [{ n: 1, t: 2.5, said: "" }, { n: 2, t: 8.5, said: "" }], events: [], final: { elements: [] } }));
  const q = run(["sketch-transcribe", "quiet"], { ...WITH_WHISPER, FAKE_SILENCE: "1" }), qs = JSON.parse(readFileSync(join(quiet, "session.json"), "utf8"));
  ok(q.code === 0 && qs.transcript.segments.map((x) => x.text).join("|") === "Jobs go in the queue." && qs.transcript.dropped_in_silence === 5 && qs.keyframes[0].said === "Jobs go in the queue." && qs.keyframes[1].said === "",
    `words made up in silence are dropped; the real sentence is kept, with its picture — ${JSON.stringify(qs.transcript)} ${q.out}`);
  ok(md2.includes("**Transcript:** local whisper small.en, from the recording") && /\*\*0:30\*\* Then it sleeps\. _\(said after the last picture\)_/.test(md2), "…and sketch.md says where its words came from, and what was said after the last picture");

  // Download: the same folder as a .zip, from a fresh page
  const p2 = await ctx.newPage(); await p2.goto(`http://127.0.0.1:${port}/`); await p2.waitForFunction(() => window.reelSketch?.api);
  await p2.click("#rec"); await p2.waitForTimeout(400); await p2.click("#finish"); await p2.waitForSelector("#review.open");
  const dl = p2.waitForEvent("download"); await p2.click("#download");
  const zip = join(repo, "dl.zip"); await (await dl).saveAs(zip);
  const bytes = readFileSync(zip);
  ok(bytes.readUInt32LE(0) === 0x04034b50 && bytes.includes(Buffer.from("/session.json")) && bytes.includes(Buffer.from("/recording.webm")), "Download gives a .zip of the folder");
  ok(srv.exitCode == null, "without --once the command stays up after Send");

  // --once with no question, in a browser with no recognizer: the box starts empty; after Send local whisper makes the
  // transcript, then the command exits 0, its last line the folder
  const port2 = testPort(8794, 1);
  const once = spawn(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "sketch", "--once", "--port", String(port2), "--no-open"], { cwd: repo, env: WITH_WHISPER, stdio: ["ignore", "pipe", "pipe"] });
  let out2 = ""; once.stdout.on("data", (c) => (out2 += c));
  const exited = new Promise((r) => once.on("exit", (code) => r(code)));
  await serverUp(port2, { child: once, timeout: 60000 });
  const p3 = await ctx.newPage(); await p3.addInitScript(() => { delete window.SpeechRecognition; delete window.webkitSpeechRecognition; });
  await p3.goto(`http://127.0.0.1:${port2}/`); await p3.waitForFunction(() => window.reelSketch?.api);
  ok(await p3.inputValue("#question") === "", "with no question given, the box starts empty");
  ok(!(await p3.isVisible("#partner")), "partner off: no switch on the page");
  await p3.click("#rec"); await p3.waitForTimeout(400);
  await p3.evaluate(() => { window.reelSketch.api.updateScene({ elements: window.ExcalidrawKit.convertToExcalidrawElements([{ type: "rectangle", x: 50, y: 50, label: { text: "Worker" } }]) }); });
  await p3.waitForTimeout(400);
  await p3.click("#finish"); await p3.waitForSelector("#review.open"); await p3.click("#send");
  await p3.waitForFunction(() => document.querySelector("#sent").style.display === "block", null, { timeout: 60000 });
  ok((await p3.textContent("#sent")).includes("you can close this tab") && (await p3.textContent("#sent")).includes("transcribed on this machine (local whisper small.en)"),
    `the page says the agent has it, and that the voice is being transcribed — ${await p3.textContent("#sent")}`);
  await p3.close();   // gone before the command exits: Send was made, so this is not "closed without Send"
  const code = await Promise.race([exited, new Promise((r) => setTimeout(() => r("still running"), 30000))]);
  const last = out2.trim().split("\n").pop();
  ok(code === 0, `--once exits after Send — ${code}`);
  ok(/^sketch: \.reelplanner\/sketches\/\d{4}-\d{2}-\d{2}-sketch$/.test(last) && existsSync(join(repo, last.slice("sketch: ".length), "sketch.md")),
    `its last line names the folder, "sketch" when no question was given — ${last}`);
  if (once.exitCode == null) once.kill();
  const s3 = JSON.parse(readFileSync(join(repo, last.slice("sketch: ".length), "session.json"), "utf8"));
  ok(s3.transcript.source === "whisper" && s3.transcript.segments.length === 2 && !s3.transcript.replaced && s3.keyframes.some((k) => k.said.startsWith("The worker polls.")),
    `with no live transcript, local whisper made one before that line — ${JSON.stringify(s3.transcript)} ${JSON.stringify(s3.keyframes)}`);
  ok(out2.indexOf("✓ 6 words") >= 0 && out2.indexOf("✓ 6 words") < out2.lastIndexOf("sketch: "), "…and said so before it");

  // --once, the page reloaded (stays up) and then closed without Send (exits 1, says so); and no page at all
  const port3 = testPort(8795, 2);
  const shut = spawn(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "sketch", "x", "--once", "--port", String(port3), "--no-open"], { cwd: repo, env: { ...WITH_WHISPER, REELPLANNER_SKETCH_GRACE_S: "3" }, stdio: ["ignore", "pipe", "pipe"] });
  let out3 = ""; shut.stdout.on("data", (c) => (out3 += c)); shut.stderr.on("data", (c) => (out3 += c));
  const shutExit = new Promise((r) => shut.on("exit", (c) => r(c)));
  await serverUp(port3, { child: shut, timeout: 60000 });
  const p4 = await ctx.newPage(); await p4.goto(`http://127.0.0.1:${port3}/`); await p4.waitForFunction(() => window.reelSketch?.api);
  await p4.reload(); await p4.waitForFunction(() => window.reelSketch?.api); await p4.waitForTimeout(3500);
  ok(shut.exitCode == null, "--once: a reload is not a close");
  const closedAt = Date.now(); await p4.close();
  const shutCode = await Promise.race([shutExit, new Promise((r) => setTimeout(() => r("still running"), 15000))]);
  ok(shutCode === 1 && /✗ sketch: the page was closed without Send; nothing was saved/.test(out3) && !/^sketch: /m.test(out3),
    `--once: the page closed without Send, it exits 1 and says so (${Math.round((Date.now() - closedAt) / 100) / 10} s) — ${shutCode} ${out3}`);
  if (shut.exitCode == null) shut.kill();
  const lone = run(["sketch", "--once", "--port", String(testPort(8796, 3)), "--no-open"], { ...WITH_WHISPER, REELPLANNER_SKETCH_OPEN_WAIT_S: "1" });
  ok(lone.code === 1 && /✗ sketch: no page opened in 1 s/.test(lone.out), `--once: no page opened, it exits 1 — ${lone.out}`);

  // a partner too slow to keep up (a local model on a busy CPU): an answer later than stale_s is not shown, and after
  // two the questions stop for this sketch
  slowMs = 1600;
  const port5 = testPort(8798, 5);
  const slow = spawn(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), "sketch", "x", "--port", String(port5), "--no-open"], { cwd: repo, env: { ...PARTNER_LOCAL, REELPLANNER_SKETCH_PARTNER_STALE_S: "1" }, stdio: "ignore" });
  await serverUp(port5, { child: slow, timeout: 60000 });
  const p5 = await ctx.newPage(); await p5.addInitScript(() => { delete window.SpeechRecognition; delete window.webkitSpeechRecognition; });
  await p5.goto(`http://127.0.0.1:${port5}/`); await p5.waitForFunction(() => window.reelSketch?.api);
  await p5.click("#rec"); await p5.waitForTimeout(300);
  await p5.evaluate(() => { window.reelSketch.api.updateScene({ elements: window.ExcalidrawKit.convertToExcalidrawElements([{ type: "rectangle", x: 50, y: 50, label: { text: "Queue" } }]) }); });
  await p5.fill("#note", "the queue holds jobs"); await p5.press("#note", "Enter");
  await p5.waitForFunction(() => /not shown/.test(document.querySelector("#status").textContent), null, { timeout: 20000 });
  ok(!(await p5.isVisible("#ask")) && /took \d+ s to ask \(about an earlier picture\): not shown/.test(await p5.textContent("#status")), `a late answer is not shown, and the page says why — ${await p5.textContent("#status")}`);
  await p5.fill("#note", "workers pull from it"); await p5.press("#note", "Enter");
  await p5.waitForFunction(() => /questions are off/.test(document.querySelector("#status").textContent), null, { timeout: 20000 });
  ok(!(await p5.isChecked("#partner-on")) && !(await p5.isVisible("#ask")), `…after two, the questions stop for this sketch — ${await p5.textContent("#status")}`);
  slow.kill(); await p5.close(); slowMs = 0;

  // OpenRouter, by default when its key is set: the recommended model, the key sent; a partner named that can't run says why
  const or = await resolvePartner({ dir: repo, env: { OPENROUTER_API_KEY: "k-test", REELPLANNER_SKETCH_BASE_URL: FAKE_BASE } });
  ok(or.provider === "openrouter" && or.model === RECOMMENDED && RECOMMENDED === "anthropic/claude-sonnet-5.5", `auto with OPENROUTER_API_KEY: OpenRouter, ${RECOMMENDED} — ${JSON.stringify(or)}`);
  process.env.OPENROUTER_API_KEY = "k-test"; calls.length = 1;   // the stand-in's next answer is NONE
  const none2 = await askPartner(or, { question: "q", elements: [], said: [], asked: [] });
  ok(none2 === null && calls[1]?.auth === "Bearer k-test" && calls[1].body.model === RECOMMENDED, `…the key goes with the request, and NONE is no question — ${JSON.stringify(calls[1]?.auth)}`);
  delete process.env.OPENROUTER_API_KEY;
  const named = run(["sketch", "--partner", "openrouter", "--no-open", "--port", String(testPort(8797, 4))], { ...clean, REELPLANNER_SKETCH_PARTNER: "" });
  ok(named.code === 1 && /partner openrouter needs OPENROUTER_API_KEY/.test(named.out), `--partner openrouter with no key says so — ${named.out}`);
} finally {
  fakeModel.close();
  await b.close(); srv.kill(); rmSync(repo, { recursive: true, force: true }); rmSync(tools, { recursive: true, force: true });
}
if (fails.length) { console.log(`\n${fails.length} failed`); process.exit(1); }
console.log("\nall passed");
