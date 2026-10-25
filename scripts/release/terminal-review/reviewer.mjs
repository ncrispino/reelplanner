#!/usr/bin/env node
// The trial's reviewer: reviews the page open in terminal-browser as a person would, with the keyboard, through
// `terminal-browser action` (agent-browser commands on the browser already open beside Codex). It plays into each
// question and picks its recommended option, leaves one comment, opens Finish review, asks for changes (the comment's:
// a label on a diagram that fits the answers, so the agent rebuilds the video and opens the new version) and presses Send.
//
//   node reviewer.mjs [comment]
//
// Each step is a line on stdout; it exits 1 when a step does not take (a question left unanswered, no Send).
import { execFileSync } from "node:child_process";

// (its table's name, as the recommended answer to the first question has it: a comment that contradicted the answers,
// "manifest.json", was rightly asked about by one agent and done by another)
const COMMENT = process.argv[2] || "In the first step's diagram, label the manifest box with its table's name, upload_manifests.";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tb = (...args) => execFileSync("terminal-browser", args, { encoding: "utf8", timeout: 30000 });
const key = tb("ls", "--all").split("\n").map((l) => l.match(/^(\d+-\d+)\s/)?.[1]).find(Boolean);
if (!key) { console.error("✗ no terminal-browser is open"); process.exit(1); }
const act = (...args) => tb("action", "--browser", key, "--", ...args);
// the page's answer, which eval prints as JSON: a function of the player, sent as source with its arguments
const page = (fn, ...args) => JSON.parse(JSON.parse(act("eval", `JSON.stringify((${fn})(document.querySelector("reelplanner-player"), ${args.map((a) => JSON.stringify(a)).join(", ")}))`)));
const state = () => page((p) => ({ t: p.watchedT(), pending: p._pendingDecision?.id || null, decided: Object.keys(p.decisions || {}).length }));
const answeredAlready = (id) => page((p, i) => !!(p.decisions || {})[i], id);
// a control's ref in the accessibility snapshot, as a person would find it by its name
const ref = (pattern) => act("snapshot", "-i").split("\n").find((l) => pattern.test(l))?.match(/ref=(e\d+)/)?.[1];

const decisions = page((p) => (p.planMap?.decisions || []).map((d) => ({ id: d.id, at: d.at, option: ((d.options || []).find((o) => o.recommended) || d.options[0]).id })));
let failed = 0;
for (const d of decisions) {
  // the browser keeps a page's answers: one given in an earlier run counts
  let answered = answeredAlready(d.id);
  for (let attempt = 0; attempt < 3 && !answered; attempt++) {
    const before = state().decided;
    page((p, t) => { p.focus(); p.jump(t); }, Math.max(0, d.at - 4));
    await sleep(1000); act("press", "Space");
    for (let i = 0; i < 30 && state().pending !== d.id; i++) await sleep(1000);
    await sleep(1500); act("press", d.option); await sleep(2000);
    answered = state().decided > before;
  }
  console.log(answered ? `✓ answered ${d.id}: ${d.option}` : `✗ ${d.id}: not answered after 3 tries`);
  if (!answered) failed++;
}

// the page redraws as it plays, and a ref from one snapshot can be gone by the next command: find it again, then use it
let commented = false;
for (let attempt = 0; attempt < 3 && !commented; attempt++) {
  const box = ref(/textbox "(Comment at this moment|Jump in anytime)/);
  try { if (box) { act("click", `@${box}`); act("fill", `@${box}`, COMMENT); act("press", "Enter"); commented = true; } }
  catch (e) { await sleep(1000); }
}
// a ref the snapshot named can still be unknown to the next command (seen in one run, three times in a row): then the
// box itself, in the player's shadow root, is focused and typed into, and Enter pressed as a person would
if (!commented && page((p, text) => {
  const box = p.shadowRoot?.querySelector('[placeholder^="Comment at this moment"], [placeholder^="Jump in anytime"]');
  if (!box) return false;
  box.focus(); box.value = text; box.dispatchEvent(new Event("input", { bubbles: true })); return true;
}, COMMENT)) { act("press", "Enter"); await sleep(1000); commented = page((p) => (p.annotations || p.review?.annotations || []).length > 0 || /1 comment/.test(p.shadowRoot?.textContent || "")); }
console.log(commented ? "✓ commented" : "✗ no comment box to write in"); if (!commented) failed++;
await sleep(1000);

// Finish review, then Send: the page's own buttons, pressed by name in its markup (the snapshot's names change with
// the layout and with what the review holds)
const press = (name) => page((p, n) => { const b = p.$(`[data-act="${n}"]`); if (!b) return false; b.click(); return true; }, name);
if (!page((p) => !!p.$('[data-act="send-local"]'))) { press("finish"); await sleep(2000); }
const changes = page((p) => { const b = p.$('[data-review="changes"]'); if (!b) return false; b.click(); return true; });
console.log(changes ? "✓ asked for changes" : "✗ no Request changes in Finish review"); if (!changes) failed++;
await sleep(1500);
if (press("send-local")) {
  await sleep(3000);
  const sent = /StaticText "Sent\."|Sent to (your agent|the repo)/.test(act("snapshot"));   // the repo's: one set up with reel init
  console.log(sent ? "✓ sent" : "✗ Send pressed, but the page does not say sent"); if (!sent) failed++;
} else { console.log("✗ no Send button in Finish review"); failed++; }
process.exit(failed ? 1 : 0);
