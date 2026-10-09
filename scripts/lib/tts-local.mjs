// Local narration, through the pinned HyperFrames CLI: Kokoro's speech (`hyperframes tts`) and whisper's word
// timings (`hyperframes transcribe --model`), for scripts/lib/narrate-engine.mjs, narration-check and the local
// speed check (scripts/lib/local-speed.mjs).
//
// `timeoutMs` stops a call that runs longer (its whole process group, so Kokoro's python and whisper go too) and
// throws an error with `timedOut: true`. Test seam: REELPLANNER_HYPERFRAMES_BIN names a stand-in for the
// HyperFrames CLI's entry script (the specs' fake `tts` and `transcribe`).
import { existsSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawn } from "node:child_process";
import { hyperframesBin } from "./env.mjs";
import { cleanWav } from "./tts-api.mjs";

const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const bin = () => process.env.REELPLANNER_HYPERFRAMES_BIN || hyperframesBin();
const run = (args, { timeoutMs, ...opts } = {}) => new Promise((done) => {
  // with a time limit, a process group of its own, so stopping it stops what it started
  const p = spawn(process.execPath, [bin(), ...args], { stdio: ["ignore", "ignore", "pipe"], detached: !!timeoutMs && process.platform !== "win32", ...opts });
  let err = "", timedOut = false;
  const timer = timeoutMs ? setTimeout(() => {
    timedOut = true;
    try { process.kill(process.platform === "win32" ? p.pid : -p.pid, "SIGKILL"); } catch { try { p.kill("SIGKILL"); } catch { /* gone */ } }
  }, timeoutMs) : null;
  p.stderr.on("data", (d) => { err = (err + d).slice(-800); });
  p.on("exit", (code) => { clearTimeout(timer); done({ code, err, timedOut }); });
  p.on("error", (e) => { clearTimeout(timer); done({ code: -1, err: e.message, timedOut }); });
});
const late = (what, ms) => Object.assign(new Error(`${what} did not finish in ${Math.round(ms / 1000)} s: stopped`), { timedOut: true });

/** Voice `text` with local Kokoro into `wavAbs`. → { wav, duration_s, words: null } */
export async function kokoro(text, wavAbs, { voice, speed = 1, cwd, timeoutMs } = {}) {
  const td = mkdtempSync(join(tmpdir(), "rp-tts-")), txt = join(td, "line.txt");
  writeFileSync(txt, text);
  const args = ["tts", txt, "--voice", voice, "--output", wavAbs];
  if (speed !== 1) args.push("--speed", String(speed));
  const r = await run(args, { cwd, timeoutMs });
  rmSync(td, { recursive: true, force: true });
  if (r.timedOut) throw late("hyperframes tts", timeoutMs);
  if (r.code !== 0 || !existsSync(wavAbs)) throw new Error(`hyperframes tts exited ${r.code}: ${r.err.trim().split("\n").pop() || "no wav"}`);
  const got = cleanWav(readFileSync(wavAbs));
  if (!got) throw new Error("hyperframes tts wrote something that is not a PCM wav");
  return { ...got, words: null };
}

/** Word timings for `wavAbs` from local whisper at `model`. → [{ text, start, end }], whisper's own words */
export async function whisper(wavAbs, { model, lang = "en", cwd, timeoutMs } = {}) {
  const td = mkdtempSync(join(tmpdir(), "rp-trans-"));
  try {
    const args = ["transcribe", wavAbs, "--model", model, "--dir", td];
    if (lang !== "en") args.push("--language", lang);
    const r = await run(args, { cwd, timeoutMs });
    if (r.timedOut) throw late(`hyperframes transcribe (whisper ${model})`, timeoutMs);
    const arr = r.code === 0 ? readJson(join(td, "transcript.json")) : null;
    if (!Array.isArray(arr)) throw new Error(`hyperframes transcribe (whisper ${model}) exited ${r.code}: ${r.err.trim().split("\n").pop() || "no transcript"}`);
    return arr.map((w) => ({ text: w.text, start: w.start, end: w.end }));
  } finally { rmSync(td, { recursive: true, force: true }); }
}
