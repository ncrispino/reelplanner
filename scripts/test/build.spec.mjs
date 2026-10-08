#!/usr/bin/env node
// `reelplanning build <video-dir>` (and `reel build`): the chain after the frames are written, one line
// a stage with its time, stopping at the first failure (revise-loop step 9, D-085). Against a scratch
// project and a fake audio engine (REELPLANNING_TTS_ENGINE, as narrate.spec), under the real
// faceless-explainer audio.mjs, so no Kokoro or whisper runs. The scratch frames are not a finished
// HyperFrames project, so finish-project stops the build: that is the "first failure" here, and verify
// never runs after it.
//   - a first build: every stage up to finish-project passes in order; retime-frames is skipped (the
//     frames were written against these words)
//   - one edited line whose frame calls something retime-frames does not recognise: the build stops at
//     retime-frames with its message, and nothing after it runs
//   - the same build again with the --ignore it asked for: that frame is retimed now (the narration it
//     was timed to is kept across the stop), and only that frame
//   - again, unchanged: nothing narrated, retime-frames skipped, no frame moved a second time
//   - a line inserted with nothing committed to pair frames by: retime-frames skipped with a warning
//   - `reel build` runs the same command
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { videoLength, lengthLine, mmss } from "../lib/length.mjs";
import { skillsDir } from "../hyperframes-skills.mjs";

const tmp = mkdtempSync(join(tmpdir(), "rp-build-spec-"));
const P = join(tmp, "video"), ENGINE = join(tmp, "fake-engine.mjs"), LOG = join(tmp, "tts.log");
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2000)}` : ""}`); if (!cond) failed++; };
if (!existsSync(join(skillsDir(), "faceless-explainer", "scripts", "audio.mjs"))) { console.error("✗ build.spec needs HyperFrames' faceless-explainer skill — run `reelplanning hyperframes-skills`"); process.exit(1); }

// the fake engine: voices each requested line (bytes differ every call), and for `--only sfx` keeps the
// sidecar as it is with no sfx, as the real engine's merge does for a storyboard with no sfx: cues
writeFileSync(ENGINE, `
import { readFileSync, writeFileSync, mkdirSync, appendFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
const a = process.argv.slice(2), f = (n) => a[a.indexOf("--" + n) + 1];
const req = JSON.parse(readFileSync(f("request"), "utf8")), dir = f("hyperframes"), out = f("out");
if (f("only") === "sfx") { const m = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : { voices: [] }; m.sfx = []; writeFileSync(out, JSON.stringify(m, null, 2)); process.exit(0); }
const voices = [];
for (const l of req.lines) {
  const path = "assets/voice/" + l.id + ".wav", words = l.text.split(/\\s+/).map((t, i) => ({ id: "w" + i, text: t.replace(/[^\\w'-]/g, "").toLowerCase(), start: +(i * 0.3).toFixed(2), end: +(i * 0.3 + 0.25).toFixed(2) }));
  mkdirSync(join(dir, "assets/voice"), { recursive: true });
  writeFileSync(join(dir, path), "RIFF-fake " + l.id + " " + l.text + " " + process.hrtime.bigint());
  appendFileSync(process.env.FAKE_TTS_LOG, l.id + "\\n");
  voices.push({ id: l.id, path, duration_s: +(words.length * 0.3 + 0.2).toFixed(3), words });
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ tts_provider: "fake", voice_id: req.voice || "am_michael", bgm: null, bgm_pending: false, voices, sfx: [], total_duration_s: 1 }, null, 2));
`);

const LINES = ["An agent hands you its plan, and you approve it.", "reelplanning turns that plan into a short narrated video.", "Each plan gets two videos, one before the code and one after."];
const script = (lines) => `# SCRIPT\n\n**Voice:** am_michael\n\n---\n\n${lines.map((t, i) => `## Line ${i + 1} — beat (Frame ${i + 1})\n\n**Delivery:** Plain.\n\n    ${t}\n`).join("\n")}`;
// `plain: agent`: these beats are about the build's stages, not their words (D-216 would ask for its meaning)
const storyboard = (ids) => `---\ntitle: test\nplain: agent\nmusic: none\n---\n\n${ids.map((id, i) => `## Frame ${i + 1} — beat ${i + 1}\n\n- src: compositions/frames/${id}.html\n- duration: 5s\n`).join("\n")}`;
// frame 2 also calls `wiggle(el, 1.2)`, a project helper retime-frames cannot tell a time from a length in
const frame = (id) => `<div data-composition-id="f-${id}"><script>const tl = gsap.timeline({ paused: true }); tl.to("#a", { opacity: 1 }, 0.9); tl.to("#b", { opacity: 1 }, 1.8);${id === "02-beat" ? " wiggle(el, 1.2);" : ""}</script></div>`;
const env = { ...process.env, REELPLANNING_TTS_ENGINE: ENGINE, FAKE_TTS_LOG: LOG };
const build = (...a) => {
  writeFileSync(LOG, "");
  let r; try { r = { code: 0, out: execFileSync("node", [join(ROOT, "scripts", "build.mjs"), P, ...a], { encoding: "utf8", env, cwd: tmp, stdio: ["ignore", "pipe", "pipe"] }) }; }
  catch (e) { r = { code: e.status, out: `${e.stdout}${e.stderr}` }; }
  return { ...r, voiced: readFileSync(LOG, "utf8").split("\n").filter(Boolean), stages: [...r.out.matchAll(/^([✓✗·△]) (\S+) +(\d+\.\d) s /gm)].map((m) => `${m[1]}${m[2]}`) };
};
const read = (f) => readFileSync(join(P, f), "utf8");
const PENDING = join(P, ".hyperframes", "frames-timed-to.json");

try {
  mkdirSync(join(P, "compositions", "frames"), { recursive: true });
  const ids = ["01-beat", "02-beat", "03-beat"];
  writeFileSync(join(P, "SCRIPT.md"), script(LINES)); writeFileSync(join(P, "STORYBOARD.md"), storyboard(ids));
  for (const id of ids) writeFileSync(join(P, "compositions", "frames", `${id}.html`), frame(id));

  const b1 = build();
  ok("a first build: one line per stage with its time, in order, up to the first failure", b1.code === 1
    && b1.stages.join() === "✓check-terms,·check-sources,✓narrate,✓fetch-sfx,✓transcribe-missing,✓sync-durations,✓hold-durations,·retime-frames,✗finish-project" && b1.voiced.join() === "01,02,03", b1.out);
  ok("…check-sources is skipped for a video that is no explainer and names no source, and says why", /· check-sources +\d+\.\d s +skipped: nothing to check \(not an explainer/.test(b1.out), b1.out);
  ok("…retime-frames is skipped on a first narration, and says why", /· retime-frames +\d+\.\d s +skipped: a first narration/.test(b1.out), b1.out);
  ok("…the failing stage says what it said, and verify never runs", /✗ finish-project .*stopped here[\s\S]*assemble-index/.test(b1.out) && !/verify/.test(b1.out), b1.out);
  ok("…every stage really ran: durations synced to the voice", /- duration: 3\.2s/.test(read("STORYBOARD.md")) && !/- duration: 5s/.test(read("STORYBOARD.md")) && !existsSync(PENDING), read("STORYBOARD.md"));

  // one line edited: its frame is the one with the unrecognised call
  const f2 = read("compositions/frames/02-beat.html"), f1 = read("compositions/frames/01-beat.html");
  writeFileSync(join(P, "SCRIPT.md"), script([LINES[0], "reelplanning turns that plan into a short narrated video that you review by watching.", LINES[2]]));
  const b2 = build();
  ok("an edited line: only it is narrated, and retime-frames stops the build with its own message", b2.code === 1 && b2.voiced.join() === "02"
    && b2.stages.join() === "✓check-terms,·check-sources,✓narrate,✓fetch-sfx,✓transcribe-missing,✓sync-durations,✓hold-durations,✗retime-frames" && /wiggle\(… 1\.2\)/.test(b2.out) && /--ignore <name,…>/.test(b2.out), b2.out);
  ok("…nothing after it ran, no frame was written, and what the frames are timed to is kept for the next run", !/finish-project/.test(b2.out) && read("compositions/frames/02-beat.html") === f2 && existsSync(PENDING), b2.out);

  const b3 = build("--ignore", "wiggle");
  const f2b = read("compositions/frames/02-beat.html");
  ok("run again with --ignore: nothing narrated, yet the edited frame is retimed now, and only it", b3.voiced.length === 0 && b3.stages.slice(0, 9).join() === "✓check-terms,·check-sources,✓narrate,✓fetch-sfx,✓transcribe-missing,✓sync-durations,✓hold-durations,✓retime-frames,✗finish-project"
    && /1 frame\(s\) retimed, 2 unchanged/.test(b3.out) && f2b !== f2 && /wiggle\(el, 1\.2\)/.test(f2b) && read("compositions/frames/01-beat.html") === f1 && !existsSync(PENDING), b3.out);
  const b4 = build("--ignore", "wiggle");
  ok("and again, unchanged: retime-frames is skipped, no frame moves a second time", /· retime-frames +\d+\.\d s +skipped: no line changed/.test(b4.out) && read("compositions/frames/02-beat.html") === f2b, b4.out);

  // a line inserted: the frames renumber, and outside git there is nothing to pair them by
  writeFileSync(join(P, "SCRIPT.md"), script([LINES[0], "A new beat, inserted second.", "reelplanning turns that plan into a short narrated video that you review by watching.", LINES[2]]));
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(["01-beat", "01b-beat", "02-beat", "03-beat"]));
  writeFileSync(join(P, "compositions", "frames", "01b-beat.html"), frame("01b-beat"));
  const b5 = build("--ignore", "wiggle");
  ok("an inserted line, nothing committed: only it is narrated; retime-frames is skipped with a warning, and the build goes on", b5.voiced.join() === "02" && /△ retime-frames +\d+\.\d s +skipped: frames renumbered/.test(b5.out) && /✗ finish-project/.test(b5.out) && read("compositions/frames/02-beat.html") === f2b, b5.out);

  let rb; try { rb = execFileSync("node", [join(ROOT, "scripts", "reel.mjs"), "build", P], { encoding: "utf8", env, stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { rb = `${e.stdout}${e.stderr}`; }
  ok("reel build runs the same build", /^build /m.test(rb) && /✓ narrate +\d+\.\d s/.test(rb) && /✗ finish-project/.test(rb), rb);
  // check-terms (accessible videos): a word said before it is defined is a △ line and the build goes on;
  // an id said alone, on a storyboard with `terms_check: strict`, stops the build before any voice
  const P2 = join(tmp, "terms"); mkdirSync(join(P2, "compositions", "frames"), { recursive: true });
  writeFileSync(join(P2, "compositions", "frames", "01-beat.html"), frame("01-beat"));
  const tb = (fm, line) => { writeFileSync(join(P2, "SCRIPT.md"), script([line])); writeFileSync(join(P2, "STORYBOARD.md"), storyboard(["01-beat"]).replace("music: none\n", `music: none\n${fm}`)); writeFileSync(LOG, "");
    let out; try { out = execFileSync("node", [join(ROOT, "scripts", "build.mjs"), P2], { encoding: "utf8", env, cwd: tmp, stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { out = `${e.stdout}${e.stderr}`; } return { out, voiced: readFileSync(LOG, "utf8").split("\n").filter(Boolean) }; };
  const t1 = tb("", "Every tag the agent puts on a call stops the video.");
  ok("check-terms: a word before its definition is a △ line of its own, and the build goes on", /^△ check-terms +\d+\.\d s +terms: 1 word before its definition/m.test(t1.out) && /^✓ narrate/m.test(t1.out) && t1.voiced.join() === "01", t1.out);
  const t2 = tb("terms_check: strict\n", "That is why D-056 stays.");
  ok("check-terms: an id alone on a strict storyboard stops the build before narrate", /^✗ check-terms .*stopped here[\s\S]*D-056 alone/m.test(t2.out) && !/narrate/.test(t2.out) && !t2.voiced.length, t2.out);
  const t3 = tb("terms_check: strict\n", "That is why decision D-056 stays.");
  ok("…and passes once the sentence says what it is", /^✓ check-terms /m.test(t3.out), t3.out);
  let usage; try { execFileSync("node", [join(ROOT, "scripts", "build.mjs")], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { usage = `${e.stdout}${e.stderr}`; }
  ok("no video folder: the usage, and a failure", /usage: reelplanning build <video-dir>/.test(usage || ""), usage);
  // the length against its budget (style guide §1): a plan video's minutes, a walkthrough's, the system video's own
  const lenDir = (sub, beats, fm = "") => { const d = join(tmp, "len", sub); mkdirSync(d, { recursive: true }); writeFileSync(join(d, "STORYBOARD.md"), `---\ntitle: t\n${fm}---\n\n` + beats.map((s, i) => `## Frame ${i + 1}\n\n- duration: ${s}s\n`).join("\n")); return d; };
  const four = videoLength(lenDir("plan/video", [60, 60, 60, 60])), eight = videoLength(lenDir("plan/walkthrough-video", Array(8).fill(60))), sys = videoLength(lenDir("system-video", Array(9).fill(60), "kind: system\n"));
  ok("length: mm:ss rounds the whole length, never \"4:60\" — 299.9 s is 5:00, 59.5 s is 1:00", mmss(299.9) === "5:00" && mmss(59.5) === "1:00" && mmss(240) === "4:00", `${mmss(299.9)} ${mmss(59.5)}`);
  ok("length: a 4-minute plan video is in its budget", four.kind === "plan" && four.verdict === "ok" && /^4:00 \(a plan video: aim 3–5 min\)$/.test(lengthLine(four)), lengthLine(four));
  ok("length: an 8-minute walkthrough is too long", eight.kind === "walkthrough" && eight.verdict === "over" && /too long for a walkthrough video \(aim 1–2 min, never past 5\)/.test(lengthLine(eight)), lengthLine(eight));
  // walkthroughs-that-help step 1: the change running, about two minutes; past 3 the build says it is long
  const two = videoLength(lenDir("plan2/walkthrough-video", [60, 50])), four2 = videoLength(lenDir("plan3/walkthrough-video", [60, 60, 60, 20]));
  ok("length: a 1:50 walkthrough is in its budget", two.kind === "walkthrough" && two.verdict === "ok" && /^1:50 \(a walkthrough video: aim 1–2 min\)$/.test(lengthLine(two)), lengthLine(two));
  ok("length: a 3:20 walkthrough is long", four2.verdict === "long" && /long for a walkthrough video \(aim 1–2 min; past 3 is long\)/.test(lengthLine(four2)), lengthLine(four2));
  ok("length: a 9-minute system video is past its aim but not long", sys.kind === "system" && sys.verdict === "ok" && /past it/.test(lengthLine(sys)), lengthLine(sys));
  ok("length: this repo's m3 walkthrough (14.6 min) is too long", videoLength(join(ROOT, ".reelplanning/plans/2026-09-22-m3-revise-loop/walkthrough-video")).verdict === "over");
  // hold-durations: a hold is a floor; holds.json's "tail" is a pause after every line (the system video's 0.8 s)
  { const d = join(tmp, "holds"); mkdirSync(join(d, ".hyperframes"), { recursive: true });
    writeFileSync(join(d, "STORYBOARD.md"), [1, 2, 3].map((n) => `## Frame ${n} — b${n}\n\n- duration: 1s\n`).join("\n"));
    writeFileSync(join(d, "audio_meta.json"), JSON.stringify({ voices: [{ frame: 1, duration_s: 4 }, { frame: 2, duration_s: 6 }, { frame: 3, duration_s: 9 }] }));
    const hold = (h) => { writeFileSync(join(d, ".hyperframes", "holds.json"), JSON.stringify(h)); for (const n of [1, 2, 3]) writeFileSync(join(d, "STORYBOARD.md"), read2(d).replace(new RegExp(`(## Frame ${n} —[^\\n]*\\n\\n- duration: )[^\\n]*`), `$1${[4, 6, 9][n - 1]}s`)); const out = execFileSync("node", [join(ROOT, "scripts", "hold-durations.mjs"), d], { encoding: "utf8" }); return { out, durs: [...read2(d).matchAll(/- duration: ([\d.]+)s/g)].map((m) => Number(m[1])) }; };
    const read2 = (x) => readFileSync(join(x, "STORYBOARD.md"), "utf8");
    const h1 = hold({ 2: 8, 3: 5 });
    ok("hold-durations: a hold is a floor, and a line that outgrew its hold keeps the line and 0.4 s", h1.durs.join() === "4,8,9.4", `${h1.durs}\n${h1.out}`);
    const h2 = hold({ tail: 0.8, 2: 8, 3: 5 });
    ok("hold-durations: \"tail\" adds 0.8 s after every line; a hold still holds when it is longer", h2.durs.join() === "4.8,8,9.8" && /0\.8 s after every line/.test(h2.out), `${h2.durs}\n${h2.out}`); }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ build: one command, a line a stage, stops at the first failure");
process.exit(failed ? 1 : 0);
