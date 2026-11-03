#!/usr/bin/env node
// The reviews submitted on the local review page, waiting in .reelplanner/inbox/ (in a repo with no set-up
// .reelplanner/, one video: this machine's ~/.reelplanner/inbox/<repo-key>/, so nothing is added to the repo).
//
//   reelplanner inbox                      list them: waiting (nobody has it) or claimed (by whom)
//   reelplanner inbox --wait               wait for one, claim it, print its path and exit 0.
//                                          Run it as a background task of the main session: it
//                                          exits when a review lands, which wakes the session in
//                                          any harness that reports finished background tasks.
//                                          While it runs, the review server knows a session is
//                                          waiting and does not start a headless run.
//                                          A question asked on the page (Ask about this) wakes it too:
//                                          the path it prints is then under inbox/questions/.
//   reelplanner inbox done <id | path>     move a handled review to inbox/done/
//   reelplanner inbox answer <id | path> "<answer>" [--from "<where>"]
//                                          answer a question asked on the page, from the plan, the
//                                          glossary and the scene it names; the page shows it in a
//                                          few seconds, with where it came from ("the plan, step 3")
//
//   --timeout <s>   (--wait) give up after s seconds, exit 2
//   --repo <dir>    the repo (default: the one you are in)
//   --owner <handle>  reuse the owner handle printed on stderr by an anonymous --wait;
//                     pass it to answer, renew, progress, done or a later --wait
// `reelplanner review --wait` is the same as `inbox --wait`.
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { resolve, basename, dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { activeSession } from "./lib/agents.mjs";
import { repoRoot, rpInitialized, rpDirOf } from "./lib/env.mjs";
import { actOnMarkdown } from "./lib/review-scope.mjs";
import { listInbox, waitForReview, markDone, liveWaiters, answerQuestion, waitingQuestions, readQuestion, questionNote, questionsDir, machineInbox, inboxDir, shownPath, retryAgent, renewClaim, progressOf, claimLive } from "./lib/inbox.mjs";

export async function main(args) {
  const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
  const valued = ["--repo", "--owner", "--timeout", "--from"];
  const commandIndex = args.findIndex((a, i) => !a.startsWith("--") && !valued.includes(args[i - 1]));
  const subcommand = args[commandIndex];
  const explicitOwner = flag("owner");
  if (args.includes("--owner") && (!explicitOwner || !/^[a-z][a-z0-9-]*:[A-Za-z0-9._-]+$/.test(explicitOwner))) { console.error("✗ --owner requires the handle printed by --wait"); return 1; }
  const callerOwner = explicitOwner || process.env.REELPLANNER_OWNER || activeSession(process.env)?.key || null;
  const repo = resolve(flag("repo") || repoRoot(process.cwd()));
  const rp = rpDirOf(repo), setUp = rpInitialized(rp);
  // the repo's inbox once `reel init` set it up; before that (one video) the one in this machine's folder, as the
  // review server keeps it (scripts/lib/inbox.mjs)
  const box = setUp ? rp : machineInbox(repo);
  const where = `${shownPath(inboxDir(box)) || "."}/${setUp ? "" : " (this machine's folder: the repo has no set-up .reelplanner/)"}`;

  if (!subcommand && args.includes("--wait")) {
    const t = Number(flag("timeout") || 0);
    console.error(`… waiting for a review in ${where} (Ctrl-C to stop)`);
    const waitOwner = callerOwner || `session:${randomUUID()}`;
    let p; try { p = await waitForReview(box, { timeoutMs: t > 0 ? t * 1000 : 0, questionsOnly: args.includes("--questions"), repo, owner: waitOwner }); }
    catch (e) { console.error(`✗ ${e.message}`); return 1; }
    if (!p) { console.error(`△ no review in ${t}s`); return 2; }
    if (!callerOwner) console.error(`owner handle: ${waitOwner}\nPass --owner ${waitOwner} to inbox answer, renew, progress and done; keep it for this claimed item.`);
    // a question asked on the page: its words here, so answering it needs no read of the inbox (outside the repo before `reel init`)
    if (dirname(p) === questionsDir(box)) { const q = readQuestion(box, basename(p, ".json")); if (q) console.error(questionNote(q)); }
    // a review in this machine's folder (no set-up .reelplanner/: a quick video's) is printed too, as what to act on;
    // a set-up repo's is in the repo, for reel-intake, and an explainer's goes to `reel record`, which reads it itself
    else if (!setUp) { const r = machineReviewNote(p); if (r) console.error(r); }
    console.log(p);
    return 0;
  }

  for (const command of ["renew", "progress", "retry"]) {
    const i = subcommand === command ? commandIndex : -1; if (i < 0) continue;
    const id = basename(String(args[i + 1] || "")).replace(/\.json$/, "");
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,159}$/.test(id)) { console.error(`usage: reelplanner inbox ${command} <id>${command === "progress" ? " <phase>" : ""}`); return 1; }
    try {
      if (command === "retry") {
        const r = await retryAgent(box, id);
        if (!r.started) { console.error(`△ ${id}: ${r.reason}`); return 1; }
        console.log(`✓ resumed ${id} (pid ${r.pid}); log: ${shownPath(r.log)}`);
      } else { renewClaim(box, id, { owner: callerOwner, ...(command === "progress" ? { phase: args[i + 2] } : {}) }); console.log(`✓ ${id}: ${command === "progress" ? args[i + 2] : "lease renewed"}`); }
    } catch (e) { console.error(`✗ ${e.message}`); return 1; }
    return 0;
  }

  const ai = subcommand === "answer" ? commandIndex : -1;
  if (ai >= 0) {
    const id = basename(String(args[ai + 1] || "")).replace(/\.json$/, ""), words = args.slice(ai + 2).filter((a, i, all) => !["--from", "--repo", "--owner"].includes(a) && !["--from", "--repo", "--owner"].includes(all[i - 1])).join(" ").trim();
    if (!id || !words) { console.error('usage: reelplanner inbox answer <id | path> "<answer>" [--from "<where>"]'); return 1; }
    let q; try { q = answerQuestion(box, id, words, flag("from") || null, { owner: callerOwner }); }
    catch (e) { console.error(`✗ ${e.message}`); return 1; }
    if (!q) { console.error(`✗ no question ${id} in the inbox`); return 1; }
    console.log(`✓ answered ${id}: the page shows it within a few seconds${q.from ? ` (from: ${q.from})` : ""}`);
    return 0;
  }

  // a set-up repo's reviews sent before `reel init`, still in the machine's inbox: named in the list, and done here too
  const before = setUp ? machineInbox(repo) : null;
  const di = subcommand === "done" ? commandIndex : -1;
  if (di >= 0) {
    const id = basename(String(args[di + 1] || "")).replace(/\.json$/, "");
    if (!id) { console.error("usage: reelplanner inbox done <id | path>"); return 1; }
    try { if (!markDone(box, id, { owner: callerOwner }) && !(before && markDone(before, id, { owner: callerOwner }))) { console.error(`✗ no review ${id} in the inbox`); return 1; } }
    catch (e) { console.error(`✗ ${e.message}`); return 1; }
    console.log(`✓ ${id} → inbox/done/`);
    return 0;
  }

  const all = listInbox(box), w = liveWaiters(box).length;
  console.log(`${all.length} review(s) in ${setUp ? "the inbox" : where}; ${w ? `${w} session(s) waiting` : "no session waiting"}`);
  for (const r of all) console.log(`  ${r.claim ? `${claimLive(r.claim) ? "claimed" : "stopped"} by ${r.claim.by === "agent" ? "a headless run" : "a session"} ${r.claim.at}${progressOf(box, r.id)?.phase ? ` (${progressOf(box, r.id).phase})` : ""}${r.claim.log ? `; log: ${r.claim.log}` : ""}` : "waiting"}  ${shownPath(r.path)}`);
  const qs = waitingQuestions(box, { includeClaimed: true });
  if (qs.length) console.log(`${qs.length} question(s) asked on the page, not answered yet (answer with \`reelplanner inbox answer <id> "<answer>" --from "<where>"\`):\n${qs.map((q) => { const s = readQuestion(box, q.id);
    return `  ${q.id}${s?.frame?.index ? ` (scene ${s.frame.index})` : ""}: ${s?.question ? JSON.stringify(String(s.question).replace(/\s+/g, " ").trim()) : "?"}  ${shownPath(q.path)}`; }).join("\n")}`);
  const left = before ? listInbox(before).filter((r) => !r.claim) : [];
  if (left.length) console.log(`△ ${left.length} review(s) sent before \`reel init\`, from a video with no plan folder, wait in this machine's folder (nothing here handles them): read each, then \`reelplanner inbox done <id>\`:\n${left.map((r) => `  ${shownPath(r.path)}`).join("\n")}`);
  return 0;
}

// A review in this machine's folder, as what to act on (a set-up repo's reviews/<id>.md, lib/review-scope.mjs): the
// verdict, each answer with its question, each comment on its step, the person's note quoted. The file is outside the
// repo, where an agent's sandbox or permissions may not reach it. An explainer's review (`reel record`) → null.
function machineReviewNote(path) {
  let row; try { row = JSON.parse(readFileSync(path, "utf8")); } catch { return null; }
  if (!row?.review || row.review.kind === "explainer") return null;
  const review = { ...row.review, note: row.note || row.review.note || "", verdict: row.review.verdict ?? row.verdict ?? null };
  const map = { decisions: (review.decisions || []).map((d) => ({ id: d.id, question: d.question, planStep: d.planStep })) };
  return `📝 the review, printed: its file is in this machine's folder, outside the repo\n${actOnMarkdown({ id: basename(path, ".json"), kind: "plan", review, planName: null, map }).trimEnd()}`;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(await main(process.argv.slice(2)));
