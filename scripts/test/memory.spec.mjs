#!/usr/bin/env node
// Memory (the memory plan): on a scratch copy of this repo's own .reelplanning, with its real reviews,
// and a home folder of its own (REELPLANNING_HOME), so the real ~/.reelplanning is never touched.
//   step 1 — every review filed from now on says who reviewed (git user.email, or the page's viewer: "owner"
//            or id:<opaque id> from the hosted page's { id, owner }) and which reelplanning recorded it;
//            old reviews stay as they are
//   step 2 — `reel status` ends with at most five memory lines, each with an id; `reel memory <id>` prints
//            the evidence (the reviews, the words, the times)
//   step 3 — a recorded review adds a short summary to your own file, once; `reel memory --you` reads it;
//            where your file cannot be written, the summary waits in the repo's you.pending.jsonl until a
//            run that can write it moves it in (A15, after review)
//   step 4 — misses (a superseded decision, an accepted call flagged later, a step reworked after a
//            walkthrough check was disagreed with), traced to what let them through; a recent miss makes
//            a call sharing its label pause (walkthroughs-that-help step 2 keeps D-122)
//   step 5 — a retro is suggested after five plans or one signal three times; `reel retro` drafts its plan
//   videos-you-can-follow step 3 — a sixth line, `lost`, per plan: checks missed, explanations opened, words
//            looked up, approvals with checks missed (D-129: said in what to act on, never blocked); the same
//            word looked up in three reviews is a signal; your file keeps the words looked up and the videos
//            watched (D-128: the reviewed video at 80%, and what the browser sent as `watched`)
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, cpSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import { tmpdir, homedir } from "node:os";
import { ROOT, VERSION } from "../lib/env.mjs";
import { ownReason, signals, retroDue, memoryLines, reviewFacts, findMisses, youMemory, lostOf, watchedOf, lostWords, youKnows, LINES, afterBuildOf, walkthroughBar, clearsBar } from "../lib/memory.mjs";
import { actOnMarkdown } from "../lib/review-scope.mjs";
import { stopFor } from "../lib/autonomy.mjs";
import { recordedBy, fileReview } from "../lib/reviews.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-memory-"));
const home = join(tmp, "home");
process.env.REELPLANNING_HOME = home;   // every reel run below inherits it
const realYou = join(homedir(), ".reelplanning", "you.jsonl");
const realBefore = existsSync(realYou) ? statSync(realYou).mtimeMs : null;
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", cwd: tmp, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
const reel = (...a) => run("reel.mjs", ...a);
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1800)}` : ""}`); if (!cond) failed++; };
const git = (dir, ...a) => execFileSync("git", ["-C", dir, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
const memLines = (out) => (out.split(/\nWhat reviews show[^\n]*\n/)[1] || "").split("\n").filter((l) => /^ {2}\[[a-z-]+\]/.test(l));

try {
  // ---- unit: why own words, what stops ----
  ok("ownReason: confusion is 'unclear, asked for more'", ownReason("confused by this, need more information and examples") === "unclear");
  ok("ownReason: an option's words with more is 'with a condition'", ownReason("i want after every accept except i am wondering how costly", [{ label: "After every accept" }, { label: "On demand" }]) === "condition");
  ok("ownReason: an option named by its letter is 'with a condition'", ownReason("i like the principle of A, but bigger") === "condition");
  ok("ownReason: other words are 'the question framed otherwise'", ownReason("we shouldnt ALWAYS show the code", [{ label: "Full diff" }, { label: "Just the calls" }]) === "framing");

  // walkthroughs-that-help step 2: which calls pause is the implementer's labels, read plainly; accepts no
  // longer fade a label out (D-084's ten in a row is gone), and a late fix of a label still pauses it (D-122)
  const call = { id: "A1", tags: ["visible"], components: ["player"] };
  const tagMiss = { what: "A7 of old accepted, then flagged", brief: "A7 of old accepted, then flagged", tags: ["close"], components: ["cli"] };
  const compMiss = { what: "D-056 superseded by D-063", brief: "D-056 superseded by D-063", tags: [], components: ["player"] };
  const v = stopFor(call), u = stopFor({ id: "A2", tags: ["hard-to-undo"] }), c = stopFor({ id: "A3", tags: ["close"] }), n = stopFor({ id: "A4", tags: [] });
  ok("stopFor: a call you'd notice pauses, and says why", v.stops && v.rule === "notice" && /you'd notice it/.test(v.why), v.why);
  ok("stopFor: a call you can't easily undo pauses", u.stops && u.rule === "undo" && /can't easily undo/.test(u.why), u.why);
  ok("stopFor: a close call, or one with no label, goes on the list", !c.stops && c.rule === "listed" && /close: on the list/.test(c.why) && !n.stops && n.rule === "listed" && /no label: on the list/.test(n.why), `${c.why} | ${n.why}`);
  const s1 = stopFor({ id: "A3", tags: ["close"] }, [tagMiss]);
  ok("stopFor: …a close call sharing its label with a recent late fix pauses, and says so (D-122)", s1.stops && s1.rule === "miss" && /^a late fix: A7 of old accepted, then flagged \(label close\)$/.test(s1.why), s1.why);
  const s2 = stopFor({ id: "A3", tags: ["close"] }, [compMiss]);
  ok("stopFor: …a late fix with no label pauses nothing directly, even on a component of its step (D-109)", !s2.stops && s2.rule === "listed", s2.why);
  ok("stopFor: an untagged call stays on the list, late fix or not", stopFor({ id: "A2", tags: [], components: ["player"] }, [compMiss, tagMiss]).stops === false);
  ok("stopFor: an off-plan change always pauses", stopFor({ id: "D1", tags: [] }).stops === true && stopFor({ id: "D1", tags: [] }).rule === "deviation");

  // walkthroughs-that-help step 6: after the build, how a walkthrough review was looked at
  const T0 = Date.parse("2026-10-01T10:00:00Z"), iso = (s) => new Date(T0 + s * 1000).toISOString();
  const wrev = (holds, extra = {}) => ({ exportedAt: iso(400), watch: { firstPlayAt: iso(0), durationSeconds: 120 }, annotations: [], autonomy: holds.map((h, i) => ({ id: `a${i + 1}`, verdict: "accept", shownAt: iso(10 * i), judgedAt: iso(10 * i + h) })), ...extra });
  const ab = afterBuildOf(wrev([0.3, 0.4, 8, 12]), { watchedSeconds: 120 });
  ok("afterBuildOf: the middle of the seconds from each pause to its answer, and nothing said", ab.timed === 4 && ab.held === 4.2 && ab.flags === 0 && ab.own === 0 && ab.comments === 0 && ab.early === false && ab.sentAfter === 400, JSON.stringify(ab));
  const quick = afterBuildOf({ ...wrev([0.3]), exportedAt: iso(15), annotations: [{ kind: "flag", comment: "Flagged: x" }] }, { watchedSeconds: 120 });
  ok("afterBuildOf: sent 15 s after the first play of a 2-minute video is before it could have played through; the player's own flag label is no comment", quick.early === true && quick.comments === 0, JSON.stringify(quick));
  ok("clearsBar: five seconds and some words, both", !clearsBar(ab) && clearsBar({ ...ab, held: 6, comments: 1 }) && !clearsBar({ ...ab, held: 2, flags: 1 }) && !clearsBar({ ...ab, held: null, flags: 1 }));
  const wf = (a, plan) => ({ kind: "walkthrough", plan, review: plan, afterBuild: a });
  const untimed = { timed: 0, held: null, flags: 0, own: 0, comments: 0, early: true };
  ok("walkthroughBar: reviews before pauses were timed do not count; three timed that miss it make it due", walkthroughBar([wf(untimed, "old"), wf(ab, "p1"), wf(ab, "p2")]).due === false && walkthroughBar([wf(untimed, "old"), wf(ab, "p1"), wf(ab, "p2"), wf(ab, "p3")]).due === true);
  ok("walkthroughBar: one of the three clearing it is enough to keep the video", walkthroughBar([wf(ab, "p1"), wf({ ...ab, held: 7, flags: 1 }, "p2"), wf(ab, "p3")]).due === false);
  const full = (rv, plan) => reviewFacts({ id: `walkthrough-${plan}`, kind: "walkthrough", at: rv.exportedAt, review: rv }, { plan, map: { watchedSeconds: 120 } });
  const al = memoryLines([full({ ...wrev([]), autonomy: [{ id: "a1", verdict: "accept", judgedAt: iso(5) }] }, "old"), full(wrev([0.3, 0.4, 8, 12]), "p1")]).find((l) => l.id === "after-build");
  ok("memory: an after-build line, said plainly", /^2 walkthrough reviews: a pause held you 4\.2 s \(the middle value, 1 review timed\); 0 flags, 0 in your words, 0 comments; 0 sent before the video could have played through\. The bar \(5 s and some words\): 0 of 1 cleared, 2 to go\.$/.test(al?.text || ""), al?.text);

  // ---- unit: step 1's stamp ----
  const g = join(tmp, "g"); mkdirSync(g); git(g, "init", "-q"); git(g, "config", "user.email", "owner@example.com");
  const st = recordedBy(g);
  ok("recordedBy: git's user.email where the review is recorded, and this package's version", st.reviewer === "owner@example.com" && st.via === "git user.email" && st.reelplanning === VERSION, JSON.stringify(st));
  const sv = recordedBy(g, { row: { viewer: { email: "viewer@example.com" } } });
  ok("recordedBy: the page's viewer when the row has one", sv.reviewer === "viewer@example.com" && sv.via === "the page's viewer", JSON.stringify(sv));
  // the hosted page's row (the Artifact's `user` capability): { id, owner }, an opaque id and never a name
  const so = recordedBy(g, { row: { viewer: { id: "u_owner123", owner: true } } });
  ok("recordedBy: the page's owner reviewing their own page is \"owner\" (the you of you.jsonl), not their id", so.reviewer === "owner" && so.via === "the page's viewer", JSON.stringify(so));
  const si = recordedBy(g, { row: { viewer: { id: "u_colleague9", owner: false } } });
  ok("recordedBy: anyone else on the hosted page is id:<their opaque id>", si.reviewer === "id:u_colleague9" && si.via === "the page's viewer", JSON.stringify(si));
  const sn = recordedBy(g, { row: { status: "submitted" } }), sx = recordedBy(g, { row: { viewer: { id: null, owner: false } } }), sname = recordedBy(g, { row: { viewer: { name: "Ada" } } });
  ok("recordedBy: a row with no viewer, one with neither id nor owner, or only a name, falls back to git's user.email", [sn, sx, sname].every((x) => x.reviewer === "owner@example.com" && x.via === "git user.email"), JSON.stringify([sn, sx, sname]));
  ok("recordedBy: an older row's string viewer is kept as it is", recordedBy(g, { row: { viewer: " viewer@example.com " } }).reviewer === "viewer@example.com");
  const rv = { exportedAt: "2026-09-24T10:00:00.000Z", annotations: [], decisions: [] };
  const f1 = fileReview(g, rv, { kind: "plan" }), f2 = fileReview(g, { ...rv, recorded: { reviewer: "someone@else", reelplanning: "9.9.9" } }, { kind: "plan" });
  ok("fileReview: the same review filed again with another stamp is the same review", !f1.again && f2.again && f2.path === f1.path, JSON.stringify([f1, f2]));

  // ---- unit: a signal three times makes a retro due, whatever the plan count ----
  const fact = (plan, why) => ({ plan, review: `plan-${plan}`, kind: "plan", questions: { taken: 0, of: 0 }, notTaken: [], own: [{ q: "q1", question: "?", words: "confused", why }], rewinds: [], checks: 0, wrongChecks: [], calls: {}, flagged: [] });
  const three = [1, 2, 3].map((i) => ({ ...fact("2026-01-01-a", "unclear"), review: `plan-${i}` }));
  const sig = signals(three, []);
  ok("signals: the same own-words reason three times is one signal counted three times", sig[0]?.key === "own-words:unclear" && sig[0].count === 3, JSON.stringify(sig));
  const small = join(tmp, "small"); mkdirSync(small);
  reel("init", small, "--name", "small", "--kind", "greenfield");
  writeFileSync(join(tmp, "p.md"), "# P\n\n## The problem\n\nx\n\n### Step 1 — A\n\ny\n");
  reel("new-plan", small, "a", "--plan", join(tmp, "p.md"), "--date", "2026-01-01");
  const due = retroDue(join(small, ".reelplanning"), three, []);
  ok("retroDue: one plan, but a signal three times → due, and why", due.due && due.why.length === 1 && /one signal repeated 3 times: own words, unclear, asked for more/.test(due.why[0]), JSON.stringify(due));
  ok("retroDue: two of a signal is not yet", !retroDue(join(small, ".reelplanning"), three.slice(0, 2), []).due);

  // ---- unit: a late fix is an accept that came before the change (round 2's N1: explain-first's A13 was
  // listed on 29 Sep, changed that evening, accepted on 30 Sep: changed, then accepted, never a late fix) ----
  const order = join(tmp, "order"); mkdirSync(order); git(order, "init", "-q"); git(order, "config", "user.email", "owner@example.com"); git(order, "config", "user.name", "Owner");
  reel("init", order, "--name", "order", "--kind", "greenfield");
  reel("new-plan", order, "b", "--plan", join(tmp, "p.md"), "--date", "2026-01-02");
  const orp = join(order, ".reelplanning"), obPlan = readdirSync(join(orp, "plans")).find((p) => /-b$/.test(p)), ob = join(orp, "plans", obPlan);
  const commitAt = (when, msg) => { git(order, "add", "-A"); execFileSync("git", ["-C", order, "commit", "-q", "-m", msg], { env: { ...process.env, GIT_AUTHOR_DATE: when, GIT_COMMITTER_DATE: when }, stdio: "ignore" }); };
  const rowsMd = (a1, a2) => `# Walkthrough\n\n| # | Step | Chose | Instead of | Why | Check |\n|---|---|---|---|---|---|\n| A1 | 1 | ${a1} [close] | one list | fewer | \`x\` |\n| A2 | 1 | ${a2} [close] | one list | fewer | \`y\` |\n`;
  writeFileSync(join(ob, "walkthrough.md"), rowsMd("the list is sorted by date", "the list shows ten rows"));
  commitAt("2026-01-02T10:00:00Z", "built");
  const fileWalk = (stamp, at, autonomy) => { mkdirSync(join(ob, "reviews"), { recursive: true }); writeFileSync(join(ob, "reviews", `walkthrough-${stamp}.json`), JSON.stringify({ exportedAt: at, annotations: [], decisions: [], autonomy })); };
  fileWalk("20260102T120000Z", "2026-01-02T12:00:00.000Z", [{ id: "a1", verdict: "listed" }, { id: "a2", verdict: "accept" }]);
  writeFileSync(join(ob, "walkthrough.md"), rowsMd("the list is sorted by date (changed after review: sorted by name now)", "the list shows ten rows (changed after review: twenty rows now)"));
  commitAt("2026-01-02T18:00:00Z", "after the review");
  fileWalk("20260103T090000Z", "2026-01-03T09:00:00.000Z", [{ id: "a1", verdict: "accept" }, { id: "a2", verdict: "accept" }]);
  const late = findMisses(orp, { ledger: [] }).filter((m) => /accepted, then changed/.test(m.brief));
  ok("findMisses: a row accepted and then changed after review is a late fix (A2: accepted at 12:00, changed at 18:00)", late.some((m) => /^A2 of b accepted in walkthrough-20260102T120000Z, then changed after review: twenty rows now$/.test(m.what)), JSON.stringify(late.map((m) => m.what)));
  ok("findMisses: …a row left unjudged by the first review, changed, then accepted by the next is none (A1: listed, changed at 18:00, accepted the next day)", !late.some((m) => /^A1 /.test(m.what)), JSON.stringify(late.map((m) => m.what)));
  ok("reel stops: so only the real late fix makes a close choice pause", /A1[^\n]*a late fix: A2 of b accepted, then changed/.test(reel("stops", ob).out), reel("stops", ob).out);

  // ---- a scratch copy of this repo's .reelplanning, with its real reviews ----
  const repo = join(tmp, "repo"), rp = join(repo, ".reelplanning");
  // the record, not the videos: of a video's files only its plan map (the questions and checks) is read
  const inVideo = (s) => /[\\/](video|walkthrough-video|system-video|inbox)[\\/]/.test(s.slice(ROOT.length));
  mkdirSync(repo); cpSync(join(ROOT, ".reelplanning"), rp, { recursive: true, filter: (s) => statSync(s).isDirectory() ? !/[\\/](assets|renders|snapshots|node_modules|compositions|capture)$/.test(s) : !inVideo(s) || basename(s) === "plan-map.json" });
  git(repo, "init", "-q"); git(repo, "config", "user.email", "owner@example.com");
  // one person's repo: this repo's maintainers (the contributing plan) would make owner@example.com a contributor
  { const c = JSON.parse(readFileSync(join(rp, "config.json"), "utf8")); delete c.maintainers; writeFileSync(join(rp, "config.json"), JSON.stringify(c, null, 2) + "\n"); }
  const plans = readdirSync(join(rp, "plans")).filter((p) => existsSync(join(rp, "plans", p, "plan.md"))).sort();
  const memPlan = join(rp, "plans", plans.find((p) => /-memory$/.test(p)));
  const oldReview = join(memPlan, "reviews", "plan-20260924T191356Z.json"), oldText = readFileSync(oldReview, "utf8");

  // step 2: reel status ends with the lines; reel memory <id> prints the evidence
  const status = reel("status", repo);
  const lines = memLines(status.out);
  ok("reel status: ends with at most seven memory lines, each with an id", status.code === 0 && lines.length >= 4 && lines.length <= 7 && lines.every((l) => LINES.includes(l.match(/\[([a-z-]+)\]/)[1])), status.out);
  ok("…the recommendation line counts questions and calls", /\[recommended\] The recommendation taken on \d+ of \d+ questions answered from the options \(\d+ more in your own words\); \d+ of \d+ calls accepted/.test(status.out), lines.join("\n"));
  ok("…the rewinds line names the step rewound again after a revision (deep-dives step 4)", /\[rewinds\][^\n]*rewound again after a revision: [^\n]*deep-dives step 4/.test(status.out), lines.join("\n"));
  const ow = reel("memory", repo, "own-words");
  ok("reel memory own-words: the reviews, the words, the times, and why", ow.code === 0 && /deep-dives · plan-20260923T033620Z \(2026-09-23 03:36\) · at 1:57 · q2 \(D-022\), step 2: "Who writes a detail page\?" → unclear, asked for more\n {4}"confused by this, need more information and examples"/.test(ow.out) && /\(D-003\)[^\n]*→ an option, with a condition/.test(ow.out) && /\(D-023\)[^\n]*→ the question framed otherwise/.test(ow.out), ow.out);
  const ck = reel("memory", repo, "checks");
  ok("reel memory checks: a check answered wrong, with the question, what was answered and the answer", /memory · plan-20260924T191356Z[^\n]*k4, step 4: "Which of these counts as a miss\?" — answered "A step rewound twice", the answer is "An accepted call, reversed later"/.test(ck.out), ck.out);
  const ms = reel("memory", repo, "misses");
  ok("reel memory misses: a superseded decision, traced to the call that let it through and its kind", /D-056 superseded by D-063[^\n]*\n {4}let through by: call A3 of deep-dives \(D-056, accepted:[^\n]*\n {4}kind: no tags; components player/.test(ms.out), ms.out);
  ok("…an accepted call changed after review (close-the-lifecycle A1)", /A1 of close-the-lifecycle accepted in walkthrough-20260923T073957Z, then changed after review/.test(ms.out), ms.out);
  ok("…and a step reworked after its walkthrough check was disagreed with, traced to the plan's question on it (m3 step 6, k3 → D-082)", /step 6 of m3-revise-loop reworked after the walkthrough's quick check k3[^\n]*\n {4}let through by: question q2 of m3-revise-loop \(D-082/.test(ms.out), ms.out);
  ok("…a step rewound twice is not a miss", !/rewound/.test(ms.out.split("\n")[0]), ms.out.split("\n")[0]);
  ok("reel memory: an unknown id is refused, with the ids", reel("memory", repo, "nonsense").code === 1);

  // step 5: the retro is due (five plans or more, none a retro yet)
  ok("reel status: suggests a retro when five plans have gone by with none", plans.length < 5 || /△ a retro is due: \d+ plans since the start \(no retro yet\)[^\n]*`reel retro [^`]+` starts its plan/.test(status.out), status.out.split("\n").slice(-3).join("\n"));

  // step 1 + 3: a new review is stamped and summarised in your file; an old one stays as it was
  const again = reel("record", memPlan, oldReview);
  ok("reel record: an old review recorded again is left as it is (no stamp added)", again.code === 0 && readFileSync(oldReview, "utf8") === oldText, again.out);
  ok("…and its summary goes into your file, said on one line", /✓ your memory: a summary of this review added to /.test(again.out) && existsSync(join(home, "you.jsonl")), again.out);
  ok("…once: recorded again, it is already there", /· your memory: this review is already in /.test(reel("record", memPlan, oldReview).out) && readFileSync(join(home, "you.jsonl"), "utf8").trim().split("\n").length === 1);

  // A15, as the owner answered it: a run fenced to the repo (D-082) cannot write your file, so the summary
  // waits in the repo (.reelplanning/you.pending.jsonl), and the next run that can write your file moves it in
  const reelAt = (h, cwd, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", "reel.mjs"), ...a], { encoding: "utf8", cwd, env: { ...process.env, REELPLANNING_HOME: h }, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
  writeFileSync(join(tmp, "a-file"), "");
  const fencedHome = join(tmp, "a-file", "home"), pendingFile = join(rp, "you.pending.jsonl");
  const pendingLines = () => (existsSync(pendingFile) ? readFileSync(pendingFile, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
  const homeLines = (h) => (existsSync(join(h, "you.jsonl")) ? readFileSync(join(h, "you.jsonl"), "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : []);
  const fenced = reelAt(fencedHome, tmp, "record", memPlan, oldReview);
  ok("reel record: where your file cannot be written, the review is recorded all the same, and its summary waits in the repo's .reelplanning/you.pending.jsonl, said on its line", fenced.code === 0 && /△ your memory: could not write [^\n]*, so a summary of this review is kept in [^\n]*\.reelplanning\/you\.pending\.jsonl \(commit it with the review\); the next `reel record` or `reel memory --you` that can write [^\n]* moves it there/.test(fenced.out)
    && pendingLines().length === 1 && pendingLines()[0].review === "plan-20260924T191356Z" && pendingLines()[0].repo === "repo", fenced.out);
  const fenced2 = reelAt(fencedHome, tmp, "record", memPlan, oldReview);
  ok("…recorded again, fenced: already kept there, not added twice", fenced2.code === 0 && /△ your memory: could not write [^\n]*; this review is already kept in [^\n]*you\.pending\.jsonl/.test(fenced2.out) && pendingLines().length === 1, fenced2.out);
  const fencedYou = reelAt(fencedHome, repo, "memory", "--you");
  ok("reel memory --you, fenced: reads the pending summaries beside your file, and says so", fencedYou.code === 0 && /△ could not write [^\n]*: the summaries waiting in \.reelplanning\/you\.pending\.jsonl are read beside it/.test(fencedYou.out) && /\[recommended\]/.test(fencedYou.out) && /from [^\n]* and \.reelplanning\/you\.pending\.jsonl/.test(fencedYou.out) && pendingLines().length === 1, fencedYou.out);
  // the next run that can write your file (a fresh home here) moves it in: once, and the pending file goes
  const home2 = join(tmp, "home2"), moved = reelAt(home2, tmp, "record", memPlan, oldReview);
  ok("reel record, next writable run: the pending summary is moved into your file, not duplicated, and the pending file removed", moved.code === 0 && /· your memory: this review is already in [^\n]*; 1 summary waiting in [^\n]*you\.pending\.jsonl moved there too/.test(moved.out)
    && homeLines(home2).length === 1 && homeLines(home2)[0].review === "plan-20260924T191356Z" && !existsSync(pendingFile), `${moved.out}\n${JSON.stringify(homeLines(home2).map((x) => x.review))}`);
  // pending again; `reel memory --you` that can write your file moves it, and finds it already there
  reelAt(fencedHome, tmp, "record", memPlan, oldReview);
  const drained = reelAt(home, repo, "memory", "--you");
  ok("reel memory --you, writable: moves the pending summaries in, deduplicated by repo, plan and review", drained.code === 0 && /✓ waiting in \.reelplanning\/you\.pending\.jsonl: 1 summary already there; the file is removed/.test(drained.out) && !existsSync(pendingFile) && homeLines(home).length === 1, drained.out);
  // your memory reads both files: your file, and what the repo keeps pending that is not in it yet
  const yA = join(tmp, "you-a.jsonl"), yP = join(tmp, "you-p.jsonl"), fx = (review) => JSON.stringify({ ...fact("2026-01-01-a", "framing"), repo: "r", review });
  writeFileSync(yA, fx("plan-1") + "\n"); writeFileSync(yP, fx("plan-1") + "\n" + fx("plan-2") + "\n");
  const both = youMemory(yA, yP);
  ok("youMemory: your file and the pending one, each review once", both.facts.map((x) => x.review).sort().join() === "plan-1,plan-2" && /2 questions answered in your own words/.test(both.lines.find((l) => l.id === "own-words")?.text || ""), JSON.stringify(both.facts.map((x) => x.review)));

  // a new plan in the copy, walked through twice: A1 [visible] accepted, then flagged — a miss
  writeFileSync(join(tmp, "gadget.md"), "# Gadget\n\n## The problem\n\nA gadget.\n\n### Step 1 — The review player shows a gadget\n\nIn the review player.\n\n## Components touched\n\n- **The review player** — shows it\n");
  reel("new-plan", repo, "gadget", "--plan", join(tmp, "gadget.md"), "--date", "2099-01-01");
  const gp = join(rp, "plans", "2099-01-01-gadget");
  writeFileSync(join(gp, "walkthrough.md"), "# Built\n\n### Step 1 — The review player shows a gadget\n\nIn `packages/player/x.js`.\n\n| id | Step | Chose | Instead of | Why | Check |\n|---|---|---|---|---|---|\n| A1 | 1 | A round gadget [visible] | a square one | rounder | packages/player/x.js |\n| A2 | 1 | Grey [close] | blue | calm | packages/player/x.js |\n");
  const wr = (at, verdict) => ({ version: 1, project: "walkthrough-video", exportedAt: at, verdict: verdict === "flag" ? "changes" : "approve", watch: { completion: 1, moments: [{ kind: "rewind", planStep: 1, t: 5, from: 9 }] }, decisions: [],
    quizzes: [{ id: "k1", answer: "b", correct: false, t: 7 }], autonomy: [{ id: "a1", verdict, chose: "A round gadget", planStep: 1, t: 3 }, { id: "a2", verdict: "accept", chose: "Grey", planStep: 1, t: 4 }], annotations: [] });
  writeFileSync(join(tmp, "wr1.json"), JSON.stringify(wr("2099-01-02T10:00:00.000Z", "accept")));
  const rec1 = reel("record", gp, join(tmp, "wr1.json"));
  const filed = JSON.parse(readFileSync(join(gp, "reviews", "walkthrough-20990102T100000Z.json"), "utf8"));
  ok("reel record: a new review carries the reviewer (git user.email) and the reelplanning version, and says so", filed.recorded?.reviewer === "owner@example.com" && filed.recorded.via === "git user.email" && filed.recorded.reelplanning === VERSION && /, by owner@example\.com \(reelplanning /.test(rec1.out), `${JSON.stringify(filed.recorded)}\n${rec1.out}`);
  // the second round comes through intake, from a page that knows its viewer
  writeFileSync(join(tmp, "row.json"), JSON.stringify({ status: "submitted", submittedAt: "2099-01-03T10:00:00.000Z", project: "walkthrough-video", planDir: ".reelplanning/plans/2099-01-01-gadget", viewer: "viewer@example.com", watched: [{ video: "system", seen: "2099-01-02T09:00:00.000Z" }], review: wr("2099-01-03T10:00:00.000Z", "flag") }));
  const i2 = run("reel-intake.mjs", join(tmp, "row.json"), "--repo", repo);
  const filed2 = JSON.parse(readFileSync(join(gp, "reviews", "walkthrough-20990103T100000Z.json"), "utf8"));
  ok("reel-intake: the page's viewer is the reviewer when the row names one", i2.code === 0 && filed2.recorded?.reviewer === "viewer@example.com" && filed2.recorded.via === "the page's viewer", `${JSON.stringify(filed2.recorded)}\n${i2.out}`);
  const ms2 = reel("memory", repo, "misses");
  ok("reel memory misses: the call accepted, then flagged, is a recent miss of kind visible", /recent · D-\d{3} accepted, then flagged as D-\d{3}\n {4}let through by: call A1 of gadget[^\n]*\n {4}kind: tags visible/.test(ms2.out), ms2.out);

  // step 4, since walkthroughs-that-help step 2: a [visible] call pauses (you'd notice it), an unlabelled one is listed
  writeFileSync(join(tmp, "next.md"), "# Next\n\n## The problem\n\nMore.\n\n### Step 1 — Something in the CLI\n\nx\n");
  reel("new-plan", repo, "next", "--plan", join(tmp, "next.md"), "--date", "2099-01-04");
  const np = join(rp, "plans", "2099-01-04-next");
  writeFileSync(join(np, "walkthrough.md"), "# Built\n\n| id | Step | Chose | Instead of | Why | Check |\n|---|---|---|---|---|---|\n| A1 | 1 | Loud output [visible] | quiet | seen | scripts/x.mjs |\n| A2 | 1 | Plain words | jargon | read | scripts/x.mjs |\n");
  const sp = reel("stops", np);
  // walkthroughs-that-help step 6: three timed walkthrough reviews, each accepted in under a second with nothing
  // said: `reel status` says a plan to drop the walkthrough video is due; one with a flag and time keeps it
  // the repo's own walkthrough reviews come first by date and may be timed too (the explain-first one is): this check
  // is about the three below, so the copy's real ones are set aside
  for (const p of readdirSync(join(rp, "plans")).filter((x) => !x.startsWith("2099-"))) { const d = join(rp, "plans", p, "reviews"); if (existsSync(d)) for (const f of readdirSync(d).filter((x) => /^walkthrough-.*\.json$/.test(x))) rmSync(join(d, f)); }
  const barDir = join(rp, "plans", "2099-01-04-next", "reviews"); mkdirSync(barDir, { recursive: true });
  const barRev = (i, hold, words = []) => writeFileSync(join(barDir, `walkthrough-2099010${i}T100000Z.json`), JSON.stringify({ ...wrev([hold, hold]), exportedAt: `2099-01-0${i}T10:00:00.000Z`, annotations: words }));
  for (const i of [5, 6, 7]) barRev(i, 0.4);
  const bs1 = reel("status", repo);
  ok("reel status: three timed walkthroughs accepted without a look: a plan to drop the walkthrough video is due", /△ walkthroughs: still accepted without a look \(3 of 3\), a plan to drop the walkthrough video is due/.test(bs1.out) && /\[after-build\][^\n]*The bar \(5 s and some words\): 0 of 3 cleared\./.test(bs1.out), bs1.out);
  barRev(6, 9, [{ id: "c1", kind: "note", t: 3, comment: "the list is too long", plan: { step: null } }]);
  const bs2 = reel("status", repo);
  ok("…one of the three held for 9 s with a comment: nothing is due", !/a plan to drop the walkthrough video is due/.test(bs2.out) && /1 of 3 cleared/.test(bs2.out), bs2.out);
  rmSync(barDir, { recursive: true, force: true });
  ok("reel stops: a call you'd notice pauses, one with no label is listed", /^A1 +step 1 +pauses +you'd notice it/m.test(sp.out) && /^A2 +step 1 +listed +no label: on the list/m.test(sp.out) && /- autonomy_list: a2 /.test(sp.out), sp.out);

  // step 3: your memory across repos
  const you = readFileSync(join(home, "you.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
  const g2 = you.find((x) => x.review === "walkthrough-20990103T100000Z");
  ok("your file: one short summary per review, with the repo, plan, verdict, rewinds, wrong checks and the kinds of call flagged", you.length === 3 && g2 && g2.repo === "repo" && g2.plan === "2099-01-01-gadget" && g2.verdict === "changes" && g2.reviewer === "viewer@example.com"
    && g2.rewinds.length === 1 && g2.wrongChecks[0]?.k === "k1" && g2.flagged[0]?.id === "a1" && g2.flagged[0].tags.join() === "visible" && g2.watched.some((x) => x.video === "system"), JSON.stringify(you.map((x) => x.review)) + "\n" + JSON.stringify(g2));
  const yo = reel("memory", "--you");
  ok("reel memory --you: the same few lines, across repos (the fifth: the kinds of call flagged)", yo.code === 0 && /\[recommended\]/.test(yo.out) && /\[flagged\] +1 call flagged or answered in your own words, by kind: visible \(1\)\./.test(yo.out) && /\[checks\][^\n]*memory k4, gadget k1/.test(yo.out) && /\[lost\] +Lost most in [^\n]*repo: gadget \(2 of 2 checks wrong, approved anyway\)/.test(yo.out) && /^Watched: 3 videos \([^\n]*repo: system[^\n]*\)/m.test(yo.out), yo.out);
  // videos-you-can-follow step 3: where you got lost, the words you looked up, the videos you watched
  const lost = wr("2099-01-06T10:00:00.000Z", "accept");
  Object.assign(lost, { confusion: { wrongChecks: 1, walked: 1, termsOpened: 3, termsLookedUp: ["streak", "Tag"], watchedPct: 100 }, watched: [{ video: "system", seen: "2099-01-05T09:00:00.000Z" }, "2099-01-01-gadget"] });
  lost.quizzes[0].walked = true;
  writeFileSync(join(tmp, "lost.json"), JSON.stringify(lost));
  reel("record", gp, join(tmp, "lost.json"));
  const you3 = readFileSync(join(home, "you.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l)).find((x) => x.review === "walkthrough-20990106T100000Z");
  ok("your file: a review's words looked up and the videos watched (this one at 80%, and the browser's own list)", JSON.stringify(you3?.lost?.looked) === '["streak","tag"]' && you3.lost.walked === 1 && you3.lost.termsOpened === 3 && you3.lost.approvedMissed === true
    && JSON.stringify(you3.watched.map((w) => w.video)) === '["2099-01-01-gadget--walkthrough","system","2099-01-01-gadget"]' && you3.watched[1].at === "2099-01-05T09:00:00.000Z", JSON.stringify(you3));
  const yo2 = reel("memory", "--you");
  ok("reel memory --you: says the videos watched and the words looked up", /^Watched: 4 videos/m.test(yo2.out) && /Words looked up: streak, tag\./.test(yo2.out) && /\[lost\][^\n]*; 1 explanation opened, 3 words looked up \(streak, tag\), \d approvals with checks missed\./.test(yo2.out), yo2.out);
  const lr = reel("memory", repo, "lost");
  ok("reel memory lost: a line per review, with the checks missed and whether it was approved anyway", /^\[lost\] Lost most in /m.test(lr.out) && /memory · plan-20260924T191356Z[^\n]*: 2 of 6 checks wrong \(k3, k4\); approved with 2 of 6 checks missed/.test(lr.out), lr.out);
  // unit: what a review shows about getting lost, and what it watched
  const lo = lostOf({ verdict: "approve", quizzes: [{ id: "k1", correct: false }, { id: "k2", correct: true, walked: true }], confusion: { termsOpened: 2 } });
  ok("lostOf: checks missed, explanations opened, a count of words where only a count was kept, an approval with checks missed", JSON.stringify(lo) === '{"wrong":["k1"],"of":2,"walked":1,"looked":[],"termsOpened":2,"approvedMissed":true}', JSON.stringify(lo));
  ok("lostOf: an approval given as an approve mark (no verdict field) counts too, as actOnMarkdown reads it", lostOf({ annotations: [{ kind: "approve" }], quizzes: [{ id: "k1", correct: false }] }).approvedMissed === true);
  ok("watchedOf: the reviewed video only past 80%", watchedOf({ watch: { completion: 0.79 } }, { video: "p" }).length === 0 && watchedOf({ watch: { completion: 0.8 }, exportedAt: "t" }, { video: "p" })[0].video === "p");
  ok("watchedOf: a video only some chapters of which were played through is not watched, its chapters are (<video>#part N, as a before: line names one)",
    JSON.stringify(watchedOf({ watched: [{ video: "system", parts: [5, 7] }, { video: "x", seen: "s", parts: [1] }, { video: "", parts: [2] }] }, { at: "t" })) === JSON.stringify([{ video: "system#part 5", at: "t" }, { video: "system#part 7", at: "t" }, { video: "x", at: "s" }]));
  // the same word looked up in three reviews is a signal: its explanation is not working (D-124)
  const lf = (plan, looked) => ({ plan, review: `plan-${plan}`, kind: "plan", questions: { taken: 0, of: 0 }, notTaken: [], own: [], rewinds: [], checks: 0, wrongChecks: [], calls: {}, flagged: [], lost: { wrong: [], of: 0, walked: 0, looked, termsOpened: looked.length, approvedMissed: false } });
  const threeLooked = [lf("a", ["streak"]), lf("b", ["streak", "tag"]), lf("c", ["streak"])];
  ok("signals: the same word looked up in three reviews", lostWords(threeLooked).map((x) => `${x.word}:${x.count}`).join() === "streak:3" && signals(threeLooked, []).find((x) => x.key === "lost:word:streak")?.count === 3 && /the word "streak" looked up/.test(signals(threeLooked, [])[0].label), JSON.stringify(signals(threeLooked, [])));
  ok("youKnows: the words you looked up, counted across reviews", youKnows(threeLooked).looked.get("streak") === 3 && youKnows(threeLooked).looked.get("tag") === 1);
  // D-129: an approval with checks missed is recorded, never blocked
  const apm = actOnMarkdown({ id: "x", kind: "plan", review: { verdict: "approve", exportedAt: "2099-01-01T00:00:00Z", annotations: [], decisions: [], quizzes: [{ id: "k1", correct: false }, { id: "k2", correct: false }, { id: "k3", correct: true }] }, planName: "p" });
  ok("what to act on: \"Approved with 2 of 3 quick checks missed\", recorded, not blocked (D-129)", /^Approved with 2 of 3 quick checks missed: recorded, not blocked \(D-129\)/m.test(apm), apm);
  // quick checks off (the player's switch): the checks were not asked, so one with no answer is neither wrong nor missed;
  // one answered anyway counts as any other
  const offRv = { verdict: "approve", checks: "off", quizzes: [{ id: "k1", walked: true }, { id: "k2", correct: false }, { id: "k3", answer: "b", correct: false }] };
  const offLost = lostOf(offRv), offFacts = reviewFacts({ id: "plan-off", kind: "plan", at: "2099-01-01T00:00:00Z", review: offRv }, { plan: "p", map: { quizzes: [{ id: "k3", question: "Q3?", answer: "a", options: [{ id: "a", label: "A" }, { id: "b", label: "B" }] }] } });
  ok("checks off: lostOf and reviewFacts count only the check answered anyway", JSON.stringify(offLost.wrong) === '["k3"]' && offLost.of === 1 && offLost.walked === 0 && offFacts.checks === 1 && offFacts.wrongChecks.map((w) => w.k).join() === "k3" && offFacts.checksOff === true, JSON.stringify({ offLost, checks: offFacts.checks, wrong: offFacts.wrongChecks }));
  const onLost = lostOf({ ...offRv, checks: "on" });
  ok("checks on: the same review counts every check it carries", onLost.of === 3 && onLost.wrong.join() === "k2,k3", JSON.stringify(onLost));
  const offAct = actOnMarkdown({ id: "y", kind: "plan", review: { verdict: "approve", checks: "off", exportedAt: "2099-01-01T00:00:00Z", annotations: [], decisions: [], quizzes: [] }, planName: "p" });
  ok("what to act on: a review with quick checks off says so, and no checks missed", /with quick checks off \(not asked\)/.test(offAct) && !/quick checks? missed/.test(offAct), offAct);
  const yf = reel("memory", "flagged", "--you");
  ok("reel memory flagged --you: the evidence names the repo, plan, review and call", /- repo: gadget · walkthrough-20990103T100000Z · call A1 flagged \[visible\]/.test(yf.out), yf.out);

  // step 5: reel retro drafts a plan; it passes reel check; the suggestion goes until the next five plans
  const rt = reel("retro", repo, "--date", "2099-01-05");
  const rpd = join(rp, "plans", "2099-01-05-retro"), draft = existsSync(join(rpd, "plan.md")) ? readFileSync(join(rpd, "plan.md"), "utf8") : "";
  ok("reel retro: starts a plan with reel new-plan, a draft listing the evidence", rt.code === 0 && /^# Retro: /m.test(draft) && /^## The evidence$/m.test(draft) && /^### \[misses\] /m.test(draft) && /D-056 superseded by D-063/.test(draft), rt.out + draft.slice(0, 600));
  ok("…with \"Proposed skill edits\" for the agent to fill, each citing its evidence", /^## Proposed skill edits\n\n<!-- [^\n]*each edit|One bullet per edit[^\n]*evidence/m.test(draft) && /^## Proposed skill edits$/m.test(draft), draft);
  ok("…saying a retro adds no text the evidence doesn't need, and is not a quota to cut words", /A retro adds no text the evidence doesn't need\. That is not a quota to cut words/.test(draft));
  ok("…naming the benchmark: the Bob Dylan example, what exists in eval/ and what is missing", /the Bob Dylan example/.test(draft) && /\*\*Exists[^\n]*`eval\/plans\/bob-dylan-site\/`/.test(draft) && /\*\*Missing:\*\*[^\n]*a run of the example with the skill before and after the retro/.test(draft) && (!/\*\*Exists[^\n]*the prompt the example is made from/.test(draft) || /the prompt the example is made from \(`eval\/bob-dylan-site\/prompt\.md`\)/.test(draft)), draft.split("## The benchmark")[1]?.slice(0, 900));
  const rc = reel("check", rpd);
  ok("…and the draft passes reel check as written", rc.code === 0, rc.out.split("\n").filter((l) => l.startsWith("✗")).join("\n"));
  ok("reel retro: does not edit the skill", !existsSync(join(repo, "skills")) && readFileSync(join(ROOT, "skills", "plan-to-video", "SKILL.md"), "utf8").length > 0);
  const st2 = reel("status", repo);
  ok("reel status: after a retro, no retro is due", !/a retro is due/.test(st2.out), st2.out.split("\n").slice(-4).join("\n"));
  for (const [i, d] of ["2099-02-01", "2099-02-02", "2099-02-03", "2099-02-04", "2099-02-05"].entries()) reel("new-plan", repo, `later${i}`, "--plan", join(tmp, "next.md"), "--date", d);
  ok("reel status: five plans after the last retro, it is due again", /△ a retro is due: 5 plans since the last retro \(2099-01-05-retro\)/.test(reel("status", repo).out));

  // tests never touch the real home
  ok("the real ~/.reelplanning/you.jsonl was not touched", (existsSync(realYou) ? statSync(realYou).mtimeMs : null) === realBefore);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n${failed} failing` : "\nall checks pass");
process.exit(failed ? 1 : 0);
