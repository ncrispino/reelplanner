#!/usr/bin/env node
// Everything a worker needs to draw its frames, in one file (plans/2026-10-10-cheaper-videos, step 1): a worker
// handed one frame used to spend a median 9 minutes reading the kit, the theme, sibling frames, the timing files
// and reelplanner's own source before drawing for 2. The packet holds, for each frame asked for:
//
//   its storyboard block, as written (what the scene shows and says)
//   its line, each word with when it is said (audio_meta.json), so a cue lands on its word; or, before narration
//     is done, the line's text and "narration not ready"
//   its file and composition id, and the data attributes its beat needs (a question's heading and option cards, a
//     call's card, a detail's thing, a real thing's container, the bottom band every frame keeps empty)
//   the theme's rules by path (the video's frame.md and motion-language.md: read them; they are the design), and
//     one finished sibling frame to keep consistent with, not to copy
//   how to check a frame (`frame-check`), and where the formats are written down (references/frames.md)
//
// It holds no layout: each frame is still designed by the worker; what it saves is learning the tools.
//
// usage: reelplanner frame-packet <video-dir> <frame> [<frame>…]     → <video-dir>/.hyperframes/packets/<first>.md
//   a frame is its number (4, 04) as the storyboard numbers it
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve, basename, relative } from "node:path";
import { ROOT } from "./lib/env.mjs";
import { storyboardFrames } from "./lib/terms.mjs";

const args = process.argv.slice(2);
const usage = "usage: reelplanner frame-packet <video-dir> <frame> [<frame>…]";
const die = (m) => { console.error(`✗ frame-packet: ${m}`); process.exit(1); };
const target = args[0], asked = args.slice(1).filter((a) => !a.startsWith("--"));
if (!target || !asked.length) die(usage);
const dir = resolve(target), read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const sb = read(join(dir, "STORYBOARD.md"));
if (!sb) die(`no STORYBOARD.md in ${target}: write the storyboard first`);
const frames = storyboardFrames(sb).sort((a, b) => a.index - b.index);
const ids = frames.map((f) => f.index);
const want = asked.map((a) => { const n = Number(a); if (!Number.isInteger(n) || !ids.includes(n)) die(`no frame ${a} in the storyboard (it has ${ids[0]}–${ids.at(-1)})`); return n; });

// the storyboard's own block for a frame, as written: from its "## Frame N" heading to the next
const blocks = Object.fromEntries(sb.split(/\n(?=## Frame \d+)/).map((b) => [Number((/^## Frame (\d+)/.exec(b) || [])[1]), b.trim()]).filter(([n]) => n));
const meta = (() => { try { return JSON.parse(read(join(dir, "audio_meta.json"))); } catch { return null; } })();
const voice = (n) => meta?.voices?.find((v) => Number(v.frame) === n) || null;
const script = (() => { const out = {}; for (const b of read(join(dir, "SCRIPT.md")).split(/\n(?=## Line )/)) { const n = (b.match(/^## Line .*\(Frame (\d+)\)/m) || [])[1]; if (n) out[n] = b.split("\n").filter((l) => /^ {4}\S/.test(l)).map((l) => l.trim()).join(" "); } return out; })();

// what the beat needs marked in its frame (SKILL.md's step 3, and the tags table): the player answers on the frame
function marks(f) {
  const m = f.meta, out = ['the root: `data-band="bottom"`, its lowest eighth (y 945–1080) left empty: the player\'s chips and answer bar go there'];
  const letters = ["a", "b", "c", "d"].filter((l) => m[`option_${l}`]);
  if (m.decision || m.quiz) {
    out.push(`the question's heading: \`data-question\` (${m.decision ? `decision ${m.decision}` : `quick check ${m.quiz}`})`);
    if (letters.length) out.push(`each option's card: ${letters.map((l) => `\`data-option="${l}"\``).join(", ")} (its letter, so the reviewer answers by clicking it)`);
    out.push("the heading and cards outside any camera's view, or the camera at rest at scale 1 when the scene ends");
  }
  const calls = String(m.autonomy || m.autonomy_list || "").split(/[,\s]+/).filter(Boolean);
  if (calls.length) out.push(`each call's card: ${calls.map((c) => `\`data-call="${c}"\``).join(", ")}`);
  for (const k of ["detail", "guide"]) if (m[k]) out.push(`the one thing its ${k === "detail" ? "detail page" : "guide part"} explains: \`data-detail="${String(m[k]).split("#")[0]}"\`, at least 120 × 44 px, still for the scene's last 3 s, above the bottom band`);
  return out;
}

const brief = read(join(dir, "BRIEF.md"));
const realThings = (/^- Real things:\s*(.+)$/m.exec(brief) || [])[1] || null;
const theme = [join(dir, "frame.md"), join(dir, "..", "..", "..", "theme", "frame.md"), join(ROOT, "templates", "reelplanner", "theme", "frame.md")].find(existsSync);
const motion = [join(dir, "..", "..", "..", "theme", "motion-language.md"), join(ROOT, "templates", "reelplanner", "theme", "motion-language.md")].find(existsSync);
const framesDir = join(dir, "compositions", "frames");
const built = existsSync(framesDir) ? readdirSync(framesDir).filter((f) => f.endsWith(".html")) : [];
const fileOf = (f) => (f.meta.src ? join(dir, f.meta.src) : null);
// one finished frame to match: the nearest built one before the first asked for, else after
const sibling = (() => {
  const others = frames.filter((f) => !want.includes(f.index) && fileOf(f) && existsSync(fileOf(f)));
  const first = want[0];
  return [...others.filter((f) => f.index < first).reverse(), ...others.filter((f) => f.index > first)][0] || null;
})();
// absolute: a worker may run from a scratch folder, and the packet is read, not linked
const rel = (p) => resolve(p);
const fmt = (t) => Number(t).toFixed(2);

const parts = [];
parts.push(`# Frame packet: ${want.length === 1 ? `frame ${want[0]}` : `frames ${want.join(", ")}`}

Everything you need to draw ${want.length === 1 ? "this frame" : "these frames"} is here. Do not read reelplanner's own
source, other frames' files or the timing files: what they hold is below, and the formats are written down in
\`skills/plan-to-video/references/frames.md\` (in reelplanner's install: ${rel(join(ROOT, "skills", "plan-to-video", "references", "frames.md"))}).

## The design (read once)

- The frame rules and the look: \`${theme ? rel(theme) : "theme/frame.md"}\`
- How frames move: \`${motion ? rel(motion) : "theme/motion-language.md"}\`
${brief ? `- The brief's choices: ${["Medium", "Layouts", "Main transition"].map((k) => (new RegExp(`^- ${k}:\\s*(.+)$`, "m").exec(brief) || [])[1]).filter(Boolean).map((v, i) => `${["medium", "layouts", "main transition"][i]}: ${v}`).join("; ") || "BRIEF.md"}` : ""}
${realThings ? `- Real things (shown as themselves, in a \`data-artifact\` container with their words pinned on, \`data-gloss\`): ${realThings}` : ""}
- ${sibling ? `A finished frame to keep consistent with (its type, spacing and colour), not to copy: \`${rel(fileOf(sibling))}\` (frame ${sibling.index})` : "No other frame is drawn yet: yours sets the look the theme describes."}

Design each frame for its own scene: what it shows decides its layout. The video warns when most scenes share one layout.

## Check a frame

\`reelplanner frame-check ${rel(dir)} <frame>\`: the frame rules a program can see (\`frame-lint\`), and one picture of it at
rest, \`.hyperframes/shots/<frame>.png\`. Look at the picture. Run it on each frame as it lands.`);

for (const n of want) {
  const f = frames.find((x) => x.index === n), v = voice(n), file = fileOf(f);
  const words = v?.words?.length ? v.words.map((w) => `${w.text} (${fmt(w.start)}–${fmt(w.end)})`).join(" · ") : null;
  parts.push(`## Frame ${n}${f.title ? ` — ${f.title}` : ""}

- **File:** \`${file ? rel(file) : "(no src: in the storyboard)"}\`${file && existsSync(file) ? " (exists: you are redrawing it)" : ""}, composition id \`${file ? basename(file, ".html") : "?"}\`
- **Length:** ${v ? `${fmt(v.duration_s)} s of voice` : f.meta.duration ? `${f.meta.duration} (from the storyboard; narration not ready)` : "not known yet"}
- **The line, word by word** (seconds from the scene's start; put each cue on its word):
  ${words || `narration not ready: draw first, cue after. The line: “${script[n] || String(f.meta.voiceover || "").replace(/^"|"$/g, "")}”`}
- **Mark in the frame:**
${marks(f).map((x) => `  - ${x}`).join("\n")}

\`\`\`
${blocks[n] || "(no storyboard block)"}
\`\`\``);
}

const out = join(dir, ".hyperframes", "packets", `${String(want[0]).padStart(2, "0")}.md`);
mkdirSync(join(dir, ".hyperframes", "packets"), { recursive: true });
writeFileSync(out, parts.join("\n\n") + "\n");
console.log(`✓ ${relative(process.cwd(), out) || out} (${want.length} frame${want.length === 1 ? "" : "s"}, narration ${want.every((n) => voice(n)?.words?.length) ? "ready" : want.some((n) => voice(n)?.words?.length) ? "ready for some" : "not ready"})`);
