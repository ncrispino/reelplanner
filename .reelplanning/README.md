# .reelplanning

The canonical record for **reelplanning** (brownfield): what the system is, what we call its parts, how they look on the stage, and what has been decided. Every plan and every plan video builds from these files; the tools are in the reelplanning repo (`scripts/reel.mjs`), the format in its `docs/project-dir.md`.

Three rules:

1. **`decisions.md` is append-only.** Never edit or delete an entry. To change a decision, a later plan lists it under **Supersedes** with the reason, and `reel record` adds the new entry. `reel check` fails a plan that touches a decided component without citing the decision.
2. **One name per thing.** `glossary.md` and `system.json` own the names and ids. Plans, scripts and storyboards use them.
3. **Text is the record; video is the review surface.** Sources are committed (rewindable); renders, snapshots and vendored libraries are not (reproducible).

Layout: `spec.md`, `system.json`, `glossary.md`, `names.md` (how each tool and product is shown: a tool's name in code markup, `reelplanning`), `decisions.md` + `decisions.json`, `config.json` (the agent's headless command: `claude -p`, `codex exec` or `opencode run`), `inbox/` (reviews sent from the local review page; not committed), `theme/` (frame.md, stage.html), `plans/<date>-<slug>/` (plan.md, video/, walkthrough.md, walkthrough-video/, and reviews/: every review kept as sent, each with a short what-to-act-on file).

Commit ids in this record (decisions, reviews, walkthroughs, versions) name commits of reelplanning's development history, which is not public: this repo starts at one commit holding the tree of the release.
