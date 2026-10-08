# Upstream issue draft: installed `media-use` imports a monorepo-only path

Draft for `heygen-com/hyperframes`. Nothing here is patched on our side: reelplanning pins the skills
to the tag of the CLI version in `package.json` (`scripts/hyperframes-skills.mjs`) and checks that
they load. We have not filed it; check their issues for a duplicate first.

---

**Title:** `media-use` installed via `skills update` / `init` cannot load: `scripts/lib/media-fetch.mjs` re-exports `../../../../packages/cli/src/…`

**Versions:** hyperframes CLI 0.8.62 (also 0.8.52 when it refreshes skills from main). Skills from
`main` at `d4485b51f` (the v0.8.62 tag); broken since v0.8.59. Installer `skills@1.7.0`. Node 22.22.2,
Linux.

**Introduced by:** 3091dcb78, "feat(cli): route media search through media-use (#4230)". It turned
`skills/media-use/scripts/lib/media-fetch.mjs` into this shim:

```js
// Compatibility copy for the audio helpers that still import the historical
// skill-relative path. The CLI-owned engine is the source of truth.
export {
  fetchMedia,
  isPublicMediaUrl,
} from "../../../../packages/cli/src/media-use/lib/media-fetch.mjs";
```

That relative path resolves inside the monorepo. An installed skill lives at
`~/.claude/skills/media-use/`, where it resolves to `~/.claude/packages/cli/src/…`, which never exists.

**Repro** (clean HOME, nothing else installed):

```sh
export HOME=$(mktemp -d)
npx -y hyperframes@0.8.62 skills update faceless-explainer   # or: npx hyperframes@0.8.62 init demo --non-interactive
node -e 'import(process.env.HOME + "/.claude/skills/media-use/audio/scripts/lib/tts.mjs").catch(e => console.log(e.code, e.message))'
node ~/.claude/skills/faceless-explainer/scripts/assemble-index.mjs --help
```

**Expected:** both load.

**Actual:** both fail the same way:

```
ERR_MODULE_NOT_FOUND Cannot find module '<HOME>/.claude/packages/cli/src/media-use/lib/media-fetch.mjs'
imported from <HOME>/.claude/skills/media-use/scripts/lib/media-fetch.mjs
```

**What it takes down:** everything that loads the audio helpers.

- `media-use/audio/scripts/lib/tts.mjs` and `heygen.mjs` import `../../../scripts/lib/media-fetch.mjs`. That covers TTS and HeyGen voice.
- `faceless-explainer/scripts/assemble-index.mjs` goes through `bgm.mjs → heygen.mjs → media-fetch.mjs`, so Step 5's assemble fails for every faceless-explainer project.
- `captions.mjs`, `transitions.mjs` and `media-use/scripts/transcribe.mjs` still load. So a workflow gets part-way and then dies at assemble.

**Why CI missed it (a guess):** the commit adds a copy-parity check that allowlists "the standalone
media-fetch shim". The skill tests run from the monorepo, where the relative path resolves. An
install-then-import smoke test run from a real `skills add` location would catch it. For example,
`import()` every `scripts/*.mjs` entry under `~/.claude/skills/*` after installing.

**Related:** `init` and `skills update` install skills from GitHub `main`, whatever the CLI version.
So a pinned CLI still receives unpinned skills, and `init --skip-skills` is currently ignored
(`HYPERFRAMES_SKIP_SKILLS=1` works). A way to install skills at the CLI's own tag would make pinning
possible without going around the CLI. `npx skills add https://github.com/heygen-com/hyperframes/tree/v<ver>/skills`
does that today, and is what we use.
