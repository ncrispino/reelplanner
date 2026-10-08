# SCRIPT — l2-upload-resume

**Voice:** am_michael (Kokoro, local; sped ×1.25 after synthesis)
**Voice settings:** default
**Voice direction:** Plain and even. A good teacher explaining a plan to a peer: one idea per sentence, an example for every mechanism, a comparison for every choice.

---

## Line 1 — Hook (Frame 1)

**Time:** 0.0 – 8.0s
**Delivery:** Matter-of-fact; sting on "twice".

    A two-gigabyte upload fails at ninety percent. Today the client starts again from zero, and if it retries twice, we bill the customer twice.

## Line 2 — Tension (Frame 2)

**Time:** 8.0 – 17.0s
**Delivery:** Three failures as three beats.

    The obvious fix is a retry loop in the client. That throws away the bytes the server already has, it can bill twice, and the server never learns the upload failed.

## Line 3 — Six pieces (Frame 3)

**Time:** 17.0 – 25.0s
**Delivery:** One name per beat.

    The plan has six parts: the client SDK, the upload API, a new manifest store, the blob store, billing, and a sweeper job.

## Line 4 — Step 1 (Frame 4)

**Time:** 25.0 – 34.0s
**Delivery:** Signpost; the why-not is one clause.

    Step one. Before the API accepts any data, it writes one manifest row: upload 7f3a, two gigabytes, no parts yet. From then on, any crash leaves that row behind. Write it after part one instead, and a crash during part one leaves nothing.

## Line 5 — Decision 1 (Frame 5)

**Time:** 34.0 – 47.0s
**Delivery:** Question, two costs, recommendation, then hand it over.

    First choice: where does that row live? In a Postgres table, marking a part done is one transaction with the part write: both happen, or neither. In a JSON file in S3, each part needs a write, a check that the file did not change, and a retry. I recommend Postgres, because step two stays simple. Which do you want?

## Line 6 — Branch 1a (Frame 6)

**Time:** 47.0 – 54.0s
**Delivery:** Consequence, plainly.

    With Postgres, one part write is one transaction. The only new work is one database migration.

## Line 7 — Branch 1b (Frame 7)

**Time:** 54.0 – 62.0s
**Delivery:** Consequence, plainly.

    With S3, one part write becomes a write, a check, and a retry. Step two grows by about a day.

## Line 8 — Step 2 (Frame 8)

**Time:** 62.0 – 72.0s
**Delivery:** Signpost; why-not clause last.

    Step two. The file goes up in parts. Each PUT stores one part and flips one bit in the manifest, in one transaction. Send part one twice, and the second PUT sees the bit and does nothing. A byte-range resume would not work here: S3 cannot append to a file.

## Line 9 — Step 3 (Frame 9)

**Time:** 72.0 – 81.0s
**Delivery:** Signpost.

    Step three. After a crash, the client asks which bits are set. The API answers: one one one zero one one. Part four is missing. The client sends it, calls complete, and the API checks every bit before closing the upload. The server holds the truth, not the client.

## Line 10 — Step 4 (Frame 10)

**Time:** 81.0 – 91.0s
**Delivery:** Signpost; the last sentence is the payoff.

    Step four. Billing moves to the complete call, keyed by the manifest id. The first complete for 7f3a bills once. A second complete for 7f3a sees the completed timestamp and does nothing. That is how we stop billing twice.

## Line 11 — Decision 2 (Frame 11)

**Time:** 91.0 – 104.0s
**Delivery:** Question, two costs, recommendation.

    Second choice: who owns the idempotency key? Say a client sends POST uploads, times out, and sends it again. With the server's manifest id, that makes two manifests, and the client pays once per file it completes. With a key the client makes and sends both times, the second POST is refused. But that needs a unique index, a 409 path, and a change in every SDK. For version one, I recommend the server id. Which do you want?

## Line 12 — Branch 2a (Frame 12)

**Time:** 104.0 – 111.0s
**Delivery:** Consequence.

    Server id: the only client change is step six. Each completed file is billed once.

## Line 13 — Branch 2b (Frame 13)

**Time:** 111.0 – 119.0s
**Delivery:** Consequence.

    Client key: the API gains a unique index on customer and key, plus a 409 response, and every SDK must send the key.

## Line 14 — Step 5 (Frame 14)

**Time:** 119.0 – 129.0s
**Delivery:** Signpost; why-not clause last.

    Step five. A job runs every hour and finds manifests older than a day with no completion. Manifest 2c91, twenty-six hours old: the job aborts its upload, deletes its parts, and marks it abandoned. An S3 lifecycle rule cannot do this; it never sees the manifest.

## Line 15 — Decision 3 (Frame 15)

**Time:** 129.0 – 142.0s
**Delivery:** Question, two costs, recommendation.

    Third choice: how old is abandoned? At twenty-four hours, orphaned parts take at most one day of storage, and most phones on bad networks retry within hours. At seven days, a huge upload over a bad link still finishes, but each abandoned upload holds its parts for a week, and the hourly scan grows seven times. I recommend twenty-four hours. Which do you want?

## Line 16 — Branch 3a (Frame 16)

**Time:** 142.0 – 149.0s
**Delivery:** Consequence.

    Twenty-four hours: storage is bounded by one day of failed uploads, and the scan stays small.

## Line 17 — Branch 3b (Frame 17)

**Time:** 149.0 – 156.0s
**Delivery:** Consequence.

    Seven days: a week-long upload survives, and abandoned parts stay seven times longer.

## Line 18 — Step 6 (Frame 18)

**Time:** 156.0 – 163.0s
**Delivery:** Signpost; quick.

    Step six. The SDK saves the upload id, 7f3a. After a reconnect it asks which bits are set and sends only part four.

## Line 19 — Resolved (Frame 19)

**Time:** 163.0 – 175.0s
**Delivery:** Warm; then stop.

    That is the plan, with your three choices filled in. Draw on any step to ask for a change, or approve it.
