#!/usr/bin/env node
// Open an existing local reelplanner review in terminal-browser.
// usage: reelplanner review-open http://127.0.0.1:<port>/?project=<video>
//
// This is the narrow command authorized by review-setup --codex-allow-open.
// It checks a running review server, opens one pane, and never starts a server,
// writes reviews, runs an agent, controls the page, or falls back to another browser.
import { readReviewPreferences, localReviewUrl } from "./lib/review-preferences.mjs";
import { openReview } from "./lib/presentation.mjs";
import { isAbsolute } from "node:path";

try {
  const args = process.argv.slice(2);
  if (args.length !== 1) throw new Error("Expected exactly one local review URL (review-open --help)");
  const url = localReviewUrl(args[0]);
  const preferences = readReviewPreferences();
  if (preferences.workspace !== "terminal-browser" || typeof preferences.terminalBrowser !== "string" || !isAbsolute(preferences.terminalBrowser)) {
    throw new Error("Terminal review is not configured; run reelplanner review-setup --workspace terminal-browser");
  }
  const response = await fetch(new URL("/api/review", url), { redirect: "error", signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error("Local review server is not ready");
  const status = await response.json();
  if (status.ok !== true || typeof status.inbox !== "number" || !["repo", "machine"].includes(status.where)) {
    throw new Error("This URL does not report a reelplanner review inbox");
  }
  const result = await openReview({ url: url.href, workspace: "terminal-browser", terminalBrowser: preferences.terminalBrowser });
  if (result.status !== "opened") throw new Error(result.reason);
  console.log("✓ terminal-browser accepted the review URL (playback and pane visibility still need checking)");
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exitCode = 1;
}
