#!/usr/bin/env node
// The sketch page under real use (scripts/test/sketch-scenarios/, README.md there): 21 sessions written to be what
// engineers whiteboard and how they edit it (classic diagrams, heavy editing, timelines, swimlanes, grids, trees, code
// with numbered steps, alternatives, pointing, the page's link / mark / open up), each played on the real page
// (`sketch --once`, the partner off) and checked:
//   - the command exits 0 after Send with its folder; no page error; every step could be made
//   - the final drawing has each label it should (as typed, however Excalidraw wrapped it), none it should not, and
//     every arrow between the right things
//   - sketch.md tells what was done: a relabel as renamed, an erase as erased or taken back, a reroute, a restyle,
//     a frame by its name, freehand marks, pointing, a long pause
// Full run only: about 9 minutes, three at a time, at 0.6× the scenarios' own time.
// usage: node scripts/test/sketch-scenarios.spec.mjs [part of a scenario's name ...]
//   SKETCH_SCENARIOS_OUT=<dir> keeps each one's folder there (judge.mjs reads them); SKETCH_SCENARIOS_PARTNER=openrouter
//   asks the real partner too; SKETCH_SCENARIOS_SPEED=1 plays them at their own pace.
import { readdirSync, readFileSync, mkdtempSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { testPort } from "../lib/env.mjs";
import { play, check } from "./sketch-scenarios/play.mjs";

const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const DIR = new URL("./sketch-scenarios/scenarios/", import.meta.url).pathname;
const want = process.argv.slice(2);
const files = readdirSync(DIR).filter((f) => f.endsWith(".json") && (!want.length || want.some((w) => f.includes(w)))).sort().map((f) => join(DIR, f));
const out = process.env.SKETCH_SCENARIOS_OUT || mkdtempSync(join(tmpdir(), "rp-sketch-scenarios-"));
const opts = { out, partner: process.env.SKETCH_SCENARIOS_PARTNER || "off", speed: Number(process.env.SKETCH_SCENARIOS_SPEED || 0.6), env: { REELPLANNER_SKETCH_PARTNER_GAP_S: "0" } };

// what sketch.md must say for each kind of step a scenario makes
const TOLD = {
  relabel: [/_changed:_ (renamed|labeled)/, "a relabel as renamed (or labeled, when it had none)"],
  delete: [/_changed:_ (erased|took back)/, "an erase"],
  reroute: [/_changed:_ rerouted/, "a reroute"],
  restyle: [/_changed:_ restyled|\((dashed|dotted|[a-z ]*red|[a-z ]*blue|[a-z ]*green|[a-z ]*orange)/, "a restyle, or the look it left"],
  frame: [/\*\*Frames\*\*[\s\S]*- frame "/, "a frame by its name"],
  pen: [/\*\*Freehand marks\*\*/, "freehand marks with what they are on"],
  point: [/_\((traced with the pointer|pointing at)/, "pointing, with what was said then"],
  undo: [/_changed:_ (took back|brought back|erased)/, "an undo"],
  link: [/_changed:_ linked [\s\S]*\*\*Linked to code\*\*/, "a box linked to a file, and the list of links"],
  mark: [/_changed:_ marked [\s\S]*\*\*Today vs proposed\*\*/, "a box marked today, new or going, and what is proposed"],
  openup: [/_changed:_ opened up [\s\S]*opened up from it/, "a box opened up, and its frame"],
};

const queue = [...files], results = [];
async function worker(n) {
  while (queue.length) {
    const f = queue.shift();
    results.push(await play(f, { ...opts, port: testPort(8860, n) }).then((r) => ({ ...r, file: f }), (e) => ({ file: f, id: f, crash: e.message })));
  }
}
await Promise.all([0, 1, 2].slice(0, files.length).map(worker));

for (const r of results.sort((a, b) => a.file.localeCompare(b.file))) {
  const sc = JSON.parse(readFileSync(r.file, "utf8")), dir = join(out, sc.id);
  console.log(`\n${sc.id} — ${sc.title}`);
  if (r.crash) { ok(false, `${sc.id}: played — ${r.crash}`); continue; }
  ok(r.code === 0 && r.saved, `${sc.id}: --once exits 0 after Send, with its folder — ${r.code} ${String(r.out || "").trim().split("\n").pop()}`);
  ok(!r.errors.length, `${sc.id}: no page error, every step made — ${r.errors.join(" | ")}`);
  const checks = check(sc, dir), bad = checks.filter((c) => !c.ok);
  ok(!bad.length, `${sc.id}: the final drawing (${checks.length} labels and arrows)${bad.length ? ` — missing: ${bad.map((c) => c.what).join("; ")}` : ""}`);
  const md = existsSync(join(dir, "sketch.md")) ? readFileSync(join(dir, "sketch.md"), "utf8") : "";
  const kinds = new Set(sc.steps.flatMap((s) => Object.keys(s).filter((k) => k !== "t")).concat(sc.steps.some((s) => s.add?.some((e) => e.type === "frame")) ? ["frame"] : []));
  if (kinds.has("redo")) kinds.add("undo");
  const told = [...kinds].filter((k) => TOLD[k]), missing = told.filter((k) => !TOLD[k][0].test(md));
  if (told.length) ok(!missing.length, `${sc.id}: sketch.md tells ${told.map((k) => TOLD[k][1]).join("; ")}${missing.length ? ` — not told: ${missing.join(", ")}` : ""}`);
  const long = sc.steps.filter((s) => s.pause && s.pause * opts.speed >= 2.5);
  if (long.length) ok(/_paused for \d+ s_/.test(md), `${sc.id}: a long pause is told`);
}

if (fails.length) { console.log(`\n${fails.length} failed (each one's folder is in ${out})`); process.exit(1); }
console.log(`\nall passed (${results.length} scenarios)`);
