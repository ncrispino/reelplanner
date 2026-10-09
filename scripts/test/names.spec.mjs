#!/usr/bin/env node
// Names (names.md): how each tool and product is written in a script and shown to the viewer.
//   - the list parses: a Shown in backticks is code (with a command's next words), a plain Shown a spelling
//   - captions: a tool's name is shown in code markup, in its own spelling ("ReelPlanner" → `reelplanner`),
//     a command's next words join it (`reelplanner build`, one chip), a path is left alone, a plain name
//     gets its case (GitHub); captions-sentences writes the marks into caption_groups.json and the caption
//     layer, which draws <code class="cap-code"> inside the word's span; caption-fades still runs after it,
//     and a second run changes nothing; the chip reads: the words' size and weight, a solid fill, its letters at 7:1
//     or more in either karaoke state, on the default layer's dark pill and the preset skin's card, light and dark
//   - check-terms: a tool's name on screen outside code markup, or a name spelled another way, warns;
//     in <code>, in a mono face, in a path, or in a real thing's own text (data-artifact), it passes
//   - written and said (lib/say.mjs): a script writes `claude -p`, `plan.md`, `/work`; the voice is handed
//     "claude dash p", "plan dot md", "slash work", and a line with none of them is handed over unchanged
//     (every line of this repo's scripts); the captions show the written form as code chips, each word over
//     the times of the words it was said as; an old script's "claude dash p" is shown `claude -p`, one word
//     over the run's times; check-terms warns on a spelled-out form in a script
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import vm from "node:vm";
import { ROOT } from "../lib/env.mjs";
import { parseNames, showNames, namesOnScreen, withCaptionCode, ensureCaptionCodeFonts, CAPTION_CODE_CSS, CAPTION_CODE_JS } from "../lib/names.mjs";
import { say, unspell, spelledOut, codeWord } from "../lib/say.mjs";
import { parseScript } from "../lib/narration.mjs";

const tmp = mkdtempSync(join(tmpdir(), "rp-names-spec-"));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const w = (p, s) => { mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, s); };
const run = (script, args) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...args], { encoding: "utf8", cwd: tmp, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const words = (s) => s.split(" ").map((text, i) => ({ text, start: i, end: i + 0.9 }));
const shown = (ws) => ws.map((x) => (x.code ? `[${x.text}${x.run ? `/${x.run}` : ""}]` : x.text)).join(" ");

try {
  // ── the list ──
  const N = parseNames(readFileSync(join(ROOT, "templates", "reelplanner", "names.md"), "utf8"));
  const rp = N.find((r) => r.shown === "reelplanner"), gh = N.find((r) => r.shown === "GitHub");
  ok("names.md parses: `reelplanner` is code, caught as ReelPlanner and as the spoken reel planner too, with its commands as next words", rp?.code && rp.forms.some((f) => f.join(" ") === "ReelPlanner") && rp.forms.some((f) => f.join(" ") === "reel planner") && rp.then.some((t) => t.join(" ") === "build"), JSON.stringify(rp));
  ok("…GitHub is a plain name, caught as github", gh && !gh.code && gh.forms.some((f) => f.join(" ") === "github"), JSON.stringify(gh));
  ok("the repo's own list is the package's (this repo keeps .reelplanner/names.md)", readFileSync(join(ROOT, ".reelplanner", "names.md"), "utf8").includes("| reelplanner, reel planner, ReelPlanner"));

  // ── captions ──
  ok("a caption shows the product as code, its own spelling, even at a sentence's start", shown(showNames(words("reelplanner turns that plan into a video,"), N)) === "[reelplanner] turns that plan into a video,");
  ok("…and ReelPlanner, as a script might spell it, as `reelplanner`", shown(showNames(words("That's ReelPlanner: a plan you watch"), N)) === "That's [reelplanner:] a plan you watch");
  const spoken = showNames(words("Say reel planner aloud"), N);
  ok("…and the name as it is said, reel planner, as one `reelplanner`", spoken[1].code === "reelplanner" && spoken[1].text === "reelplanner" && spoken[2].text === "" && spoken[3].text === "aloud", JSON.stringify(spoken));
  const cmd = showNames(words("run reelplanner build now"), N);
  ok("a command stays lowercase and is one chip: `reelplanner build`", shown(cmd) === "run [reelplanner/start] [build/end] now" && cmd[1].code === "reelplanner" && cmd[2].code === "build", JSON.stringify(cmd));
  ok("…a runner and the command join too (`npx reelplanner build`); `Reel status` shows as `reel status`", shown(showNames(words("try npx reelplanner build."), N)) === "try [npx/start] [reelplanner/mid] [build./end]" && shown(showNames(words("Reel status ends with memory."), N)) === "[reel/start] [status/end] ends with memory.");
  {
    // the script's own markup over several words: each word code, one run, the backticks never left beside a word
    const cw = (s) => showNames(words(s), N).map((x) => (x.code ? `${x.code}/${x.run || "-"}` : "·")).join(" ");
    ok("a code span over several words (`reel fold`, `npx skills add`) is one code run, though names.md lists only its first word",
      cw("and `reel fold` gathers") === "· reel/start fold/end ·" && cw("Third, `npx skills add` copies") === "· npx/start skills/mid add/end ·" && cw("so `reel audit` fails") === "· reel/start audit/end ·",
      `${cw("and `reel fold` gathers")} | ${cw("Third, `npx skills add` copies")} | ${cw("so `reel audit` fails")}`);
    ok("…and over one word names.md does not list (`jq`.), code too, with no run", cw("simple to read with `jq`.") === "· · · · jq/-" && cw("a `todo` list") === "· todo/- ·",
      `${cw("simple to read with `jq`.")} | ${cw("a `todo` list")}`);
  }
  ok("a path is left as it is written, in code markup; a plain name gets its case, no markup", shown(showNames(words("bin/reelplanner.mjs and the github action, the cli"), N)) === "[bin/reelplanner.mjs] and the GitHub action, the CLI");
  ok("HyperFrames the framework stays a name; `hyperframes` the command is code", shown(showNames(words("HyperFrames runs hyperframes check"), N)) === "HyperFrames runs [hyperframes/start] [check/end]");

  // captions-sentences on a video, with this repo's caption layer (the preset skin's shape)
  const V = join(tmp, "video");
  w(join(V, "STORYBOARD.md"), "---\ntitle: t\n---\n\n## Frame 1 — one\n\n- src: compositions/frames/f1.html\n- duration: 4s\n");
  w(join(V, "SCRIPT.md"), "# SCRIPT\n\n## Line 1 — one (Frame 1)\n\n    reelplanner turns a plan into a video. Run reelplanner build.\n");
  const said = "reelplanner turns a plan into a video. Run reelplanner build.".split(" ");
  w(join(V, "audio_meta.json"), JSON.stringify({ voices: [{ frame: 1, duration_s: 4, words: said.map((t, i) => ({ text: t.replace(/[.]/g, ""), start: i * 0.4, end: i * 0.4 + 0.35 })) }] }));
  const layer = readFileSync(join(ROOT, ".reelplanner", "system-video", "compositions", "captions.html"), "utf8")
    .replace(/var GROUPS = \[[\s\S]*?\];\n/, "var GROUPS = [];\n").replace(/\n?\s*\/\* rp-caption-code[\s\S]*?\n\s*\}\n(?=\s*var GROUPS)/, "\n").replace(/__rpShowWord\((\w+), w\);/, "$1.textContent = String(w.text);").replace(/\n?<style data-rp-caption-code>[\s\S]*?<\/style>/, "");
  w(join(V, "compositions", "captions.html"), layer);
  let r = run("captions-sentences.mjs", [V]);
  const groups = JSON.parse(readFileSync(join(V, "caption_groups.json"), "utf8")), all = groups.flatMap((g) => g.words);
  ok("captions-sentences: the product word carries code, the command a run of two", r.code === 0 && all[0].text === "reelplanner" && all[0].code === "reelplanner" && !all[0].run && all.find((x) => x.text === "build.")?.run === "end" && all.filter((x) => x.code).length === 3, r.out + JSON.stringify(all));
  const html1 = readFileSync(join(V, "compositions", "captions.html"), "utf8");
  ok("…the caption layer draws it (the word builder calls __rpShowWord) and carries the chip's style, no coral", /__rpShowWord\(span, w\);/.test(html1) && !/span\.textContent = String\(w\.text\)/.test(html1) && /<style data-rp-caption-code>[\s\S]*\.cap-code[\s\S]*JetBrains Mono/.test(html1) && !/coral/.test(html1.match(/<style data-rp-caption-code>[\s\S]*?<\/style>/)[0].replace(/\/\*[\s\S]*?\*\//g, "")), html1.slice(-1500));
  // the chip reads: the words' own size, a solid fill, and letters at strong contrast on it, in each karaoke
  // state, on the default layer (white words on a dark pill) and the preset skin's card (ink on the canvas)
  // in both themes (the owner found the old chip, --rp-tile-2 at 0.8em under the word's colour, too pale)
  {
    const css = CAPTION_CODE_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
    const rule = (sel) => css.match(new RegExp(`\\n\\s*${sel.replace(/[.*]/g, "\\$&")} \\{([^}]*)\\}`))?.[1] || "";
    const base = rule(".caption-word .cap-code"), card = rule(".caption-pill .caption-word .cap-code");
    const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
    const over = (top, a, under) => top.map((v, i) => Math.round(v * a + under[i] * (1 - a)));
    const mix = (a, b, pb) => a.map((v, i) => Math.round(v * (1 - pb) + b[i] * pb));
    // default: the word's colour (white at 55% still to come, white said) laid over the opaque grey
    const grey = base.match(/background:\s*linear-gradient\(currentColor, currentColor\) (#[0-9a-f]{6});/i)?.[1], ink0 = base.match(/-webkit-text-fill-color:\s*(#[0-9a-f]{6});/i)?.[1];
    const pill = [];
    if (grey && ink0) for (const a of [0.55, 1]) pill.push(contrast(hex(ink0), over([255, 255, 255], a, hex(grey))));
    ok("the caption chip is the words' size and weight, solid, its letters at 7:1 or more on the dark pill in either karaoke state", /font-size:\s*1em;/.test(base) && /font-weight:\s*inherit;/.test(base) && !/rp-tile-2|cap-accent-2/.test(css) && pill.length === 2 && pill.every((c) => c >= 7), JSON.stringify({ base, pill }));
    // the card: canvas letters on currentColor pulled 60% to ink; a word still to come is ink 40% on the canvas
    const tok = readFileSync(join(ROOT, "templates", "reelplanner", "theme", "tokens.html"), "utf8");
    const theme = (sel) => { const b = tok.slice(tok.indexOf(sel)); return { ink: hex(b.match(/--rp-ink:(#[0-9A-Fa-f]{6})/)[1]), paper: hex(b.match(/--rp-paper:(#[0-9A-Fa-f]{6})/)[1]) }; };
    const pull = Number(card.match(/color-mix\(in srgb, currentColor, var\(--cap-ink, var\(--rp-ink\)\) (\d+)%\)/)?.[1]) / 100;
    const cards = [];
    if (pull && /-webkit-text-fill-color:\s*var\(--cap-canvas, var\(--rp-paper\)\)/.test(card)) for (const t of [theme(":root {"), theme(':root[data-theme="dark"]')]) for (const word of [mix(t.paper, t.ink, 0.4), t.ink]) cards.push(contrast(t.paper, mix(word, t.ink, pull)));
    ok("…and on the preset skin's card, light and dark, its canvas letters on an ink chip at 7:1 or more", cards.length === 4 && cards.every((c) => c >= 7), JSON.stringify({ card, cards }));
  }
  r = run("captions-sentences.mjs", [V]);
  const html2 =readFileSync(join(V, "compositions", "captions.html"), "utf8");
  // a code run over two words (`reel memory`): the script's backticks mark the code and are never drawn beside the chip
  { const mk = () => ({ kids: [], appendChild(k) { this.kids.push(k); }, setAttribute() {}, set textContent(v) { this.kids = [{ text: v }]; } });
    const doc = { createTextNode: (t) => ({ text: t }), createElement: () => { const e = mk(); e.code = true; Object.defineProperty(e, "textContent", { set(v) { e.text = v; } }); return e; } };
    const show = new Function("document", `${CAPTION_CODE_JS}; return __rpShowWord;`)(doc);
    const drawn = (w) => { const sp = mk(); show(sp, w); return sp.kids.map((k) => (k.code ? `[${k.text}]` : k.text)).join(""); };
    ok("the caption layer: `reel memory` over two words draws [reel] [memory], no backtick beside either", drawn({ text: "`reel", code: "reel", run: "start" }) === "[reel]" && drawn({ text: "memory`", code: "memory", run: "end" }) === "[memory]" && drawn({ text: "`plan.md`,", code: "plan.md" }) === "[plan.md],", `${drawn({ text: "`reel", code: "reel", run: "start" })} ${drawn({ text: "memory`", code: "memory", run: "end" })} ${drawn({ text: "`plan.md`,", code: "plan.md" })}`); }
  ok("…a second run changes nothing (one helper, one style block)", r.code === 0 && html2 === html1 && html2.split("function __rpShowWord(").length === 2);
  r = run("caption-fades.mjs", [V]);
  ok("caption-fades still reads the caption layer after it", r.code === 0, r.out);
  // the builder, run: a word with code is a <code class="cap-code"> inside its own span, the text around it kept
  const fn = html2.match(/function __rpShowWord\([\s\S]*?\n\s*\}\n/)[0];
  const el = (tag) => ({ tag, children: [], attrs: {}, className: "", set textContent(t) { this.children = [{ text: t }]; }, get textContent() { return this.children.map((c) => (c.text != null ? c.text : c.textContent)).join(""); }, appendChild(c) { this.children.push(c); }, setAttribute(k, v) { this.attrs[k] = v; } });
  const ctx = { document: { createElement: el, createTextNode: (t) => ({ text: t }) } };
  vm.runInNewContext(`${fn}; this.show = __rpShowWord;`, ctx);
  const span = el("span"); ctx.show(span, { text: "reelplanner:", code: "reelplanner", run: "start" });
  const code = span.children.find((c) => c.tag === "code");
  ok("…and draws a code word as <code class=\"cap-code\"> inside the word's span; the span's text is the word (the player reads it)", code?.className === "cap-code" && code.textContent === "reelplanner" && code.attrs["data-run"] === "start" && span.textContent === "reelplanner:", JSON.stringify(span));
  const plain = el("span"); ctx.show(plain, { text: "turns" });
  ok("…a plain word is plain text", plain.textContent === "turns" && !plain.children.some((c) => c.tag));
  ok("withCaptionCode says so on a caption layer it does not know", !!withCaptionCode("<template><script>el.innerHTML = w.text;</script></template>").error);
  // a new project has no assets/fonts/: the code chips' face is put there, or `hyperframes check` fails on its 404
  const F = join(tmp, "fonts-project"); mkdirSync(F, { recursive: true });
  const put = ensureCaptionCodeFonts(F, ROOT), again = ensureCaptionCodeFonts(F, ROOT);
  ok("ensureCaptionCodeFonts: a project with no fonts gets JetBrains Mono at the paths the caption CSS loads, with its licence; once",
    ["JetBrainsMono-400.woff2", "JetBrainsMono-700.woff2", "OFL-jetbrains-mono.txt"].every((f) => existsSync(join(F, "assets", "fonts", f)) && put.includes(`assets/fonts/${f}`))
    && CAPTION_CODE_CSS.includes("assets/fonts/JetBrainsMono-400.woff2") && again.length === 0, JSON.stringify({ put, again }));

  // ── check-terms: names on screen ──
  const C = join(tmp, "check");
  w(join(C, "STORYBOARD.md"), "---\ntitle: c\n---\n\n## Frame 1 — one\n\n- src: compositions/frames/f1.html\n- duration: 4s\n");
  const frame = (body) => w(join(C, "compositions", "frames", "f1.html"), `<div data-composition-id="f1"><style>.m { font:500 26px/1 "JetBrains Mono"; } .s { font:400 40px/1 Inter; }</style>${body}</div>`);
  frame('<div class="s">reelplanner builds the video</div><div class="s">ReelPlanner, on Github</div>');
  let c = run("check-terms.mjs", [C]);
  ok("check-terms: a lowercase product name in a sans label warns (show it as code)", c.code === 0 && /frame 1, on screen: "reelplanner" — show it as `reelplanner`/.test(c.out), c.out);
  ok("…so do ReelPlanner and Github", /"ReelPlanner" — show it as `reelplanner`/.test(c.out) && /"Github" — show it as GitHub/.test(c.out) && /3 names on screen not as names\.md shows them/.test(c.out), c.out);
  frame('<div class="s">made by <code>reelplanner</code></div><div class="m">reelplanner · the whole system</div><div class="s">bin/reelplanner.mjs</div><div data-artifact="terminal"><div class="s">ReelPlanner v1</div></div><div class="s">on GitHub</div>');
  c = run("check-terms.mjs", [C]);
  ok("…in <code>, in the mono, in a path, in a real thing's own text, or spelled right, it passes", c.code === 0 && !/names\.md/.test(c.out), c.out);
  frame('<div class="s">the plan</div>');
  w(join(C, "SCRIPT.md"), "# SCRIPT\n\n## Line 1 — one (Frame 1)\n\n    The server starts claude dash p, and reads names dot md.\n");
  c = run("check-terms.mjs", [C]);
  ok("check-terms: a flag or a file name the script spells out warns (write it as it is written)", c.code === 0 && /frame 1, said: "dash p" — write it as it is written, -p/.test(c.out) && /said: "names dot md" — write it as it is written, names\.md/.test(c.out) && /2 flags, paths or file names spelled out in the script/.test(c.out), c.out);
  w(join(C, "SCRIPT.md"), "# SCRIPT\n\n## Line 1 — one (Frame 1)\n\n    The server starts claude -p, and reads names.md, not a dash of it.\n");
  c = run("check-terms.mjs", [C]);
  ok("…written as it is written, it passes", c.code === 0 && !/spelled out/.test(c.out), c.out);
  ok("namesOnScreen alone: code passes, a sans label warns", namesOnScreen([{ text: "npx reelplanner build", code: true }], N).length === 0 && namesOnScreen([{ text: "the reelplanner page" }], N).length === 1);

  // ── written and said (lib/say.mjs) ──
  const SAID = [
    ["Run claude -p on plan.md, then open /work.", "Run claude dash p on plan dot md, then open slash work."],
    ["Pass --dry-run, or --speed=1.25.", "Pass dash dash dry-run, or dash dash speed equals 1.25."],
    ["It lands in ~/.reelplanner/you.jsonl.", "It lands in home dot reelplanner slash you dot json L."],
    ["See scripts/narrate.mjs and CONTRIBUTING.md (and .reelplanner/).", "See scripts slash narrate dot mjs and CONTRIBUTING dot md (and dot reelplanner)."],
    ["Mail noreply@anthropic.com.", "Mail noreply at anthropic dot com."],
  ];
  const badSaid = SAID.filter(([a, b]) => say(a) !== b).map(([a]) => `${a} → ${say(a)}`);
  ok("say: a flag, a path or a file name is handed to the voice as spoken (dash p, dot md, slash work, home, json L)", !badSaid.length, badSaid.join("\n  "));
  const plainLine = "Decision D-110, e.g. and/or A/B at 1.25 with write-ahead - a dash, a dot, a slash of it.";
  ok("…and an id (D-110), a slash between words, a number, a hyphenated word or the words dash, dot, slash are left as they are", say(plainLine) === plainLine, say(plainLine));
  // every line of every script in this repo that writes nothing that way is handed over unchanged (its key, its audio kept)
  const scripts = execFileSync("git", ["-C", ROOT, "ls-files", "*SCRIPT.md"], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  let nLines = 0; const moved = [];
  for (const f of scripts) for (const l of parseScript(readFileSync(join(ROOT, f), "utf8"))) {
    if (l.text.split(/\s+/).some((x) => codeWord(x))) continue;
    nLines++; if (say(l.text) !== l.text) moved.push(`${f} frame ${l.frame}: ${say(l.text)}`);
  }
  ok(`…every line of this repo's ${scripts.length} scripts with no written form is handed over as it is (${nLines} lines)`, nLines > 500 && !moved.length, moved.slice(0, 5).join("\n  "));
  const old = unspell(words("the server starts claude dash p, and reads plan dot resolved dot M D, from slash work"));
  ok("unspell: an old script's spoken run is one written word over the run's times (claude dash p → claude -p)", shown(old.map(({ text }) => ({ text }))) === "the server starts claude -p, and reads plan.resolved.md, from /work"
    && old[4].text === "-p," && old[4].start === 4 && old[4].end === 5.9 && old[7].start === 8 && old[7].end === 13.9 && old[9].start === 15 && old[9].end === 16.9, JSON.stringify(old));
  ok("…and the words dash, dot and slash in a sentence stay words", shown(unspell(words("a cross and a dash, a dot on the map, a slash of red, in a dash a moment later, one slash"))) === "a cross and a dash, a dot on the map, a slash of red, in a dash a moment later, one slash");
  ok("…shown as code: `claude -p` is one chip, a file name and a path chips of their own", shown(showNames(old, N)) === "the server starts [claude/start] [-p,/end] and reads [plan.resolved.md,] from [/work]");
  ok("…a flag joins the command before it (`reel memory --you`, `npx reelplanner build --dry-run`)", shown(showNames(unspell(words("Reel memory dash dash you reads it")), N)) === "[reel/start] [memory/mid] [--you/end] reads it" && shown(showNames(words("try npx reelplanner build --dry-run now"), N)) === "try [npx/start] [reelplanner/mid] [build/mid] [--dry-run/end] now");
  ok("spelledOut: what check-terms warns on", JSON.stringify(spelledOut("starts claude dash p, reads names dot md: and dash dash you.")) === JSON.stringify([{ said: "dash p", shown: "-p" }, { said: "names dot md", shown: "names.md" }, { said: "dash dash you", shown: "--you" }]), JSON.stringify(spelledOut("starts claude dash p, reads names dot md: and dash dash you.")));

  // captions-sentences on a script written as written: aligned by what was said, shown as written, timings kept
  const V2 = join(tmp, "written");
  w(join(V2, "STORYBOARD.md"), "---\ntitle: t\n---\n\n## Frame 1 — one\n\n- src: compositions/frames/f1.html\n- duration: 6s\n");
  w(join(V2, "compositions", "captions.html"), layer);
  // what whisper heard of "Run claude dash p on plan dot md, then open slash work." (Kokoro, am_michael)
  const heard = ["Run", "claude", "dash", "P", "on", "plan", "dot", "MD,", "then", "open", "slash", "work."];
  w(join(V2, "audio_meta.json"), JSON.stringify({ voices: [{ frame: 1, duration_s: 6, words: heard.map((t, i) => ({ text: t, start: +(i * 0.4).toFixed(2), end: +(i * 0.4 + 0.35).toFixed(2) })) }] }));
  const capWords = (script) => { w(join(V2, "SCRIPT.md"), `# SCRIPT\n\n## Line 1 — one (Frame 1)\n\n    ${script}\n`); const x = run("captions-sentences.mjs", [V2]); return { r: x, ws: JSON.parse(readFileSync(join(V2, "caption_groups.json"), "utf8")).flatMap((g) => g.words) }; };
  const nw = capWords("Run claude -p on plan.md, then open /work.");
  const at = (ws, t) => ws.find((x) => x.text === t) || {};
  ok("captions-sentences: a written script's captions show it as written, as code (`claude -p` one chip, plan.md, /work)",
    nw.r.code === 0 && nw.ws.map((x) => x.text).join(" ") === "Run claude -p on plan.md, then open /work." && at(nw.ws, "claude").run === "start" && at(nw.ws, "-p").code === "-p" && at(nw.ws, "-p").run === "end" && at(nw.ws, "plan.md,").code === "plan.md" && at(nw.ws, "/work.").code === "/work", nw.r.out + JSON.stringify(nw.ws));
  ok("…each written word over the times of the words it was said as (-p: dash to P; plan.md: plan to MD)",
    at(nw.ws, "-p").start === 0.8 && at(nw.ws, "-p").end === 1.55 && at(nw.ws, "plan.md,").start === 2 && at(nw.ws, "plan.md,").end === 3.15 && at(nw.ws, "/work.").start === 4 && at(nw.ws, "/work.").end === 4.75, JSON.stringify(nw.ws));
  const ow = capWords("Run claude dash p on plan dot md, then open slash work.");
  ok("…and an old script that spells them out gets the same captions, the same times", ow.r.code === 0 && JSON.stringify(ow.ws) === JSON.stringify(nw.ws), JSON.stringify(ow.ws));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n${failed} failed` : "\nall names checks pass");
process.exit(failed ? 1 : 0);
