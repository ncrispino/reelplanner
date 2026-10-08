# The ours arm's container, for the case study bob-dylan-site. All three arms' containers are the same but
# for the lines marked "this arm only": the same Claude Code, the same model, a new empty home folder,
# and only the arm's own site/ mounted, as ~/dylan-site. From this folder (RUNBOOK.md, "In the container"):
#
#   mkdir -p site && docker build --build-arg UID=$(id -u) -t cs-bob-dylan-site-ours .
#   docker run -it --rm --network host -e ANTHROPIC_API_KEY -v "$PWD/site:/home/agent/dylan-site" cs-bob-dylan-site-ours
FROM node:22-bookworm-slim
ARG CLAUDE_CODE_VERSION=2.1.283
ARG MODEL=claude-opus-5-5
# the agent's user takes your user id, so it can write to site/ on your machine (from a root shell, leave it at 1000)
ARG UID=1000
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}
# this arm only: what reelplanning's video tools need (ffmpeg; unzip for Chrome; Python for the TTS; a compiler for whisper.cpp; a headless Chrome's libraries)
RUN apt-get update && apt-get install -y --no-install-recommends ffmpeg unzip python3 python3-pip python3-venv cmake build-essential \
 && npx -y playwright-core install-deps chromium && rm -rf /var/lib/apt/lists/*
# this arm only: reelplanning itself, not on npm yet: a reelplanning-<version>.tgz beside this file when there is one (`npm pack`
# in a checkout, while the repo is private: RUNBOOK.md, "In the container"), else from GitHub
# (the private development repo by its name today: after the owner renames it, docs/releasing.md "Going public",
# pass --build-arg REELPLANNING=github:ncrispino/<new name>#claude/clever-knuth-b5gtcf)
ARG REELPLANNING=github:ncrispino/ReelPlanning#claude/clever-knuth-b5gtcf
COPY smoke.sh reelplanning*.tgz /opt/case-study/
RUN t=$(ls /opt/case-study/reelplanning*.tgz 2>/dev/null | head -n1); npm i -g "${t:-$REELPLANNING}" && rm -f /opt/case-study/reelplanning*.tgz
RUN userdel --remove node 2>/dev/null; useradd --create-home --home-dir /home/agent --uid ${UID} --shell /bin/bash agent
COPY preflight.sh start.sh site.exclude /opt/case-study/
USER agent
ENV HOME=/home/agent MODEL=${MODEL}
RUN git config --global user.name "agent" && git config --global user.email "agent@localhost" && git config --global init.defaultBranch main
# this arm only: the skill (from the package just installed), reelplanning's setup, and a smoke render that proves
# the image makes a video: a line of speech, its word timings, ten seconds of video (RUNBOOK.md, "In the container")
RUN npx -y skills add "$(npm root -g)/reelplanning" --skill plan-to-video -g -y -a claude-code \
 && reelplanning setup && sh /opt/case-study/smoke.sh
WORKDIR /home/agent/dylan-site
CMD ["sh", "/opt/case-study/start.sh"]
