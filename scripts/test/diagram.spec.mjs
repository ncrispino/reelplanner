#!/usr/bin/env node
// `reelplanner diagram` on a scratch copy of the diagram kit's example (videos/d1-locker-ring), with word times made
// up from its script, so no voice is needed:
//   - --silent writes every frame with no anchor or placeholder left, the kit's moves and gsap beside them, and the
//     kit's caption skin; a video's own caption skin is kept
//   - with word times, each @@phrase@@ lands on its word (+ an offset), @@END@@ on the line's end, and each scene's
//     tail goes into .hyperframes/holds.json as its line plus the tail
//   - a phrase the line does not say fails, naming it
//   - an actor colour too light to read is darkened (hue and saturation kept) to at least 4.6:1 on the paper
//   - the frames pass frame-lint (no hex literal, no stand-in bars, no slot left)
import { spawnSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";

const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const tmp = mkdtempSync(join(tmpdir(), "rp-diagram-")), V = join(tmp, "v");
const SRC = join(ROOT, "videos", "d1-locker-ring");
cpSync(SRC, V, { recursive: true, filter: (p) => !/[\\/](compositions|assets|renders|snapshots|player|\.hyperframes)([\\/]|$)/.test(p.slice(SRC.length)) });
const run = (...a) => spawnSync(process.execPath, [join(ROOT, "bin", "reelplanner.mjs"), ...a], { encoding: "utf8" });
const frames = () => readdirSync(join(V, "compositions", "frames")).sort();
const frame = (f) => readFileSync(join(V, "compositions", "frames", f), "utf8");

// 1. silent
let r = run("diagram", V, "--silent");
ok(r.status === 0, `--silent exits 0 ${r.status ? r.stdout + r.stderr : ""}`);
ok(frames().join() === "01-title.html,02-ring.html,03-ways.html,04-check.html", `four frames, named as the scenes (${frames().join()})`);
ok(frames().every((f) => !/@@|\{\{/.test(frame(f))), "no anchor or placeholder left in any frame");
ok(existsSync(join(V, "assets/diagram/kit.js")) && existsSync(join(V, "assets/vendor/gsap.min.js")), "the kit's moves and gsap copied beside the frames");
ok(readFileSync(join(V, ".hyperframes/caption-skin.html"), "utf8").includes("caption-pill"), "the kit's caption skin copied in");
ok(/data-label>Ben’s key opens locker 1</.test(frame("02-ring.html")) && /data-state="ana:handed" data-label>delivered by Ben</.test(frame("02-ring.html")), "the world's words are static markup with data-label ({from} filled)");
writeFileSync(join(V, ".hyperframes/caption-skin.html"), "<!-- mine -->");
run("diagram", V, "--silent");
ok(readFileSync(join(V, ".hyperframes/caption-skin.html"), "utf8") === "<!-- mine -->", "a video's own caption skin is kept");

// 2. word times from the script: each word 0.3 s, from 0.1
const lines = [...readFileSync(join(V, "SCRIPT.md"), "utf8").matchAll(/^ {4}(\S.*)$/gm)].map((m) => m[1]);
const voices = lines.map((l, i) => { const ws = l.split(/\s+/).map((w, k) => ({ text: w.replace(/[.,:]$/, ""), start: +(0.1 + k * 0.3).toFixed(2), end: +(0.35 + k * 0.3).toFixed(2) }));
  return { frame: i + 1, path: `assets/voice/0${i + 1}.mp3`, duration_s: +(ws.at(-1).end + 0.2).toFixed(2), words: ws }; });
writeFileSync(join(V, "audio_meta.json"), JSON.stringify({ voices }));
r = run("diagram", V);
ok(r.status === 0, `with word times, exits 0 ${r.status ? r.stdout + r.stderr : ""}`);
const at = (l, phrase) => { const ws = voices[l].words.map((w) => w.text.toLowerCase().replace(/[’']/g, "")); const i = ws.indexOf(phrase); return voices[l].words[i].start; };
const t1 = frame("01-title.html");
ok(t1.includes(`K.draw('[data-k="r1"]', ${at(0, "a").toFixed(2)}, 0.5)`), "@@a puzzle@@ is the second \"a puzzle\" is said");
ok(t1.includes(`K.draw('[data-k="r2"]', ${(at(0, "a") + 0.4).toFixed(2)}, 0.5)`), "@@a puzzle+0.4@@ is 0.4 s after it");
const f3 = frame("03-ways.html");
ok(f3.includes(`K.hide('[data-k]', ${(voices[2].duration_s + 0.6).toFixed(2)}, 0.4)`), "@@END+0.6@@ is 0.6 s after the line ends");
const holds = JSON.parse(readFileSync(join(V, ".hyperframes/holds.json"), "utf8"));
const tail3 = +/<!-- tail: ([\d.]+) -->/.exec(readFileSync(join(V, "scenes/03-ways.html"), "utf8"))[1];
ok(Math.abs(holds["3"] - (voices[2].duration_s + tail3)) < 0.011 && f3.includes(`data-duration="${holds["3"].toFixed(2)}"`), `frame 3 holds its line plus its tail (${holds["3"]} s), in holds.json and on its root`);

// 3. a phrase the line does not say
writeFileSync(join(V, "scenes/03-ways.html"), readFileSync(join(V, "scenes/03-ways.html"), "utf8").replace("@@the manager’s@@", "@@the janitor@@"));
r = run("diagram", V, "3");
ok(r.status === 1 && /not said in its line: the janitor/.test(r.stdout), "a phrase the line does not say fails, named");
cpSync(join(SRC, "scenes/03-ways.html"), join(V, "scenes/03-ways.html"));

// 4. a colour too light to read
const w = JSON.parse(readFileSync(join(V, "world.json"), "utf8")); w.actors[0].color = "hsl(55 90% 62%)";
writeFileSync(join(V, "world.json"), JSON.stringify(w));
run("diagram", V, "--silent");
const m = /--a-ana:hsl\(55 90% ([\d.]+)%\)/.exec(frame("02-ring.html"));
const hsl = (h, s, l) => { s /= 100; l /= 100; const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l); return [0, 8, 4].map((n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1))); };
const lum = (c) => { const [R, G, B] = c.map((x) => (x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); return 0.2126 * R + 0.7152 * G + 0.0722 * B; };
const ratio = m ? (lum(hsl(45, 33, 97)) + 0.05) / (lum(hsl(55, 90, +m[1])) + 0.05) : 0;
ok(m && +m[1] < 62 && ratio >= 4.6, `a light yellow is darkened to hsl(55 90% ${m && m[1]}%), ${ratio.toFixed(2)}:1 on the paper`);

// 5. frame-lint
r = spawnSync(process.execPath, [join(ROOT, "scripts", "frame-lint.mjs"), join(V, "compositions", "frames")], { encoding: "utf8" });
ok(r.status === 0, `the frames pass frame-lint ${r.status ? (r.stdout + r.stderr).slice(-800) : ""}`);

if (fails.length) { console.log(`\n✗ ${fails.length} failed; kept ${tmp}`); process.exit(1); }
rmSync(tmp, { recursive: true, force: true });
console.log("\n✓ diagram");
