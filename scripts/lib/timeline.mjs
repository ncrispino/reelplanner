// A frame's GSAP timeline read from its source, without running it: every tween with where it
// starts, how long it runs, what it targets and what it sets. motion-static reads it for still
// stretches, frame-lint for cameras and the cards the player measures.
//
// It reads what frames are written with:
//   tl.to / tl.from / tl.fromTo / tl.set    on the timeline, at a literal position ("}, 4.77)"), a
//                                           relative one ("<", ">", "+=0.5", "<0.2") or none (the end)
//   gsap.set                                an initial state, outside the timeline (not a move)
//   a helper                                `var pop = function (tl, el, at) { tl.fromTo(el, …, { duration: 0.5 }, at); }`
//                                           and its calls `pop(tl, $("k"), 2.63)`: each call is a tween at 2.63
//   an id helper                            `var $ = function (s) { return document.getElementById("f01-" + s); }`
//                                           so `$("k")` targets #f01-k
// A position it cannot read (a variable, a computed array) is counted in `skipped`, never guessed.

/** Split a call's arguments at its top-level commas. */
export function splitArgs(s) {
  const out = []; let depth = 0, q = null, cur = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { cur += c; if (c === "\\") { cur += s[++i] ?? ""; continue; } if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") { q = c; cur += c; continue; }
    if ("([{".includes(c)) depth++;
    else if (")]}".includes(c)) depth--;
    if (c === "," && depth === 0) { out.push(cur.trim()); cur = ""; continue; }
    cur += c;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// the text inside the parentheses that open at `i` (just after the "(")
function balanced(js, i) {
  let depth = 1, q = null, j = i;
  for (; j < js.length && depth > 0; j++) {
    const c = js[j];
    if (q) { if (c === "\\") j++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") q = c;
    else if (c === "(") depth++;
    else if (c === ")") depth--;
  }
  return { body: js.slice(i, j - 1), end: j };
}
function braceBody(js, i) {   // i at "{"
  let depth = 0, q = null, j = i;
  for (; j < js.length; j++) {
    const c = js[j];
    if (q) { if (c === "\\") j++; else if (c === q) q = null; continue; }
    if (c === '"' || c === "'" || c === "`") q = c;
    else if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) break; }
  }
  return { body: js.slice(i + 1, j), end: j + 1 };
}

/** The keys and literal values of an object literal's top level: { scale: 1.6, x: "0", onUpdate: "function…" }. */
export function propsOf(obj) {
  const s = String(obj || "").trim();
  if (!s.startsWith("{")) return null;
  const out = {};
  for (const part of splitArgs(s.slice(1, s.lastIndexOf("}")))) {
    const m = part.match(/^["']?([\w$]+)["']?\s*:\s*([\s\S]*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}
const num = (v) => (v != null && /^-?[\d.]+$/.test(String(v).trim()) ? Number(v) : null);
export const strip = (js) => String(js).replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`\\])\/\/[^\n]*/g, "$1");
/** Every <script> body of a frame, comments stripped. */
export const scriptsOf = (src) => strip((String(src).match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || []).map((s) => s.replace(/^<script\b[^>]*>|<\/script>$/gi, "")).join("\n"));

// what a target argument points at: "#id" selectors (a list), or null when it cannot be read
function targetsOf(arg, idHelpers) {
  const a = String(arg || "").trim();
  const lits = (s) => [...s.matchAll(/["'`]([^"'`]+)["'`]/g)].flatMap((m) => m[1].split(",").map((x) => x.trim()));
  if (/^\[/.test(a) || /^["'`]/.test(a)) return lits(a);
  let m = a.match(/^document\.getElementById\(\s*["'`]([^"'`]+)["'`]\s*\)$/);
  if (m) return [`#${m[1]}`];
  m = a.match(/^([\w$]+)\(\s*["'`]([^"'`]+)["'`]\s*\)$/);
  if (m && idHelpers[m[1]] != null) return [`#${idHelpers[m[1]]}${m[2]}`];
  if (/^\{/.test(a)) return [];   // a plain object: a counter or a hold, no element
  return null;
}

// a tween's arguments, by kind: target, the from vars, the to vars, the position
function argsOf(kind, a) {
  if (kind === "fromTo") return { target: a[0], from: a[1], to: a[2], pos: a[3] };
  if (kind === "from") return { target: a[0], from: a[1], to: null, pos: a[2], vars: a[1] };
  return { target: a[0], from: null, to: a[1], pos: a[2] };
}

/**
 * The timeline of one frame's script.
 * → { tweens: [{ kind, start, end, dur, targets, from, to, vars, object, hold }], initial: [{ targets, props }], skipped }
 *   `targets` is a list of selectors or null (unreadable); `from`/`to` are propsOf(); `hold` is a tween on a
 *   plain object that only pads the timeline (no onUpdate), which moves nothing on screen.
 */
export function readTimeline(jsIn) {
  const js = strip(jsIn);
  // id helpers: name = function (s) { return document.getElementById("prefix" + s); }  (or an arrow)
  const idHelpers = {};
  for (const m of js.matchAll(/(?:var|let|const)\s+([\w$]+)\s*=\s*(?:function\s*\(\s*(\w+)\s*\)\s*\{\s*return\s+|\(?\s*(\w+)\s*\)?\s*=>\s*)document\.getElementById\(\s*["'`]([^"'`]*)["'`]\s*\+\s*(\w+)\s*\)/g)) idHelpers[m[1]] = m[4];
  // tween helpers: a function whose body places a tween at one of its parameters
  const helpers = {}, inHelper = [];
  const defRe = /(?:(?:var|let|const)\s+([\w$]+)\s*=\s*function\s*\(([^)]*)\)\s*|function\s+([\w$]+)\s*\(([^)]*)\)\s*|(?:var|let|const)\s+([\w$]+)\s*=\s*\(([^)]*)\)\s*=>\s*)\{/g;
  for (let m; (m = defRe.exec(js)); ) {
    const name = m[1] || m[3] || m[5], params = (m[2] ?? m[4] ?? m[6]).split(",").map((p) => p.trim().replace(/=.*$/, "").trim());
    const { body, end } = braceBody(js, defRe.lastIndex - 1);
    const tws = [];
    for (const c of body.matchAll(/\.(to|from|fromTo|set)\s*\(/g)) {
      const { body: call } = balanced(body, c.index + c[0].length);
      const a = argsOf(c[1], splitArgs(call));
      const pm = String(a.pos || "").match(/^([\w$]+)(?:\s*([+-])\s*([\d.]+))?$/);
      if (!pm || !params.includes(pm[1])) continue;
      const vars = propsOf(a.to ?? a.from) || {};
      const dv = vars.duration;
      tws.push({ kind: c[1], posIdx: params.indexOf(pm[1]), offset: pm[2] ? (pm[2] === "-" ? -1 : 1) * Number(pm[3]) : 0,
        dur: c[1] === "set" ? 0 : num(dv) ?? (params.includes(dv) ? { param: params.indexOf(dv) } : dv == null ? 0.5 : null),
        targetIdx: params.indexOf(String(a.target).trim()), target: a.target, from: propsOf(a.from), to: propsOf(a.to) });
    }
    if (tws.length) { helpers[name] = tws; inHelper.push([defRe.lastIndex - 1, end]); }
  }
  const inside = (i) => inHelper.some(([a, b]) => i >= a && i < b);

  const tweens = [], initial = []; let skipped = 0, tlEnd = 0, prev = null;
  const place = (pos, dur) => {
    const p = String(pos ?? "").trim();
    let start;
    if (p === "") start = tlEnd;
    else if (num(p) != null) start = num(p);
    else {
      const m = p.match(/^["'`]([<>]?)(?:([+-]=)?(-?[\d.]+))?["'`]$/);
      if (!m) return null;
      const n = m[3] ? Number(m[3]) : 0;
      if (m[1] === "<") start = (prev?.start ?? 0) + n;
      else if (m[1] === ">") start = (prev?.end ?? 0) + n;
      else if (m[2]) start = tlEnd + (m[2] === "-=" ? -n : n);
      else return null;
    }
    return { start, end: start + dur };
  };
  const push = (t) => { tweens.push(t); prev = t; tlEnd = Math.max(tlEnd, t.end); };

  // direct calls on an object, and helper calls, in source order
  const callRe = new RegExp(`([\\w$.]+)\\.(to|from|fromTo|set)\\s*\\(${Object.keys(helpers).length ? `|(?<![\\w$.])(${Object.keys(helpers).map((h) => h.replace(/\$/g, "\\$")).join("|")})\\s*\\(` : ""}`, "g");
  for (let m; (m = callRe.exec(js)); ) {
    if (inside(m.index)) continue;
    const { body } = balanced(js, callRe.lastIndex);
    const args = splitArgs(body);
    if (m[3]) {   // a helper call
      if (/function\s*$/.test(js.slice(Math.max(0, m.index - 12), m.index))) continue;
      for (const h of helpers[m[3]]) {
        const pos = num(args[h.posIdx]);
        const dur = typeof h.dur === "object" && h.dur ? num(args[h.dur.param]) : h.dur;
        if (pos == null || dur == null) { skipped++; continue; }
        const targets = h.targetIdx >= 0 ? targetsOf(args[h.targetIdx], idHelpers) : targetsOf(h.target, idHelpers);
        const start = pos + h.offset;
        push({ kind: h.kind, start, end: start + dur, dur, targets, from: h.from, to: h.to, object: "helper", hold: false });
      }
      continue;
    }
    const object = m[1], kind = m[2];
    if (/^(gsap|window\.gsap)$/.test(object)) {
      if (kind === "set") initial.push({ targets: targetsOf(args[0], idHelpers), props: propsOf(args[1]) || {} });
      continue;   // gsap.to/from outside a timeline is not seekable; not the timeline's
    }
    if (/^(document|Math|console|JSON|Object|window|el|this)$/.test(object) || /\.(style|classList|dataset)$/.test(object)) continue;
    const a = argsOf(kind, args);
    const vars = propsOf(kind === "from" ? a.from : a.to) || {};
    const dur = kind === "set" ? 0 : num(vars.duration) ?? (vars.duration == null ? 0.5 : null);
    const at = dur == null ? null : place(a.pos, dur);
    if (!at) { skipped++; continue; }
    const targets = targetsOf(a.target, idHelpers);
    const hold = Array.isArray(targets) && !targets.length && !/onUpdate/.test(String(a.to ?? a.from));
    push({ kind, start: at.start, end: at.end, dur: at.end - at.start, targets, from: propsOf(a.from), to: propsOf(a.to), object, hold });
  }
  return { tweens, initial, skipped, helpers: Object.keys(helpers) };
}

const TRANSFORM = ["x", "y", "scale", "scaleX", "scaleY", "xPercent", "yPercent", "rotation", "z"];
export const movesTransform = (t) => TRANSFORM.some((k) => (t.to && k in t.to) || (t.from && k in t.from));
/** Every literal scale an element's tweens or initial sets give it (scale, scaleX, scaleY). */
export function scalesOf(timeline, selectors) {
  const hit = (ts) => Array.isArray(ts) && ts.some((t) => selectors.includes(t));
  const out = [];
  const take = (p) => { for (const k of ["scale", "scaleX", "scaleY"]) if (p && num(p[k]) != null) out.push(num(p[k])); };
  for (const i of timeline.initial) if (hit(i.targets)) take(i.props);
  for (const t of timeline.tweens) if (hit(t.targets)) { take(t.from); take(t.to); }
  return out;
}
export const tweensOn = (timeline, selectors) => timeline.tweens.filter((t) => Array.isArray(t.targets) && t.targets.some((x) => selectors.includes(x)));
export { num };
