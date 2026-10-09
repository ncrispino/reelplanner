#!/usr/bin/env node
// Start a page a scene opens over the video (deep-dives step 2): copy a template into <video-dir>/details/<name>.html and
// print the storyboard tags that link it to a beat. The templates are starting points; a kind with no
// template of its own (or none given) starts from `fresh` (D-024, D-085).
//
// usage: reelplanner detail new <video-dir> <name> [--kind <kind>] [--data <file.json>] [--force]
//        reelplanner detail kinds
//        reelplanner detail restyle <video-dir> [<name> …]
//   restyle  bring pages already built up to today's templates: their rp-theme script, token block (the
//            player's paper, inks, coral and faces) and rp-bridge are replaced by the templates'; the page's
//            own content and styles are left as they are. No video rebuild: the pages are read as they are.
//   --data   fill the template's JSON block from a file (table, evidence, code, explore, try)
// Then fill it, tag the beat (- detail: <name>, - detail_title, - detail_why, optionally - detail_kind)
// and run `reelplanner check-details <video-dir>`.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/env.mjs";
import { KINDS, NAME } from "./lib/details.mjs";

const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };
// what restyle replaces: the rp-theme script, the token block up to the page's own first rule, and the bridge (v2: a
// selection opens the player's note box, and the page says its height, so it can sit in its guide's full page too)
const RESTYLE = [/<script>\n\/\* rp-theme:[\s\S]*?<\/script>\n/, /\/\* the player's tokens[\s\S]*?\n(?=\/\* one calm page)/, /<script>\n\/\* rp-bridge v\d:[\s\S]*?<\/script>\n/];
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : null; };
const pos = argv.filter((a, i) => !a.startsWith("--") && !["--kind", "--data"].includes(argv[i - 1]));
const [cmd, videoDir, name] = pos;

if (cmd === "kinds") { for (const [k, v] of Object.entries(KINDS)) console.log(`${k.padEnd(10)} ${v}`); process.exit(0); }
if (cmd === "restyle") {
  if (!videoDir) die("usage: reelplanner detail restyle <video-dir> [<name> …]");
  const dir = join(videoDir, "details");
  if (!existsSync(dir)) { console.log(`✓ ${videoDir}: no details`); process.exit(0); }
  const tpl = readFileSync(join(ROOT, "templates", "details", "fresh.html"), "utf8");
  const blocks = RESTYLE.map((re) => tpl.match(re)?.[0]);
  if (blocks.some((b) => !b)) die("templates/details/fresh.html has lost its rp-theme script, its token block or its bridge");
  const names = pos.slice(2), files = names.length ? names.map((n) => `${n}.html`) : readdirSync(dir).filter((f) => f.endsWith(".html")).sort();
  let changed = 0;
  for (const f of files) {
    const file = join(dir, f);
    if (!existsSync(file)) die(`${file} does not exist`);
    const was = readFileSync(file, "utf8");
    if (RESTYLE.some((re) => !re.test(was))) { console.log(`  ! details/${f}: no rp-theme script, token block or bridge from a template: left as it is`); continue; }
    const now = RESTYLE.reduce((h, re, i) => h.replace(re, () => blocks[i]), was);
    if (now !== was) { writeFileSync(file, now); changed++; }
    console.log(`  ${now !== was ? "restyled " : "unchanged"} details/${f}`);
  }
  console.log(`✓ ${changed} of ${files.length} page(s) restyled from the templates. Their own styles are as they were: coral is only for the call and the part a comment is on. Then run: reelplanner check-details ${videoDir}`);
  process.exit(0);
}
if (cmd !== "new" || !videoDir || !name) die("usage: reelplanner detail new <video-dir> <name> [--kind <kind>] [--data <file.json>] [--force]   (reelplanner detail kinds: the templates; detail restyle <video-dir>: pages already built, to today's look)");
const kind = opt("kind") || "fresh";
if (!/^[a-z0-9][a-z0-9-]*$/.test(kind)) die(`--kind "${kind}": a word of lower-case letters, digits and dashes`);
const template = kind in KINDS ? kind : "fresh";
if (!NAME.test(name)) die(`"${name}": a detail's name is lower-case letters, digits and dashes (it is the file name and the storyboard tag)`);
if (!existsSync(join(videoDir, "STORYBOARD.md")) && !existsSync(join(videoDir, "index.html"))) die(`${videoDir}: not a video project (no STORYBOARD.md)`);
const out = join(videoDir, "details", `${name}.html`);
if (existsSync(out) && !argv.includes("--force")) die(`${out} exists (--force to replace it)`);

let html = readFileSync(join(ROOT, "templates", "details", `${template}.html`), "utf8");
// the JSON block: `<` is written \u003c so a string can never close the <script> it sits in
const fill = (data) => {
  if (!/<script id="rp-data" type="application\/json">[\s\S]*?<\/script>/.test(html)) die(`the ${template} template has no JSON block to fill`);
  html = html.replace(/(<script id="rp-data" type="application\/json">)[\s\S]*?(<\/script>)/, (_, a, b) => `${a}\n${JSON.stringify(data, null, 2).replace(/</g, "\\u003c")}\n${b}`);
};
if (opt("data")) { let d; try { d = JSON.parse(readFileSync(opt("data"), "utf8")); } catch (e) { die(`--data ${opt("data")}: ${e.message}`); } fill(d); }
mkdirSync(join(videoDir, "details"), { recursive: true });
writeFileSync(out, html);
console.log(`✓ ${out} (${template === kind ? `${kind}: ${KINDS[kind]}` : `${kind}, from the fresh template: ${KINDS.fresh}`})`);
console.log(`  ${opt("data") ? "Check its content" : "Fill it: the slots are listed in the comment at its top"}, then tag the beat in STORYBOARD.md:
    - detail: ${name}
    - detail_kind: ${kind}   (optional: the word the panel shows)
    - detail_title: <what the panel's header says>
    - detail_why: <the one sentence the narration says about what opening it gives you that the video does not>
  and run: reelplanner check-details ${videoDir}`);
