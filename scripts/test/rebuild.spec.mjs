#!/usr/bin/env node
// The versions of a video, kept so an earlier one can be built again (scripts/lib/versions.mjs, scripts/rebuild.mjs),
// against a scratch repo set up as reelplanning's templates say (a video's assets/ and capture/ left out of git) and a
// tiny built video: a screenshot, a picture recaptured later under the same name, the text it was captured from, a
// font the pinned tools ship, a voice file, a render and a sound no tool makes again.
//   - version 1, opened for review (`reelplanning review <video-dir>`): its manifest beside the plan, its screenshots
//     and captured text in .reelplanning/media/; the font counted as shipped, the voice as regenerated, the render as
//     rebuilt, the sound as lost; nothing audio or video in the store; neither ignored by git
//   - a recapture overwrites a screenshot, a scene changes, a review is recorded (`reel record`): version 2, the store
//     holding both pictures, the unchanged ones once
//   - opening the same build again keeps nothing new
//   - `reel rebuild <video-dir>` lists both, the current one marked
//   - `reel rebuild --version 1 --no-build` puts version 1 together in a folder of its own: its scenes from its commit,
//     its screenshot's bytes, and says what is made again; the current video is untouched
//   - a version kept before its video was committed points at the commit once the video is committed as it was
//   - `reel rebuild --version 1` builds it there, the voice made again by the stand-in engine (REELPLANNING_TTS_ENGINE),
//     never in the current video
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, copyFileSync, rmSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { deflateSync } from "node:zlib";
import { createHash } from "node:crypto";
import { ROOT, testPort, depFile, GSAP } from "../lib/env.mjs";
import { skillsDir } from "../hyperframes-skills.mjs";
import { AV } from "../lib/versions.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 2500)}` : ""}`); if (!cond) failed++; };
const tmp = mkdtempSync(join(tmpdir(), "rp-rebuild-spec-"));
const repo = join(tmp, "repo"), rp = join(repo, ".reelplanning"), pd = join(rp, "plans", "2026-10-01-demo"), vd = join(pd, "video");
const env = { ...process.env, REELPLANNING_HOME: join(tmp, "home"), GIT_AUTHOR_NAME: "t", GIT_AUTHOR_EMAIL: "t@example.com", GIT_COMMITTER_NAME: "t", GIT_COMMITTER_EMAIL: "t@example.com" };
const run = (script, ...a) => { const r = spawnSync(process.execPath, [join(ROOT, "scripts", script), ...a], { cwd: tmp, env, encoding: "utf8", maxBuffer: 64 << 20 }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };
const git = (...a) => execFileSync("git", ["-c", "commit.gpgsign=false", ...a], { cwd: repo, env, encoding: "utf8" });
const sha = (p) => createHash("sha256").update(readFileSync(p)).digest("hex");
const put = (p, s) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, s); };
const ls = (d) => (existsSync(d) ? readdirSync(d).sort() : []);
const json = (p) => JSON.parse(readFileSync(p, "utf8"));

// a real PNG (so ffmpeg, where there is one, can make it lossless WebP): w×h, a pattern
function png(w, h, seed) {
  const crcT = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc = (b) => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const chunk = (t, d) => { const len = Buffer.alloc(4); len.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([len, td, c]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 2;
  const raw = Buffer.alloc((w * 3 + 1) * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * (w * 3 + 1) + 1 + x * 3; raw[i] = (x * seed) & 255; raw[i + 1] = (y * 7) & 255; raw[i + 2] = ((x >> 4) ^ (y >> 4)) & 1 ? 240 : 20; }
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
const ffmpeg = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;
const pixels = (p) => createHash("sha1").update(spawnSync("ffmpeg", ["-v", "error", "-i", p, "-f", "rawvideo", "-pix_fmt", "rgba", "-"], { maxBuffer: 1 << 28 }).stdout).digest("hex");

const MAP = (at, title) => JSON.stringify({ project: "video", title, planDir: ".reelplanning/plans/2026-10-01-demo", totalSeconds: 6, decisions: [], quizzes: [], autonomy: [],
  frames: [{ index: 1, compositionId: "f1", start: 0, end: 3 }, { index: 2, compositionId: "f2", start: 3, end: 6 }], changes: { at, baseline: true, changedFrames: [] } }, null, 2);
const frame = (n, text) => `<div data-composition-id="f${n}"><h1>${text}</h1><img src="assets/shots/${n === 1 ? "page.png" : "after.jpg"}"></div>\n`;
const LINES = ["Drafts are lost when the tab closes.", "This plan keeps them on the server."];
const script = `# SCRIPT\n\n---\n\n${LINES.map((t, i) => `## Line ${i + 1} — beat (Frame ${i + 1})\n\n    ${t}\n`).join("\n")}`;
const storyboard = `---\ntitle: Demo\nplain: drafts\nmusic: none\n---\n\n## Frame 1 — the problem\n\n- src: compositions/frames/01-problem.html\n- duration: 3s\n\n## Frame 2 — the plan\n\n- src: compositions/frames/02-plan.html\n- duration: 3s\n`;

const procs = [];
try {
  // ── a repo set up as the templates say, with a tiny built video ──
  mkdirSync(repo, { recursive: true });
  git("init", "-q", "-b", "main");
  writeFileSync(join(repo, ".gitignore"), readFileSync(join(ROOT, "templates", "gitignore"), "utf8"));
  ok("setup: reel init", run("reel.mjs", "init", repo, "--name", "demo", "--kind", "greenfield", "--agent", "none").code === 0);
  writeFileSync(join(tmp, "plan.md"), "# Drafts\n\n## The problem\n\nDrafts are lost.\n\n### Step 1 — Store drafts\n\nOn the server.\n\n## Components touched\n\n- **Draft store** — where drafts live\n");
  ok("setup: reel new-plan", run("reel.mjs", "new-plan", repo, "demo", "--plan", join(tmp, "plan.md"), "--date", "2026-10-01").code === 0);
  put(join(vd, "STORYBOARD.md"), storyboard); put(join(vd, "SCRIPT.md"), script);
  put(join(vd, "index.html"), "<!doctype html><title>demo</title><div id=root data-composition-id=root></div>\n");
  put(join(vd, "compositions", "frames", "01-problem.html"), frame(1, "Drafts are lost"));
  put(join(vd, "compositions", "frames", "02-plan.html"), frame(2, "Keep them on the server"));
  put(join(vd, "plan-map.json"), MAP("2026-10-01T10:00:00.000Z", "Demo v1"));
  put(join(vd, ".hyperframes", "narration.json"), JSON.stringify({ version: 1, voice: "am_michael", speed: 1.25, model: "kokoro-v1.0 + whisper small.en", lines: { "01": { key: "a", text: LINES[0] }, "02": { key: "b", text: LINES[1] } } }, null, 2));
  // what git leaves out: the pictures and the captured text (kept), a font the tools ship, the voice, a render, a sound
  const PAGE = png(240, 160, 3), AFTER1 = Buffer.from("\xff\xd8\xff JPEG: the page after, captured for version 1", "latin1");
  put(join(vd, "assets", "shots", "page.png"), PAGE); put(join(vd, "assets", "shots", "after.jpg"), AFTER1);
  put(join(vd, "capture", "extracted", "visible-text.txt"), "Drafts are lost when the tab closes.\n");
  put(join(vd, "assets", "voice", "01.wav"), "RIFF fake voice 1"); put(join(vd, "assets", "voice", "02.wav"), "RIFF fake voice 2");
  put(join(vd, "audio_meta.json"), JSON.stringify({ voices: [{ frame: 1, path: "assets/voice/01.wav", duration_s: 3, words: [] }], sfx: [{ frame: 2, file: "assets/sfx/whoosh-custom.mp3", offset_s: 0 }], bgm: null }));
  put(join(vd, "assets", "sfx", "whoosh-custom.mp3"), "ID3 a sound generated once");
  put(join(vd, "renders", "video.mp4"), "fake mp4");
  try { put(join(vd, "assets", "vendor", "gsap.min.js"), readFileSync(depFile(...GSAP))); } catch {}
  const font = (() => { try { const d = join(skillsDir(), "hyperframes-creative", "frame-presets", "code-editorial", "fonts", "Inter-400.woff2"); return existsSync(d) ? d : null; } catch { return null; } })();
  if (font) { mkdirSync(join(vd, "assets", "fonts"), { recursive: true }); copyFileSync(font, join(vd, "assets", "fonts", "Inter-400.woff2")); }
  git("add", "-A"); git("commit", "-q", "-m", "version 1");
  const c1 = git("rev-parse", "HEAD").trim();
  ok("setup: assets/ and capture/ are left out of git, as the templates say", !git("ls-files").includes("assets/") && !git("ls-files").includes("capture/"), git("ls-files"));

  // the guide as built at version 1's commit: what a rebuild of version 1 must give back
  const g1 = run("guide.mjs", vd, "--no-thumbs", "--quiet");
  ok("setup: version 1's guide builds", g1.code === 0 && existsSync(join(vd, "guide", "index.html")), g1.out);
  const guide1 = readFileSync(join(vd, "guide", "index.html"), "utf8");

  // ── version 1, opened for review ──
  const port = testPort(20000 + Math.floor(Math.random() * 10000));
  const srv = spawn(process.execPath, [join(ROOT, "scripts", "review.mjs"), vd, "--no-open", "--no-notify", "--port", String(port), "--out", join(tmp, "bundle")], { cwd: tmp, env });
  procs.push(srv);
  let log = ""; srv.stdout.on("data", (d) => (log += d)); srv.stderr.on("data", (d) => (log += d));
  for (let t = Date.now(); Date.now() - t < 120000 && !/review page: http/.test(log) && srv.exitCode === null;) await new Promise((r) => setTimeout(r, 100));
  srv.kill();
  const vdir = join(pd, "versions", "video"), store = join(rp, "media");
  ok("review: says it kept version 1, and where", /✓ version 1 of \.reelplanning\/plans\/2026-10-01-demo\/video kept for `reel rebuild`: 3 file\(s\)/.test(log), log);
  ok("…and the sound no tool makes again is said, not kept", /△ not kept, and not made again by a rebuild: assets\/sfx\/whoosh-custom\.mp3/.test(log), log);
  const m1f = ls(vdir); const m1 = m1f.length ? json(join(vdir, m1f[0])) : {};
  ok("version 1: one manifest beside the plan, named by its build", m1f.length === 1 && m1.keptBy === "review" && m1.build === "2026-10-01T10:00:00.000Z" && m1.commit === c1 && m1.dirty.length === 0, JSON.stringify(m1f));
  ok("…its kept files: the screenshots and the captured text, each with its hash and size", JSON.stringify(m1.files?.map((f) => f.path).sort()) === JSON.stringify(["assets/shots/after.jpg", "assets/shots/page.png", "capture/extracted/visible-text.txt"])
    && m1.files.every((f) => f.sha256.length === 64 && f.size > 0 && existsSync(join(rp, f.store))), JSON.stringify(m1.files));
  const pageEntry = m1.files?.find((f) => f.path === "assets/shots/page.png");
  ok(`…the PNG ${ffmpeg ? "as lossless WebP when smaller (the same pixels), else" : "(no ffmpeg here:"} as it is${ffmpeg ? "" : ")"}`, pageEntry && (pageEntry.as === "as-is" ? pageEntry.store.endsWith(".png") : pageEntry.as === "webp-lossless" && pageEntry.store.endsWith(".webp") && pixels(join(rp, pageEntry.store)) === pixels(join(vd, "assets/shots/page.png"))), JSON.stringify(pageEntry));
  ok("…the voice regenerated, the render and the vendored library rebuilt, the sound lost", m1.regenerated?.["assets/voice/"] === 2 && m1.regenerated?.["audio_meta.json"] === 1 && m1.rebuilt?.includes("renders/")
    && m1.lost?.length === 1 && m1.lost[0].path === "assets/sfx/whoosh-custom.mp3", JSON.stringify({ r: m1.regenerated, b: m1.rebuilt, l: m1.lost }));
  if (font) ok("…the font the pinned skills ship: shipped, not stored", m1.shipped?.some((s) => s.path === "assets/fonts/Inter-400.woff2" && /^skills:hyperframes-creative\//.test(s.from)) && !m1.files.some((f) => /woff2/.test(f.path)), JSON.stringify(m1.shipped));
  ok("…the scenes git has, the tools and the narration it was built with", m1.scenes?.["compositions/frames/02-plan.html"] && m1.scenes?.["plan-map.json"] && !m1.scenes?.["assets/shots/page.png"]
    && m1.tools?.reelplanning && m1.narration?.voice === "am_michael" && m1.narration?.speed === 1.25 && m1.narration?.lines === 2 && m1.audio?.sfx?.length === 1, JSON.stringify({ s: m1.scenes, t: m1.tools, n: m1.narration }));
  ok("the store holds no audio or video", ls(store).length === 3 && !ls(store).some((f) => AV.test(f)), ls(store).join(", "));
  const ignored = spawnSync("git", ["check-ignore", ...ls(store).map((f) => join(".reelplanning/media", f)), join(".reelplanning/plans/2026-10-01-demo/versions/video", m1f[0])], { cwd: repo });
  ok("…and git ignores neither the store nor the versions", ignored.status === 1 && !String(ignored.stdout).trim(), `${ignored.status} ${ignored.stdout}${ignored.stderr}`);

  // ── a recapture overwrites a screenshot, a scene changes: version 2, recorded ──
  git("add", "-A"); git("commit", "-q", "-m", "version 1 kept");
  const AFTER2 = Buffer.from("\xff\xd8\xff JPEG: the page after, recaptured for version 2", "latin1");
  // the plan revised too, so the guide made now is not version 1's
  writeFileSync(join(pd, "plan.md"), readFileSync(join(pd, "plan.md"), "utf8").replace("On the server.", "On the server, saved every ten seconds."));
  writeFileSync(join(vd, "assets", "shots", "after.jpg"), AFTER2);
  writeFileSync(join(vd, "compositions", "frames", "02-plan.html"), frame(2, "Keep them on the server, and say when"));
  writeFileSync(join(vd, "plan-map.json"), MAP("2026-10-02T10:00:00.000Z", "Demo v2"));
  git("add", "-A"); git("commit", "-q", "-m", "version 2");
  const c2 = git("rev-parse", "HEAD").trim();
  writeFileSync(join(tmp, "review.json"), JSON.stringify({ version: 1, project: "video", exportedAt: "2026-10-02T11:00:00Z", verdict: "changes", decisions: [], quizzes: [], autonomy: [], annotations: [{ kind: "comment", t: 4, text: "say when" }] }));
  const rec = run("reel.mjs", "record", pd, join(tmp, "review.json"));
  ok("record: keeps the version the review was of, version 2", rec.code === 0 && /✓ version 2 of \.reelplanning\/plans\/2026-10-01-demo\/video kept for `reel rebuild`: 3 file\(s\)/.test(rec.out), rec.out);
  const vs = ls(vdir).map((f) => json(join(vdir, f))), m2 = vs.find((m) => m.build === "2026-10-02T10:00:00.000Z");
  ok("…its manifest: the new commit, kept by record", vs.length === 2 && m2?.commit === c2 && m2.keptBy === "record", JSON.stringify(vs.map((m) => [m.build, m.commit])));
  const after1 = m1.files.find((f) => f.path === "assets/shots/after.jpg"), after2 = m2?.files.find((f) => f.path === "assets/shots/after.jpg");
  ok("the store holds both versions of the recaptured picture, and what did not change once", ls(store).length === 4 && after1.store !== after2?.store && existsSync(join(rp, after2.store))
    && m2.files.find((f) => f.path === "assets/shots/page.png").store === pageEntry.store && sha(join(rp, after1.store)) === sha256(AFTER1), ls(store).join(", "));
  // the same build opened again: nothing new
  const before = ls(store).length + ls(vdir).length;
  const again = run("rebuild.mjs", vd, "--keep");
  ok("the same build kept again adds nothing", again.code === 0 && /is kept already/.test(again.out) && ls(store).length + ls(vdir).length === before, again.out);

  // ── the list ──
  const list = run("rebuild.mjs", vd);
  ok("rebuild with no version: lists them, 1 the oldest, the current one marked", list.code === 0 && /^ +1 +\d{4}-\d\d-\d\d \d\d:\d\d +build [0-9a-f]{12} +commit [0-9a-f]{7} +3 file\(s\) kept +· review$/m.test(list.out) && /^ +2 .*· record +← the video now$/m.test(list.out), list.out);
  const viaReel = run("reel.mjs", "rebuild", vd);
  ok("…`reel rebuild` is the same command", viaReel.code === 0 && viaReel.out === list.out, viaReel.out);

  // ── version 1 put together again, the current video untouched ──
  git("add", "-A"); git("commit", "-q", "-m", "version 2 kept");
  // (its guide/ aside: built again here on purpose, below, to compare with version 1's)
  const snapshot = () => JSON.stringify(Object.fromEntries([...walk(vd)].filter((p) => !p.startsWith("guide/")).map((p) => [p, sha(join(vd, p))])));
  function* walk(d, r = "") { for (const e of readdirSync(join(d, r))) { const p = r ? `${r}/${e}` : e; if (statSync(join(d, p)).isDirectory()) yield* walk(d, p); else yield p; } }
  const now = snapshot(), out = join(tmp, "v1");
  const rb = run("rebuild.mjs", vd, "--version", "1", "--out", out, "--no-build");
  const ov = join(out, ".reelplanning", "plans", "2026-10-01-demo", "video");
  ok("rebuild --version 1 --no-build: put together, and says so", rb.code === 0 && /rebuild \.reelplanning\/plans\/2026-10-01-demo\/video, version 1 of 2/.test(rb.out) && /✓ scenes from commit [0-9a-f]{7}: every file as reviewed/.test(rb.out), rb.out);
  ok("…the screenshot recaptured since: version 1's bytes", existsSync(join(ov, "assets/shots/after.jpg")) && sha(join(ov, "assets/shots/after.jpg")) === sha256(AFTER1), rb.out);
  ok(`…the PNG: ${pageEntry?.as === "webp-lossless" ? "the same pixels" : "the same bytes"}`, existsSync(join(ov, "assets/shots/page.png")) && (pageEntry?.as === "webp-lossless" ? pixels(join(ov, "assets/shots/page.png")) === pixels(join(vd, "assets/shots/page.png")) : sha(join(ov, "assets/shots/page.png")) === sha(join(vd, "assets/shots/page.png"))), rb.out);
  ok("…the scenes of version 1, and its plan map", /Keep them on the server<\/h1>/.test(readFileSync(join(ov, "compositions/frames/02-plan.html"), "utf8")) && json(join(ov, "plan-map.json")).title === "Demo v1"
    && readFileSync(join(ov, "capture/extracted/visible-text.txt"), "utf8").startsWith("Drafts are lost"), rb.out);
  ok("…in a worktree of the whole repo at version 1's commit: its plan.md, the ledger as it was then, the history", execFileSync("git", ["rev-parse", "HEAD"], { cwd: out, encoding: "utf8" }).trim() === c1
    && !/ten seconds/.test(readFileSync(join(out, ".reelplanning", "plans", "2026-10-01-demo", "plan.md"), "utf8")) && !existsSync(join(out, ".reelplanning", "plans", "2026-10-01-demo", "reviews"))
    && existsSync(join(out, ".reelplanning", "theme", "frame.md")) && git("worktree", "list").includes(out), rb.out);
  const g2 = run("guide.mjs", vd, "--no-thumbs", "--quiet");
  ok("…its guide built again from that commit: the same page as version 1's, not the one made now", existsSync(join(ov, "guide", "index.html")) && readFileSync(join(ov, "guide", "index.html"), "utf8") === guide1
    && g2.code === 0 && readFileSync(join(vd, "guide", "index.html"), "utf8") !== guide1 && /✓ its guide, made from the commit/.test(rb.out), rb.out);
  ok("…the font the tools ship, back from the tools", !font || (existsSync(join(ov, "assets/fonts/Inter-400.woff2")) && sha(join(ov, "assets/fonts/Inter-400.woff2")) === sha(font) && /✓ 1 file\(s\) the tools ship \(fonts, sounds\) back/.test(rb.out)), rb.out);
  ok("…no voice, video or render brought back: the voice is made again, and it says so", !existsSync(join(ov, "assets/voice")) && !existsSync(join(ov, "renders")) && /· made again: the voice and its word timings \(2 line\(s\), am_michael ×1\.25, kokoro-v1\.0 \+ whisper small\.en\)/.test(rb.out)
    && /△ not brought back, nothing makes them again: assets\/sfx\/whoosh-custom\.mp3/.test(rb.out), rb.out);
  ok("…the current video untouched", snapshot() === now && !git("status", "--porcelain").trim(), git("status", "--porcelain"));
  const byCommit = run("rebuild.mjs", vd, "--version", c1.slice(0, 8), "--out", out, "--no-build");
  ok("--version takes a commit too, and --out a folder it made before", byCommit.code === 0 && /version 1 of 2/.test(byCommit.out), byCommit.out);
  const busy = join(tmp, "busy"); put(join(busy, "mine.txt"), "x");
  const refused = run("rebuild.mjs", vd, "--version", "1", "--out", busy, "--no-build");
  ok("…but never a folder of someone else's", refused.code === 1 && /not empty, and not a rebuild this command made/.test(refused.out) && existsSync(join(busy, "mine.txt")), refused.out);
  const nope = run("rebuild.mjs", vd, "--version", "7");
  ok("an unknown version is said", nope.code === 1 && /no version "7"/.test(nope.out), nope.out);

  // ── kept before the video was committed: points at the commit once it is ──
  writeFileSync(join(vd, "compositions", "frames", "01-problem.html"), frame(1, "Drafts are lost, often"));
  writeFileSync(join(vd, "plan-map.json"), MAP("2026-10-03T10:00:00.000Z", "Demo v3"));
  const k3 = run("rebuild.mjs", vd, "--keep");
  const m3 = () => ls(vdir).map((f) => json(join(vdir, f))).find((m) => m.build === "2026-10-03T10:00:00.000Z");
  ok("a version kept with its scenes not committed: says so, and names the files", k3.code === 0 && /✓ version 3/.test(k3.out) && /not all committed yet/.test(k3.out) && m3()?.dirty.includes("plan-map.json"), k3.out);
  git("add", "-A"); git("commit", "-q", "-m", "version 3");
  const k3b = run("rebuild.mjs", vd, "--keep");
  ok("…once committed as it was, it points at that commit", /✓ version 3 of .*: now at commit [0-9a-f]{7}/.test(k3b.out) && m3()?.commit === git("rev-parse", "HEAD").trim() && m3()?.dirty.length === 0, k3b.out);

  // ── built again: the voice made anew, in the rebuild's folder only ──
  if (!existsSync(join(skillsDir(), "faceless-explainer", "scripts", "audio.mjs"))) console.log("· (the build part skipped: no HyperFrames skills here — reelplanning hyperframes-skills)");
  else {
    const ENGINE = join(tmp, "fake-engine.mjs");
    writeFileSync(ENGINE, `import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";\nimport { join, dirname } from "node:path";\n` +
      `const a = process.argv.slice(2), f = (n) => a[a.indexOf("--" + n) + 1];\nconst req = JSON.parse(readFileSync(f("request"), "utf8")), dir = f("hyperframes"), out = f("out");\n` +
      `if (f("only") === "sfx") { const m = existsSync(out) ? JSON.parse(readFileSync(out, "utf8")) : { voices: [] }; m.sfx = []; writeFileSync(out, JSON.stringify(m)); process.exit(0); }\n` +
      `const voices = req.lines.map((l) => { mkdirSync(join(dir, "assets/voice"), { recursive: true }); writeFileSync(join(dir, "assets/voice", l.id + ".wav"), "RIFF new voice " + l.id);\n` +
      `  return { id: l.id, path: "assets/voice/" + l.id + ".wav", duration_s: 2, words: l.text.split(/\\s+/).map((t, i) => ({ id: "w" + i, text: t, start: i * 0.2, end: i * 0.2 + 0.15 })) }; });\n` +
      `mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, JSON.stringify({ tts_provider: "fake", voice_id: req.voice, bgm: null, voices, sfx: [] }));\n`);
    const voiceBefore = sha(join(vd, "assets/voice/01.wav"));
    const b = spawnSync(process.execPath, [join(ROOT, "scripts", "rebuild.mjs"), vd, "--version", "1", "--out", join(tmp, "v1-built")], { cwd: tmp, env: { ...env, REELPLANNING_TTS_ENGINE: ENGINE }, encoding: "utf8", maxBuffer: 64 << 20 });
    const bo = `${b.stdout}${b.stderr}`, bv = join(tmp, "v1-built", ".reelplanning", "plans", "2026-10-01-demo", "video");
    ok("rebuild --version 1: runs the build there, the voice made again by this machine's engine (said, as it is not the recorded one)",
      /▶ reelplanning build /.test(bo) && /✓ narrate/.test(bo) && /△ the voice was made with kokoro-v1\.0 \+ whisper small\.en .*here it is fake fake-engine\.mjs/.test(bo) && /RIFF new voice/.test(readFileSync(join(bv, "assets/voice/01.wav"), "utf8")), bo);
    ok("…a build that stops says where to go on from (the scratch frames are no finished project)", b.status === 0 ? /✓ version 1 of .* built again/.test(bo) : /its build stopped \(above\)/.test(bo), bo);
    ok("…and the current video's voice is as it was", sha(join(vd, "assets/voice/01.wav")) === voiceBefore);
  }
} finally {
  for (const p of procs) try { p.kill(); } catch {}
  if (!failed) rmSync(tmp, { recursive: true, force: true }); else console.log(`(kept: ${tmp})`);
}
function sha256(buf) { return createHash("sha256").update(buf).digest("hex"); }
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ all passed");
process.exit(failed ? 1 : 0);
