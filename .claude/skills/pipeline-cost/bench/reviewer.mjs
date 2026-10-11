#!/usr/bin/env node
// The bench's reviewer: the same review in every run, sent the way the review page's Send sends it, so a revision
// is the same work whichever version builds it. It watches the timing log (rp-shim.sh) for the video being shown
// (`review <video-dir> --detach` ending with exit 0), then:
//
//   first showing    picks the recommended option of every decision in the video's plan-map.json (the first option
//                    when none is), answers no quick check, and requests changes with one comment on the plan's last
//                    step: the baseline run's own comment ("No step gets the bakery a web address…"). POSTed to the
//                    running review server's /api/review, as the page does.
//   second showing   the first `review --detach` after the review was sent: the revised video is up. Writes the done
//                    file, and the bench stops the run. (One run again before the review arrived is not it.)
//
// Each step is a line in its log, with the time, so the report can tell the reviewer's moments from the agent's.
//
// usage: node reviewer.mjs <repo> <timing.jsonl> <log.jsonl> <done-file>
import { readFileSync, existsSync, appendFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve, isAbsolute } from "node:path";

const [repo, timing, log, done] = process.argv.slice(2);
if (!done) { console.error("usage: node reviewer.mjs <repo> <timing.jsonl> <log.jsonl> <done-file>"); process.exit(2); }
const COMMENT = "No step gets the bakery a web address: add one for buying the domain and pointing it at the host.";
const say = (ev, more = {}) => appendFileSync(log, JSON.stringify({ at: Date.now(), ev, ...more }) + "\n");
const read = (p) => { try { return readFileSync(p, "utf8"); } catch { return ""; } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// each `review … --detach` that ended with exit 0: the video dir it showed, and when
function showings() {
  const starts = new Map(), out = [];
  for (const l of read(timing).split("\n").filter(Boolean)) {
    let e; try { e = JSON.parse(l); } catch { continue; }
    if (e.ev === "start") starts.set(e.id, e);
    else if (e.ev === "end" && e.exit === 0) {
      const s = starts.get(e.id), a = s?.args || [];
      const args = s?.cmd === "reel" ? a.slice(1) : a;   // `reel review` is not a thing today, but keep it general
      if ((s?.cmd === "reelplanner" && a[0] === "review" || s?.cmd === "reel" && a[0] === "review") && args.includes("--detach")) {
        const target = args.slice(1).find((x) => !x.startsWith("--"));
        if (target) out.push({ at: e.at, dir: isAbsolute(target) ? target : resolve(s.cwd, target) });
      }
    }
  }
  return out;
}

function reviewRow(videoDir) {
  const map = JSON.parse(read(join(videoDir, "plan-map.json")) || "{}");
  const decisions = (map.decisions || []).map((d) => {
    const o = (d.options || []).find((x) => x.recommended) || (d.options || [])[0];
    return o && { id: d.id, option: o.id, label: o.label, recommended: !!o.recommended, planStep: d.planStep, question: d.question, t: d.at, decidedAt: new Date().toISOString() };
  }).filter(Boolean);
  const steps = (map.frames || []).map((f) => f.planStep).filter(Number.isFinite);
  const last = steps.length ? Math.max(...steps) : null;
  const now = new Date().toISOString();
  return {
    version: 1, src: `${map.project || "video"}/index.html`, project: map.project || "video", exportedAt: now,
    watch: { firstPlayAt: now, maxTimeReached: map.totalSeconds || 0, durationSeconds: map.totalSeconds || 0, completion: 1, chapters: (map.chapters || []).map((c) => ({ id: c.id, completion: 1 })), moments: [], details: [] },
    decisions, quizzes: [], checks: "on", autonomy: [], knowledgeLevel: null, watched: [], questions: [],
    confusion: { wrongChecks: 0, walked: 0, termsOpened: 0, termsLookedUp: [], rewinds: 0, watchedPct: 100 },
    verdict: "changes",
    annotations: [{ id: "bench-web-address", kind: "note", comment: COMMENT, about: "", t: map.totalSeconds || 0, plan: { step: last, questions: [], component: null } }],
  };
}

// the running review server's record: the repo's inbox, or (a repo with no .reelplanner/) the machine folder's inbox for it
function serverOf() {
  const home = join(homedir(), ".reelplanner", "inbox");
  const dirs = [join(repo, ".reelplanner", "inbox"), ...(existsSync(home) ? readdirSync(home).map((d) => join(home, d)) : [])];
  const found = dirs.map((d) => join(d, ".server.json")).filter(existsSync).sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  for (const f of found) { const s = JSON.parse(read(f) || "null"); if (s?.port || s?.base) return { ...s, file: f }; }
  return null;
}

say("watching", { repo, timing });
let sent = 0, told = false;
for (;;) {
  const s = showings();
  if (!sent && s.length >= 1) {
    const { dir, at } = s[0];
    say("shown", { n: 1, dir, shownAt: at });
    const server = serverOf();
    if (!server) { if (!told) say("no-server", { dir }); told = true; await sleep(2000); continue; }
    const base = server.base || `http://127.0.0.1:${server.port}/`;
    const row = reviewRow(dir);
    const r = await fetch(new URL("api/review", base), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(row) }).then(async (x) => ({ status: x.status, body: await x.json().catch(() => null) })).catch((e) => ({ status: 0, body: String(e) }));
    say("review-sent", { status: r.status, response: r.body, decisions: row.decisions.length, server: server.file });
    if (r.status === 200) sent = Date.now(); else { await sleep(5000); continue; }
  }
  const after = sent ? s.filter((x) => x.at > sent) : [];
  if (after.length) {
    say("shown", { n: 2, dir: after[0].dir, shownAt: after[0].at });
    writeFileSync(done, JSON.stringify({ at: Date.now(), shown: s, reviewSentAt: sent }) + "\n");
    say("done");
    process.exit(0);
  }
  await sleep(2000);
}
