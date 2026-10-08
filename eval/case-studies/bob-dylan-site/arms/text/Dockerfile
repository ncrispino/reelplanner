# The text arm's container, for the case study bob-dylan-site. All three arms' containers are the same but
# for the lines marked "this arm only": the same Claude Code, the same model, a new empty home folder,
# and only the arm's own site/ mounted, as ~/dylan-site. From this folder (RUNBOOK.md, "In the container"):
#
#   mkdir -p site && docker build --build-arg UID=$(id -u) -t cs-bob-dylan-site-text .
#   docker run -it --rm -e ANTHROPIC_API_KEY -v "$PWD/site:/home/agent/dylan-site" cs-bob-dylan-site-text
FROM node:22-bookworm-slim
ARG CLAUDE_CODE_VERSION=2.1.283
ARG MODEL=claude-opus-5-5
# the agent's user takes your user id, so it can write to site/ on your machine (from a root shell, leave it at 1000)
ARG UID=1000
RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}
RUN userdel --remove node 2>/dev/null; useradd --create-home --home-dir /home/agent --uid ${UID} --shell /bin/bash agent
COPY preflight.sh start.sh site.exclude /opt/case-study/
USER agent
ENV HOME=/home/agent MODEL=${MODEL}
RUN git config --global user.name "agent" && git config --global user.email "agent@localhost" && git config --global init.defaultBranch main
WORKDIR /home/agent/dylan-site
CMD ["sh", "/opt/case-study/start.sh"]
