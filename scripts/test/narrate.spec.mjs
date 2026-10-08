#!/usr/bin/env node
// `reelplanning narrate` voices only the lines that changed (M3 revise loop, step 1), against a small
// scratch project and a fake TTS: REELPLANNING_TTS_ENGINE stands in for media-use's audio engine,
// under the REAL faceless-explainer audio.mjs, so no Kokoro or whisper runs. The fake writes a
// different wav every time it voices a line, so a byte-identical file can only have been kept.
//   - a first run voices every line; the outputs have the shapes the next scripts read
//   - a second run voices nothing and changes no byte
//   - one edited line: only it is voiced, the others kept byte for byte
//   - a line inserted in the middle: only it is voiced, the rest move to their new frames unchanged
//   - a voice file changed behind narrate's back is voiced again; a new speed re-voices every line
//   - a run killed part way (its whole process group, as a container restart or a timeout kills it):
//     the next run voices only the lines it did not finish, and comes out as a clean run would
//   - build keeps the voice the video was narrated with (it passes no --voice)
//   - a project narrated before the record existed is adopted from git
//   - a project committed as mp3 (a worked example under videos/: no .wav in a clone, D-305) keeps its lines
//     from the mp3 and writes a newly voiced line as mp3
//   - the downstream scripts accept what it writes: transcribe-missing, sync-durations,
//     hold-durations, retime-frames (only the edited frame moves), captions build
//   - the cost line reel status and spec-diff print counts lines to narrate
//   - written and said (lib/say.mjs): a line that writes `claude -p`, `plan.md`, `/work` is handed to the
//     voice as "claude dash p", "plan dot md", "slash work" and keyed on that; a line with none keeps the
//     key it always had (every committed narration record in this repo); a script moved from the spoken
//     form to the written one keeps its audio; a line voiced as written before narrate said it is kept
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync, cpSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { skillsDir } from "../hyperframes-skills.mjs";
import { narrationCost, costSentence, parseScript, lineKey } from "../lib/narration.mjs";
import { say } from "../lib/say.mjs";

const tmp = mkdtempSync(join(tmpdir(), "rp-narrate-spec-"));
const P = join(tmp, "video"), LOG = join(tmp, "tts.log"), ENGINE = join(tmp, "fake-engine.mjs");
const ADAPTER = join(skillsDir(), "faceless-explainer", "scripts", "audio.mjs");
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
if (!existsSync(ADAPTER)) { console.error(`✗ narrate.spec needs HyperFrames' faceless-explainer skill (${ADAPTER}) — run \`reelplanning hyperframes-skills\``); process.exit(1); }

// The fake engine: reads the request audio.mjs wrote, "voices" each line into assets/voice/<id>.wav
// with bytes that differ on every call, and logs which ids it voiced. Its word timings are the line's
// words at 0.3 s each, and the ids/shape are the real engine's (voices[{id,path,duration_s,words}]).
writeFileSync(ENGINE, `
import { readFileSync, writeFileSync, mkdirSync, appendFileSync } from "node:fs";
import { join, dirname } from "node:path";
const a = process.argv.slice(2), f = (n) => a[a.indexOf("--" + n) + 1];
const req = JSON.parse(readFileSync(f("request"), "utf8")), dir = f("hyperframes"), out = f("out");
const voices = [];
for (const l of req.lines) {
  const path = "assets/voice/" + l.id + ".wav", words = l.text.split(/\\s+/).map((t, i) => ({ id: "w" + i, text: t.replace(/[^\\w'-]/g, "").toLowerCase(), start: +(i * 0.3).toFixed(2), end: +(i * 0.3 + 0.25).toFixed(2) }));
  mkdirSync(join(dir, "assets/voice"), { recursive: true });
  // (FAKE_TTS_REAL_WAV: a real wav, a tenth of a second of noise, for a project ffmpeg turns to mp3)
  if (process.env.FAKE_TTS_REAL_WAV) { const pcm = Buffer.alloc(4800); for (let i = 0; i < pcm.length; i += 2) pcm.writeInt16LE(Math.round((Math.random() - 0.5) * 2000), i); const h = Buffer.alloc(44); h.write("RIFF", 0); h.writeUInt32LE(36 + pcm.length, 4); h.write("WAVEfmt ", 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22); h.writeUInt32LE(24000, 24); h.writeUInt32LE(48000, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write("data", 36); h.writeUInt32LE(pcm.length, 40); writeFileSync(join(dir, path), Buffer.concat([h, pcm])); }
  else writeFileSync(join(dir, path), "RIFF-fake " + l.id + " " + req.speed + " " + l.text + " " + process.hrtime.bigint() + Math.random());
  appendFileSync(process.env.FAKE_TTS_LOG, l.id + "\\n");
  if (process.env.FAKE_TTS_FAIL) process.exit(3);
  // killed with its wav written and its word timings not yet back: narrate, audio.mjs and this engine all go at once
  if (process.env.FAKE_TTS_KILL_AT && readFileSync(process.env.FAKE_TTS_LOG, "utf8").split("\\n").filter(Boolean).length >= +process.env.FAKE_TTS_KILL_AT) process.kill(0, "SIGKILL");
  voices.push({ id: l.id, path, duration_s: +(words.length * 0.3 + 0.2).toFixed(3), words });
}
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ tts_provider: "fake", voice_id: req.voice || "am_michael", bgm: null, bgm_pending: false, bgm_provider: null, bgm_pid: null, bgm_log: null, bgm_mode: null, bgm_target_duration_s: null, bgm_seed_duration_s: null, bgm_loop_count: null, voices, sfx: [], total_duration_s: voices.reduce((n, v) => n + v.duration_s, 0) }, null, 2));
`);

const LINES = [
  "An agent hands you its plan, and you approve it.",
  "reelplanning turns that plan into a short narrated video.",
  "Each plan gets two videos, one before the code and one after.",
];
const script = (lines) => `# SCRIPT\n\n**Voice:** am_michael\n\n---\n\n${lines.map((t, i) => `## Line ${i + 1} — beat (Frame ${i + 1})\n\n**Delivery:** Plain.\n\n    ${t}\n`).join("\n")}`;
const storyboard = (n) => `---\ntitle: test\nmusic: none\n---\n\n${Array.from({ length: n }, (_, i) => `## Frame ${i + 1} — beat ${i + 1}\n\n- duration: 5s\n- spec_section: Purpose\n`).join("\n")}`;
const frame = (n) => `<div data-composition-id="f${n}"><script>const tl = gsap.timeline({ paused: true }); tl.to("#a", { opacity: 1 }, 0.9); tl.to("#b", { opacity: 1 }, 1.8);</script></div>`;
function setup(lines) {
  rmSync(P, { recursive: true, force: true });
  mkdirSync(join(P, ".hyperframes"), { recursive: true });
  mkdirSync(join(P, "compositions", "frames"), { recursive: true });
  writeFileSync(join(P, "SCRIPT.md"), script(lines));
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(lines.length));
  writeFileSync(join(P, ".hyperframes", "holds.json"), JSON.stringify({ 3: 6 }));
  lines.forEach((_, i) => writeFileSync(join(P, "compositions", "frames", `${String(i + 1).padStart(2, "0")}-beat.html`), frame(i + 1)));
}
const env = { ...process.env, REELPLANNING_TTS_ENGINE: ENGINE, FAKE_TTS_LOG: LOG };
const narrate = (...a) => {
  writeFileSync(LOG, "");
  const e2 = a[0] && typeof a[0] === "object" ? { ...env, ...a.shift() } : env;
  try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", "narrate.mjs"), P, ...a], { encoding: "utf8", env: e2, stdio: ["ignore", "pipe", "pipe"] }), voiced: readFileSync(LOG, "utf8").split("\n").filter(Boolean) }; }
  catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}`, voiced: readFileSync(LOG, "utf8").split("\n").filter(Boolean) }; }
};
// narrate in its own process group, killed whole while the fake engine voices the at-th line (its scratch
// dir, which a kill leaves behind, goes in tmp)
const narrateKilled = (at) => new Promise((done) => {
  writeFileSync(LOG, "");
  const c = spawn("node", [join(ROOT, "scripts", "narrate.mjs"), P], { env: { ...env, FAKE_TTS_KILL_AT: String(at), TMPDIR: tmp }, detached: true, stdio: ["ignore", "pipe", "pipe"] });
  let out = "";
  c.stdout.on("data", (d) => { out += d; }); c.stderr.on("data", (d) => { out += d; });
  c.on("close", (code, signal) => done({ code, signal, out, voiced: readFileSync(LOG, "utf8").split("\n").filter(Boolean) }));
});
const run = (cmd, ...a) => { try { return { code: 0, out: execFileSync(cmd, a, { encoding: "utf8", cwd: P, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const wavs = () => Object.fromEntries(readdirSync(join(P, "assets", "voice")).sort().map((f) => [f, readFileSync(join(P, "assets", "voice", f)).toString("base64")]));
const json = (f) => JSON.parse(readFileSync(join(P, f), "utf8"));
const setLine = (i, text) => { const l = parseScript(readFileSync(join(P, "SCRIPT.md"), "utf8")).map((x) => x.text); l[i] = text; writeFileSync(join(P, "SCRIPT.md"), script(l)); };

try {
  setup(LINES);
  // ── first run: every line voiced, and the shapes the next scripts read ──
  const r1 = narrate();
  ok("first run: every line is voiced", r1.code === 0 && r1.voiced.join() === "01,02,03", r1.out);
  const meta = json("audio_meta.json"), eng = json("audio_engine_meta.json"), rec = json(".hyperframes/narration.json");
  const wordOk = (w) => typeof w.id === "string" && typeof w.text === "string" && typeof w.start === "number" && typeof w.end === "number" && Object.keys(w).length === 4;
  ok("audio_meta.json is frame-keyed, as audio.mjs writes it: { bgm, bgm_pending, voices[{frame,path,duration_s,words}], sfx }",
    JSON.stringify(Object.keys(meta)) === JSON.stringify(["bgm", "bgm_pending", "voices", "sfx"])
    && meta.voices.map((v) => v.frame).join() === "1,2,3" && meta.voices.every((v) => v.path === `assets/voice/${String(v.frame).padStart(2, "0")}.wav` && v.duration_s > 0 && JSON.stringify(Object.keys(v)) === '["frame","path","duration_s","words"]' && v.words.length && v.words.every(wordOk)),
    JSON.stringify(meta).slice(0, 400));
  ok("audio_engine_meta.json is the engine's id-keyed sidecar (fetch-sfx rebuilds audio_meta.json from it)",
    ["tts_provider", "voice_id", "bgm", "bgm_pending", "voices", "sfx", "total_duration_s"].every((k) => k in eng) && eng.voices.map((v) => v.id).join() === "01,02,03" && eng.voice_id === "am_michael", JSON.stringify(eng).slice(0, 400));
  ok("the record keys each line on text, voice, speed and model", rec.voice === "am_michael" && rec.speed === 1.25 && /^fake /.test(rec.model) && Object.keys(rec.lines).join() === "01,02,03" && rec.lines["02"].text === LINES[1] && /^[0-9a-f]{64}$/.test(rec.lines["02"].sha256), JSON.stringify(rec).slice(0, 400));

  // ── again, unchanged: nothing voiced, not a byte changed ──
  const w1 = wavs(), m1 = readFileSync(join(P, "audio_meta.json"), "utf8");
  const r2 = narrate();
  ok("an unchanged script voices nothing (audio.mjs is not even run)", r2.code === 0 && r2.voiced.length === 0 && /0 line\(s\) narrated, 3 kept/.test(r2.out), r2.out);
  ok("…and every wav and audio_meta.json are byte-identical", JSON.stringify(wavs()) === JSON.stringify(w1) && readFileSync(join(P, "audio_meta.json"), "utf8") === m1);

  // ── one line edited: only it is voiced ──
  writeFileSync(join(tmp, "prev_meta.json"), m1);
  setLine(1, "reelplanning turns that plan into a short narrated video you review by watching it.");
  const dry = JSON.parse(execFileSync("node", [join(ROOT, "scripts", "narrate.mjs"), P, "--dry-run", "--json"], { encoding: "utf8", env }));
  ok("--dry-run --json names the one line to narrate before anything runs", dry.narrate.join() === "2" && dry.keep.join() === "1,3" && dry.estimate_s > 0, JSON.stringify(dry));
  const c = narrationCost(P, []);
  ok("the cost line counts lines to narrate, not the whole video", c.lines.join() === "2" && c.total === 3 && /^1 of 3 lines to narrate .*the other 2 are kept/.test(costSentence(c)), `${JSON.stringify(c)} ${costSentence(c)}`);
  ok("…and adds the lines of the frames an update will rewrite", narrationCost(P, [3]).lines.join() === "2,3");
  const r3 = narrate();
  const w3 = wavs();
  ok("one edited line: only it goes to the TTS", r3.code === 0 && r3.voiced.join() === "02" && /1 line\(s\) narrated, 2 kept byte for byte/.test(r3.out), r3.out);
  ok("…the other two wavs are byte-identical, the edited one is new", w3["01.wav"] === w1["01.wav"] && w3["03.wav"] === w1["03.wav"] && w3["02.wav"] !== w1["02.wav"]);
  const m3 = json("audio_meta.json"), mp = JSON.parse(m1);
  ok("…and the kept lines' word timings are carried over exactly", JSON.stringify(m3.voices[0]) === JSON.stringify(mp.voices[0]) && JSON.stringify(m3.voices[2]) === JSON.stringify(mp.voices[2]) && m3.voices[1].words.length === 14);

  // ── the next scripts accept it ──
  const tm = run("node", join(ROOT, "scripts", "transcribe-missing.mjs"), P);
  ok("transcribe-missing: every voice has word timings, nothing to repair", tm.code === 0 && /all 3 voices have word timings/.test(tm.out), tm.out);
  const sd = run("node", ADAPTER, "sync-durations", "--audio-meta", join(P, "audio_meta.json"), "--storyboard", join(P, "STORYBOARD.md"));
  ok("audio.mjs sync-durations: every frame takes its voice length", sd.code === 0 && /3 frame duration\(s\) updated/.test(sd.out) && readFileSync(join(P, "STORYBOARD.md"), "utf8").includes(`- duration: ${m3.voices[1].duration_s}s`), sd.out);
  const hd = run("node", join(ROOT, "scripts", "hold-durations.mjs"), P);
  ok("hold-durations: the held frame is held again", hd.code === 0 && /3: .* → 6s/.test(hd.out), hd.out);
  const rt = run("node", join(ROOT, "scripts", "retime-frames.mjs"), P, "--against", join(tmp, "prev_meta.json"));
  ok("retime-frames: only the edited frame's cues move", rt.code === 0 && /1 frame\(s\) retimed, 2 unchanged/.test(rt.out) && /02-beat\.html/.test(rt.out), rt.out);
  const cap = run("node", join(skillsDir(), "faceless-explainer", "scripts", "captions.mjs"), "build", "--storyboard", "./STORYBOARD.md", "--audio-meta", "./audio_meta.json", "--hyperframes", ".", "--out", "./caption_groups.json");
  ok("captions.mjs build reads the audio_meta.json", cap.code === 0 && existsSync(join(P, "compositions", "captions.html")), cap.out);

  // ── sfx the build already had survive a re-narration (the engine's own --only tts,bgm merge keeps them) ──
  const e2 = json("audio_engine_meta.json");
  e2.sfx = [{ id: "01", name: "whoosh", file: "assets/sfx/whoosh.mp3", source: "library", offset_s: 0.2, duration_s: 1, volume: 0.3 }];
  writeFileSync(join(P, "audio_engine_meta.json"), JSON.stringify(e2, null, 2));
  setLine(2, "Each plan gets two videos: one before the code, one after it.");
  const r4 = narrate();
  ok("sfx already resolved are kept, in both files", r4.voiced.join() === "03" && json("audio_engine_meta.json").sfx.length === 1 && json("audio_meta.json").sfx[0]?.frame === 1 && json("audio_meta.json").sfx[0]?.file === "assets/sfx/whoosh.mp3", r4.out);

  // ── a line inserted in the middle renumbers the rest; they move, unchanged ──
  const w4 = wavs();
  const cur = parseScript(readFileSync(join(P, "SCRIPT.md"), "utf8")).map((x) => x.text);
  writeFileSync(join(P, "SCRIPT.md"), script([cur[0], "A new beat, inserted second.", cur[1], cur[2]]));
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(4));
  const r5 = narrate(), w5 = wavs();
  ok("an inserted line: only it is voiced", r5.voiced.join() === "02", r5.out);
  ok("…and the lines after it move to their new frames byte for byte", w5["01.wav"] === w4["01.wav"] && w5["03.wav"] === w4["02.wav"] && w5["04.wav"] === w4["03.wav"] && json("audio_meta.json").voices.map((v) => v.frame).join() === "1,2,3,4");

  // ── a deleted line's voice file goes ──
  writeFileSync(join(P, "SCRIPT.md"), script([cur[0], cur[1], cur[2]]));
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(3));
  const r6 = narrate(), w6 = wavs();
  ok("a deleted line: nothing voiced, the others move back, the orphaned wav is removed", r6.voiced.length === 0 && Object.keys(w6).join() === "01.wav,02.wav,03.wav" && w6["02.wav"] === w4["02.wav"] && /removed 1 voice file/.test(r6.out), r6.out);

  // ── the engine fails half way: the kept files are put back, and a rerun voices only what is left ──
  const wf = wavs();
  const two = parseScript(readFileSync(join(P, "SCRIPT.md"), "utf8")).map((x) => x.text);
  writeFileSync(join(P, "SCRIPT.md"), script(["A new first line, pushing the rest down.", ...two]));
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(4));
  process.env.FAKE_TTS_FAIL = env.FAKE_TTS_FAIL = "1";
  const rf = narrate();
  delete env.FAKE_TTS_FAIL; delete process.env.FAKE_TTS_FAIL;
  const wf2 = wavs();
  ok("a failed TTS run exits non-zero and puts every kept file back where it was", rf.code === 1 && /kept lines are back as they were/.test(rf.out) && ["01.wav", "02.wav", "03.wav"].every((f) => wf2[f] === wf[f]), rf.out);
  const rf2 = narrate();
  ok("…so the rerun voices only the new line", rf2.code === 0 && rf2.voiced.join() === "01" && wavs()["02.wav"] === wf["01.wav"], rf2.out);
  writeFileSync(join(P, "SCRIPT.md"), script(two));
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(3));
  narrate();

  // ── the record is checked against the files ──
  writeFileSync(join(P, "assets", "voice", "01.wav"), "rewritten by something else");
  const r7 = narrate();
  ok("a wav changed behind narrate's back is voiced again, not reused", r7.voiced.join() === "01", r7.out);
  const r8 = narrate("--speed", "1.1");
  ok("a new speed re-voices every line (the speed is in the key)", r8.voiced.join() === "01,02,03" && json(".hyperframes/narration.json").speed === 1.1, r8.out);
  const r9 = narrate("--speed", "1.1", "--voice", "af_heart");
  ok("…so does a new voice", r9.voiced.join() === "01,02,03" && json(".hyperframes/narration.json").voice === "af_heart" && json("audio_engine_meta.json").voice_id === "af_heart", r9.out);
  const r9b = narrate();
  ok("a rebuild with no --speed keeps the pace it was narrated at: nothing is voiced again at the default", r9b.code === 0 && r9b.voiced.length === 0 && json(".hyperframes/narration.json").speed === 1.1, r9b.out);

  // ── build keeps the voice the video was narrated with ──
  // A remembered pref passed as --voice would beat narrate's own order (the recorded voice first), so a
  // video made in another voice would be re-voiced line by line. A `node` shim on PATH answers prefs.mjs
  // with a different voice, logs the narrate call and runs the real narrate, then stops the build there
  // (the rest of it needs a real HyperFrames project).
  const SHIM = join(tmp, "shim"), CALLS = join(tmp, "node-calls.log");
  mkdirSync(SHIM, { recursive: true });
  writeFileSync(join(SHIM, "node"), `#!/usr/bin/env bash
case "$*" in
  *prefs.mjs*) echo '{"voice":{"value":"am_michael"}}'; exit 0;;
  *narrate.mjs*) printf '%s\\n' "$*" >> "${CALLS}"; "${process.execPath}" "$@"; exit 97;;
  *) exec "${process.execPath}" "$@";;
esac
`, { mode: 0o755 });
  writeFileSync(LOG, "");
  let rb;
  try { rb = { code: 0, out: execFileSync(process.execPath, [join(ROOT, "scripts", "build.mjs"), P, "--speed", "1.1"], { encoding: "utf8", env: { ...env, PATH: `${SHIM}:${process.env.PATH}` }, stdio: ["ignore", "pipe", "pipe"] }) }; }
  catch (e) { rb = { code: e.status, out: `${e.stdout}${e.stderr}` }; }
  const call = existsSync(CALLS) ? readFileSync(CALLS, "utf8") : "";
  ok("build passes no --voice, so a video in another voice than the remembered one is not re-voiced", /narrate\.mjs/.test(call) && !/--voice/.test(call) && readFileSync(LOG, "utf8") === "" && json(".hyperframes/narration.json").voice === "af_heart", `${call}\n${rb.out}`);

  // ── killed part way (a container restart, a timeout): the next run voices only the rest ──
  // It used to record nothing until the whole run finished, so a run killed after 23 of 31 lines left
  // 23 wavs and no record, and the next run voiced all 31 again.
  const FIVE = [...LINES, "You watch it the way you would read a review.", "Then you approve it, or you ask for changes."];
  const strip = (rec) => JSON.stringify({ ...rec, lines: Object.fromEntries(Object.entries(rec.lines).map(([id, e]) => [id, { ...e, sha256: "-" }])) });
  setup(FIVE);
  narrate();
  const clean = { meta: readFileSync(join(P, "audio_meta.json"), "utf8"), eng: readFileSync(join(P, "audio_engine_meta.json"), "utf8"), rec: strip(json(".hyperframes/narration.json")) };
  setup(FIVE);
  const rk = await narrateKilled(4);
  ok("a run killed while voicing the 4th of 5 lines leaves its wav but no audio_meta.json (the setup for the next checks)",
    rk.signal === "SIGKILL" && rk.voiced.join() === "01,02,03,04" && existsSync(join(P, "assets", "voice", "04.wav")) && !existsSync(join(P, "audio_meta.json")), `${rk.signal} ${rk.code} ${rk.voiced}\n${rk.out}`);
  const wk = wavs();
  const dk = JSON.parse(execFileSync("node", [join(ROOT, "scripts", "narrate.mjs"), P, "--dry-run", "--json"], { encoding: "utf8", env }));
  ok("--dry-run after the kill names only the lines it did not finish", dk.narrate.join() === "4,5" && dk.keep.join() === "1,2,3", JSON.stringify(dk));
  const rr = narrate(), wr = wavs();
  ok("the next run voices only those: the 4th, whose wav was written but whose word timings never came back, and the 5th", rr.code === 0 && rr.voiced.join() === "04,05", rr.out);
  ok("…the three it finished are kept byte for byte", ["01.wav", "02.wav", "03.wav"].every((f) => wr[f] === wk[f]) && wr["04.wav"] !== wk["04.wav"]);
  const recR = json(".hyperframes/narration.json");
  ok("…and audio_meta.json, audio_engine_meta.json and the record come out exactly as a clean run's",
    readFileSync(join(P, "audio_meta.json"), "utf8") === clean.meta && readFileSync(join(P, "audio_engine_meta.json"), "utf8") === clean.eng && strip(recR) === clean.rec
    && Object.entries(recR.lines).every(([id, e]) => e.sha256 === createHash("sha256").update(readFileSync(join(P, "assets", "voice", `${id}.wav`))).digest("hex")),
    `${readFileSync(join(P, "audio_meta.json"), "utf8").slice(0, 300)}\n${clean.meta.slice(0, 300)}`);
  ok("…with nothing left over in the project: only narration.json and holds.json in .hyperframes/, only the five wavs", readdirSync(join(P, ".hyperframes")).sort().join() === "holds.json,narration.json" && Object.keys(wr).join() === "01.wav,02.wav,03.wav,04.wav,05.wav", readdirSync(join(P, ".hyperframes")).join());

  // killed while renumbering: two lines inserted at the top move the five kept lines down, so the new
  // 01.wav and 02.wav overwrite two kept lines' files before the run is killed
  const wb = wavs();
  writeFileSync(join(P, "SCRIPT.md"), script(["A new opening line.", "And a second new one.", ...FIVE]));
  writeFileSync(join(P, "STORYBOARD.md"), storyboard(7));
  const rk2 = await narrateKilled(2);
  ok("a run killed while voicing the second of two inserted lines", rk2.signal === "SIGKILL" && rk2.voiced.join() === "01,02", `${rk2.signal} ${rk2.voiced}\n${rk2.out}`);
  const rr2 = narrate(), wr2 = wavs();
  ok("…the next run voices only that line, and the kept lines whose old files were overwritten are still kept byte for byte",
    rr2.code === 0 && rr2.voiced.join() === "02" && [1, 2, 3, 4, 5].every((n) => wr2[`0${n + 2}.wav`] === wb[`0${n}.wav`]) && json("audio_meta.json").voices.map((v) => v.frame).join() === "1,2,3,4,5,6,7", rr2.out);
  // what a killed run left is checked against its sha256 as the record is: with 03.wav and 04.wav both
  // changed behind narrate's back since the kill, 03 (whose copy changed too) is voiced again, and 04
  // (whose copy is intact) comes back from it byte for byte
  setLine(0, "A newer opening line.");
  const w3k = wavs(), rk3 = await narrateKilled(1);
  const prog = existsSync(join(P, ".hyperframes/narration-progress/progress.json")) ? json(".hyperframes/narration-progress/progress.json") : {}, third = Object.values(prog.lines || {}).find((e) => e.text === FIVE[0]);
  for (const f of ["03.wav", "04.wav"]) writeFileSync(join(P, "assets", "voice", f), "changed by something else");
  if (third) writeFileSync(join(P, third.path), "changed by something else");
  const rr3 = narrate();
  ok("…and after a kill, a line whose file and copy were both changed is voiced again; one whose copy is intact is kept from it",
    rk3.signal === "SIGKILL" && !!third && rr3.code === 0 && rr3.voiced.join() === "01,03" && wavs()["04.wav"] === w3k["04.wav"], `${rk3.signal} ${rr3.voiced}\n${rr3.out}`);

  // ── written and said ──
  const WRITTEN = "Run claude -p on plan.md, then open /work.", SPOKEN = "Run claude dash p on plan dot md, then open slash work.";
  setup([WRITTEN, LINES[1]]);
  const rs = narrate(), recS = json(".hyperframes/narration.json"), heardS = json("audio_meta.json").voices[0].words.map((x) => x.text).join(" ");
  const k = (text) => lineKey({ text, voice: recS.voice, speed: recS.speed, model: recS.model });
  ok("written and said: a line written `claude -p`, `plan.md`, `/work` is handed to the voice as spoken, and keyed on that",
    rs.code === 0 && heardS === "run claude dash p on plan dot md then open slash work" && recS.lines["01"].text === WRITTEN && recS.lines["01"].said === SPOKEN && recS.lines["01"].key === k(SPOKEN), `${heardS}\n${JSON.stringify(recS.lines["01"])}`);
  ok("…a line with nothing written that way is handed over as it is: its key is the one it always had, no `said`", recS.lines["02"].key === k(LINES[1]) && !("said" in recS.lines["02"]), JSON.stringify(recS.lines["02"]));
  setup([SPOKEN, LINES[1]]);
  narrate();
  const wS = wavs();
  setLine(0, WRITTEN);
  const rm = narrate();
  ok("…a script moved from the spoken form to the written one keeps its audio (the voice is handed the same words)", rm.code === 0 && rm.voiced.length === 0 && wavs()["01.wav"] === wS["01.wav"], rm.out);
  // a line voiced as written, before narrate said it (its record key made of the written text): kept, under that key
  const recL = json(".hyperframes/narration.json");
  recL.lines["01"].key = k(WRITTEN); delete recL.lines["01"].said;
  writeFileSync(join(P, ".hyperframes", "narration.json"), JSON.stringify(recL, null, 2) + "\n");
  const rl = narrate();
  ok("…and a line voiced as written before narrate said it is kept, under the key it has on record", rl.code === 0 && rl.voiced.length === 0 && wavs()["01.wav"] === wS["01.wav"] && json(".hyperframes/narration.json").lines["01"].key === k(WRITTEN), rl.out);
  // this repo's committed videos: every recorded line keeps its key (and so its audio)
  const recs = execFileSync("git", ["-C", ROOT, "ls-files", "*/.hyperframes/narration.json"], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  let asSaid = 0, asWritten = 0; const lost = [];
  for (const f of recs) {
    const rec = JSON.parse(execFileSync("git", ["-C", ROOT, "show", `HEAD:${f}`], { encoding: "utf8" }));
    for (const [id, e] of Object.entries(rec.lines || {})) {
      const kk = (text) => lineKey({ text, voice: rec.voice, speed: rec.speed, model: rec.model }), said = say(e.text);
      if (e.key === kk(said) && said === e.text) asSaid++;
      else if (e.key === kk(e.text) && said !== e.text) asWritten++;
      else if (e.key !== kk(said)) lost.push(`${f} ${id}`);
    }
  }
  ok(`…every line of this repo's ${recs.length} narration records keeps its key: ${asSaid} handed over as they are, ${asWritten} kept as voiced before narrate said it`, recs.length > 10 && asSaid > 400 && !lost.length, lost.slice(0, 5).join("\n  "));

  // ── a project narrated before the record existed: adopted from git ──
  setup(LINES);
  narrate();
  rmSync(join(P, ".hyperframes", "narration.json"));
  const g = (...a) => execFileSync("git", ["-C", tmp, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { stdio: "ignore" });
  g("init", "-q"); g("add", "video"); g("commit", "-qm", "narrated before narrate existed");
  const wg = wavs();
  setLine(0, "An agent hands you its plan: six steps and three questions.");
  const r10 = narrate();
  ok("no record, but the narration is committed: adopted from git, only the edited line voiced", r10.voiced.join() === "01" && /the narration committed in [0-9a-f]{7}/.test(r10.out) && wavs()["02.wav"] === wg["02.wav"], r10.out);
  // …and the same with the voice files edited since that commit: not trusted, everything voiced
  rmSync(join(P, ".hyperframes", "narration.json"));
  const r11 = narrate();
  ok("…but not when the voice files differ from that commit", r11.voiced.join() === "01,02,03" && /nothing \(no narration record yet\)/.test(r11.out), r11.out);

  // ── --adopt, outside git ──
  const Q = join(tmp, "outside");
  cpSync(P, Q, { recursive: true });
  rmSync(join(Q, ".hyperframes", "narration.json"));
  const wq = Object.fromEntries(readdirSync(join(Q, "assets", "voice")).map((f) => [f, readFileSync(join(Q, "assets", "voice", f)).toString("base64")]));
  writeFileSync(LOG, "");
  const adopt = execFileSync("node", [join(ROOT, "scripts", "narrate.mjs"), Q, "--adopt"], { encoding: "utf8", env, cwd: tmpdir() });
  ok("--adopt takes the current voice files as the narration of the current script", readFileSync(LOG, "utf8") === "" && /current voice files \(--adopt\)/.test(adopt) && readFileSync(join(Q, "assets", "voice", "02.wav")).toString("base64") === wq["02.wav"], adopt);

  // ── a project committed as mp3, as the worked examples under videos/ are: a clone has no .wav (D-305) ──
  const ffmpeg = (() => { try { execFileSync("ffmpeg", ["-version"], { stdio: "ignore" }); return true; } catch { return false; } })();
  if (!ffmpeg) ok("a project committed as mp3 (skipped: ffmpeg is not on PATH)", true);
  else {
    const REAL = { FAKE_TTS_REAL_WAV: "1" };
    setup(LINES);
    narrate(REAL);
    for (const id of ["01", "02", "03"]) {
      execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", join(P, "assets", "voice", `${id}.wav`), "-codec:a", "libmp3lame", "-b:a", "48k", "-ac", "1", join(P, "assets", "voice", `${id}.mp3`)]);
      rmSync(join(P, "assets", "voice", `${id}.wav`));
    }
    for (const f of ["audio_meta.json", "audio_engine_meta.json"]) writeFileSync(join(P, f), readFileSync(join(P, f), "utf8").replace(/assets\/voice\/(\d+)\.wav/g, "assets/voice/$1.mp3"));
    rmSync(join(P, ".hyperframes", "narration.json"));
    g("add", "-A", "video"); g("commit", "-qm", "an example committed as mp3");
    const m0 = wavs();
    setLine(0, "An agent hands you its plan: six steps and four questions.");
    const r12 = narrate(REAL);
    const m1 = wavs(), meta = json("audio_meta.json");
    ok("a project committed as mp3, no wav: its lines kept from the mp3 (adopted from git), only the edited one voiced",
      r12.code === 0 && r12.voiced.join() === "01" && /the narration committed in [0-9a-f]{7}/.test(r12.out) && m1["02.mp3"] === m0["02.mp3"] && m1["03.mp3"] === m0["03.mp3"], r12.out);
    ok("…and the new line is written as mp3, which audio_meta.json and the record point at",
      m1["01.mp3"] !== m0["01.mp3"] && readFileSync(join(P, "assets", "voice", "01.mp3")).subarray(0, 3).toString("latin1") !== "RIF" && meta.voices.every((v) => /^assets\/voice\/\d+\.mp3$/.test(v.path))
        && json(".hyperframes/narration.json").lines["01"].sha256 === createHash("sha256").update(readFileSync(join(P, "assets", "voice", "01.mp3"))).digest("hex") && !/removed \d+ voice file/.test(r12.out), JSON.stringify(meta.voices.map((v) => v.path)) + r12.out);
    const r13 = narrate(REAL);
    ok("…and a rerun voices nothing and changes no mp3", r13.code === 0 && r13.voiced.length === 0 && JSON.stringify(wavs()) === JSON.stringify(m1), r13.out);
  }
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ narrate: only changed lines are voiced");
process.exit(failed ? 1 : 0);
