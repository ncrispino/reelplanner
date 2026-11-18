# The checker's brief · 2026-11-18-review-reaches-agent

Each card below asks what some code does. Answer each from its lines alone: they are the code as it was pinned.
Do not guess from names, and do not read anything else. Write one line a card to `answers.md` beside this file:

    - c2: b · <the words in the lines that decide it>

If the lines do not decide it, write `- c2: ? · <what is missing>`.

## c2

In this repo, you press Send and no session is waiting or connected. What happens to the review?

- A · It waits in the inbox for the next session
- B · A headless run starts on it
- C · It is lost

scripts/lib/inbox.mjs:700-702:

```
  if (!question && !isMachineInbox(rp)) {
    const result = await start();
    if (result.started) return { handledBy: "agent", message: `saved; started the configured headless run${result.unsandboxed ? ", without Claude Code's sandbox (it can't run on this machine)" : ""}`, pid: result.pid, ...(result.unsandboxed ? { unsandboxed: result.unsandboxed } : {}) };
```

## c3

A session is waiting, but it does not take the review within 15 seconds. What does Send do?

- A · Nothing more; the review waits
- B · It tries the hand-off again
- C · It starts a headless run at once

scripts/lib/inbox.mjs:673-676:

```
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

scripts/lib/inbox.mjs:700-700:

```
  if (!question && !isMachineInbox(rp)) {
```
