#!/usr/bin/env node
// The local voice's own Python, where python3 cannot have Kokoro. HyperFrames runs Kokoro with $HYPERFRAMES_PYTHON, or
// else python3; kokoro-onnx needs onnxruntime, whose build for a new Python comes some time after it (none for 3.15
// in November 2026). There, setup makes the voice a venv of its own in the machine's folder (~/.reelplanner/voice:
// voiceVenv in scripts/lib/env.mjs), with an older Python that is here, and every reelplanner command runs HyperFrames
// with that venv's python (bin/reelplanner.mjs; a HYPERFRAMES_PYTHON of yours is kept).
//
//   node scripts/lib/voice-python.mjs install
//       makes it, with each python3.N on PATH (3.10 or newer, but python3's own version), the newest first, until
//       kokoro-onnx installs with one; on a Mac with none that can, with Homebrew's python@3.14, installed first.
//       Prints the venv's python on stdout and what it does on stderr; exit 1, with no venv left behind, when no
//       Python here can have it. Setup runs it when pip could not install kokoro-onnx for python3.
//
// Test seam: PATH (the Pythons it finds, and brew).
import { spawnSync } from "node:child_process";
import { readdirSync, rmSync } from "node:fs";
import { join, delimiter, resolve } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { voiceVenv } from "./env.mjs";

const PACKAGES = ["kokoro-onnx", "soundfile"];
// for a Mac with no Python that can have kokoro-onnx: the newest onnxruntime had a build for (November 2026)
const BREW_PYTHON = { formula: "python@3.14", minor: 14 };
const say = (line) => process.stderr.write(`${line}\n`);
const shown = (p) => (p.startsWith(homedir() + "/") ? `~${p.slice(homedir().length)}` : p);
// a command's own output goes to stderr: stdout is the venv's python alone
const run = (exe, args, env) => spawnSync(exe, args, { env, stdio: ["ignore", 2, 2], timeout: 30 * 60000 });

/** The minor version of a Python (15 for 3.15), or null when it does not run. */
function minorOf(python, env) {
  const r = spawnSync(python, ["-c", "import sys; print(sys.version_info[1])"], { env, encoding: "utf8", timeout: 60000 });
  return r.status === 0 && /^\d+$/.test(r.stdout.trim()) ? Number(r.stdout.trim()) : null;
}

/** The versioned Pythons on PATH, python3.10 and newer, the newest first: { minor, path }, the first on PATH of each. */
export function pythonsOnPath(env = process.env) {
  const found = new Map();
  for (const dir of (env.PATH || "").split(delimiter).filter(Boolean)) {
    let names; try { names = readdirSync(dir); } catch { continue; }
    for (const n of names) {
      const m = /^python3\.(\d+)$/.exec(n), minor = m && Number(m[1]);
      if (minor >= 10 && !found.has(minor)) found.set(minor, join(dir, n));
    }
  }
  return [...found].map(([minor, path]) => ({ minor, path })).sort((a, b) => b.minor - a.minor);
}

/** A venv made with `python`, with kokoro-onnx in it: its python; or null, and no venv, when a step fails. */
function venvWith(python, venv, env) {
  rmSync(venv, { recursive: true, force: true });
  const py = join(venv, "bin", "python");
  say(`▶ ${python} -m venv ${shown(venv)}`);
  if (run(python, ["-m", "venv", venv], env).status === 0) {
    say(`▶ ${shown(py)} -m pip install ${PACKAGES.join(" ")}`);
    if (run(py, ["-m", "pip", "install", "-q", "--disable-pip-version-check", ...PACKAGES], env).status === 0
      && spawnSync(py, ["-c", "import kokoro_onnx, soundfile"], { env, stdio: "ignore", timeout: 60000 }).status === 0) return py;
  }
  rmSync(venv, { recursive: true, force: true });
  return null;
}

/** Make the voice's venv: its python, or null when no Python here can have kokoro-onnx. */
export function install(env = process.env) {
  const venv = voiceVenv(env), own = minorOf("python3", env), tried = new Set([own]);
  for (const p of pythonsOnPath(env).filter((p) => p.minor !== own)) {
    tried.add(p.minor);
    const py = venvWith(p.path, venv, env);
    if (py) return py;
    say(`  (kokoro-onnx did not install with python3.${p.minor})`);
  }
  if (process.platform === "darwin" && !tried.has(BREW_PYTHON.minor) && spawnSync("brew", ["--version"], { env, stdio: "ignore" }).status === 0) {
    say(`▶ brew install ${BREW_PYTHON.formula}`);
    if (run("brew", ["install", BREW_PYTHON.formula], env).status === 0) {
      const prefix = spawnSync("brew", ["--prefix", BREW_PYTHON.formula], { env, encoding: "utf8" }).stdout?.trim();
      const py = prefix && venvWith(join(prefix, "bin", `python3.${BREW_PYTHON.minor}`), venv, env);
      if (py) return py;
    }
  }
  return null;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv[2] !== "install") { console.error("usage: node scripts/lib/voice-python.mjs install"); process.exit(2); }
  const py = install();
  if (py) console.log(py);
  process.exit(py ? 0 : 1);
}
