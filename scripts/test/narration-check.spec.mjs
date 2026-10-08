#!/usr/bin/env node
// `reelplanning narration-check` (scripts/narration-check.mjs) against the fake APIs narrate-api.spec uses
// (fake-tts-apis.mjs): no real key, no network, no Kokoro, no whisper.
//   - no flag: the settings from .reelplanning/config.json, said as where they came from; the speech, the word
//     timings (count, the first words, covering the audio) and the cost of a minute, each a line; nothing written
//   - flags over config.json: openai + groq, the requests' shapes; openrouter, one key, mp3 made a wav
//   - a missing key: nothing sent, the variable named and where to set it; exit 1
//   - a refused key (401): the API's status and answer, what to change, the key never printed (even when the
//     API's answer quotes it); a model the API does not have (404) says to check the model
//   - --keep writes the wav and the timings; a bad flag is a usage error (exit 2)
//   - keys in .reelplanning/.env: read from the repo's root (over a .env there) and from a video folder, the shell's
//     key over the file's; a warning when git would commit the file, or has (setup's narration line too)
//   - this machine's ~/.reelplanning/.env (a scratch HOME): read last; its REELPLANNING_TTS picks the engine with no
//     config.json; the engine line names the file a setting or key came from; the repo's .env and the shell win
//     over it; REELPLANNING_HOME moves it
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { ROOT, testPort } from "../lib/env.mjs";
import { parseWav } from "../lib/tts-api.mjs";
import { fakeTtsApis, KEYS } from "./fake-tts-apis.mjs";

let failed = 0;
const ok = (name, cond, detail = "") => { console.log(`${cond ? "✓" : "✗"} ${name}${!cond && detail ? `\n  ${String(detail).slice(0, 1500)}` : ""}`); if (!cond) failed++; };

const api = await fakeTtsApis(testPort(28660));
const { BASE, log } = api;
api.delay = 10;
const tmp = mkdtempSync(join(tmpdir(), "rp-narration-check-spec-"));
const REPO = join(tmp, "repo");
// this machine's ~/.reelplanning/.env is read by every check: a scratch one (REELPLANNING_HOME), never the real one
const RPHOME = join(tmp, "rp-home");
const config = (narration) => { mkdirSync(join(REPO, ".reelplanning"), { recursive: true }); writeFileSync(join(REPO, ".reelplanning", "config.json"), JSON.stringify({ narration }, null, 2)); };
const files = (d) => readdirSync(d, { recursive: true }).map(String).sort().join("\n");
const baseEnv = Object.fromEntries(Object.entries(process.env).filter(([k]) => !/^(REELPLANNING_|HYPERFRAMES_TTS|HF_MEDIA)/.test(k) && !/_API_KEY$/.test(k)));
const check = (args = [], env = {}, cwd = REPO) => new Promise((done) => {
  const before = log.length;
  const all = Object.fromEntries(Object.entries({ ...baseEnv, ...KEYS, REELPLANNING_TTS_RETRY_MS: "5", REELPLANNING_HOME: RPHOME, ...env }).filter(([, v]) => v != null));
  const c = spawn(process.execPath, [join(ROOT, "bin", "reelplanning.mjs"), "narration-check", ...args], { cwd, env: all, stdio: ["ignore", "pipe", "pipe"] });
  let out = ""; c.stdout.on("data", (d) => { out += d; }); c.stderr.on("data", (d) => { out += d; });
  c.on("close", (code) => done({ code, out, reqs: log.slice(before) }));
});
const noKeyIn = (text, extra = []) => ![...Object.values(KEYS), ...extra].some((k) => text.includes(k));
const line = (r, start) => r.out.split("\n").find((l) => l.startsWith(start)) || "";

try {
  mkdirSync(REPO, { recursive: true });

  // ── no flag: config.json's narration ──
  config({ tts: "deepinfra", base_url: `${BASE}/deepinfra/v1` });
  const before = files(REPO);
  const r1 = await check();
  ok("no flag: the engine from config.json, said with where it came from", r1.code === 0 && /^engine: deepinfra hexgrad\/Kokoro-82M at 127\.0\.0\.1:\d+ \(key DEEPINFRA_API_KEY\), voice am_michael, ×1\.25, word timings from the provider's own — from \.reelplanning\/config\.json's narration$/m.test(r1.out), r1.out);
  ok("…one speech request, its seconds, the audio's length and format", r1.reqs.length === 1 && r1.reqs[0].json.text === "Bob Dylan released Blood on the Tracks in 1975." && /^✓ speech: \d+\.\d s for 2\.70 s of audio, wav 24000 Hz mono 16-bit \(sent as base64 wav in JSON\)$/m.test(r1.out), r1.out);
  ok("…the word timings: the count, the first words with start and end, covering the audio", /^✓ word timings: 9 words in \d+\.\d s: Bob 0\.00–0\.25, Dylan 0\.30–0\.55, released 0\.60–0\.85, Blood 0\.90–1\.15, …; 0\.00–2\.65 s of 2\.70 s, covering the audio$/m.test(r1.out), line(r1, "✓ word"));
  ok("…the cost of a minute, from the documented price per character", /^cost: about \$0\.0006 a minute of narration: speech \$0\.62 per 1M characters \(this sentence came at 17 characters a second\), timings with the speech$/m.test(r1.out), line(r1, "cost"));
  ok("…works, and nothing is written in the repo", /^✓ narration-check: deepinfra hexgrad\/Kokoro-82M \+ its word timings works$/m.test(r1.out) && files(REPO) === before && noKeyIn(r1.out), files(REPO));

  // ── flags over config.json: openai + groq ──
  config({ tts: "deepinfra", base_url: `${BASE}/deepinfra/v1`, timings_api: "groq", timings_base_url: `${BASE}/groq/openai/v1` });
  const r2 = await check(["--tts", "openai", "--base-url", `${BASE}/openai/v1`, "--timings-api", "groq", "--text", "It's a check, one two three."]);
  const sp2 = r2.reqs.find((q) => q.path.endsWith("/audio/speech")), tr2 = r2.reqs.find((q) => q.path.endsWith("/transcriptions"));
  ok("flags: openai's speech (its default model and voice, not config.json's deepinfra ones), groq's timings", r2.code === 0 && sp2?.json.model === "gpt-4o-mini-tts" && sp2.json.voice === "onyx" && sp2.json.input === "It's a check, one two three." && sp2.headers.authorization === `Bearer ${KEYS.OPENAI_API_KEY}` && tr2?.form.model === "whisper-large-v3-turbo" && tr2.headers.authorization === `Bearer ${KEYS.GROQ_API_KEY}`
    && /word timings from groq whisper-large-v3-turbo at 127\.0\.0\.1:\d+ \(key GROQ_API_KEY\) — from the command line and \.reelplanning\/config\.json's narration/.test(r2.out), r2.out);
  ok("…the sentence's own words timed, though the transcriber heard \"its\"; the cost of both", /^✓ word timings: 6 words in \d+\.\d s: It's 0\.00–0\.25, a 0\.30–0\.55, check, 0\.60–0\.85, one 0\.90–1\.15, …/m.test(r2.out) && /^cost: about \$0\.016 a minute of narration: speech about \$0\.015 a minute, timings \$0\.04 an hour$/m.test(r2.out) && /sent as audio\/wav/.test(r2.out), r2.out);

  // ── openrouter: one key for both, mp3 made a wav ──
  config({ timings_base_url: `${BASE}/openrouter/api/v1` });
  const keep = join(tmp, "kept");
  const r3 = await check(["--tts", "openrouter", "--model", "hexgrad/kokoro-82m", "--base-url", `${BASE}/openrouter/api/v1`, "--keep", keep], { GROQ_API_KEY: null, OPENAI_API_KEY: null });
  const sp3 = r3.reqs.find((q) => q.path.endsWith("/audio/speech")), tr3 = r3.reqs.find((q) => q.path.endsWith("/transcriptions"));
  ok("openrouter: its Kokoro speech as mp3, timed by its openai/whisper-1, one key for both", r3.code === 0 && sp3?.json.model === "hexgrad/kokoro-82m" && sp3.json.voice === "am_michael" && sp3.json.response_format === "mp3" && tr3?.form.model === "openai/whisper-1"
    && [sp3, tr3].every((q) => q.headers.authorization === `Bearer ${KEYS.OPENROUTER_API_KEY}`) && /\(key OPENROUTER_API_KEY, the same\)/.test(r3.out) && /sent as audio\/mpeg, made a wav by ffmpeg/.test(r3.out) && /^✓ word timings: 9 words/m.test(r3.out), r3.out);
  ok("…its cost, speech and timings", /^cost: about \$0\.0066 a minute of narration: speech from \$0\.62 per 1M characters, its DeepInfra route .*, timings \$0\.006 a minute$/m.test(r3.out), line(r3, "cost"));
  const kj = existsSync(join(keep, "narration-check.json")) && JSON.parse(readFileSync(join(keep, "narration-check.json"), "utf8"));
  ok("--keep: the wav and the word timings", parseWav(readFileSync(join(keep, "narration-check.wav")))?.sampleRate === 24000 && kj.words.length === 9 && kj.words[0].text === "Bob" && kj.model === "openrouter hexgrad/kokoro-82m + openrouter openai/whisper-1" && /^kept: .*narration-check\.wav/m.test(r3.out), JSON.stringify(kj).slice(0, 300));

  // ── a missing key ──
  const r4 = await check(["--tts", "deepinfra", "--base-url", `${BASE}/deepinfra/v1`], { DEEPINFRA_API_KEY: null });
  ok("a missing key: nothing sent, the variable named and where to put it (this machine's ~/.reelplanning/.env, or the repo's), exit 1", r4.code === 1 && r4.reqs.length === 0 && /^✗ speech: not sent: DEEPINFRA_API_KEY is not set$/m.test(r4.out) && /→ export DEEPINFRA_API_KEY=… in your shell, or put DEEPINFRA_API_KEY=… in ~\/\.reelplanning\/\.env \(this machine, every repo\) or the repo's \.reelplanning\/\.env \(git ignores it; never in config\.json\)/.test(r4.out) && /^✗ narration-check: .* does not work yet$/m.test(r4.out), r4.out);
  const r4b = await check(["--tts", "openai", "--base-url", `${BASE}/openai/v1`, "--timings-api", "groq"], { GROQ_API_KEY: null });
  ok("…a missing transcriber key: the speech is checked, the timings say what to set", r4b.code === 1 && /^✓ speech/m.test(r4b.out) && /^✗ word timings: not asked for: GROQ_API_KEY is not set$/m.test(r4b.out) && /console\.groq\.com\/keys/.test(r4b.out), r4b.out);

  // ── a refused key, an unknown model ──
  const BAD = "sk-or-wrong-key-123456";
  const r5 = await check(["--tts", "openrouter", "--model", "hexgrad/kokoro-82m", "--base-url", `${BASE}/openrouter/api/v1`], { OPENROUTER_API_KEY: BAD });
  ok("a refused key (401): the status and the API's answer, what to change, exit 1", r5.code === 1 && /^✗ speech: openrouter hexgrad\/kokoro-82m \/audio\/speech refused the key in OPENROUTER_API_KEY \(HTTP 401: .*Invalid key: …/m.test(r5.out) && /→ check OPENROUTER_API_KEY: it is set but refused; make a new one at https:\/\/openrouter\.ai\/settings\/keys/.test(r5.out), r5.out);
  ok("…and no key is printed, though the API's answer quoted it", noKeyIn(r5.out, [BAD]), r5.out);
  const r6 = await check(["--tts", "deepinfra", "--base-url", `${BASE}/deepinfra/v1`, "--model", "nobody/no-model"]);
  ok("a model the API does not have (404): says to check the model and the base URL", r6.code === 1 && /^✗ speech: deepinfra nobody\/no-model: HTTP 404/m.test(r6.out) && /→ check the model "nobody\/no-model" \(--model or narration\.model\) and the base URL/.test(r6.out), r6.out);

  // ── keys in .reelplanning/.env: read from the repo's root and from a video folder, the shell's over it, and a
  //    warning when git would commit it ──
  config({ tts: "deepinfra", base_url: `${BASE}/deepinfra/v1` });
  const ENVF = join(REPO, ".reelplanning", ".env"), VIDEO = join(REPO, ".reelplanning", "plans", "2026-10-08-x", "video");
  mkdirSync(VIDEO, { recursive: true });
  const STALE = "sk-a-stale-one-in-the-file";
  const authOf = (r) => r.reqs.find((q) => q.path.includes("/inference/"))?.headers.authorization;
  writeFileSync(ENVF, `# narration keys\nDEEPINFRA_API_KEY=${KEYS.DEEPINFRA_API_KEY}\n`);
  writeFileSync(join(REPO, ".env"), `DEEPINFRA_API_KEY=${STALE}\n`);
  const e1 = await check([], { DEEPINFRA_API_KEY: null });
  ok(".reelplanning/.env: its key is read from the repo's root, over a .env there", e1.code === 0 && authOf(e1) === `bearer ${KEYS.DEEPINFRA_API_KEY}` && noKeyIn(e1.out, [STALE]), e1.out);
  rmSync(join(REPO, ".env"));
  const e2 = await check([], { DEEPINFRA_API_KEY: null }, VIDEO);
  ok("…and from a video folder", e2.code === 0 && authOf(e2) === `bearer ${KEYS.DEEPINFRA_API_KEY}`, e2.out);
  writeFileSync(ENVF, `DEEPINFRA_API_KEY=${STALE}\n`);
  const e3 = await check([], { DEEPINFRA_API_KEY: KEYS.DEEPINFRA_API_KEY });
  ok("…the shell's key wins over the file's", e3.code === 0 && authOf(e3) === `bearer ${KEYS.DEEPINFRA_API_KEY}` && noKeyIn(e3.out, [STALE]), e3.out);
  const NOT_IGNORED = /^△ \.reelplanning\/\.env is not ignored by git, so its keys could be committed: add a line `\.env` to \.reelplanning\/\.gitignore/m;
  const git = (...a) => spawnSync("git", ["-C", REPO, ...a], { stdio: "ignore" }).status;
  const outsideGit = git("rev-parse", "--is-inside-work-tree") !== 0;
  ok("…outside a git repo, no warning", !outsideGit || !/△ \.reelplanning\/\.env/.test(e3.out), e3.out);
  git("init", "-q");
  const e4 = await check([], {}), d4 = spawnSync(process.execPath, [join(ROOT, "scripts", "lib", "narrator.mjs"), "describe", REPO], { encoding: "utf8", env: { ...baseEnv, ...KEYS, REELPLANNING_HOME: RPHOME } });
  ok("…in a git repo whose .reelplanning/.gitignore does not leave it out: narration-check and setup's narration line warn, naming no key",
    NOT_IGNORED.test(e4.out) && NOT_IGNORED.test(d4.stdout) && noKeyIn(e4.out + d4.stdout, [STALE]), e4.out + d4.stdout);
  writeFileSync(join(REPO, ".reelplanning", ".gitignore"), "inbox/\n.env\n");
  const e5 = await check([], {});
  ok("…with the line `reel init` writes there, no warning", e5.code === 0 && !/△ \.reelplanning\/\.env/.test(e5.out), e5.out);
  git("add", "-f", ".reelplanning/.env");
  const e6 = await check([], {});
  ok("…and committed already: says so, and how to take it out", /^△ \.reelplanning\/\.env is committed to git, keys and all: run `git rm --cached \.reelplanning\/\.env`/m.test(e6.out), e6.out);
  ok("the template `reel init` copies leaves .env out", readFileSync(join(ROOT, "templates", "reelplanning", "gitignore"), "utf8").split("\n").includes(".env"));
  rmSync(ENVF); rmSync(join(REPO, ".git"), { recursive: true, force: true }); rmSync(join(REPO, ".reelplanning", ".gitignore"));

  // ── this machine's ~/.reelplanning/.env (HOME pointed at a scratch folder): read last, for every repo; its
  //    REELPLANNING_TTS picks the engine with no config.json narration; the engine line says it came from there ──
  const HOME = join(tmp, "home"), MACHINE = join(HOME, ".reelplanning", ".env");
  mkdirSync(join(HOME, ".reelplanning"), { recursive: true });
  const atHome = { HOME, REELPLANNING_HOME: null, DEEPINFRA_API_KEY: null };
  config(undefined);   // config.json names no engine
  writeFileSync(MACHINE, `REELPLANNING_TTS=deepinfra\nREELPLANNING_TTS_BASE_URL=${BASE}/deepinfra/v1\nDEEPINFRA_API_KEY=${KEYS.DEEPINFRA_API_KEY}\n`);
  const m1 = await check([], atHome);
  ok("~/.reelplanning/.env: its REELPLANNING_TTS picks the engine and its key is used, with no narration in config.json",
    m1.code === 0 && authOf(m1) === `bearer ${KEYS.DEEPINFRA_API_KEY}` && noKeyIn(m1.out), m1.out);
  ok("…the engine line says where the setting and the key came from, never the key",
    / \(key DEEPINFRA_API_KEY from ~\/\.reelplanning\/\.env\), .* — from REELPLANNING_TTS in ~\/\.reelplanning\/\.env and REELPLANNING_TTS_BASE_URL in ~\/\.reelplanning\/\.env$/m.test(line(m1, "engine: ")), m1.out);
  const d5 = spawnSync(process.execPath, [join(ROOT, "scripts", "lib", "narrator.mjs"), "describe", REPO], { encoding: "utf8", env: Object.fromEntries(Object.entries({ ...baseEnv, ...atHome }).filter(([, v]) => v != null)) });
  ok("…setup's narration line too", d5.status === 0 && /^narration: deepinfra hexgrad\/Kokoro-82M \(DEEPINFRA_API_KEY\), .*\(from REELPLANNING_TTS in ~\/\.reelplanning\/\.env and /m.test(d5.stdout) && noKeyIn(d5.stdout), d5.stdout + d5.stderr);
  writeFileSync(ENVF, `DEEPINFRA_API_KEY=${KEYS.DEEPINFRA_API_KEY}\n`);
  writeFileSync(MACHINE, `REELPLANNING_TTS=deepinfra\nREELPLANNING_TTS_BASE_URL=${BASE}/deepinfra/v1\nDEEPINFRA_API_KEY=${STALE}\n`);
  const m2 = await check([], atHome);
  ok("…the repo's .reelplanning/.env wins over it, and the line says so", m2.code === 0 && authOf(m2) === `bearer ${KEYS.DEEPINFRA_API_KEY}` && /\(key DEEPINFRA_API_KEY from \.reelplanning\/\.env\)/.test(m2.out) && noKeyIn(m2.out, [STALE]), m2.out);
  rmSync(ENVF);
  const m3 = await check([], { ...atHome, DEEPINFRA_API_KEY: KEYS.DEEPINFRA_API_KEY });
  ok("…and so does the shell (its key named with no file)", m3.code === 0 && authOf(m3) === `bearer ${KEYS.DEEPINFRA_API_KEY}` && /\(key DEEPINFRA_API_KEY\), /.test(m3.out) && noKeyIn(m3.out, [STALE]), m3.out);
  writeFileSync(ENVF, `REELPLANNING_TTS=elevenlabs\n`);
  const m4 = await check([], { ...atHome, DEEPINFRA_API_KEY: KEYS.DEEPINFRA_API_KEY, ELEVENLABS_API_KEY: null });   // (no key: nothing sent)
  ok("…a REELPLANNING_TTS in the repo's .reelplanning/.env picks the engine over the machine's", m4.reqs.length === 0 && /^engine: elevenlabs /m.test(m4.out) && / — from REELPLANNING_TTS in \.reelplanning\/\.env/.test(m4.out), m4.out);
  const m5 = await check([], { ...atHome, REELPLANNING_TTS: "elevenlabs", DEEPINFRA_API_KEY: KEYS.DEEPINFRA_API_KEY, ELEVENLABS_API_KEY: null });
  ok("…and one in the shell", m5.reqs.length === 0 && /^engine: elevenlabs /m.test(m5.out) && / — from REELPLANNING_TTS and REELPLANNING_TTS_BASE_URL in ~\/\.reelplanning\/\.env$/m.test(line(m5, "engine: ")), m5.out);
  rmSync(ENVF);
  const ELSEWHERE = join(tmp, "rp-home-elsewhere");
  mkdirSync(ELSEWHERE, { recursive: true });
  writeFileSync(join(ELSEWHERE, ".env"), `REELPLANNING_TTS=deepinfra\nREELPLANNING_TTS_BASE_URL=${BASE}/deepinfra/v1\nDEEPINFRA_API_KEY=${KEYS.DEEPINFRA_API_KEY}\n`);
  writeFileSync(MACHINE, "REELPLANNING_TTS=elevenlabs\n");
  const m6 = await check([], { ...atHome, REELPLANNING_HOME: ELSEWHERE });
  ok("…REELPLANNING_HOME moves it (as it moves your memory): its .env is read instead", m6.code === 0 && authOf(m6) === `bearer ${KEYS.DEEPINFRA_API_KEY}` && line(m6, "engine: ").includes(`from REELPLANNING_TTS in ${join(ELSEWHERE, ".env")}`), m6.out);
  // a repo under your home with no .reelplanning/ of its own: ~/.reelplanning is the machine's, not the repo's root
  const UNDER = join(HOME, "code", "proj");
  mkdirSync(UNDER, { recursive: true });
  writeFileSync(MACHINE, `REELPLANNING_TTS=deepinfra\nREELPLANNING_TTS_BASE_URL=${BASE}/deepinfra/v1\nDEEPINFRA_API_KEY=${KEYS.DEEPINFRA_API_KEY}\n`);
  writeFileSync(join(HOME, ".reelplanning", "config.json"), JSON.stringify({ narration: { tts: "elevenlabs" } }));   // never read as a repo's
  const m7 = await check([], atHome, UNDER);
  ok("…a repo under HOME with no .reelplanning/ of its own does not take ~/.reelplanning for its own (its config.json unread, its .env the machine's)",
    m7.code === 0 && authOf(m7) === `bearer ${KEYS.DEEPINFRA_API_KEY}` && / — from REELPLANNING_TTS in ~\/\.reelplanning\/\.env/.test(m7.out) && !/config\.json/.test(line(m7, "engine: ")), m7.out);
  rmSync(MACHINE); rmSync(join(HOME, ".reelplanning", "config.json"));

  // ── usage ──
  const r7 = await check(["--tts", "espeak"]);
  const r7b = await check(["--colour", "red"]);
  ok("a provider there is not, or a flag there is not: a usage error (exit 2)", r7.code === 2 && /--tts "espeak" is not one of/.test(r7.out) && r7b.code === 2 && /unknown argument --colour/.test(r7b.out), r7.out + r7b.out);
  ok("reelplanning --help lists it, and --help after it prints its usage", (await new Promise((d) => { const c = spawn(process.execPath, [join(ROOT, "bin", "reelplanning.mjs"), "--help"]); let o = ""; c.stdout.on("data", (x) => { o += x; }); c.on("close", () => d(/narration-check/.test(o))); }))
    && /usage: reelplanning narration-check/.test((await check(["--help"])).out));
} finally {
  api.close();
  rmSync(tmp, { recursive: true, force: true });
}
console.log(failed ? `\n✗ ${failed} failed` : "\n✓ narration-check: one sentence through the engine, through fake APIs");
process.exit(failed ? 1 : 0);
