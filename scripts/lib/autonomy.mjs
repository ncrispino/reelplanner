// The agent's own calls, as walkthrough.md's autonomy table logs them, and which of them pause the
// walkthrough video (walkthroughs-that-help step 2, replacing D-084's ten-in-a-row rule).
//
// A row is `| A<n> | <step> | <chose> | <instead of> | <why> | <where to check> |`. Its tags ride at the
// end of the "chose" cell, in brackets: `| A3 | 1 | A committed record [visible, close] | …`. A row
// with no brackets is untagged, so tables written before tags still read the same. `D<n>` rows are
// deviations, and `m<n>` rows the smaller calls (logged, not beaten in the video).
//
// The tags are the implementer's judgment, made for each build: `visible`, you'd notice it (it changes what
// you see or do) and the video can show it running; `hard-to-undo`, stored data and formats, permissions,
// something other people's code relies on; `close`, a reasonable person could pick the other way.
export const TAGS = ["visible", "hard-to-undo", "deviation", "close"];
/** The tags that pause the video by themselves (step 2): what you'd notice, and what you can't easily undo. */
export const PAUSING = ["visible", "hard-to-undo"];

const norm = (t) => t.trim().toLowerCase().replace(/[\s_]+/g, "-");
/** "A committed record [visible, close]" → { chose: "A committed record", tags: ["visible", "close"], unknown: [] }.
 *  A bracket holding no known tag is part of the text; one mixing known and unknown words keeps the known ones and names the rest. */
export function splitTags(text) {
  const s = String(text ?? "").trim(), m = s.match(/\s*\[([^\][]*)\]$/);
  if (!m) return { chose: s, tags: [], unknown: [] };
  const words = m[1].split(",").map(norm).filter(Boolean), tags = [...new Set(words.filter((w) => TAGS.includes(w)))];
  if (!tags.length) return { chose: s, tags: [], unknown: [] };
  return { chose: s.slice(0, m.index).trim(), tags, unknown: words.filter((w) => !TAGS.includes(w)) };
}
export const isDeviation = (id) => /^d\d+$/i.test(String(id));
/** A call's tags, with `deviation` added for a deviation's id (d1, D2). */
export const tagsOf = (id, tags = []) => (isDeviation(id) && !tags.includes("deviation") ? [...tags, "deviation"] : [...tags]);

/** Every call row in a walkthrough.md: { id: "A3", key: "a3", kind: "call"|"deviation"|"small", step, ask, chose, insteadOf, why, check, tags, unknown }.
 *  `step` is the plan step it belongs to, or null; `ask` is the step cell's word when it is not a number
 *  (a call outside the plan's steps: an ask of the owner's during the build, "zoom"), else null. */
export function parseCalls(md) {
  const out = [];
  for (const line of String(md).split("\n")) {
    const c = line.split("|").slice(1, -1).map((s) => s.trim());
    const m = c.length >= 6 && c[0].match(/^([ad]\d+|m\d+)\b/i); if (!m) continue;
    const id = m[1], t = splitTags(c[2]);
    out.push({ id, key: id.toLowerCase(), kind: /^m/.test(id) ? "small" : isDeviation(id) ? "deviation" : "call", step: Number(c[1]) || null, ask: Number(c[1]) ? null : c[1] || null,
      chose: t.chose, insteadOf: c[3], why: c[4], check: c[5].replace(/`/g, ""), tags: tagsOf(id, t.tags), unknown: t.unknown });
  }
  return out;
}

/** The recent miss (lib/memory.mjs findMisses) of this call's kind, if any: one sharing a tag with it.
 *  A miss with no tags (a plan question's, or a call's from before tags) stops nothing directly (D-109):
 *  it still shapes the next plan's questions, through `reel memory`. `deviation` is no kind here. */
export function missFor(call, misses = []) {
  const tags = tagsOf(call.id, call.tags || []).filter((t) => t !== "deviation");
  return misses.find((m) => (m.tags || []).some((t) => tags.includes(t))) || null;
}

/** Walkthroughs-that-help step 2: does a call pause the video, or go on the list at its end?
 *  An off-plan change (a deviation) always pauses. A call tagged `visible` (you'd notice it) or
 *  `hard-to-undo` (you can't easily undo it) pauses, and its scene shows it running. Every other call goes
 *  on the list (D-221: listed, not judged): one line each at the end, each with its own Flag. The one
 *  exception is D-122's, kept: a call sharing a tag with a recent miss (a late fix) pauses; a miss with no
 *  tags pauses nothing (D-109). No count is fixed or capped (D-220), and accepts no longer fade a tag out
 *  (D-084's ten in a row is gone). `misses` are the recent ones.
 *  → { stops, why, rule } where rule is "deviation" | "notice" | "undo" | "miss" | "listed" */
export function stopFor(call, misses = []) {
  const tags = tagsOf(call.id, call.tags || []);
  if (tags.includes("deviation")) return { stops: true, rule: "deviation", why: "an off-plan change always pauses" };
  if (tags.includes("visible")) return { stops: true, rule: "notice", why: "you'd notice it: its scene shows it running" };
  if (tags.includes("hard-to-undo")) return { stops: true, rule: "undo", why: "you can't easily undo it: its scene shows it running" };
  const miss = missFor(call, misses);
  if (miss) return { stops: true, rule: "miss", why: `a late fix: ${miss.brief || miss.what} (label ${(miss.tags || []).find((t) => tags.includes(t))})` };
  return { stops: false, rule: "listed", why: tags.length ? `${tags.join(", ")}: on the list at the end` : "no label: on the list at the end" };
}

// A step cell that names no ask: a dash, a question mark, or a word such as "ask" or "off-plan" that every
// such call would share. Each of those calls is an ask of its own, named by its id.
const NO_NAME = /^(?:[-–—?]+|n\/?a|none|ask|asked|off[- ]?plan|outside)$/i;
/** Where a call sits outside the plan's steps, or null for a call on a step: the ask its step cell names
 *  ("zoom", "own words"); a call whose cell names none (—, "ask", or empty) is an ask of its own, its id. */
export const askOf = (call) => (call.step != null ? null : call.ask && !NO_NAME.test(String(call.ask).trim()) ? String(call.ask).trim() : call.id);
/** "step 3", or "ask zoom" / "ask A16" for a call outside the steps. */
export const placeOf = (call) => (call.step != null ? `step ${call.step}` : `ask ${askOf(call)}`);

/** Step 1 of fewer-better-stops: the beats a walkthrough gives its calls, by step. The calls of a step
 *  that pause share one stop beat (`- autonomy: a3, a4`); each deviation keeps a beat of its own; the calls
 *  that do not pause are listed (`grouped` here), and all of them share one list at the video's end
 *  (`- autonomy_list: …`, walkthroughs-that-help step 2; `listedOf`).
 *  A call outside the plan's steps is grouped by its ask (`askOf`), each ask on its own, never lumped
 *  together as one step "?". `results` are [{ c: call, stops }] in table order.
 *  → [{ step, ask, place, stop: [ids], deviations: [ids], grouped: [ids] }]: the steps in order, then the asks in table order */
export function beatsByStep(results) {
  const by = new Map();
  for (const { c, stops } of results) {
    const ask = askOf(c), k = c.step != null ? `s${c.step}` : `a${ask}`;
    if (!by.has(k)) by.set(k, { step: c.step ?? null, ask, place: placeOf(c), stop: [], deviations: [], grouped: [] });
    const b = by.get(k);
    (c.kind === "deviation" ? b.deviations : stops ? b.stop : b.grouped).push(c.key);
  }
  return [...by.values()].sort((a, b) => (a.step ?? Infinity) - (b.step ?? Infinity));
}
/** The list at the video's end: every call that does not pause, in step order. */
export const listedOf = (beats) => beats.flatMap((b) => b.grouped);

/** Step 3: past this many calls (and deviations) in a walkthrough, `reel audit` warns. A step's fifth
 *  call is a question for the reviewer instead (D-110): `reel audit` fails a step with this many calls
 *  and no question about it in plan.md. */
export const MANY_CALLS = 12, STEP_CALLS = 5;
/** The plan's call count and its busiest step: { total, step, n } (the lowest-numbered step on a tie). Smaller calls (m<n) do not count. */
export function callLoad(calls) {
  const cs = calls.filter((c) => c.kind !== "small"), per = new Map();
  for (const c of cs) per.set(c.step, (per.get(c.step) || 0) + 1);
  let top = { step: null, n: 0 }; for (const [step, n] of [...per].sort((a, b) => (a[0] ?? Infinity) - (b[0] ?? Infinity))) if (n > top.n) top = { step, n };
  return { total: cs.length, ...top };
}
