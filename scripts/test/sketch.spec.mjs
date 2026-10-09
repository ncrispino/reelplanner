#!/usr/bin/env node
// The sketch page (`reelplanning sketch`, docs/sketch.md), end to end in a headless browser with a fake microphone and
// a stand-in speech recognizer:
//   - the page loads its Excalidraw from the machine's vendor build, with the question and the repo's commit shown
//   - recording composes the canvas with the voice: a webm with a video and an audio stream, seekable (ffmpeg's copy)
//   - each spoken sentence ends a keyframe, paired with what was said; a typed note is timed, said, and on the canvas
//   - edits are events on the recording's clock; an element that leaves the scene is a delete
//   - Finish pauses the clock (and the recording); Keep sketching resumes it
//   - Send saves the folder: sketch.md (boxes, the arrow between them by label, the note), session.json, the
//     scene, the pictures; in a repo with a record, under .reelplanning/sketches/, with a .gitignore for the media
//   - Download gives the same folder as a .zip
// usage: node scripts/test/sketch.spec.mjs
import { chromium } from "playwright-core";
import { spawn, execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { launchOpts, testPort, serverUp, ROOT } from "../lib/env.mjs";
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };

// a scratch repo that keeps a record
const repo = mkdtempSync(join(tmpdir(), "rp-sketch-"));
execFileSync("git", ["init", "-q"], { cwd: repo });
writeFileSync(join(repo, "a.txt"), "x\n");
mkdirSync(join(repo, ".reelplanning")); writeFileSync(join(repo, ".reelplanning", "decisions.json"), "[]\n");
execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "add", "."], { cwd: repo });
execFileSync("git", ["-c", "user.email=t@t", "-c", "user.name=t", "commit", "-qm", "init"], { cwd: repo });
const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).trim();

const port = testPort(8793);
const srv = spawn(process.execPath, [join(ROOT, "bin", "reelplanning.mjs"), "sketch", "how upload resume works", "--port", String(port), "--no-open"], { cwd: repo, stdio: ["ignore", "pipe", "pipe"] });
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
    ], { regenerateIds: false }) });
  });
  await page.waitForTimeout(4200); // the three sentences
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
  ok((await page.locator("#transcript p").count()) === 4, "the panel lists the three sentences and the note");
  ok((await page.locator("#frames .kf img").count()) >= 3, `a picture at each pause — ${await page.locator("#frames .kf").count()}`);
  await page.fill("#feedback", "guessing on retries");
  await page.click("#send");
  await page.waitForFunction(() => document.querySelector("#sent").style.display === "block", null, { timeout: 60000 });
  ok((await page.textContent("#sent")).includes(".reelplanning/sketches/"), `Send says where it went — ${await page.textContent("#sent")}`);
  ok(!errors.length, `no page errors — ${errors.join(" | ")}`);

  const base = join(repo, ".reelplanning", "sketches"), name = readdirSync(base).find((n) => !n.startsWith("."));
  const dir = join(base, name || "none");
  ok(/^\d{4}-\d{2}-\d{2}-upload-resume-works$/.test(name || ""), `the folder is named by the day and the question — ${name}`);
  for (const f of ["sketch.md", "session.json", "final.excalidraw", "final.png", "recording.webm", "keyframes/kf-001.png"]) ok(existsSync(join(dir, f)), `saved ${f}`);
  ok(readFileSync(join(base, ".gitignore"), "utf8").includes("*/recording.*"), "the recording and pictures are kept out of git");
  const s = JSON.parse(readFileSync(join(dir, "session.json"), "utf8"));
  ok(s.format === "reelplanning-sketch/1" && s.context.commit === head && s.feedback === "guessing on retries", "session.json: format, commit, the note at Send");
  ok(s.transcript.segments.map((x) => x.text).join("|") === "the upload starts in the client|it sends each chunk to the API|a failed chunk is retried", `the transcript, in order — ${JSON.stringify(s.transcript.segments)}`);
  ok(s.transcript.segments.every((x, i, a) => x.t1 >= x.t0 && (!i || x.t0 >= a[i - 1].t1)), "each sentence has a start and an end, in order, on one clock");
  ok(s.keyframes.some((k) => k.said === "the upload starts in the client" && k.file), `a keyframe pairs a picture with what was said — ${JSON.stringify(s.keyframes)}`);
  ok(s.notes.length === 1 && s.notes[0].elementId && s.keyframes.some((k) => k.said.includes("(typed) not sure")), "the typed note is timed, on the canvas, and in a keyframe");
  ok(s.events.some((e) => e.type === "delete" && e.id === "scratch"), "an element replaced out of the scene is a delete");
  ok(s.events.some((e) => e.type === "add" && e.kind === "arrow" && e.from === "client" && e.to === "api"), "the arrow's ends are in its add event");
  const md = readFileSync(join(dir, "sketch.md"), "utf8");
  ok(md.includes(`"Client" → "Upload API" (labeled "chunks")`) && md.includes("> guessing on retries") && md.includes("not sure where the chunk index lives"), "sketch.md: the arrow by its boxes' labels, the note, the typed text");
  try {
    const probe = execFileSync("ffprobe", ["-v", "error", "-show_entries", "stream=codec_type:format=duration", "-of", "json", join(dir, "recording.webm")], { encoding: "utf8" });
    const p = JSON.parse(probe), kinds = p.streams.map((x) => x.codec_type).sort().join();
    ok(kinds === "audio,video" && Number(p.format.duration) > 3, `the recording has the canvas and the voice, with a duration — ${kinds}, ${p.format.duration}`);
  } catch { console.log("· no ffprobe here: the recording's streams are not checked"); }
  ok(said.includes("✓ sketch saved") && said.includes("reelplanning explain"), "the command says where it went and what to run next");

  // Download: the same folder as a .zip, from a fresh page
  const p2 = await ctx.newPage(); await p2.goto(`http://127.0.0.1:${port}/`); await p2.waitForFunction(() => window.reelSketch?.api);
  await p2.click("#rec"); await p2.waitForTimeout(400); await p2.click("#finish"); await p2.waitForSelector("#review.open");
  const dl = p2.waitForEvent("download"); await p2.click("#download");
  const zip = join(repo, "dl.zip"); await (await dl).saveAs(zip);
  const bytes = readFileSync(zip);
  ok(bytes.readUInt32LE(0) === 0x04034b50 && bytes.includes(Buffer.from("/session.json")) && bytes.includes(Buffer.from("/recording.webm")), "Download gives a .zip of the folder");
} finally {
  await b.close(); srv.kill(); rmSync(repo, { recursive: true, force: true });
}
if (fails.length) { console.log(`\n${fails.length} failed`); process.exit(1); }
console.log("\nall passed");
