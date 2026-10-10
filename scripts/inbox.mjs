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
// `reelplanner review --wait` is the same as `inbox --wait`.
import { fileURLToPath } from "node:url";
import { resolve, basename } from "node:path";
import { repoRoot, rpInitialized, rpDirOf } from "./lib/env.mjs";
import { listInbox, waitForReview, markDone, liveWaiters, answerQuestion, waitingQuestions, machineInbox, inboxDir, shownPath } from "./lib/inbox.mjs";

export async function main(args) {
  const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
  const repo = resolve(flag("repo") || repoRoot(process.cwd()));
  const rp = rpDirOf(repo), setUp = rpInitialized(rp);
  // the repo's inbox once `reel init` set it up; before that (one video) the one in this machine's folder, as the
  // review server keeps it (scripts/lib/inbox.mjs)
  const box = setUp ? rp : machineInbox(repo);
  const where = `${shownPath(inboxDir(box)) || "."}/${setUp ? "" : " (this machine's folder: the repo has no set-up .reelplanner/)"}`;

  if (args.includes("--wait")) {
    const t = Number(flag("timeout") || 0);
    console.error(`… waiting for a review in ${where} (Ctrl-C to stop)`);
    const p = await waitForReview(box, { timeoutMs: t > 0 ? t * 1000 : 0 });
    if (!p) { console.error(`△ no review in ${t}s`); return 2; }
    console.log(p);
    return 0;
  }

  const ai = args.indexOf("answer");
  if (ai >= 0) {
    const id = basename(String(args[ai + 1] || "")).replace(/\.json$/, ""), words = args.slice(ai + 2).filter((a, i, all) => a !== "--from" && all[i - 1] !== "--from" && a !== "--repo" && all[i - 1] !== "--repo").join(" ").trim();
    if (!id || !words) { console.error('usage: reelplanner inbox answer <id | path> "<answer>" [--from "<where>"]'); return 1; }
    const q = answerQuestion(box, id, words, flag("from") || null);
    if (!q) { console.error(`✗ no question ${id} in the inbox`); return 1; }
    console.log(`✓ answered ${id}: the page shows it within a few seconds${q.from ? ` (from: ${q.from})` : ""}`);
    return 0;
  }

  // a set-up repo's reviews sent before `reel init`, still in the machine's inbox: named in the list, and done here too
  const before = setUp ? machineInbox(repo) : null;
  const di = args.indexOf("done");
  if (di >= 0) {
    const id = basename(String(args[di + 1] || "")).replace(/\.json$/, "");
    if (!id) { console.error("usage: reelplanner inbox done <id | path>"); return 1; }
    if (!markDone(box, id) && !(before && markDone(before, id))) { console.error(`✗ no review ${id} in the inbox`); return 1; }
    console.log(`✓ ${id} → inbox/done/`);
    return 0;
  }

  const all = listInbox(box), w = liveWaiters(box).length;
  console.log(`${all.length} review(s) in ${setUp ? "the inbox" : where}; ${w ? `${w} session(s) waiting` : "no session waiting"}`);
  for (const r of all) console.log(`  ${r.claim ? `claimed by ${r.claim.by === "agent" ? "a headless run" : "a session"} ${r.claim.at}` : "waiting"}  ${shownPath(r.path)}`);
  const qs = waitingQuestions(box);
  if (qs.length) console.log(`${qs.length} question(s) asked on the page, not answered yet:\n${qs.map((q) => `  ${shownPath(q.path)}`).join("\n")}`);
  const left = before ? listInbox(before).filter((r) => !r.claim) : [];
  if (left.length) console.log(`△ ${left.length} review(s) sent before \`reel init\`, from a video with no plan folder, wait in this machine's folder (nothing here handles them): read each, then \`reelplanner inbox done <id>\`:\n${left.map((r) => `  ${shownPath(r.path)}`).join("\n")}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(await main(process.argv.slice(2)));
