#!/usr/bin/env node
// Is local narration fast enough here? (scripts/lib/local-speed.mjs: `setup`'s step, and `narration-check --local`)
// against a stand-in for the HyperFrames CLI (REELPLANNER_HYPERFRAMES_BIN): no Kokoro, no whisper, no network.
//   - the verdict's words: fine at 20 s a line or under, slow over it (the hosted voice, with exactly what to do, and
//     that local still works), over the limit when a sentence did not finish
//   - narration-check --local: local Kokoro + whisper small.en whatever config.json names, a plan video's line,
//     the fine verdict; stopped at the limit (its process group too: the stand-in never finishes), the slow verdict;
//     Kokoro or whisper missing: nothing run, says so, exit 1; a flag naming another engine is a usage error
//   - setup's step: fine, slow, skipped when a tool is missing or a hosted engine is set (in config.json, or in
//     ~/.reelplanner/.env alone, HOME being a scratch folder), the models fetched once
//     first; `--dry-run` only says what it would do, and so does `setup --dry-run`
//   - setup's choice about the local voice (`--plan`): installed by default (said first when some is missing, with how
//     to skip it); skipped with one line when narration is hosted (~/.reelplanner/.env, the shell, config.json), Kokoro
//     alone when hosted speech is timed by local whisper; `--hosted-voice` skips it and prints the two lines;
//     `--local-voice` installs it anyway; and `setup --dry-run` each way (no Kokoro, whisper or speed check listed when
//     hosted; everything else still there), and a narration setting that cannot work named once in its summary
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, chmodSync, readdirSync, symlinkSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { ROOT, machineDirShown } from "../lib/env.mjs";
import { speedVerdict, SPEED_TEXT, SLOW_S } from "../lib/local-speed.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };

const tmp = mkdtempSync(join(tmpdir(), "rp-local-speed-spec-"));
const REPO = join(tmp, "repo"), LOG = join(tmp, "hf.log"), BIN = join(tmp, "bin");
mkdirSync(join(REPO, ".reelplanner"), { recursive: true }); mkdirSync(BIN, { recursive: true });
const config = (narration) => writeFileSync(join(REPO, ".reelplanner", "config.json"), JSON.stringify(narration ? { narration } : {}, null, 2));
const exe = (p, body) => { writeFileSync(p, body); chmodSync(p, 0o755); return p; };
// a home with HyperFrames' models in its cache (or without), so nothing is fetched unless a check means to
const home = (name, models = true) => {
  const h = join(tmp, name), c = join(h, ".cache", "hyperframes");
  if (models) for (const f of ["tts/models/kokoro-v1.0.onnx", "tts/voices/voices-v1.0.bin", "whisper/models/ggml-small.en.bin"]) { mkdirSync(join(c, f, ".."), { recursive: true }); writeFileSync(join(c, f), "model"); }
  else mkdirSync(h, { recursive: true });
  return h;
};
const HOME = home("home");
mkdirSync(join(HOME, ".reelplanner"), { recursive: true });

// the stand-in for `hyperframes tts` and `hyperframes transcribe`: FAKE_HF_MS of work, then a 2 s wav, or 19 words over it
const HF = join(tmp, "fake-hyperframes.mjs");
writeFileSync(HF, `import { writeFileSync, appendFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pcmToWav } from ${JSON.stringify(pathToFileURL(join(ROOT, "scripts/lib/tts-api.mjs")).href)};
const [cmd, ...a] = process.argv.slice(2), val = (f) => a[a.indexOf(f) + 1];
appendFileSync(process.env.FAKE_HF_LOG, JSON.stringify({ cmd, a, text: cmd === "tts" ? readFileSync(a[0], "utf8") : null, t: Date.now() }) + "\\n");
await new Promise((r) => setTimeout(r, Number(process.env.FAKE_HF_MS || 0)));
if (process.env.FAKE_HF_DONE) writeFileSync(process.env.FAKE_HF_DONE, cmd);
if (cmd === "tts") writeFileSync(val("--output"), pcmToWav(Buffer.alloc(24000 * 2 * 2), { sampleRate: 24000 }));
else if (cmd === "transcribe") { mkdirSync(val("--dir"), { recursive: true }); writeFileSync(join(val("--dir"), "transcript.json"), JSON.stringify(Array.from({ length: 19 }, (_, i) => ({ text: "w" + i, start: i * 0.1, end: i * 0.1 + 0.09 })))); }
else process.exit(2);
`);
const PY = exe(join(BIN, "python-with-kokoro"), "#!/bin/sh\nexit 0\n");
const WHISPER = exe(join(BIN, "whisper-cli"), "#!/bin/sh\nexit 0\n");
const baseEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(REELPLANNER_|HYPERFRAMES_|HEYGEN|HF_MEDIA)/.test(k) && !/_API_KEY$/.test(k)));
// the fixed system places (Homebrew's whisper-cli, a system Chrome) under an empty folder: what this machine has
// installed there is never found
const ENV = { ...baseEnv, HOME, HYPERFRAMES_PYTHON: PY, HYPERFRAMES_WHISPER_PATH: WHISPER, REELPLANNER_HYPERFRAMES_BIN: HF, REELPLANNER_SYSTEM_ROOT: join(tmp, "no-system"), FAKE_HF_LOG: LOG, FAKE_HF_MS: "30" };
const calls = () => (existsSync(LOG) ? readFileSync(LOG, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const runIt = (args, env = {}, cwd = REPO) => new Promise((done) => {
  rmSync(LOG, { force: true });
  const all = Object.fromEntries(Object.entries({ ...ENV, ...env }).filter(([, v]) => v != null));
  const t0 = Date.now(), c = spawn(args[0], args.slice(1), { cwd, env: all, stdio: ["ignore", "pipe", "pipe"] });
  let out = ""; c.stdout.on("data", (d) => { out += d; }); c.stderr.on("data", (d) => { out += d; });
  c.on("close", (code) => done({ code, out, ms: Date.now() - t0, end: Date.now(), calls: calls() }));
});
// how long a run went on after the stand-in tts started (0 when it was stopped before it began): a run stopped at the
// limit ends well before the stand-in's 8 s (SLOW_MS) are up, however long node and python took to start on a loaded machine
const SLOW_MS = 8000;
const afterStart = (r) => (r.calls.length ? r.end - r.calls[0].t : 0);
const check = (args = [], env) => runIt([process.execPath, join(ROOT, "bin", "reelplanner.mjs"), "narration-check", "--local", ...args], env);
const step = (args = [], env) => runIt([process.execPath, join(ROOT, "scripts", "lib", "local-speed.mjs"), ...args, REPO], env);
// `home`: the machine's folder as the line names it, the one in use (a run here has a scratch HOME with none: the new name)
const slow = (home = "~/.reelplanner") => [
  "  the hosted voice is much faster: a line in 1–3 s, about $0.03 a minute of narration (Deepgram Aura-2 on OpenRouter). To use it:",
  `    put REELPLANNER_TTS=openrouter and OPENROUTER_API_KEY=… in ${home}/.env (this machine, every repo; a key from https://openrouter.ai/settings/keys)`,
  "    then run: reelplanner narration-check",
  "  local narration still works here, just slower",
].join("\n");
// the stand-in tts and transcriber each start a process, so a loaded machine can take a second or two: the verdict
// is what is checked (fine, and how it is said), not that a stand-in finished under 1 s
const FINE = /^✓ local narration: (?:under 1 s|about \d+ s) a line here, (?:under a minute|about \d+ min) for a plan video \(60 lines\): fine$/m;
const TIMED_OUT = "△ local narration: over 1 s a line here (one sentence did not finish in 1 s), over 1 min for a plan video (60 lines): slow\n" + slow();

try {
  // ── the verdict's words ──
  const v = (s, o = {}) => speedVerdict(s, { rp: "reelplanner", ...o });
  ok("verdict: 6 s a line is fine, said in one line with the minutes for a plan video", JSON.stringify(v(6)) === JSON.stringify({ fast: true, lines: ["✓ local narration: about 6 s a line here, about 6 min for a plan video (60 lines): fine"] }), JSON.stringify(v(6)));
  ok(`verdict: ${SLOW_S} s a line is still fine, ${SLOW_S + 1} s is slow`, v(SLOW_S).fast && !v(SLOW_S + 1).fast);
  ok("verdict: 45 s a line is slow: the hosted voice with its cost, the engine and the key in ~/.reelplanner/.env (no config.json), the check, and that local still works",
    v(45).lines.join("\n") === "△ local narration: about 45 s a line here, about 45 min for a plan video (60 lines): slow\n" + slow(machineDirShown()), v(45).lines.join("\n"));
  ok("verdict: a sentence that did not finish in 30 s is over 30 s a line, and slow", v(0, { timedOut: true, limitS: 30 }).lines[0] === "△ local narration: over 30 s a line here (one sentence did not finish in 30 s), over 30 min for a plan video (60 lines): slow", v(0, { timedOut: true, limitS: 30 }).lines[0]);
  ok("verdict: no key in it, only the variable's name (and the engine's)", !/sk-|=[A-Za-z0-9]/.test(v(45).lines.join("\n").replace("OPENROUTER_API_KEY=…", "").replace("REELPLANNER_TTS=openrouter", "")));

  // ── narration-check --local: fine ──
  config({ tts: "openrouter" });   // a hosted engine named: --local checks the local one anyway, with no key
  const r1 = await check();
  const tts1 = r1.calls.find((c) => c.cmd === "tts"), tr1 = r1.calls.find((c) => c.cmd === "transcribe");
  ok("--local: local Kokoro + whisper small.en whatever config.json names, said with why", r1.code === 0 && /^engine: local Kokoro \(hyperframes tts\), voice am_michael, ×1\.25, word timings from local whisper small\.en — from --local/m.test(r1.out), r1.out);
  ok("…a plan video's line (19 words), voiced as narrate voices it, then timed by whisper small.en", tts1?.text === SPEED_TEXT && tts1.a.includes("am_michael") && tts1.a[tts1.a.indexOf("--speed") + 1] === "1.25" && tr1?.a[tr1.a.indexOf("--model") + 1] === "small.en", JSON.stringify(r1.calls));
  ok("…the fine verdict, then the check works (exit 0)", FINE.test(r1.out) && /^✓ narration-check: kokoro \+ whisper small\.en works$/m.test(r1.out) && !/OPENROUTER_API_KEY=/.test(r1.out), r1.out);

  // ── narration-check --local: stopped at the limit ──
  const DONE = join(tmp, "finished");
  const r2 = await check([], { FAKE_HF_MS: String(SLOW_MS), FAKE_HF_DONE: DONE, REELPLANNER_LOCAL_SPEED_TIMEOUT_S: "1" });
  await new Promise((r) => setTimeout(r, Math.max(0, (r2.calls[0]?.t ?? Date.now()) + SLOW_MS + 500 - Date.now())));   // past when it would have finished
  ok("--local, a sentence slower than the limit: stopped at it, the slow verdict, exit 0 (slow is not a failure)",
    r2.code === 0 && afterStart(r2) < SLOW_MS - 1000 && /^△ speech: hyperframes tts did not finish in 1 s: stopped$/m.test(r2.out) && r2.out.includes(TIMED_OUT)
      && /^△ narration-check: kokoro \+ whisper small\.en did not finish one sentence in 1 s here: slow \(it still works, just slower\)$/m.test(r2.out) && !r2.calls.some((c) => c.cmd === "transcribe"), `${afterStart(r2)} ms after the stand-in started (${r2.ms} ms in all)\n${r2.out}`);
  ok("…and what it started was stopped too: the stand-in never finished", !existsSync(DONE));

  // ── narration-check --local: a tool missing ──
  const r3 = await check([], { HYPERFRAMES_PYTHON: join(tmp, "no-python") });
  ok("--local, Kokoro not installed: not timed, nothing run, says to run setup --local-voice, exit 1", r3.code === 1 && r3.calls.length === 0 && /^✗ local narration: not timed: Kokoro TTS is not installed$/m.test(r3.out) && /→ run `reelplanner setup --local-voice`/.test(r3.out), r3.out);
  const r3b = await check([], { HYPERFRAMES_WHISPER_PATH: null, PATH: BIN.replace(/bin$/, "empty-path") });
  ok("--local, whisper.cpp not found (PATH, HYPERFRAMES_WHISPER_PATH, HyperFrames' build cache): not timed, exit 1", r3b.code === 1 && r3b.calls.length === 0 && /^✗ local narration: not timed: whisper\.cpp is not installed$/m.test(r3b.out), r3b.out);
  const r3c = await check(["--tts", "openai"]);
  ok("--local with --tts: a usage error (exit 2)", r3c.code === 2 && /--local times local Kokoro \+ whisper small\.en, .*leave out --tts/.test(r3c.out), r3c.out);

  // ── setup's step ──
  config(null);
  const s1 = await step();
  ok("setup's step: one sentence timed, the fine verdict, exit 0", s1.code === 0 && s1.out.startsWith("▶ timing one sentence through local Kokoro + whisper small.en (at most 30 s)\n") && FINE.test(s1.out) && s1.out.split("\n").filter(Boolean).length === 2 && s1.calls.length === 2, s1.out);
  const s2 = await step([], { FAKE_HF_MS: String(SLOW_MS), REELPLANNER_LOCAL_SPEED_TIMEOUT_S: "1" });
  ok("setup's step, slow: the hosted voice and exactly what to do, local still works, exit 0 (advice, not a failure)", s2.code === 0 && afterStart(s2) < SLOW_MS - 1000 && s2.out === "▶ timing one sentence through local Kokoro + whisper small.en (at most 1 s)\n" + TIMED_OUT + "\n", `${afterStart(s2)} ms after the stand-in started\n${s2.out}`);
  const s3 = await step([], { HYPERFRAMES_PYTHON: join(tmp, "no-python") });
  ok("setup's step, Kokoro missing: skipped, saying so and how to time it later", s3.code === 0 && s3.calls.length === 0 && s3.out === "△ local narration: not timed: Kokoro TTS is missing (above); once installed, `reelplanner narration-check --local` times it\n", s3.out);
  config({ tts: "openrouter" });
  const s4 = await step();
  ok("setup's step, a hosted engine set: not timed, nothing run", s4.code === 0 && s4.calls.length === 0 && s4.out === "✓ local narration: not timed: narration here is hosted (openrouter deepgram/aura-2 + openrouter openai/whisper-1)\n", s4.out);
  config(null);
  // the hosted engine named in this machine's ~/.reelplanner/.env alone (HOME is a scratch one): not timed either
  writeFileSync(join(HOME, ".reelplanner", ".env"), "REELPLANNER_TTS=openrouter\n");
  const s4b = await step(), c4b = await check();
  ok("setup's step, the hosted engine set in ~/.reelplanner/.env (no config.json): not timed, nothing run", s4b.code === 0 && s4b.calls.length === 0 && s4b.out === "✓ local narration: not timed: narration here is hosted (openrouter deepgram/aura-2 + openrouter openai/whisper-1)\n", s4b.out);
  ok("…while narration-check --local times local narration anyway", c4b.code === 0 && c4b.calls.length === 2 && FINE.test(c4b.out), c4b.out);
  rmSync(join(HOME, ".reelplanner", ".env"));
  const s5 = await step([], { HOME: home("home-new", false) });
  ok("setup's step, the models not fetched yet: fetched once first (untimed), then timed", s5.code === 0 && /^▶ fetching Kokoro's and whisper's models \(about 840 MB, once\)$/m.test(s5.out) && FINE.test(s5.out)
    && s5.calls.filter((c) => c.cmd === "tts").map((c) => c.text).join("|") === `Hello.|${SPEED_TEXT}`, s5.out + JSON.stringify(s5.calls));
  const d1 = await step(["--dry-run"]), d2 = await step(["--dry-run"], { HOME: home("home-new2", false) }), d3 = await step(["--dry-run"], { HYPERFRAMES_PYTHON: join(tmp, "no-python") });
  ok("setup's step --dry-run: says what it would time (and fetch), runs nothing",
    d1.out === "· would time one sentence through local Kokoro + whisper small.en (at most 30 s) and say whether local narration is fast enough here\n"
      && d2.out.includes("(at most 30 s, after fetching their models once, about 840 MB)") && d3.out.includes("once Kokoro TTS is installed") && [d1, d2, d3].every((r) => r.code === 0 && r.calls.length === 0), d1.out + d2.out + d3.out);
  const sd = await runIt(["bash", join(ROOT, "scripts", "setup.sh"), "--dry-run"], { HOME: process.env.HOME, REELPLANNER_HOME: join(tmp, "rp-home") });   // never your own ~/.reelplanner/.env
  ok("setup --dry-run says it would time local narration (or that a hosted engine is set), and times nothing", /^(· would time one sentence through local Kokoro \+ whisper small\.en|✓ local narration: not timed|✓ local voice: skipped)/m.test(sd.out) && sd.calls.length === 0, sd.out);

  // ── setup's choice about the local voice (localVoicePlan: `--plan`), from the settings narrate reads ──
  const NOPY = exe(join(BIN, "python-without-kokoro"), "#!/bin/sh\nexit 1\n");
  const HOME_ENV = join(HOME, ".reelplanner", ".env");
  const plan = (args = [], env) => step(["--plan", ...args], env);
  const SKIPPED = "✓ local voice: skipped — narration is hosted (openrouter, from ~/.reelplanner/.env); `reelplanner setup --local-voice` installs it anyway";
  const HOSTED_VOICE = [
    "✓ local voice: skipped (--hosted-voice). Narration uses the hosted voice once these two lines are in ~/.reelplanner/.env:",
    "    REELPLANNER_TTS=openrouter",
    "    OPENROUTER_API_KEY=…",
    "  (a key from https://openrouter.ai/settings/keys; about $0.03 a minute of narration)",
  ].join("\n");
  const INSTALLING = "· local voice: installing it (Kokoro and whisper.cpp, free; about 840 MB of models, once; needs Python 3.10+). `reelplanner setup --hosted-voice` skips it and narrates with the hosted voice instead";
  config(null);
  const p1 = await plan(), p2 = await plan([], { HYPERFRAMES_PYTHON: NOPY });
  ok("plan, the default with the local voice all here: install it (nothing to do), nothing said", p1.out === "kokoro=1 whisper=1 pending=0\n", p1.out);
  ok("plan, the default with Kokoro missing: install it, saying so first: free, its size, Python, and how to skip it", p2.out === `kokoro=1 whisper=1 pending=0\n${INSTALLING}\n`, p2.out);
  writeFileSync(HOME_ENV, "REELPLANNER_TTS=openrouter\nOPENROUTER_API_KEY=sk-or-x\n");
  const p3 = await plan([], { HYPERFRAMES_PYTHON: NOPY }), p3b = await plan(["--hosted-voice"]), p3c = await plan(["--local-voice"]);
  ok("plan, hosted in ~/.reelplanner/.env (HOME a scratch one): Kokoro and whisper skipped, one line saying why and from where, and how to install it anyway", p3.out === `kokoro=0 whisper=0 pending=0\n${SKIPPED}\n`, p3.out);
  ok("…the same with --hosted-voice (already set: nothing to print), and --local-voice installs it anyway, saying nothing", p3b.out === p3.out && p3c.out === "kokoro=1 whisper=1 pending=0\n", p3b.out + p3c.out);
  rmSync(HOME_ENV);
  const p4 = await plan([], { REELPLANNER_TTS: "openrouter" });
  ok("plan, hosted from the shell: skipped, from the shell's REELPLANNER_TTS", p4.out === "kokoro=0 whisper=0 pending=0\n✓ local voice: skipped — narration is hosted (openrouter, from the shell's REELPLANNER_TTS); `reelplanner setup --local-voice` installs it anyway\n", p4.out);
  config({ tts: "openai", timings: "local" });
  const p5 = await plan();
  ok("plan, hosted speech timed by local whisper (config.json): Kokoro skipped, whisper.cpp kept", p5.out === "kokoro=0 whisper=1 pending=0\n✓ local voice: Kokoro skipped — speech is hosted (openai, from .reelplanner/config.json), but its word timings are local, so whisper.cpp is still installed; `reelplanner setup --local-voice` installs Kokoro anyway\n", p5.out);
  config(null);
  const p6 = await plan(["--hosted-voice"]);
  ok("plan, --hosted-voice with nothing set: skipped, pending, and the two lines for ~/.reelplanner/.env", p6.out === `kokoro=0 whisper=0 pending=1\n${HOSTED_VOICE}\n`, p6.out);

  // ── setup --dry-run itself, each way (HOME a scratch one; a stand-in Chrome, so nothing is downloaded) ──
  const CHROME = exe(join(BIN, "chrome-headless-shell"), "#!/bin/sh\nexit 0\n");
  const setup = (args = [], env) => runIt(["bash", join(ROOT, "scripts", "setup.sh"), "--dry-run", ...args], { HYPERFRAMES_BROWSER_PATH: CHROME, ...env });
  const LOCAL_STEPS = /^(✓|·|✗) (Kokoro TTS|would run: \S+ -m pip install|whisper\.cpp|would build whisper\.cpp|would time one sentence)|^✓ local narration/m;
  writeFileSync(HOME_ENV, "REELPLANNER_TTS=openrouter\nOPENROUTER_API_KEY=sk-or-x\n");
  const u1 = await setup([], { HYPERFRAMES_PYTHON: NOPY });
  rmSync(HOME_ENV);
  ok("setup --dry-run, hosted in ~/.reelplanner/.env: says the local voice is skipped, and lists no Kokoro, whisper.cpp or speed check",
    u1.out.includes(`\n${SKIPPED}\n`) && !LOCAL_STEPS.test(u1.out) && !/sk-or-x/.test(u1.out) && u1.calls.length === 0, u1.out);
  ok("…while everything else is still there: node, ffmpeg, Chrome, HyperFrames' skills, the narration engine",
    /^✓ node /m.test(u1.out) && /^(✓|·|✗) .*ffmpeg/m.test(u1.out) && /^✓ Chrome headless /m.test(u1.out) && /HyperFrames skills/.test(u1.out) && /^✓ narration: openrouter /m.test(u1.out), u1.out);
  const u2 = await setup(["--hosted-voice"]);
  ok("setup --dry-run --hosted-voice, nothing set: skipped, the two lines printed, then the next step (exit 0: a choice, not a failure)",
    u2.code === 0 && u2.out.includes(`\n${HOSTED_VOICE}\n`) && !LOCAL_STEPS.test(u2.out) && /^→ narration: next, put the two lines above in ~\/\.reelplanner\/\.env, then run .* narration-check to hear a test line$/m.test(u2.out) && !/^✗ narration/m.test(u2.out), u2.out);
  const u3 = await setup([], { HYPERFRAMES_PYTHON: NOPY });
  ok("setup --dry-run, the default: the local voice is said first, then Kokoro's install, whisper.cpp and the speed check, as before",
    u3.out.includes(`\n${INSTALLING}\n· would run: ${NOPY} -m pip install --user kokoro-onnx soundfile\n`) && /^(✓ whisper\.cpp|· would (run: brew install whisper-cpp|build whisper\.cpp)|✗ whisper\.cpp)/m.test(u3.out) && /^· would time one sentence/m.test(u3.out), u3.out);
  config({ tts: "bogus" });
  const u5 = await setup([], { HYPERFRAMES_PYTHON: NOPY });
  config(null);
  ok("setup --dry-run, a narration setting that cannot work: said, and the summary names it once (\"narration: narration tts …\", exit 1)",
    u5.code === 1 && /^✗ narration: narration tts "bogus" is not one of: /m.test(u5.out) && /^✗ after setup, still missing:\n(?: {4}.*\n)* {4}narration: narration tts "bogus" is not one of: /m.test(u5.out) && !/narration: narration:/.test(u5.out), u5.out);
  const u4 = await runIt(["bash", join(ROOT, "scripts", "setup.sh"), "--hosted-voice", "--local-voice"]);
  ok("setup --hosted-voice --local-voice: a usage error (exit 2), nothing run", u4.code === 2 && /pick one/.test(u4.out), u4.out);

  // ── setup --dry-run downloads no Chrome: with none anywhere it says it would; one in HyperFrames' cache is found ──
  // PATH: the system's commands, each linked into a folder of its own, but for a Chrome or Chromium (a CI runner has
  // /usr/bin/google-chrome)
  const sysBin = join(tmp, "path-no-chrome");
  mkdirSync(sysBin);
  const linked = new Set();
  for (const d of ["/usr/bin", "/bin"]) for (const n of readdirSync(d)) if (!/chrom/i.test(n) && !linked.has(n)) { linked.add(n); symlinkSync(join(d, n), join(sysBin, n)); }
  const noChrome = home("home-no-chrome", false), sysPath = [sysBin, dirname(process.execPath)].join(":");
  const c1 = await runIt(["bash", join(ROOT, "scripts", "setup.sh"), "--dry-run"], { HOME: noChrome, PATH: sysPath, HYPERFRAMES_BROWSER_PATH: null, PRODUCER_HEADLESS_SHELL_PATH: null, HYPERFRAMES_PYTHON: NOPY });
  ok("setup --dry-run, no Chrome anywhere: says it would download it, and downloads nothing (no cache folder made)",
    /^· would download Chrome headless \(about 260 MB\): hyperframes browser ensure$/m.test(c1.out) && !existsSync(join(noChrome, ".cache", "hyperframes", "chrome")) && !existsSync(join(noChrome, ".cache", "puppeteer")), c1.out);
  const cachedDir = join(noChrome, ".cache", "hyperframes", "chrome", "chrome-headless-shell", "linux-140.0.0", "chrome-headless-shell-linux64");
  mkdirSync(cachedDir, { recursive: true });
  const cached = exe(join(cachedDir, "chrome-headless-shell"), "#!/bin/sh\nexit 0\n");
  const c2 = await runIt(["bash", join(ROOT, "scripts", "setup.sh"), "--dry-run"], { HOME: noChrome, PATH: sysPath, HYPERFRAMES_BROWSER_PATH: null, PRODUCER_HEADLESS_SHELL_PATH: null, HYPERFRAMES_PYTHON: NOPY });
  ok("setup --dry-run, Chrome in HyperFrames' cache: found there", c2.out.includes(`✓ Chrome headless (${cached})`), c2.out);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ local-speed: whether local narration is fast enough here, through a stand-in HyperFrames");
process.exit(failed ? 1 : 0);
