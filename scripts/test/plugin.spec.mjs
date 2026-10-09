#!/usr/bin/env node
// The Claude Code plugin: the skill's folder, and beside SKILL.md the hooks module that adds `/reel` (a pane that
// plays a plan's video, stops at each choice and files the answers as the player does; skills/plan-to-video/hooks/).
// Its manifest is its entry in .claude-plugin/marketplace.json (version.spec.mjs keeps it that way), so the plugin
// is named `reelplanner` only once installed. This spec lays the folder out as an install does (the entry written
// as .claude-plugin/plugin.json, in a scratch folder), then has Claude Code validate it and run its tests
// (scripts/test/plugin/*.test.tsx) against the engine. Without a `claude` that has `plugin test`, those two say so
// and pass: the checks before them still run. reel-frames, which streams the pane's picture, is run on a test clip.
import assert from "node:assert/strict";
import { readFileSync, existsSync, mkdtempSync, writeFileSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";
import { ROOT, scratchCopy } from "../lib/env.mjs";

let failed = 0;
const test = (name, fn) => { try { fn(); console.log(`✓ ${name}`); } catch (e) { failed++; console.error(`✗ ${name}\n  ${e.message}`); } };

const entry = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/marketplace.json"), "utf8")).plugins.find((p) => p.name === "reelplanner");
const dir = join(ROOT, entry.source);
const hooks = JSON.parse(readFileSync(join(dir, "hooks/hooks.json"), "utf8"));
const modules = hooks.modules.map((m) => join(dir, "hooks", m));

test("hooks.json names one hooks module, and it is there", () => {
  assert.equal(modules.length, 1);
  assert.ok(existsSync(modules[0]), modules[0]);
});
test("the entry names the state contract, and the contract declares the plugin's own name", () => {
  assert.ok(entry.types && existsSync(join(dir, entry.types)), `types: ${entry.types}`);
  assert.match(readFileSync(join(dir, entry.types), "utf8"), new RegExp(`interface PluginState \\{\\s*${entry.name}: \\{`));
});
test("every state reference in the module names the plugin as installed", () => {
  const src = readFileSync(modules[0], "utf8");
  const named = [...src.matchAll(/plugin: '([^']+)', key:/g)].map((m) => m[1]);
  assert.ok(named.length > 0);
  assert.deepEqual([...new Set(named)], [entry.name]);
});

// reel-frames, the pane's picture: on a two-second test clip standing in for a video's render
if (spawnSync("ffmpeg", ["-version"]).status !== 0) {
  console.log("- reel-frames: skipped (no ffmpeg)");
} else {
  const video = mkdtempSync(join(tmpdir(), "reelplanner-frames-"));
  writeFileSync(join(video, "index.html"), "<!doctype html>");
  mkdirSync(join(video, "renders"));
  spawnSync("ffmpeg", ["-loglevel", "error", "-f", "lavfi", "-i", "testsrc=size=320x180:rate=12:duration=2", "-pix_fmt", "yuv420p", join(video, "renders", "terminal.mp4")]);
  const frames = (...a) => spawnSync(process.execPath, [join(ROOT, "scripts/reel-frames.mjs"), video, ...a], { encoding: "utf8", timeout: 60_000 }).stdout.trim().split("\n");
  test("reel-frames: the render is found, not made again", () => {
    assert.deepEqual(frames("--render"), [`R ${join(video, "renders", "terminal.mp4")}`]);
  });
  test("reel-frames: a stretch plays as Raster cells, one half block per two pixels, at the video's pace", () => {
    const started = Date.now();
    const out = frames("--from", "0.5", "--to", "1.5", "--cols", "8", "--rows", "3", "--no-audio");
    assert.equal(out[0], "V 2.000 8 3");
    const f = out.filter((l) => l.startsWith("F "));
    assert.ok(f.length >= 11 && f.length <= 13, `${f.length} frames for a second at 12 fps`);
    const words = new Uint32Array(Uint8Array.from(Buffer.from(f[0].split(" ")[2], "base64")).buffer);
    assert.equal(words.length, 8 * 3 * 3);
    assert.ok(words.every((w, i) => i % 3 !== 0 || w === 0x2580), "every cell is a '▀'");
    assert.match(out[out.length - 1], /^E 1\.500$/);
    assert.ok(Date.now() - started >= 800, "played in real time, not dumped");
  });
  test("reel-frames: as JPEGs, a few a second, for the desktop and mobile apps", () => {
    const f = frames("--as", "jpeg", "--width", "96", "--fps", "3", "--to", "1", "--no-audio").filter((l) => l.startsWith("F "));
    assert.ok(f.length >= 2 && f.length <= 4, String(f.length));
    assert.ok(f.every((l) => l.split(" ")[2].startsWith("/9j/")), "each frame is a JPEG");
  });
}

const claude = spawnSync("claude", ["plugin", "test", "--help"], { encoding: "utf8" });
if (claude.status !== 0) {
  console.log("- validate and test: skipped (no `claude` with `plugin test` on PATH)");
} else {
  const out = mkdtempSync(join(tmpdir(), "reelplanner-plugin-"));
  const plugin = join(out, entry.name);
  scratchCopy(dir, plugin);
  mkdirSync(join(plugin, ".claude-plugin"), { recursive: true });
  const { name, version, description, types } = entry;
  writeFileSync(join(plugin, ".claude-plugin/plugin.json"), JSON.stringify({ name, version, description, types }, null, 2));
  mkdirSync(join(plugin, "tests"), { recursive: true });
  for (const f of readdirSync(join(ROOT, "scripts/test/plugin")).filter((f) => /\.test\.tsx?$/.test(f))) {
    copyFileSync(join(ROOT, "scripts/test/plugin", f), join(plugin, "tests", f));
  }
  const run = (...args) => spawnSync("claude", ["plugin", ...args, plugin], { encoding: "utf8", timeout: 300_000 });
  test("claude plugin validate passes", () => {
    const r = run("validate");
    assert.equal(r.status, 0, r.stdout + r.stderr);
  });
  test("claude plugin test passes (the pane on terminal, desktop and mobile; the row it files; the band)", () => {
    const r = run("test");
    const said = (r.stdout + r.stderr).split("\n").filter((l) => !/ENOENT/.test(l)).join("\n");
    assert.equal(r.status, 0, said);
    assert.match(said, /\b0 fail\b/, said);
  });
}

if (failed) process.exit(1);
