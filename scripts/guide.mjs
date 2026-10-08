#!/usr/bin/env node
// The plan guide (plan 2026-09-28-plan-guide): build a video's guide, the page behind the video that shows more than it
// can and that you work with. Made from plan.md (D-244: the one source), the ledger and the plan map, and after the build
// from walkthrough.md, git and runs/; for an explainer, from its pinned sources. Nothing is typed in, and nothing it
// writes is committed (D-213): `reelplanning build` writes it again, after the plan map, and bundle-player publishes it.
//
//   <video-dir>/guide/index.html    the full page: every part in one flow, "Watch this moment" back to the player
//   <video-dir>/guide/<part>.html   each part, which the local review page opens over the paused frame (a scene's
//                                   `- guide: <part>`); a bundled page reads it in the guide under the video instead,
//                                   and bundle-player leaves these out
//   <video-dir>/guide/parts.json    the parts, their titles and steps, and the gaps
//   <video-dir>/guide/pics/         the pictures the pages show (a step's scene), at 1×, 2× and whole (lib/guide/pictures.mjs)
//
// A plan's parts: step-<n> (each step: its cases, interface, example, decisions, question; its Built side), decisions,
// and after the build what-changed, one a category of change, and choices. An explainer's: sources, and source-<id> for
// each source that needs one (sources.json: needsPart, or guide, true). A plan folder builds each of its videos' guides
// (or, with no video yet, <plan-dir>/guide/index.html). The system video has no guide.
//
// usage: reelplanning guide <video-dir | plan-dir | explainer-dir> [--check] [--out <file>] [--quiet] [--no-thumbs] [--outside]
//   --check      also check the page as built, and list what plan.md does not say (exit 1 on a failure, never on a gap)
//   --out        write the full page to this file instead (no parts)
//   --no-thumbs  leave the scenes' pictures out (quicker; the page says each is missing)
//   --outside    an explainer: put the text of a source kept outside the repo in the page, masked (for this machine only)
import { existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, join, relative, resolve } from "node:path";
import { guideTarget, buildModel } from "./lib/guide/model.mjs";
import { guideHtml, fontsFrom } from "./lib/guide/page.mjs";
import { checkGuide } from "./lib/guide/check.mjs";

const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : null; };
const flag = (k) => argv.includes(`--${k}`);
const pos = argv.filter((a, i) => !a.startsWith("--") && argv[i - 1] !== "--out");
if (!pos.length) { console.error("usage: reelplanning guide <video-dir | plan-dir | explainer-dir> [--check] [--out <file>] [--quiet] [--no-thumbs] [--outside]"); process.exit(1); }
const quiet = flag("quiet"), say = (s) => { if (!quiet) console.log(s); };
const kb = (s) => `${Math.max(1, Math.round(Buffer.byteLength(s) / 1024)).toLocaleString()} KB`;
// a page written whole or not at all: a bundle copying the guide as it is built again (two at once, side by side in the
// tests) never reads half a page, nor finds a part gone that it had just listed
const put = (f, s) => { const tmp = `${f}.${process.pid}.tmp`; writeFileSync(tmp, s); renameSync(tmp, f); };

let failed = 0;
for (const arg of pos) {
  const t0 = guideTarget(arg);
  const targets = t0.kind === "plan" ? t0.many.filter((x) => x.kind !== "none") : [t0];
  if (t0.kind === "none") { console.log(`· ${t0.why}`); continue; }
  for (const t of targets) {
    const started = Date.now();
    const out = opt("out") ? resolve(opt("out")) : join(t.outDir, "index.html");
    // (the pictures are files in <guide>/pics/, pointed at from where the page is: lib/guide/pictures.mjs)
    const model = await buildModel(t, { thumbs: !flag("no-thumbs"), outside: flag("outside"), pageDir: dirname(out) });
    const G = model.data, rel = (p) => relative(process.cwd(), p) || ".";
    G.partNames = model.parts.map((p) => p.name);
    mkdirSync(dirname(out), { recursive: true });
    const full = guideHtml(G, { title: `Guide · ${G.title}`, fontsBase: fontsFrom(dirname(out)) });
    put(out, full);
    const partFiles = [];
    if (!opt("out") && t.kind !== "plan-only") {
      // the parts; then stale ones from an earlier build go (a category renamed, a step removed)
      for (const p of model.parts) { const html = guideHtml({ ...p.data, partNames: G.partNames }, { part: p.name, title: p.title }); put(join(t.outDir, `${p.name}.html`), html); partFiles.push(join(t.outDir, `${p.name}.html`)); }
      const now = new Set(model.parts.map((p) => `${p.name}.html`));
      for (const f of existsSync(t.outDir) ? readdirSync(t.outDir) : []) if (/\.html$/.test(f) && f !== "index.html" && !now.has(f)) rmSync(join(t.outDir, f), { force: true });
    }
    writeFileSync(join(dirname(out), opt("out") ? `${basename(out, ".html")}.parts.json` : "parts.json"), JSON.stringify({ built: new Date().toISOString(), title: G.title, kind: G.kind, own: G.own,
      parts: model.parts.map(({ name, title, kind, planStep }) => ({ name, title, kind, planStep })), gaps: G.gaps }, null, 2) + "\n");
    const what = G.kind === "plan" ? `${G.steps.length} steps, ${G.steps.reduce((a, s) => a + s.questions.length, 0)} questions${G.built ? `, built: ${G.built.cats.length} kinds of change, ${G.built.totals.files} files, ${Object.keys(G.built.runs).length} runs` : ""}` : `${G.sources.length} sources, ${G.sources.filter((s) => s.part).length} with a part`;
    const gaps = G.gaps.filter((g) => !g.fail);
    say(`✓ ${rel(out)} · ${what}, ${kb(full)}${partFiles.length ? ` · ${partFiles.length} parts` : ""}${gaps.length ? ` · ${gaps.length} gap${gaps.length === 1 ? "" : "s"} shown on the page` : ""} · ${((Date.now() - started) / 1000).toFixed(1)} s`);
    if (flag("check")) {
      const r = await checkGuide({ model, outDir: dirname(out), full: out, partFiles });
      for (const o of r.oks) say(`  ✓ ${o}`);
      if (r.unopened) console.log(`  △ ${r.unopened}`);
      for (const f of r.fails) console.log(`  ✗ ${f}`);
      if (r.gaps.length) say(`  gaps, shown on the page (listed, not failed): ${r.gaps.slice(0, 12).map((g) => `${g.where}: ${g.what}`).join("; ")}${r.gaps.length > 12 ? `; and ${r.gaps.length - 12} more (parts.json)` : ""}`);
      if (r.fails.length) { failed += r.fails.length; console.log(`✗ guide --check ${rel(t.videoDir || t.planDir)}: ${r.fails.length} failure(s)`); }
    }
  }
}
process.exit(failed ? 1 : 0);
