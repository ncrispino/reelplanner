// Does a video vary? (better-visuals steps 1 and 2) Across 111 scenes of four videos every scene had the
// same layout and 543 of 561 cuts were one crossfade. The motion language gives each transition a
// meaning and each video its own medium, layouts and main transition, said in its BRIEF.md; this reads
// what the video actually did:
//
//   layout       each scene's `- layout:` (a free word: code, table, terminal, before-after, wall…), or
//                its `- blueprint:` when that names one (`compose`, faceless-explainer's "compose freely",
//                names none). Over 70% of the scenes that say one on one layout is a warning; when fewer
//                than five scenes say one, layouts are not judged.
//   transition   each scene's `- transition_in:` after the first, by type (push-slide LEFT and push-slide
//                UP are both push-slide). Over 70% on one is a warning.
//   the brief    BRIEF.md says the video's medium, its layouts and its main transition (three lines under
//                Customizations: `- Medium:`, `- Layouts:`, `- Main transition:`); a missing one is a warning.
//   real things  an optional fourth line, `- Real things: scene 3 (the table), scene 8 (the diff)`, picks
//                the scenes that show the real thing (D-166, the brief picks). It is repeated as a ✓ line
//                when there; nothing warns when it is not, or about the scenes it leaves out.
//
// Never a failure: `build` prints it after the length. A video of fewer than five scenes is too short to judge.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { storyboardFrames } from "./terms.mjs";

export const SHARE = 0.7, MIN_SCENES = 5;
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

function most(values) {
  const n = new Map();
  for (const v of values) n.set(v, (n.get(v) || 0) + 1);
  const [name, count] = [...n].sort((a, b) => b[1] - a[1])[0] || [null, 0];
  return { name, count, of: values.length, share: values.length ? count / values.length : 0, kinds: n.size };
}

export function videoVariety(dir) {
  if (!existsSync(join(dir, "STORYBOARD.md"))) return null;
  const frames = storyboardFrames(read(join(dir, "STORYBOARD.md"))).sort((a, b) => a.index - b.index);
  const layoutOf = (f) => { const l = String(f.meta.layout || "").trim().toLowerCase(), b = String(f.meta.blueprint || "").trim().toLowerCase(); return l || (b && b !== "compose" ? b : ""); };
  const layouts = frames.map(layoutOf).filter(Boolean);
  const transitions = frames.slice(1).map((f) => String(f.meta.transition_in || "").trim().split(/\s+/)[0].toLowerCase()).filter(Boolean);
  const brief = read(join(dir, "BRIEF.md"));
  const says = (re) => re.test(brief);
  const missing = !brief ? ["medium", "layouts", "main transition"] : [
    !says(/^\s*[-*]\s*\**medium\**\s*:/im) && "medium",
    !says(/^\s*[-*]\s*\**layouts?\**\s*:/im) && "layouts",
    !says(/^\s*[-*]\s*\**main transition\**\s*:/im) && "main transition",
  ].filter(Boolean);
  return {
    scenes: frames.length,
    layout: { ...most(layouts), from: frames.some((f) => f.meta.layout) ? "layout" : "blueprint" },
    transition: most(transitions),
    brief: { exists: !!brief, missing, realThings: (brief.match(/^\s*[-*]\s*\**real things\**\s*:\s*(.+)$/im) || [])[1]?.trim() || null },
  };
}

const pct = (x) => `${Math.round(x * 100)}%`;
/** → [{ warn, text }]: what build prints, one line each. */
export function varietyLines(v) {
  if (!v) return [];
  const out = [];
  if (v.scenes >= MIN_SCENES) {
    const bits = [];
    if (v.layout.of >= MIN_SCENES && v.layout.share > SHARE) bits.push(`${v.layout.count} of ${v.layout.of} scenes share one layout (${v.layout.name}, ${pct(v.layout.share)}${v.layout.from === "blueprint" ? ", by blueprint" : ""})`);
    if (v.transition.of && v.transition.share > SHARE) bits.push(`${v.transition.count} of ${v.transition.of} transitions are one kind (${v.transition.name}, ${pct(v.transition.share)})`);
    out.push(bits.length
      ? { warn: true, text: `${bits.join("; ")}: over ${pct(SHARE)}. Vary them by what each scene shows and what each move means (motion-language.md)` }
      : { warn: false, text: `${v.layout.of >= MIN_SCENES ? `${v.layout.kinds} layout(s)` : "layouts not judged (no `- layout:` on most scenes)"}, ${v.transition.kinds} kind(s) of transition, none on over ${pct(SHARE)} of scenes` });
  }
  if (v.brief.realThings) out.push({ warn: false, text: `BRIEF.md picks the real things: ${v.brief.realThings}` });
  if (v.brief.missing.length) out.push({ warn: true, text: `BRIEF.md ${v.brief.exists ? "does not say" : "is missing, so nothing says"} its ${v.brief.missing.join(", ")} (\`- Medium:\`, \`- Layouts:\`, \`- Main transition:\` under Customizations)` });
  return out;
}
