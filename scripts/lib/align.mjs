// The alignment round (find-the-gaps, #57): a few cards the agent writes where you and it most likely picture the code
// differently, each checked against the code before you see it, answered in the chat, on the review page or in a video,
// and settled one click a gap. This file is the backend every way in shares (D-314): the round's folder, its cards,
// their checks, the checker's brief, the one record of the answers, and where each settled gap goes.
//
// A round lives in .reelplanner/align/<date>-<slug>/ in a set-up repo, else in this machine's
// ~/.reelplanner/align/<repo-key>/<date>-<slug>/, so a repo with no .reelplanner/ gets nothing written into it:
//   align.md      your words, the cards (the agent writes them), and after the round what each one settled
//   sources.json  the commit, and each source pinned as an explainer pins it (lib/explainer.mjs)
//   answers.json  the one record of the answers, whichever way they came (`reelplanner align record`)
//   checker/      the fresh checker's brief (no answers in it) and its answers.md
//   issue.md      The code is wrong, with no plan to put it in: an issue's text for you to file
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve, basename, dirname, relative } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { machineDir, rpInitialized, rpDirOf } from "./env.mjs";
import { repoKey } from "./inbox.mjs";
import { sourceText, repoTop } from "./explainer.mjs";
import { readKnows, appendKnows, readYou, repoName, youPath } from "./memory.mjs";

export const MAX_CARDS = 6;                    // the cards the agent writes; an assume card made from your words is not counted
export const KINDS = ["predict", "assume", "say"];
export const SETTLE = ["got-it", "change-plan", "code-wrong", "show-more"];
export const SETTLE_WORDS = { "got-it": "Got it", "change-plan": "Change the plan", "code-wrong": "The code is wrong", "show-more": "Show me more" };
export const ONCE_MORE_DAYS = 3;               // D-316: a Got it is asked once more on a new case, the first round three days or more later
const LETTERS = ["a", "b", "c", "d"];

const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const readJson = (p) => { try { return JSON.parse(readFileSync(p, "utf8")); } catch { return null; } };
const git = (repo, ...a) => { try { return execFileSync("git", ["-C", repo, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { return null; } };
const norm = (s) => String(s).replace(/\s+/g, " ").trim();

// ── where a round lives ──────────────────────────────────────────────────────────────────────────────────
/** The folder that holds a repo's rounds: its .reelplanner/align/ when the repo is set up, else this machine's. */
export function roundsDir(repo, env = process.env) {
  const rp = rpDirOf(repo);
  return rpInitialized(rp) ? join(rp, "align") : join(machineDir(env), "align", repoKey(repo));
}
/** The round folder a path is in (the folder itself, or a file in it), or null. */
export function roundDirOf(p) {
  let d = resolve(p);
  for (let i = 0; i < 3 && d !== dirname(d); i++, d = dirname(d)) if (existsSync(join(d, "align.md")) && existsSync(join(d, "sources.json"))) return d;
  return null;
}
/** The repo a round belongs to: its sources.json says (a round outside the repo has no git top of its own). */
export const repoOfRound = (dir) => readJson(join(dir, "sources.json"))?.repo || repoTop(dir);

// ── the cards ────────────────────────────────────────────────────────────────────────────────────────────
/**
 * align.md's cards: `### c<N> · predict | assume | say`, then `- key: value` lines. → [{ id, kind, line, fields,
 * question, options: [{ id, label }], answer, source, quote, why, likelyWrong, matters, from, onceMore }]
 */
export function parseCards(md) {
  const cards = [], lines = String(md).split("\n");
  let cur = null, inCards = false;
  lines.forEach((l, i) => {
    if (/^## /.test(l)) { inCards = /^## Cards\b/i.test(l); cur = null; return; }
    if (!inCards) return;
    const h = /^### (c\d+)\s*·\s*(\w+)/i.exec(l);
    if (h) { cur = { id: h[1].toLowerCase(), kind: h[2].toLowerCase(), line: i + 1, fields: {} }; cards.push(cur); return; }
    const f = cur && /^- ([a-z_]+):\s*(.*)$/.exec(l);
    if (f) cur.fields[f[1]] = f[2].trim();
  });
  return cards.map((c) => {
    const f = c.fields, options = LETTERS.filter((k) => f[`option_${k}`]).map((k) => ({ id: k, label: f[`option_${k}`] }));
    return { ...c, question: f.question || "", options, answer: (f.answer || "").toLowerCase() || null, source: f.source || null,
      quote: f.quote ? f.quote.replace(/^"(.*)"$/, "$1") : null, why: f.why || "", likelyWrong: f.likely_wrong || "", matters: f.matters || "",
      from: f.from || null, onceMore: f.once_more || null };
  });
}
/** A card's source ref `path:from-to` (or `path:line`) → { path, from, to } or null. */
export function refOf(source) {
  const m = /^`?(.+?):(\d+)(?:-(\d+))?`?$/.exec(String(source || "").trim());
  return m ? { path: m[1], from: Number(m[2]), to: Number(m[3] || m[2]) } : null;
}
/** The lines a card's source names, as pinned: { text, note } (text null when they cannot be read). */
export function linesOf(dir, card, { repo = repoOfRound(dir) } = {}) {
  const ref = refOf(card.source); if (!ref) return { text: null, note: `${card.id}: its source is not path:from-to` };
  const pinned = readJson(join(dir, "sources.json"))?.sources || [];
  const src = pinned.find((s) => s.id === ref.path) || pinned.find((s) => s.form === "path" && (s.files || []).some((f) => f.path === ref.path) || (s.form === "path" && ref.path.startsWith(`${s.id.replace(/\/$/, "")}/`)));
  if (!src) return { text: null, note: `${card.id}: ${ref.path} is not one of the round's pinned sources` };
  const { text, note } = sourceText(src, { repo, path: src.id === ref.path ? null : ref.path });
  if (text == null) return { text: null, note };
  const all = text.split("\n");
  if (ref.to > all.length) return { text: null, note: `${card.id}: ${ref.path} has ${all.length} lines, not ${ref.to}` };
  return { text: all.slice(ref.from - 1, ref.to).join("\n"), ...(note ? { note } : {}) };
}
/** A fingerprint of some lines: their text, whitespace aside, hashed. It is of the text, not the line numbers (step 4). */
export const fingerprint = (text) => createHash("sha256").update(norm(text)).digest("hex").slice(0, 12);
/** Whether a quote is in the lines word for word, whitespace aside ("…" marks a cut: each piece is checked). */
export const quoteIn = (quote, text) => String(quote).split("…").map(norm).filter(Boolean).every((piece) => norm(text).includes(piece));

// ── what you know already ────────────────────────────────────────────────────────────────────────────────
/** The knows facts for one repo, the latest per thing (source path and fingerprint), with whether each is due once more. */
export function knowsFor(repo, { path = youPath(), now = Date.now() } = {}) {
  const name = repoName(repo) || basename(resolve(repo)), latest = new Map();
  for (const k of readKnows(path)) if (!k.repo || k.repo === name) latest.set(`${k.path}|${k.fingerprint}`, k);
  return [...latest.values()].map((k) => ({ ...k, due: (k.asked || 1) < 2 && k.dueAt && Date.parse(k.dueAt) <= now }));
}
/** Whether some lines (at their fingerprint) are known: a knows fact for the same text, in the file it is now in. */
export function knownAt(knows, path, text) {
  const fp = fingerprint(text);
  return knows.find((k) => k.fingerprint === fp) || null;
}

// ── the checks a round passes before it opens ────────────────────────────────────────────────────────────
/** → { fails, warns, cards } for a round (align --check). */
export function checkRound(dir, { repo = repoOfRound(dir), knowsPath = youPath(), now = Date.now(), checker = true } = {}) {
  const fails = [], warns = [], md = read(join(dir, "align.md")), cards = parseCards(md);
  if (!cards.length) fails.push("align.md has no cards under `## Cards` (`### c1 · predict`, `### c2 · assume`, `### c3 · say`)");
  const written = cards.filter((c) => c.from !== "say");
  if (written.length > MAX_CARDS) fails.push(`${written.length} cards: a round has at most ${MAX_CARDS} (pick the likeliest and costliest)`);
  const ids = new Set();
  const knows = knowsFor(repo, { path: knowsPath, now });
  const checked = checker ? checkerAnswers(dir) : null;
  for (const c of cards) {
    const at = `${c.id} (line ${c.line})`;
    if (ids.has(c.id)) fails.push(`${at}: a second card with this id`); ids.add(c.id);
    if (!KINDS.includes(c.kind)) { fails.push(`${at}: kind "${c.kind}": predict, assume or say`); continue; }
    if (!c.question) fails.push(`${at}: no \`- question:\``);
    if (c.from !== "say") {
      if (!c.likelyWrong) fails.push(`${at}: no \`- likely_wrong:\` (why a reasonable person would picture it otherwise)`);
      if (!c.matters) fails.push(`${at}: no \`- matters:\` (what depends on it)`);
    }
    if (c.kind !== "predict") {
      if (c.answer) fails.push(`${at}: an ${c.kind} card has no right answer; only you can settle it`);
      if (c.options.length) fails.push(`${at}: an ${c.kind} card has no options (assume: Right, Not quite, Doesn't matter; say: your own words)`);
      continue;
    }
    if (c.options.length < 2) fails.push(`${at}: a predict card has two to four options`);
    if (!c.answer || !c.options.some((o) => o.id === c.answer)) fails.push(`${at}: \`- answer:\` names none of its options`);
    if (!c.why) fails.push(`${at}: no \`- why:\` (one sentence, shown after you answer)`);
    if (!c.source) { fails.push(`${at}: no \`- source: <path>:<from>-<to>\``); continue; }
    const { text, note } = linesOf(dir, c, { repo });
    if (text == null) { fails.push(`${at}: ${note}`); continue; }
    if (note) warns.push(`${at}: ${note}`);
    if (!c.quote) fails.push(`${at}: no \`- quote:\` (the lines that show the answer, word for word)`);
    else if (!quoteIn(c.quote, text)) fails.push(`${at}: its quote is not in ${c.source} word for word`);
    const k = knownAt(knows, refOf(c.source).path, text);
    if (k && !k.due && !c.onceMore) fails.push(`${at}: you know this already (Got it on ${String(k.at).slice(0, 10)}, the same lines): drop it, or ask it once it is due`);
    if (k && k.due && !c.onceMore) warns.push(`${at}: due once more (Got it on ${String(k.at).slice(0, 10)}): ask it on a new case and mark it \`- once_more: ${k.fingerprint}\``);
    if (checker) {
      const a = checked?.[c.id];
      if (!checked) fails.push(`${at}: the fresh checker has not answered it yet (align ${relative(process.cwd(), dir)} --prompt checker)`);
      else if (!a) fails.push(`${at}: the checker's answers.md has no line for it`);
      else if (a.answer === "?") fails.push(`${at}: the checker says its lines do not decide it (${a.why || "no reason given"}): quote the lines that do, and check again`);
      else if (a.answer !== c.answer) fails.push(`${at}: the checker read the lines as ${a.answer.toUpperCase()}, the card says ${c.answer.toUpperCase()}: rewrite it once from the quoted lines and check again; if you still disagree, drop it and list it as "the agent and the checker read this code differently"`);
    }
  }
  return { fails, warns, cards };
}

// ── the fresh checker (agent ↔ code) ─────────────────────────────────────────────────────────────────────
/** Write checker/brief.md: each predict card's question, options and its lines, never the answer or why. → path */
export function writeCheckerBrief(dir, { repo = repoOfRound(dir) } = {}) {
  const cards = parseCards(read(join(dir, "align.md"))).filter((c) => c.kind === "predict");
  const out = [`# The checker's brief · ${basename(dir)}`, "",
    "Each card below asks what some code does. Answer each from its lines alone: they are the code as it was pinned.",
    "Do not guess from names, and do not read anything else. Write one line a card to `answers.md` beside this file:", "",
    "    - c2: b · <the words in the lines that decide it>", "",
    "If the lines do not decide it, write `- c2: ? · <what is missing>`.", ""];
  for (const c of cards) {
    const { text } = linesOf(dir, c, { repo });
    out.push(`## ${c.id}`, "", c.question, "", ...c.options.map((o) => `- ${o.id.toUpperCase()} · ${o.label}`), "", `${c.source}:`, "", "```", text ?? "(these lines cannot be read here)", "```", "");
  }
  mkdirSync(join(dir, "checker"), { recursive: true });
  writeFileSync(join(dir, "checker", "brief.md"), out.join("\n"));
  return join(dir, "checker", "brief.md");
}
export const checkerPrompt = (dir) => `You are checking the answers to a few questions about some code. You did not write them, and you do not see their
answers. Everything you get is in one file:

  ${join(resolve(dir), "checker", "brief.md")}

Read it in full. Do not open any other file. Answer each card from its lines alone, and write your answers to exactly:

  ${join(resolve(dir), "checker", "answers.md")}

It is the only file you write. Then reply with how many cards you answered.`;
/** The checker's answers: { c2: { answer: "b", why } } from checker/answers.md, or null when there is none. */
export function checkerAnswers(dir) {
  const t = read(join(dir, "checker", "answers.md")); if (!t) return null;
  const out = {};
  for (const m of t.matchAll(/^- (c\d+):\s*([a-d]|\?)(?=\s|$)\s*(?:·\s*(.*))?$/gim)) out[m[1].toLowerCase()] = { answer: m[2].toLowerCase(), why: (m[3] || "").trim() };
  return out;
}

// ── where gaps are likely (step 1's four places) ─────────────────────────────────────────────────────────
/** The candidates `align --candidates` prints: your words, your memory, what moved, and the due cards. */
export function candidates(dir, { repo = repoOfRound(dir), path = youPath(), now = Date.now() } = {}) {
  const md = read(join(dir, "align.md")), words = ((/\*\*Your words:\*\*\s*(.*)/.exec(md) || [])[1] || "").replace(/^"(.*)"$/, "$1");
  const name = repoName(repo) || basename(resolve(repo)), facts = readYou(path).filter((f) => !f.repo || f.repo === name);
  const wrong = facts.flatMap((f) => (f.wrongChecks || []).filter((w) => w.correct === false).map((w) => ({ ...w, plan: f.plan }))).slice(-8);
  const own = facts.flatMap((f) => (f.own || []).map((o) => ({ ...o, plan: f.plan }))).slice(-5);
  const looked = [...new Set(facts.flatMap((f) => f.lost?.looked || []))].slice(-10);
  const lastWatched = facts.flatMap((f) => (f.watched || []).map((w) => w.at)).filter(Boolean).sort().pop() || null;
  const pinned = (readJson(join(dir, "sources.json"))?.sources || []).filter((s) => s.form === "path");
  const moved = lastWatched ? pinned.map((s) => ({ path: s.id, commits: (git(repo, "log", "--oneline", `--since=${lastWatched}`, "--", s.id) || "").trim().split("\n").filter(Boolean) })).filter((m) => m.commits.length) : [];
  const due = knowsFor(repo, { path, now }).filter((k) => k.due);
  return { words, wrong, own, looked, lastWatched, moved, due };
}

// ── the one record of the answers (D-314) ────────────────────────────────────────────────────────────────
/**
 * Validate answers from any way in: [{ card, answer, own?, settled?, via, claims? }] (or { cards: [...], skipped? }).
 * answer: a predict card's letter or "not-sure" or "own"; an assume card's "right", "not-quite" (with own words) or
 * "doesnt-matter"; a say card's "said" (its words in `own`). → { answers, skipped, errors }
 */
export function validAnswers(cards, input) {
  const list = Array.isArray(input) ? input : input?.answers || input?.cards || [], errors = [], answers = [];
  const byId = Object.fromEntries(cards.map((c) => [c.id, c]));
  for (const a of list) {
    const c = byId[String(a?.card || "").toLowerCase()]; if (!c) { errors.push(`no card ${a?.card}`); continue; }
    const ans = String(a.answer || "").toLowerCase(), own = String(a.own || "").trim(), settled = a.settled ? String(a.settled) : null;
    const ok = c.kind === "predict" ? [...c.options.map((o) => o.id), "not-sure", "own"].includes(ans)
      : c.kind === "assume" ? ["right", "not-quite", "doesnt-matter"].includes(ans) : ans === "said";
    if (!ok) { errors.push(`${c.id}: "${a.answer}" is not an answer to a ${c.kind} card`); continue; }
    if ((ans === "own" || ans === "not-quite" || ans === "said") && !own) { errors.push(`${c.id}: "${ans}" needs your words in \`own\``); continue; }
    if (settled && !SETTLE.includes(settled)) { errors.push(`${c.id}: "${settled}" is not one of ${SETTLE.join(", ")}`); continue; }
    if (settled && ans === "not-sure" && !["got-it", "show-more"].includes(settled)) { errors.push(`${c.id}: Not sure settles with Got it or Show me more`); continue; }
    if (settled === "code-wrong" && c.kind !== "predict") { errors.push(`${c.id}: The code is wrong settles a card about the code`); continue; }
    answers.push({ card: c.id, answer: ans, ...(own ? { own } : {}), ...(settled ? { settled } : {}), via: ["chat", "page", "video"].includes(a.via) ? a.via : "chat",
      ...(Array.isArray(a.claims) ? { claims: a.claims } : {}), at: a.at || new Date().toISOString() });
  }
  const skipped = (Array.isArray(input?.skipped) ? input.skipped : []).map((x) => String(x).toLowerCase()).filter((x) => byId[x]);
  return { answers, skipped, errors };
}
/** Whether an answer is a gap: a predict card answered other than its answer, or Not sure; an assume card Not quite. */
export function gapOf(card, a) {
  if (!a) return null;
  if (card.kind === "predict") return a.answer === "not-sure" ? "not-sure" : a.answer !== card.answer ? "gap" : "same";
  if (card.kind === "assume") return a.answer === "not-quite" ? "gap" : "same";
  return (a.claims || []).some((c) => c.verdict === "differs") ? "gap" : "said";
}

/**
 * Record answers into the round (answers.json, merged by card) and send each newly settled gap where it goes (step 4):
 *   Got it          your file (you.jsonl): what you know, at its lines' fingerprint, due once more in three days
 *   Change the plan the plan's "You told me first" (the round's --plan), else align.md's, for Plan this
 *   The code is wrong  a step of the plan (its You told me first, marked so), else issue.md for you to file
 *   Show me more    listed for the round's one explainer (align --explain-gaps prints the command)
 * An assume card answered Not quite goes to You told me first as your words; skipped cards to "Assumed, not checked".
 * Nothing goes into the decision log. → { record, routed: [lines said], errors }
 */
export function recordAnswers(dir, input, { repo = repoOfRound(dir), knowsPath = youPath(), now = new Date() } = {}) {
  const md = read(join(dir, "align.md")), cards = parseCards(md), byId = Object.fromEntries(cards.map((c) => [c.id, c]));
  const { answers, skipped, errors } = validAnswers(cards, input);
  if (errors.length) return { record: null, routed: [], errors };
  const path = join(dir, "answers.json"), record = readJson(path) || { round: basename(dir), cards: {}, skipped: [], routed: {} };
  record.routed ||= {};
  // a card answered again keeps what it settled only when the answer is the same: a new answer is a new card to settle
  for (const a of answers) { const prev = record.cards[a.card]; record.cards[a.card] = prev && prev.answer === a.answer ? { ...prev, ...a } : { ...a }; }
  record.skipped = [...new Set([...(record.skipped || []), ...skipped])].filter((id) => !record.cards[id]);
  const routed = [], plan = planDirOf(dir, repo), told = [], fixes = [], notChecked = [];
  for (const c of cards) {
    const a = record.cards[c.id]; if (!a) continue;
    const gap = gapOf(c, a), key = `${c.id}:${a.settled || a.answer}`;
    if (record.routed[c.id] === key) continue;
    if (c.kind === "assume" && a.answer === "not-quite") { told.push(`- **${c.id}** "${c.question}" Not quite: "${a.own}"`); routed.push(`${c.id} → You told me first`); }
    else if (c.kind === "assume" && a.answer === "right") { told.push(`- **${c.id}** "${c.question}" Right.`); routed.push(`${c.id} → You told me first, in a line`); }
    else if (gap && gap !== "same" && gap !== "said" && a.settled) {
      const label = c.options.find((o) => o.id === c.answer)?.label;
      if (a.settled === "got-it" && c.kind === "predict") {
        const { text } = linesOf(dir, c, { repo }), ref = refOf(c.source);
        const prior = knowsFor(repo, { path: knowsPath }).find((k) => k.fingerprint === fingerprint(text || ""));
        const asked = c.onceMore || prior ? 2 : 1;
        appendKnows({ repo: repoName(repo) || basename(resolve(repo)), round: basename(dir), card: c.id, claim: `${c.question} ${label}`, source: c.source, path: ref.path,
          fingerprint: fingerprint(text || ""), at: now.toISOString(), dueAt: asked < 2 ? new Date(now.getTime() + ONCE_MORE_DAYS * 864e5).toISOString() : null, asked }, knowsPath);
        routed.push(`${c.id} → your memory${asked < 2 ? `, asked once more on a new case from ${new Date(now.getTime() + ONCE_MORE_DAYS * 864e5).toISOString().slice(0, 10)}` : ", known for good"}`);
      } else if (a.settled === "change-plan") { told.push(`- **${c.id}** "${c.question}" The code: ${label || "(see the card)"}. You want it otherwise${a.own ? `: "${a.own}"` : ""}.`); routed.push(`${c.id} → You told me first`); }
      else if (a.settled === "code-wrong") { fixes.push({ c, a, label }); routed.push(`${c.id} → ${plan ? "a step of the plan" : "issue.md, for you to file"}`); }
      else if (a.settled === "show-more") routed.push(`${c.id} → the round's one explainer (align --explain-gaps)`);
      else if (a.settled === "got-it") routed.push(`${c.id} → noted`);
    } else continue;
    record.routed[c.id] = key;
  }
  for (const id of record.skipped) if (!record.routed[`skip:${id}`]) { notChecked.push(`- **${id}** "${byId[id].question}"`); record.routed[`skip:${id}`] = true; routed.push(`${id} → Assumed, not checked`); }
  if (fixes.length) {
    const lines = fixes.map(({ c, a, label }) => `- **${c.id}** The code is wrong: "${c.question}" It does ${label} (\`${c.source}\`)${a.own ? `; you said: "${a.own}"` : ""}.`);
    if (plan) told.push(...lines.map((l) => `${l} A step of this plan.`));
    else writeFileSync(join(dir, "issue.md"), `${read(join(dir, "issue.md")) || `# The code is wrong: what a round found\n\nFrom the round \`${basename(dir)}\`, for you to file (nothing is sent anywhere).\n\n`}${lines.join("\n")}\n`);
  }
  if (told.length) appendSection(plan ? join(plan, "plan.md") : join(dir, "align.md"), "You told me first", told);
  if (notChecked.length) appendSection(plan ? join(plan, "plan.md") : join(dir, "align.md"), "Assumed, not checked", notChecked);
  writeFileSync(path, JSON.stringify(record, null, 2) + "\n");
  writeAfter(dir, cards, record);
  return { record, routed, errors: [] };
}
/** The plan a round was started for (`**Plan:**` in align.md), if it is a folder with a plan.md. */
export function planDirOf(dir, repo = repoOfRound(dir)) {
  const m = /^\*\*Plan:\*\*\s*`?([^`\n]+?)`?\s*$/m.exec(read(join(dir, "align.md")));
  if (!m || /^none$/i.test(m[1])) return null;
  const p = resolve(repo, m[1]);
  return existsSync(join(p, "plan.md")) ? p : null;
}
/** Add lines under a `## <heading>` of a markdown file, making the section (before the first `### Step`, else at the end). */
export function appendSection(file, heading, lines) {
  let s = read(file);
  const h = `## ${heading}`, at = s.indexOf(`\n${h}\n`);
  if (at >= 0) {
    const start = at + h.length + 2, next = s.slice(start).search(/\n## |\n### /), end = next < 0 ? s.length : start + next;
    s = `${s.slice(0, end).replace(/\n+$/, "")}\n${lines.join("\n")}\n${s.slice(end)}`;
  } else {
    const step = s.search(/\n### Step /), block = `\n${h}\n\n${lines.join("\n")}\n`;
    s = step >= 0 ? `${s.slice(0, step)}\n${block.trim()}\n${s.slice(step)}` : `${s.replace(/\n+$/, "")}\n${block}`;
  }
  writeFileSync(file, s);
}
/** align.md's `## After the round`: each card, your answer, same or a gap, and how it was settled (written again each record). */
export function writeAfter(dir, cards, record) {
  const file = join(dir, "align.md"); let s = read(file);
  const rows = cards.map((c) => {
    const a = record.cards[c.id];
    if (!a) return `- **${c.id}** ${(record.skipped || []).includes(c.id) ? "skipped" : "not answered yet"}`;
    const ans = c.kind === "predict" ? (a.answer === "not-sure" ? "Not sure" : a.answer === "own" ? `your words: "${a.own}"` : `${a.answer.toUpperCase()} · ${c.options.find((o) => o.id === a.answer)?.label || ""}`)
      : c.kind === "assume" ? { right: "Right", "not-quite": `Not quite: "${a.own}"`, "doesnt-matter": "Doesn't matter" }[a.answer] : `"${a.own}"`;
    const gap = gapOf(c, a), claims = (a.claims || []).map((x) => `${x.verdict === "match" ? "✓" : x.verdict === "differs" ? "✗" : "?"} "${x.words}"`).join("; ");
    return `- **${c.id}** ${ans} · ${gap === "same" ? "same picture" : gap === "not-sure" ? "not sure: a gap" : gap === "said" ? "said" : "a gap"}${a.settled ? ` · ${SETTLE_WORDS[a.settled]}` : ""} · via ${a.via}${claims ? ` · ${claims}` : ""}`;
  });
  const block = `## After the round\n\n${rows.join("\n")}\n`, head = "\n## After the round\n";
  const at = s.indexOf(head);
  if (at >= 0) { const rest = s.slice(at + head.length), next = rest.search(/\n## /); s = `${s.slice(0, at)}\n${block}${next < 0 ? "" : rest.slice(next)}`; }
  else s = `${s.replace(/\n+$/, "")}\n\n${block}`;
  writeFileSync(file, s);
}
/** The say card's claims, checked (step 3): [{ words, from, to, verdict: match | differs | open | unsettled, source, quote }]. */
export function validClaims(input) {
  const list = Array.isArray(input) ? input : input?.claims || [], errors = [];
  const claims = list.map((c, i) => {
    if (!String(c?.words || "").trim()) { errors.push(`claim ${i + 1}: no words`); return null; }
    if (!["match", "differs", "open", "unsettled"].includes(c.verdict)) { errors.push(`claim ${i + 1}: verdict "${c.verdict}": match, differs, open or unsettled`); return null; }
    if ((c.verdict === "match" || c.verdict === "differs") && !c.source) { errors.push(`claim ${i + 1}: a ${c.verdict} names the lines it was checked against (\`source\`)`); return null; }
    return { words: String(c.words).trim(), ...(Number.isInteger(c.from) ? { from: c.from, to: c.to } : {}), verdict: c.verdict, ...(c.source ? { source: c.source } : {}), ...(c.quote ? { quote: c.quote } : {}) };
  }).filter(Boolean);
  return { claims, errors };
}
/** The gaps you asked more on, and the command that makes their one explainer (step 4). */
export function explainGaps(dir) {
  const cards = parseCards(read(join(dir, "align.md"))), rec = readJson(join(dir, "answers.json")) || { cards: {} };
  const more = cards.filter((c) => rec.cards[c.id]?.settled === "show-more");
  const srcs = [...new Set(more.map((c) => refOf(c.source)?.path).filter(Boolean))];
  const ask = more.map((c) => { const a = rec.cards[c.id]; const mine = a.answer === "not-sure" ? "you were not sure" : `you expected ${c.options.find((o) => o.id === a.answer)?.label || a.own || "otherwise"}`; return `${c.question} (${mine})`; }).join(" ");
  return { more, command: more.length ? `reelplanner explain ${JSON.stringify(`Show me more on the gaps of ${basename(dir)}: ${ask}`)} ${srcs.join(" ")} --depth low` : null };
}
/** The cards as the chat asks them (assume first, while the checker reads the predict cards): front and back. */
export function cardsForChat(dir) {
  const cards = parseCards(read(join(dir, "align.md")));
  const order = [...cards.filter((c) => c.kind === "assume"), ...cards.filter((c) => c.kind === "predict"), ...cards.filter((c) => c.kind === "say")];
  return order.map((c) => {
    const front = c.kind === "predict" ? { question: c.question, options: [...c.options.map((o) => ({ id: o.id, label: o.label })), { id: "not-sure", label: "Not sure" }] }
      : c.kind === "assume" ? { question: c.question, options: [{ id: "right", label: "Right" }, { id: "not-quite", label: "Not quite (say what)" }, { id: "doesnt-matter", label: "Doesn't matter" }] }
      : { question: c.question, options: [] };
    const lines = c.kind === "predict" ? linesOf(dir, c).text : null;
    return { id: c.id, kind: c.kind, front, back: c.kind === "predict" ? { answer: c.answer, label: c.options.find((o) => o.id === c.answer)?.label, source: c.source, lines, why: c.why } : null };
  });
}
/** A new round's align.md. */
export function roundMd({ title, words, plan, head, sourceLines }) {
  return `# Round: ${title}

**Your words:** "${words}"
**Plan:** ${plan ? `\`${plan}\`` : "none"}
**Pinned at:** \`${head}\`

Sources:
${sourceLines.map((l) => `- ${l}`).join("\n")}

## Cards

<!-- At most ${MAX_CARDS}, where a gap is likely and costly (\`reelplanner align <this folder> --candidates\` lists where to look).
     Every card says why you might picture it otherwise (likely_wrong) and what depends on it (matters).
     A predict card holds its answer, the lines that show it (source: path:from-to, as pinned) and those lines quoted.

### c1 · assume
- question: I'm assuming you mean …
- likely_wrong: …
- matters: …

### c2 · predict
- question: …
- option_a: …
- option_b: …
- answer: b
- source: path/to/file.mjs:10-14
- quote: "the line, word for word"
- why: …
- likely_wrong: …
- matters: …
-->
`;
}
/** Every round in a repo, newest first. */
export function roundsOf(repo) {
  const d = roundsDir(repo); if (!existsSync(d)) return [];
  return readdirSync(d).filter((n) => existsSync(join(d, n, "align.md"))).sort().reverse().map((n) => join(d, n));
}

// ── measured (step 5): rounds, the gaps they found, and later surprises with a round and without ──────────────────
/** Plans of each kind a comparison needs before `reel status` says anything about it. */
export const COMPARE_AT = 5;
/** A plan's `**Round:**` line, which the skill writes in its header: a round's folder, `none, a likely, costly gap
 *  (<why no round>)`, or `none needed`. → { round } | { likelyNoRound: why } | { none: true } | null */
export function roundLineOf(planMd) {
  const m = /^\*\*Round:\*\*\s*(.+?)\s*$/m.exec(planMd || ""); if (!m) return null;
  const v = m[1].replace(/`/g, "");
  if (/^none\b.*\blikely\b/i.test(v)) return { likelyNoRound: (/\(([^)]*)\)/.exec(v) || [])[1] || "" };
  if (/^none\b/i.test(v)) return { none: true };
  return { round: v };
}
/**
 * What rounds did in a set-up repo: rounds, gaps per round and how each was settled, and later surprises (answers in
 * your own words, "Expected something else", calls you flagged in a walkthrough, late fixes) on plans that had a round
 * against plans where a likely, costly gap was found and no round ran. `facts`, `misses`: lib/memory.mjs repoMemory's.
 */
export function roundStats(rp, { facts = [], misses = [] } = {}) {
  const repo = dirname(rp), plansDir = join(rp, "plans");
  const rounds = roundsOf(repo), settled = { "got-it": 0, "change-plan": 0, "code-wrong": 0, "show-more": 0, none: 0 };
  let gaps = 0, answered = 0;
  const withRound = new Set(), likelyNoRound = new Set();
  for (const d of rounds) {
    const cards = parseCards(read(join(d, "align.md"))), rec = readJson(join(d, "answers.json"));
    if (rec) answered++;
    for (const c of cards) { const a = rec?.cards?.[c.id], g = gapOf(c, a); if (!g || g === "same" || g === "said") continue; gaps++; settled[a.settled || "none"]++; }
    const p = /^\*\*Plan:\*\*\s*`?([^`\n]+?)`?\s*$/m.exec(read(join(d, "align.md")))?.[1];
    if (p && !/^none$/i.test(p) && rec) withRound.add(basename(p));
  }
  const plans = existsSync(plansDir) ? readdirSync(plansDir).filter((p) => existsSync(join(plansDir, p, "plan.md"))) : [];
  for (const p of plans) {
    const l = roundLineOf(read(join(plansDir, p, "plan.md")));
    if (l?.round && rounds.some((d) => basename(d) === basename(l.round))) withRound.add(p);
    else if (l?.likelyNoRound != null && !withRound.has(p)) likelyNoRound.add(p);
  }
  const KINDS = { own: "own words", expected: "Expected something else", flagged: "flagged calls", late: "late fixes" };
  const count = (set) => {
    const n = { own: 0, expected: 0, flagged: 0, late: 0 };
    for (const f of facts) if (set.has(f.plan)) { n.own += (f.own || []).length; n.expected += (f.wrongChecks || []).filter((w) => w.note).length; if (f.kind === "walkthrough") n.flagged += (f.flagged || []).length; }
    for (const m of misses) if (set.has(m.plan) && m.type !== "reworked") n.late++;   // (a reworked step is its Expected something else, counted above)
    return n;
  };
  return { rounds: rounds.length, answered, gaps, settled, withRound: [...withRound], likelyNoRound: [...likelyNoRound], KINDS,
    surprises: { withRound: count(withRound), likelyNoRound: count(likelyNoRound) }, enough: withRound.size >= COMPARE_AT && likelyNoRound.size >= COMPARE_AT };
}
/** reel status's lines for it: [] with no round and no plan judged. */
export function roundStatusLines(s) {
  if (!s.rounds && !s.likelyNoRound.length) return [];
  const st = s.settled, parts = [st["got-it"] && `Got it ${st["got-it"]}`, st["change-plan"] && `the plan ${st["change-plan"]}`, st["code-wrong"] && `a fix ${st["code-wrong"]}`, st["show-more"] && `more ${st["show-more"]}`, st.none && `not settled ${st.none}`].filter(Boolean);
  const lines = [`rounds: ${s.rounds}${s.rounds !== s.answered ? ` (${s.answered} answered)` : ""}, gaps: ${s.gaps}${parts.length ? ` (${parts.join(", ")})` : ""}${s.answered ? `, ${(s.gaps / s.answered).toFixed(1)} a round` : ""}`];
  const w = s.surprises.withRound, n = s.surprises.likelyNoRound;
  lines.push(`later surprises, with a round · likely gap, no round: ${Object.keys(s.KINDS).map((k) => `${s.KINDS[k]} ${w[k]} · ${n[k]}`).join("; ")}`);
  lines.push(s.enough ? `over ${s.withRound.length} plans with a round and ${s.likelyNoRound.length} with a likely gap and none: compare them`
    : `too few plans to compare (${s.withRound.length} with a round, ${s.likelyNoRound.length} with a likely gap and none; ${COMPARE_AT} of each)`);
  return lines;
}
