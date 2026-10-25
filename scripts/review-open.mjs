#!/usr/bin/env node
// Open an existing local reelplanner review in terminal-browser.
// usage: reelplanner review-open http://127.0.0.1:<port>/?project=<video>
//
// This is the narrow command authorized by review-setup --codex-allow-open.
// It checks a running review server, opens one pane and tells that server which (so the pane
// closes after Send), and never starts a server, writes reviews, runs an agent, controls the
// page, or falls back to another browser.
import { findExecutable, localReviewUrl } from "./lib/review-preferences.mjs";
import { openReview } from "./lib/presentation.mjs";
import { checkReviewServer } from "./lib/review-health.mjs";
import { registerPane } from "./lib/review-pane.mjs";

try {
  const args = process.argv.slice(2);
  if (args.length !== 1) throw new Error("Expected exactly one local review URL (review-open --help)");
  const url = localReviewUrl(args[0]);
  // This explicit terminal-only command must survive agent shells that drop
  // REELPLANNER_HOME. Preferences select review's default, not this command's
  // destination. Resolve the installed CLI without reading project settings.
  const terminalBrowser = findExecutable("terminal-browser");
  if (!terminalBrowser) throw new Error("terminal-browser is not installed on this shell's PATH");
  await checkReviewServer(url);
  const result = await openReview({ url: url.href, workspace: "terminal-browser", terminalBrowser });
  if (result.status !== "opened") throw new Error(result.reason);
  console.log(`✓ terminal-browser accepted the review URL${result.beside ? ` beside the Codex window on ${result.beside}` : ""} (playback and pane visibility still need checking)`);
  // the server closes this split after Send; without it, the split stays open
  if (result.pane) await registerPane(url.href, result.pane).then(() => console.log("· it closes after Send; open the new version the same way once it is built"),
    (e) => console.log(`△ ${e.message}: the split stays open after Send`));
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exitCode = 1;
}
