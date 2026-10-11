#!/usr/bin/env node
// Shared delivery, leases and recovery in scratch repos; no model, owner config or review server.
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir, hostname } from "node:os";
import { execFileSync } from "node:child_process";
import { claim, claimOf, claimLive, connectSession, connectionOf, deliverInbox, writeReview, writeQuestion, readQuestion, waitingQuestions, waitForReview, renewClaim, progressOf, markDone, retryAgent, agentPrompt } from "../lib/inbox.mjs";

const repo = mkdtempSync(join(tmpdir(), "reel-delivery-")), rp = join(repo, ".reelplanner"), box = join(rp, "inbox");
mkdirSync(rp); writeFileSync(join(rp, "config.json"), "{}");
let queued = [], starts = 0;
const adapter = {
  verifySession: async ({ repo: target, session }) => { assert.equal(target, repo.replace(/^\/var\//, "/private/var/")); if (session !== "fake:main") throw new Error("wrong session/repo"); return { id: "main", repo: target, endpoint: "ws://127.0.0.1:10002" }; },
  deliver: async ({ inboxPath, endpoint }) => { assert(existsSync(inboxPath)); assert.equal(endpoint, "ws://127.0.0.1:10002"); queued.push(inboxPath); return { status: "delivered" }; },
};
const finish = (id) => markDone(rp, id, { owner: claimOf(rp, id)?.owner || null });
const row = (n) => ({ project: "video", submittedAt: `2026-01-01T00:00:0${n}Z`, review: { annotations: [] } });
const git = (...argv) => execFileSync("git", ["-C", repo, ...argv], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const until = async (f) => { const end = Date.now() + 5000; while (Date.now() < end) { if (f()) return; await new Promise((ok) => setTimeout(ok, 20)); } throw new Error("worker did not exit"); };
try {
  await assert.rejects(connectSession(rp, { session: "fake:wrong", adapter }), /wrong session/);
  assert(!existsSync(join(box, ".connection.json")));
  await connectSession(rp, { session: "fake:main", endpoint: "ws://127.0.0.1:10001", adapter });
  assert.equal(connectionOf(rp).endpoint, "ws://127.0.0.1:10002"); // save the verified transport, never raw input
  const r = writeReview(rp, row(1));
  const result = await deliverInbox(rp, r.id, { adapter, start: async () => { starts++; return { started: true }; } });
  assert.equal(result.handledBy, "session"); assert.equal(starts, 0); assert.deepEqual(queued, [r.path]);
  assert.equal(progressOf(rp, r.id).phase, "queued");
  assert.equal(await waitForReview(rp, { owner: "fake:other", timeoutMs: 50, pollMs: 10 }), null);
  assert.equal(await waitForReview(rp, { owner: "fake:main", timeoutMs: 50 }), r.path);
  assert.equal(progressOf(rp, r.id).phase, "handling");
  assert(claimLive({ ...claimOf(rp, r.id), pid: 9999999 })); // waiter exit is not worker death
  assert.throws(() => renewClaim(rp, r.id, { owner: "fake:other" }), /another session/);
  renewClaim(rp, r.id, { owner: "fake:main" });
  assert.equal((await retryAgent(rp, r.id)).reason, "a live owner still holds this review");
  assert.equal(progressOf(rp, r.id).completionMode, "quick-review"); assert(finish(r.id));
  console.log("✓ fake harness uses shared queue/adoption/lease guard without a server branch");

  const deadSessionPid = Number(execFileSync(process.execPath, ["-e", "console.log(process.pid)"], { encoding: "utf8" }).trim());
  const legacySession = { by: "session", pid: deadSessionPid, host: hostname(), at: "2026-01-01T00:00:00Z" };
  assert(!claimLive(legacySession));
  assert(claimLive({ ...legacySession, pid: process.pid }));
  assert(claimLive({ ...legacySession, host: "unverified-remote-host" }));
  assert(claimLive({ ...legacySession, host: undefined }));
  assert(claimLive({ ...legacySession, pid: undefined }));
  assert(claimLive({ ...legacySession, pid: "not-a-pid" }));
  assert(claimLive({ ...legacySession, owner: "modern:missing-lease" }));
  assert(claimLive({ ...legacySession, owner: "modern:leased", leaseUntil: Date.now() + 60000 }));
  assert(!claimLive({ ...legacySession, owner: "modern:expired", leaseUntil: 0 }));
  const realKill = process.kill;
  try {
    for (const code of ["EPERM", "EIO"]) {
      process.kill = () => { throw Object.assign(new Error("process probe unavailable"), { code }); };
      assert(claimLive(legacySession));
    }
  } finally { process.kill = realKill; }
  const legacyWaiting = writeReview(rp, { ...row(9), project: "legacy-dead-session" });
  writeFileSync(join(box, `${legacyWaiting.id}.claim`), JSON.stringify(legacySession));
  assert.equal(progressOf(rp, legacyWaiting.id), null);
  assert.equal(await waitForReview(rp, { owner: "fake:legacy-adopter", timeoutMs: 50 }), legacyWaiting.path);
  assert.equal(claimOf(rp, legacyWaiting.id).owner, "fake:legacy-adopter");
  assert.equal(progressOf(rp, legacyWaiting.id).phase, "handling"); assert(finish(legacyWaiting.id));
  console.log("✓ proven dead same-host ownerless legacy session is adoptable; live/remote/unverifiable claims stay held and modern leases ignore waiter exit");

  const q = writeQuestion(rp, { id: "ask-pending", question: "Why?" });
  await deliverInbox(rp, q.id, { question: true, adapter: { ...adapter, deliver: async () => ({ status: "error", reason: "stale session" }) }, start: async () => { starts++; } });
  assert.equal(starts, 0); assert.equal(readQuestion(rp, q.id).answer, undefined);
  assert.equal(writeQuestion(rp, { id: q.id, question: "Why?" }).duplicate, true);
  assert.equal(await waitForReview(rp, { questionsOnly: true, owner: "fake:next", timeoutMs: 50 }), q.path);
  assert.equal(waitingQuestions(rp, { includeClaimed: true }).length, 1);
  const qp = join(box, "questions", `${q.id}.claim`), old = JSON.parse(readFileSync(qp));
  writeFileSync(qp, JSON.stringify({ ...old, leaseUntil: 1 }));
  assert.equal(await waitForReview(rp, { questionsOnly: true, owner: "fake:recovered", timeoutMs: 50 }), q.path);
  console.log("✓ failed question delivery stays pending, deduplicated and recoverable by the next waiter");

  const fallback = writeReview(rp, row(2));
  const failed = await deliverInbox(rp, fallback.id, { adapter: { ...adapter, deliver: async () => ({ status: "unavailable" }) }, start: async () => { assert.equal(claimOf(rp, fallback.id), null); starts++; return { started: true, pid: 123 }; } });
  assert.equal(failed.handledBy, "agent"); assert.equal(starts, 1);
  finish(fallback.id); // the stand-in launch above did not leave a real worker/claim
  console.log("✓ failed queue releases delivery ownership before configured headless fallback");
  const race = writeReview(rp, row(4));
  const adopted = await deliverInbox(rp, race.id, { adapter: { ...adapter, deliver: async () => {
    assert.equal(await waitForReview(rp, { owner: "fake:main", timeoutMs: 50 }), race.path);
    return { status: "error", reason: "transport failed after receipt" };
  } }, start: async () => { throw new Error("must not start a second handler"); } });
  assert.equal(adopted.handledBy, "session"); assert.equal(progressOf(rp, race.id).phase, "handling");
  console.log("✓ queue failure after recipient adoption preserves its handler lease");

  git("init", "-q"); git("config", "user.email", "scratch@example.test"); git("config", "user.name", "Scratch");
  writeFileSync(join(repo, ".gitignore"), ".reelplanner/inbox/\nworker.mjs\n");
  writeFileSync(join(repo, "owner-existing.txt"), "owner original\n");
  writeFileSync(join(repo, "app.txt"), "before\n"); git("add", "."); git("-c", "commit.gpgsign=false", "commit", "-qm", "baseline");
  const baseline = git("rev-parse", "HEAD"), run = writeReview(rp, row(3));
  writeFileSync(join(repo, "owner-existing.txt"), "owner pending work\n");
  const worker = join(repo, "worker.mjs"); writeFileSync(worker, 'import { writeFileSync } from "node:fs"; writeFileSync("app.txt", "after\\n"); process.exit(1);');
  const fake = { headless: async ({ argv, env }) => ({ argv, env, commitAdvice: "Keep configured permissions." }) };
  const config = { agent: { command: [process.execPath, worker] } };
  const [first, concurrent] = await Promise.all([retryAgent(rp, run.id, { config, adapter: fake }), retryAgent(rp, run.id, { config, adapter: fake })]); assert(first.started); assert.equal(concurrent.reason, "another retry is in progress");
  await until(() => !claimLive(claimOf(rp, run.id)));
  const saved = progressOf(rp, run.id); assert.equal(saved.startHead, baseline);
  assert.throws(() => finish(run.id), /Stopped before commit/);
  assert.throws(() => renewClaim(rp, run.id, { owner: claimOf(rp, run.id).owner, phase: "committed" }), /requires a new descendant commit/);
  writeFileSync(join(box, `.retry-${run.id}.claim`), JSON.stringify({ by: "retry", pid: 9999999, host: hostname() }));
  const second = await retryAgent(rp, run.id, { config, adapter: fake }); assert(second.started);
  assert(second.argv.at(-1).includes("Reconcile existing edits"));
  await until(() => !claimLive(claimOf(rp, run.id)));
  assert.equal(progressOf(rp, run.id).startHead, baseline);
  assert.deepEqual(progressOf(rp, run.id).baselineTracked, saved.baselineTracked);
  renewClaim(rp, run.id, { owner: claimOf(rp, run.id).owner, phase: "checked" });
  git("add", "app.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "review change");
  renewClaim(rp, run.id, { owner: claimOf(rp, run.id).owner, phase: "committed" });
  assert(finish(run.id));
  assert(git("diff", "--", "owner-existing.txt").includes("owner pending work"));
  git("restore", "owner-existing.txt");
  assert(!agentPrompt("x", "id", { commitAdvice: "Generic Git policy." }).includes("only that form runs outside"));
  assert(claimLive({ runPid: process.pid, host: hostname(), leaseUntil: 1 }));
  console.log("✓ stopped edits survive guarded retry with original owner fingerprints/baseline intact before committed completion");

  writeFileSync(join(repo, "owner-private.txt"), "original owner text\n");
  writeFileSync(join(repo, "reviewed.txt"), "before\n");
  git("add", "owner-private.txt", "reviewed.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "owner fixture");
  writeFileSync(join(repo, "owner-private.txt"), "owner-private-sentinel\n");
  const ownedDiff = git("diff", "--", "owner-private.txt"), owned = writeReview(rp, row(5));
  assert.equal(await waitForReview(rp, { owner: "fake:direct", timeoutMs: 50 }), owned.path);
  const directProgress = progressOf(rp, owned.id);
  assert.equal(directProgress.completionMode, "git");
  assert(!JSON.stringify(directProgress).includes("owner-private"));
  assert.throws(() => finish(owned.id), /Stopped before commit/);
  writeFileSync(join(repo, "reviewed.txt"), "review applied\n");
  renewClaim(rp, owned.id, { owner: "fake:direct", phase: "checked" });
  git("add", "reviewed.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "review only");
  assert.throws(() => finish(owned.id), /Stopped before commit/); // phase evidence is still required
  renewClaim(rp, owned.id, { owner: "fake:direct", phase: "committed" });
  assert(finish(owned.id)); assert.equal(git("diff", "--", "owner-private.txt"), ownedDiff);
  console.log("✓ direct waiter records a private baseline, requires commit evidence, and preserves unrelated unstaged owner work");

  git("add", "owner-private.txt"); // staged owner work is also kept in the same state
  const connected = writeReview(rp, row(6));
  await deliverInbox(rp, connected.id, { adapter });
  const connectedBaseline = progressOf(rp, connected.id);
  assert.equal(connectedBaseline.completionMode, "git"); assert.equal(connectedBaseline.phase, "queued");
  assert.throws(() => finish(connected.id), /Stopped before commit/);
  assert.equal(await waitForReview(rp, { owner: "fake:main", timeoutMs: 50 }), connected.path);
  assert.deepEqual(progressOf(rp, connected.id).baselineTracked, connectedBaseline.baselineTracked);
  writeFileSync(join(repo, "reviewed.txt"), "connected review applied\n");
  renewClaim(rp, connected.id, { owner: "fake:main", phase: "checked" });
  // --only commits the review file while leaving the owner's staged file staged.
  git("-c", "commit.gpgsign=false", "commit", "--only", "reviewed.txt", "-qm", "connected review only");
  renewClaim(rp, connected.id, { owner: "fake:main", phase: "committed" });
  assert.throws(() => markDone(rp, connected.id, { owner: "fake:other" }), /another session/);
  writeFileSync(join(repo, "reviewed.txt"), "residual review edit\n");
  assert.throws(() => finish(connected.id), /new pending tracked edits/);
  assert.throws(() => renewClaim(rp, connected.id, { owner: "fake:main", phase: "committed" }), /new pending tracked edits/);
  writeFileSync(join(repo, "reviewed.txt"), "connected review applied\n");
  assert(finish(connected.id)); assert.equal(git("diff", "--cached", "--name-only"), "owner-private.txt");
  console.log("✓ connected claims require a commit, preserve staged owner edits, and block new residual tracked changes");

  git("restore", "--staged", "owner-private.txt"); git("restore", "owner-private.txt");
  const initialText = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`).join("\n") + "\n";
  writeFileSync(join(repo, "shared.txt"), initialText); git("add", "shared.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "offset fixture");
  const stagedOwnerText = initialText.replace("line 5", "owner staged text at line 5");
  writeFileSync(join(repo, "shared.txt"), stagedOwnerText); git("add", "shared.txt");
  writeFileSync(join(repo, "shared.txt"), stagedOwnerText.replace("line 15", "owner text at line 15"));
  const offset = writeReview(rp, row(7)); claim(rp, offset.id, "session", { owner: "fake:offset" });
  const baselineOffset = progressOf(rp, offset.id).baselineTracked;
  const reviewedText = "review introduction\n" + initialText;
  writeFileSync(join(repo, "shared.txt"), "review introduction\n" + stagedOwnerText.replace("line 15", "owner text at line 15"));
  const untouchedOwnerIndex = git("ls-files", "--stage");
  renewClaim(rp, offset.id, { owner: "fake:offset", phase: "checked" });
  assert.equal(git("ls-files", "--stage"), untouchedOwnerIndex);
  const blob = execFileSync("git", ["-C", repo, "hash-object", "-w", "--stdin"], { input: reviewedText, encoding: "utf8" }).trim();
  git("update-index", "--cacheinfo", `100644,${blob},shared.txt`); git("-c", "commit.gpgsign=false", "commit", "-qm", "separate edit in same file");
  const ownerBlob = execFileSync("git", ["-C", repo, "hash-object", "-w", "--stdin"], { input: "review introduction\n" + stagedOwnerText, encoding: "utf8" }).trim();
  git("update-index", "--cacheinfo", `100644,${ownerBlob},shared.txt`);
  renewClaim(rp, offset.id, { owner: "fake:offset", phase: "committed" });
  assert.deepEqual(progressOf(rp, offset.id).baselineTracked, baselineOffset); assert(finish(offset.id));
  assert(git("diff", "--", "shared.txt").includes("owner text at line 15"));
  assert(git("diff", "--cached", "--", "shared.txt").includes("owner staged text at line 5"));
  console.log("✓ a committed edit elsewhere in the same file shifts staged and unstaged owner hunks while preserving both fingerprints and staging states");

  git("restore", "--staged", "shared.txt"); git("restore", "shared.txt");
  const proof = writeReview(rp, row(9)); claim(rp, proof.id, "session", { owner: "fake:proof" });
  git("-c", "commit.gpgsign=false", "commit", "--allow-empty", "-qm", "unrelated empty commit");
  assert.throws(() => renewClaim(rp, proof.id, { owner: "fake:proof", phase: "committed" }), /recorded checked work/);
  writeFileSync(join(repo, "app.txt"), "unrelated nonempty change\n");
  git("add", "app.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "unrelated nonempty commit");
  assert.throws(() => renewClaim(rp, proof.id, { owner: "fake:proof", phase: "committed" }), /recorded checked work/);
  assert.throws(() => renewClaim(rp, proof.id, { owner: "fake:proof", phase: "checked" }), /No new review work/);
  writeFileSync(join(repo, "reviewed.txt"), "the checked review result\n");
  renewClaim(rp, proof.id, { owner: "fake:proof", phase: "checked" });
  const checkedProof = progressOf(rp, proof.id);
  git("restore", "reviewed.txt");
  writeFileSync(join(repo, "app.txt"), "another unrelated nonempty change\n");
  git("add", "app.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "unrelated after checked");
  assert.throws(() => renewClaim(rp, proof.id, { owner: "fake:proof", phase: "committed" }), /recorded checked work/);
  assert.throws(() => finish(proof.id), /Stopped before commit/);
  writeFileSync(join(repo, "app.txt"), "unrelated nonempty change\n");
  writeFileSync(join(repo, "reviewed.txt"), "the checked review result\n");
  git("add", "app.txt", "reviewed.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "commit exactly the checked result");
  renewClaim(rp, proof.id, { owner: "fake:proof", phase: "committed" });
  assert.equal(progressOf(rp, proof.id).checkedTree, checkedProof.checkedTree); assert(finish(proof.id));
  console.log("✓ empty and nonempty unrelated commits cannot complete a review; commitment must match the previously checked work");

  const ownerUntrackedText = `owner untracked sentinel ${repo}\n`;
  writeFileSync(join(repo, "owner-untracked.txt"), ownerUntrackedText);
  const privateUntrackedBlob = git("hash-object", "owner-untracked.txt"); // read-only: no -w
  assert.throws(() => git("cat-file", "-e", privateUntrackedBlob));
  const intake = writeReview(rp, { ...row(9), project: "intake" }); claim(rp, intake.id, "session", { owner: "fake:intake" });
  writeFileSync(join(repo, "new-intake.md"), "durable review intake\n");
  const intakeOwnerIndex = git("ls-files", "--stage");
  renewClaim(rp, intake.id, { owner: "fake:intake", phase: "checked" });
  assert.equal(git("ls-files", "--stage"), intakeOwnerIndex);
  assert.throws(() => git("cat-file", "-e", privateUntrackedBlob)); // owner bytes never enter even unreachable Git objects
  git("-c", "commit.gpgsign=false", "commit", "--allow-empty", "-qm", "did not commit intake");
  assert.throws(() => renewClaim(rp, intake.id, { owner: "fake:intake", phase: "committed" }), /recorded checked work/);
  git("add", "new-intake.md"); git("-c", "commit.gpgsign=false", "commit", "-qm", "review intake only");
  renewClaim(rp, intake.id, { owner: "fake:intake", phase: "committed" });
  writeFileSync(join(repo, "residual-new.txt"), "not committed\n");
  assert.throws(() => finish(intake.id), /untracked files/); rmSync(join(repo, "residual-new.txt"));
  assert(finish(intake.id)); assert.equal(readFileSync(join(repo, "owner-untracked.txt"), "utf8"), ownerUntrackedText);
  assert.equal(git("ls-files", "owner-untracked.txt"), "");
  rmSync(join(repo, "owner-untracked.txt"));
  console.log("✓ checked evidence includes untracked intake without writing original untracked owner bytes to Git objects or changing their files/index; residual new files block completion");

  const generatedPaths = ["generated/.hyperframes/shots/02-02-setting.png", "generated/compositions/captions.html"];
  for (const path of generatedPaths) { mkdirSync(join(repo, path, ".."), { recursive: true }); writeFileSync(join(repo, path), `generated local artifact ${path}\n`); }
  writeFileSync(join(repo, "owner-removed.txt"), "original owner artifact retained locally\n");
  git("add", ...generatedPaths, "owner-removed.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "previously tracked generated fixture");
  const previousIgnore = readFileSync(join(repo, ".gitignore"), "utf8");
  writeFileSync(join(repo, ".gitignore"), previousIgnore + "owner-removed.txt\n");
  git("add", ".gitignore"); git("-c", "commit.gpgsign=false", "commit", "-qm", "original owner ignore rule");
  git("rm", "--cached", "owner-removed.txt");
  writeFileSync(join(repo, "owner-private.txt"), "original staged owner edit\n"); git("add", "owner-private.txt");
  writeFileSync(join(repo, "owner-existing.txt"), "original unstaged owner edit\n");
  writeFileSync(join(repo, "owner-generated-untracked.txt"), "original untracked owner edit\n");
  const originalOwnerStage = git("diff", "--cached", "--binary", "--", "owner-private.txt", "owner-removed.txt");
  const originalOwnerUnstaged = git("diff", "--", "owner-existing.txt");
  const generatedReview = writeReview(rp, { ...row(9), project: "generated-removals" });
  claim(rp, generatedReview.id, "session", { owner: "fake:generated" });
  writeFileSync(join(repo, ".gitignore"), previousIgnore + "owner-removed.txt\n" + generatedPaths.join("\n") + "\n");
  git("rm", "--cached", ...generatedPaths); // retain the ignored local files for the player
  writeFileSync(join(repo, "reviewed.txt"), "review video source correction\n"); git("add", ".gitignore", "reviewed.txt");
  const generatedOwnerIndex = git("ls-files", "--stage");
  renewClaim(rp, generatedReview.id, { owner: "fake:generated", phase: "checked" });
  assert.equal(git("ls-files", "--stage"), generatedOwnerIndex);
  // Temporarily separate the original owner's staged work to commit only the review.
  git("restore", "--staged", "owner-private.txt", "owner-removed.txt");
  git("-c", "commit.gpgsign=false", "commit", "-qm", "source-only review removes tracked generated artifacts");
  execFileSync("git", ["-C", repo, "apply", "--cached", "-"], { input: originalOwnerStage + "\n", stdio: ["pipe", "pipe", "pipe"] });
  assert.equal(git("rev-parse", "HEAD^{tree}"), progressOf(rp, generatedReview.id).checkedTree);
  renewClaim(rp, generatedReview.id, { owner: "fake:generated", phase: "committed" }); assert(finish(generatedReview.id));
  assert.equal(git("diff", "--cached", "--binary", "--", "owner-private.txt", "owner-removed.txt"), originalOwnerStage);
  assert.equal(git("diff", "--", "owner-existing.txt"), originalOwnerUnstaged);
  assert.equal(readFileSync(join(repo, "owner-generated-untracked.txt"), "utf8"), "original untracked owner edit\n");
  for (const path of generatedPaths) {
    assert.equal(git("ls-files", "--", path), ""); assert.equal(git("check-ignore", "--", path), path);
    assert.equal(readFileSync(join(repo, path), "utf8"), `generated local artifact ${path}\n`);
  }
  assert(existsSync(join(repo, "owner-removed.txt")));
  git("restore", "--staged", "owner-private.txt", "owner-removed.txt"); git("restore", "owner-private.txt", "owner-existing.txt");
  rmSync(join(repo, "owner-generated-untracked.txt"));
  console.log("✓ checked source-only commit honors staged deletion of generated files retained ignored locally, while preserving owner staged deletions/edits, unstaged and untracked work");

  for (const situation of ["handling", "intake", "editing", "checked", "committed", "checked-after-commit"]) {
    const phase = situation === "checked-after-commit" ? "checked" : situation;
    const alreadyCommitted = ["committed", "checked-after-commit"].includes(situation);
    const recovery = writeReview(rp, { ...row(9), project: `recover-${situation}` });
    claim(rp, recovery.id, "session", { owner: "fake:expired" });
    if (["checked", "committed"].includes(phase)) writeFileSync(join(repo, "reviewed.txt"), `recovery ${situation}\n`);
    renewClaim(rp, recovery.id, { owner: "fake:expired", phase: phase === "committed" ? "checked" : phase });
    if (alreadyCommitted) {
      git("add", "reviewed.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "result committed before handler crashed");
      if (phase === "committed") renewClaim(rp, recovery.id, { owner: "fake:expired", phase });
    }
    const retained = progressOf(rp, recovery.id), retainedHead = git("rev-parse", "HEAD"), recoveryClaim = join(box, `${recovery.id}.claim`);
    assert.equal(await waitForReview(rp, { owner: "fake:blocked", timeoutMs: 20, pollMs: 5 }), null);
    writeFileSync(recoveryClaim, JSON.stringify({ ...claimOf(rp, recovery.id), leaseUntil: 1, runPid: process.pid }));
    assert.equal(await waitForReview(rp, { owner: "fake:blocked", timeoutMs: 20, pollMs: 5 }), null); // even an expired lease cannot steal a live run
    writeFileSync(recoveryClaim, JSON.stringify({ ...claimOf(rp, recovery.id), runPid: undefined }));
    const [winner, loser] = await Promise.all([
      waitForReview(rp, { owner: "fake:recovery-one", timeoutMs: 40, pollMs: 5 }),
      waitForReview(rp, { owner: "fake:recovery-two", timeoutMs: 40, pollMs: 5 }),
    ]);
    assert.equal(winner, recovery.path); assert.equal(loser, null);
    assert.deepEqual(progressOf(rp, recovery.id), { ...retained, at: progressOf(rp, recovery.id).at });
    if (phase !== "committed") {
      if (phase !== "checked") {
        writeFileSync(join(repo, "reviewed.txt"), `recovery ${phase}\n`);
        renewClaim(rp, recovery.id, { owner: "fake:recovery-one", phase: "checked" });
      }
      if (!alreadyCommitted) { git("add", "reviewed.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "finish recovered checked work"); }
      renewClaim(rp, recovery.id, { owner: "fake:recovery-one", phase: "committed" });
    }
    assert(finish(recovery.id));
    if (alreadyCommitted) assert.equal(git("rev-parse", "HEAD"), retainedHead);
  }
  console.log("✓ next live session atomically recovers every expired handler phase without headless configuration or losing baseline/check/commit evidence; live leases and runs remain protected");

  const unclaimedGit = writeReview(rp, { ...row(9), project: "unclaimed-git" });
  assert.equal(claimOf(rp, unclaimedGit.id), null); assert.equal(progressOf(rp, unclaimedGit.id), null);
  assert.throws(() => finish(unclaimedGit.id), /no owner claim/);
  assert(existsSync(unclaimedGit.path)); assert(!existsSync(join(box, "done", `${unclaimedGit.id}.json`)));
  claim(rp, unclaimedGit.id, "session", { owner: "fake:new-git" });
  writeFileSync(join(repo, "reviewed.txt"), "new claimed and checked Git review\n");
  renewClaim(rp, unclaimedGit.id, { owner: "fake:new-git", phase: "checked" });
  git("add", "reviewed.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "complete properly instrumented review");
  renewClaim(rp, unclaimedGit.id, { owner: "fake:new-git", phase: "committed" });
  assert(finish(unclaimedGit.id));

  const legacyGit = writeReview(rp, { ...row(9), project: "legacy-git" });
  writeFileSync(join(box, `${legacyGit.id}.claim`), JSON.stringify({ by: "session", owner: "fake:legacy", pid: process.pid, host: hostname(), leaseUntil: 1 }));
  assert.throws(() => finish(legacyGit.id), /no recorded Git baseline or checked work/);
  assert.throws(() => renewClaim(rp, legacyGit.id, { owner: "fake:legacy", phase: "committed" }), /recorded checked work/);
  assert(existsSync(legacyGit.path)); assert.equal(progressOf(rp, legacyGit.id), null);
  writeFileSync(join(box, `${legacyGit.id}.claim`), JSON.stringify({ ...claimOf(rp, legacyGit.id), leaseUntil: 1 }));
  assert.equal(await waitForReview(rp, { owner: "fake:legacy-recovered", timeoutMs: 50 }), legacyGit.path);
  assert.equal(progressOf(rp, legacyGit.id).completionMode, "git");
  assert.equal(progressOf(rp, legacyGit.id).startHead, git("rev-parse", "HEAD"));
  writeFileSync(join(repo, "reviewed.txt"), "new checked work after legacy reconciliation\n");
  renewClaim(rp, legacyGit.id, { owner: "fake:legacy-recovered", phase: "checked" });
  git("add", "reviewed.txt"); git("-c", "commit.gpgsign=false", "commit", "-qm", "complete reconciled legacy review with new evidence");
  renewClaim(rp, legacyGit.id, { owner: "fake:legacy-recovered", phase: "committed" });
  assert(finish(legacyGit.id));
  console.log("✓ unclaimed Git reviews and legacy Git claims cannot bypass ownership/check/commit evidence; proper adoption, new checked work and commitment complete them");

  const unreadable = writeReview(rp, row(8)), configPath = join(repo, ".git/config"), goodConfig = readFileSync(configPath);
  writeFileSync(configPath, Buffer.concat([goodConfig, Buffer.from("\n[broken\n")]));
  assert.throws(() => claim(rp, unreadable.id, "session", { owner: "fake:probe-failure" }), /Cannot inspect Git/);
  assert.equal(claimOf(rp, unreadable.id), null); assert(existsSync(unreadable.path));
  writeFileSync(configPath, goodConfig);
  console.log("✓ an initialized Git probe failure retains the review and cannot downgrade completion to quick-review");
} finally { rmSync(repo, { recursive: true, force: true }); }
