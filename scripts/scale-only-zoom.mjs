#!/usr/bin/env node
// zoom-through, scale only (the motion language, better-visuals step 2). HyperFrames' vendored
// transition registry blurs a zoom-through (filter: blur(8px) on both frames), and the theme bans blur
// ("no blur entrances"), so a video could not use the one transition that says "into this detail".
// finish-project runs this right after `transitions.mjs inject`: in the block it stamped into
// index.html, every line that is a zoom-through (matched against the registry's own template, so a
// registry change is followed) loses its filter, and the zoom is carried by scale and opacity alone.
// Every other transition is left as the registry wrote it. Re-running changes nothing.
//
// usage: reelplanning scale-only-zoom <project-dir>
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { skillsDir } from "./hyperframes-skills.mjs";

const dir = resolve(process.argv[2] || ".");
const idx = join(dir, "index.html");
if (!existsSync(idx)) { console.error(`✗ scale-only-zoom: no index.html in ${dir}`); process.exit(1); }
const regPath = process.env.REELPLANNING_TRANSITIONS || join(skillsDir(), "faceless-explainer", "scripts", "lib", "transitions.json");
let reg;
try { reg = JSON.parse(readFileSync(regPath, "utf8")); } catch { console.log(`· scale-only-zoom: no transition registry at ${regPath}; nothing to change`); process.exit(0); }
const zoom = (reg.transitions || []).find((t) => t.name === "zoom-through");
if (!zoom) { console.log("· scale-only-zoom: the registry has no zoom-through"); process.exit(0); }

const BLUR = /,?\s*filter:\s*"blur\([^)]*\)"/g;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// a template line as a pattern: its placeholders stand for whatever the injector put there, and its
// blur is optional so a line already made scale-only still matches (and is left as it is)
const pattern = (line) => new RegExp("^\\s*" + line.split(/(__[A-Z]+__|,?\s*filter:\s*"blur\([^)]*\)")/).map((p, i) =>
  i % 2 ? (p.startsWith("__") ? '[^,{}]+?' : '(?:,?\\s*filter:\\s*"blur\\([^)]*\\)")?') : esc(p)).join("") + "\\s*$");
const lines = [].concat(zoom.gsap_template || [], zoom.gsap_template_horizontal || [], zoom.gsap_template_vertical || []).map(pattern);

let html = readFileSync(idx, "utf8"), n = 0;
html = html.replace(/(frame transitions \(injected[\s\S]*?\}\)\(\);)/, (block) => block.split("\n").map((l) => {
  if (!/filter:\s*"blur\(/.test(l) || !lines.some((re) => re.test(l))) return l;
  n++;
  return l.replace(BLUR, "");
}).join("\n"));
if (n) writeFileSync(idx, html);
console.log(`✓ scale-only-zoom: ${n ? `${n} zoom-through line(s) made scale-only` : "no blurred zoom-through"}`);
