// How deep a video's checks go (#34): `depth: low | medium | high` in its BRIEF.md front matter. The skill writes
// medium when the person names none; a brief with no depth line (every video made before it) reads as high, the
// checks it was built with.
//
//   low     about two minutes and at most 8 scenes, never past them; no fresh eyes but the fact checker (an
//           explainer with a source far longer than the video can show), and no strict checks
//   medium  its kind's length budget and at most 15 scenes, past them only on the person's own words (a `- Length:`
//           line that quotes them); the script's newcomer, then one round on the video: the newcomer, and the fact
//           checker, who has a second round on the scenes the first's answers rewrote
//   high    what the content needs: its kind's budget, and any `- Length:` line to go past it; two rounds of the
//           newcomer and the designer, and the fact checker
//
// An explainer of the research repo (eval/pipeline-cost/2026-10-21-research-explainer.md): 26 scenes, about $5 each,
// and two whole redraws after fresh eyes, most of them for the designer's cosmetic findings; the fact checker's were
// all material, its second round's too.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { frontMatter, fmValue } from "./terms.mjs";

export const DEPTHS = ["low", "medium", "high"];
// scenes: the most a video takes (null: no cap); budget: minutes in place of its kind's (null: its kind's); longer:
// what takes it past them (never; a `- Length:` line quoting the person; any `- Length:` line)
export const DEPTH = {
  low:    { scenes: 8,    budget: { aim: [1, 2], warn: 3, over: 5 }, longer: "never" },
  medium: { scenes: 15,   budget: null, longer: "quoted" },
  high:   { scenes: null, budget: null, longer: "any" },
};
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };

/** The video's depth, from its BRIEF.md: { depth, said } (said: the value as written, null when there is none). */
export function briefDepth(videoDir) {
  const said = fmValue(frontMatter(read(join(videoDir, "BRIEF.md"))), "depth");
  return { depth: DEPTHS.includes(said) ? said : "high", said };
}
export const depthOf = (videoDir) => briefDepth(videoDir).depth;
/** A line on a depth that is not one: null when it is one, or none is written (high, as before depths). */
export function depthProblem(videoDir) {
  const { said } = briefDepth(videoDir);
  return said && !DEPTHS.includes(said) ? `BRIEF.md's depth: ${said} is not low, medium or high: read as high` : null;
}
