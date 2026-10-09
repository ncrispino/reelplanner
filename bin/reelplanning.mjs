#!/usr/bin/env node
// The command's old name: reelplanning is now reelplanner (D-312). Run by that name, it says so on stderr, then runs
// `reelplanner` with the same arguments. It goes in a later release.
process.stderr.write("△ the command is now `reelplanner`; `reelplanning` still works for now\n");
await import("./reelplanner.mjs");
