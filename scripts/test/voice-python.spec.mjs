#!/usr/bin/env node
// The local voice's own Python (scripts/lib/voice-python.mjs), for a machine whose python3 cannot have Kokoro, against
// stand-in Pythons (node scripts answering -c, -m venv and -m pip as a Python would): no network, nothing installed.
//   - install: tries each python3.N on PATH, 3.10 or newer, but python3's own version, the newest first, until
//     kokoro-onnx installs in a venv with one; prints that venv's python alone on stdout; with none that can, exit 1
//     and no venv left behind (one the commands would then point HyperFrames at)
//   - every command run through the CLI gives HyperFrames that venv's python (HYPERFRAMES_PYTHON), and keeps a
//     HYPERFRAMES_PYTHON of yours; with no venv, python3 as before
//   - setup --dry-run: Kokoro found in the venv; with none, the pip line and that a venv would follow if pip cannot;
//     with a HYPERFRAMES_PYTHON of yours, no venv line
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, chmodSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
import { ROOT } from "../lib/env.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };

const tmp = mkdtempSync(join(tmpdir(), "rp-voice-python-spec-"));
const LOG = join(tmp, "python.log"), HFLOG = join(tmp, "hf.log");
const exe = (p, body) => { writeFileSync(p, body); chmodSync(p, 0o755); return p; };
// A stand-in Python: its version, whether `-m venv` works with it, whether pip installs kokoro-onnx with it. A venv it
// makes holds a copy of it whose pip writes a marker beside it, which `import kokoro_onnx` then finds.
const STUB = `#!${process.execPath}
const fs = require("fs"), p = require("path"), me = __filename, cfg = JSON.parse(fs.readFileSync(me + ".json", "utf8")), a = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(LOG)}, JSON.stringify({ py: me, a }) + "\\n");
const marker = p.join(p.dirname(me), "kokoro-installed");
if (a[0] === "-c") {
  if (a[1].includes("version_info")) console.log(cfg.minor);
  else if (a[1].includes("python_version")) console.log("3." + cfg.minor + ".0");
  else if (a[1].includes("import kokoro_onnx")) process.exit(fs.existsSync(marker) ? 0 : 1);
  else if (a[1].includes("sys.prefix")) process.exit(cfg.inVenv ? 0 : 1);
  process.exit(0);
}
if (a[0] === "-m" && a[1] === "venv") {
  if (!cfg.venv) process.exit(1);
  const bin = p.join(a[2], "bin"), py = p.join(bin, "python");
  fs.mkdirSync(bin, { recursive: true }); fs.copyFileSync(me, py); fs.chmodSync(py, 0o755);
  fs.writeFileSync(py + ".json", JSON.stringify({ ...cfg, inVenv: true }));
  process.exit(0);
}
if (a[0] === "-m" && a[1] === "pip") { if (a[2] === "--version") process.exit(0); if (!cfg.pip) process.exit(1); fs.writeFileSync(marker, ""); process.exit(0); }
process.exit(2);
`;
const python = (dir, name, cfg) => { mkdirSync(dir, { recursive: true }); writeFileSync(join(dir, name) + ".json", JSON.stringify({ venv: true, pip: false, ...cfg })); return exe(join(dir, name), STUB); };
const calls = () => (existsSync(LOG) ? readFileSync(LOG, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
const baseEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(REELPLANNER_|HYPERFRAMES_|HEYGEN|HF_MEDIA)/.test(k) && !/_API_KEY$/.test(k)));
const runIt = (args, env) => new Promise((done) => {
  rmSync(LOG, { force: true }); rmSync(HFLOG, { force: true });
  const all = Object.fromEntries(Object.entries({ ...baseEnv, ...env }).filter(([, v]) => v != null));
  const c = spawn(args[0], args.slice(1), { cwd: tmp, env: all, stdio: ["ignore", "pipe", "pipe"] });
  let out = "", err = ""; c.stdout.on("data", (d) => { out += d; }); c.stderr.on("data", (d) => { err += d; });
  c.on("close", (code) => done({ code, out, err, calls: calls() }));
});
const install = (env) => runIt([process.execPath, join(ROOT, "scripts", "lib", "voice-python.mjs"), "install"], env);
const venvMade = (r) => r.calls.filter((c) => c.a[0] === "-m" && c.a[1] === "venv").map((c) => c.py.split("/").pop());

try {
  // ── install: python3 is 3.15, pip cannot install kokoro-onnx with 3.14 either, it can with 3.12 ──
  const A = join(tmp, "path-a"), homeA = join(tmp, "home-a");
  python(A, "python3", { minor: 15 }); python(A, "python3.15", { minor: 15, pip: true }); python(A, "python3.14", { minor: 14 });
  python(A, "python3.12", { minor: 12, pip: true }); python(A, "python3.9", { minor: 9, pip: true });
  const i1 = await install({ PATH: A, REELPLANNER_HOME: homeA });
  const venvPy = join(homeA, "voice", "bin", "python");
  ok("install: tries python3.14, then python3.12 (the newest first; never python3's own 3.15, nor 3.9)",
    JSON.stringify(venvMade(i1)) === JSON.stringify(["python3.14", "python3.12"]), JSON.stringify(i1.calls.map((c) => [c.py.split("/").pop(), ...c.a])));
  ok("…prints the venv's python, made with 3.12, alone on stdout (what it did on stderr), exit 0",
    i1.code === 0 && i1.out === `${venvPy}\n` && JSON.parse(readFileSync(venvPy + ".json", "utf8")).minor === 12 && /did not install with python3\.14/.test(i1.err), `${i1.code}\n${i1.out}\n${i1.err}`);

  // ── install: no Python here can have it ──
  const B = join(tmp, "path-b"), homeB = join(tmp, "home-b");
  python(B, "python3", { minor: 15 }); python(B, "python3.14", { minor: 14 }); python(B, "python3.13", { minor: 13, venv: false, pip: true });
  const i2 = await install({ PATH: B, REELPLANNER_HOME: homeB });
  ok("install, no Python that can: exit 1, nothing on stdout, and no venv left for the commands to point HyperFrames at",
    i2.code === 1 && i2.out === "" && !existsSync(join(homeB, "voice")) && JSON.stringify(venvMade(i2)) === JSON.stringify(["python3.14", "python3.13"]), `${i2.code}\n${i2.out}\n${i2.err}`);

  // ── the CLI gives HyperFrames the venv's python ──
  // the stand-in for `hyperframes tts` and `hyperframes transcribe` notes the python it was given, and answers as
  // local-speed.spec's does; a home with HyperFrames' models in its cache, so nothing is fetched
  const HF = exe(join(tmp, "fake-hyperframes.mjs"), `import { writeFileSync, appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pcmToWav } from ${JSON.stringify(pathToFileURL(join(ROOT, "scripts/lib/tts-api.mjs")).href)};
const [cmd, ...a] = process.argv.slice(2), val = (f) => a[a.indexOf(f) + 1];
appendFileSync(${JSON.stringify(HFLOG)}, JSON.stringify({ cmd, py: process.env.HYPERFRAMES_PYTHON ?? null }) + "\\n");
if (cmd === "tts") writeFileSync(val("--output"), pcmToWav(Buffer.alloc(24000 * 2 * 2), { sampleRate: 24000 }));
else if (cmd === "transcribe") { mkdirSync(val("--dir"), { recursive: true }); writeFileSync(join(val("--dir"), "transcript.json"), JSON.stringify(Array.from({ length: 19 }, (_, i) => ({ text: "w" + i, start: i * 0.1, end: i * 0.1 + 0.09 })))); }
`);
  const HOME = join(tmp, "home"), cache = join(HOME, ".cache", "hyperframes");
  for (const f of ["tts/models/kokoro-v1.0.onnx", "tts/voices/voices-v1.0.bin", "whisper/models/ggml-small.en.bin"]) { mkdirSync(join(cache, f, ".."), { recursive: true }); writeFileSync(join(cache, f), "model"); }
  const C = join(tmp, "path-c"); python(C, "python3", { minor: 15 });   // python3 here cannot have Kokoro
  const WHISPER = exe(join(tmp, "whisper-cli"), "#!/bin/sh\nexit 0\n");
  const cliEnv = { HOME, PATH: `${C}:${process.env.PATH}`, REELPLANNER_HYPERFRAMES_BIN: HF, HYPERFRAMES_WHISPER_PATH: WHISPER, REELPLANNER_SYSTEM_ROOT: join(tmp, "no-system") };
  const hfPythons = () => (existsSync(HFLOG) ? readFileSync(HFLOG, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l).py) : []);
  const check = async (env) => { const r = await runIt([process.execPath, join(ROOT, "bin", "reelplanner.mjs"), "narration-check", "--local"], { ...cliEnv, ...env }); return { ...r, py: hfPythons() }; };
  const n1 = await check({ REELPLANNER_HOME: homeA });
  ok("a command through the CLI, with the voice's venv: HyperFrames is given its python, and Kokoro is found (exit 0)",
    n1.code === 0 && n1.py.length > 0 && n1.py.every((p) => p === venvPy), `${n1.code} ${JSON.stringify(n1.py)}\n${n1.out}${n1.err}`);
  const YOURS = python(join(tmp, "yours"), "python", { minor: 13 }); writeFileSync(join(tmp, "yours", "kokoro-installed"), "");
  const n2 = await check({ REELPLANNER_HOME: homeA, HYPERFRAMES_PYTHON: YOURS });
  ok("…with a HYPERFRAMES_PYTHON of yours: that one is kept", n2.code === 0 && n2.py.length > 0 && n2.py.every((p) => p === YOURS), `${n2.code} ${JSON.stringify(n2.py)}\n${n2.out}${n2.err}`);
  const n3 = await check({ REELPLANNER_HOME: homeB });
  ok("…with no venv: python3, as before (here one without Kokoro: not installed, nothing run, exit 1)",
    n3.code === 1 && n3.py.length === 0 && /Kokoro TTS is not installed/.test(n3.out + n3.err), `${n3.code}\n${n3.out}${n3.err}`);

  // ── setup --dry-run through the CLI (a stand-in Chrome, so nothing is downloaded) ──
  const CHROME = exe(join(tmp, "chrome-headless-shell"), "#!/bin/sh\nexit 0\n");
  const setup = async (env) => { const r = await runIt([process.execPath, join(ROOT, "bin", "reelplanner.mjs"), "setup", "--dry-run"], { ...cliEnv, HYPERFRAMES_BROWSER_PATH: CHROME, ...env }); return r.out + r.err; };
  const s1 = await setup({ REELPLANNER_HOME: homeA });
  ok("setup --dry-run with the voice's venv: Kokoro found in it", s1.includes(`✓ Kokoro TTS (kokoro-onnx in ${venvPy})`), s1);
  const s2 = await setup({ REELPLANNER_HOME: homeB });
  ok("…with none: the pip line, then that a venv of its own follows if pip cannot install it for python3",
    s2.includes("· would run: python3 -m pip install --user kokoro-onnx soundfile\n")
      && s2.includes(`· would make the voice a venv of its own, ${join(homeB, "voice")}, with an older Python here, if pip cannot install it for python3\n`), s2);
  const s3 = await setup({ REELPLANNER_HOME: homeB, HYPERFRAMES_PYTHON: join(C, "python3") });
  ok("…with a HYPERFRAMES_PYTHON of yours that lacks it: the pip line for it, and no venv", s3.includes(`· would run: ${join(C, "python3")} -m pip install --user kokoro-onnx soundfile\n`) && !/venv of its own/.test(s3), s3);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ voice-python: the local voice's own Python, where python3 cannot have Kokoro");
process.exit(failed ? 1 : 0);
