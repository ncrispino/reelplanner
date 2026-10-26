# How reelplanner compares

As of October 2026. The list was first checked on 2026-10-04 and brought up to date on 2026-10-26, when the new
entries were added and every entry but Litt's was checked again: each quoted description against the project's own
README, repo description, docs or site, fetched that day (the Source column says which). Star counts, last-push and
created dates are from the GitHub API on 2026-10-26, between about 19:00 and 19:35 UTC, each repo by its exact
`owner/name`. "Last push" is the last push to any branch. Some young repos have very high counts (archify,
Understand-Anything, OpenMontage, Herdr, all created in 2026); those are the numbers GitHub reports, not a typo.
**Tiny** marks a repo with almost no stars, listed only because it is unusually close to reelplanner (about 75
other small near-matches were seen and left out). **Unverified** marks what could not be confirmed at a first-party
source. Projects change fast; if an entry is out of date, a PR that fixes it is welcome.

The short version:

| | Starts from | Output | Stops for your choices | Decision record |
|---|---|---|---|---|
| **reelplanner** | a plan, before the code | narrated video, review player, walkthrough video | yes, on the frame | `decisions.md`, checked by later plans |
| Plan mode (Claude Code, Cursor, Codex `/plan`, Kiro) | your request | a text plan (Cursor adds diagrams) | in chat | none |
| Google Antigravity | your request | a text plan you comment on, then a walkthrough with screenshots and screen recordings | comments on the plan | none |
| Builder.io Agent-Native Plans | an agent's plan, and the change once it lands | visual plan documents (diagrams, wireframes, code walkthroughs), then a visual recap | comments on any part | the plan, optionally as MDX in the repo |
| plan-review (tiny) | an agent's plan | the plan as a browser page read aloud, in rounds | yes, on the page | none in the repo |
| GitHub Spec Kit, Kiro specs | your request | Markdown spec, plan and tasks (Spec Kit's `/speckit-converge` runs after the build: "Repeat implement and converge until convergence reports `Converged`.", README, checked 2026-10-26; Kiro's specs pages describe nothing after the code) | Kiro asks in text | the specs, as text |
| Plannotator | an agent's plan or a diff | annotations in the browser, sent to the agent; comments at a moment in a video an agent attaches | you annotate | a local archive of plan decisions, not in the repo |
| shipreel, Covi, PR Lens | a pull request, after the code | a narrated video (PR Lens: animated diagrams on the PR) | no | none |
| adrkit, driving-seat | recorded decisions; your request | text decision records | driving-seat asks in chat | ADRs or `DECISIONS.md`; adrkit checks plans against them |
| CodeRabbit, Graphite | a pull request | review comments, summaries, diagrams | no | none |
| ADR tools (MADR, adr-tools, log4brains) | you | records you write by hand | n/a | yes, by hand |

## The list

### Videos of code or PRs

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanner |
|---|---|---|---|---|
| [HyperFrames](https://github.com/heygen-com/hyperframes) | "Write HTML. Render video. Built for agents." Its workflow skills, `pr-to-video` and `faceless-explainer` among them, were retired by [#5651](https://github.com/heygen-com/hyperframes/pull/5651) ("publish seven knowledge skills aligned with Studio and retire the workflow skills", merged 2026-10-21, first in v0.8.185). Turning a PR into a video is now a [docs guide](https://hyperframes.heygen.com/guides/pr-to-video.md), done through `/hyperframes` or HyperFrames Studio. | README; PR; docs | 72,909 / 2026-10-26 | reelplanner's own render engine. reelplanner pins 0.8.52 and installs HyperFrames' skills from that tag, so it still has `faceless-explainer`, which the plan-to-video skill loads; a pin past 0.8.184 would lose it. No plan stage, no decision stops, no decision log. |
| [shipreel](https://github.com/theBstar/shipreel) | "Turn a pull request into a short narrated walkthrough video. An agent skill: local, free, zero setup on a Mac." It "renders a compact MP4, about two and a half minutes by default". | repo description; README | 3 / 2026-10-17 (created 2026-09-30) | Close to the walkthrough video. It starts after the code is written, has no plan review, and makes an MP4 with no interactive player or decisions written back. |
| [Covi](https://github.com/imsungbin/covi) (**tiny**) | "Covi helps people understand code changes well enough to review them. Give it a branch, a commit range, a pull request, or a merge request." "A review video is one way to deliver the result." Runs in Claude Code and Codex. | README | 0 / 2026-10-21 (created 2026-10-05) | The closest new match to the walkthrough video: a narrated video of a change, ending in a review verdict, for both agents reelplanner is tested with. It starts after the code, with no plan stage, no decision stops and no record in the repo. |
| [PR Lens](https://github.com/coldteadotai/pr-lens) | "PR Lens draws every pull request as animated architecture and data-flow diagrams, posted as a comment inside the pull request itself." A GitHub App, or an agent skill. | README | 2,251 / 2026-10-26 (created 2026-08-20) | Animated diagrams, no narration, after the code, where reviewers already work (GitHub, GitLab, Bitbucket). No plan review, no decisions. |
| Small PR and code video skills (**tiny**): [prc](https://github.com/komaksym/prc), [repo-video](https://github.com/Zubair-Elliot-17/repo-video), [brainrot](https://github.com/kamrul1157024/brainrot), [codebase-video](https://github.com/OnurGumus/codebase-video), [review-story](https://github.com/theronburger/review-story) | repo-video: "Narrated walkthrough videos of a pull request or a whole repo, made by Claude Code and rendered on your Mac." codebase-video: "Ask Claude Code for a video about your code. Get a narrated video that explains it, checked against the code." | READMEs | 0–9 stars each, all created 2026-09-25 or later | Like shipreel: a video of a PR or of existing code, after the code. None stops for decisions or writes answers back. A crowded niche since September. |
| [OpenMontage](https://github.com/calesthio/OpenMontage) | "The first open-source, agentic video production system." "Human approval gates are enforced, not suggested — proposal, script, scene plan, generated assets, and publish all pause for your sign-off." Has a Screen Demo pipeline, and "Every decision is logged with alternatives considered, confidence scores, and the reasoning behind each choice". | README | 72,138 / 2026-10-24 (created 2026-03-29) | Much broader video production, with approval gates on the video itself. Its decision log records the video's production choices, not code decisions; nothing for plans or a record in the repo. |
| [claude-video-kit](https://github.com/runesleo/claude-video-kit) | "Agent Skill + Remotion pipeline: brief/script → review receipt → narrated 9:16 explainer." "Independent review receipt must bind to the exact `script.json` before render." Now installs as a Claude Code, Codex or Cursor plugin. | repo description; README | 120 / 2026-10-26 | Vertical video for content creators. Its review gate checks the script before rendering, not the engineering choices in a plan. |
| [Remotion](https://github.com/remotion-dev/remotion) | "Make videos programmatically with React." | repo description | 67,837 / 2026-10-26 | A framework many agent video skills build on (claude-video-kit and anything2explainer among them), not a review workflow. reelplanner uses HyperFrames instead. |
| [NotebookLM Video Overviews](https://support.google.com/notebooklm/answer/16454555) (the help page now says "Gemini Notebook") | "Video Overviews transform the sources in your notebook into an engaging video." Formats: Cinematic, Explainer and Short ("~60 second videos"). | help page | closed source | Polished visuals, but any sources in and a video out. No repo, no decision stops, no feedback to an agent. |

### Explainers of code, plans and AI output

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanner |
|---|---|---|---|---|
| [Plannotator](https://github.com/backnotprop/plannotator) | "Annotate and review coding agent plans and code diffs visually, share with your team, send feedback to agents with one click." "a local, browser-based review surface for AI coding agents: Claude Code, Codex, Copilot CLI, Gemini CLI, OpenCode, Kiro, Droid, Amp, and Pi." Since October: an Inbox ("your replies arrive as their next turn"), and video attachments (v0.28.21, 2026-10-15): "Agents can attach MP4, MOV and WebM files. They play in the Inbox, and you can comment at a moment in the video." Its sister repo [plannotator/guides](https://github.com/plannotator/guides) (34 stars) writes "a Guided Review of a diff" as a portable HTML file. | repo description; README; releases | 9,675 / 2026-10-26 | The same goal (review a plan, send feedback to the agent), as text annotation rather than video. Supports more agents and has team sharing. It now takes comments at a moment in a video an agent attaches, but makes no videos, and its archive of plan decisions is local (`~/.plannotator`), not in the repo or checked by later plans. |
| [archify](https://github.com/tt-a1i/archify) | "Turn any idea, plan, or codebase into a beautiful interactive diagram. An agent skill for Claude Code, Codex, and more." v3.2.0 (2026-10-18) adds one-page explainers; v3.1.0 made diagrams live, with motion. | repo description; changelog | 89,721 / 2026-10-26 (created 2026-04-15) | Takes a plan as input, but makes an interactive diagram or page you refine in chat. No narration, no decision stops, no record of decisions. |
| [Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | "Turn any code into an interactive knowledge graph you can explore, search, and ask questions about." Includes `/understand-diff` and guided tours. | README | 88,384 / 2026-10-26 (created 2026-03-15) | Explains existing code as a graph, with tours. No video, no plan approval, no decision log. |
| [TraceVista](https://github.com/Superone77/TraceVista) | "Turn agent logs into interactive maps and stories. Explore decisions, replay the work, and get answers linked to the original evidence." | repo description | 73 / 2026-10-23 (created 2026-10-01) | Explains an agent's run after the fact, like reelplanner's session explainer, as an interactive map with evidence links. No video, no plan review, no decision log for later plans. |
| [anything2explainer](https://github.com/Vincentwei1021/anything2explainer) | "Topic in, narrated explainer video out." A Claude Code and Codex skill, built on Remotion. | README | 2,763 / 2026-09-18 (created 2026-09-08) | The most-starred explainer-video skill seen. It explains topics, not plans or code changes. |
| [Explainer](https://github.com/ifrit98/Explainer) (ifrit98) | "An explanation compiler for Claude Code: first-principles explanations in controlled prose, diagrams, interactive pages, or 3Blue1Brown-style videos with local voice, checked for what they leave out and for what you did not need." Has `explainer probe`, `coldread` and `quiz` checks. Its README cites Karpathy's post as its origin. | repo description; README | 13 / 2026-10-20 (created 2026-10-03) | A general explainer, not built for plans or PRs. Its comprehension checks go further than reelplanner's one quick check per step. |
| "Pick a format" skills from the Karpathy wave: [understanding-ladder](https://github.com/ChangWenC/understanding-ladder), [karpathy-output-style](https://github.com/ashryaagr/karpathy-output-style), [andrej-explains](https://github.com/Shawnchee/andrej-explains), [karpathy-output](https://github.com/ohernandezdev/karpathy-output) | understanding-ladder: "Agent skills that make LLM explanations easier to understand — built on Karpathy's understanding ladder." andrej-explains: "Understand code and AI outputs through clear writing, diagrams, interactive HTML, and narrated explainer videos." | READMEs; repo descriptions | 115, 48, 4 and 5 stars; all created 2026-10-02 to 10-04 | Generic skills that pick an output format. None reviews plans or records decisions. At least 20 such repos were seen by 2026-10-26. |
| [grip](https://github.com/guilyx/grip) | "A git hook that won't let you push code you can't explain." "A model grades your answers out of 100. Below your team's pass mark, the push waits." | README | 216 / 2026-10-26 (created 2026-09-20) | A comprehension check on the diff, enforced at push time. It goes much further than reelplanner's one quick check per step, but after the code and as text. |
| Geoffrey Litt's `/explain-diff` | A skill that makes code explainers "as HTML, markdown, or Notion docs", with a five-question quiz. | [his post](https://www.geoffreylitt.com/2026/07/02/understanding-is-the-new-bottleneck) | not a repo | Explains a diff after the code exists, as text, with a quiz. No video, no plan stage. (Not re-checked on 2026-10-26.) |

### Plans and specs before the code

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanner |
|---|---|---|---|---|
| [Builder.io Agent-Native Plans](https://github.com/BuilderIO/agent-native/tree/main/templates/plan) (`/visual-plan`, `/visual-recap`) | "Structured visual plan mode for coding agents. Plan turns an ordinary Codex / Claude Code / Markdown plan into a reviewable document — diagrams, wireframes, prototype options, annotated code walkthroughs, file trees, comments, share links, and HTML export." "use `/visual-plan` to plan before the agent builds, and `/visual-recap` to review a change after it lands." Launched 2026-09-23 ([post](https://www.builder.io/blog/stop-watching-your-agent-work)). | `templates/plan/README.md`; blog | BuilderIO/agent-native, the whole framework: 7,526 / 2026-10-26 | The closest company-backed project: the same before-and-after shape, with comments on any part and share links. It makes visual documents, not narrated video, with no decision stops and no decision log that later plans follow. Plans are hosted at plan.agent-native.com, optionally as MDX in the repo. |
| [plan-review](https://github.com/primestack-labs/plan-review) (**tiny**) | "Plan Review turns long implementation plans into friendly, finishable browser reviews". "Chaptered narration guides you through per-task cards covering decisions, interfaces, mockups and risks". "Approve or comment on each section, resolve the decisions and submit; Claude answers your comments, revises the plan and opens the next round with changed sections marked." | README | 0 / 2026-10-19 (created 2026-10-07) | The closest in how it works: the plan read aloud, decisions resolved on the page, then rounds of revision. A page read aloud, not a rendered video; Claude Code only; review files in `~/.claude/plan-review/`, not the repo; no decision log, no walkthrough. |
| [Google Antigravity](https://antigravity.google/docs/artifacts) (launched November 2025) | Its artifacts "include rich Markdown plans (implementation plans)" you can comment on "before it modifies any local files". [Walkthrough](https://antigravity.google/docs/walkthrough): "The agent creates walkthrough artifacts when it completes task implementation." They "often contain screenshots and screen recordings". | docs | closed source | The big tool closest to reelplanner's loop: comments on the plan before the build, then a walkthrough with recordings. Text, screenshots and recordings, with no narrated video, no decision stops and no decision log in the repo. |
| [GitHub Spec Kit](https://github.com/github/spec-kit) | "an open source toolkit that gives AI coding agents structured processes, reusable templates, and documented outcomes." Skills include `/speckit-specify`, `/speckit-plan`, `/speckit-tasks`, `/speckit-implement` and `/speckit-converge`; a new idea-assessment process ends in a `decision.md`. Its community catalog lists adrkit (below). | README | 143,008 / 2026-10-26 | The dominant spec-driven workflow, far more widely used. Specs and plans are Markdown you read; no video and no per-decision answers on record. |
| [Elephant-Goldfish Model](https://github.com/google/elephant-goldfish-model) (Google) | "Deep-context Elephant sessions draft specifications, and isolated zero-context Goldfish subagents stress-test them before you write code." Has `/egm-drift-report` for "divergence between checked-in specs and live code". "This is not an officially supported Google product." | README | 1,656 / 2026-10-25 (created 2026-09-13) | A newer spec-driven method; fresh reviewer agents check the spec, and people review text. Its drift report covers part of the walkthrough's job, as text. No video, no decision stops. |
| [Kiro specs](https://kiro.dev/docs/specs/) | "requirements.md (or bugfix.md) … design.md … tasks.md". [Feature Specs](https://kiro.dev/docs/specs/feature-specs/): "You answer clarifying questions up front and land directly on the task list." Kiro also has a lighter [Plan mode](https://kiro.dev/docs/specs/plan/). | docs | Kiro's GitHub repo: 4,402 / 2026-10-18 (the repo looks like an issue tracker; the IDE is closed source) | Questions are asked in text, inside its own IDE and CLI. No video review. |
| [Claude Code plan mode](https://code.claude.com/docs/en/common-workflows) | "Claude reads files and proposes a plan but makes no edits until you approve." In VS Code, a plan review card can send your comments back ("Send feedback and keep planning", 2.1.310). | docs; CHANGELOG | n/a | The text plan reelplanner takes as input (`/plan-to-video path/to/plan.md`). The official CHANGELOG lists "Removed ultraplan feature" under 2.1.222 (published to npm 2026-08-04). |
| [Cursor plan mode](https://cursor.com/blog/plan-mode) | Cursor asks clarifying questions, then "creates a Markdown file with file paths and code" (blog, 2025-10-07). The Cursor 2.2 forum post (2025-12-10) adds "inline Mermaid diagrams" and says "Plans are now saved as files on disk by default." Cloud agents can now build shareable "interactive canvases" (changelog, 2026-10-16). | blog; official forum post; changelog | n/a | Diagrams inside a text plan in the IDE. No narration, no decision log. |
| [OpenAI Codex](https://github.com/openai/codex) `/plan` | "Lightweight coding agent that runs in your terminal". [Docs](https://learn.chatgpt.com/docs/developer-commands?surface=cli): "Switch to plan mode and optionally send a prompt. Ask Codex to propose an execution plan before implementation work starts." | repo description; docs | 131,021 / 2026-10-26 | A text plan, then approval. reelplanner installs into Codex as a plugin or skill. |
| [Devin](https://devin.ai) | [Ask Devin](https://docs.devin.ai/work-with-devin/ask-devin.md): "Plan tasks by working with Devin to scope and plan implementation before writing code." After a PR, Devin can test the app and record "a video of the entire process" ([testing and recordings](https://docs.devin.ai/work-with-devin/testing-and-recordings.md)); it also has a voice mode. | docs | closed source | A hosted agent with a text plan. Its video is a screen recording proving the change works, not a narrated account of its choices. No decision record in the repo. |
| [Traycer](https://github.com/traycerai/traycer) | "Free, open-source desktop app for running Claude Code, Codex and Cursor in parallel. Worktree per agent, shared specs, agents that message each other." (Open source, MIT; it was listed here as closed source.) | site (meta description); repo | 1,635 / 2026-10-26 | Now an app for running agents in parallel, with shared specs, more than a spec-first planner. Review is text. |
| [Taskmaster](https://github.com/eyaltoledano/claude-task-master) | "An AI-powered task-management system you can drop into Cursor, Lovable, Windsurf, Roo, and others." | repo description | 28,276 / 2026-04-28 | Breaks a PRD into tasks; review is text only. No push in about six months. |

### Code review after the code

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanner |
|---|---|---|---|---|
| [CodeRabbit walkthroughs](https://docs.coderabbit.ai/pr-reviews/walkthroughs) | "a structured overview of the changes that appears at the top of the PR comment thread". Sections include a summary of changed files, Mermaid sequence diagrams, an estimated review effort (1–5) and a poem. | docs | SaaS | Text and diagrams on the PR, after the code exists, inside GitHub where reviewers already work. No video, no plan stage. |
| [Graphite](https://graphite.com/) (now part of Cursor) | "the AI code review platform where teams ship higher quality code, faster." "Cursor Cloud Agents are now in Graphite." Cursor's purchase was announced 2025-12-19 (per press: SiliconANGLE). | site | SaaS | AI review and stacked PRs at scale, after the code exists. No plan video. |
| [Tulip](https://github.com/VirtusLab/tulip) (VirtusLab) | "Tulip explains GitHub pull requests and GitLab merge requests - categorizing and prioritizing the changes - and presenting them on a web page as prose, diagrams, and code." | README | 131 / 2026-10-25 (created 2026-09-04) | A guided explanation of a PR, as text and diagrams. No plan stage. |
| [human-review](https://github.com/victorrentea/human-review) | "A /human-review skill for Claude Code: assembles one page that lets a human review a change set fast — diagram deltas, Code City, a feature video, complexity delta, and deep-linked snippets." | repo description | 35 / 2026-10-23 (created 2026-08-21) | One review page per change, with a video of the feature working. After the code; no decisions. |
| [CodeTour](https://github.com/microsoft/codetour) (Microsoft) | "VS Code extension that allows you to record and play back guided tours of codebases, directly within the editor." | repo description | 4,594 / 2026-05-05 | The established "code tour" format: written by hand, in the editor, no AI and no narration. |

### Decision records

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanner |
|---|---|---|---|---|
| [adrkit](https://github.com/mbeacom/adrkit) | "Decision memory for human- and agent-authored plans — architecture decision records that are machine-readable, enforceable in CI, and legible to agents, without leaving git." Spec Kit's catalog: it "checks produced plans against" the decisions and drafts an ADR from a plan. | README; Spec Kit catalog | 21 / 2026-10-25 (created 2026-07-18) | The closest match to `decisions.md` checked by later plans, with CI and PR comments. Its records are ADRs drafted from a plan, not answers given while watching a video. No video, no walkthrough. |
| [driving-seat](https://github.com/Tanmay-Ts/driving-seat) | "A Claude Code skill that keeps the developer in control of every decision that matters." "At each checkpoint Claude lists what it decided without asking". `DECISIONS.md` records each decision "with status `owned`, `decided-by-model` or `unowned`". | README | 10 / 2026-10-20 (created 2026-10-20) | reelplanner's decision stops plus its list of the agent's own calls, as text in chat, with the log as a file in the repo. No video. |
| Live decision logs (**tiny**): [decision-log](https://github.com/NickyBoi-Su/decision-log), [Drift List](https://github.com/facultymatt/drift-list) | decision-log: "A Claude Code mod that shows, in a pane beside the chat, the implicit decisions Claude makes while it works". Drift List: "It reads your Claude Code session transcripts and surfaces the decisions that got made without you weighing them." | READMEs | 0 / 2026-10-24; 1 / 2026-09-25 | The agent's own decisions, shown while it works or read from its transcripts; reelplanner shows them after the build, in the walkthrough. Text. |
| [MADR](https://github.com/adr/madr) | "Markdown Architectural Decision Records". Ships templates (`adr-template.md`, plus minimal and bare versions). | repo description; repo files | 2,586 / 2026-08-28 | The format ADR users expect. reelplanner's `decisions.md` is not in MADR's format: each entry has the question, the chosen and not-chosen options, the reviewer's words and where it applies, which map onto MADR's fields. An export is open work. |
| [adr-tools](https://github.com/npryce/adr-tools) | "Command-line tools for working with Architecture Decision Records" | repo description | 5,744 / 2024-04-25 | ADRs written by hand; no push in over two years. reelplanner's log fills in from review answers. |
| [log4brains](https://github.com/thomvaill/log4brains) | "It enables you to log Architecture Decision Records (ADR) right from your IDE and to publish them automatically as a static website." | README | 1,604 / 2024-12-17 | Publishes ADRs as a site. Decisions are entered by hand; there is no agent loop. |

### Review panes beside a terminal agent

| Project | What it does, in its own words | Source | Stars / last push | How it differs from reelplanner |
|---|---|---|---|---|
| [Claude Code mods](https://code.claude.com/docs/en/plugins/mods/overview.md) (2.1.287, 2026-10-01) | "A mod is a plugin that changes how Claude Code looks and behaves." A mod can draw "a pane beside the transcript or a band above the prompt". | docs; CHANGELOG | n/a | A platform rather than a competitor: a review pane can now live inside Claude Code. reelplanner opens its review in a terminal-browser split instead; a mod is [open work](./status.md#later-open-work-not-for-the-first-release). |
| [Herdr](https://github.com/herdrdev/herdr) and its review plugins, such as [Critty](https://github.com/crittylabs/critty) | Herdr: "Herdr is where your coding agents live." Critty: "Review changes, refine documents, make choices, and approve actions with your agent in the terminal." "Your agent can also attach a document asking for your permission or a decision." | site; READMEs | Herdr 45,997 / 2026-10-23; Critty 104 / 2026-10-25 | Where review panes beside terminal agents now live. Critty's decision requests in a pane are the closest to reelplanner's stops, as text. No video, no record. |
| [claude-show-your-work](https://github.com/iamumeransari/claude-show-your-work) | "Claude Code plugin to see, review and iterate on your agent's work without leaving the terminal". "Every change Claude made is listed beside the video with its timestamp, and clicking one jumps straight to the moment it shows up." | repo description; README | 265 / 2026-10-25 (created 2026-10-08) | A video player in the terminal, with changes keyed to moments in the video, close to reelplanner's terminal review. Its videos are UI test recordings after the code, not plans, and it has no decisions. |

**Not found** (searched 2026-10-26): any project that runs the whole loop (a plan video that stops for decisions,
a decision log later plans check, a walkthrough video); a "Loom for code" that records video walkthroughs of PRs or
plans (Atlassian's [Loom video prompts](https://www.atlassian.com/blog/loom/introducing-loom-video-prompts) go the
other way: a person's video becomes a plan for the agent); a plan-to-video skill in HyperFrames; video generation
or a decision log in the repo in Plannotator or shipreel; plan-mode changes in Cursor, Codex or Copilot since
2026-10-04.

## Where reelplanner differs, and where others are ahead

- **The review happens before the code, and the review is the video.** The video tools above explain something
  already built or written. reelplanner makes a video of a plan that stops at each open choice; the answers
  become decisions in the plan and in `decisions.md` before any code is written. None of the projects above
  does this. plan-review comes nearest (the plan read aloud, decisions resolved on the page, no video), and
  Builder.io's Agent-Native Plans has the same before-and-after shape as visual documents.
- **One record across the whole cycle.** Plan video, review, build, walkthrough video, accept or flag, with the
  system video kept current. Spec Kit and Kiro keep structured text specs; ADR tools keep decisions written by
  hand; adrkit checks plans against recorded decisions, and driving-seat logs the decisions the agent made alone,
  both as text. Joining these into one record is the real difference, more than video by itself.
- **A video of a change is not new.** shipreel, Covi and a handful of small skills turn a PR into a narrated video,
  PR Lens animates it on the PR, and Devin records a video of the change working. HyperFrames retired its
  `/pr-to-video` skill (2026-10-21) for a docs guide. reelplanner's walkthrough is about the plan's decisions: what
  landed, and the choices the agent made on its own.
- **Others are far ahead on adoption and agent coverage.** Spec Kit has about 143k stars, archify about 90k and
  Plannotator about 9.7k; Plannotator names nine supported agents. reelplanner is tested with Claude Code and
  Codex CLI, on macOS and Linux, and is untested elsewhere ([agents](./agents.md)).
- **Plannotator is moving toward the same loop.** Its Inbox brings your reply back as the agent's next turn, and
  you can comment at a moment in a video an agent attaches. It still makes no videos and keeps no decision log in
  the repo; a reelplanner video could be reviewed there.
- **Text review is faster and cheaper.** Plannotator, CodeRabbit and Graphite give quick, searchable feedback
  where people already work, with team sharing. reelplanner needs ffmpeg, a headless Chrome, a local voice,
  whisper.cpp and a render step: a real cost for a small plan.
- **Comprehension checks go further elsewhere.** reelplanner has one quick check per step, and a missed check
  marks that step for the next video. Explainer has `probe`, `coldread` and `quiz`; Litt's `/explain-diff` ends
  with a five-question quiz; grip holds a push until you can explain the diff. claude-video-kit binds its review
  receipt to the exact script.
- **A crowded field since Karpathy's post.** Generic "pick text, diagram, HTML or video" explainer repos appeared
  within days; at least 20 were seen by 2026-10-26 (understanding-ladder, karpathy-output-style, andrej-explains
  and others), and anything2explainer makes narrated topic videos. reelplanner is the plan-review version:
  decision stops and a record in the repo.

## Discussions

The problem in other people's words. Each quote was matched word for word against its source: the first ten on
2026-10-04, the three papers at the end on 2026-10-26.

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
- **Obada Kraishan and Kulsawasd Jitkajornwanich**, [Plans They Abandon, Reports They Author: The Narrative Layer of Autonomous Agents](https://arxiv.org/abs/2609.12205),
  arXiv, 2026-09-10, the case for a walkthrough of what the agent did rather than what it says it did: "a
  self-report referred to about one action in eleven". "Reports did not generally resemble the stated plan more
  than the executed one, but they did so increasingly as execution diverged from the plan."
- **Yeon Su Park et al.**, [The Work Behind Delegation: A Framework for Supervising AI Coding Agents](https://arxiv.org/abs/2609.24234),
  arXiv, 2026-09-21: "developers manage them by concentrating effort in planning, delegating supervisory work to
  other agents, and turning recurring guidance into reusable assets."
- **Dinithi Dissanayake et al.**, [Looks Fine to Me: Understanding Oversight in Agentic Interactions](https://arxiv.org/abs/2610.27801),
  arXiv, 2026-10-20 (a within-subject study, N=36): "Participants were often highly confident while missing silent
  defects: they performed generic checks, failed to generate diagnostic evidence, or even misinterpreted defect
  evidence."
