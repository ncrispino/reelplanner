#!/usr/bin/env node
// Run any reelplanning command, from anywhere (installed from GitHub today; once the package is on npm,
// straight out of the npx cache too: RP_COMMAND in scripts/lib/env.mjs is the form people are shown):
//
//   reelplanning plan-map .reelplanning/plans/<plan>/video
//   reelplanning reel check .reelplanning/plans/<plan>
//   reelplanning setup            # system tools + HyperFrames' skills, once
//   reelplanning --help           # what is here
//
// `<command>` runs scripts/<command>.mjs (with node) or scripts/<command>.sh (with bash) from this
// package. Paths you pass are relative to YOUR working directory: the project lives in your repo,
// and the package directory, which under npx is a cache, is only ever read.
import { readdirSync, readFileSync, existsSync, realpathSync } from "node:fs";
import { dirname, join, delimiter } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { RP_COMMAND } from "../scripts/lib/env.mjs";

const ROOT = join(dirname(realpathSync(fileURLToPath(import.meta.url))), "..");
const SCRIPTS = join(ROOT, "scripts");
const { version } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const [cmd, ...args] = process.argv.slice(2);

// commands that are not a script of the same name
const SPECIAL = {
  reel: "the project record: init, new-plan, stage, check, record, audit, stops, prereqs, status, memory, retro, fold, build, rebuild, case-study, pr-check, renumber",
  setup: "install ffmpeg, Chrome headless, HyperFrames' skills and the local voice (Kokoro TTS, whisper.cpp; skipped when narration is hosted, or with --hosted-voice) (--dry-run to see)",
  hyperframes: "the HyperFrames CLI at the version reelplanning pins",
};

function commands() {
  return readdirSync(SCRIPTS).map((f) => f.match(/^(.+)\.(mjs|sh)$/)?.[1]).filter(Boolean)
    .filter((c) => !(c in SPECIAL)).sort();
}

function help() {
  const all = commands();
  const w = Math.max(...all.map((c) => c.length)) + 2, cols = 4;
  const rows = [];
  for (let i = 0; i < all.length; i += cols) rows.push("  " + all.slice(i, i + cols).map((c) => c.padEnd(w)).join("").trimEnd());
  console.log(`reelplanning ${version} — implementation plans as short narrated review videos

usage: reelplanning <command> [args…]${RP_COMMAND === "reelplanning" ? "" : `      (or: ${RP_COMMAND} <command> [args…])`}

${Object.entries(SPECIAL).map(([c, d]) => `  ${c.padEnd(13)}${d}`).join("\n")}
  --version    print the version

scripts:
${rows.join("\n")}

Paths are relative to your working directory. Installed at ${ROOT}`);
}

if (!cmd || cmd === "-h" || cmd === "--help" || cmd === "help") { help(); process.exit(0); }
if (cmd === "-v" || cmd === "--version" || cmd === "version") { console.log(version); process.exit(0); }

let exe, argv;
if (cmd === "reel") [exe, argv] = [process.execPath, [join(SCRIPTS, "reel.mjs"), ...args]];
else if (cmd === "hyperframes") {
  const { hyperframesBin } = await import(pathToFileURL(join(SCRIPTS, "lib", "env.mjs")).href);
  [exe, argv] = [process.execPath, [hyperframesBin(), ...args]];
} else if (/^[a-z0-9][a-z0-9-]*$/.test(cmd) && existsSync(join(SCRIPTS, `${cmd}.mjs`))) [exe, argv] = [process.execPath, [join(SCRIPTS, `${cmd}.mjs`), ...args]];
else if (/^[a-z0-9][a-z0-9-]*$/.test(cmd) && existsSync(join(SCRIPTS, `${cmd}.sh`))) [exe, argv] = ["bash", [join(SCRIPTS, `${cmd}.sh`), ...args]];
else { console.error(`✗ no such reelplanning command: ${cmd} (try: reelplanning --help)`); process.exit(1); }

// `reelplanning <script> --help` (or -h) prints the comment at the top of the script, which says what it does
// and how to call it, and runs nothing: most scripts would take `--help` for a path. A script with a --help of
// its own (setup, case-study; `reel` has one too) answers it itself.
const HELP = /^(-h|--help)$/, OWN = /(^|[^\w-])(-h\||"-h"|'-h'|"--help"|'--help')/;
if (exe === process.execPath && cmd !== "reel" && cmd !== "hyperframes" || exe === "bash") {
  const src = readFileSync(argv[0], "utf8");
  if (args.some((a) => HELP.test(a)) && !OWN.test(src)) {
    const lines = src.split("\n"), from = lines[0].startsWith("#!") ? 1 : 0, mark = exe === "bash" ? "#" : "//";
    const end = lines.findIndex((l, i) => i >= from && !l.startsWith(mark));
    console.log(lines.slice(from, end < 0 ? lines.length : end).map((l) => l.slice(mark.length).replace(/^ /, "")).join("\n").trim());
    process.exit(0);
  }
}

// The pinned HyperFrames CLI first on PATH, so a script (or a HyperFrames skill script it runs) that
// shells out to plain `hyperframes` gets the version this package was tested with.
const env = { ...process.env, REELPLANNING_ROOT: ROOT, REELPLANNING_VERSION: version };
try {
  const { pkgDir } = await import(pathToFileURL(join(SCRIPTS, "lib", "env.mjs")).href);
  const hf = pkgDir("hyperframes");
  const bin = hf && [join(hf, "..", ".bin"), join(hf, "..", "..", ".bin")].find((d) => existsSync(join(d, "hyperframes")));
  if (bin) env.PATH = `${bin}${delimiter}${process.env.PATH || ""}`;
} catch { /* the scripts resolve HyperFrames themselves; PATH is a convenience */ }

// Asynchronous, so a signal sent to this process (an agent stopping a background `review`, say)
// reaches the script too instead of leaving it running as an orphan.
const child = spawn(exe, argv, { stdio: "inherit", env });
for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(sig, () => child.kill(sig));
child.on("error", (e) => { console.error(`✗ could not run ${exe}: ${e.message}`); process.exit(1); });
child.on("exit", (code, signal) => {
  if (signal) { process.removeAllListeners(signal); process.kill(process.pid, signal); }
  else process.exit(code ?? 1);
});
