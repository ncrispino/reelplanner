#!/usr/bin/env node
// `reel case-study` (the case-study plan, step 1), in a temp folder. Nothing under eval/ is modified.
//   the scaffold  — makes the tree: the prompt byte for byte, the start, three arms each with its sheet,
//                   its container and its preflight, the feedback sheet, the rubric, the judge, the words and
//                   the numbers; --from records a commit and its files; a second run refuses
//   the preflight — passes an empty folder in an empty home; flags a folder with a file in it and a planted
//                   ~/.claude/CLAUDE.md, and exits 1
//   provenance    — provenance.sh prints JSON with no secret or email from the arm's config; `provenance` reads a
//                   fake transcript (a session and a subagent) into provenance.json: models, versions, times,
//                   prompts, responses, tool calls, the narration's voice, and no message text
//   the report    — builds the page, the nine sections in order; warns on an empty section; --publish refuses
//                   (exit 1, nothing written) until all nine are filled, then builds it without the draft line
//   keeping a site — (D-247) a scratch site repo: kept in place, its history as site.bundle (it verifies, and
//                   clones to the same commits) and its .git taken out of site/; kept from a clone elsewhere (the
//                   files git tracks copied in); refused with changes not committed, with no .git of its own,
//                   and over a kept site without --replace; --check fails on a bundle that does not verify;
//                   section 5 is not filled until every arm's site is kept; a history holding a voice file or a render is
//                   refused (D-305) and the commands it prints fix it; in place, what the site ignored stays out of git
//   the containers — ours installs reelplanning from a tarball or GitHub (not npm), each site's .git/info/exclude
//                   keeps the built videos' media out (site.exclude)
//   arm.sh        — (kit/arm.sh, an arm on your own machine) its usage; stage and note add a line with the time to
//                   the arm's notes.md, and refuse a stage that is not one of the seven; status says each arm's
//                   state (not started, set up, running, done, pushed); an arm that is over is not set up again
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync, statSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT } from "../lib/env.mjs";
import { STAGES, emptyData, GITHUB, isMedia } from "../case-study.mjs";

const tmp = mkdtempSync(join(tmpdir(), "reel-case-study-"));
let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };
const reel = (...a) => { const r = spawnSync("node", [join(ROOT, "scripts", "reel.mjs"), "case-study", ...a], { cwd: tmp, encoding: "utf8" }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };
const read = (p) => readFileSync(p, "utf8");
const ARMS = ["text", "html", "ours"];

try {
  // ---------- the scaffold ----------
  const promptSrc = join(ROOT, "eval/bob-dylan-site/prompt.md");
  const r = reel("dylan", "--prompt", promptSrc, "--into", "cs", "--folder", "dylan-site", "--claude-code", "2.1.283");
  const dir = join(tmp, "cs", "dylan");
  ok("scaffold: `reel case-study` makes the folder", r.code === 0 && existsSync(dir), r.out);
  const want = ["prompt.md", "start/README.md", "FEEDBACK.md", "RUBRIC.md", "JUDGE.md", "README.md", "REPLICATE.md",
    ...Object.keys(emptyData()).map((f) => `data/${f}`),
    ...ARMS.flatMap((a) => ["SHEET.md", "Dockerfile", "preflight.sh", "start.sh", "prompt.txt", "site", "shots"].map((f) => `arms/${a}/${f}`)), "arms/html/report.prompt.txt"];
  const lost = want.filter((f) => !existsSync(join(dir, f)));
  ok("scaffold: the tree has every file the plan lists", !lost.length, `missing: ${lost.join(", ")}`);
  ok("scaffold: it prints the tree", /├─ arms\//.test(r.out) && /└─ RUBRIC\.md/.test(r.out), r.out);
  ok("scaffold: prompt.md is the prompt, byte for byte", readFileSync(join(dir, "prompt.md")).equals(readFileSync(promptSrc)));
  ok("scaffold: greenfield starts empty (start/ says so, nothing else in it)", readdirSync(join(dir, "start")).join() === "README.md" && /empty folder/.test(read(join(dir, "start/README.md"))));
  ok("scaffold: each arm's site/ is empty", ARMS.every((a) => readdirSync(join(dir, "arms", a, "site")).length === 0));
  const prompt = read(promptSrc);
  ok("scaffold: what each arm types first", read(join(dir, "arms/text/prompt.txt")) === prompt && read(join(dir, "arms/ours/prompt.txt")) === `Use reelplanning to plan: ${prompt}`
    && read(join(dir, "arms/html/prompt.txt")).startsWith(prompt.trimEnd()) && /plan\.html is the only file to write\.\n$/.test(read(join(dir, "arms/html/prompt.txt"))));
  ok("scaffold: the HTML arm's result prompt asks for report.html and the choices the plan did not cover", /report\.html/.test(read(join(dir, "arms/html/report.prompt.txt"))) && /choices you made that plan\.html did not cover/.test(read(join(dir, "arms/html/report.prompt.txt"))));
  const sheet = read(join(dir, "arms/text/SHEET.md"));
  ok("scaffold: a sheet has the preflight first, then the seven stages in order", sheet.indexOf("## Preflight") > 0 && STAGES.every((s, i) => sheet.includes(`## ${i + 1}. ${s}`))
    && sheet.indexOf("## Preflight") < sheet.indexOf("## 1. plan") && /shots\/05-check-the-result\.png/.test(sheet), sheet.slice(0, 600));
  const dockers = ARMS.map((a) => read(join(dir, "arms", a, "Dockerfile")));
  // an arm's own lines: those marked "this arm only", and the block each such comment heads (up to the next blank or common line)
  const common = (s) => s.split("\n").filter((l) => !/this arm only/.test(l) && !/^\s*(&&|RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg|RUN npx -y skills|ARG REELPLANNING=|COPY smoke\.sh |RUN t=\$\(ls \/opt\/case-study\/reelplanning|# in a checkout, while|# the image makes a video)/.test(l) && !/^# The \w+ arm|cs-dylan-/.test(l)).join("\n");
  ok("scaffold: the three containers are the same but for the lines marked \"this arm only\"", common(dockers[0]) === common(dockers[1]) && common(dockers[1]) === common(dockers[2]), common(dockers[2]));
  ok("scaffold: same Claude Code and model in all three, a new home, only site/ mounted", dockers.every((d) => /ARG CLAUDE_CODE_VERSION=2\.1\.283/.test(d) && /ARG MODEL=claude-opus-5-5/.test(d) && /useradd --create-home --home-dir \/home\/agent/.test(d) && /-v "\$PWD\/site:\/home\/agent\/dylan-site"/.test(d) && !/COPY \.\.|VOLUME/.test(d)));
  ok("scaffold: ours adds reelplanning; text starts in plan mode", /reelplanning setup && sh \/opt\/case-study\/smoke\.sh/.test(dockers[2]) && !/reelplanning/.test(dockers[0]) && /--permission-mode plan/.test(read(join(dir, "arms/text/start.sh"))) && !/permission-mode/.test(read(join(dir, "arms/html/start.sh"))));
  // reelplanning is not on npm: ours installs it from a tarball beside the Dockerfile, else from GitHub, never `npx reelplanning@…`
  ok("scaffold: ours installs reelplanning from a reelplanning.tgz when there is one, else from GitHub; the skill from that package",
    dockers[2].includes(`ARG REELPLANNING=${GITHUB}`) && /npm i -g "\$\{t:-\$REELPLANNING\}"/.test(dockers[2]) && /skills add "\$\(npm root -g\)\/reelplanning" --skill plan-to-video -g -y -a claude-code/.test(dockers[2]) && !/npx -y reelplanning@/.test(dockers[2]) && existsSync(join(dir, "arms/ours/smoke.sh")) && !existsSync(join(dir, "arms/text/smoke.sh")), dockers[2]);
  ok("scaffold: ours's container shares the host's network (its review page on 127.0.0.1); the others' do not", /docker run -it --rm --network host /.test(dockers[2]) && dockers.slice(0, 2).every((d) => /docker run -it --rm -e ANTHROPIC_API_KEY/.test(d)));
  // the built videos' media stay out of the site's history (D-305): site.exclude, in .git/info/exclude at start
  const exclude = read(join(dir, "arms/ours/site.exclude"));
  ok("scaffold: each arm's site.exclude names the built videos' media, and start.sh puts it in the site's .git/info/exclude",
    ARMS.every((a) => read(join(dir, "arms", a, "site.exclude")) === exclude && /cat \/opt\/case-study\/site\.exclude >> \.git\/info\/exclude/.test(read(join(dir, "arms", a, "start.sh"))) && /COPY preflight\.sh start\.sh site\.exclude/.test(read(join(dir, "arms", a, "Dockerfile"))))
    && /^\.reelplanning\/plans\/\*\/\*video\/assets\/$/m.test(exclude) && /^\.reelplanning\/\*\*\/\*\.wav$/m.test(exclude) && /^\.reelplanning\/\*\*\/renders\/$/m.test(exclude), exclude);
  ok("scaffold: the smoke script parses (sh -n)", spawnSync("sh", ["-n", join(dir, "arms/ours/smoke.sh")]).status === 0);
  const rep = read(join(dir, "REPLICATE.md"));
  ok("scaffold: REPLICATE.md is filled in (versions, model, date, the folder)", !/\{\{\w+\}\}/.test(rep) && /2\.1\.283/.test(rep) && /claude-opus-5-5/.test(rep) && /~\/dylan-site/.test(rep) && new RegExp(new Date().toISOString().slice(0, 10)).test(rep));
  ok("scaffold: README.md is the template, with its nine sections and no template notes above them", /^# Case study: dylan$/m.test(read(join(dir, "README.md"))) && (read(join(dir, "README.md")).match(/^## \d\. /gm) || []).length === 9 && !/^<!-- TEMPLATE/.test(read(join(dir, "README.md"))));
  // the template's links work where it sits (the kit's RUBRIC.md and JUDGE.md) and in the copy (its own, beside it)
  const linksOf = (f) => [...read(f).matchAll(/\]\((?!https?:|#)([^)#]+)/g)].map((m) => m[1]);
  ok("scaffold: README.md's links and the template's each reach a file", ["REPLICATE.md", "RUBRIC.md", "JUDGE.md"].every((f) => linksOf(join(dir, "README.md")).includes(f))
    && linksOf(join(dir, "README.md")).every((l) => existsSync(join(dir, l))) && linksOf(join(ROOT, "eval/case-studies/TEMPLATE.md")).every((l) => existsSync(join(ROOT, "eval/case-studies", l))),
    JSON.stringify([linksOf(join(dir, "README.md")), linksOf(join(ROOT, "eval/case-studies/TEMPLATE.md"))]));
  ok("scaffold: a case study is made once", reel("dylan", "--prompt", promptSrc, "--into", "cs").code === 1);
  // --from: the commit and its files, nothing copied
  const repo = join(tmp, "repo"); mkdirSync(repo);
  const git = (...a) => execFileSync("git", ["-C", repo, "-c", "user.email=t@t", "-c", "user.name=t", ...a], { encoding: "utf8" });
  git("init", "-q"); writeFileSync(join(repo, "a.txt"), "a"); writeFileSync(join(repo, "b.txt"), "b"); git("add", "."); git("commit", "-qm", "two files");
  const fr = spawnSync("node", [join(ROOT, "scripts/case-study.mjs"), "brown", "--prompt", promptSrc, "--from", "HEAD", "--into", join(tmp, "cs")], { cwd: repo, encoding: "utf8" });
  const sha = git("rev-parse", "HEAD").trim();
  ok("scaffold: --from records the commit and its file list", fr.status === 0 && read(join(tmp, "cs/brown/start/commit.txt")).trim() === sha && read(join(tmp, "cs/brown/start/files.txt")).trim() === "a.txt\nb.txt" && /commit `[0-9a-f]{12}` \(2 files\)/.test(read(join(tmp, "cs/brown/REPLICATE.md"))), fr.stdout + fr.stderr);

  // ---------- the preflight ----------
  const pre = (home, folder) => spawnSync("sh", [join(dir, "arms/text/preflight.sh")], { cwd: folder, env: { ...process.env, HOME: home, REELPLANNING_HOME: join(home, ".reelplanning") }, encoding: "utf8" });   // the new home's own memory, not the runner's scratch one
  const home = join(tmp, "home"), site = join(home, "dylan-site"); mkdirSync(site, { recursive: true });
  execFileSync("git", ["-C", site, "init", "-q"]);
  const p0 = pre(home, site);
  ok("preflight: an empty folder in a new home passes those checks", /✓ folder ~\/dylan-site: empty \(git init only\)/.test(p0.stdout) && /✓ no ~\/\.claude\/CLAUDE\.md/.test(p0.stdout) && /✓ no past sessions/.test(p0.stdout) && /✓ no ~\/\.reelplanning\/you\.jsonl/.test(p0.stdout), p0.stdout);
  writeFileSync(join(site, "index.html"), "<p>left over</p>");
  mkdirSync(join(home, ".claude"), { recursive: true }); writeFileSync(join(home, ".claude/CLAUDE.md"), "Always use React.");
  const p1 = pre(home, site);
  ok("preflight: flags a folder that is not empty", /✗ folder ~\/dylan-site: 1 file\(s\) already in it/.test(p1.stdout), p1.stdout);
  ok("preflight: flags a planted ~/.claude/CLAUDE.md", /✗ ~\/\.claude\/CLAUDE\.md/.test(p1.stdout), p1.stdout);
  ok("preflight: a failing line stops the arm (exit 1, and says so)", p1.status === 1 && /✗ preflight: stop/.test(p1.stdout), `exit ${p1.status}`);
  ok("preflight: one line a check, the verdict last", p1.stdout.trim().split("\n").length === 7 && /preflight:/.test(p1.stdout.trim().split("\n").pop()), p1.stdout);

  // ---------- provenance ----------
  // provenance.sh: valid JSON, a missing tool "not found", no secret or email from the arm's config
  const cfg = join(tmp, "arm-claude"); mkdirSync(cfg);
  writeFileSync(join(cfg, "settings.json"), JSON.stringify({ permissions: { defaultMode: "plan" }, env: { DISABLE_AUTOUPDATER: "1", SOME_API_KEY: "sk-spec-secret" } }));
  writeFileSync(join(cfg, ".claude.json"), JSON.stringify({ oauthAccount: { emailAddress: "someone@example.com" }, autoUpdates: false }));
  const ps = spawnSync("sh", [join(ROOT, "eval/case-studies/kit/provenance.sh"), "text", "claude-opus-5-5", "--permission-mode", "plan"],
    { cwd: site, encoding: "utf8", env: { PATH: process.env.PATH, HOME: home, CLAUDE_CONFIG_DIR: cfg, DISABLE_AUTOUPDATER: "1", ANTHROPIC_API_KEY: "sk-spec-env" } });
  let pj = null; try { pj = JSON.parse(ps.stdout); } catch { /* checked below */ }
  ok("provenance.sh: prints JSON (the date, the machine, the tools, how the arm starts, its settings), and no secret or email",
    ps.status === 0 && pj && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d[+-]\d\d:\d\d$/.test(pj.recorded) && pj.machine?.kernel && pj.tools?.node === process.version
    && pj.claude_code?.started_with === "claude --model claude-opus-5-5 --permission-mode plan" && pj.claude_code?.config?.settings?.permissions?.defaultMode === "plan"
    && pj.claude_code?.config?.settings?.env?.SOME_API_KEY === "(set)" && pj.claude_code?.env.includes("DISABLE_AUTOUPDATER=1") && pj.reelplanning === "not used by this arm"
    && !/sk-spec|someone@example\.com/.test(ps.stdout), ps.stdout + ps.stderr);
  ok("provenance.sh: needs the arm and the model", spawnSync("sh", [join(ROOT, "eval/case-studies/kit/provenance.sh"), "text"], { encoding: "utf8" }).status === 2);
  // the transcript step: a fake transcript, one session and one subagent, with the metadata Claude Code writes
  const tr = join(tmp, "transcripts"), proj = join(tr, "-home-agent-dylan-site"), sub = join(proj, "s1", "subagents");
  mkdirSync(sub, { recursive: true });
  const at = (m) => `2026-10-07T09:${String(m).padStart(2, "0")}:00.000Z`;
  const base = (m, v = "2.1.283") => ({ sessionId: "s1", timestamp: at(m), version: v, entrypoint: "cli", cwd: "/home/agent/dylan-site" });
  const asst = (m, id, model, content, x = {}) => ({ ...base(m), type: "assistant", effort: "high", message: { id, model, role: "assistant", content }, ...x });
  const lines = [
    { ...base(0), type: "user", permissionMode: "default", origin: { kind: "human" }, message: { role: "user", content: "SECRET PROMPT: build the Dylan site" } },
    asst(1, "m1", "claude-opus-5-5", [{ type: "thinking", thinking: "SECRET THOUGHT" }]),
    asst(1, "m1", "claude-opus-5-5", [{ type: "tool_use", id: "t1", name: "Bash", input: { command: "SECRET COMMAND" } }]),
    { ...base(2), type: "user", message: { role: "user", content: [{ type: "tool_result", tool_use_id: "t1", content: "SECRET OUTPUT" }] } },
    asst(3, "m2", "claude-opus-5-5", [{ type: "text", text: "SECRET ANSWER" }]),
    asst(3, "m3", "<synthetic>", [{ type: "text", text: "SECRET ERROR" }]),
    { ...base(4), type: "user", isMeta: true, message: { role: "user", content: "SECRET META" } },
    { ...base(4), type: "user", origin: { kind: "task-notification" }, message: { role: "user", content: "SECRET NOTE" } },
    { type: "cost-state", sessionId: "s1", totalCostUSD: 1.2345 },
    { ...base(30, "2.1.284"), type: "user", permissionMode: "plan", origin: { kind: "human" }, message: { role: "user", content: "SECRET SECOND PROMPT" } },
    asst(31, "m4", "claude-sonnet-5-5", [{ type: "tool_use", id: "t2", name: "Skill", input: { skill: "plan-to-video", args: "SECRET ARGS" } }], { version: "2.1.284" }),
  ];
  writeFileSync(join(proj, "s1.jsonl"), lines.map((l) => JSON.stringify(l)).join("\n") + "\nnot json\n");
  writeFileSync(join(sub, "agent-a1.jsonl"), [
    { ...base(10), type: "user", isSidechain: true, message: { role: "user", content: "SECRET TASK" } },
    asst(11, "m5", "claude-haiku-5", [{ type: "tool_use", id: "t3", name: "Read", input: { file_path: "/SECRET" } }], { isSidechain: true }),
  ].map((l) => JSON.stringify(l)).join("\n") + "\n");
  const narr = join(tmp, "narrated", ".reelplanning/plans/p/video/.hyperframes"); mkdirSync(narr, { recursive: true });
  writeFileSync(join(narr, "narration.json"), JSON.stringify({ version: 1, voice: "am_michael", speed: 1.25, model: "kokoro-v1.0 + whisper small.en", lines: { "01": { text: "SECRET LINE" }, "02": {} } }));
  writeFileSync(join(dir, "arms/ours/provenance.json"), JSON.stringify({ arm: "ours", claude_code: { version: "2.1.283 (Claude Code)" } }));
  const pv = reel("provenance", "dylan", "ours", tr, "--site", join(tmp, "narrated"), "--into", "cs");
  const pf = read(join(dir, "arms/ours/provenance.json")), t = (JSON.parse(pf).transcript || {});
  ok("provenance: what ran, from the transcript: each model with its responses, the Claude Code versions, the first and last times",
    pv.code === 0 && JSON.stringify(t.models) === JSON.stringify({ "claude-opus-5-5": 2, "claude-haiku-5": 1, "claude-sonnet-5-5": 1 })
    && t.claude_code_versions?.["2.1.283"] === 10 && t.claude_code_versions?.["2.1.284"] === 2 && t.first === at(0) && t.last === at(31), pv.out + pf);
  ok("provenance: counts the person's prompts, the responses, the tool calls (by tool, skills by name), the modes and the cost",
    t.files === 2 && t.sessions === 1 && t.prompts === 2 && t.responses === 5 && t.tool_calls === 3 && JSON.stringify(t.tools) === JSON.stringify({ Bash: 1, Read: 1, Skill: 1 })
    && t.skills?.["plan-to-video"] === 1 && JSON.stringify(t.permission_modes) === JSON.stringify({ default: 1, plan: 1 }) && t.effort?.high === 5 && t.reported_cost_usd === 1.23
    && t.per_file?.map((f) => f.kind).join() === "session,subagent", pf);
  ok("provenance: keeps what provenance.sh wrote, adds the voice each video was narrated with, and copies no message text",
    JSON.parse(pf).claude_code?.version === "2.1.283 (Claude Code)" && JSON.stringify(JSON.parse(pf).narration) === JSON.stringify([{ video: ".reelplanning/plans/p/video", voice: "am_michael", speed: 1.25, model: "kokoro-v1.0 + whisper small.en", lines: 2 }])
    && !/SECRET/.test(pf) && /claude-opus-5-5 ×2/.test(pv.out), pf);
  const pv1 = reel("provenance", "dylan", "ours", join(tmp, "no-transcripts"), "--into", "cs"), pv2 = reel("provenance", "dylan", "ours", join(tmp, "narrated"), "--into", "cs");
  ok("provenance: refused with no such folder, or no transcript in it", pv1.code === 1 && /no such folder/.test(pv1.out) && pv2.code === 1 && /no transcript/.test(pv2.out), pv1.out + pv2.out);

  // ---------- the report ----------
  const r0 = reel("report", "dylan", "--into", "cs");
  const html0 = existsSync(join(dir, "case-study.html")) ? read(join(dir, "case-study.html")) : "";
  ok("report: builds case-study.html from the folder, as a draft", r0.code === 0 && /a draft, 0 of 9 sections filled/.test(r0.out) && /<strong>Draft\.<\/strong>/.test(html0), r0.out);
  ok("report: the nine sections, in the template's order", [1, 2, 3, 4, 5, 6, 7, 8, 9].every((n, i, a) => i === 0 || html0.indexOf(`id="s${n}"`) > html0.indexOf(`id="s${a[i - 1]}"`)) && (html0.match(/<section id="s\d">/g) || []).length === 9);
  ok("report: the prompt is on the page", html0.includes("Build an interactive website about Bob Dylan"));
  ok("report: warns on each empty section", (r0.out.match(/^△ section \d/gm) || []).length === 9 && /△ section 3 \(The feedback sheet\) is empty: the points \(FEEDBACK\.md\)/.test(r0.out), r0.out);
  rmSync(join(dir, "case-study.html"));
  const r1 = reel("report", "dylan", "--into", "cs", "--publish");
  ok("report --publish: refuses while a section is empty, and writes nothing", r1.code === 1 && /✗ not ready to publish: 9 of 9/.test(r1.out) && !existsSync(join(dir, "case-study.html")), r1.out);

  // ---------- keeping a site (D-247) ----------
  const g = (cwd, ...a) => spawnSync("git", ["-c", "user.email=spec@example.com", "-c", "user.name=spec", ...a], { cwd, encoding: "utf8" });
  const makeSite = (d, words) => { mkdirSync(join(d, "css"), { recursive: true }); g(d, "init", "-q");
    writeFileSync(join(d, "index.html"), `<h1>${words}</h1>`); writeFileSync(join(d, "css", "site.css"), "h1{color:red}"); writeFileSync(join(d, ".gitignore"), "node_modules/\n");
    g(d, "add", "-A"); g(d, "commit", "-qm", "the first page");
    writeFileSync(join(d, "about.html"), "<p>about</p>"); g(d, "add", "-A"); g(d, "commit", "-qm", "an about page");
    mkdirSync(join(d, "node_modules", "x"), { recursive: true }); writeFileSync(join(d, "node_modules", "x", "i.js"), "1"); };
  const ours = join(dir, "arms", "ours"), oursSite = join(ours, "site");
  makeSite(oursSite, "Ours");
  const headOurs = g(oursSite, "rev-parse", "HEAD").stdout.trim();
  writeFileSync(join(oursSite, "index.html"), "<h1>Ours, changed</h1>");
  const k0 = reel("keep", "dylan", "ours", "--into", "cs");
  ok("keep: refused while the site has changes not committed, nothing written", k0.code === 1 && /changes not committed/.test(k0.out) && !existsSync(join(ours, "site.bundle")) && existsSync(join(oursSite, ".git")), k0.out);
  g(oursSite, "checkout", "-q", "--", "index.html");
  const k1 = reel("keep", "dylan", "ours", "--into", "cs");
  ok("keep: in place, the site's history is saved as site.bundle, and site/ is left as plain files", k1.code === 0 && existsSync(join(ours, "site.bundle")) && !existsSync(join(oursSite, ".git")) && read(join(oursSite, "index.html")) === "<h1>Ours</h1>" && existsSync(join(oursSite, "css", "site.css")) && /4 file\(s\), as plain files \(its own \.git taken out\)/.test(k1.out) && /2 commit\(s\).*git bundle verify: ok/.test(k1.out), k1.out);
  ok("keep: in place, what the site's git ignored stays on disk and is named in the arm's .gitignore, so this repo leaves it out",
    existsSync(join(oursSite, "node_modules", "x", "i.js")) && read(join(ours, ".gitignore")).split("\n").includes("/site/node_modules/") && /1 path\(s\) the site's git ignored/.test(k1.out), k1.out);
  const vf = join(tmp, "verify"); mkdirSync(vf); g(vf, "init", "-q");
  ok("keep: the bundle verifies (git bundle verify)", g(vf, "bundle", "verify", join(ours, "site.bundle")).status === 0);
  const back = join(tmp, "ours-again"); g(tmp, "clone", "-q", join(ours, "site.bundle"), back);
  ok("keep: the bundle clones to the site's history, every commit, the last one the files kept", g(back, "rev-parse", "HEAD").stdout.trim() === headOurs && g(back, "rev-list", "--count", "HEAD").stdout.trim() === "2" && read(join(back, "about.html")) === read(join(oursSite, "about.html")));
  const k2 = reel("keep", "dylan", "ours", "--into", "cs");
  ok("keep: a site kept already has no .git to keep from, and says so", k2.code === 1 && /no \.git of its own/.test(k2.out) && /kept already/.test(k2.out), k2.out);
  // from a clone elsewhere: the files git tracks are copied in (not node_modules/, not .git)
  const elsewhere = join(tmp, "text-site"); mkdirSync(elsewhere); makeSite(elsewhere, "Text");
  const textSite = join(dir, "arms", "text", "site");
  rmSync(textSite, { recursive: true, force: true });   // a fresh clone has no arms/<arm>/site/: git keeps no empty folder
  const k3 = reel("keep", "dylan", "text", elsewhere, "--into", "cs");
  ok("keep: from a folder elsewhere, its tracked files copied into site/ and its history bundled", k3.code === 0 && read(join(textSite, "index.html")) === "<h1>Text</h1>" && existsSync(join(textSite, ".gitignore")) && !existsSync(join(textSite, "node_modules")) && !existsSync(join(textSite, ".git")) && existsSync(join(elsewhere, ".git")) && existsSync(join(dir, "arms", "text", "site.bundle")), k3.out);
  const k4 = reel("keep", "dylan", "text", elsewhere, "--into", "cs");
  ok("keep: over a kept site, refused without --replace; with it, kept again", k4.code === 1 && /not empty.*--replace/.test(k4.out) && reel("keep", "dylan", "text", elsewhere, "--replace", "--into", "cs").code === 0, k4.out);
  const k5 = reel("keep", "dylan", "html", join(tmp, "no-repo-here"), "--into", "cs");
  mkdirSync(join(tmp, "plain")); writeFileSync(join(tmp, "plain", "index.html"), "x");
  const k6 = reel("keep", "dylan", "html", join(tmp, "plain"), "--into", "cs"), k7 = reel("keep", "dylan", "nope", "--into", "cs");
  ok("keep: refused with no such folder, a folder with no .git of its own (not the repo above it), or an arm that isn't one", k5.code === 1 && /no such folder/.test(k5.out) && k6.code === 1 && /no \.git of its own/.test(k6.out) && k7.code === 1 && /the arm is one of text, html, ours/.test(k7.out), k5.out + k6.out + k7.out);
  // D-305: a history holding a voice file or a render is refused (the bundle is committed here); the command it prints fixes it
  ok("keep: what counts as media (a voice file, a video, a render under .reelplanning/; not the site's own pictures)",
    isMedia(".reelplanning/plans/p/video/assets/voice/01.wav") && isMedia(".reelplanning/system-video/renders/chapters/ch1.mp4") && isMedia(".reelplanning/plans/p/video/renders/x.png")
    && !isMedia("img/cover.jpg") && !isMedia("audio/song.mp3") && !isMedia(".reelplanning/plans/p/plan.md"));
  const loud = join(tmp, "loud-site"); mkdirSync(loud); makeSite(loud, "Loud");
  const voice = join(loud, ".reelplanning/plans/p/video/assets/voice"); mkdirSync(voice, { recursive: true });
  writeFileSync(join(voice, "01.wav"), "RIFF"); writeFileSync(join(loud, ".reelplanning/plans/p/plan.md"), "# A plan\n");
  g(loud, "add", "-A"); g(loud, "commit", "-qm", "the plan and its video");
  const km = reel("keep", "dylan", "html", loud, "--into", "cs");
  ok("keep: refused when the site's history holds a voice file, and says how to take it out", km.code === 1 && /D-305/.test(km.out) && /1 voice file\(s\), video\(s\) or render\(s\)/.test(km.out) && /filter-branch/.test(km.out) && !existsSync(join(dir, "arms/html/site.bundle")), km.out);
  const fix = km.out.split("\n").filter((l) => /^ {2}(cat|git -C) /.test(l)).map((l) => l.trim());
  const who = { GIT_AUTHOR_NAME: "spec", GIT_AUTHOR_EMAIL: "spec@example.com", GIT_COMMITTER_NAME: "spec", GIT_COMMITTER_EMAIL: "spec@example.com" };
  const fixed = spawnSync("sh", ["-c", fix.join(" && ")], { cwd: tmp, encoding: "utf8", env: { ...process.env, ...who, FILTER_BRANCH_SQUELCH_WARNING: "1" } });
  const kf = reel("keep", "dylan", "html", loud, "--into", "cs");
  ok("keep: the three printed commands take the voice file out of every commit (it stays on disk, ignored), the plan stays, and then it keeps",
    fix.length === 3 && fixed.status === 0 && !g(loud, "log", "--branches", "--name-only", "--format=").stdout.includes(".wav") && g(loud, "ls-files").stdout.includes(".reelplanning/plans/p/plan.md")
    && existsSync(join(voice, "01.wav")) && kf.code === 0 && existsSync(join(dir, "arms/html/site.bundle")), fix.join("\n") + fixed.stderr + kf.out);
  rmSync(join(dir, "arms/html/site"), { recursive: true, force: true }); rmSync(join(dir, "arms/html/site.bundle"), { force: true }); mkdirSync(join(dir, "arms/html/site"));
  const c0 = reel("keep", "dylan", "--check", "--into", "cs");
  ok("keep --check: each arm kept is checked, one not kept yet is said", c0.code === 0 && /✓ ours: site\/ as plain files, site\.bundle verifies/.test(c0.out) && /✓ text:/.test(c0.out) && /· html: not kept yet/.test(c0.out), c0.out);
  writeFileSync(join(dir, "arms", "text", "site.bundle"), "not a bundle");
  const c1 = reel("keep", "dylan", "--check", "--into", "cs");
  ok("keep --check: a bundle that does not verify fails (exit 1)", c1.code === 1 && /✗ text: site\.bundle/.test(c1.out), c1.out);
  reel("keep", "dylan", "text", elsewhere, "--replace", "--into", "cs");

  // fill every section, then take one arm's cell out of the feedback sheet
  fillAll(dir);
  const r2 = reel("report", "dylan", "--into", "cs", "--publish");
  ok("report: section 5 waits for every arm's site to be kept", r2.code === 1 && /△ section 5 \(The sites\) is empty: the site kept for html \(arms\/<arm>\/site\/ and site\.bundle: reel case-study keep\)/.test(r2.out), r2.out);
  const htmlSite = join(tmp, "html-site"); mkdirSync(htmlSite); makeSite(htmlSite, "HTML");
  reel("keep", "dylan", "html", htmlSite, "--into", "cs");
  const fb = read(join(dir, "FEEDBACK.md"));
  writeFileSync(join(dir, "FEEDBACK.md"), fb.replace("| 1 | _fill in: a point_ | | | |", "| 1 | Eras first, then albums | raised: in chat | covered | raised: on the frame |").replace(/^\| [2-5] \| _fill in: a point_ \| \| \| \|\n/gm, ""));
  writeFileSync(join(dir, "FEEDBACK.md"), read(join(dir, "FEEDBACK.md")).replace("| raised: on the frame |", "| |"));
  const r3 = reel("report", "dylan", "--into", "cs", "--publish");
  ok("report --publish: a missing cell for one arm is an empty section", r3.code === 1 && /△ section 3 \(The feedback sheet\) is empty: a cell on every point for ours \(FEEDBACK\.md\)/.test(r3.out) && /1 of 9 sections are empty \(3\)/.test(r3.out), r3.out);
  writeFileSync(join(dir, "FEEDBACK.md"), read(join(dir, "FEEDBACK.md")).replace("| covered | |", "| covered | raised: on the frame |"));
  const r4 = reel("report", "dylan", "--into", "cs", "--publish");
  const html4 = existsSync(join(dir, "case-study.html")) ? read(join(dir, "case-study.html")) : "";
  ok("report --publish: with all nine filled, it builds the page, with no draft line and no warnings", r4.code === 0 && /all 9 sections filled: ready to publish/.test(r4.out) && !/△/.test(r4.out) && html4 && !/<strong>Draft\.<\/strong>/.test(html4) && !/class="todo"/.test(html4), r4.out);
  ok("report: the page links each kept site and its bundle", ["text", "html", "ours"].every((a) => html4.includes(`<a href="arms/${a}/site.bundle">site.bundle</a>`)));
  ok("report: the numbers reach the page (a bar per arm and stage, the judge's scores, the key)", (html4.match(/class="bar a-/g) || []).length === 21 && /<span class="score">4<\/span>/.test(html4) && /X <span class="dim">\(Ours \(reelplanning\)\)<\/span>/.test(html4) && /Eras first, then albums/.test(html4) && /<span class="tag t-raised">raised<\/span>/.test(html4));
  ok("report: the page has light and dark themes and no outside requests", /prefers-color-scheme:dark/.test(html4) && /:root\[data-theme="dark"\]/.test(html4) && !/<(script|link)[^>]+(src|href)="https?:/.test(html4));
  ok("report: the template's notes never reach the page", !/fill in|<!--/.test(html4.replace(/<style>[\s\S]*?<\/style>/, "")));

  // ---------- arm.sh: running an arm on your own machine (RUNBOOK.md, "Locally") ----------
  // its notes, stages and status, on a scratch case-study checkout (REEL_CS_WORKTREE) and a scratch HOME; setup
  // and done need the network and Claude Code, and are checked by hand (RUNBOOK.md, "Checked")
  const armSh = join(ROOT, "eval/case-studies/kit/arm.sh");
  const wt = join(tmp, "results"), armHome = join(tmp, "arm-home"), branch = "case-study/bob-dylan-2026-10-06";
  for (const a of ARMS) mkdirSync(join(wt, "eval/case-studies/bob-dylan-site/arms", a), { recursive: true });
  g(wt, "init", "-q"); g(wt, "checkout", "-q", "-b", branch);
  const arm = (...a) => { const r = spawnSync("sh", [armSh, ...a], { cwd: ROOT, encoding: "utf8", env: { ...process.env, HOME: armHome, REEL_CS_WORKTREE: wt } }); return { code: r.status, out: `${r.stdout}${r.stderr}` }; };
  const notes = (a) => { const f = join(wt, "eval/case-studies/bob-dylan-site/arms", a, "notes.md"); return existsSync(f) ? read(f) : ""; };
  ok("arm.sh: parses (sh -n)", spawnSync("sh", ["-n", armSh]).status === 0);
  const u = arm();
  ok("arm.sh: with nothing, the usage (exit 2): set up, stage, note, done, status", u.code === 2 && ["<arm> stage <stage> start|end", "<arm> note \"<text>\"", "<arm> done", "status"].every((s) => u.out.includes(s)), u.out);
  ok("arm.sh: an arm that is not one of the three is refused", arm("dylan", "note", "x").code === 1);
  const st = [arm("text", "stage", "plan", "start"), arm("text", "stage", "check the result", "end"), arm("text", "stage", "check", "start"), arm("text", "note", "plan: 12 of my minutes; raised point 2 in chat")];
  const tl = notes("text").split("\n").filter((l) => l.startsWith("- "));
  const stamp = "^- \\d{4}-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d [+-]\\d{4} · ";
  ok("arm.sh: stage and note add a line with the time to arms/<arm>/notes.md, a stage by its number and name",
    st.every((r) => r.code === 0) && /^# The text arm: notes/.test(notes("text")) && tl.length === 4
    && new RegExp(`${stamp}stage 1, plan: start$`).test(tl[0]) && new RegExp(`${stamp}stage 5, check the result: end$`).test(tl[1]) && new RegExp(`${stamp}stage 5, check the result: start$`).test(tl[2])
    && new RegExp(`${stamp}plan: 12 of my minutes; raised point 2 in chat$`).test(tl[3]), st.map((r) => r.out).join("") + notes("text"));
  const bad = [arm("text", "stage", "lunch", "start"), arm("text", "stage", "plan", "maybe"), arm("text", "note")];
  ok("arm.sh: a stage that is not one of the seven, a stage with no start or end, a note with no text: refused, nothing added",
    bad.every((r) => r.code === 1) && /<stage>: plan review revise build check-the-result fix done/.test(bad[0].out) && notes("text").split("\n").filter((l) => l.startsWith("- ")).length === 4, bad.map((r) => r.out).join(""));
  // each arm's state: html set up, ours running (a transcript), text done, then pushed
  const armDir = (a) => join(armHome, "reel-case-study", a);
  for (const a of ARMS) mkdirSync(armDir(a), { recursive: true });
  writeFileSync(join(armDir("html"), "state"), "setup 2026-10-06 09:00:00 +0000\n");
  writeFileSync(join(armDir("ours"), "state"), "setup 2026-10-06 09:00:00 +0000\nstarted 2026-10-06 09:01:00 +0000\n");
  mkdirSync(join(armDir("ours"), "claude/projects/p"), { recursive: true }); writeFileSync(join(armDir("ours"), "claude/projects/p/s.jsonl"), "{}\n");
  writeFileSync(join(armDir("text"), "state"), "setup 2026-10-06 09:00:00 +0000\ndone 2026-10-06 12:00:00 +0000\n");
  const row = (out, a) => (out.split("\n").find((l) => l.trim().startsWith(`${a} `)) || "").trim();
  const s1 = arm("status");
  ok("arm.sh status: each arm's state, and its last note", s1.code === 0 && s1.out.includes(`on ${branch}`) && /^text +done \(not pushed yet\) +\(last note: .*raised point 2 in chat\)$/.test(row(s1.out, "text"))
    && /^html +set up$/.test(row(s1.out, "html")) && /^ours +running$/.test(row(s1.out, "ours")), s1.out);
  g(wt, "commit", "-q", "--allow-empty", "-m", "Bob Dylan case study, text: the finished site");
  g(wt, "update-ref", `refs/remotes/origin/${branch}`, "HEAD");
  rmSync(armDir("html"), { recursive: true });
  const s2 = arm("status");
  ok("arm.sh status: pushed once the arm's commit is on origin; not started with no folder", /^text +pushed \([0-9a-f]+\)/.test(row(s2.out, "text")) && /^html +not started$/.test(row(s2.out, "html")), s2.out);
  const again = arm("text");
  ok("arm.sh: an arm that is over is not set up again", again.code === 1 && /the text arm is over/.test(again.out), again.out);
  // snapshot: ours's videos as they are, voice included, v1, v2 …; publish needs the network and Claude Code (by hand)
  const oursRp = join(armDir("ours"), "dylan-site/.reelplanning");
  ok("arm.sh snapshot: only ours makes videos", arm("text", "snapshot").code === 1);
  mkdirSync(oursRp, { recursive: true }); writeFileSync(join(oursRp, "decisions.md"), "# Decisions\n");
  const none = arm("ours", "snapshot");
  ok("arm.sh snapshot: no built video yet is refused, and leaves no folder", none.code === 1 && /no built video/.test(none.out) && !existsSync(join(armDir("ours"), "snapshots/v1")), none.out);
  const vid = join(oursRp, "plans/2026-10-06-dylan/video");
  mkdirSync(join(vid, "assets"), { recursive: true }); writeFileSync(join(vid, "index.html"), "<html></html>"); writeFileSync(join(vid, "assets/s1.mp3"), "voice");
  const sn = [arm("ours", "snapshot"), arm("ours", "snapshot")], v1 = join(armDir("ours"), "snapshots/v1");
  ok("arm.sh snapshot: the videos with their voice and .reelplanning's own files, v1 then v2, each with a note",
    sn.every((r) => r.code === 0) && existsSync(join(v1, ".reelplanning/plans/2026-10-06-dylan/video/assets/s1.mp3")) && existsSync(join(v1, ".reelplanning/decisions.md"))
    && existsSync(join(armDir("ours"), "snapshots/v2/.reelplanning/plans/2026-10-06-dylan/video/index.html")) && /snapshot v2 of ours's videos/.test(notes("ours")), sn.map((r) => r.out).join(""));
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

/** Every section filled, as if the three arms had run (the feedback sheet is left to the caller). */
function fillAll(dir) {
  for (const a of ARMS) {
    const p = join(dir, "arms", a, "SHEET.md");
    writeFileSync(p, read(p).replace("```text\n```", "```text\n✓ folder ~/dylan-site: empty (git init only)\n✓ preflight: nothing to read but the prompt\n```"));
    for (const k of ["phone", "desktop"]) for (const i of [1, 2, 3]) writeFileSync(join(dir, "arms", a, "shots", `site-${k}-${i}.png`), "png");
  }
  const d = emptyData(), put = (f, x) => writeFileSync(join(dir, "data", f), JSON.stringify(x, null, 2));
  for (const a of ARMS) for (const s of STAGES) d["times.json"].arms[a][s] = { clock: 10, yours: 4 };
  for (const a of ARMS) d["counts.json"].arms[a] = { questions: 3, decisions: 5, kept: 4 };
  for (const a of ARMS) d["sites.json"].arms[a].run = "`npx serve site`";
  for (const x of ["X", "Y", "Z"]) for (const m of d["judge.json"].measures) d["judge.json"].sites[x].scores[m] = { score: 4, evidence: "Seen at 390 px." };
  Object.assign(d["judge.json"], { ranking: ["X", "Z", "Y"], reasons: "X connects songs across eras." });
  Object.assign(d["key.json"], { X: "ours", Y: "text", Z: "html" });
  Object.assign(d["ranking.json"], { ranking: ["ours", "html", "text"], why: "Ours was the only one I understood before the build." });
  for (const a of ARMS) d["links.json"].arms[a] = [{ kind: "plan", label: "the plan", href: `arms/${a}/SHEET.md` }];
  for (const [f, x] of Object.entries(d)) put(f, x);
  const readme = join(dir, "README.md");
  writeFileSync(readme, read(readme).replace(/_fill in: [^_]*_/g, "Written up."));
}

console.log(failed ? `✗ ${failed} failed` : "✓ case-study: all checks passed");
if (failed) process.exit(1);
