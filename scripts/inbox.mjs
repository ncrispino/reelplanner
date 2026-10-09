#!/usr/bin/env node
// The reviews submitted on the local review page, waiting in .reelplanner/inbox/.
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
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, resolve, basename, relative } from "node:path";
import { repoRoot, rpInitialized, rpDirOf } from "./lib/env.mjs";
import { listInbox, waitForReview, markDone, liveWaiters, answerQuestion, waitingQuestions } from "./lib/inbox.mjs";

export async function main(args) {
  const flag = (n) => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
  const repo = resolve(flag("repo") || repoRoot(process.cwd()));
  const rp = rpDirOf(repo);
  if (!rpInitialized(rp)) { console.error(`✗ ${existsSync(rp) ? `${rp} is not set up yet (no decisions.json, only setup files): a review there downloads, and the first plan runs \`reelplanner reel init\`` : `no .reelplanner/ at ${repo}: run this in a repo set up with \`reelplanner reel init\`, or pass --repo <dir>`}`); return 1; }

  if (args.includes("--wait")) {
    const t = Number(flag("timeout") || 0);
    console.error(`… waiting for a review in ${relative(process.cwd(), join(rp, "inbox")) || "."}/ (Ctrl-C to stop)`);
    const p = await waitForReview(rp, { timeoutMs: t > 0 ? t * 1000 : 0 });
    if (!p) { console.error(`△ no review in ${t}s`); return 2; }
    console.log(p);
    return 0;
  }

  const ai = args.indexOf("answer");
  if (ai >= 0) {
    const id = basename(String(args[ai + 1] || "")).replace(/\.json$/, ""), words = args.slice(ai + 2).filter((a, i, all) => a !== "--from" && all[i - 1] !== "--from" && a !== "--repo" && all[i - 1] !== "--repo").join(" ").trim();
    if (!id || !words) { console.error('usage: reelplanner inbox answer <id | path> "<answer>" [--from "<where>"]'); return 1; }
    const q = answerQuestion(rp, id, words, flag("from") || null);
    if (!q) { console.error(`✗ no question ${id} in the inbox`); return 1; }
    console.log(`✓ answered ${id}: the page shows it within a few seconds${q.from ? ` (from: ${q.from})` : ""}`);
    return 0;
  }

  const di = args.indexOf("done");
  if (di >= 0) {
    const id = basename(String(args[di + 1] || "")).replace(/\.json$/, "");
    if (!id) { console.error("usage: reelplanner inbox done <id | path>"); return 1; }
    if (!markDone(rp, id)) { console.error(`✗ no review ${id} in the inbox`); return 1; }
    console.log(`✓ ${id} → inbox/done/`);
    return 0;
  }

  const all = listInbox(rp), w = liveWaiters(rp).length;
  console.log(`${all.length} review(s) in the inbox; ${w ? `${w} session(s) waiting` : "no session waiting"}`);
  for (const r of all) console.log(`  ${r.claim ? `claimed by ${r.claim.by === "agent" ? "a headless run" : "a session"} ${r.claim.at}` : "waiting"}  ${relative(process.cwd(), r.path)}`);
  const qs = waitingQuestions(rp);
  if (qs.length) console.log(`${qs.length} question(s) asked on the page, not answered yet:\n${qs.map((q) => `  ${relative(process.cwd(), q.path)}`).join("\n")}`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(await main(process.argv.slice(2)));
