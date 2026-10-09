#!/usr/bin/env node
// What changed in a project's description of itself since the system video was last built, and so
// which of its scenes to rebuild (close-the-lifecycle, step 6).
//
// The system video is made from three files: spec.md (prose), system.json (parts, edges,
// pipelines, where each part sits on the stage) and glossary.md (the names). Each of its frames is
// tagged with what it explains — `- spec_section: <## heading in spec.md>` and
// `- components: <id>, <id>` in its STORYBOARD.md. This compares the three files against the commit
// that last touched the system video and names the frames whose tags meet a change: a glossary row's
// change reaches the frames that show its part and the beat that explains it (`- defines: <term>`), a row
// whose meaning alone was reworded only that beat, and a
// row no beat of the system video explains yet (a new one, say) is named as behind. Everything else
// is left alone, which is what keeps a frame's id — and plan-diff's "only what changed" — intact. The
// glossary's "Other words" (D-216) are meanings only: a change there is listed apart and rebuilds nothing.
// It also says what the update costs: how many lines have to be narrated again, and for how long.
//
// usage: reelplanning spec-diff [<repo or .reelplanning dir>] [--since <git rev>] [--json]
//   --since   compare against this revision instead of the system video's last commit
//   --json    print the full result as JSON
import { readFileSync, existsSync } from "node:fs";
import { resolve, join, dirname, basename, relative } from "node:path";
import { execFileSync } from "node:child_process";
import { narrationCost, costSentence } from "./lib/narration.mjs";
import { parseGlossary, rowFor, listOf } from "./lib/terms.mjs";
import { realPath } from "./lib/env.mjs";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const pos = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--since");
let rp = resolve(pos[0] || ".");
for (let i = 0; i < 6 && basename(rp) !== ".reelplanning"; i++) { if (existsSync(join(rp, ".reelplanning"))) { rp = join(rp, ".reelplanning"); break; } rp = dirname(rp); }
if (basename(rp) !== ".reelplanning") { console.error(`✗ no .reelplanning/ at or above ${pos[0] || "."}`); process.exit(1); }
rp = realPath(rp);   // as git names it, so its paths below are inside git's top (not /var/… for /private/var/…)

const git = (...a) => { try { return execFileSync("git", ["-C", rp, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); } catch { return ""; } };
const top = git("rev-parse", "--show-toplevel");
const sv = join(rp, "system-video");
// the video's last build: a commit that only rendered it to MP4 (renders/, and the .gitignore that tracks them) is not one
const since = flag("since") || (top ? git("log", "-1", "--format=%H", "--", sv, `:(exclude)${join(sv, "renders")}`, `:(exclude)${join(sv, ".gitignore")}`) : "");
const then = (f) => (since && top ? (() => { try { return execFileSync("git", ["-C", top, "show", `${since}:${relative(top, join(rp, f))}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { return ""; } })() : "");
const now = (f) => (existsSync(join(rp, f)) ? readFileSync(join(rp, f), "utf8") : "");

const diff = (a, b) => {
  const out = { added: [], changed: [], removed: [] };
  for (const k of Object.keys(b)) if (!(k in a)) out.added.push(k); else if (JSON.stringify(a[k]) !== JSON.stringify(b[k])) out.changed.push(k);
  for (const k of Object.keys(a)) if (!(k in b)) out.removed.push(k);
  return out;
};
const sections = (md) => Object.fromEntries(md.split(/\n(?=## )/).filter((s) => s.startsWith("## ")).map((s) => [s.match(/^## (.+)$/m)[1].trim(), s.replace(/^## .+\n/, "").trim()]));
const sys = (s) => { try { return JSON.parse(s || "{}"); } catch { return {}; } };
const byId = (list) => Object.fromEntries((list || []).map((x) => [x.id, x]));
const edges = (s) => Object.fromEntries((s.edges || []).map((e) => [`${e.from}→${e.to}`, e]));
// a glossary row by its key (the term's first form), whether or not it has a system.json id. A row under
// "Other words" (D-216) is a meaning only: the system video never explains it, so adding, changing or
// removing one is not a change the video is behind on (`other` lists them apart)
const glossary = (md) => Object.fromEntries(parseGlossary(md).filter((g) => !g.other).map((g) => [g.forms[0], g]));
const otherWords = (md) => Object.fromEntries(parseGlossary(md).filter((g) => g.other).map((g) => [g.forms[0], g]));

const [s0, s1] = [sys(then("system.json")), sys(now("system.json"))];
const r = {
  since: since || null,
  sections: diff(sections(then("spec.md")), sections(now("spec.md"))),
  components: diff(byId(s0.components), byId(s1.components)),
  edges: diff(edges(s0), edges(s1)),
  pipelines: diff(byId(s0.pipelines), byId(s1.pipelines)),
  glossary: diff(glossary(then("glossary.md")), glossary(now("glossary.md"))),
  other: diff(otherWords(then("glossary.md")), otherWords(now("glossary.md"))),
};
const touched = (d) => [...d.added, ...d.changed, ...d.removed];
const rowsNow = glossary(now("glossary.md")), rowsThen = glossary(then("glossary.md"));
const idOf = (k) => (rowsNow[k] || rowsThen[k])?.id;
// a row added or removed, or given another part, reaches the frames that show its part; a row whose meaning alone was
// reworded reaches only the beat that explains it (a frame that shows the part shows its name, not the glossary's sentence)
const reworded = (k) => rowsNow[k] && rowsThen[k] && rowsNow[k].id === rowsThen[k].id && JSON.stringify(rowsNow[k].forms) === JSON.stringify(rowsThen[k].forms) && rowsNow[k].display === rowsThen[k].display;
const comps = new Set([...touched(r.components), ...touched(r.glossary).filter((k) => !reworded(k)).map(idOf).filter(Boolean), ...touched(r.edges).flatMap((k) => k.split("→"))]);
const words = new Set(touched(r.glossary));
const secs = new Set(touched(r.sections));
if (touched(r.pipelines).length) secs.add("Pipelines");

// the system video's frames whose tags meet a change
const sbPath = join(sv, "STORYBOARD.md");
const defined = new Set();
r.frames = !existsSync(sbPath) ? null : readFileSync(sbPath, "utf8").split(/\n(?=## Frame )/).slice(1).map((b) => {
  const head = b.match(/^## Frame (\d+) — (.+)$/m); const tag = (k) => (b.match(new RegExp(`^- ${k}:\\s*(.+)$`, "m")) || [])[1];
  const fc = (tag("components") || "").split(/[,\s]+/).filter(Boolean); const fs = (tag("spec_section") || "").trim();
  const defs = listOf(tag("defines")).map((w) => rowFor(Object.values(rowsNow), w)?.forms[0] || w.toLowerCase());
  for (const d of defs) defined.add(d);
  const why = [...(fs && secs.has(fs) ? [`spec: ${fs}`] : []), ...fc.filter((c) => comps.has(c)).map((c) => `part: ${c}`), ...defs.filter((d) => words.has(d)).map((d) => `word: ${d}`)];
  return head && why.length ? { frame: Number(head[1]), title: head[2].trim(), why } : null;
}).filter(Boolean);
// the glossary rows no beat of the system video explains: the video is behind on each until one does
r.undefined = r.frames === null ? [] : Object.keys(rowsNow).filter((k) => !defined.has(k));
// what the update costs to narrate: the lines of those frames plus any line already edited and not yet
// voiced — every other line keeps its voice (`reelplanning narrate`), so this, not the video's length, is the cost
const cost = r.frames && narrationCost(sv, r.frames.map((f) => f.frame));
r.narration = cost ? { ...cost, sentence: costSentence(cost) } : null;

if (args.includes("--json")) { console.log(JSON.stringify(r, null, 2)); process.exit(0); }
const line = (label, d) => { const t = [...d.added.map((k) => `+${k}`), ...d.changed.map((k) => `~${k}`), ...d.removed.map((k) => `-${k}`)]; return t.length ? `  ${label}: ${t.join(", ")}` : null; };
console.log(since ? `since ${since.slice(0, 7)} (the system video's last commit${flag("since") ? ", overridden by --since" : ""}):` : "no system video yet — everything below is new:");
const lines = [line("spec.md", r.sections), line("parts", r.components), line("edges", r.edges), line("pipelines", r.pipelines), line("glossary", r.glossary)].filter(Boolean);
console.log(lines.length ? lines.join("\n") : "  nothing changed");
if (touched(r.other).length) console.log(`  (other words, meanings only, which the video need not explain: ${line("glossary", r.other).replace(/^\s*glossary: /, "")})`);
if (r.frames === null) console.log("· no system-video/STORYBOARD.md to match against");
else if (r.undefined.length) console.log(`words no beat explains yet: ${r.undefined.join(", ")} — add a beat, or a sentence to the beat that fits, tagged \`- defines: <term>\``);
if (r.frames !== null) console.log(r.frames.length ? `frames to rebuild:\n${r.frames.map((f) => `  ${f.frame} — ${f.title} (${f.why.join("; ")})`).join("\n")}` : "✓ no system-video frame explains anything that changed");
if (r.narration) console.log(`cost: ${r.narration.sentence}${r.narration.lines.length ? ` (\`reelplanning narrate ${relative(process.cwd(), sv) || "."}\` voices just those)` : ""}`);
