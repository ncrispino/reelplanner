// How long a video runs, against its budget. A plan video aims for 3–5 minutes; a walkthrough video, the
// change running, for about two (walkthroughs-that-help step 1: past 3 it is long); the system video may
// run longer, but not so long that nobody sits through it. Read from the storyboard's
// `- duration:` lines (set by sync-durations and the holds), so it is the watched length, not counting
// the pauses where the player waits for an answer.
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const BUDGET = {
  plan:        { aim: [3, 5], warn: 7, over: 10 },
  walkthrough: { aim: [1, 2], warn: 3, over: 5 },
  system:      { aim: [5, 8], warn: 10, over: 12 },
  // an explainer (explain-first step 2): 2–4 minutes, up to 5 when a source is far longer than a video can show
  explainer:   { aim: [2, 4], warn: 4, over: 7 },
  "explainer-long": { aim: [2, 5], warn: 5, over: 8 },
};

export function kindOf(dir, board) {
  const fm = board.split(/^---\s*$/m)[1] || "";
  if (/^kind:\s*system\s*$/m.test(fm)) return "system";
  if (/^kind:\s*explainer\s*$/m.test(fm)) {
    // a source that needs a guide part (sources.json, beside the video's folder) is far longer than a video can show
    const src = [join(dir, "..", "sources.json"), join(dir, "sources.json")].find((p) => existsSync(p));
    try { return src && (JSON.parse(readFileSync(src, "utf8")).sources || []).some((s) => s.guide) ? "explainer-long" : "explainer"; } catch { return "explainer"; }
  }
  return /walkthrough-video\/?$/.test(dir.replace(/\\/g, "/")) ? "walkthrough" : "plan";
}

export function videoLength(dir) {
  const path = join(dir, "STORYBOARD.md");
  if (!existsSync(path)) return null;
  const board = readFileSync(path, "utf8");
  const seconds = [...board.matchAll(/^- duration:\s*([\d.]+)\s*s?\s*$/gm)].reduce((s, m) => s + Number(m[1]), 0);
  const kind = kindOf(dir, board), b = BUDGET[kind], min = seconds / 60;
  const verdict = min > b.over ? "over" : min > b.warn ? "long" : "ok";
  return { seconds, minutes: min, kind, budget: b, verdict };
}

// round the whole length first: rounding the seconds alone printed 299.9 s as "4:60"
// how a line names the video: "a plan video", "an explainer"
const NAMED = { explainer: "an explainer", "explainer-long": "an explainer with a long source" };
const named = (kind) => NAMED[kind] || `a ${kind} video`;

export const mmss = (s) => { const t = Math.round(s); return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; };

export function lengthLine(l) {
  const aim = `${l.budget.aim[0]}–${l.budget.aim[1]} min`;
  if (l.verdict === "over") return `${mmss(l.seconds)}: too long for ${named(l.kind)} (aim ${aim}, never past ${l.budget.over}). Cut or split it: style guide §1, "Length"`;
  if (l.verdict === "long") return `${mmss(l.seconds)}: long for ${named(l.kind)} (aim ${aim}; past ${l.budget.warn} is long). See what can be cut: style guide §1, "Length"`;
  return `${mmss(l.seconds)} (${named(l.kind)}: aim ${aim}${l.minutes > l.budget.aim[1] ? "; past it, which is fine only if the plan needs it" : ""})`;
}
