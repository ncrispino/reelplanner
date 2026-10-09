#!/usr/bin/env node
// Re-apply held-beat durations to STORYBOARD.md after `audio sync-durations`.
//
// sync-durations sets every frame's duration to the length of its voice line, which is right for a
// step beat and wrong for the beats style guide §1 says must hold: a branch beat is 5–8 s even when
// its line is two seconds long (the reviewer has to see the tag land), a beat that assembles something
// holds ≥ 1.5 s after the last piece, no beat is under 4 s, and the final frame holds still.
//
// The holds live in <project>/.hyperframes/holds.json: { "<frame number>": <seconds>, … }, and optionally
// "tail": <seconds>, a pause after every line: each frame with a voice lasts its line plus the tail, a held frame
// at least its hold (a video for newcomers breathes between scenes: the system video holds 0.8 s).
// usage: reelplanner hold-durations <project-dir>
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";

const dir = resolve(process.argv[2] || ".");
const holdsPath = join(dir, ".hyperframes", "holds.json");
if (!existsSync(holdsPath)) { console.log("holds: none (no .hyperframes/holds.json)"); process.exit(0); }
const holds = JSON.parse(readFileSync(holdsPath, "utf8"));
// A hold is a FLOOR, never a cap. The voice line is the one thing that must not be cut: if narration
// was rewritten and a line now runs longer than its hold, the frame takes the voice length plus the
// beat's own tail, not the hold. (Frame 9 of the first series build was held to 3.4 s after its line
// grew to 4.8 s, which would have clipped the last two words.)
const metaPath = join(dir, "audio_meta.json");
const voice = existsSync(metaPath)
  ? Object.fromEntries((JSON.parse(readFileSync(metaPath, "utf8")).voices || []).map((v) => [String(v.frame), v.duration_s]))
  : {};
const sbPath = join(dir, "STORYBOARD.md");
let sb = readFileSync(sbPath, "utf8");
const applied = [];
// "tail": a pause after every line, so each frame with a voice lasts its line plus the tail
const tail = Math.max(0, Number(holds.tail) || 0);
const held = Object.keys(holds).filter((k) => /^\d+$/.test(k));
const frames = [...new Set([...held, ...(tail ? Object.keys(voice) : [])])].sort((a, b) => a - b);
for (const n of frames) {
  const i = sb.indexOf(`## Frame ${n} —`);
  if (i < 0) { if (held.includes(n)) console.warn(`  ! frame ${n} not in the storyboard`); continue; }
  const next = sb.indexOf("\n## ", i + 1), j = sb.indexOf("- duration:", i), k = sb.indexOf("\n", j);
  if (j < 0 || (next > 0 && j > next)) continue;   // a frame with no duration line of its own
  const was = sb.slice(j, k).replace("- duration:", "").trim();
  const v = voice[n], secs = Number(holds[n]) || 0;
  // the line outgrew its hold: keep the line, add a short tail (the video's own, when longer)
  const outgrew = secs && v != null && v >= secs;
  const want = outgrew ? +(v + Math.max(0.4, tail)).toFixed(3) : secs ? +Math.max(secs, v != null ? v + tail : 0).toFixed(3) : +(v + tail).toFixed(3);
  if (was === `${want}s`) continue;
  sb = sb.slice(0, j) + `- duration: ${want}s` + sb.slice(k);
  applied.push(`${n}: ${was} → ${want}s${outgrew ? ` (voice ${v}s outgrew the ${secs}s hold)` : !secs ? " (the tail)" : ""}`);
}
writeFileSync(sbPath, sb);
const said = applied.length > 6 ? `${applied.slice(0, 5).join(", ")}, and ${applied.length - 5} more` : applied.join(", ");
console.log(`holds: ${applied.length} frame(s) held${tail ? `, ${tail} s after every line` : ""}${applied.length ? " — " + said : " (already applied)"}`);
