#!/usr/bin/env node
// The repo-wide list of which video explains each word (videos-you-can-follow, step 1): every video's
// `- defines:` lines in the project record, keyed by the glossary's words, written to
// .reelplanner/terms-index.json. finish-project runs it after the plan map; `reel prereqs` reads it to
// find the earlier video a word needs, and the plan map gives each glossary row the beat that explains it.
//
// It says which glossary rows no beat of the system video defines: the system video is the promise that
// every row is explained (check-terms fails the system video's build on one), so each is a row the
// system video is behind on.
//
// usage: reelplanner terms-index <video-dir or .reelplanner dir> [--json]
import { writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { rpDirFor, definesIndex } from "./lib/terms.mjs";

const argv = process.argv.slice(2), dir = argv.find((a) => !a.startsWith("--")) || ".";
const rp = rpDirFor(dir);
if (!rp || !existsSync(join(rp, "glossary.md"))) { console.log("· terms index: no .reelplanner/glossary.md above this video; nothing to index"); process.exit(0); }
const idx = definesIndex(rp);
const out = { note: "Written by finish-project (reelplanner terms-index): which video explains each word, from every storyboard's `- defines:` lines. The system video's beats come first.", words: Object.fromEntries(Object.entries(idx.words).sort(([a], [b]) => a.localeCompare(b))), undefined: idx.undefined };
writeFileSync(join(rp, "terms-index.json"), JSON.stringify(out, null, 2) + "\n");
if (argv.includes("--json")) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }
const n = Object.keys(out.words).length, bySystem = Object.values(out.words).filter((l) => l[0]?.video === "system").length;
console.log(`terms index: ${n} word(s) defined, ${bySystem} by the system video → ${relative(process.cwd(), join(rp, "terms-index.json")) || "terms-index.json"}`);
if (idx.undefined.length) console.log(`△ no beat of the system video defines: ${idx.undefined.join(", ")} — the system video is behind the glossary (\`- defines: <term>\` on the beat that explains it)`);
