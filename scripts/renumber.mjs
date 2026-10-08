#!/usr/bin/env node
// `reel renumber` (the contributing plan, step 4; D-171): decision numbers stay in order across the repo,
// and the PR merged second fixes the clash. Run on the branch, once `git rebase <base>` (or a merge of it)
// stops at a conflict in .reelplanning/decisions.json, or any time the branch's new ids clash with the
// base's (`reel pr-check` says so):
//
//   - takes the base's log as it is, and adds the branch's own new entries after its last, in their order
//     (the branch's D-194 becomes D-195 when the base has a D-194 of its own);
//   - a base entry the branch superseded is marked so, by the new id;
//   - rewrites the new entries' ids where the branch's plan folders mention them: plan.md,
//     walkthrough.md, reviews/*.md;
//   - lists the video frames that still say an old id (`reelplanning build` rebuilds them once their text
//     says the new one);
//   - writes decisions.md from the log, and terms-index.json again from every storyboard (a conflict in
//     it is never merged by hand).
//
// The branch's log is read from the working tree, or, while decisions.json is in conflict, from whichever
// side of the conflict holds the entries the base does not. An entry is the branch's own when the base
// holds no entry that decided the same thing (the same plan, question, date and answer), whatever its id.
//
// usage: reelplanning renumber [<repo>] [--base <ref>] [--dry-run]
//   --base      the log to build on (default origin/main)
//   --dry-run   say what would change, write nothing
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { writeLedger, entryKey } from "./lib/contributing.mjs";
import { ROOT as PKG, rpInitialized } from "./lib/env.mjs";

const argv = process.argv.slice(2);
const flag = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
const pos = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--base");
const dry = argv.includes("--dry-run");
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };
let ROOT;
try { ROOT = execFileSync("git", ["-C", resolve(pos[0] || "."), "rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
catch { die(`${resolve(pos[0] || ".")} is not in a git repo`); }
const git = (...a) => { try { return execFileSync("git", ["-C", ROOT, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], maxBuffer: 256 << 20 }); } catch { return null; } };
const RP = join(ROOT, ".reelplanning"), LOG = ".reelplanning/decisions.json", rel = (p) => relative(process.cwd(), p) || ".";
if (!rpInitialized(RP)) die(`${existsSync(RP) ? `${RP} is not set up yet (no decisions.json): nothing to renumber` : `no .reelplanning/ in ${ROOT}`}`);
const base = flag("base") || "origin/main";
const parse = (t) => { try { const j = JSON.parse(t); return Array.isArray(j?.decisions) ? j : null; } catch { return null; } };
const baseLog = parse(git("show", `${base}:${LOG}`));
if (!baseLog) die(`no decision log on ${base} (${LOG}): fetch it, or pass --base <ref>`);

const onBase = new Set(baseLog.decisions.map(entryKey));
const ownOf = (log) => log.decisions.filter((d) => !onBase.has(entryKey(d)));
// the branch's log: the file, or in a conflict the side (stage 2 or 3) holding entries the base does not
let branchLog = parse(existsSync(join(ROOT, LOG)) ? readFileSync(join(ROOT, LOG), "utf8") : "");
let from = "the working tree";
if (!branchLog) {
  const sides = [2, 3].map((n) => ({ n, log: parse(git("show", `:${n}:${LOG}`)) })).filter((s) => s.log);
  const side = sides.sort((a, b) => ownOf(b.log).length - ownOf(a.log).length)[0];
  if (!side) die(`${LOG} is neither JSON nor in a conflict git can show both sides of`);
  branchLog = side.log; from = `the ${side.n === 2 ? "ours" : "theirs"} side of the conflict`;
}
const own = ownOf(branchLog);
if (!own.length) { console.log(`✓ no entry of this branch's own: the log is ${base}'s (${baseLog.decisions.length} entries)`); process.exit(0); }

// ids from the base's last on, in the branch's order
const num = (id) => Number(String(id).replace(/^D-/, "")) || 0;
let n = Math.max(0, ...baseLog.decisions.map((d) => num(d.id)));
const map = new Map();
for (const d of own) map.set(d.id, `D-${String(++n).padStart(3, "0")}`);
const moved = [...map].filter(([a, b]) => a !== b);
const sub = (id) => map.get(id) || id;
// every mention at once, so D-194 → D-195 and D-195 → D-196 never chain
const ids = [...map.keys()].filter((k) => map.get(k) !== k);
const re = ids.length ? new RegExp(`\\b(${ids.map((x) => x.replace(/[-]/g, "\\-")).join("|")})\\b`, "g") : null;
const rewrite = (text) => (re ? text.replace(re, (m) => map.get(m)) : text);

// the log: the base's entries (a supersession by the branch carried over), then the branch's own, renumbered
const byKey = new Map(branchLog.decisions.map((d) => [entryKey(d), d]));
const merged = baseLog.decisions.map((d) => {
  const b = byKey.get(entryKey(d));
  if (b && b.status !== d.status && b.supersededBy && map.has(b.supersededBy)) return { ...d, status: b.status, supersededBy: sub(b.supersededBy), supersededOn: b.supersededOn };
  // superseded by one of the branch's plans as a whole (no decision to renumber)
  if (b && b.status !== d.status && !b.supersededBy && b.supersededByPlan && d.status === "active") return { ...d, status: b.status, supersededByPlan: b.supersededByPlan, supersededOn: b.supersededOn };
  // folded into spec.md on the branch (`reel fold --apply`, D-306)
  if (b && b.status === "folded" && d.status === "active") return { ...d, status: "folded", foldedInto: b.foldedInto, foldedOn: b.foldedOn };
  return d;
});
for (const d of own) merged.push({ ...d, id: sub(d.id), ...(d.supersededBy ? { supersededBy: sub(d.supersededBy) } : {}), supersedes: (d.supersedes || []).map(sub) });
const ledger = { ...baseLog, decisions: merged };

// the plan folders the branch's entries belong to: their text says the new ids
const plans = [...new Set(own.map((d) => d.plan))].filter((p) => existsSync(join(RP, "plans", p)));
const edits = [], frames = [];
for (const p of plans) {
  const dir = join(RP, "plans", p);
  const texts = ["plan.md", "walkthrough.md", ...(existsSync(join(dir, "reviews")) ? readdirSync(join(dir, "reviews")).filter((f) => f.endsWith(".md")).map((f) => `reviews/${f}`) : [])];
  for (const f of texts) {
    const path = join(dir, f); if (!existsSync(path)) continue;
    const t = readFileSync(path, "utf8"), u = rewrite(t);
    if (t !== u) { edits.push(rel(path)); if (!dry) writeFileSync(path, u); }
  }
  // what a video says is rebuilt, not rewritten: list the frames still saying an old id
  for (const v of ["video", "walkthrough-video"]) {
    const vd = join(dir, v); if (!existsSync(vd) || !re) continue;
    const walk = (d) => readdirSync(d).flatMap((f) => { const q = join(d, f); return statSync(q).isDirectory() ? (["assets", "node_modules", "renders", "snapshots", "capture"].includes(f) ? [] : walk(q)) : [q]; });
    for (const f of walk(vd).filter((q) => /\.(md|html)$/.test(q))) {
      readFileSync(f, "utf8").split("\n").forEach((line, i) => { const hit = line.match(re); if (hit) frames.push(`${rel(f)}:${i + 1} says ${[...new Set(hit)].join(", ")}`); });
    }
  }
}

console.log(`${dry ? "· would take" : "✓ took"} ${base}'s log (${baseLog.decisions.length} entries, the last ${baseLog.decisions.at(-1)?.id || "none"}) and ${dry ? "add" : "added"} this branch's ${own.length} after it, read from ${from}`);
console.log(moved.length ? `${dry ? "· would renumber" : "✓ renumbered"}: ${moved.map(([a, b]) => `${a} → ${b}`).join(", ")}` : "· no id changes: this branch's entries already follow the base's last");
if (edits.length) console.log(`${dry ? "· would rewrite" : "✓ rewrote"} their mentions in ${edits.join(", ")}`);
if (frames.length) console.log(`△ the videos still say an old id; change these lines, then \`reelplanning build\` their video:\n${frames.map((f) => `  ${f}`).join("\n")}`);
if (dry) process.exit(0);
writeLedger(RP, ledger);
console.log(`✓ ${rel(join(RP, "decisions.json"))} and decisions.md: ${merged.length} entries`);
// the terms index is never merged by hand: written again from every storyboard, both branches' words included
try { execFileSync(process.execPath, [join(PKG, "scripts", "terms-index.mjs"), RP], { stdio: "inherit" }); } catch { console.log("△ terms-index did not run: run `reelplanning terms-index .reelplanning`"); }
console.log(`next: \`git add .reelplanning\`, then \`git rebase --continue\` (or commit the merge), and \`reel pr-check\``);
