#!/usr/bin/env node
// The test runner: runs spec files side by side, each as its own child process, a few at a time.
//
//   npm test                 the fast run: every script spec, and the player specs that cover the core
//   npm run test:full        everything, exhaustive (RP_FULL=1 in each spec: answer-on-frame's every
//                            question of every video at every viewport, and so on)
//
// usage: node scripts/test/run.mjs [--full] [--jobs <n>] [--timeout <s>] [--list] [--help] [<spec> …]
//   --full       the full set, and RP_FULL=1 for each spec (a spec with a quicker run then runs all of it)
//   --jobs, -j   how many specs run at once (default: the CPU count, at most 4; in the full run 1.75 times the
//                CPU count, at most 8, since its player specs spend much of their time waiting on the video playing
//                in real time. Measured on 4 CPUs: 4 at a time 404 s, 6 314 s, 7 298 s; 8 272 s but the CPUs then
//                never idle, and answer-on-frame's hover timings failed once in two runs)
//   --timeout    seconds before a spec is stopped and counted as failed (default 1800)
//   --list       print the specs this run would start, and stop
//   <spec> …     run just these (a path, or a name such as `quiz` or `answer-on-frame`), in the set's place
//
// Each spec prints its result and time as it ends; a failing spec's whole output is printed after the
// others, and the run exits non-zero. Specs stay runnable alone (`node packages/player/test/x.spec.mjs`):
// what the runner adds is three things in the environment of each —
//   RP_TEST_PORT  a free port (and the few above it) for the spec's server, instead of its fixed one,
//                 so two player specs never meet on a port (scripts/lib/env.mjs testPort)
//   TMPDIR        a folder of its own, so nothing one spec writes to the temp folder meets another's;
//                 removed when the spec passes, kept (and named) when it fails
//   REELPLANNER_HOME  a folder in that one, so no spec reads or writes your ~/.reelplanner (its .env, read
//                 by every narration command, and your memory, you.jsonl); a spec that sets its own wins
// After the run, the committed fixtures (GUARDED: videos/, .reelplanner/, eval/) must be as they were before it:
// the runner takes `git status` of them before the first spec and again as each spec ends, and a path a spec
// changed (one clean before the run, or one already changed whose content moved) fails the run, naming the
// file and the specs that had ended and were running when it was first seen. Specs work on scratch copies
// (scripts/lib/env.mjs scratchCopy), never on a committed file; unrelated work in the tree is left alone.
// In the full run a spec in SHARDS (answer-on-frame, whose full pass alone is about 14 minutes) runs as that many
// shards side by side, each a process of its own (`--shard k/n`, as RP_SHARD=k/n; its own browser, port and temp
// folder). The spec deals its units into the shards itself (`<spec> --units --shard k/n`); before the run the
// runner checks that the shards together hold every unit of the full pass exactly once, and after it that the
// checks they made sum to the unsharded count the spec records (its FULL_CHECKS).
import { spawn, spawnSync } from "node:child_process";
import { createServer } from "node:net";
import { mkdtempSync, rmSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { cpus, tmpdir, availableParallelism } from "node:os";
import { join, resolve, relative, basename } from "node:path";
import { ROOT } from "../lib/env.mjs";

const S = (n) => `scripts/test/${n}.spec.mjs`, P = (n) => `packages/player/test/${n}.spec.mjs`;
// Every script spec: quick, no browser (about a minute and a quarter one after another).
const SCRIPT = ["version", "package", "case-study", "numerals", "hyperframes-skills", "lifecycle", "system-review", "narrate", "narrate-api", "narration-check", "local-speed", "retime", "build",
  "terms", "names", "loop", "review-data", "reviews", "memory", "details", "bundle-shared", "stage-presence", "visuals", "contributing", "fresh-eyes", "thumbs", "explainer", "guide", "guide-revised", "static-server", "supersedes", "ledger", "init", "review-status", "make-public", "rebuild", "old-names"].map(S);
// The player specs. `FAST` is the core the default run
// keeps: the player loading and playing, its controls, a decision, a quiz and a call, the band, the size
// and the zoom, the access rules, answer-on-frame's quicker run (one question of each kind), frame-room's
// (nothing laid on the frame covers its words, on the l2-upload-resume choices), Ask about this, and the guide under
// the video (the small player, Watch this moment, a marked thing's part, a note from the guide), a note highlighted
// anywhere in the guide (prose, a diff's lines, a diagram), in the review and in what Finish sends, and the record within
// reach with the guide open (every comment, a way to each, Marks on or off, the last review after a rebuild), and every
// kind of question still a stop when the page goes seconds between ticks (stall).
const PLAYER = ["answer-on-frame", "size", "band", "access", "stop", "details", "handoff", "revisit", "controls", "changes", "local-review",
  "marks", "finish", "rounds", "review-keys", "unclear", "group", "list", "parts-copy", "own-answer", "sound", "quiz", "decisions", "player", "frame-room", "ask", "explainer-finish", "guide-under", "guide-notes", "working", "record-reach", "stall"].map(P);
// the sketch page: a browser spec, though its file sits with the script specs (scripts/test/sketch.spec.mjs)
PLAYER.push(S("sketch"));
const FAST = ["answer-on-frame", "size", "band", "access", "controls", "quiz", "decisions", "player", "frame-room", "ask", "guide-under", "guide-notes", "record-reach", "stall"].map(P);
FAST.push(S("sketch"));
// run on its own, over a built bundle (`npm run bundle:check`)
const APART = [P("bundle")];
// in the full run, run as this many shards side by side (the spec's own units; see the top)
const SHARDS = { [P("answer-on-frame")]: 4 };

const args = process.argv.slice(2), flag = (n) => args.includes(n);
// --help prints the comment at the top of this file and runs nothing (it is not a spec's name)
if (flag("--help") || flag("-h")) {
  const head = readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(1);
  console.log(head.slice(0, head.findIndex((l) => !l.startsWith("//"))).map((l) => l.replace(/^\/\/ ?/, "")).join("\n"));
  process.exit(0);
}
const value = (...names) => { const i = args.findIndex((a) => names.includes(a)); return i >= 0 ? args[i + 1] : undefined; };
const full = flag("--full");
const cpuCount = typeof availableParallelism === "function" ? availableParallelism() : cpus().length;
const jobs = Math.max(1, Number(value("--jobs", "-j")) || (full ? Math.min(Math.ceil(cpuCount * 1.75), 8) : Math.min(cpuCount, 4)));
const timeout = Math.max(1, Number(value("--timeout")) || 1800) * 1000;
const named = args.filter((a, i) => !a.startsWith("-") && !["--jobs", "-j", "--timeout"].includes(args[i - 1]));
const all = [...SCRIPT, ...PLAYER];
const pick = (n) => all.find((s) => s === n || relative(ROOT, join(ROOT, n)) === s || basename(s, ".spec.mjs") === n) || n;
// About how long each takes alone, in seconds (measured 2026-09-27; the quicker pass where a spec has one, the
// full run's after the slash). Only the order uses it: the slowest start first, so the run ends near the slowest.
// A sharded spec's shards take theirs from the spec's units (answer-on-frame's full pass: about 200 s a shard).
const SECS = { "answer-on-frame": [60, 830], band: [45, 120], "guide-notes": 45, size: [50, 65], revisit: 54, "player/test/details": 40, access: 31, quiz: 30,
  "scripts/test/details": 29, stop: 29, stall: 50, "parts-copy": 26, changes: 25, handoff: 19, controls: 17, marks: 16, sound: 14, group: 14, loop: 13, rebuild: 50 };
const secsOf = (s) => { const k = Object.keys(SECS).find((k) => `/${s}`.endsWith(`/${k}.spec.mjs`)), v = k ? SECS[k] : 5; return Array.isArray(v) ? v[full ? 1 : 0] : v; };
const files = named.length ? named.map(pick) : full ? [...PLAYER, ...SCRIPT] : [...FAST, ...SCRIPT];
for (const s of files) if (!existsSync(resolve(ROOT, s))) { console.error(`✗ no such spec: ${s}`); process.exit(2); }
// What runs: a spec, or in the full run each shard of a sharded one, as the spec deals its units (no browser needed
// to ask). The shards must hold every unit of the full pass once; a spec that deals them wrong is not run.
const sharded = {};
const specs = files.flatMap((spec) => {
  const n = full && SHARDS[spec];
  if (!n) return [{ spec, name: spec, secs: secsOf(spec) }];
  const ask = (shard) => { const r = spawnSync(process.execPath, [spec, "--units", ...(shard ? ["--shard", shard] : [])], { cwd: ROOT, env: { ...process.env, RP_FULL: "1" }, encoding: "utf8" }); try { return JSON.parse(r.stdout); } catch { console.error(`✗ ${spec} --units${shard ? ` --shard ${shard}` : ""} did not say its units:\n${r.stdout}${r.stderr}`); process.exit(2); } };
  const whole = ask(null), shards = Array.from({ length: n }, (_, i) => ({ shard: `${i + 1}/${n}`, ...ask(`${i + 1}/${n}`) }));
  const held = shards.flatMap((x) => x.units.map((u) => u.id)), twice = held.filter((u, i) => held.indexOf(u) !== i), none = whole.all.filter((u) => !held.includes(u));
  if (twice.length || none.length || held.length !== whole.all.length) { console.error(`✗ ${spec}: its ${n} shards do not hold every unit once — twice: ${twice.join(", ") || "none"}; in none: ${none.join(", ") || "none"}`); process.exit(2); }
  sharded[spec] = { n, fullChecks: whole.fullChecks, units: Object.fromEntries(shards.map((x) => [x.shard, x.units.map((u) => u.id)])) };
  return shards.map((x) => ({ spec, shard: x.shard, name: `${spec} ${x.shard}`, secs: x.units.reduce((a, u) => a + u.secs, 0) }));
}).sort((a, b) => (named.length ? 0 : b.secs - a.secs));
// a spec added to either folder and to neither list above would never run: say so
const unlisted = ["scripts/test", "packages/player/test"].flatMap((d) => readdirSync(join(ROOT, d)).filter((f) => f.endsWith(".spec.mjs")).map((f) => `${d}/${f}`)).filter((s) => !all.includes(s) && !APART.includes(s));
if (unlisted.length) console.log(`! not in scripts/test/run.mjs's lists, so not run: ${unlisted.join(", ")}\n`);
if (flag("--list")) { console.log(specs.map((s) => s.name).join("\n")); process.exit(0); }

// A port, and the four above it, that nothing is listening on. Handed out once each per run. They come from
// 20000–32759, below the ports the system hands out for outgoing connections (Linux 32768–60999, macOS and
// Windows 49152 and up): a port in that range can be free when checked and then taken by a browser's or a
// fetch's own connection before the spec's server listens on it (EADDRINUSE).
const free = (port) => new Promise((ok) => { const s = createServer().once("error", () => ok(false)).listen(port, "127.0.0.1", () => s.close(() => ok(true))); });
const LOW_PORT = 20000, HIGH_PORT = 32750;
let nextPort = LOW_PORT + Math.floor(Math.random() * ((HIGH_PORT - LOW_PORT) / 10)) * 10;
async function portBlock() {
  for (;;) {
    const p = nextPort; nextPort += 10; if (nextPort > HIGH_PORT) nextPort = LOW_PORT;
    let clear = true; for (let i = 0; i < 5 && clear; i++) clear = await free(p + i);
    if (clear) return p;
  }
}

// The committed fixtures no spec may change. `git status` of them now, and as each spec ends: what a spec
// changed is a path not in the first snapshot, or one in it whose content (or state) is no longer the same.
const GUARDED = ["videos", ".reelplanner", "eval"];
const fixtures = () => {
  const r = spawnSync("git", ["--no-optional-locks", "status", "--porcelain=v1", "-z", "--untracked-files=all", "--", ...GUARDED], { cwd: ROOT, encoding: "utf8" });
  if (r.status !== 0) return null;   // not a git checkout (an installed package): nothing to compare
  const out = new Map(), parts = r.stdout.split("\0");
  for (let i = 0; i < parts.length; i++) {
    const e = parts[i]; if (!e) continue;
    const state = e.slice(0, 2), path = e.slice(3); if (state[0] === "R" || state[0] === "C") i++;   // a rename's source follows it
    let sum = ""; try { sum = createHash("sha1").update(readFileSync(join(ROOT, path))).digest("hex"); } catch { sum = "(gone)"; }
    out.set(path, `${state} ${sum}`);
  }
  return out;
};
const before = fixtures(), touched = new Map(), ended = [];
const lookAtFixtures = (name) => {
  ended.push(name);
  const now = before && fixtures(); if (!now) return;
  for (const [path, v] of now) if (before.get(path) !== v && !touched.has(path))
    touched.set(path, { state: v.slice(0, 2).trim(), was: before.has(path) ? "already changed before the run, and changed again" : "clean before the run", after: [...ended], running: [...running].map((c) => c.specName) });
  for (const [path] of before) if (!now.has(path) && !touched.has(path))
    touched.set(path, { state: "restored", was: "changed before the run, and put back to the committed file", after: [...ended], running: [...running].map((c) => c.specName) });
};

const secs = (ms) => `${(ms / 1000).toFixed(1)} s`;
const pad = Math.max(...specs.map((s) => s.name.length));
const started = Date.now(), results = [], running = new Set();
const nShards = Object.values(sharded).reduce((a, x) => a + x.n, 0), nFiles = files.length;
console.log(`${full ? "full run" : "fast run"}: ${nFiles} specs${nShards ? ` (${Object.entries(sharded).map(([s, x]) => `${basename(s, ".spec.mjs")} as ${x.n} shards`).join(", ")}: ${specs.length} processes)` : ""}, ${jobs} at a time${full ? "" : " (npm run test:full for everything)"}\n`);

async function run({ spec, shard, name }) {
  const port = await portBlock(), tmp = mkdtempSync(join(tmpdir(), `rp-test-${basename(spec, ".spec.mjs")}${shard ? `-${shard.replace("/", "of")}` : ""}-`));
  const env = { ...process.env, RP_TEST_PORT: String(port), TMPDIR: tmp, TMP: tmp, TEMP: tmp, REELPLANNER_HOME: join(tmp, "reelplanner-home"), ...(full ? { RP_FULL: "1" } : {}), ...(shard ? { RP_SHARD: shard } : {}) };
  const t0 = Date.now();
  return new Promise((done) => {
    const child = spawn(process.execPath, [spec], { cwd: ROOT, env, stdio: ["ignore", "pipe", "pipe"] });
    child.specName = name; running.add(child);
    let out = "", timedOut = false;
    child.stdout.on("data", (c) => (out += c)); child.stderr.on("data", (c) => (out += c));
    const timer = setTimeout(() => { timedOut = true; child.kill("SIGKILL"); }, timeout);
    child.on("close", (code, signal) => {
      clearTimeout(timer); running.delete(child);
      const ms = Date.now() - t0, pass = code === 0 && !timedOut;
      const checks = (out.match(/^\s*✓/gm) || []).length;
      const why = timedOut ? ` — stopped after ${secs(timeout)}` : signal ? ` — killed by ${signal}` : code !== 0 ? ` — exit ${code}` : "";
      console.log(`${pass ? "✓" : "✗"} ${name.padEnd(pad)}  ${secs(ms).padStart(8)}${checks ? `  ${checks} check${checks === 1 ? "" : "s"}` : ""}${why}`);
      if (pass) rmSync(tmp, { recursive: true, force: true });
      results.push({ spec, shard, name, pass, ms, out, tmp, why });
      lookAtFixtures(name);
      done();
    });
  });
}

const queue = [...specs];
const worker = async () => { while (queue.length) await run(queue.shift()); };
process.on("SIGINT", () => { for (const c of running) c.kill("SIGKILL"); process.exit(130); });
await Promise.all(Array.from({ length: Math.min(jobs, specs.length) }, worker));

// A sharded spec: each shard ends with "shard k/n: <count> checks in <m> units (<ids>)". Together they must have run
// every unit they were dealt and made as many checks as the unsharded pass does.
const tally = [];
for (const [spec, x] of Object.entries(sharded)) {
  const got = results.filter((r) => r.spec === spec).map((r) => { const m = /^shard (\d+\/\d+): (\d+) checks in \d+ units \(([^)]*)\)/m.exec(r.out); return { shard: r.shard, checks: m ? +m[2] : null, units: m ? m[3].split(", ").filter(Boolean) : [], ms: r.ms }; }).sort((a, b) => a.shard.localeCompare(b.shard, "en", { numeric: true }));
  const sum = got.reduce((a, g) => a + (g.checks || 0), 0), short = got.filter((g) => g.checks == null || g.units.join() !== x.units[g.shard].join()).map((g) => g.shard);
  const good = got.length === x.n && !short.length && sum === x.fullChecks;
  tally.push({ spec, good, line: `${good ? "✓" : "✗"} ${basename(spec, ".spec.mjs")}: its ${x.n} shards ${got.map((g) => `${g.shard} ${g.checks ?? "?"} checks (${secs(g.ms)})`).join(", ")} — ${got.map((g) => g.checks ?? "?").join(" + ")} = ${sum} checks, ${sum === x.fullChecks ? "the" : "not the"} unsharded count (${x.fullChecks})${short.length ? `; shards ${short.join(", ")} did not run all their units` : ""}${!good && !short.length && got.every((g) => g.checks != null) ? `. Every unit ran once, so if a check or a video changed the count, ${sum} is the unsharded count now: record it as FULL_CHECKS in ${spec}` : ""}` });
}
if (tally.length) console.log(`\n${tally.map((t) => t.line).join("\n")}`);
const failed = results.filter((r) => !r.pass);
for (const r of failed) {
  console.log(`\n${"━".repeat(80)}\n✗ ${r.name}${r.why}  (its temp folder is kept: ${r.tmp})\n${"━".repeat(80)}\n${r.out.trimEnd()}`);
}
// a committed fixture a spec changed fails the run: say which, and which specs could have
if (touched.size) {
  console.log(`\n${"━".repeat(80)}\n✗ the run changed ${touched.size} committed fixture${touched.size === 1 ? "" : "s"} (${GUARDED.map((d) => d + "/").join(", ")}) — a spec must work on a scratch copy (scripts/lib/env.mjs scratchCopy)\n${"━".repeat(80)}`);
  for (const [path, t] of touched) console.log(`  ${t.state.padEnd(2)} ${path} — ${t.was}\n     first seen when ${t.after.at(-1)} ended${t.running.length ? `, with ${t.running.join(", ")} still running` : ""}\n     specs ended by then, in order: ${t.after.join(", ")}`);
  const back = [...touched].filter(([, t]) => t.was === "clean before the run").map(([p]) => p);
  if (back.length) console.log(`  to put them back: git checkout -- ${back.map((p) => JSON.stringify(p)).join(" ")}  (an untracked one: rm it)`);
} else if (!before) console.log("\n! not a git checkout: the committed fixtures were not compared before and after");
const bad = [...failed.map((r) => r.name), ...tally.filter((t) => !t.good && !failed.some((r) => r.spec === t.spec)).map((t) => `${t.spec} (its shards' count)`)];
const total = Date.now() - started, slowest = [...results].sort((a, b) => b.ms - a.ms)[0];
const dirty = touched.size ? `, but ${touched.size} committed fixture${touched.size === 1 ? " was" : "s were"} changed: ${[...touched.keys()].join(", ")}` : "";
console.log(`\n${bad.length ? `✗ ${bad.length} of ${results.length} failed: ${bad.join(", ")}` : `${touched.size ? "✗" : "✓"} all ${results.length} passed`}${dirty} in ${secs(total)} (the slowest, ${slowest?.name}, ${secs(slowest?.ms || 0)})`);
process.exit(bad.length || touched.size ? 1 : 0);
