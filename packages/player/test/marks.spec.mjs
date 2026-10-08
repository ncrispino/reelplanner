#!/usr/bin/env node
// Editing marks after they are drawn (the reviewer: "a select indicator on the marking … that we
// can select to delete. and an eraser too … and when we select it we should see and be able to
// edit the textbox"):
//   Select (S) — click a mark: it is highlighted, the others step back, and its words open to edit;
//     Enter or Esc keeps the edit, × drops it; Delete or the bin removes the mark, U puts it back;
//     a click on empty stage lets go.
//   Eraser (X) — click or drag across marks; one gesture is one U.
//   The record — clicking a mark's row selects it on its frame, seeking there first.
// Runs on L2 with the richer fixture map, like review-keys.spec.mjs.
// usage: node packages/player/test/marks.spec.mjs [videos/<project>] [fixture map]
import { chromium } from "playwright-core"; import { launchOpts, testPort, serverUp, ROOT, staticServer } from "../../../scripts/lib/env.mjs";
import { until, frames, seeked, settled, asked, loaded, flush } from "./wait.mjs";
const project = process.argv[2] || "videos/l2-upload-resume";
const map = process.argv[3] || "packages/player/test/fixtures/l2-richer.json";
const port = testPort(8878);
const srv = staticServer(port);
await serverUp(port, { child: srv });
const b = await chromium.launch(launchOpts());
const fails = []; const ok = (c, m) => { console.log(`${c ? "✓" : "✗"} ${m}`); if (!c) fails.push(m); };
const url = `http://127.0.0.1:${port}/packages/player/?project=${project}&map=${map}`;
const ready = (p) => p.waitForFunction(() => { const el = document.querySelector("#rp"); return el?.shadowRoot?.querySelector("hyperframes-player")?.ready && el.planMap; }, null, { timeout: 90000 });
const open = async (w = 1440, h = 1000) => {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  p.on("pageerror", (e) => fails.push("page error: " + String(e).slice(0, 160)));
  await p.goto(url);
  await p.evaluate(() => { try { localStorage.clear(); } catch {} });
  await p.reload(); await loaded(p);
  return p;
};
const seekPause = (p, t) => p.evaluate((t) => { const el = document.querySelector("#rp"); el.start(); el.player.pause(); el.player.seek(t); }, t);
// the state these checks read, in one place
const S = (p) => p.evaluate(() => {
  const el = document.querySelector("#rp"), r = el.shadowRoot, mb = r.querySelector(".markbox"), inp = mb.querySelector("[data-markword]");
  return { n: el.annotations.length, ids: el.annotations.map((a) => a.id), comments: el.annotations.map((a) => a.comment), sel: el._sel || null, tool: el.tool,
    box: !mb.hidden, mode: mb.dataset.mode || null, value: inp.value, focused: r.activeElement === inp, trash: !mb.querySelector("[data-marktrash]").hidden,
    theme: el.getAttribute("theme"), muted: r.querySelector("hyperframes-player").muted, handoff: !r.querySelector(".handoff").hidden,
    stored: JSON.parse(localStorage.getItem(`reelplanning:annotations:${el.src}`) || "[]"),
    exported: el.exportPayload().annotations.map((a) => ({ id: a.id, comment: a.comment })),
    frame: el.frameAt(el.player.currentTime)?.index, pulled: r.querySelector(".wrap").classList.contains("pulled") };
});
// the alpha of the canvas at a point in the stage (0..1 coordinates), to see the dimming
const alphaAt = (p, x, y) => p.evaluate(([x, y]) => { const c = document.querySelector("#rp").shadowRoot.querySelector("canvas.overlay"); return c.getContext("2d").getImageData(Math.round(x * c.width), Math.round(y * c.height), 1, 1).data[3]; }, [x, y]);

const p = await open();
const rp = p.locator("#rp");
const at = async (x, y) => { const st = await rp.locator(".stage").boundingBox(); return [st.x + st.width * x, st.y + st.height * y]; };
const click = async (x, y) => { const [cx, cy] = await at(x, y); await p.mouse.click(cx, cy); await flush(p); };
const drag = async (x0, y0, x1, y1) => { const [a, b0] = await at(x0, y0), [c, d] = await at(x1, y1); await p.mouse.move(a, b0); await p.mouse.down(); await p.mouse.move(c, d, { steps: 12 }); await p.mouse.up(); await flush(p); };

// two boxes on frame 4: A with words, B without
await seekPause(p, 30); await seeked(p, 30); await frames(p);
await rp.focus(); await p.keyboard.press("b");
await drag(0.2, 0.3, 0.4, 0.5); await p.keyboard.type("first words"); await p.keyboard.press("Enter"); await flush(p);
await drag(0.6, 0.2, 0.7, 0.35); await p.keyboard.press("Escape"); await flush(p);
let s = await S(p);
const [A, B] = s.ids;
ok(s.n === 2 && s.comments[0] === "first words" && s.comments[1] === "" && s.tool === "box", `two marks drawn, the first with words — ${JSON.stringify(s.comments)}`);

// ---- S, and a click on a mark selects it: its words open to edit, the others step back
const bEdge = [0.65, 0.2];   // on B's top edge
const before = await alphaAt(p, ...bEdge);
await p.keyboard.press("s"); await flush(p);
const pressed = await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('.shapes [data-tool="select"]').getAttribute("aria-pressed"));
ok(pressed === "true" && (await S(p)).tool === "select", "S picks the Select tool, and its button reads as on");
await click(0.3, 0.42);   // inside A, away from its outline: a box is hit anywhere inside it
s = await S(p);
ok(s.sel === A && s.box && s.mode === "edit" && s.value === "first words" && s.focused && s.trash, `clicking inside a mark selects it, and its box opens with its words, focused, with a bin — ${JSON.stringify({ sel: s.sel === A, box: s.box, mode: s.mode, value: s.value, focused: s.focused, trash: s.trash })}`);
const dimmed = await alphaAt(p, ...bEdge);
ok(before > 200 && dimmed < before * 0.6, `the other mark steps back while one is selected — alpha ${before} → ${dimmed}`);
const row = await p.evaluate((id) => document.querySelector("#rp").shadowRoot.querySelector(`.ann[data-selmark="${id}"]`)?.getAttribute("aria-current"), A);
ok(row === "true", "and its row in the record is marked as the selected one");

// ---- typing in the box fires no shortcut; Enter saves the edit
await p.keyboard.press("End");
await p.keyboard.type(" — zebra: make, test, undo, export, clear, select, x-ray, d");
s = await S(p);
ok(s.theme === "light" && !s.muted && !s.handoff && s.tool === "select" && s.n === 2 && s.sel === A && s.box, "typing in it (t, m, e, c, s, x, d, z, u …) fires no shortcut");
await p.keyboard.press("Backspace"); await p.keyboard.press("Backspace");
s = await S(p);
ok(s.n === 2 && s.sel === A && s.box, "and Backspace in it edits the words, it does not delete the mark");
await p.keyboard.press("Enter"); await flush(p);
s = await S(p);
const edited = "first words — zebra: make, test, undo, export, clear, select, x-ray,";
const listed = await p.evaluate((id) => document.querySelector("#rp").shadowRoot.querySelector(`textarea[data-comment="${id}"]`)?.value, A);
ok(!s.box && s.sel === A && s.comments[0] === edited && listed === edited, `Enter saves the edit, closes the box, and keeps the mark selected — "${s.comments[0]}"`);
ok(s.stored.find((a) => a.id === A)?.comment === edited && s.exported.find((a) => a.id === A)?.comment === edited, "the edit is saved in this browser and in the export");

// ---- × drops an edit and leaves the words as they were
await click(0.3, 0.42);
await p.keyboard.type(" and more"); await rp.locator("[data-markdiscard]").click(); await flush(p);
s = await S(p);
ok(!s.box && s.comments[0] === edited && s.n === 2, "× on a selected mark's box drops the edit; the words stay as they were");

// ---- Delete removes the selected mark, U puts it back where it was
await click(0.3, 0.42); await p.keyboard.press("Escape"); await flush(p);
s = await S(p);
ok(!s.box && s.sel === A, "Escape closes the box and keeps the mark selected");
await p.keyboard.press("Delete"); await flush(p);
s = await S(p);
ok(s.n === 1 && !s.ids.includes(A) && s.sel === null && !s.exported.some((a) => a.id === A) && !s.stored.some((a) => a.id === A), "Delete removes the selected mark — gone from the list, this browser and the export");
await p.keyboard.press("u"); await flush(p);
s = await S(p);
ok(s.n === 2 && s.ids[0] === A && s.comments[0] === edited && s.exported.some((a) => a.id === A), "U puts it back, in its place, words and all");

// ---- Backspace works like Delete when nothing is being typed
await click(0.65, 0.2);   // on B's outline
s = await S(p);
ok(s.sel === B && s.box && s.value === "", "clicking a box's outline selects it too (the words box is empty)");
await p.keyboard.press("Escape"); await p.keyboard.press("Backspace"); await flush(p);
s = await S(p);
ok(s.n === 1 && !s.ids.includes(B), "Backspace deletes it once the box is closed");
await p.keyboard.press("u"); await flush(p);
ok((await S(p)).ids.join() === [A, B].join(), "and U brings it back");

// ---- the bin on the box
await click(0.3, 0.42);
await rp.locator("[data-marktrash]").click(); await flush(p);
s = await S(p);
ok(s.n === 1 && !s.ids.includes(A) && !s.box && s.sel === null, "the bin on the box deletes the mark");
ok(await p.evaluate(() => { const r = document.querySelector("#rp").shadowRoot; return r.activeElement === null && document.activeElement === document.querySelector("#rp"); }), "and hands the keyboard back to the player");
await p.keyboard.press("u"); await flush(p);
ok((await S(p)).ids.join() === [A, B].join(), "U puts it back");

// ---- a click on empty stage lets go
await click(0.3, 0.42);
ok((await S(p)).sel === A, "selected again");
await click(0.5, 0.8);
s = await S(p);
const undimmed = await alphaAt(p, ...bEdge);
ok(s.sel === null && !s.box && s.comments[0] === edited && undimmed > 200, `a click on empty stage deselects, closes the box, and the other marks come back — alpha ${undimmed}`);

// ---- where two overlap, the one on top wins; a stroke is hit within about 8 px
await p.keyboard.press("d");
await drag(0.25, 0.4, 0.35, 0.4); await p.keyboard.press("Escape"); await flush(p);
const C = (await S(p)).ids.at(-1);
await p.keyboard.press("s");
const st = await rp.locator(".stage").boundingBox();
await click(0.3, 0.4 + 6 / st.height);   // 6 px off the stroke, inside box A
ok((await S(p)).sel === C, "inside a box, 6 px off a stroke drawn over it: the stroke (on top) is the one selected");
await p.keyboard.press("Escape"); await p.keyboard.press("Delete"); await flush(p);
await p.evaluate(() => { const el = document.querySelector("#rp"); el._undo = []; });   // the stroke was only for this check
ok((await S(p)).ids.join() === [A, B].join(), "(the stroke is deleted again)");

// ---- the eraser: one drag across both marks takes both; one U puts both back
await p.keyboard.press("x"); await flush(p);
ok((await S(p)).tool === "erase" && (await S(p)).sel === null, "X picks the eraser (E stays Export)");
await drag(0.15, 0.4, 0.75, 0.28);
s = await S(p);
ok(s.n === 0 && !s.exported.length && !s.stored.length, `one drag across two marks erases both — ${s.n} left`);
ok(await p.evaluate(() => document.querySelector("#rp").shadowRoot.querySelector('[data-act="clear"]').hidden), "and Clear goes, with nothing left to clear");
await p.keyboard.press("u"); await flush(p);
s = await S(p);
ok(s.ids.join() === [A, B].join() && s.comments[0] === edited, "one U puts both back, in order, words and all");
await click(0.65, 0.2);
s = await S(p);
ok(s.ids.join() === A, "a click with the eraser takes just the mark under it");
await p.keyboard.press("u"); await flush(p);
await click(0.9, 0.1);
ok((await S(p)).n === 2, "a click on empty stage erases nothing");
ok((await p.evaluate(() => (document.querySelector("#rp")._undo || []).length)) === 0, "and leaves nothing to undo");

// ---- Clear still clears, and U still restores it
await rp.locator('[data-act="clear"]').click(); await flush(p);
ok((await S(p)).n === 0, "Clear still removes every mark");
await p.keyboard.press("u"); await flush(p);
ok((await S(p)).ids.join() === [A, B].join(), "and U still puts them back");

// ---- the record: clicking a mark's row selects it on its frame, seeking there first
await p.keyboard.press("Escape"); await p.keyboard.press("Escape"); await flush(p);
ok((await S(p)).tool === null, "Escape puts the tool down");
await seekPause(p, 45); await seeked(p, 45); await frames(p);
const fA = await p.evaluate((id) => document.querySelector("#rp").annotations.find((a) => a.id === id).frame.index, A);
ok((await S(p)).frame !== fA, `on another frame now (${(await S(p)).frame}, the marks are on ${fA})`);
await rp.locator(".grab").click(); await until(p, () => document.querySelector("#rp").shadowRoot.querySelector(".wrap").classList.contains("pulled")); await frames(p);
await rp.locator(`.ann[data-selmark="${A}"] .hd .t`).click();
await until(p, (id) => { const el = document.querySelector("#rp"), r = el.shadowRoot; return el._sel === id && !r.querySelector(".markbox").hidden && !r.querySelector(".wrap").classList.contains("pulled"); }, A); await flush(p);
s = await S(p);
ok(s.frame === fA && s.sel === A && s.tool === "select" && s.box && s.value === edited && s.focused && !s.pulled, `clicking the row seeks to the mark's frame, selects it and opens its words; the record steps aside — ${JSON.stringify({ frame: s.frame, sel: s.sel === A, tool: s.tool, box: s.box, pulled: s.pulled })}`);
await p.keyboard.press("Escape"); await p.keyboard.press("Escape"); await flush(p);
s = await S(p);
ok(s.sel === null && s.tool === "select", "one Escape closes the box, the next lets go of the mark, and the tool stays");

// ---- while a question is open, S and X are not tools either
await p.evaluate(() => { const el = document.querySelector("#rp"); el.setTool(null); el.askDecision(el.planMap.decisions[0]); });
await asked(p, "q1"); await settled(p); await rp.focus();
await p.keyboard.press("s"); await p.keyboard.press("x"); await flush(p);
ok(await p.evaluate(() => { const el = document.querySelector("#rp"); return el.tool === null && !el.decisions.q1 && el.shadowRoot.querySelector(".decision").classList.contains("on"); }), "with a question open, S and X start no tool and answer nothing");
await p.keyboard.press("a"); await until(p, () => !!document.querySelector("#rp").decisions.q1);
ok(await p.evaluate(() => document.querySelector("#rp").decisions.q1?.option === "a"), "and A still answers it");

// ---- it all survives a reload
await p.reload(); await ready(p);
s = await S(p);
ok(s.ids.join() === [A, B].join() && s.comments[0] === edited, "the marks and the edited words survive a reload");

ok(!fails.some((f) => /^page error/.test(f)), "no page errors");
await p.close();
console.log(fails.length ? `\n${fails.length} failing` : "\nall checks pass");
await b.close(); srv.kill(); process.exit(fails.length ? 1 : 0);
