// One thing, one value, in every scene (plans/2026-10-10-cheaper-videos, step 5). Fresh eyes caught a phone number
// that differed between scenes, and "5 pages" in one scene against four in the rest, in a first round and again in
// a second when the fix did not stick; a check finds those in a moment. check-terms runs it on what is said and
// shown, and prints a △ line each: never a stop, since two values can be meant (two phones, a count that grows).
//
//   phones     two phone numbers or more in the video
//   addresses  a web or email address next to one a letter or two from it (rosasbakery.com, rosabakery.com):
//              a typo, or a name that changed in one scene only. Addresses far apart are two things.
//   counts     a count of one thing (pages, steps, files…) said or shown with one value in two scenes or more and
//              another value elsewhere: "four pages" in scenes 2, 5 and 9, "5 pages" in scene 7.
// A real thing's own text (data-artifact: a table, a diff, a run) is left out: it shows what it shows.

const NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20 };
const PHONE = /(?<![\d.])(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?!\d)/g;
const ADDRESS = /\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b|\b(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|org|net|io|dev|app|co|uk|us|shop|site)\b/gi;
const COUNT = new RegExp(`\\b(\\d{1,3}|${Object.keys(NUM).join("|")})\\s+([a-z][a-z-]{2,}s)\\b`, "gi");
// plural words a count goes with that are not one fixed thing in a video (time, sizes, how often)
const LOOSE = new Set("seconds minutes hours days weeks months years times percent pixels lines words characters tokens bytes megabytes gigabytes ways things others ones items people users".split(" "));

/** Letters apart, at most `max` (Levenshtein, stopping early). */
function near(a, b, max = 2) {
  if (a === b) return false;
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let low = i;
    for (let j = 1; j <= b.length; j++) { cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); low = Math.min(low, cur[j]); }
    if (low > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}

const scenesOf = (xs) => [...new Set(xs)].sort((a, b) => a - b).join(", ");

/**
 * units: [{ frame, text, artifact? }] (what is said and shown, in order) →
 * [{ kind: "phones"|"addresses"|"count", thing, values: [{ value, frames: [n…] }] }]
 */
export function valueClashes(units) {
  const out = [], own = units.filter((u) => !u.artifact);
  // phones
  const phones = new Map();
  for (const u of own) for (const m of u.text.matchAll(PHONE)) { const d = m[0].replace(/\D/g, "").replace(/^1(?=\d{10}$)/, ""); if (!phones.has(d)) phones.set(d, { value: m[0].trim(), frames: [] }); phones.get(d).frames.push(u.frame); }
  if (phones.size > 1) out.push({ kind: "phones", thing: "phone numbers", values: [...phones.values()] });
  // addresses a letter or two apart
  const addr = new Map();
  const seen = (k, frame) => { if (!addr.has(k)) addr.set(k, { value: k, frames: [] }); addr.get(k).frames.push(frame); };
  // an email's domain is an address too: rosa@rosabakery.com against rosasbakery.com
  for (const u of own) for (const m of u.text.matchAll(ADDRESS)) { const k = m[0].toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, ""); seen(k, u.frame); if (k.includes("@")) seen(k.split("@")[1], u.frame); }
  const keys = [...addr.keys()], done = new Set();
  for (let i = 0; i < keys.length; i++) for (let j = i + 1; j < keys.length; j++) {
    if (done.has(keys[j]) || !near(keys[i], keys[j])) continue;
    out.push({ kind: "addresses", thing: "addresses", values: [addr.get(keys[i]), addr.get(keys[j])] }); done.add(keys[j]);
  }
  // counts of one thing: a usual value (in two scenes or more) and another
  const counts = new Map();   // noun → Map(value → frames)
  for (const u of own) for (const m of u.text.matchAll(COUNT)) {
    const noun = m[2].toLowerCase(); if (LOOSE.has(noun)) continue;
    const v = /^\d+$/.test(m[1]) ? Number(m[1]) : NUM[m[1].toLowerCase()];
    if (!counts.has(noun)) counts.set(noun, new Map());
    const by = counts.get(noun); if (!by.has(v)) by.set(v, []); by.get(v).push(u.frame);
  }
  for (const [noun, by] of counts) {
    if (by.size < 2) continue;
    const vals = [...by.entries()].map(([value, frames]) => ({ value, frames: [...new Set(frames)] })).sort((a, b) => b.frames.length - a.frames.length);
    if (vals[0].frames.length < 2) continue;   // no usual value: likely counts of different sets
    out.push({ kind: "count", thing: noun, values: vals });
  }
  return out;
}

/** One △ line a clash. */
export const clashLine = (c) => `△ values differ across scenes: ${c.kind === "count" ? `${c.thing}: ` : `${c.thing}: `}${c.values.map((v) => `${v.value} (scene${v.frames.length === 1 ? "" : "s"} ${scenesOf(v.frames)})`).join(", ")} — one thing, one value; or say in the narration why it differs`;
