#!/usr/bin/env node
// Finishing a review is a verdict, not a button called Approve. A review with comments in it asks for
// changes; one without approves. Finish offers the one that fits first, lets the reviewer switch, and
// what is sent (or downloaded) says which — and so does the review `reel record` files.
// usage: node packages/player/test/finish.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, mkdtempSync, rmSync, readdirSync } from "node:fs"; import { join } from "node:path"; import { tmpdir } from "node:os";
import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const port = testPort(8873);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const open = async (proj = project) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 140)));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${proj}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el._mapTried && el.stage?.dataset.ready; }, null, { timeout: 90000 });
  await frames(p);
  return p;
};
const state = (p) => p.evaluate(() => { const el = document.querySelector("#rp"), r = el.shadowRoot, h = r.querySelector(".handoff");
  return { btn: r.querySelector('[data-act="finish"]')?.textContent, open: !h.hidden, title: h.querySelector("h5")?.textContent, lede: h.querySelector(".lede")?.textContent || "",
    pressed: [...h.querySelectorAll("[data-review]")].filter((x) => x.getAttribute("aria-pressed") === "true").map((x) => x.dataset.review),
    verdict: el.exportPayload().verdict, approves: el.annotations.filter((a) => a.kind === "approve").length }; });
const comment = async (p, text) => { const box = p.locator("#rp").locator(".composer textarea"); await box.click(); await p.keyboard.type(text); await p.locator("#rp").locator('[data-act="post"]').click(); await until(p, (text) => document.querySelector("#rp").annotations.some((a) => a.comment === text), text); };
// the Finish panel open, or a verdict pressed on it
const handoff = async (p) => { await until(p, () => !document.querySelector("#rp").shadowRoot.querySelector(".handoff").hidden); await frames(p); };
const pressed = async (p, v) => { await until(p, (v) => document.querySelector("#rp").shadowRoot.querySelector(`.handoff [data-review="${v}"]`)?.getAttribute("aria-pressed") === "true", v); await frames(p); };

// 1. nothing said: Finish offers Approve
let p = await open();
let s = await state(p);
ok(s.btn === "Finish review" && !s.open, `the button says what it does — "${s.btn}", and nothing is open yet`);
await p.locator("#rp").locator('[data-act="finish"]').click(); await handoff(p);
s = await state(p);
ok(s.open && s.title === "Finish your review", `Finish opens the panel — "${s.title}"`);
ok(s.pressed.join() === "approve" && s.verdict === "approve" && s.approves === 1, "with nothing said, it offers Approve, and the review says approve");
ok(!/just saved/.test(s.lede), "and it does not claim a file was downloaded when none was");
await p.close();

// 2. a comment first: Finish offers Request changes; switching is one click either way
p = await open();
await comment(p, "Step 2 should batch the writes");
await p.locator("#rp").locator('[data-act="finish"]').click(); await handoff(p);
s = await state(p);
ok(s.pressed.join() === "changes" && s.verdict === "changes" && s.approves === 0, "with a comment in it, Finish offers Request changes — not an approval");
ok(/1 comment/.test(s.lede) || /1 comment/.test(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector(".handoff .verdict").textContent)), "and says what goes with it");
// what each verdict does with the comments, in a few words: approved, they go into the plan's steps and
// no new video is made; changes requested, the steps are rewritten and rewatched
const says = (p) => p.evaluate(() => Object.fromEntries([...document.querySelector("#rp").shadowRoot.querySelectorAll(".handoff [data-review]")].map((x) => [x.dataset.review, x.querySelector("span").textContent])));
let t = await says(p);
ok(t.approve === "The plan goes ahead; your 1 comment goes into its steps. No new video.", `Approve says the comments go into the plan with no new video — "${t.approve}"`);
ok(/rewatch just those/.test(t.changes), `Request changes says you rewatch what changed — "${t.changes}"`);
await p.locator("#rp").locator('[data-review="approve"]').click(); await pressed(p, "approve");
s = await state(p);
ok(s.pressed.join() === "approve" && s.verdict === "approve" && s.approves === 1, "switching to Approve is one click, and approves exactly once");
await p.locator("#rp").locator('[data-review="changes"]').click(); await pressed(p, "changes");
s = await state(p);
ok(s.verdict === "changes" && s.approves === 0, "and back: the approval is withdrawn, not left behind");
await p.reload(); await p.waitForFunction(() => document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player")?.ready, null, { timeout: 90000 });
ok((await p.evaluate(() => document.querySelector("#rp").exportPayload().verdict)) === "changes", "the verdict survives a reload");

// 2b. a walkthrough: accepted with comments, the agent fixes them and makes no new video; changes, you rewatch the beats
{
  const w = await open("videos/w1-upload-resume");
  await comment(w, "name the retry cost");
  await w.locator("#rp").locator('[data-act="finish"]').click(); await handoff(w);
  const tw = await says(w);
  ok(/^The agent fixes what your 1 comment asks\. No new video\.$/.test(tw.approve) && /^The agent fixes what your 1 comment asks, and you rewatch just those scenes\.$/.test(tw.changes), `a walkthrough's verdicts say it — "${tw.approve}" / "${tw.changes}"`);
  await w.close();
}

// 3. what `reel record` files says it: the review kept in reviews/, and its what-to-act-on file
const review = await p.evaluate(() => document.querySelector("#rp").exportPayload());
await p.close();
const tmp = mkdtempSync(join(tmpdir(), "finish-"));
try {
  const reel = (...a) => execFileSync("node", [join(ROOT, "scripts/reel.mjs"), ...a], { stdio: "ignore" });
  writeFileSync(join(tmp, "plan.md"), readFileSync(join(ROOT, "eval/plans/upload-resume/plan.md"), "utf8"));
  writeFileSync(join(tmp, "annotations.json"), JSON.stringify(review));
  reel("init", tmp, "--name", "finish", "--kind", "greenfield");
  reel("new-plan", tmp, "upload-resume", "--plan", join(tmp, "plan.md"), "--date", "2026-01-01");
  const pd = join(tmp, ".reelplanner/plans/2026-01-01-upload-resume");
  reel("record", pd, join(tmp, "annotations.json"));
  const mds = readdirSync(join(pd, "reviews")).filter((f) => f.endsWith(".md"));
  const act = mds.length === 1 ? readFileSync(join(pd, "reviews", mds[0]), "utf8") : "";
  ok(/^# Plan review · .* · changes requested$/m.test(act), "what to act on says changes were requested, not \"not finished\"");
} finally { rmSync(tmp, { recursive: true, force: true }); }

console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
