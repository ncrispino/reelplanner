#!/usr/bin/env node
// Reviewing the system video (revise-loop plan, step 4), against a scratch copy of this repo's own
// system video record. Nothing in the repo is modified.
//   plan-map      — each frame carries its spec section and parts; the map says it is a system video
//   reel-intake   — accepts a system-video review (both spellings), checked; still refuses a bad planDir
//   system-review — lists every comment, rewind and missed quick check with its frame's parts, one file
//                   per review (reviews/<id>.md), so a second review never overwrites the first's answers
import { execFileSync } from "node:child_process";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, scratchCopy } from "../lib/env.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-sysreview-"));
const rp = join(tmp, ".reelplanning"), sv = join(rp, "system-video");
mkdirSync(sv, { recursive: true });
for (const f of ["spec.md", "system.json", "glossary.md"]) cpSync(join(ROOT, ".reelplanning", f), join(rp, f));
cpSync(join(ROOT, ".reelplanning/system-video/STORYBOARD.md"), join(sv, "STORYBOARD.md"));
// a plan beside it, so the plan path is exercised in the same repo
scratchCopy(join(ROOT, "eval/projects/media-service/.reelplanning/plans/2026-09-12-upload-resume"), join(rp, "plans/2026-09-12-upload-resume"));   // its video folders are links to videos/
const run = (script, ...a) => { try { return { code: 0, out: execFileSync("node", [join(ROOT, "scripts", script), ...a], { encoding: "utf8", cwd: tmp, stdio: ["ignore", "pipe", "pipe"] }) }; } catch (e) { return { code: e.status, out: `${e.stdout}${e.stderr}` }; } };
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${detail}` : ""}`); if (!cond) failed++; };

try {
  // ---- plan-map carries the tags ----
  const pm = run("plan-map.mjs", sv);
  const map = JSON.parse(readFileSync(join(sv, "plan-map.json"), "utf8"));
  const tagged = map.frames.filter((f) => f.specSection).length + map.frames.filter((f) => f.components.length).length;
  // The expectations come from the video itself, so the next system-video update does not break them:
  // every `- spec_section:` and `- components:` line in its storyboard lands on its frame.
  const sb = readFileSync(join(sv, "STORYBOARD.md"), "utf8"), want = (sb.match(/^- spec_section:/gm) || []).length + (sb.match(/^- components:/gm) || []).length;
  const sys = JSON.parse(readFileSync(join(rp, "system.json"), "utf8")), nameOf = (id) => sys.components.find((c) => c.id === id)?.name;
  const f8 = map.frames.find((f) => f.index === 8);
  ok(`plan-map: every storyboard tag lands on its frame (${want} tags)`, want > 0 && tagged === want, `${tagged} of ${want} ${pm.out}`);
  const sb8 = (sb.split(/^(?=## Frame \d+)/m).find((b) => /^## Frame 8 /.test(b)) || "").match(/^- components:\s*(.+)$/m)?.[1].split(",").map((x) => x.trim()) || [];
  ok("plan-map: a frame names its spec section and its parts", !!f8.specSection && f8.components.length > 0 && f8.components.join() === sb8.join(), JSON.stringify(f8));
  ok("plan-map: the map says it is the system video, and where its review is filed", map.kind === "system" && map.reviewDir === ".reelplanning/system-video", JSON.stringify({ kind: map.kind, reviewDir: map.reviewDir }));
  // a video can ship with its quick checks off: `checks: off` in its BRIEF.md front matter, carried into the map (the
  // player starts with them off; the viewer's own choice still wins). With no such line the map says nothing: on.
  writeFileSync(join(sv, "BRIEF.md"), "---\nworkflow: faceless-explainer\nchecks: off\n---\n\n# The system video\n");
  run("plan-map.mjs", sv);
  const offMap = JSON.parse(readFileSync(join(sv, "plan-map.json"), "utf8"));
  rmSync(join(sv, "BRIEF.md")); run("plan-map.mjs", sv);
  ok("plan-map: `checks: off` in the brief's front matter is the map's `checks`, and none is no key (on)", offMap.checks === "off" && !("checks" in map), JSON.stringify({ off: offMap.checks, plain: map.checks }));

  // ---- a review of it, as the player sends it ----
  // a frame with one part (a change asked there is small), and the frame that asks quick check k3
  const f1p = map.frames.find((f) => f.components.length === 1 && f.index !== 8), k3q = map.quizzes.find((q) => q.id === "k3");
  const fk3 = map.frames.filter((f) => f.start <= k3q.at).at(-1);   // the frame the check stops on
  const f19 = map.frames.find((f) => f.index === 19), f31 = f1p, f15 = map.frames.find((f) => f.index === 15);
  const mark = (f, comment, extra = {}) => ({ id: `a-${f.index}`, kind: "circle", t: +(f.start + 1).toFixed(2), frame: { index: f.index, compositionId: f.compositionId, title: f.title }, plan: {}, comment, ...extra });
  const review = { version: 1, src: "system/index.html", project: "system-video", exportedAt: "2026-09-24T10:00:00.000Z", verdict: "changes",
    watch: { completion: 0.8, maxTimeReached: 290, moments: [{ kind: "rewind", t: +(f15.start + 2).toFixed(2), from: +(f15.start + 12).toFixed(2), frameIndex: 15 }] },
    decisions: [], autonomy: [],
    quizzes: [{ id: "k3", answer: k3q.answer === "a" ? "b" : "a", correct: false, t: k3q.at }],
    annotations: [
      mark(f8, "I don't understand what finish-project does here"),
      mark(f31, "the revise step should also say which steps it left alone"),
      mark(f15, "should the review go straight to the agent, or wait for a push? which one"),
      { id: "a-bare", kind: "arrow", t: +(f19.start + 1).toFixed(2), frame: { index: 19, compositionId: f19.compositionId, title: f19.title }, plan: { component: "revise" }, comment: "" },
    ] };
  const row = { status: "submitted", submittedAt: review.exportedAt, project: "system-video", planDir: map.reviewDir, kind: "system", title: map.title, verdict: "changes", note: "mostly clear", review };
  writeFileSync(join(tmp, "row.json"), JSON.stringify(row));
  const i1 = run("reel-intake.mjs", join(tmp, "row.json"), "--repo", tmp);
  const first = join(sv, "reviews", "system-video-20260924T100000Z");
  ok("reel-intake: accepts a system-video review and files it in the video's folder, under its own id", i1.code === 0 && existsSync(`${first}.json`) && existsSync(`${first}.md`) && !existsSync(join(sv, "annotations.json")), i1.out);
  ok("reel-intake: does not run reel record (no plan, no ledger entry)", !existsSync(join(rp, "decisions.json")) || !/system-video/.test(readFileSync(join(rp, "decisions.json"), "utf8")), i1.out);

  // ---- system-review lists each item with its frame's parts ----
  const md = readFileSync(`${first}.md`, "utf8");
  const item = (n) => md.split(/^### /m).find((b) => new RegExp(`frame ${n} "`).test(b)) || "";
  const it8 = item(8);
  ok("system-review: a comment is listed with its frame, spec section and parts by their glossary names",
    it8.includes(`Comment · frame 8 "${f8.title}"`) && it8.includes(`spec section:** ${f8.specSection}`) && it8.includes(f8.components.map((c) => `${nameOf(c)} (\`${c}\`)`).join(", ")) && /I don't understand what finish-project does/.test(it8), it8);
  ok("system-review: words that say the video lost them are hinted as the video", /hint:\*\* video/.test(it8), it8);
  ok("system-review: a change asked inside one part is hinted small (fix + walkthrough)", /hint:\*\* change, small/.test(item(f31.index)) && item(f31.index).includes(nameOf(f31.components[0])), item(f31.index));
  ok("system-review: a change with a choice is hinted as a new plan", (md.match(/### \d+\. Comment · frame 15[\s\S]*?hint:\*\* ([^\n]+)/) || [])[1]?.startsWith("change, plan"), md);
  ok("system-review: a bare mark on a part names the part it was placed on", /Mark · frame 19[\s\S]*?marked on:\*\* The revise step \(`revise`\)/.test(md), md);
  ok("system-review: a rewind and a missed quick check are listed on their frames", /Rewind · frame 15/.test(md) && new RegExp(`Missed quick check · frame ${fk3.index}[\\s\\S]*?answered "`).test(md), md);
  ok("system-review: the reviewer's note is quoted, and each item has an Answer line", /> mostly clear/.test(md) && (md.match(/^- \*\*Answer:\*\*/gm) || []).length === 6, md.slice(0, 600));

  // ---- one file per review: a second one, back to back, keeps the first one's answers ----
  const answered = md.replace("- **Answer:** _(the agent: what you did, and where to see it)_", "- **Answer:** reworded frame 8's line; see the rebuilt frame");
  writeFileSync(`${first}.md`, answered);
  const idx0 = readFileSync(join(sv, "review.md"), "utf8");
  ok("review.md, the old name, now points at each review", /reviews\/system-video-20260924T100000Z\.md/.test(idx0) && /0 of 6 items answered/.test(idx0), idx0);
  const row2 = { ...row, submittedAt: "2026-09-24T10:00:40.000Z", note: "", review: { ...review, exportedAt: "2026-09-24T10:00:40.000Z", annotations: [mark(f8, "and the colours on this frame are hard to read")] } };
  writeFileSync(join(tmp, "row2.json"), JSON.stringify(row2));
  const i4 = run("reel-intake.mjs", join(tmp, "row2.json"), "--repo", tmp);
  const second = join(sv, "reviews", "system-video-20260924T100040Z");
  ok("a second review arriving right after is filed beside the first, not over it", i4.code === 0 && existsSync(`${second}.json`) && existsSync(`${second}.md`) && /colours on this frame/.test(readFileSync(`${second}.md`, "utf8")), i4.out);
  ok("…and the first review's answers are still there", readFileSync(`${first}.md`, "utf8") === answered && JSON.parse(readFileSync(`${first}.json`, "utf8")).annotations.length === 4);
  const idx = readFileSync(join(sv, "review.md"), "utf8");
  ok("review.md lists both, newest first, with the answers counted", idx.indexOf("100040Z") > 0 && idx.indexOf("100040Z") < idx.indexOf("100000Z") && /100000Z\.md\)[^\n]*1 of 6 items answered/.test(idx), idx);
  const i5 = run("reel-intake.mjs", join(tmp, "row.json"), "--repo", tmp);
  ok("the same review taken in again keeps its file and its answers", i5.code === 0 && readFileSync(`${first}.md`, "utf8") === answered && /sorted before; kept/.test(i5.out) && !existsSync(`${first}-2.json`), i5.out);
  writeFileSync(join(tmp, "row3.json"), JSON.stringify({ ...row2, review: { ...row2.review, annotations: [mark(f31, "another one, sent in the same second")] } }));
  const i6 = run("reel-intake.mjs", join(tmp, "row3.json"), "--repo", tmp);
  ok("another review with the same id takes the next free name", i6.code === 0 && existsSync(`${second}-2.md`) && /colours on this frame/.test(readFileSync(`${second}.md`, "utf8")), i6.out);

  // "Expected something else? Say how it should work" on a quick check: a comment in the reviewer's words
  const k3 = map.quizzes.find((q) => q.id === "k3");
  writeFileSync(join(tmp, "row4.json"), JSON.stringify({ ...row, submittedAt: "2026-09-24T10:05:00.000Z", note: "", review: { ...review, exportedAt: "2026-09-24T10:05:00.000Z", watch: { completion: 0.5 }, annotations: [], quizzes: [{ id: "k3", answer: k3.answer === "a" ? "b" : "a", correct: false, t: k3.at, note: "I thought the revise step rebuilds every frame, and it should" }] } }));
  const i7 = run("reel-intake.mjs", join(tmp, "row4.json"), "--repo", tmp);
  const md4 = existsSync(join(sv, "reviews", "system-video-20260924T100500Z.md")) ? readFileSync(join(sv, "reviews", "system-video-20260924T100500Z.md"), "utf8") : "";
  ok("system-review: a quick check the reviewer disagreed with is a comment in their words, with what they answered, not a miss",
    i7.code === 0 && md4.includes(`### 1. Comment · frame ${fk3.index} `) && /they answered:\*\* "[^"]+"; the video's answer is "/.test(md4) && /words:\*\* "I thought the revise step rebuilds every frame, and it should"/.test(md4) && !/Missed quick check/.test(md4), md4 || i7.out);

  // the page built before reviewDir existed sends planDir ".reelplanning" with the system video's project
  writeFileSync(join(tmp, "old.json"), JSON.stringify({ ...row, planDir: ".reelplanning", kind: undefined }));
  const i2 = run("reel-intake.mjs", join(tmp, "old.json"), "--repo", tmp, "--dry");
  ok("reel-intake: accepts the older spelling (.reelplanning + project system-video)", i2.code === 0 && /system video: \.reelplanning\/system-video/.test(i2.out), i2.out);

  // ---- still checked, not believed ----
  const refuse = (name, patch, re) => {
    writeFileSync(join(tmp, "bad.json"), JSON.stringify({ ...row, ...patch }));
    const r = run("reel-intake.mjs", join(tmp, "bad.json"), "--repo", tmp, "--dry");
    ok(`reel-intake refuses: ${name}`, r.code !== 0 && re.test(r.out), r.out);
  };
  refuse("a planDir outside the repo", { planDir: "../../etc" }, /outside the repo/);
  refuse("the record itself, claimed by another project", { planDir: ".reelplanning", project: "l2-upload-resume", kind: undefined }, /not a plan directory/);
  refuse("a plan directory with no plan.md", { planDir: ".reelplanning/plans/2026-01-01-nope", kind: undefined }, /no plan\.md/);
  refuse("marks on frames the system video does not have", { review: { ...review, annotations: [{ ...review.annotations[0], frame: { index: 1, compositionId: "01-some-other-video" } }] } }, /another video/);
  writeFileSync(join(sv, "STORYBOARD.md"), readFileSync(join(sv, "STORYBOARD.md"), "utf8").replace(/^kind: system$/m, "kind: plan"));
  refuse("a folder called system-video that is not one", {}, /not a system video/);
  // and a plan's review still goes the plan's way
  const pr = { ...row, planDir: ".reelplanning/plans/2026-09-12-upload-resume", project: "video", kind: undefined, review: { ...review, quizzes: [], annotations: [] } };
  writeFileSync(join(tmp, "plan.json"), JSON.stringify(pr));
  const i3 = run("reel-intake.mjs", join(tmp, "plan.json"), "--repo", tmp, "--dry");
  ok("reel-intake: a plan's review still goes to its plan", i3.code === 0 && /plan: \.reelplanning\/plans\/2026-09-12-upload-resume/.test(i3.out) && /reel record/.test(i3.out), i3.out);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `✗ ${failed} failed` : "✓ system review: all passed");
process.exit(failed ? 1 : 0);
