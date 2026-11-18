# The checker's brief · 2026-11-18-review-reaches-agent

Each card below asks what some code does. Answer each from its lines alone: they are the code as it was pinned.
Do not guess from names, and do not read anything else. Write one line a card to `answers.md` beside this file:

    - c2: b · <the words in the lines that decide it>

If the lines do not decide it, write `- c2: ? · <what is missing>`.

## c2

In a repo whose config sets a headless command (this one does), you press Send and no session is waiting or connected. What happens to the review?

- A · It waits in the inbox for the next session
- B · A headless run starts on it
- C · It is lost

scripts/lib/inbox.mjs:700-705:

```
  if (!question && !isMachineInbox(rp)) {
    const result = await start();
    if (result.started) return { handledBy: "agent", message: `saved; started the configured headless run${result.unsandboxed ? ", without Claude Code's sandbox (it can't run on this machine)" : ""}`, pid: result.pid, ...(result.unsandboxed ? { unsandboxed: result.unsandboxed } : {}) };
    if (result.claim) return { handledBy: result.claim.by === "agent" ? "agent" : "session", message: "already claimed by its handler" };
  }
  return { handledBy: "inbox", message: question ? "saved; waiting for the next session to answer it" : isMachineInbox(rp) ? "no agent session is waiting: it's saved on this machine, not in the repo; tell your agent it's sent, and it picks it up" : "saved; waiting for the next session to pick it up" };
```

## c3

Send handed the review to a waiting session. Fifteen seconds later that session has gone, and nobody took the review. What does Send do?

- A · Nothing more; the review waits
- B · It tries the hand-off again
- C · It starts a headless run at once

scripts/lib/inbox.mjs:667-676:

```
export async function deliverInbox(rp, id, { question = false, repo = dirname(rp), env = process.env, adapter = null, start = () => startAgent(rp, id), recheckMs = 15000 } = {}) {
  const path = question ? join(questionsDir(rp), `${id}.json`) : join(inboxDir(rp), `${id}.json`);
  const cp = question ? qClaimPath(rp, id) : claimPath(rp, id);
  if (!existsSync(path)) return { handledBy: "inbox", message: "no pending item" };
  let current; try { current = JSON.parse(readFileSync(cp, "utf8")); } catch {}
  if (current) return { handledBy: current.by === "agent" ? "agent" : "session", message: progressOf(rp, id)?.phase === "queued" ? "saved and queued; waiting for the connected session to pick it up" : "already claimed by its handler" };
  if (liveWaiters(rp).length) {
    const t = setTimeout(async () => {
      if (!existsSync(cp) && !liveWaiters(rp).length) await deliverInbox(rp, id, { question, repo, env, adapter, start, recheckMs }).catch(() => {});
    }, recheckMs); t.unref();
```

## c4

You ask a question on the page with Ask about this, and no session is waiting. Where does it go?

- A · A headless run answers it
- B · It waits for the next session
- C · It is dropped

scripts/lib/inbox.mjs:700-705:

```
  if (!question && !isMachineInbox(rp)) {
    const result = await start();
    if (result.started) return { handledBy: "agent", message: `saved; started the configured headless run${result.unsandboxed ? ", without Claude Code's sandbox (it can't run on this machine)" : ""}`, pid: result.pid, ...(result.unsandboxed ? { unsandboxed: result.unsandboxed } : {}) };
    if (result.claim) return { handledBy: result.claim.by === "agent" ? "agent" : "session", message: "already claimed by its handler" };
  }
  return { handledBy: "inbox", message: question ? "saved; waiting for the next session to answer it" : isMachineInbox(rp) ? "no agent session is waiting: it's saved on this machine, not in the repo; tell your agent it's sent, and it picks it up" : "saved; waiting for the next session to pick it up" };
```
