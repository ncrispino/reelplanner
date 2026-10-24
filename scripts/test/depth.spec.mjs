#!/usr/bin/env node
// A video's depth (lib/depth.mjs, #34): `depth: low | medium | high` in its BRIEF.md sets how long it may run, how
// many scenes it takes, what takes it past them, and who looks at it with fresh eyes. On scratch folders, no build:
//   - no depth line reads as high (a video made before depths); one that is none of the three, as high with a △
//   - the length stage: low holds a plan video to about two minutes and 8 scenes, whatever BRIEF.md says; medium to
//     its kind's budget and 15 scenes, past them only on the person's words quoted; high as before, any reason
//   - fresh eyes: high, the newcomer and the designer (and the checker for an explainer with a long source), two
//     rounds; medium, the newcomer (and the checker, who alone has a second round); low, the checker alone, or no one
//   - `fresh-eyes` on a low plan video starts no round and writes nothing, its --script neither; verify's check of it
//     is done
// usage: node scripts/test/depth.spec.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { depthOf, depthProblem } from "../lib/depth.mjs";
import { scriptLength, scriptLengthLine, videoLength, lengthLine } from "../lib/length.mjs";
import { rolesFor, roundsFor, freshEyesState } from "../lib/fresh-eyes.mjs";

const tmp = mkdtempSync(join(tmpdir(), "rp-depth-spec-"));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const brief = (depth, more = "") => `---\nworkflow: faceless-explainer\n${depth ? `depth: ${depth}\n` : ""}---\n\n## Customizations\n\n${more}`;
// a plan video of n scenes, each line `words` long (62 words: 20 s at the voice's 3.1 words a second)
let k = 0;
const video = ({ depth = null, scenes = 6, words = 62, length = "", kind = "", sub = "plan" } = {}) => {
  const d = join(tmp, `${sub}-${++k}`, "video"); mkdirSync(d, { recursive: true });
  writeFileSync(join(d, "BRIEF.md"), brief(depth, length ? `- Length: ${length}\n` : ""));
  writeFileSync(join(d, "STORYBOARD.md"), `---\ntitle: t\n${kind ? `kind: ${kind}\n` : ""}---\n\n` + Array.from({ length: scenes }, (_, i) => `## Frame ${i + 1}\n\n${i ? "" : "- chapter_start: All of it\n"}- voiceover: "x"\n- duration: ${words / 3.1}s\n`).join("\n"));
  writeFileSync(join(d, "SCRIPT.md"), "# SCRIPT\n\n" + Array.from({ length: scenes }, (_, i) => `## Line ${i + 1} — x (Frame ${i + 1})\n\n    ${Array(words).fill("word").join(" ")}\n`).join("\n"));
  return d;
};
const explainer = (depth, guide) => { const d = video({ depth, kind: "explainer", sub: "ex" }); writeFileSync(join(d, "..", "sources.json"), JSON.stringify({ sources: [{ id: "notes.md", guide }] })); return d; };
const roles = (d, round) => Object.keys(rolesFor(d, round)).join() || "none";

try {
  // ---- reading it ----
  ok("depth: a brief with no depth line reads as high (a video made before depths), and says nothing of it", depthOf(video()) === "high" && depthProblem(video()) === null);
  ok("depth: low, medium and high are read as written", ["low", "medium", "high"].every((x) => depthOf(video({ depth: x })) === x));
  const odd = video({ depth: "deep" });
  ok("depth: one that is none of the three reads as high, and says so", depthOf(odd) === "high" && /depth: deep is not low, medium or high: read as high/.test(depthProblem(odd) || ""), depthProblem(odd));

  // ---- the length stage, before the voice ----
  const lowOk = scriptLength(video({ depth: "low", scenes: 6 }));
  ok("length, low: 6 lines (2:00) is in its budget, said with the depth", !lowOk.stop && /^about 2:00 from the script \(a plan video at low depth: aim 1–2 min, at most 8 scenes\)$/.test(scriptLengthLine(lowOk)), scriptLengthLine(lowOk));
  const lowLong = scriptLength(video({ depth: "low", scenes: 8, words: 120 }));
  ok("length, low: past 3 minutes it stops, and says a longer video is a deeper one", lowLong.stop && /past 1\.5× a plan video's 2 min at low depth \(3:00\)/.test(scriptLengthLine(lowLong)) && /make it a medium- or high-depth video/.test(scriptLengthLine(lowLong)), scriptLengthLine(lowLong));
  const lowWhy = scriptLength(video({ depth: "low", scenes: 8, words: 120, length: "the person said \"cover all of it\"" }));
  ok("…and a - Length: line does not take it past, even quoting the person", lowWhy.stop, scriptLengthLine(lowWhy));
  const lowMany = scriptLength(video({ depth: "low", scenes: 9, words: 10 }));
  ok("length, low: a 9th scene stops it, however short", lowMany.stop && /9 scenes, past the 8 scenes of low depth/.test(scriptLengthLine(lowMany)), scriptLengthLine(lowMany));
  const medLong = scriptLength(video({ depth: "medium", scenes: 15, words: 136, length: "three systems compared side by side" }));
  ok("length, medium: past 7:30 it stops, a - Length: line that quotes no one notwithstanding", medLong.stop && /quote the person asking for more in BRIEF\.md/.test(scriptLengthLine(medLong)) && /its - Length: line quotes no one/.test(scriptLengthLine(medLong)), scriptLengthLine(medLong));
  const medAsked = scriptLength(video({ depth: "medium", scenes: 15, words: 136, length: "they asked: \"show all three systems side by side\"" }));
  ok("…and goes on when it quotes the person", !medAsked.stop && /BRIEF\.md says why: they asked/.test(scriptLengthLine(medAsked)), scriptLengthLine(medAsked));
  const medMany = scriptLength(video({ depth: "medium", scenes: 16, words: 10 }));
  ok("length, medium: a 16th scene stops it", medMany.stop && /16 scenes, past the 15 scenes of medium depth/.test(scriptLengthLine(medMany)), scriptLengthLine(medMany));
  const highMany = scriptLength(video({ scenes: 26, words: 10 })), highWhy = scriptLength(video({ scenes: 15, words: 136, length: "three systems compared side by side" }));
  ok("length, high: no cap on scenes, and any - Length: line takes it past, as before depths", !highMany.stop && !highWhy.stop && /^about [\d:]+ from the script \(a plan video: aim 3–5 min\)$/.test(scriptLengthLine(highMany)), `${scriptLengthLine(highMany)}\n${scriptLengthLine(highWhy)}`);
  const watched = videoLength(video({ depth: "low", scenes: 12 }));
  ok("length, watched: a low video is judged against its 1–2 minutes", watched.verdict === "long" && /long for a plan video \(aim 1–2 min; past 3 is long\)/.test(lengthLine(watched)), lengthLine(watched));

  // ---- fresh eyes: who looks, and how often ----
  const hp = video(), mp = video({ depth: "medium" }), lp = video({ depth: "low" });
  ok("fresh eyes, high: the newcomer and the designer, two rounds", roles(hp) === "newcomer,designer" && roundsFor(hp) === 2, `${roles(hp)} ${roundsFor(hp)}`);
  ok("fresh eyes, medium: the newcomer alone, one round", roles(mp, 1) === "newcomer" && roundsFor(mp) === 1 && roles(mp, 2) === "none", `${roles(mp, 1)} ${roundsFor(mp)}`);
  ok("fresh eyes, low: no one", roles(lp) === "none" && roundsFor(lp) === 1);
  const he = explainer("high", true), me = explainer("medium", true), le = explainer("low", true), ls = explainer("low", false);
  ok("fresh eyes, high explainer with a long source: the newcomer, the designer and the checker", roles(he) === "newcomer,designer,checker" && roundsFor(he) === 2, roles(he));
  ok("fresh eyes, medium explainer with a long source: the newcomer and the checker, then the checker alone in a second round", roles(me, 1) === "newcomer,checker" && roles(me, 2) === "checker" && roundsFor(me) === 2, `${roles(me, 1)} / ${roles(me, 2)} ${roundsFor(me)}`);
  ok("fresh eyes, low explainer: the checker alone where a source is long, no one where none is", roles(le) === "checker" && roles(ls) === "none" && roundsFor(le) === 1, `${roles(le)} / ${roles(ls)}`);
  const st = freshEyesState(lp);
  ok("fresh eyes, low: verify's check is done, saying none at low depth", st.state === "done" && /fresh eyes: none at low depth/.test(st.lines[0]?.text || ""), JSON.stringify(st.lines));
  // not run yet: the build names the agents to launch, the depth's (a bench run's build said the designer at medium)
  const [sm, sh] = [freshEyesState(mp), freshEyesState(hp)].map((x) => x.lines[0]?.text || "");
  ok("fresh eyes not run yet: medium names the newcomer alone, high the newcomer and the designer", /launch the newcomer \(/.test(sm) && !/designer/.test(sm) && /launch the newcomer and the designer \(/.test(sh), `${sm}\n${sh}`);

  // ---- the command, at low ----
  const fe = (...a) => { try { return { code: 0, out: execFileSync(process.execPath, [join(ROOT, "scripts", "fresh-eyes.mjs"), ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
  const r = fe(lp), rs = fe(lp, "--script");
  ok("fresh-eyes on a low plan video starts no round: it says so and writes nothing", r.code === 0 && /none at low depth/.test(r.out) && !existsSync(join(lp, "fresh-eyes")), r.out);
  ok("…and the script's look neither", rs.code === 0 && /fresh eyes on the script: none at low depth/.test(rs.out) && !existsSync(join(lp, "fresh-eyes")), rs.out);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
if (failed) { console.log(`\n${failed} failing`); process.exit(1); }
console.log("\nall checks pass");
