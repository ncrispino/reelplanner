#!/usr/bin/env node
// Frames started from the theme's scenes (templates/reelplanner/theme/scenes/; its README says which is for what):
// whole scenes taken from the plan and explainer videos that showed the most, each passing frame-lint as it ships, so
// a frame starts from a picture that works instead of a blank page (a bench run's frames drawn from nothing came out
// as cards of words).
//
// usage: reelplanner scene                                                  the scenes: each one's name and what it is for
//        reelplanner scene <video-dir> <frame>=<scene> [<frame>=<scene>…] [--force]     each frame's file, from its scene
//   <frame> is its number as the storyboard numbers it (`3=count 7=two-futures`). Its file is the storyboard block's
//   `- src:`, written whole: the scene in the frame's <template>, every FID made the frame's own prefix, its root with
//   the composition id, the frame's length (its voice's, else the storyboard's `- duration:`) and data-band, its
//   timeline registered and run to the frame's end (references/frames.md). The words, numbers and things in it are
//   the scene's worked example (the Dylan plan's): replace every one with your plan's, then put the times on your
//   cues. A file already there is left alone unless --force; nothing is written unless every pair is good.
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve, dirname, relative, basename } from "node:path";
import { ROOT } from "./lib/env.mjs";
import { storyboardFrames } from "./lib/terms.mjs";

const SCENES = join(ROOT, "templates", "reelplanner", "theme", "scenes");
const args = process.argv.slice(2), force = args.includes("--force"), [target, ...pairs] = args.filter((a) => !a.startsWith("--"));
const usage = "usage: reelplanner scene <video-dir> <frame>=<scene> [<frame>=<scene>…] [--force]";
const die = (m) => { console.error(`✗ scene: ${m}`); process.exit(1); };
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const shown = (p) => (p.startsWith(process.cwd() + "/") ? relative(process.cwd(), p) : p);   // a path as the person would type it
const all = readdirSync(SCENES).filter((f) => f.endsWith(".html")).map((f) => f.slice(0, -5)).sort();
// what a scene is for: the first sentence of its header, after its name
const about = (n) => (/<!--\s*[A-Z ]+:\s*([^.(]+)/.exec(read(join(SCENES, `${n}.html`))) || [])[1]?.replace(/\s+/g, " ").trim() || "";

if (!target) {
  console.log(`The theme's scenes (${shown(SCENES)}/README.md says when each fits):\n`);
  for (const n of all) console.log(`  ${n.padEnd(12)} ${about(n)}`);
  console.log(`\nreelplanner scene <video-dir> <frame>=<scene> … writes each frame's file from its scene; replace the example with your plan's.`);
  process.exit(0);
}
if (!pairs.length) die(usage);
const dir = resolve(target), sb = read(join(dir, "STORYBOARD.md"));
if (!sb) die(`no STORYBOARD.md in ${target}: write the storyboard first`);
const frames = storyboardFrames(sb), have = frames.map((x) => x.index).sort((a, b) => a - b);
let meta = null; try { meta = JSON.parse(read(join(dir, "audio_meta.json"))); } catch {}

// every pair checked before anything is written
const jobs = pairs.map((p) => {
  const [frameArg, name] = p.split("=");
  if (!name) die(`"${p}" is not <frame>=<scene> (${usage.replace("usage: ", "")})`);
  if (!all.includes(name)) die(`no scene "${name}" (the scenes: ${all.join(", ")})`);
  const n = Number(frameArg), f = frames.find((x) => x.index === n);
  if (!Number.isInteger(n) || !f) die(`no frame ${frameArg} in the storyboard (it has ${have.join(", ")})`);
  if (!f.meta.src) die(`frame ${n} has no \`- src:\` line in the storyboard: give it its file (compositions/frames/<NN>-<slug>.html)`);
  const file = join(dir, f.meta.src);
  if (existsSync(file) && !force) die(`${shown(file)} is there already (--force to replace it)`);
  // the frame's length: its voice, else the storyboard's, else 10 s until sync-durations sets it
  const voice = meta?.voices?.find((v) => Number(v.frame) === n);
  const dur = Number(voice?.duration_s) || parseFloat(f.meta.duration) || 10;
  return { n, name, file, dur, from: voice ? "its voice" : f.meta.duration ? "the storyboard's" : "until sync-durations sets it" };
});
if (new Set(jobs.map((j) => j.n)).size < jobs.length) die("a frame is named twice");

function frameFrom({ name, file, dur }) {
  const id = basename(file, ".html"), src = read(join(SCENES, `${name}.html`)).replaceAll("FID", `f${id}`);
  const style = (src.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || "";
  const script = ((src.match(/<script>([\s\S]*?)<\/script>/) || [])[1] || "").split("\n")
    .filter((l) => !/^\s*\/\/ (inside the frame's|after `var tl)/.test(l)).join("\n").replace(/^\n+|\s+$/g, "");
  const markup = src.replace(/<!--[\s\S]*?-->/, "").replace(/<style>[\s\S]*?<\/style>/, "").replace(/<script>[\s\S]*?<\/script>/, "").trim();
  // the scene's header, without how to start a frame from it (this is that frame): what it is for, how it moves
  const head = ((/<!--([\s\S]*?)-->/.exec(src) || [])[1] || "").replace(/Start a frame from it with[\s\S]*?\)\.\s*/, "").replace(/^\s+|\s+$/g, "");
  return `<template>
<!-- Started from the theme's ${name} scene (reelplanner scene). Its words, numbers and things are the scene's worked
     example: replace every one with this plan's, and put the times on this frame's cues.

     ${head} -->
<style>
  #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--rp-paper); }
${style.replace(/^\n+|\s+$/g, "")}
</style>
<div id="root" data-composition-id="${id}" data-width="1920" data-height="1080" data-duration="${dur.toFixed(2)}" data-band="bottom">
${markup.split("\n").map((l) => (l ? `  ${l}` : l)).join("\n")}
</div>
<script src="assets/vendor/gsap.min.js"></script>
<script>
(function () {
  var ID = "${id}";
  window.__timelines = window.__timelines || {};
  var tl = gsap.timeline({ paused: true });
  window.__timelines[ID] = tl;
  var DUR = ${dur.toFixed(2)};
${script}
  tl.to({}, { duration: 0.001 }, DUR - 0.001);   // the timeline runs to the frame's end
})();
</script>
</template>
`;
}

for (const j of jobs) {
  mkdirSync(dirname(j.file), { recursive: true });
  writeFileSync(j.file, frameFrom(j));
  console.log(`✓ frame ${j.n}: ${shown(j.file)}, the ${j.name} scene, ${j.dur.toFixed(2)} s (${j.from})`);
}
console.log(`next: replace each example (the Dylan plan's) with this plan's words and things, put the times on the cues, then
  reelplanner frame-check ${dir === process.cwd() ? "." : shown(dir)} ${jobs.map((j) => j.n).join(" ")}`);
