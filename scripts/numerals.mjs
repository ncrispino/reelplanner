// Number words → digits, for caption text only.
// Imported by captions-sentences.mjs; the rule is style guide §3 ("on screen use digits; the script uses
// words"), and its edge cases, with their reasons, are below and in docs/design-notes.md. Tests: scripts/test/numerals.spec.mjs
// ---- numerals in captions -------------------------------------------------------------------
// The narration says "forty studio albums" because that is how it must be spoken; the caption reads
// better as "40". This rewrites number WORDS to digits in the caption text only — the audio and the
// script are untouched — collapsing a multi-word number ("six hundred", "twenty-four") into one
// caption word that spans the original words' time range, so the karaoke timing still lines up.
//
// Two and up always become digits. A bare "one" does not: in these scripts it is nearly always a
// determiner ("one serif face", "one index", "one per album") where a digit reads wrong. It does
// convert when something is being counted off — "step one" → "step 1" — matching the rail's tag.
const UNITS = { zero: 0, oh: 0, o: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const SCALES = { hundred: 100, thousand: 1000, million: 1e6 };
const COUNTED = new Set(["step", "part", "line", "page", "chapter", "option", "choice", "phase", "version", "day", "week", "month", "year", "number"]);
const bare = (w) => w.toLowerCase().replace(/^[^a-z0-9-]+|[^a-z0-9-]+$/g, "");
const parts = (w) => bare(w).split("-").filter(Boolean);
const known = (p) => p in UNITS || p in TENS || p in SCALES || p === "and";
const isNumWord = (w) => { const ps = parts(w); return ps.length > 0 && ps.every(known); };
// A run may not START on "and" (a bare "and" is a conjunction, not a number) and may not start on
// "oh"/"o" (an interjection unless it sits inside a spoken digit string like "four-oh-nine").
const isNumStart = (w) => isNumWord(w) && parts(w).some((p) => p !== "and" && p !== "oh" && p !== "o");
// A word that ends a clause ends the run: "steps three, four, and five" is three numbers, not 3+4+5.
const closes = (w) => /[.,;:!?—)]$/.test(w.trim());

// English number grammar, as pairs. Anything else ("three four", "twenty thirty") is not one number
// and is left as words — a caption that says "5" where the narration said "three, four" is worse
// than no numerals at all.
function wellFormed(toks, article) {
  for (let k = 0; k < toks.length; k++)
    if (toks[k] === "and" && !(k > 0 && toks[k - 1] in SCALES)) return false; // "and" only joins after a scale
  if (!article && !toks.some((t) => t in UNITS || t in TENS)) return false;   // a bare "hundred" is a word
  for (let k = 1; k < toks.length; k++) {
    const a = toks[k - 1], b = toks[k];
    if (a === "and" || b === "and" || b in SCALES || a in SCALES) continue;   // "six hundred", "hundred and twelve"
    if (a in TENS && b in UNITS && UNITS[b] >= 1 && UNITS[b] <= 9) continue;  // "twenty four"
    return false;
  }
  return true;
}
// A spoken year is two numbers, not a sum: "nineteen sixty-five" is 1965, not 84. Only the two
// idioms that actually name years start this, so "thirty forty" is never read as 3040.
function year(toks) {
  if (toks[0] !== "nineteen" && toks[0] !== "twenty") return null;
  const head = value([toks[0]]), rest = toks.slice(1);
  if (!rest.length || !wellFormed(rest)) return null;
  const tail = value(rest);
  if (tail == null || tail < 10 || tail > 99) return null;
  return head * 100 + tail;
}
function value(tokens) {
  let total = 0, cur = 0, seen = false;
  for (const t of tokens) {
    if (t === "and") continue;
    if (t in UNITS) { cur += UNITS[t]; seen = true; }
    else if (t in TENS) { cur += TENS[t]; seen = true; }
    else if (t in SCALES) { const s = SCALES[t]; if (s === 100) cur = (cur || 1) * 100; else { total += (cur || 1) * s; cur = 0; } seen = true; }
    else return null;
  }
  return seen ? total + cur : null;
}
// A number-led compound adjective ("two-gigabyte") takes a digit in its head and keeps its tail:
// "a 2-gigabyte upload". A lone "one" head stays a word, so "one-off" and "one-line" are untouched.
function compound(w) {
  const m = w.match(/^([^a-zA-Z0-9]*)(.*?)([^a-zA-Z0-9]*)$/), core = m[2];
  const orig = core.split("-").filter(Boolean), ps = orig.map((x) => x.toLowerCase());
  if (ps.length < 2) return null;
  let k = 0; while (k < ps.length && known(ps[k])) k++;
  if (k === 0 || k === ps.length) return null;               // not number-led, or all number: that is a run
  const head = ps.slice(0, k);
  if (!wellFormed(head)) return null;
  const v = value(head);
  if (v == null || (v === 1 && head.length === 1)) return null;
  return m[1] + [String(v), ...orig.slice(k)].join("-") + m[3];
}
export function numerals(timed) {
  const out = [];
  for (let i = 0; i < timed.length; i++) {
    if (!isNumStart(timed[i].text)) {
      const c = compound(timed[i].text);
      out.push(c ? { ...timed[i], text: c } : timed[i]);
      continue;
    }
    let j = i; const toks = [];
    while (j < timed.length && isNumWord(timed[j].text)) {
      const ps = parts(timed[j].text);
      // "and" joins a number only after a scale ("a hundred and twelve"); in "seventy and ninety-five"
      // it is a conjunction between two numbers, so the run ends in front of it.
      if (ps.length === 1 && ps[0] === "and" && !(toks.length && toks[toks.length - 1] in SCALES)) break;
      toks.push(...ps); j++;
      if (closes(timed[j - 1].text)) break;
    }
    while (toks.length && toks[toks.length - 1] === "and") { toks.pop(); j--; } // trailing "and" is the sentence's
    const run = timed.slice(i, j);
    i = j - 1;                                                                  // always advance, whatever we decide
    if (!run.length) { out.push(timed[j]); continue; }                          // unreachable once isNumStart holds
    // a spoken digit string ("four-oh-nine", "one one one zero one one") reads back as digits, not a sum
    const digits = toks.length >= 3 && toks.every((t) => t in UNITS && UNITS[t] <= 9)
      && (run.length === 1 || toks.some((t) => t === "zero" || t === "oh" || t === "o"));
    // "a hundred and twenty-eight" is 128, not "a 128": when a run opens on a scale word the article
    // in front of it is part of the number and is swallowed by the digits.
    const prevWord = out.length ? out[out.length - 1] : null;
    const article = !digits && toks[0] in SCALES && prevWord && /^(a|an)$/i.test(prevWord.text.trim()) ? prevWord : null;
    const v = digits ? toks.map((t) => UNITS[t]).join("") : (wellFormed(toks, !!article) ? value(toks) : year(toks));
    // A bare "one" is almost always a determiner here ("one serif face", "one index"); it becomes a
    // digit only where something is counted off ("step one" → "step 1"), matching the rail's tag.
    const prev = out.length ? bare(out[out.length - 1].text) : "";
    if (v == null || (v === 1 && toks.length === 1 && !COUNTED.has(prev))) { out.push(...run); continue; }
    if (article) out.pop();
    // a year is written plain (1965, not 1,965); every other thousand takes its separator
    const text = digits || (v >= 1000 && v <= 2999 && year(toks) === v) ? String(v)
      : (v >= 1000 ? v.toLocaleString("en-US") : String(v));
    const tail = run[run.length - 1].text.match(/[^a-zA-Z0-9-]+$/);            // keep the run's trailing punctuation
    out.push({ text: text + (tail ? tail[0] : ""), start: (article || run[0]).start, end: run[run.length - 1].end, num: true });
  }
  // A bare "one" standing next to a numeral is being counted, not used as a determiner: "one, two, or
  // none" must not come out as "one, 2, or none". Only an immediate neighbour counts, so "six columns
  // and one index" keeps its determiner — and a clause boundary ends the sequence, so "part 1 of 3:
  // one home per question" keeps its "one" (the colon is where the counting stopped).
  const ends = (t) => /[.:;!?]["')\]]*\s*$/.test(t || "");
  for (let k = 0; k < out.length; k++) {
    if (bare(out[k].text) !== "one" || out[k].num) continue;
    const left = out[k - 1]?.num && !ends(out[k - 1].text);
    const right = out[k + 1]?.num && !ends(out[k].text);
    if (!left && !right) continue;
    out[k] = { ...out[k], text: out[k].text.replace(/one/i, "1"), num: true };
  }
  return out;
}
