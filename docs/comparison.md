# How reelplanning compares

As of October 2026. Every entry was checked on 2026-10-04: each quoted description against the project's own
README, repo description, docs or site, fetched that day (the Source column says which). Star counts and
last-push dates were checked again against the GitHub API on 2026-10-05 at about 02:30 UTC, each repo by its
exact `owner/name`. "Last push" is the last push to any branch. Some young repos have very high counts (archify,
Understand-Anything, OpenMontage, all created in 2026); those are the numbers GitHub reports, not a typo.
**Unverified** marks what could not be confirmed at a first-party source. Projects change fast; if an entry is
out of date, a PR that fixes it is welcome.

The short version:

| | Starts from | Output | Stops for your choices | Decision record |
|---|---|---|---|---|
| **reelplanning** | a plan, before the code | narrated video, review player, walkthrough video | yes, on the frame | `decisions.md`, checked by later plans |
| Plan mode (Claude Code, Cursor, Codex `/plan`) | your request | a text plan (Cursor adds diagrams) | in chat | none |
| GitHub Spec Kit, Kiro specs | your request | Markdown spec, plan and tasks (Spec Kit's `/speckit-converge` runs after the build: "Repeat implement → converge until convergence reports Converged", README, checked 2026-10-08; Kiro's specs page describes nothing after the code) | Kiro asks in text | the specs, as text |
| Plannotator | an agent's plan or a diff | annotations in the browser, sent to the agent | you annotate | none |
| HyperFrames `/pr-to-video`, shipreel | a pull request, after the code | a narrated video | no | none |
| CodeRabbit, Graphite | a pull request | review comments, summaries, diagrams | no | none |
| ADR tools (MADR, adr-tools, log4brains) | you | records you write by hand | n/a | yes, by hand |

## The list

### Videos of code or PRs

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanning |
|---|---|---|---|---|
| [HyperFrames](https://github.com/heygen-com/hyperframes) `/pr-to-video` | "Write HTML. Render video. Built for agents." Its skill table lists `/pr-to-video`: "A GitHub pull request (PR URL, `owner/repo#N` ref, or "this PR") → changelog / feature-reveal / fix / refactor explainer". | README | 56,800 / 2026-10-05 | reelplanning's own render engine, and it already turns PRs into videos. No plan stage, no decision stops, no decision log. |
| [shipreel](https://github.com/theBstar/shipreel) | "Turn a pull request into a short narrated walkthrough video. An agent skill: local, free, zero setup on a Mac." It "renders a compact MP4, about two and a half minutes by default". | repo description; README | 2 / 2026-09-30 (created 2026-09-30) | The closest match to the walkthrough video. It starts after the code is written, has no plan review, and makes an MP4 with no interactive player or decisions written back. |
| [OpenMontage](https://github.com/calesthio/OpenMontage) | "The first open-source, agentic video production system." "Human approval gates are enforced, not suggested — proposal, script, scene plan, generated assets, and publish all pause for your sign-off." Has a Screen Demo pipeline. | README | 63,263 / 2026-10-03 (created 2026-03-29) | Much broader video production, with approval gates on the video itself. Nothing for plans, code decisions or a record in the repo. |
| [claude-video-kit](https://github.com/runesleo/claude-video-kit) | "Agent Skill + Remotion pipeline: brief/script → review receipt → narrated 9:16 explainer." "Independent review receipt must bind to the exact `script.json` before render." | repo description; README | 120 / 2026-09-27 | Vertical video for content creators. Its review gate checks the script before rendering, not the engineering choices in a plan. |
| [Remotion](https://github.com/remotion-dev/remotion) | "Make videos programmatically with React." | repo description | 61,872 / 2026-10-04 | A framework many agent video skills build on (claude-video-kit among them), not a review workflow. reelplanning uses HyperFrames instead. |
| [NotebookLM Video Overviews](https://support.google.com/notebooklm/answer/16454555) (the help page now says "Gemini Notebook") | "Video Overviews transform the sources in your notebook into an engaging video." Formats: Cinematic, Explainer and Short ("~60 second videos"). | help page | closed source | Polished visuals, but any sources in and a video out. No repo, no decision stops, no feedback to an agent. |

### Explainers of code, plans and AI output

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanning |
|---|---|---|---|---|
| [Plannotator](https://github.com/backnotprop/plannotator) | "Annotate and review coding agent plans and code diffs visually, share with your team, send feedback to agents with one click." "a local, browser-based review surface for AI coding agents: Claude Code, Codex, Copilot CLI, Gemini CLI, OpenCode, Kiro, Droid, Amp, and Pi." Its sister repo [plannotator/guides](https://github.com/plannotator/guides) (26 stars) "writes a Guided Review, a chaptered walkthrough of a diff, and exports it as a single portable HTML file." | repo description; README | 9,138 / 2026-10-05 | The same goal (review a plan, send feedback to the agent), as text annotation rather than video. Supports more agents and has team sharing. Keeps no long-term decision record. |
| [archify](https://github.com/tt-a1i/archify) | "Turn any idea, plan, or codebase into a beautiful interactive diagram. An agent skill for Claude Code, Codex, and more." Stable v3.0.1, changelog dated 2026-09-28. | repo description; README | 77,496 / 2026-10-05 (created 2026-04-15) | Takes a plan as input, but makes an interactive diagram you refine in chat. No narration, no decision stops, no record of decisions. |
| [Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | "Turn any code into an interactive knowledge graph you can explore, search, and ask questions about." The README heading widens this to "any codebase, knowledge base, or docs". Includes `/understand-diff` and guided tours. | repo description; README | 85,286 / 2026-10-02 (created 2026-03-15) | Explains existing code as a graph, with tours. No video, no plan approval, no decision log. |
| [Explainer](https://github.com/ifrit98/Explainer) (ifrit98) | "An explanation compiler for Claude Code: first-principles explanations in controlled prose, diagrams, interactive pages, or 3Blue1Brown-style videos with local voice, …" (the description is cut there). Depends on `manim` and `kokoro-onnx`; has `explainer probe`, `coldread` and `quiz` checks. Its README cites Karpathy's post as its origin. | repo description; pyproject; README | 5 / 2026-10-04 (created 2026-10-03) | A general explainer, not built for plans or PRs. Its comprehension checks go further than reelplanning's one quick check per step. |
| [andrej-explains](https://github.com/Shawnchee/andrej-explains), [karpathy-output](https://github.com/ohernandezdev/karpathy-output) | andrej-explains: "Understand code and AI outputs through clear writing, diagrams, interactive HTML, and narrated explainer videos." karpathy-output: "Agent skill: turn LLM dumps into STE100 prose, diagrams, interactive HTML, or an explainer-video plan. Based on Andrej Karpathy's note." | repo descriptions only | 3 and 4 / both created and last pushed 2026-10-02 | Generic skills that pick an output format. Neither reviews plans or records decisions. **Unverified:** how many more such repos there are. |
| Geoffrey Litt's `/explain-diff` | A skill that makes code explainers "as HTML, markdown, or Notion docs", with a five-question quiz. | [his post](https://www.geoffreylitt.com/2026/07/02/understanding-is-the-new-bottleneck) | not a repo | Explains a diff after the code exists, as text, with a quiz. No video, no plan stage. |

### Plans and specs before the code

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanning |
|---|---|---|---|---|
| [GitHub Spec Kit](https://github.com/github/spec-kit) | "an open source toolkit that gives AI coding agents structured processes, reusable templates, and documented outcomes." Skills include `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement` and `/speckit-converge`. | README | 140,129 / 2026-10-03 | The dominant spec-driven workflow, far more widely used. Specs and plans are Markdown you read; no video and no per-decision answers on record. |
| [Kiro specs](https://kiro.dev/docs/specs/) | "requirements.md (or bugfix.md) … design.md … tasks.md". "The agent asks clarifying questions if needed." | docs | Kiro's GitHub repo: 4,349 / 2026-09-15 (the repo looks like an issue tracker; the IDE is closed source) | Questions are asked in text, inside its own IDE. No video review. |
| [Claude Code plan mode](https://code.claude.com/docs/en/common-workflows) | "Claude reads files and proposes a plan but makes no edits until you approve." The docs mention "editing the plan in your text editor." | docs | n/a | The text plan reelplanning takes as input (`/plan-to-video path/to/plan.md`). The official CHANGELOG lists "Removed ultraplan feature" under 2.1.222 (published to npm 2026-08-04). |
| [Cursor plan mode](https://cursor.com/blog/plan-mode) | Cursor asks clarifying questions, then "creates a Markdown file with file paths and code" (blog, 2025-10-07). The Cursor 2.2 forum post (2025-12-10) adds "inline Mermaid diagrams" and says "Plans are now saved as files on disk by default." | blog; official forum post | n/a | Diagrams inside a text plan in the IDE. No narration, no decision log. |
| [OpenAI Codex](https://github.com/openai/codex) `/plan` | "Lightweight coding agent that runs in your terminal". [Docs](https://developers.openai.com/codex/cli/slash-commands): "/plan Switch to plan mode and optionally send a prompt. Ask Codex to propose an execution plan before implementation work …" (as fetched, cut there). | repo description; docs | 127,859 / 2026-10-05 | A text plan, then approval. reelplanning installs into Codex as a skill. |
| [Devin](https://devin.ai) Interactive Planning | Devin makes a plan you can edit and approve before it writes code, and reports confidence scores. **Unverified:** taken from search snippets of docs.devin.ai; the pages were not fetched. | search snippets | closed source | A hosted agent with a text plan. No video, no decision record in the repo. |
| [Traycer](https://traycer.ai/) | "Traycer brings spec-first development to AI coding workflows, helping developers plan changes clearly and execute them with confidence." "Traycer runs Claude Code, Codex, OpenCode, and Cursor side by side in one workspace." | site (meta description; homepage) | closed source | Spec-first planning and running across agents; its demo shows build and audit checks per phase. Review is text. |
| [Taskmaster](https://github.com/eyaltoledano/claude-task-master) | "An AI-powered task-management system you can drop into Cursor, Lovable, Windsurf, Roo, and others." | repo description | 28,143 / 2026-04-28 | Breaks a PRD into tasks; review is text only. No push in about five months. |

### Code review after the code

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanning |
|---|---|---|---|---|
| [CodeRabbit walkthroughs](https://docs.coderabbit.ai/pr-reviews/walkthroughs) | "a structured overview of the changes that appears at the top of the PR comment thread". Sections include a summary of changed files, Mermaid sequence diagrams, an estimated review effort (1–5) and a poem. | docs | SaaS | Text and diagrams on the PR, after the code exists, inside GitHub where reviewers already work. No video, no plan stage. |
| [Graphite](https://graphite.com/) (now part of Cursor) | "the AI code review platform where teams ship higher quality code, faster." "Cursor Cloud Agents are now in Graphite." Cursor's purchase was announced 2025-12-19 (per press: SiliconANGLE). | site | SaaS | AI review and stacked PRs at scale, after the code exists. No plan video. |
| [CodeTour](https://github.com/microsoft/codetour) (Microsoft) | "VS Code extension that allows you to record and play back guided tours of codebases, directly within the editor." | repo description | 4,587 / 2026-05-05 | The established "code tour" format: written by hand, in the editor, no AI and no narration. |

### Decision records

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanning |
|---|---|---|---|---|
| [MADR](https://github.com/adr/madr) | "Markdown Architectural Decision Records". Ships templates (`adr-template.md`, plus minimal and bare versions). | repo description; repo files | 2,535 / 2026-08-28 | The format ADR users expect. reelplanning's `decisions.md` is not in MADR's format: each entry has the question, the chosen and not-chosen options, the reviewer's words and where it applies, which map onto MADR's fields. An export is open work. |
| [adr-tools](https://github.com/npryce/adr-tools) | "Command-line tools for working with Architecture Decision Records" | repo description | 5,722 / 2024-04-25 | ADRs written by hand; no push in over two years. reelplanning's log fills in from review answers. |
| [log4brains](https://github.com/thomvaill/log4brains) | "It enables you to log Architecture Decision Records (ADR) right from your IDE and to publish them automatically as a static website." | README | 1,599 / 2024-12-17 | Publishes ADRs as a site. Decisions are entered by hand; there is no agent loop. |

**Not found** (an earlier search, not re-run on 2026-10-04): a current "Loom for code" product that records
video walkthroughs of PRs or plans, and any repo that runs the whole loop: plan, video, recorded decisions,
walkthrough.

## Where reelplanning differs, and where others are ahead

- **The review happens before the code, and the review is the video.** The video tools above explain something
  already built or written. reelplanning makes a video of a plan that stops at each open choice; the answers
  become decisions in the plan and in `decisions.md` before any code is written. None of the projects above
  does this.
- **One record across the whole cycle.** Plan video, review, build, walkthrough video, accept or flag, with the
  system video kept current. Spec Kit and Kiro keep structured text specs; ADR tools keep decisions written by
  hand; Plannotator sends feedback but keeps no long-term record. Joining these into one record is the real
  difference, more than video by itself.
- **A video of a PR is not new.** HyperFrames ships `/pr-to-video`, and shipreel turns a PR into a narrated MP4
  locally. reelplanning's walkthrough is about the plan's decisions: what landed, and the choices the agent
  made on its own.
- **Others are far ahead on adoption and agent coverage.** Spec Kit has about 140k stars, archify about 77k and
  Plannotator about 9k; Plannotator names nine supported agents. reelplanning is tested with Claude Code, has
  basic Codex support, and is untested elsewhere ([agents](./agents.md)).
- **Text review is faster and cheaper.** Plannotator, CodeRabbit and Graphite give quick, searchable feedback
  where people already work, with team sharing. reelplanning needs ffmpeg, a headless Chrome, a local voice,
  whisper.cpp and a render step: a real cost for a small plan.
- **Comprehension checks go further elsewhere.** reelplanning has one quick check per step, and a missed check
  marks that step for the next video. Explainer has `probe`, `coldread` and `quiz`; Litt's `/explain-diff` ends
  with a five-question quiz. claude-video-kit binds its review receipt to the exact script.
- **A crowded field since Karpathy's post.** Within days, generic "pick text, diagram, HTML or video" explainer
  repos appeared (at least andrej-explains, karpathy-output and Explainer). reelplanning is the plan-review
  version: decision stops and a record in the repo.

## Discussions

The problem in other people's words. Each quote was re-fetched and matched word for word on 2026-10-04.

- **Andrej Karpathy**, [post on X](https://x.com/karpathy/status/2105819303471976479), 2026-10-02 (UTC). It opens
  "We'll be spending a lot more time trying to understand the outputs of language models. A few thoughts, tips &
  tricks:" and goes through four formats, each ending "But even better:": writing in ASD-STE100, diagrams and
  images, web pages ("in HTML"), and explainer videos. "Explainer videos. The output format I am most bullish
  on is fully custom / bespoke explainer videos generated on any arbitrary topic." "As LLMs get better, they will
  do more and more of the legwork autonomously, and a lot more of our work will rise up the abstractions into
  oversight and understanding."
- **Geoffrey Litt**, [Understanding is the new bottleneck](https://www.geoffreylitt.com/2026/07/02/understanding-is-the-new-bottleneck),
  July 2026, the written version of his AI Engineer talk: "Agents are writing more and more code for us, and we
  all know it's getting harder to keep up." "Working with AI, it's easy for the loop to run faster than the speed
  of human understanding."
- **Addy Osmani**, [Agentic Code Review](https://addyosmani.com/blog/agentic-code-review/) (the post's date was not
  re-checked): "So the constraint moved downstream, to the one step that did not get faster: a person being
  confident the change is right."
- **Addy Osmani**, [The Code Nobody Reads](https://addyo.substack.com/p/the-code-nobody-reads), 2026-09-28: "You
  don't need to have read every line, but you should be able to explain what the change does, what it touches and
  why it's safe to ship."
- **Andrea Griffiths**, GitHub Blog, [Agent pull requests are everywhere. Here's how to review them.](https://github.blog/ai-and-ml/generative-ai/agent-pull-requests-are-everywhere-heres-how-to-review-them/),
  2026-05-07: "The traditional loop—request review, wait for code owner, merge—breaks down when one developer can
  kick off a dozen agent sessions before lunch. Throughput has scaled exponentially. Human review capacity hasn't."
- **Birgitta Böckeler**, [Understanding Spec-Driven Development: Kiro, spec-kit, and Tessl](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html),
  martinfowler.com, 2025-10-15: "To be honest, I'd rather review code than all these markdown files. An effective
  SDD tool would have to provide a very good spec review experience."
- **Simon Willison**, [Your job is to deliver code you have proven to work](https://simonwillison.net/2025/Dec/18/code-proven-to-work/),
  2025-12-18, on "the junior engineer, empowered by some class of LLM tool, who deposits giant, untested PRs on
  their coworkers—or open source maintainers—and expects the "code review" process to handle the rest."
- **Faros AI**, [The AI Productivity Paradox Report 2025](https://www.faros.ai/blog/ai-software-engineering),
  2025-07-23 (vendor research, telemetry from 10,000+ developers): "Developers on teams with high AI adoption
  complete 21% more tasks and merge 98% more pull requests, but PR review time increases 91%, revealing a
  critical bottleneck: human approval."
- **Andrej Karpathy**, "Software Is Changing (Again)", YC AI Startup School, June 2025
  ([announced](https://x.com/karpathy/status/1935518272667217925); checked against a
  [third-party transcript](https://singjupost.com/andrej-karpathy-software-is-changing-again/) only): "usually
  they are doing the generation, and we as humans are doing the verification. It is in our interest to make this
  loop go as fast as possible." "GUI allows a human to audit the work of these fallible systems and to go faster."
- **Junpeng Wang et al.**, [Illuminating LLM Coding Agents: Visual Analytics for Deeper Understanding and Enhancement](https://arxiv.org/abs/2508.12555),
  arXiv, 2025-08-18, on ML-agent workflows rather than plan review: "The current approach of manually inspecting
  individual outputs is inefficient, making it difficult to track code evolution, compare coding iterations, and
  identify improvement opportunities."
