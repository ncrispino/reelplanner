# Round: How a review reaches the agent

**Your words:** "how a review reaches the agent"
**Plan:** none
**Pinned at:** `95a5bdbfe13d`

Sources:
- `scripts/lib/inbox.mjs` · files · 1 file, 721 lines at 95a5bdbfe13d; needs a guide part
- `.reelplanner/config.json` · files · 1 file, 13 lines at 95a5bdbfe13d

## Cards

### c1 · assume
- question: I'm assuming you mean the agent session you have open, not a headless run started for you.
- likely_wrong: your words say "the agent", and this repo has both kinds
- matters: which way in a change to Send must keep

### c2 · predict
- question: In a repo whose config sets a headless command (this one does), you press Send and no session is waiting or connected. What happens to the review?
- option_a: It waits in the inbox for the next session
- option_b: A headless run starts on it
- option_c: It is lost
- answer: b
- source: scripts/lib/inbox.mjs:700-705
- quote: "if (!question && !isMachineInbox(rp)) { const result = await start(); if (result.started) return { handledBy: "agent""
- why: With no session waiting, a review in a set-up repo goes to start(), the headless command .reelplanner/config.json sets.
- likely_wrong: in a repo with no headless command it does wait, and the page says Sent either way
- matters: who works on your review while you are away

### c3 · predict
- question: Send handed the review to a waiting session. Fifteen seconds later that session has gone, and nobody took the review. What does Send do?
- option_a: Nothing more; the review waits
- option_b: It tries the hand-off again
- option_c: It starts a headless run at once
- answer: b
- source: scripts/lib/inbox.mjs:667-676
- quote: "if (!existsSync(cp) && !liveWaiters(rp).length) await deliverInbox(rp, id, { question, repo, env, adapter, start, recheckMs })"
- why: Send sets a 15-second timer; when it fires, if nobody claimed the review and no waiter is left, it delivers again, down the same order. If the session is still waiting, nothing more happens.
- likely_wrong: it looks like a single hand-off
- matters: whether a review can be left with a session that went away

### c4 · predict
- question: You ask a question on the page with Ask about this, and no session is waiting. Where does it go?
- option_a: A headless run answers it
- option_b: It waits for the next session
- option_c: It is dropped
- answer: b
- source: scripts/lib/inbox.mjs:700-705
- quote: "saved; waiting for the next session to answer it"
- why: The headless start is only for a review (!question); a question is saved and waits for a session.
- likely_wrong: c2's answer is a headless run, so a question would seem to go the same way
- matters: a question you ask while away is answered only when you come back

### c5 · say
- question: Say how you think a review reaches the agent when you press Send.
- likely_wrong: the three ways it can go are easy to run together
- matters: the round's last check that your picture holds together
