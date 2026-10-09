#!/usr/bin/env node
// The project-record CLI: init, new-plan, stage, check, record, audit, stops, prereqs, status, memory, retro, build, case-study, pr-check, renumber.
// Same as `reelplanner reel …`. See docs/project-dir.md for the format it manages.
import "../scripts/lib/node-check.mjs"; // first: an older Node stops here, told how to update
import { realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// reel.mjs reads process.argv.slice(2), which is already this command's own arguments
await import(pathToFileURL(join(dirname(realpathSync(fileURLToPath(import.meta.url))), "..", "scripts", "reel.mjs")).href);
