#!/usr/bin/env node
// An explainer's Finish (explain-first step 3): three ends instead of Approve and Request changes. Done is offered
// first; Explain more and Plan this are one click; the panel says nothing goes into the decision log; your words on
// what you want next go with the review; and the review row names its kind, so the server files it in the
// explainer's folder. The video is a plan video whose map is read as an explainer's (its kind), since the player
// decides by the map alone.
// usage: node packages/player/test/explainer-finish.spec.mjs [videos/<project>]
import { chromium } from "playwright-core"; import { launchOpts, testPort, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const port = testPort(8879);
const srv = staticServer(port);
// up when it answers, not after a fixed wait
for (let i = 0; i < 300; i++) { try { await fetch(`http://127.0.0.1:${port}/`); break; } catch { await new Promise((r) => setTimeout(r, 100)); } }
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
try {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 140)));
  await p.goto(`http://127.0.0.1:${port}/packages/player/?project=${project}`);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} }); await p.reload();
  await p.waitForFunction(() => document.querySelector("#rp")?.shadowRoot?.querySelector("hyperframes-player")?.ready && document.querySelector("#rp").planMap, null, { timeout: 90000 });
  // read as an explainer: its kind, and no questions to decide
  await p.evaluate(() => { const el = document.querySelector("#rp"); el.planMap.kind = "explainer"; el.planMap.decisions = []; el.planMap.planDir = ".reelplanner/explainers/2026-09-29-review-server"; el.updateStatus(); });   // drawn again, as a page whose map said so from the start
  const state = () => p.evaluate(() => { const el = document.querySelector("#rp"), h = el.shadowRoot.querySelector(".handoff");
    return { open: !h.hidden, ends: [...h.querySelectorAll("[data-review]")].map((x) => `${x.dataset.review}:${x.querySelector("b").textContent}`), pressed: [...h.querySelectorAll("[data-review]")].filter((x) => x.getAttribute("aria-pressed") === "true").map((x) => x.dataset.review),
      verdict: el.exportPayload().verdict, approves: el.annotations.filter((a) => a.kind === "approve").length, text: h.textContent, oq: h.querySelector("label[for=rp-openq]")?.textContent || "", title: el.shadowRoot.querySelector('[data-act="finish"]').title }; });
  ok((await p.evaluate(() => { const el = document.querySelector("#rp"); return el.isExplainer && !el.isWalkthrough && !el.isSystem; })), "a map of kind explainer is read as an explainer, not a walkthrough or the system video");
  // the title is set when the status line is next drawn: wait for that, not a fixed time
  await until(p, () => /Plan this/.test(document.querySelector("#rp").shadowRoot.querySelector('[data-act="finish"]').title));
  ok(/Done, Explain more, or Plan this/.test((await state()).title), "Finish's own title says the three ends");
  await p.locator("#rp").locator('[data-act="finish"]').click(); await p.waitForTimeout(300);
  let s = await state();
  ok(s.open && s.ends.join() === "done:Done,more:Explain more,plan:Plan this", `three ends instead of Approve and Request changes — ${s.ends.join(", ")}`);
  ok(s.pressed.join() === "done" && s.verdict === "done" && s.approves === 0, "Done is offered first, and nothing approves anything");
  ok(/Nothing goes into the decision log/.test(s.text), "the panel says nothing goes into the decision log");
  ok(/What do you want next\?/.test(s.oq), `it asks what you want next — "${s.oq}"`);
  await p.locator("#rp").locator('[data-review="plan"]').click(); await p.waitForTimeout(200);
  s = await state();
  ok(s.pressed.join() === "plan" && s.verdict === "plan", "Plan this is one click, and the review says plan");
  await p.locator("#rp").locator("[data-openq]").fill("make a waiting review easy to see"); await p.locator("#rp").locator("[data-openq]").dispatchEvent("change"); await p.waitForTimeout(200);
  const row = await p.evaluate(() => { const el = document.querySelector("#rp"); return el.reviewRow(el.exportPayload()); });
  ok(row.review.kind === "explainer" && row.review.end === "plan", "the review itself says its kind and its end");
  ok(row.kind === "explainer" && row.planDir === ".reelplanner/explainers/2026-09-29-review-server" && row.verdict === "plan", "the row names its kind and the explainer's folder, for the server to file it there");
  ok(row.review.annotations.some((a) => a.open && a.comment === "make a waiting review easy to see"), "your words on what you want next go with the review");
  // Ask about this answers from the explainer's sources, not a plan (step 3)
  const prompt = await p.evaluate(() => { const el = document.querySelector("#rp"); el.planMap.explainer = { question: "explain the review server", commit: "dee5830", sources: [{ id: "scripts/review.mjs", shape: "files", lines: 376 }] }; el.planMap.frames[1].source = "scripts/review.mjs:200-230"; return el.askPrompt({ question: "why one run?", t: el.planMap.frames[1].start + 0.5, frame: { index: el.planMap.frames[1].index } }); });
  ok(/## The explainer's sources/.test(prompt) && /This scene's sources: scripts\/review\.mjs:200-230/.test(prompt) && /- scripts\/review\.mjs \(files, 376 lines\)/.test(prompt) && /From: <the source, "<its id>"/.test(prompt) && !/## The plan/.test(prompt), "Ask about this is answered from the explainer's sources and the scene's, not a plan");
  await p.locator("#rp").locator('[data-review="more"]').click(); await p.waitForTimeout(200);
  ok((await state()).verdict === "more", "and Explain more is one click too");

  // What Explain more and Plan this would mean for this video (after the walkthrough review): not templates. The map's
  // own suggestions (made at build time from its scenes, long sources and explain.md), refined by what the viewer did.
  await p.evaluate(() => { const el = document.querySelector("#rp"), m = el.planMap, f = m.frames;
    el.setOpenWords(""); el.setVerdict("done");
    m.explainer = { ...m.explainer, commit: "dee5830abc", since: 3, sinceSubjects: ["inbox: a claim expires", "review: Send twice"],
      next: { more: [{ id: "m1", text: "Go deeper on how the inbox dedupes", why: `scene ${f[1].index}, "${f[1].title}"`, scene: f[1].index }, { id: "m2", text: "Explain what it left out: the retry backoff", why: "explain.md, what it leaves out" }],
        plan: [{ id: "p1", text: "A plan to make the sweeper run on a timer", why: "explain.md, open threads" }] } };
    // the viewer: went back to scene 2, commented on scene 3 asking for something, and asked a question the page could not answer
    el.moments.push({ kind: "rewind", t: f[1].start + 1, from: f[1].start + 9, planStep: f[1].planStep, frameIndex: f[1].index });
    el.add({ kind: "note", comment: "it should retry a failed upload once", t: f[2].start + 0.5 });
    el.questions = [{ question: "why does a second Send not start a second run?", frame: { index: f[0].index }, t: f[0].start + 0.5 }];
    el.showHandoff({ finishing: true }); });
  await p.waitForTimeout(200);
  const nx = () => p.evaluate(() => { const el = document.querySelector("#rp"), h = el.shadowRoot.querySelector(".handoff");
    return { cards: Object.fromEntries([...h.querySelectorAll("[data-review]")].map((x) => [x.dataset.review, x.querySelector("span").textContent])), list: [...h.querySelectorAll("[data-next]")].map((x) => ({ id: x.dataset.next, text: [...x.childNodes].filter((c) => c.nodeName !== "SPAN").map((c) => c.textContent).join(""), pressed: x.getAttribute("aria-pressed") === "true" })),
      box: h.querySelector("[data-openq]")?.value ?? null, next: el.exportPayload().next, verdict: el.verdict }; });
  let n = await nx();
  ok(n.verdict === "done" && !n.list.length, "Done stays first, and offers nothing to pick");
  ok(/^For instance, answer "why does a second Send not start a second run\?" in a scene of its own\./.test(n.cards.more), `Explain more's card says what it would mean for this video, not a template — "${n.cards.more}"`);
  ok(/^For instance, a plan to retry a failed upload once\./.test(n.cards.plan), `Plan this's card too, from your comment — "${n.cards.plan}"`);
  await p.locator("#rp").locator('[data-review="more"]').click(); await p.waitForTimeout(200);
  n = await nx();
  const texts = n.list.map((x) => x.text);
  ok(texts.includes("Go deeper on how the inbox dedupes, the part you rewound"), `a build-time suggestion on the scene you rewound says so — ${JSON.stringify(texts)}`);
  ok(texts.indexOf("Go deeper on how the inbox dedupes, the part you rewound") < texts.indexOf("Explain what it left out: the retry backoff"), "and comes before one on no scene you went back to");
  ok(texts.includes("Explain the 3 commits since dee5830"), "the commits since the explainer's commit are one");
  ok(texts.length <= 5 && texts.some((t) => /where you commented "it should retry a failed upload once"/.test(t)), "the scene you commented on is one, in your words; five at most");
  await p.locator("#rp").locator('[data-next="m1"]').click(); await p.waitForTimeout(200);
  n = await nx();
  ok(n.box === "Go deeper on how the inbox dedupes, the part you rewound" && n.list.find((x) => x.id === "m1")?.pressed, "picking one fills What do you want next?, to edit");
  ok(n.next?.end === "more" && n.next.pick?.id === "m1" && n.next.pick.scene != null && n.next.edited === false, `the review carries the pick, unedited — ${JSON.stringify(n.next)}`);
  // switching end drops a pick you did not change, and its words
  await p.locator("#rp").locator('[data-review="plan"]').click(); await p.waitForTimeout(200);
  n = await nx();
  ok(n.box === "" && n.next?.pick === null && n.list[0]?.text === "A plan to retry a failed upload once", `Plan this drops that pick, and leads with the plan your comment asks for — ${JSON.stringify(n.list.map((x) => x.text))}`);
  ok(n.list.some((x) => x.text === "A plan to make the sweeper run on a timer"), "and offers the explainer's own open thread");
  await p.locator("#rp").locator('[data-next="p1"]').click(); await p.waitForTimeout(200);
  await p.locator("#rp").locator("[data-openq]").fill("A plan to make the sweeper run on a timer, every five minutes"); await p.locator("#rp").locator("[data-openq]").dispatchEvent("change"); await p.waitForTimeout(200);
  n = await nx();
  ok(n.next?.pick?.id === "p1" && n.next.edited === true && n.next.words === "A plan to make the sweeper run on a timer, every five minutes", `an edited pick is kept with your words — ${JSON.stringify(n.next)}`);
  const row2 = await p.evaluate(() => { const el = document.querySelector("#rp"); return el.reviewRow(el.exportPayload()); });
  ok(row2.review.next?.pick?.text === "A plan to make the sweeper run on a timer" && row2.review.annotations.some((a) => a.open && /every five minutes/.test(a.comment)), "the row sent to the server carries the pick and your words");
  // your own words, no pick
  await p.locator("#rp").locator('[data-next="p1"]').click(); await p.waitForTimeout(200);
  await p.locator("#rp").locator("[data-openq]").fill("split the inbox from the review server"); await p.locator("#rp").locator("[data-openq]").dispatchEvent("change"); await p.waitForTimeout(200);
  n = await nx();
  ok(n.next?.pick === null && n.next.words === "split the inbox from the review server", "or your own words, with no pick");
  await p.close();
} finally { await b.close(); srv.kill(); }
console.log(fails.length ? `\n✗ ${fails.length} failed` : "\n✓ all passed");
process.exit(fails.length ? 1 : 0);
