#!/usr/bin/env node
// `reel pr-check`: what a pull request (PR) carries, against the line for a video and what lands on main
// (the contributing plan, steps 1 to 4; D-214, D-200, D-201, D-202, D-213, D-215, D-171).
//
//   the line (D-214, narrowed by D-223)  a PR gets the walkthrough video (the change running, pausing at
//                      what you'd notice) when it changes over 300 lines outside tests, docs, videos and
//                      generated files, when the contributor ticks "makes a choice you'd notice or can't easily
//                      undo" in the PR template, or when a maintainer adds `needs-video`. `no-video` waives it.
//                      A new flag, command or dependency seen in the diff is only named: it never crosses the
//                      line by itself (the plan review of 2026-09-27 08:31: "the flag here is simple enough").
//   other choices      (D-223) any other choice is a line in the PR's text, under "## Other choices" (what it
//                      chose, instead of what), that a maintainer accepts by ticking "The other choices above
//                      are accepted": until then it waits (and fails with --merge).
//   the video          over the line, the PR brings a plan folder with its videos' text, or a maintainer makes
//                      it (D-200); "needs a video" is said as what is missing, not as the contributor's failure
//   fresh (D-202)      each video's plan map against plan.md by hash, and each row of walkthrough.md against its
//                      stop, and against where step 2's rule puts it (a call you'd notice or can't easily
//                      undo, or an off-plan change, pauses; the video listing it is stale), until the video is approved (a plan video by its plan review, a walkthrough by a
//                      maintainer's); the video's branch, video/pr-<n> (D-215)
//   no media (D-213)   no voice file, image or video added under .reelplanner/plans/ or explainers/
//   no voice or render (D-305)  no .wav, .mp4 or renders/ file added anywhere: a finished video people should
//                      watch goes up as a release file or on the hosted page (a worked example plays a committed .mp3)
//   ids (D-171)        an id on the branch never names a different entry than on the base
//   the issue          with config.json's `"pr": { "issue": "required" }` (on the base or the branch, so a PR
//                      cannot switch it off for itself): the PR's text links an issue ("Closes #12", "Refs #12",
//                      "owner/repo#12" or an issues URL); none fails. Off by default (templates/reelplanner/config.json)
//   what lands         the two columns: what lands on main, what stays in the PR; "not tidy" while a PR whose
//                      walkthrough a maintainer accepted still carries a contributor's reviews
//
// usage: reelplanner pr-check [<repo>] [--base <ref>] [--pr <n>] [--event <file>] [--body-file <file>]
//                              [--labels a,b] [--merge] [--tidy] [--json]
//   --base       what the PR merges into (default origin/main); the diff is from where the branch left it
//   --pr         the PR's number, read with `gh pr view` (default: the current branch's PR, if gh knows one)
//   --event      a GitHub pull_request event (CI hands it as $GITHUB_EVENT_PATH, read by default there):
//                the PR's number, text, labels and where its branch lives
//   --body-file, --labels   the PR's text and labels given directly (over the event and gh)
//   --merge      the check before merging: a PR still waiting for a video or a maintainer's review fails too
//   --tidy       once a maintainer has accepted the walkthrough: remove the contributor's reviews from the
//                branch in one commit ("tidy: the contributor's reviews stay in the PR's history")
// Exit 1 on anything marked ✗.
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve, basename, relative } from "node:path";
import { createHash } from "node:crypto";
import { readPlanMd } from "./lib/plan-md.mjs";
import { parseCalls, PAUSING } from "./lib/autonomy.mjs";
import { listReviews, verdictOf } from "./lib/reviews.mjs";
import { maintainersOf, maintainerOf, roleOf, MEDIA, entryKey, issueRule, linkedIssues } from "./lib/contributing.mjs";
import { callsTouched, callWords } from "./lib/call-lines.mjs";
import { rpDirOf, otherRpPath } from "./lib/env.mjs";

const LINES = 300;
const argv = process.argv.slice(2);
const valued = new Set(["--base", "--pr", "--event", "--body-file", "--labels"]);
const flag = (n) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };
const has = (n) => argv.includes(`--${n}`);
const pos = argv.filter((a, i) => !a.startsWith("--") && !valued.has(argv[i - 1]));
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

const git = (...a) => execFileSync("git", ["-C", ROOT, ...a], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 256 << 20 });
const tryGit = (...a) => { try { return git(...a); } catch { return null; } };
// a record file as `ref` has it: in .reelplanner/, or in .reelplanning/ on a base from before the rename (D-312)
const recordAt = (ref, file) => tryGit("show", `${ref}:.reelplanner/${file}`) ?? tryGit("show", `${ref}:.reelplanning/${file}`);
let ROOT;
try { ROOT = execFileSync("git", ["-C", resolve(pos[0] || "."), "rev-parse", "--show-toplevel"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim(); }
catch { die(`${resolve(pos[0] || ".")} is not in a git repo`); }
const RP = rpDirOf(ROOT), rel = (p) => relative(process.cwd(), p) || ".";
const base = flag("base") || "origin/main";
if (!tryGit("rev-parse", "--verify", "--quiet", `${base}^{commit}`)) die(`no ${base} to compare with (fetch it, or pass --base <ref>)`);
const fork = git("merge-base", base, "HEAD").trim();

// ---------- the PR: its number, text, labels, and where its branch lives ----------
function thePr() {
  let pr = null;
  const evPath = flag("event") || (/^pull_request/.test(process.env.GITHUB_EVENT_NAME || "") ? process.env.GITHUB_EVENT_PATH : null);
  if (evPath && existsSync(evPath)) {
    const p = JSON.parse(readFileSync(evPath, "utf8")).pull_request;
    if (p) pr = { number: p.number, body: p.body || "", labels: (p.labels || []).map((l) => l.name), url: p.head?.repo?.clone_url || null, via: "the event" };
  }
  if (!pr) {
    try {
      const j = JSON.parse(execFileSync("gh", ["pr", "view", ...(flag("pr") ? [flag("pr")] : []), "--json", "number,body,labels,headRepository,headRepositoryOwner,isCrossRepository"], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }));
      const url = j.isCrossRepository && j.headRepositoryOwner?.login && j.headRepository?.name ? `https://github.com/${j.headRepositoryOwner.login}/${j.headRepository.name}.git` : null;
      pr = { number: j.number, body: j.body || "", labels: (j.labels || []).map((l) => l.name), url, via: "gh pr view" };
    } catch { /* no gh, not logged in, or no PR for this branch */ }
  }
  pr ||= { number: flag("pr") ? Number(flag("pr")) : null, body: null, labels: [], url: null, via: null };
  if (flag("body-file")) pr.body = readFileSync(resolve(flag("body-file")), "utf8"), pr.via ||= "--body-file";
  if (flag("labels") != null) pr.labels = flag("labels").split(",").map((x) => x.trim()).filter(Boolean), pr.via ||= "--labels";
  return pr;
}
const pr = thePr();
const ticked = (re) => (String(pr.body || "").match(new RegExp(`^\\s*[-*]\\s*\\[[xX]\\]\\s*(?:This PR\\s+)?${re}[^\\n]*`, "mi")) || [])[0] || null;
const choiceLine = ticked("makes a choice"), bringsLine = ticked("brings a video");
// the choice named after the box's words (the box says "…you'd notice or can't easily undo:"; before D-223, "…the other way:")
const named = choiceLine ? (choiceLine.split(/(?:other way|easily undo)\s*[:—-]\s*/i)[1] || "").replace(/<[^>]*>/g, "").trim() : "";
// the other choices (D-223): one line each under "## Other choices" in the PR's text, what it chose instead of what;
// a maintainer ticks "The other choices above are accepted"
const otherChoices = (() => {
  const sec = (String(pr.body || "").match(/^##\s*Other choices\b[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/mi) || [])[1] || "";
  return sec.replace(/<!--[\s\S]*?-->/g, "").split("\n").map((l) => (l.match(/^\s*[-*]\s+(?!\[[ xX]\])(.*\S)\s*$/) || [])[1]).filter(Boolean);
})();
const choicesAccepted = !!ticked("The other choices above are accepted");

// ---------- the diff: from where the branch left the base to HEAD ----------
// A record file the rename moved from .reelplanning/ to .reelplanner/ as it was (D-312) is not something the PR
// changes or adds: its plan, its reviews and its media were there before.
const moved = new Set();
{
  const r = (tryGit("diff", "--name-status", "-z", "-M100%", "--diff-filter=R", fork, "HEAD") || "").split("\0");
  for (let i = 0; i + 2 < r.length; i += 3) if (/^R/.test(r[i]) && otherRpPath(r[i + 1]) === r[i + 2]) { moved.add(r[i + 1]); moved.add(r[i + 2]); }
}
const numstat = git("diff", "--numstat", "--no-renames", fork, "HEAD").split("\n").filter(Boolean).map((l) => { const [a, d, ...p] = l.split("\t"); return { path: p.join("\t"), lines: (Number(a) || 0) + (Number(d) || 0) }; }).filter((f) => !moved.has(f.path));
const added = new Set(git("diff", "--name-only", "--no-renames", "--diff-filter=A", fork, "HEAD").split("\n").filter((p) => p && !moved.has(p)));
// What does not count toward the 300 lines: tests, docs, videos and generated files. The project record
// (.reelplanner/: plans, reviews, videos, the log) is all of those. A file marked linguist-generated or
// linguist-documentation in .gitattributes is too.
const NOT_CODE = [
  [/(^|\/)(test|tests|__tests__|spec|specs)\//, "tests"], [/\.(spec|test)\.[cm]?[jt]sx?$/, "tests"],
  [/^docs\//, "docs"], [/\.(md|mdx|markdown|txt|rst|adoc)$/i, "docs"], [/(^|\/)(LICEN[CS]E|NOTICE|AUTHORS)[^/]*$/, "docs"],
  [/^\.reelplann(?:er|ing)\//, "the project record"], [/^videos\//, "videos"], [MEDIA, "videos"],
  [/(^|\/)(package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb?)$/, "generated"], [/^dist\//, "generated"],
];
const attrs = (() => {
  if (!numstat.length) return {};
  try {
    const out = execFileSync("git", ["-C", ROOT, "check-attr", "-z", "linguist-generated", "linguist-documentation", "--stdin"], { input: numstat.map((f) => f.path).join("\0") + "\0", encoding: "utf8" }).split("\0");
    const o = {}; for (let i = 0; i + 2 < out.length; i += 3) if (out[i + 2] === "set" || out[i + 2] === "true") o[out[i]] = out[i + 1] === "linguist-generated" ? "generated" : "docs";
    return o;
  } catch { return {}; }
})();
const whyNot = (p) => attrs[p] || NOT_CODE.find(([re]) => re.test(p))?.[1] || null;
const counted = numstat.filter((f) => !whyNot(f.path)), size = counted.reduce((a, f) => a + f.lines, 0);

// What the diff shows that is not a reason by itself: named, as a reminder to whoever ticks the box.
const seen = [];
{
  const deps = (ref) => { const t = ref ? tryGit("show", `${ref}:package.json`) : existsSync(join(ROOT, "package.json")) ? readFileSync(join(ROOT, "package.json"), "utf8") : null; try { return Object.keys(JSON.parse(t).dependencies || {}); } catch { return []; } };
  const before = new Set(deps(fork)); for (const d of deps("HEAD")) if (!before.has(d)) seen.push(`a new dependency: \`${d}\``);
  const flags = (ref) => new Set((tryGit("grep", "-ohE", "--", "--[a-z][a-z0-9-]+", ref, "--", "bin", "scripts", ":!scripts/test", ":!**/test/**") || "").split("\n").filter(Boolean));
  const was = flags(fork); for (const f of [...flags("HEAD")].filter((f) => !was.has(f)).sort()) seen.push(`a new flag: \`${f}\``);
  for (const f of [...added].filter((p) => /^bin\/[^/]+$/.test(p) || /^scripts\/[^/]+\.(mjs|js|sh)$/.test(p)).sort()) seen.push(`a new command: \`${f}\``);
}

// ---------- the line (D-214) ----------
const labels = new Set(pr.labels);
const reasons = [size > LINES && `${size} lines`, choiceLine && `ticked: a choice${named ? ` (${named})` : ""}`, labels.has("needs-video") && "`needs-video`"].filter(Boolean);
const waived = labels.has("no-video"), crosses = reasons.length > 0, needed = crosses && !waived;

// ---------- the plan folders this PR carries ----------
const changed = numstat.map((f) => f.path);
const planNames = [...new Set(changed.map((p) => (p.match(/^\.reelplann(?:er|ing)\/plans\/([^/]+)\//) || [])[1]).filter(Boolean))].sort();
const plans = planNames.map((name) => {
  const dir = join(RP, "plans", name), reviews = existsSync(join(dir, "reviews")) ? listReviews(dir) : [];
  const inPr = (r) => changed.includes(relative(ROOT, r.path));
  const videos = ["video", "walkthrough-video"].filter((v) => existsSync(join(dir, v, "STORYBOARD.md")) || existsSync(join(dir, v, "plan-map.json")));
  return { name, dir, reviews, inPr, videos, exists: existsSync(join(dir, "plan.md")) };
}).filter((p) => p.exists);
const maintainers = existsSync(RP) ? maintainersOf(RP) : [];
const approves = (r) => verdictOf(r.review) === "approve";
const accepted = (p) => p.reviews.some((r) => r.kind === "walkthrough" && approves(r) && roleOf(r.review, maintainers) !== "contributor");
const withVideo = plans.filter((p) => p.videos.includes("walkthrough-video") || p.videos.includes("video"));

const fails = [], waits = [], notes = [];
const say = { issue: [], line: [], video: [], fresh: [], lands: [], ids: [] };

// ---------- the issue: the PR's text links one, where config.json asks (`pr.issue`) ----------
const configHere = existsSync(join(RP, "config.json")) ? readFileSync(join(RP, "config.json"), "utf8") : null;
const issueRequired = [recordAt(base, "config.json"), configHere].some((t) => t && issueRule(t) === "required");
const issues = pr.body == null ? [] : linkedIssues(pr.body);
if (issues.length) say.issue.push(`links ${issues.length === 1 ? "an issue" : "issues"}: ${issues.join(", ")}`);
else if (issueRequired && pr.body == null) waits.push("no PR text read, so no linked issue seen (pass --body-file, or --pr <n> with gh): every PR here links an issue");
else if (issueRequired) fails.push("links no issue: every PR here links one (config.json's `pr.issue`). Open an issue for the change, or find the one it answers, and add a line to the PR's text: \"Closes #<number>\" (\"Refs #<number>\" if it should stay open; an issue in another repo: owner/repo#<number>, or its URL)");

// ---------- the other choices (D-223): a line each in the PR's text, accepted by a maintainer ----------
if (otherChoices.length) {
  say.line.push(`other choices, a line each in the PR's text (${otherChoices.length}): ${otherChoices.map((c) => `"${c}"`).join("; ")}`);
  const bare = otherChoices.filter((c) => !/\binstead of\b/i.test(c));
  if (bare.length) notes.push(`say what each other choice was chosen instead of ("…, instead of …"): ${bare.map((c) => `"${c}"`).join("; ")}`);
  if (!choicesAccepted) waits.push(`waiting for a maintainer to accept the ${otherChoices.length === 1 ? "other choice" : `${otherChoices.length} other choices`} in the PR's text (tick "The other choices above are accepted")`);
}

// ---------- the video: brought, or waiting ----------
if (bringsLine && !withVideo.length) fails.push("the PR's text says it brings a video, but no plan folder with a video's text is in the PR (.reelplanner/plans/<plan>/video/ or walkthrough-video/)");
if (needed && !withVideo.length) waits.push(`needs a video (${reasons.join(", ")}): the contributor brings one, or a maintainer's agent makes a walkthrough from the diff (the skill's "Several people"), or a maintainer adds \`no-video\``);
else if (needed && !withVideo.some(accepted)) waits.push(`waiting for a maintainer to accept the walkthrough of ${withVideo.map((p) => p.name).join(", ")}`);

// the video's branch (D-215): while a maintainer still has to watch it
if (pr.number && withVideo.length && !withVideo.every(accepted)) {
  const url = pr.url || tryGit("remote", "get-url", "origin")?.trim();
  const branch = `video/pr-${pr.number}`;
  if (!url) notes.push(`no remote to look for ${branch} on`);
  else {
    let heads = null; try { heads = execFileSync("git", ["-C", ROOT, "ls-remote", "--heads", url, branch], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"], timeout: 20000 }); } catch { /* offline */ }
    if (heads == null) notes.push(`could not look for ${branch} on ${url}`);
    else if (!heads.trim()) waits.push(`no ${branch} branch on ${url}: the built video goes there, packed (the skill's "Several people")`);
    else say.video.push(`the built video: ${branch} on ${url}`);
  }
}

// ---------- no media under a plan folder (D-213) ----------
// (an explainer's folder too, explain-first step 5, D-249: its text, never its built video)
const inPlanFolder = (p) => /^\.reelplann(?:er|ing)\/(?:plans|explainers)\//.test(p) && MEDIA.test(p);
for (const p of [...added].filter(inPlanFolder).sort())
  fails.push(`adds ${p}: ${/^\.reelplann(?:er|ing)\/explainers\//.test(p) ? "an explainer's folder" : "a plan folder"} carries only its videos' text; the built video goes on video/pr-<n> (templates/gitignore leaves it out)`);
// ---------- no voice file or render anywhere (D-305) ----------
// (a worked example under videos/ plays its narration from a committed .mp3)
const VOICE_OR_RENDER = /\.(wav|mp4)$|(^|\/)renders\//i;
for (const p of [...added].filter((p) => VOICE_OR_RENDER.test(p) && !inPlanFolder(p)).sort())
  fails.push(`adds ${p}: no voice file or render is committed anywhere (D-305); a finished video goes up as a release file or on the hosted page, and a worked example's narration as .mp3`);

// ---------- each video against the text it was built from (D-202) ----------
const hash = (x) => createHash("sha256").update(JSON.stringify(x)).digest("hex").slice(0, 12);
const rowText = (c) => [c.chose, c.insteadOf || "", c.why || "", c.check || ""].map((s) => String(s).replace(/`/g, "").replace(/\s+/g, " ").trim());
for (const p of plans) for (const v of p.videos) {
  const at = `${p.name}/${v}`, mapPath = join(p.dir, v, "plan-map.json");
  // approved already: plan.md is folded after a plan review (no new video), a row updated after the walkthrough's
  const done = v === "video" ? p.reviews.some((r) => r.kind === "plan" && approves(r)) : accepted(p);
  if (done) { say.fresh.push(`${at}: approved; the text may have moved on since (folds and fixes after the review)`); continue; }
  if (!existsSync(mapPath)) { fails.push(`${at}: no plan-map.json (the build writes it: reelplanner build ${rel(join(p.dir, v))})`); continue; }
  const map = JSON.parse(readFileSync(mapPath, "utf8"));
  if (!map.plan) fails.push(`${at}: its plan map carries no plan text (built before plan maps did): rebuild it`);
  else if (hash(map.plan) !== hash(readPlanMd(join(p.dir, "plan.md")))) fails.push(`${at}: built from another version of plan.md (${hash(map.plan)}, plan.md now ${hash(readPlanMd(join(p.dir, "plan.md")))}): rebuild it (reelplanner build ${rel(join(p.dir, v))})`);
  else say.fresh.push(`${at}: its plan map matches plan.md (${hash(map.plan)})`);
  if (v !== "walkthrough-video") continue;
  const wtPath = join(p.dir, "walkthrough.md");
  const rows = existsSync(wtPath) ? parseCalls(readFileSync(wtPath, "utf8")).filter((c) => c.kind !== "small") : [];
  const stops = new Map(), listed = new Set();
  for (const a of map.autonomy || []) stops.set(String(a.id).toLowerCase(), a);
  for (const g of map.autonomyGroups || []) for (const c of g.calls || []) { stops.set(String(c.id).toLowerCase(), c); if (g.list) listed.add(String(c.id).toLowerCase()); }
  const stale = [];
  for (const r of rows) {
    const s = stops.get(r.key);
    if (!s) stale.push(`${r.id} has no stop in the video`);
    else if (hash(rowText(r)) !== hash(rowText(s))) stale.push(`${r.id} reads otherwise than its stop`);
    // step 2's rule (walkthroughs-that-help): an off-plan change, or a call you'd notice or can't easily undo,
    // pauses the video; one the video only lists was built before its label said so
    else if (listed.has(r.key) && (r.kind === "deviation" || r.tags.some((t) => PAUSING.includes(t)))) stale.push(`${r.id} is on the video's list, but ${r.kind === "deviation" ? "an off-plan change" : `labelled ${r.tags.filter((t) => PAUSING.includes(t)).join(" and ")}`} it pauses`);
  }
  for (const k of stops.keys()) if (!rows.some((r) => r.key === k)) stale.push(`the video stops on ${k.toUpperCase()}, which walkthrough.md no longer has`);
  if (stale.length) fails.push(`${at}: built before the last change to walkthrough.md (${stale.join("; ")}): rebuild it`);
  else say.fresh.push(`${at}: its ${rows.length} row(s) match their stops`);
}

// ---------- ids (D-171) ----------
const log = (text) => { try { return JSON.parse(text).decisions || []; } catch { return null; } };
const baseLog = log(recordAt(base, "decisions.json")), headLog = log(recordAt("HEAD", "decisions.json"));
if (baseLog && headLog) {
  const onBase = new Map(baseLog.map((d) => [d.id, d])), clash = [];
  for (const d of headLog) if (onBase.has(d.id) && entryKey(onBase.get(d.id)) !== entryKey(d)) clash.push(`${d.id} (here ${d.plan}: ${d.chosen}; on ${base} ${onBase.get(d.id).plan}: ${onBase.get(d.id).chosen})`);
  const twice = headLog.map((d) => d.id).filter((id, i, a) => a.indexOf(id) !== i);
  if (clash.length) fails.push(`${clash.length === 1 ? "an id names" : `${clash.length} ids name`} a different entry than on ${base}: ${clash.slice(0, 4).join("; ")}${clash.length > 4 ? "; …" : ""}. Rebase on ${base} and run \`reel renumber\` (D-171)`);
  if (twice.length) fails.push(`the log holds ${[...new Set(twice)].join(", ")} twice: run \`reel renumber\``);
  if (!clash.length && !twice.length) say.ids.push(`ids: ${headLog.length - baseLog.length > 0 ? `${headLog.length - baseLog.length} new, after ${base}'s last` : "none new"}; none names another entry`);
}

// ---------- earlier calls this PR changes (D-306) ----------
// An accepted call is history: it comes back only when the PR changes the lines its plan's commits wrote (lib/call-lines.mjs).
// Said with △, for whoever reviews the PR; it never fails it.
const callsHit = existsSync(join(RP, "decisions.json")) ? (await callsTouched(RP, headLog || JSON.parse(readFileSync(join(RP, "decisions.json"), "utf8")).decisions || [], { repo: ROOT, base: fork })) || [] : [];
const callWarns = callsHit.map((x) => `changes lines of ${callWords(x)} (${Object.entries(x.lines).map(([f, n]) => `${n} in ${f}`).join(", ")}): keep to it, or say in the PR why it changes`);

// ---------- what lands on main, what stays in the PR (step 2, D-201) ----------
const prReviews = plans.flatMap((p) => p.reviews.filter(p.inPr).map((r) => ({ ...r, plan: p.name, role: roleOf(r.review, maintainers) })));
const stays = prReviews.filter((r) => r.role === "contributor");
// a review counted as a maintainer's only because `maintainers` lists "owner" (whoever published the page): say to list the id
for (const r of prReviews) { const w = maintainerOf(r.review, maintainers).warn; if (w) notes.push(`${r.plan}/reviews/${r.id}: ${w}`); }
const lands = [
  ...plans.map((p) => `${p.name}: plan.md${existsSync(join(p.dir, "walkthrough.md")) ? ", walkthrough.md" : ""}${existsSync(join(p.dir, "code-check", "findings.md")) ? ", code-check/findings.md" : ""}${p.videos.length ? `, the videos' text (${p.videos.join(", ")})` : ""}`),
  ...(headLog && baseLog && headLog.length > baseLog.length ? [`the log's ${headLog.length - baseLog.length} new entr${headLog.length - baseLog.length === 1 ? "y" : "ies"}, as they read now`] : []),
  ...prReviews.filter((r) => r.role !== "contributor").map((r) => `${r.plan}/reviews/${r.id} (${r.review?.recorded?.reviewer || "no reviewer recorded"})`),
];
if (plans.length) {
  say.lands.push(`lands on main: ${lands.join("; ") || "nothing of the record"}`);
  say.lands.push(`stays in the PR: ${stays.length ? stays.map((r) => `${r.plan}/reviews/${r.id} (${r.review?.recorded?.reviewer || "no reviewer recorded"})`).join("; ") : "nothing"}`);
}
const tidyNow = maintainers.length && stays.length && plans.some(accepted);
if (has("tidy")) {
  if (!maintainers.length) die("--tidy: config.json lists no maintainers, so every review counts: nothing to tidy");
  if (!plans.some(accepted)) die("--tidy: no maintainer has accepted a walkthrough in this PR yet; tidy once one has");
  if (!stays.length) { console.log("✓ tidy: no contributor's review on the branch"); process.exit(0); }
  const paths = stays.flatMap((r) => [r.path, r.md].filter((f) => existsSync(f))).map((f) => relative(ROOT, f));
  git("rm", "-q", "--", ...paths);
  git("commit", "-q", "-m", `tidy: the contributor's reviews stay in the PR's history\n\n${stays.map((r) => `- ${r.plan}/reviews/${r.id} (${r.review?.recorded?.reviewer || "no reviewer recorded"})`).join("\n")}`, "--", ...paths);
  console.log(`✓ tidy: removed ${stays.length} contributor's review(s) in one commit (${git("rev-parse", "--short", "HEAD").trim()}); they stay in the PR's history`);
  process.exit(0);
}
if (tidyNow) fails.push(`not tidy: a maintainer accepted the walkthrough, and the branch still carries ${stays.length} contributor's review(s): run \`reel pr-check --tidy\` before merging`);

// ---------- say it ----------
const counts = [...new Set(numstat.filter((f) => whyNot(f.path)).map((f) => whyNot(f.path)))];
say.line.push(`${crosses ? waived ? "over the line, waived by `no-video`" : "over the line" : "under the line: a normal code review, no video"} (${reasons.length ? reasons.join(", ") : `${size} line(s) of ${LINES}, box not ticked, no \`needs-video\``})`);
say.line.push(`size: ${size} changed line(s) in ${counted.length} file(s)${counts.length ? `, not counting ${counts.join(", ")}` : ""}`);
if (seen.length) say.line.push(`seen in the diff, not a reason by itself: ${seen.join(", ")}`);
if (!pr.via) notes.push("no PR text or labels read (pass --pr <n> with gh, --event, or --body-file and --labels): the box and the labels are taken as unticked and absent");
if (has("merge")) fails.push(...waits.splice(0));

if (has("json")) { console.log(JSON.stringify({ base, fork, pr: { number: pr.number, labels: pr.labels, via: pr.via }, issues, issueRequired, size, reasons, crosses, waived, seen, plans: plans.map((p) => p.name), fails, waits, notes, calls: callWarns, say, stays: stays.map((r) => `${r.plan}/${r.id}`) }, null, 2)); process.exit(fails.length ? 1 : 0); }
for (const l of Object.values(say).flat()) console.log(`· ${l}`);
for (const n of notes) console.log(`· ${n}`);
for (const w of callWarns) console.log(`△ ${w}`);
for (const w of waits) console.log(`△ ${w}`);
for (const f of fails) console.log(`✗ ${f}`);
console.log(`${fails.length ? "✗" : waits.length ? "△" : "✓"} ${pr.number ? `PR #${pr.number}` : basename(ROOT)} against ${base}: ${fails.length} problem(s), ${waits.length} waiting${has("merge") ? " (--merge: waiting fails)" : ""}`);
process.exit(fails.length ? 1 : 0);
