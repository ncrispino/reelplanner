#!/usr/bin/env node
// An alignment round (find-the-gaps, #57): find where you and the agent picture the code differently, and settle each gap.
//
//   reelplanner align "<topic, in your words>" <source> … [--plan <plan-dir>] [--slug <slug>] [--date <yyyy-mm-dd>]
//       start a round: .reelplanner/align/<date>-<slug>/ (a repo not set up: ~/.reelplanner/align/<repo-key>/…, nothing
//       written into the repo), with align.md to write the cards in and sources.json, each source pinned as an
//       explainer pins it. --plan: a round before that plan; what it settles goes into the plan's You told me first
//   reelplanner align <round> --candidates     where gaps are likely: your words, your memory, what moved, cards due once more
//   reelplanner align <round> --check          the rules a round passes before it opens (at most six cards; why you might
//                                              picture it otherwise and what depends on it; each quote in its lines word for
//                                              word; nothing you know already; the fresh checker agrees). --no-checker skips
//                                              the last, to write the brief first
//   reelplanner align <round> --prompt checker writes checker/brief.md (no answers in it) and prints the fresh checker's prompt
//   reelplanner align <round> --cards [--json] the cards as the chat asks them: assume first, each front, then its back
//   reelplanner align record <round> <answers.json>   the one record of the answers, whichever way they came, and where
//                                              each settled gap goes: your memory, the plan, a fix, the round's explainer
//   reelplanner align answer <round> <card> <claims.json>   a say card's words, split into claims and checked
//   reelplanner align <round> --prompt claims --card <card>  the fresh checker's brief on those claims (never the marks)
//   reelplanner align <round> --claims <card>   its reading applied: a claim it reads otherwise is "not settled"
//   reelplanner align <round> --explain-gaps   the command that makes the one explainer of the gaps you asked more on
//   reelplanner align due [<repo>]             the things you said Got it to that are due once more
//   reelplanner align list [<repo>]            this repo's rounds
// Nothing a round settles goes into the decision log: it gets there through a plan's own questions.
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve, relative, basename } from "node:path";
import { execFileSync } from "node:child_process";
import { pinAll, sourceLine, slugOf, repoTop } from "./lib/explainer.mjs";
import { rpDirOf } from "./lib/env.mjs";
import { roundsDir, roundDirOf, roundMd, checkRound, writeCheckerBrief, checkerPrompt, candidates, recordAnswers, validClaims,
  parseCards, explainGaps, cardsForChat, knowsFor, roundsOf, MAX_CARDS, writeClaimsBrief, claimsPrompt, applyClaimsCheck } from "./lib/align.mjs";

const args = process.argv.slice(2);
const VALUED = new Set(["--plan", "--slug", "--date", "--repo", "--prompt", "--card", "--claims"]);
const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 && args[i + 1] ? args[i + 1] : null; };
const has = (n) => args.includes(`--${n}`);
const die = (m) => { console.error(`✗ align: ${m}`); process.exit(1); };
const plain = args.filter((a, i) => !a.startsWith("--") && !VALUED.has(args[i - 1]));
const rel = (p) => relative(process.cwd(), p) || ".";
const readJson = (p) => { try { return JSON.parse(readFileSync(resolve(p), "utf8")); } catch (e) { die(`${p}: ${e.message}`); } };
const USAGE = `usage: reelplanner align "<topic>" <source> … [--plan <plan-dir>] · align <round> --candidates | --check | --prompt checker | --cards | --explain-gaps
       align record <round> <answers.json> · align answer <round> <card> <claims.json> · align due [<repo>] · align list [<repo>]`;
if (!plain.length || has("help")) { console.log(USAGE); process.exit(plain.length ? 0 : 1); }

const round = (p) => roundDirOf(p) || die(`${p} is not a round's folder (no align.md and sources.json)`);
const [first] = plain;

if (first === "record") {
  const dir = round(plain[1] || die(USAGE)), input = readJson(plain[2] || die(USAGE));
  const { routed, errors } = recordAnswers(dir, input);
  if (errors.length) die(`not recorded:\n${errors.map((e) => `  ${e}`).join("\n")}`);
  console.log(`✓ ${rel(join(dir, "answers.json"))}: the round's one record`);
  for (const r of routed) console.log(`  ${r}`);
  const more = explainGaps(dir); if (more.more.length) console.log(`  the gaps you asked more on, in one short video: ${more.command}`);
  process.exit(0);
}
if (first === "answer") {
  const dir = round(plain[1] || die(USAGE)), card = String(plain[2] || die(USAGE)).toLowerCase(), input = readJson(plain[3] || die(USAGE));
  const c = parseCards(readFileSync(join(dir, "align.md"), "utf8")).find((x) => x.id === card) || die(`no card ${card}`);
  if (c.kind !== "say") die(`${card} is a ${c.kind} card: claims answer a say card`);
  const { claims, errors } = validClaims(input); if (errors.length) die(errors.join("\n  "));
  const words = input.words || claims.map((x) => x.words).join(" ");
  const { routed, errors: e2 } = recordAnswers(dir, [{ card, answer: "said", own: words, claims, via: input.via || "page" }]);
  if (e2.length) die(e2.join("\n  "));
  console.log(`✓ ${card}: ${claims.length} claim${claims.length === 1 ? "" : "s"}, ${claims.filter((x) => x.verdict === "match").length} ✓, ${claims.filter((x) => x.verdict === "differs").length} ✗, ${claims.filter((x) => x.verdict === "open").length} ?`);
  const open = claims.filter((x) => x.verdict === "open"); if (open.length) console.log(`  add an assume card for each ? to this round (\`- from: say\`, not counted in its ${MAX_CARDS}): ${open.map((x) => `"${x.words}"`).join(", ")}`);
  if (claims.some((x) => x.verdict === "match" || x.verdict === "differs")) console.log(`  next, before they see the marks, the fresh checker reads each marked claim from its lines alone:\n  reelplanner align ${rel(dir)} --prompt claims --card ${card}, that prompt in a fresh agent, then reelplanner align ${rel(dir)} --claims ${card}`);
  for (const r of routed) console.log(`  ${r}`);
  process.exit(0);
}
if (first === "due" || first === "list") {
  const repo = repoTop(resolve(plain[1] || process.cwd())) || die("not inside a git repo");
  if (first === "list") { const rs = roundsOf(repo); if (!rs.length) console.log(`· no rounds yet (${rel(roundsDir(repo))})`); for (const r of rs) console.log(`${rel(r)} · ${parseCards(readFileSync(join(r, "align.md"), "utf8")).length} cards${existsSync(join(r, "answers.json")) ? " · answered" : ""}`); process.exit(0); }
  const due = knowsFor(repo).filter((k) => k.due);
  if (!due.length) console.log("· nothing is due once more");
  for (const k of due) console.log(`due once more (Got it on ${String(k.at).slice(0, 10)}): ${k.claim} · \`${k.source}\` · ask it on a new case, \`- once_more: ${k.fingerprint}\``);
  process.exit(0);
}

const existing = roundDirOf(first);
if (existing) {
  const dir = existing;
  if (flag("prompt")) {
    if (flag("prompt") === "claims") {
      const card = String(flag("card") || die("--prompt claims --card <the say card>")).toLowerCase();
      let brief; try { brief = writeClaimsBrief(dir, card); } catch (e) { die(e.message); }
      console.error(`✓ ${rel(brief)}: each claim marked match or differs, and its lines, never the mark. Launch one fresh agent with no context of this conversation, with exactly the prompt below, and nothing else`);
      console.log(claimsPrompt(dir, card)); process.exit(0);
    }
    if (flag("prompt") !== "checker") die(`--prompt ${flag("prompt")}: checker, or claims --card <card>`);
    const brief = writeCheckerBrief(dir);
    console.error(`✓ ${rel(brief)}: each predict card's question, options and lines, never its answer. Launch one fresh agent with no context of this conversation, with exactly the prompt below, and nothing else`);
    console.log(checkerPrompt(dir)); process.exit(0);
  }
  if (has("candidates")) {
    const c = candidates(dir);
    console.log(`Where gaps are likely (step 1's four places; keep at most ${MAX_CARDS}, the likeliest and costliest):`);
    console.log(`1. Your words: "${c.words}". What do they take for granted?`);
    console.log(`2. Your memory: ${c.wrong.length ? c.wrong.map((w) => `\n   a quick check you got wrong: "${w.question}" (you: ${w.answered}; the answer: ${w.answer}) · ${w.plan}`).join("") : "no quick check you got wrong here"}${c.own.length ? c.own.map((o) => `\n   in your own words: "${o.words}" · ${o.plan}`).join("") : ""}${c.looked.length ? `\n   words you looked up: ${c.looked.join(", ")}` : ""}`);
    console.log(`3. What moved: ${c.lastWatched ? (c.moved.length ? c.moved.map((m) => `\n   ${m.path}: ${m.commits.length} commit${m.commits.length === 1 ? "" : "s"} since you last watched (${c.lastWatched.slice(0, 10)})`).join("") : `nothing in the pinned files since you last watched (${c.lastWatched.slice(0, 10)})`) : "no video watched here yet"}`);
    console.log(`4. Your own assumptions: what would you take for granted to write the plan? Each is an assume card.`);
    if (c.due.length) console.log(`Due once more (D-316): ${c.due.map((k) => `\n   ${k.claim} · \`${k.source}\` (Got it on ${String(k.at).slice(0, 10)}): one more card, a new case on the same rule, \`- once_more: ${k.fingerprint}\``).join("")}`);
    process.exit(0);
  }
  if (has("cards")) {
    const cards = cardsForChat(dir);
    if (has("json")) { console.log(JSON.stringify(cards, null, 2)); process.exit(0); }
    for (const c of cards) {
      console.log(`${c.id} · ${c.kind}: ${c.front.question}`);
      for (const o of c.front.options) console.log(`   ${o.id.length === 1 ? o.id.toUpperCase() : "·"} ${o.label}`);
      if (c.back) console.log(`   back: ${c.back.answer.toUpperCase()} · ${c.back.label} · ${c.back.source}\n${(c.back.lines || "").split("\n").map((l) => `     | ${l}`).join("\n")}\n   ${c.back.why}`);
    }
    process.exit(0);
  }
  if (flag("claims")) {
    const card = String(flag("claims")).toLowerCase(), r = applyClaimsCheck(dir, card);
    if (r.missing) die(`no checker answers for ${card} yet (checker/claims-${card}-answers.md): --prompt claims --card ${card} first`);
    const a = JSON.parse(readFileSync(join(dir, "answers.json"), "utf8")).cards[card];
    const { errors } = recordAnswers(dir, [{ card, answer: "said", own: a.own, claims: r.claims, via: a.via || "page", ...(a.settled ? { settled: a.settled } : {}) }]);
    if (errors.length) die(errors.join("\n  "));
    console.log(`✓ ${card}: the checker read ${r.agreed} claim${r.agreed === 1 ? "" : "s"} as the session did${r.unsettled ? `; ${r.unsettled} not settled, shown so (the two read them differently)` : ""}. The page shows the marks now.`);
    process.exit(0);
  }
  if (has("explain-gaps")) { const g = explainGaps(dir); console.log(g.command || "· no gap was asked more on"); process.exit(0); }
  if (has("check")) {
    const { fails, warns, cards } = checkRound(dir, { checker: !has("no-checker") });
    for (const w of warns) console.log(`△ ${w}`);
    for (const f of fails) console.log(`✗ ${f}`);
    const n = (k) => cards.filter((c) => c.kind === k).length;
    console.log(`${fails.length ? "✗" : "✓"} ${basename(dir)}: ${cards.length} card${cards.length === 1 ? "" : "s"} (${n("assume")} assume, ${n("predict")} predict, ${n("say")} say), ${fails.length} failure(s), ${warns.length} warning(s)`);
    process.exit(fails.length ? 1 : 0);
  }
  console.log(USAGE); process.exit(1);
}

// a new round
const [topic, ...specs] = plain;
if (!specs.length) die(`${USAGE}\n  a source: a path in the repo (a file or folder), a commit or a range, worktree, since:<date>, or a decision (D-233)`);
const repo = repoTop(resolve(flag("repo") || process.cwd())) || die("not inside a git repo");
let head = "";
try { head = execFileSync("git", ["-C", repo, "rev-parse", "--short=12", "--verify", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
catch { die(`${repo} has no commit yet: a round's cards quote the code as it was at a commit, so commit once first`); }
const plan = flag("plan") ? resolve(flag("plan")) : null;
if (plan && !existsSync(join(plan, "plan.md"))) die(`--plan ${flag("plan")}: no plan.md there`);
const { sources, errors } = pinAll(specs, { repo, rp: rpDirOf(repo), head });
if (errors.length) die(`could not pin ${errors.length === 1 ? "a source" : `${errors.length} sources`}:\n${errors.map((e) => `  ${e}`).join("\n")}`);
const date = flag("date") || new Date().toISOString().slice(0, 10);
const slug = (flag("slug") || slugOf(topic)).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || "round";
const base = roundsDir(repo);
let name = `${date}-${slug}`; for (let i = 2; existsSync(join(base, name)); i++) name = `${date}-${slug}-${i}`;
const dir = join(base, name); mkdirSync(dir, { recursive: true });
const title = topic.replace(/\s+/g, " ").trim().replace(/^./, (c) => c.toUpperCase()).replace(/[?.!]*$/, "");
writeFileSync(join(dir, "sources.json"), JSON.stringify({ format: 1, kind: "round", repo, commit: head, words: topic, ...(plan ? { plan: relative(repo, plan) } : {}), sources }, null, 2) + "\n");
writeFileSync(join(dir, "align.md"), roundMd({ title, words: topic, plan: plan ? relative(repo, plan) : null, head, sourceLines: sources.map(sourceLine) }));
console.log(`✓ ${rel(dir)}/ · ${sources.length} source${sources.length === 1 ? "" : "s"} pinned at ${head.slice(0, 7)}${base.startsWith(resolve(repo)) ? "" : " · kept on this machine, not in the repo (it has no .reelplanner/)"}`);
console.log(`next: \`align ${rel(dir)} --candidates\`, write at most ${MAX_CARDS} cards in align.md, \`align ${rel(dir)} --check --no-checker\`, then the checker (\`--prompt checker\`) and \`--check\``);
