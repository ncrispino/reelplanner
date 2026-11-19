#!/usr/bin/env node
// The alignment round (find-the-gaps, #57), against scratch repos:
//   align "<topic>" <src>  — a round's folder in a set-up repo's .reelplanner/align/, or this machine's
//                            ~/.reelplanner/align/<repo-key>/ when the repo has no .reelplanner/ (nothing written into it)
//   align --check          — at most six cards; likely_wrong and matters; a quote not in its lines; an assume card with an
//                            answer; a predict card with no source; nothing you know already at the same lines
//   the fresh checker      — its brief holds no answer; a disagreement or a `?` stops the round; agreement passes
//   align record           — the one record, whichever way in; Got it into your file (kind: knows), due once more in
//                            three days; Change the plan and Not quite into the plan's You told me first; The code is
//                            wrong into issue.md with no plan; Show me more listed for one explainer; skipped cards as
//                            Assumed, not checked; Not sure settles only Got it or Show me more; never the decision log
//   known and due          — a card you know at the same lines fails --check; once due it warns, and with once_more passes;
//                            the lines changed: not known any more
//   align answer           — a say card's claims, checked; an open claim asks for an assume card not counted in the six
//   align --cards          — assume first, then predict, then say; each predict card's back holds its lines
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, realpathSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-align-"));
const home = join(tmp, "home"); mkdirSync(home, { recursive: true });
const RH = join(home, ".reelplanner");
process.env.REELPLANNER_HOME = RH;
const env = { ...process.env, HOME: home, REELPLANNER_HOME: RH };
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2500)}` : ""}`); if (!cond) failed++; };
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const write = (p, t) => { mkdirSync(join(p, ".."), { recursive: true }); writeFileSync(p, t); };
const mkrepo = (name) => {
  const repo = join(tmp, name); mkdirSync(repo, { recursive: true });
  const git = (...a) => execFileSync("git", a, { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  git("init", "-q", "-b", "main"); git("config", "user.email", "sam@example.com"); git("config", "user.name", "Sam"); git("config", "commit.gpgsign", "false");
  write(join(repo, "src/send.mjs"), ["// how a review is handed on", "export function send(review, { waiting, command }) {", "  if (waiting) return \"the waiting session\";", "  if (command) return \"a headless run\";", "  return \"the inbox\";", "}", ""].join("\n"));
  git("add", "-A"); git("commit", "-q", "-m", "start");
  return { repo, git };
};
const run = (cwd, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", "align.mjs"), ...a], { encoding: "utf8", cwd, env, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const reel = (cwd, ...a) => { try { return execFileSync("node", [join(ROOT, "scripts", "reel.mjs"), ...a], { encoding: "utf8", cwd, env, stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { return `${e.stdout}${e.stderr}`; } };
const cardsMd = (cards) => `## Cards\n\n${cards.join("\n")}`;
const setCards = (dir, cards) => { const s = read(join(dir, "align.md")); writeFileSync(join(dir, "align.md"), `${s.slice(0, s.indexOf("## Cards"))}${cardsMd(cards)}`); };
const assume = (id, extra = "") => `### ${id} · assume\n- question: I'm assuming you mean the session you have open.\n- likely_wrong: your words say the agent\n- matters: step 2\n${extra}`;
const predict = (id, { answer = "b", quote = "if (command) return \"a headless run\";", source = "src/send.mjs:3-4", likely = "- likely_wrong: it looks like it waits\n", extra = "" } = {}) =>
  `### ${id} · predict\n- question: No session is waiting and a command is set. Where does the review go?\n- option_a: The inbox\n- option_b: A headless run\n- option_c: Nowhere\n- answer: ${answer}\n- source: ${source}\n- quote: "${quote}"\n- why: A set command starts a run.\n${likely}- matters: who works on it\n${extra}`;
const say = (id) => `### ${id} · say\n- question: Say how you think a review is handed on.\n- likely_wrong: three ways run together\n- matters: the whole picture\n`;
const knows = () => read(join(RH, "you.jsonl")).split("\n").filter(Boolean).map((l) => JSON.parse(l)).filter((f) => f.kind === "knows");

try {
  // ── a repo not set up: the round is kept on this machine ────────────────────────────────────────────────
  const bare = mkrepo("bare");
  let r = run(bare.repo, "how a review is handed on", "src/send.mjs");
  ok("align in a repo with no .reelplanner/ keeps the round on this machine", r.code === 0 && /kept on this machine/.test(r.out), r.out);
  const bareRounds = join(RH, "align"), keyDir = existsSync(bareRounds) ? readdirSync(bareRounds)[0] : null;
  ok("…in ~/.reelplanner/align/<repo-key>/, nothing in the repo", keyDir && readdirSync(join(bareRounds, keyDir)).length === 1 && !existsSync(join(bare.repo, ".reelplanner")), keyDir);
  const bdir = join(bareRounds, keyDir, readdirSync(join(bareRounds, keyDir))[0]);
  ok("align.md and sources.json, pinned at the commit", existsSync(join(bdir, "align.md")) && JSON.parse(read(join(bdir, "sources.json"))).commit && /\*\*Your words:\*\* "how a review is handed on"/.test(read(join(bdir, "align.md"))));

  // ── the checks ──────────────────────────────────────────────────────────────────────────────────────────
  setCards(bdir, [assume("c1"), predict("c2", { likely: "" }), predict("c3", { quote: "if (command) return \"the inbox\";" }), `### c4 · assume\n- question: I'm assuming X.\n- answer: a\n- likely_wrong: x\n- matters: y\n`]);
  r = run(bare.repo, bdir, "--check", "--no-checker");
  ok("--check: a card with no likely_wrong fails", r.code === 1 && /c2.*likely_wrong/.test(r.out), r.out);
  ok("--check: a quote not in its lines fails", /c3.*not in src\/send\.mjs:3-4 word for word/.test(r.out), r.out);
  ok("--check: an assume card with an answer fails", /c4.*no right answer/.test(r.out), r.out);
  setCards(bdir, Array.from({ length: 7 }, (_, i) => assume(`c${i + 1}`)));
  r = run(bare.repo, bdir, "--check", "--no-checker");
  ok("--check: seven cards fail (at most six)", r.code === 1 && /7 cards: a round has at most 6/.test(r.out), r.out);
  setCards(bdir, [assume("c1"), predict("c2"), say("c3")]);
  r = run(bare.repo, bdir, "--check", "--no-checker");
  ok("--check --no-checker: good cards pass", r.code === 0, r.out);
  r = run(bare.repo, bdir, "--check");
  ok("--check: a predict card the checker has not answered fails", r.code === 1 && /c2.*checker has not answered/.test(r.out), r.out);

  // ── the fresh checker ───────────────────────────────────────────────────────────────────────────────────
  r = run(bare.repo, bdir, "--prompt", "checker");
  const brief = read(join(bdir, "checker", "brief.md"));
  ok("--prompt checker: the brief holds the question, options and lines, never the answer or why", /## c2/.test(brief) && /if \(command\) return "a headless run";/.test(brief) && !/answer: b/.test(brief) && !/A set command starts a run/.test(brief) && /answers\.md/.test(r.out), brief);
  write(join(bdir, "checker", "answers.md"), "- c2: a · it waits\n");
  r = run(bare.repo, bdir, "--check");
  ok("the checker disagreeing stops the round: rewrite once, or drop it", r.code === 1 && /checker read the lines as A, the card says B/.test(r.out), r.out);
  write(join(bdir, "checker", "answers.md"), "- c2: ? · the lines do not say what command is\n");
  r = run(bare.repo, bdir, "--check");
  ok("a `?` from the checker stops it too: quote the lines that do", r.code === 1 && /lines do not decide it/.test(r.out), r.out);
  write(join(bdir, "checker", "answers.md"), "- c2: b · if (command) return \"a headless run\"\n");
  r = run(bare.repo, bdir, "--check");
  ok("the checker agreeing passes", r.code === 0, r.out);

  // ── --cards: the chat's order and backs ─────────────────────────────────────────────────────────────────
  r = run(bare.repo, bdir, "--cards", "--json");
  const chat = JSON.parse(r.out);
  ok("--cards: assume first, then predict, then say; Not sure on every predict card", chat.map((c) => c.kind).join() === "assume,predict,say" && chat[1].front.options.some((o) => o.id === "not-sure"), r.out);
  ok("--cards: a predict card's back holds its lines and why", /a headless run/.test(chat[1].back.lines) && chat[1].back.answer === "b" && /starts a run/.test(chat[1].back.why), JSON.stringify(chat[1].back));

  // ── record, with no plan ────────────────────────────────────────────────────────────────────────────────
  const ans = (o) => { const p = join(tmp, `answers-${Math.random().toString(36).slice(2)}.json`); writeFileSync(p, JSON.stringify(o)); return p; };
  r = run(bare.repo, "record", bdir, ans([{ card: "c2", answer: "not-sure", settled: "code-wrong", via: "chat" }]));
  ok("record: Not sure settles only Got it or Show me more", r.code === 1 && /Not sure settles with Got it or Show me more/.test(r.out), r.out);
  r = run(bare.repo, "record", bdir, ans([{ card: "c1", answer: "not-quite", via: "chat" }]));
  ok("record: Not quite needs your words", r.code === 1 && /needs your words/.test(r.out), r.out);
  r = run(bare.repo, "record", bdir, ans({ answers: [{ card: "c1", answer: "not-quite", own: "only my open session", via: "chat" }, { card: "c2", answer: "a", settled: "code-wrong", own: "it should wait", via: "chat" }], skipped: ["c3"] }));
  ok("record: answers recorded, each routed", r.code === 0 && /c1 → You told me first/.test(r.out) && /c2 → issue\.md/.test(r.out) && /c3 → Assumed, not checked/.test(r.out), r.out);
  const rec = JSON.parse(read(join(bdir, "answers.json")));
  ok("answers.json: the one record, with how each came (via)", rec.cards.c1.via === "chat" && rec.cards.c2.answer === "a" && rec.skipped.includes("c3"), JSON.stringify(rec));
  ok("The code is wrong, with no plan: issue.md for you to file", /The code is wrong/.test(read(join(bdir, "issue.md"))) && /for you to file/.test(read(join(bdir, "issue.md"))), read(join(bdir, "issue.md")));
  const amd = read(join(bdir, "align.md"));
  ok("align.md: You told me first and Assumed, not checked, with no plan", /## You told me first[\s\S]*only my open session/.test(amd) && /## Assumed, not checked[\s\S]*c3/.test(amd), amd);
  ok("align.md: After the round says each card, same or a gap, how settled", /## After the round[\s\S]*\*\*c2\*\* A · The inbox · a gap · The code is wrong · via chat/.test(amd), amd);
  r = run(bare.repo, "record", bdir, ans([{ card: "c1", answer: "not-quite", own: "only my open session", via: "page" }]));
  ok("record again: nothing routed twice", r.code === 0 && !/c1 →/.test(r.out) && (read(join(bdir, "align.md")).match(/only my open session/g) || []).length === 2, r.out);

  // ── a set-up repo, a plan, Got it, known and due ────────────────────────────────────────────────────────
  const set = mkrepo("set");
  reel(set.repo, "init", set.repo, "--name", "demo", "--kind", "greenfield");
  write(join(set.repo, ".reelplanner/plans/2026-11-18-send/plan.md"), "# Send\n\n## The problem\n\nSend.\n\n### Step 1 — Hand it on\n\nText.\n");
  set.git("add", "-A"); set.git("commit", "-q", "-m", "plan");
  r = run(set.repo, "where a review goes", "src/send.mjs", "--plan", ".reelplanner/plans/2026-11-18-send", "--slug", "send");
  const sdir = join(set.repo, ".reelplanner/align", readdirSync(join(set.repo, ".reelplanner/align"))[0]);
  ok("align in a set-up repo: .reelplanner/align/<date>-<slug>/, its plan named", r.code === 0 && /\*\*Plan:\*\* `\.reelplanner\/plans\/2026-11-18-send`/.test(read(join(sdir, "align.md"))), r.out);
  setCards(sdir, [assume("c1"), predict("c2"), predict("c3", { answer: "b", extra: "" }).replace(/### c3/, "### c3"), say("c4")]);
  write(join(sdir, "checker", "answers.md"), "- c2: b · x\n- c3: b · x\n");
  r = run(set.repo, "record", sdir, ans([{ card: "c1", answer: "not-quite", own: "only my open session", via: "page" }, { card: "c2", answer: "a", settled: "got-it", via: "page" }, { card: "c3", answer: "a", settled: "change-plan", own: "it should wait", via: "page" }]));
  const plan = read(join(set.repo, ".reelplanner/plans/2026-11-18-send/plan.md"));
  ok("with a plan: Not quite and Change the plan go into the plan's You told me first, before its steps", /## You told me first[\s\S]*only my open session[\s\S]*it should wait[\s\S]*### Step 1/.test(plan), plan);
  ok("Got it: into your file as kind knows, at the lines' fingerprint, due once more in three days", knows().length === 1 && knows()[0].fingerprint && knows()[0].asked === 1 && Date.parse(knows()[0].dueAt) - Date.parse(knows()[0].at) === 3 * 864e5, JSON.stringify(knows()));
  ok("nothing goes into the decision log", JSON.parse(read(join(set.repo, ".reelplanner/decisions.json"))).decisions.length === 0);
  ok("reel memory --you shows what is known, and nothing due yet", /Known from rounds: 1[\s\S]*Due once more, on a new case: none/.test(reel(set.repo, "memory", "--you")), reel(set.repo, "memory", "--you"));
  // a new round asking the same lines
  r = run(set.repo, "where a review goes, again", "src/send.mjs", "--slug", "again");
  const adir = join(set.repo, ".reelplanner/align", readdirSync(join(set.repo, ".reelplanner/align")).find((n) => n.includes("again")));
  setCards(adir, [predict("c1")]);
  r = run(set.repo, adir, "--check", "--no-checker");
  ok("known at the same lines and not yet due: --check fails", r.code === 1 && /you know this already/.test(r.out), r.out);
  // make it due: rewrite the fact's due date into the past
  const yp = join(RH, "you.jsonl"); writeFileSync(yp, read(yp).replace(/"dueAt":"[^"]+"/, `"dueAt":"${new Date(Date.now() - 1000).toISOString()}"`));
  r = run(set.repo, adir, "--check", "--no-checker");
  ok("once due: a warning to ask it on a new case, with once_more", r.code === 0 && /due once more/.test(r.out), r.out);
  ok("align due lists it", /due once more/.test(run(set.repo, "due").out), run(set.repo, "due").out);
  setCards(adir, [predict("c1", { extra: `- once_more: ${knows()[0].fingerprint}\n` })]);
  r = run(set.repo, adir, "--check", "--no-checker");
  ok("with once_more: it passes, no warning", r.code === 0 && !/due once more/.test(r.out), r.out);
  write(join(adir, "checker", "answers.md"), "- c1: b · x\n");
  r = run(set.repo, "record", adir, ans([{ card: "c1", answer: "a", settled: "got-it", via: "chat" }]));
  ok("Got it the second time: known for good", r.code === 0 && /known for good/.test(r.out) && knows().at(-1).asked === 2 && !knows().at(-1).dueAt, r.out);
  // the lines change: not known any more
  write(join(set.repo, "src/send.mjs"), read(join(set.repo, "src/send.mjs")).replace("a headless run\";", "a headless run, if it can\";"));
  set.git("commit", "-qam", "change");
  r = run(set.repo, "the same, after a change", "src/send.mjs", "--slug", "after");
  const cdir = join(set.repo, ".reelplanner/align", readdirSync(join(set.repo, ".reelplanner/align")).find((n) => n.includes("after")));
  setCards(cdir, [predict("c1", { quote: "if (command) return \"a headless run, if it can\";" })]);
  r = run(set.repo, cdir, "--check", "--no-checker");
  ok("the lines changed: not known any more, it may be asked", r.code === 0 && !/know this already|due once more/.test(r.out), r.out);

  // ── say: claims ─────────────────────────────────────────────────────────────────────────────────────────
  const claims = join(tmp, "claims.json");
  writeFileSync(claims, JSON.stringify({ words: "It goes to my session. If I'm not there it waits. It should tell me.", claims: [
    { words: "It goes to my session", verdict: "match", source: "src/send.mjs:3" },
    { words: "If I'm not there it waits", verdict: "differs", source: "src/send.mjs:4" },
    { words: "It should tell me", verdict: "open" }] }));
  r = run(set.repo, "answer", sdir, "c4", claims);
  ok("align answer: a say card's claims, ✓ ✗ ?, and an assume card asked for each open one", r.code === 0 && /1 ✓, 1 ✗, 1 \?/.test(r.out) && /not counted in its 6/.test(r.out), r.out);
  ok("…in After the round, as your words marked", /\*\*c4\*\*.*✓ "It goes to my session"; ✗ "If I'm not there it waits"; \? "It should tell me"/.test(read(join(sdir, "align.md"))), read(join(sdir, "align.md")));
  writeFileSync(claims, JSON.stringify({ claims: [{ words: "x", verdict: "differs" }] }));
  ok("a claim marked differs names the lines it was checked against", run(set.repo, "answer", sdir, "c4", claims).code === 1);

  // ── Show me more: one explainer ────────────────────────────────────────────────────────────────────────
  r = run(set.repo, "record", sdir, ans([{ card: "c3", answer: "a", settled: "show-more", via: "page" }]));
  r = run(set.repo, sdir, "--explain-gaps");
  ok("--explain-gaps: one explainer of the gaps asked more on, from what you expected", /^reelplanner explain ".*you expected The inbox.*" src\/send\.mjs --depth low/m.test(r.out), r.out);

  // ── a dropped card, a round in another clone, forgetting ─────────────────────────────────────────────────
  setCards(cdir, [predict("c1", { quote: "if (command) return \"a headless run, if it can\";" }), predict("c2", { extra: "- dropped: the checker read it as A\n" })]);
  r = run(set.repo, cdir, "--check", "--no-checker");
  ok("a dropped card is never checked or asked", r.code === 0 && /1 predict/.test(r.out) && !/c2/.test(run(set.repo, cdir, "--cards").out), r.out);
  write(join(cdir, "checker", "answers.md"), "- c1: b\n");
  run(set.repo, "record", cdir, ans([{ card: "c1", answer: "b", via: "chat" }]));
  ok("…After the round lists it: the agent and the checker read this code differently", /\*\*c2\*\*.*dropped: the agent and the checker read this code differently \(the checker read it as A\)/.test(read(join(cdir, "align.md"))), read(join(cdir, "align.md")));
  set.git("add", "-A"); set.git("commit", "-qm", "rounds");
  const clone = join(tmp, "clone"); execFileSync("git", ["clone", "-q", set.repo, clone]);
  const cround = join(clone, ".reelplanner/align", readdirSync(join(clone, ".reelplanner/align")).find((n) => n.includes("after")));
  r = run(clone, cround, "--check", "--no-checker");
  const { repoOfRound } = await import("../lib/align.mjs");
  ok("a committed round works in another clone (its repo is the folder's, not the path sources.json names)", r.code === 0 && realpathSync(repoOfRound(cround)) === realpathSync(clone) && JSON.parse(read(join(cround, "sources.json"))).repo !== clone, `${r.out} ${repoOfRound(cround)}`);
  const fp = knows()[0].fingerprint;
  const before = read(join(RH, "you.jsonl")).split("\n").filter(Boolean).length, matching = knows().filter((k) => k.fingerprint === fp).length;
  r = reel(set.repo, "memory", "--you", "--forget", fp);
  ok("reel memory --you --forget takes a thing you know out of your memory, and only that", /forgotten/.test(r) && !knows().some((k) => k.fingerprint === fp) && read(join(RH, "you.jsonl")).split("\n").filter(Boolean).length === before - matching, r);
  ok("…and says so when nothing matches", /nothing you know from a round matches/.test(reel(set.repo, "memory", "--you", "--forget", "nope")));

  // ── asked once more and answered right: known for good, never due again (D-316) ────────────────────────
  {
    const { fingerprint, knowsFor } = await import("../lib/align.mjs");
    const { appendKnows } = await import("../lib/memory.mjs");
    const text = read(join(set.repo, "src/send.mjs")).split("\n").slice(2, 4).join("\n"), fp = fingerprint(text);
    appendKnows({ repo: "set", round: "r0", card: "c1", claim: "A rule you got", source: "src/send.mjs:3-4", path: "src/send.mjs", fingerprint: fp, at: new Date(Date.now() - 4 * 864e5).toISOString(), dueAt: new Date(Date.now() - 864e5).toISOString(), asked: 1 }, join(RH, "you.jsonl"));
    ok("a thing due once more is due", knowsFor(set.repo).some((k) => k.fingerprint === fp && k.due));
    run(set.repo, "once more", "src/send.mjs", "--slug", "oncemore");
    const od = join(set.repo, ".reelplanner/align", readdirSync(join(set.repo, ".reelplanner/align")).find((n) => n.includes("oncemore")));
    setCards(od, [predict("c1", { quote: "if (command) return \"a run\";", extra: `- once_more: ${fp}\n` }).replace("src/send.mjs:3-4", "src/send.mjs:3-5")]);
    write(join(od, "checker", "answers.md"), "- c1: b\n");
    r = run(set.repo, "record", od, ans([{ card: "c1", answer: "b", via: "chat" }]));
    ok("answered right on its new case: known for good", r.code === 0 && /known for good \(asked once more, and right\)/.test(r.out) && !knowsFor(set.repo).some((k) => k.fingerprint === fp && k.due), r.out);
  }

  // ── a later video drops what you know (step 4) ─────────────────────────────────────────────────────────
  {
    const { knownNow, fingerprint } = await import("../lib/align.mjs");
    const { appendKnows } = await import("../lib/memory.mjs");
    const lines = read(join(set.repo, "src/send.mjs")).split("\n").slice(2, 5).join("\n");
    appendKnows({ repo: "set", round: "r", card: "c9", claim: "Where does it go with a command set? A headless run", source: "src/send.mjs:3-5", path: "src/send.mjs", fingerprint: fingerprint(lines), at: new Date().toISOString(), dueAt: null, asked: 2 }, join(RH, "you.jsonl"));
    // an edit above the lines moves them: still known, at their new place
    write(join(set.repo, "src/send.mjs"), `// moved down a line\n${read(join(set.repo, "src/send.mjs"))}`);
    const k = knownNow(set.repo).find((x) => x.fact.card === "c9");
    ok("what you know still holds where its lines moved", k && k.from === 4 && k.to === 6, JSON.stringify(k));
    const vd = join(set.repo, ".reelplanner/plans/2026-11-18-send/video");
    write(join(vd, "STORYBOARD.md"), "---\ntitle: t\n---\n\n## Frame 1 — The hand-off\n\n- voiceover: \"Here is how it is handed on.\"\n- src: compositions/frames/01.html\n");
    write(join(vd, "compositions/frames/01.html"), `<template><div id="root" data-composition-id="01"><div data-artifact="the code"><pre>${lines.replace(/</g, "&lt;")}</pre></div></div></template>`);
    const ct = (() => { try { return execFileSync("node", [join(ROOT, "scripts", "check-terms.mjs"), vd], { encoding: "utf8", env, stdio: ["ignore", "pipe", "pipe"] }); } catch (e) { return `${e.stdout}${e.stderr}`; } })();
    ok("check-terms: a frame showing lines you know says so, with what you said Got it to", /frame 1 shows `src\/send\.mjs:4-6`, which you know \(Got it on .*Where does it go with a command set\? A headless run\) — say it in a line, or drop the explanation/.test(ct), ct);
    const pr = reel(set.repo, "prereqs", join(set.repo, ".reelplanner/plans/2026-11-18-send"), "--dry-run");
    ok("reel prereqs lists what you know, to say in a line", /What you know from rounds[\s\S]*Where does it go with a command set\? A headless run · `src\/send\.mjs:4-6`/.test(pr), pr);
    write(join(set.repo, "src/send.mjs"), read(join(set.repo, "src/send.mjs")).replace("a headless run", "a run"));
    ok("…and once the lines change, it is not known any more", !knownNow(set.repo).some((x) => x.fact.card === "c9"));
  }

  // ── measured (step 5): reel status counts rounds and compares later surprises ───────────────────────────
  write(join(set.repo, ".reelplanner/plans/2026-11-19-other/plan.md"), "# Other\n\n**Round:** none, a likely, costly gap (you skipped it)\n\n### Step 1 — x\n");
  write(join(set.repo, ".reelplanner/plans/2026-11-20-easy/plan.md"), "# Easy\n\n**Round:** none needed\n\n### Step 1 — x\n");
  const { roundStats, roundStatusLines, roundLineOf } = await import("../lib/align.mjs");
  ok("a plan's Round line: a round, a likely gap with none, or none needed", roundLineOf("**Round:** `.reelplanner/align/x`").round === ".reelplanner/align/x" && roundLineOf("**Round:** none, a likely, costly gap (you skipped it)").likelyNoRound === "you skipped it" && roundLineOf("**Round:** none needed").none);
  const st = roundStats(join(set.repo, ".reelplanner"), { facts: [{ plan: "2026-11-19-other", own: [{}], wrongChecks: [{ note: "x" }], flagged: [], kind: "plan" }], misses: [{ plan: "2026-11-19-other", type: "superseded" }, { plan: "2026-11-18-send", type: "reworked" }] });
  ok("roundStats: the plan a round was for, against the plan with a likely gap and none (not the easy one)", st.withRound.join() === "2026-11-18-send" && st.likelyNoRound.join() === "2026-11-19-other", JSON.stringify(st));
  ok("…gaps counted by how each was settled", st.gaps >= 2 && st.settled["got-it"] >= 1 && st.settled["show-more"] >= 1, JSON.stringify(st.settled));
  ok("…later surprises on each kind of plan (a reworked step counted once, as its Expected something else)", st.surprises.likelyNoRound.own === 1 && st.surprises.likelyNoRound.expected === 1 && st.surprises.likelyNoRound.late === 1 && st.surprises.withRound.late === 0, JSON.stringify(st.surprises));
  const sl = roundStatusLines(st);
  ok("…and below five of each, too few plans to compare", /^rounds: \d+/.test(sl[0]) && /late fixes 0 · 1/.test(sl[1]) && /too few plans to compare \(1 with a round, 1 with a likely gap and none; 5 of each\)/.test(sl[2]), sl.join("\n"));
  ok("reel status prints it", /Alignment rounds[\s\S]*too few plans to compare/.test(reel(set.repo, "status", set.repo)), reel(set.repo, "status", set.repo));

  // ── a quick check settled in a video reaches the revise as its way says ──────────────────────────────────
  const { reviseScope } = await import("../lib/review-scope.mjs");
  const map = { quizzes: [{ id: "k1", planStep: 1, question: "Where?", answer: "b", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }] }] };
  const why = (q) => reviseScope({ quizzes: [{ id: "k1", answer: "a", correct: false, ...q }] }, { map }).steps.flatMap((x) => x.reasons);
  ok("a quick check settled Got it: yours, no rewrite of the step", why({ settled: "got-it" }).length === 0, JSON.stringify(why({ settled: "got-it" })));
  ok("…Change the plan with words: the plan changed, in their words", why({ settled: "change-plan", note: "stop at three" }).some((r) => r.kind === "quiz-disagree" && /wants the plan changed/.test(r.comment) && /stop at three/.test(r.comment)));
  ok("…The code is wrong with no words: ask them how", why({ settled: "code-wrong" }).some((r) => /The code is wrong/.test(r.comment) && /Ask them how/.test(r.comment)));
  ok("…left unsettled: a missed check, as before", why({}).some((r) => r.kind === "quiz-missed"));
} catch (e) { console.log(`✗ the spec threw: ${e.stack}`); failed++; }
console.log(failed ? `\n${failed} failed (scratch kept: ${tmp})` : "\nalign: all passed");
process.exit(failed ? 1 : 0);
