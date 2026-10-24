#!/usr/bin/env node
// The trial's reviewer: reviews the page open in terminal-browser as a person would, with the keyboard, through
// `terminal-browser action` (agent-browser commands on the browser already open beside Codex). It plays into each
// question and picks its recommended option, leaves one comment, opens Finish review and presses Send.
//
//   node reviewer.mjs [comment]
//
// Each step is a line on stdout; it exits 1 when a step does not take (a question left unanswered, no Send).
import { execFileSync } from "node:child_process";

const COMMENT = process.argv[2] || "Add a step that tells support how to find a stuck upload by its manifest id.";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tb = (...args) => execFileSync("terminal-browser", args, { encoding: "utf8", timeout: 30000 });
const key = tb("ls", "--all").split("\n").map((l) => l.match(/^(\d+-\d+)\s/)?.[1]).find(Boolean);
if (!key) { console.error("✗ no terminal-browser is open"); process.exit(1); }
const act = (...args) => tb("action", "--browser", key, "--", ...args);
// the page's answer, which eval prints as JSON: a function of the player, sent as source with its arguments
const page = (fn, ...args) => JSON.parse(JSON.parse(act("eval", `JSON.stringify((${fn})(document.querySelector("reelplanner-player"), ${args.map((a) => JSON.stringify(a)).join(", ")}))`)));
const state = () => page((p) => ({ t: p.watchedT(), pending: p._pendingDecision?.id || null, decided: Object.keys(p.decisions || {}).length }));
// a control's ref in the accessibility snapshot, as a person would find it by its name
const ref = (pattern) => act("snapshot", "-i").split("\n").find((l) => pattern.test(l))?.match(/ref=(e\d+)/)?.[1];

const decisions = page((p) => (p.planMap?.decisions || []).map((d) => ({ id: d.id, at: d.at, option: ((d.options || []).find((o) => o.recommended) || d.options[0]).id })));
let failed = 0;
for (const d of decisions) {
  let answered = false;
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

const box = ref(/textbox "(Comment at this moment|Jump in anytime)/);
if (box) { act("click", `@${box}`); act("fill", `@${box}`, COMMENT); act("press", "Enter"); console.log("✓ commented"); }
else { console.log("✗ no comment box"); failed++; }
await sleep(1000);

// Finish review, then Send: the page's own buttons, pressed by name in its markup (the snapshot's names change with
// the layout and with what the review holds)
const press = (name) => page((p, n) => { const b = p.$(`[data-act="${n}"]`); if (!b) return false; b.click(); return true; }, name);
if (!page((p) => !!p.$('[data-act="send-local"]'))) { press("finish"); await sleep(2000); }
if (press("send-local")) {
  await sleep(3000);
  const sent = /StaticText "Sent\."|Sent to your agent/.test(act("snapshot"));
  console.log(sent ? "✓ sent" : "✗ Send pressed, but the page does not say sent"); if (!sent) failed++;
} else { console.log("✗ no Send button in Finish review"); failed++; }
process.exit(failed ? 1 : 0);
