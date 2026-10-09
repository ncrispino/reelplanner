# Releasing

The skill pins the npm package (`npx -y reelplanner@<version>` in `SKILL.md`), so a release is one version number in several places. `npm version` moves all of them together: it bumps `package.json`, runs `scripts/release/sync-version.mjs` (the `version` npm script), which rewrites every `reelplanner@<version>` in the skill, docs, README, `scripts/release/install.sh` and the player, plus both `.claude-plugin` manifests, then commits and tags `v<version>`. `npm test` fails if any of them drift (`scripts/test/version.spec.mjs`). Each release gets a section in `CHANGELOG.md` (shipped in the package).

```bash
npm run test:full               # green first: every spec, exhaustive (headless Chromium, specs side by side)
npm version 0.2.1               # or patch / minor; commits and tags v0.2.1
npm pack --dry-run              # the file list (scripts/test/package.spec.mjs checks it): about 150 files, under 1 MB packed
git push origin main --follow-tags
```

The full suite is also the check every pull request passes before it merges (`.github/workflows/ci.yml`, on every push to it; `.github/CONTRIBUTING.md`), so what is on main has passed it on its last commit. Pushing the `v*` tag runs `.github/workflows/publish.yml`, which runs the full suite (`npm run test:full`) once more and then publishes with `npm publish --provenance --access public`. Then create the GitHub release for the tag:

```bash
gh release create v0.2.1 --notes-file <(sed -n '/^## 0.2.1/,/^## /p' CHANGELOG.md | sed '$d')
```

**One-time setup:** add an npm automation token as the repository secret `NPM_TOKEN` (Settings → Secrets and variables → Actions). The workflow cannot publish without it.

Publish before merging a `SKILL.md` that names the new version: `npx skills add` installs the skill from the default branch, and a skill pinned to a version that is not on npm yet fails on every command.

## Going public

*Done in October 2026, under the name reelplanning: the steps below are as they were run. The repo has been
`ncrispino/reelplanner` since D-312, and GitHub redirects the old address.*

The public repo is `ncrispino/reelplanning`, lowercase, and its `main` is one commit holding the release's tree; this repo stays private and keeps its full history (D-310). No voice file or render is in either (D-305). In order:

1. **Rename this repo** (Settings → General → Repository name), e.g. to `reelplanning-dev`. GitHub names ignore case, so `ncrispino/reelplanning` cannot be created while this one is `ReelPlanning`. Then point each clone at the new name: `git remote set-url origin https://github.com/ncrispino/reelplanning-dev.git`. GitHub redirects the old name only until a repo takes it, which the next step does: anything still naming `ncrispino/ReelPlanning` reaches the public repo from then on. The case-study kit installs this repo's development branch: set `DEV_REPO` at the top of `eval/case-studies/kit/arm.sh` to the new name.
2. **Create the public repo,** `ncrispino/reelplanning`, public and empty: no README, license or `.gitignore` from GitHub, so the first push is the whole of it.
3. **Build it** from a clean, merged checkout (the export is the commit, not the working tree):

   ```bash
   node scripts/release/make-public.mjs                       # or --ref <commit>, --author "Name <email>", --out <dir>
   ```

   It makes `<scratch>/reelplanning`: one commit on `main`, `reelplanning <version>`, by your git user (or `--author`), with the ref's tracked tree checked object for object, and the tag `v<version>`. It refuses a tree holding a `.wav`, `.mp4` or `renders/` path. The record's commit ids (in decisions, reviews, walkthroughs and versions under `.reelplanning/`) name commits of the development history and do not resolve publicly; the export adds one line to `.reelplanning/README.md` saying so. It prints the size (about 57 MB packed, October 2026) and the push command, and pushes nothing.
4. **Push it,** with the command it printed:

   ```bash
   git -C <scratch>/reelplanning push https://github.com/ncrispino/reelplanning.git main --tags
   ```

   The `v<version>` tag runs `.github/workflows/publish.yml` in the new repo. Without the `NPM_TOKEN` secret there (it is per repo) it stops at the publish step, harmlessly; add the secret first for it to publish, or publish by hand (below).
5. **GitHub settings** on the public repo: the description and topics in [`github-topics.txt`](./github-topics.txt), with `sh scripts/release/github-about.sh` (your own `gh` login; `--dry-run` first) or by hand (About → the gear icon); the `NPM_TOKEN` secret; the `needs-video` and `no-video` labels `reel pr-check` reads; `main`'s protection (a pull request with one approving review, and the `fast suite`, `full suite` and `reel pr-check` checks passed on its last commit; the owner may merge their own); private vulnerability reporting on (Security, which `.github/SECURITY.md` links). reelplanning has no GitHub Pages site (the case studies' pages are in `ncrispino/reelplanning-case-studies`).
6. **Check it from a fresh machine** (or a container), with no clone and no stored GitHub login:

   ```bash
   npm i -g github:ncrispino/reelplanning && reelplanning --version    # the version just exported
   reelplanning setup --dry-run
   npx skills add "$(npm root -g)/reelplanning" --skill plan-to-video -g
   ```

   `.github/workflows/fresh-install.yml` does this in a bare `ubuntu:24.04` container, as a user with sudo: the
   README's Install as written, with Node 22 from nvm, and with Ubuntu's own older Node, which the CLI must refuse
   (`scripts/release/fresh-install.sh`; Actions → fresh-install → Run workflow, for any branch or tag). It also
   runs on each version tag, each week, and on a pull request that changes the install's path. A Mac has no such
   container: there, a new user account is the nearest to a fresh machine.

After that first commit, all work happens on the public repo, with an ordinary history (D-310): branches, pull requests and release tags there, no later exports. The private repo stays as the internal archive of the development history.

## Announcing it

Once the public repo is up and the install works from a fresh machine. A draft for X, a post and three replies; each
is under 280 characters (a link counts as 23). Attach `docs/media/system-video.gif` to the first and
`docs/media/review-page.gif` to the third (both under X's 15 MB for a GIF).

1. Coding agents write plans faster than we can read them, so we skim and approve.

   reelplanner turns your agent's plan into a short narrated video that stops at each open question for your
   answer. 🎬

   Open source, for Claude Code and Codex:
   github.com/ncrispino/reelplanner
2. You answer on the video, comment on any moment, and the agent updates the plan. After the build, a walkthrough
   video shows the change running and stops at the choices the agent made on its own.
3. A real run: an interactive Bob Dylan site, from an empty folder through four plans, seven videos, each reviewed.
   Every question, answer and change is public:
   ncrispino.github.io/reelplanner-case-studies/bob-dylan/
4. Karpathy called bespoke explainer videos the output format he's "most bullish on". This is that, for the plans
   your agent writes: ideas, issues and PRs welcome.

## Publishing 0.2.0 by hand

`reelplanner` is not on npm yet (`npm view reelplanner` answers 404), so 0.2.0 is its first publish. (Delete this section once 0.2.0 is out: the next `npm version` rewrites its pins.) Every pin already says 0.2.0 (`node scripts/release/sync-version.mjs --check`), and `CHANGELOG.md` has its section.

1. **Check what ships.** Expect about 150 files, under 1 MB packed, and only what `files` in `package.json` lists (`bin/`, `scripts/`, `templates/`, the player, `skills/`, the case-study kit, `CHANGELOG.md`, `NOTICE`) plus `README.md`, `LICENSE` and `package.json`. `scripts/test/package.spec.mjs` (in `npm test`) fails if a shipped script needs a file left out, or if media, tests or plans get in:

   ```bash
   npm pack --dry-run
   ```

2. **Commit and merge** the release to `main`, with `npm run test:full` green.

3. **Log in and publish** from a clean checkout of `main`:

   ```bash
   npm login                                      # opens the browser; `npm whoami` should print your npm user
   npm publish --access public                    # add --otp=<code> if your account has 2FA on writes
   ```

4. **Tag and release.** The public repo's first push carries the tag `v0.2.0` already ([Going public](#going-public)); then the release, on the public repo:

   ```bash
   gh release create v0.2.0 --repo ncrispino/reelplanner --title v0.2.0 --notes-file <(sed -n '/^## 0.2.0/,/^## 0.1.0/p' CHANGELOG.md | sed '$d')
   ```

5. **Check it from the registry,** in a directory outside the checkout:

   ```bash
   npm view reelplanner version                  # 0.2.0
   npx -y reelplanner@0.2.0 --version            # 0.2.0
   npx -y reelplanner@0.2.0 --help               # the command list
   npx -y reelplanner@0.2.0 reel status <a repo with .reelplanner/>
   npx -y reelplanner@0.2.0 setup --dry-run      # finds the pinned HyperFrames
   npx skills add ncrispino/reelplanner --skill plan-to-video -g   # the installed SKILL.md says reelplanner@0.2.0
   ```

   The npm page (npmjs.com/package/reelplanner) should show the README, the Apache-2.0 license and the repository link.

If something is wrong after publishing, publish a fixed 0.2.1; `npm deprecate "reelplanner@<bad version>" "<why>"` warns anyone who pinned it. `npm unpublish` is only allowed within 72 hours and blocks the version number for good.
