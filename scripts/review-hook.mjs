#!/usr/bin/env node
// Claude Code's Stop hook for the review pages a session opened (the plan-to-video skill declares it in its
// frontmatter, so it runs once the skill is loaded, for the rest of that session).
// usage: reelplanner review-hook stop        (Claude Code's Stop input, as JSON, on stdin)
//
// Claude Code has no queue a review server can reach, so the reviewer's Send reaches a session only through the
// `review --wait` it keeps running as a background task. A session that ended its turn without one left the review
// saved, the split open and the reviewer waiting for an answer that never came (2026-10-27). `review --detach` run
// from Claude Code notes the page (scripts/lib/inbox.mjs); while that page's server runs and no `review --wait` of this
// session waits on it, this asks the session to start one. It answers as guidance (additionalContext, not an error),
// not when Claude Code is already continuing for a stop hook (stop_hook_active: once per stop, never a loop), and says
// nothing on anything it cannot read: a hook never stops a session.
import { pagesUnwaited } from "./lib/inbox.mjs";

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log("usage: reelplanner review-hook stop   (Claude Code's Stop hook: Stop input as JSON on stdin)");
  process.exit(0);
}
if (args[0] !== "stop") { console.error("✗ usage: reelplanner review-hook stop"); process.exit(1); }

try {
  let text = ""; for await (const chunk of process.stdin) text += chunk;
  const input = JSON.parse(text || "{}");
  const session = typeof input.session_id === "string" && /^[A-Za-z0-9._-]+$/.test(input.session_id) ? `claude:${input.session_id}` : null;
  // a waiter started this turn may not have written its first heartbeat yet: one running in the background counts
  const waiting = (input.background_tasks || []).some((t) => t?.type === "shell" && t.status === "running" && /\b(review|inbox) --wait\b/.test(String(t.command || "")));
  const pages = session && !input.stop_hook_active && !waiting ? pagesUnwaited(session) : [];
  if (pages.length) {
    const wait = pages[0].wait || "reelplanner review --wait";
    process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "Stop", additionalContext:
      `reelplanner: nothing in this session is waiting on the review page you opened (${pages.map((p) => p.url).join(", ")}), so the ` +
      "reviewer's Send would only be saved, and you would not hear of it. " +
      `Start \`${wait}\` now as a background task (run_in_background), then end your turn. When they send, it prints ` +
      "the review's path and exits: handle it as the plan-to-video skill's Running the loop says. If it cannot run here, " +
      "ask the person to tell you when they have sent it." } }) + "\n");
  }
} catch { /* a hook never stops a session: say nothing */ }
process.exit(0);
