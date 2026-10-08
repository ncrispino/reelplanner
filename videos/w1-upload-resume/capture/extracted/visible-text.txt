# Walkthrough: Resumable uploads for the media service

**Status:** implemented on branch `upload/resume` · **Plan:** `plan.md` · **Decisions taken:** Q1 = manifest in Postgres · Q2 = server manifest id · Q3 = 24-hour sweep

This is the report the agent writes after implementing a brownfield plan. The walkthrough video is built from it (style guide §13); the reviewer picks a knowledge level as for the plan video (`docs/lifecycle.md`). Everything here is hypothetical: it shows the format.

## What was done, per step

### Step 1 — Write-ahead upload manifest ✅

`upload_manifests` table added by `migrations/0042_upload_manifests.sql`; `POST /uploads` inserts the row before returning the id. Example: `POST /uploads` with `file_size: 2147483648` returns `7f3a` and the row already exists with an empty `parts_done`.

### Step 2 — Chunked parts with idempotent PUT ✅ (one deviation)

`PUT /uploads/:id/parts/:n` writes the part and flips the bit in one transaction; a repeated PUT returns 200 without rewriting. **Deviation:** the default part size is 16 MB, not the plan's 8 MB. See autonomy A1.

### Step 3 — Resume endpoint ✅

`GET /uploads/:id` returns `parts_done`; `POST /uploads/:id/complete` returns 409 when bits are missing (A2) and issues CompleteMultipartUpload when they are all set.

### Step 4 — Billing on manifest completion ✅

The `charge_upload` job now runs from `completed_at`, keyed on the manifest id. The old per-POST charge path is deleted, not flagged off (A3).

### Step 5 — Sweeper ✅

`sweep_manifests` runs hourly; it deletes parts and rows older than 24 hours with no `completed_at`. It batches by 500 rows (A4).

### Step 6 — SDK resume support ✅

TypeScript and Python SDKs resume from `GET /uploads/:id` after a reconnect. The Go SDK is not updated (see Not done).

## Choices the plan did not specify (autonomy)

| id | Step | Chose | Instead of | Why | Check |
|---|---|---|---|---|---|
| A1 | 2 | 16 MB default part size | 8 MB, as the plan said | a 2 GB file is 128 parts instead of 256; mobile clients on the test network lost fewer parts per disconnect, and 16 MB is still under the 5 GB S3 part limit | `src/upload/parts.ts` line 14 |
| A2 | 3 | `complete` returns 409 when parts are missing | 400 | 409 reads as a state conflict, which it is; the client can call `GET` and continue | `src/upload/complete.ts` |
| A3 | 4 | delete the old charge path | keep it behind a flag | two charge paths for one upload is the bug this plan exists to remove; a flag would keep it possible | `git show upload/resume -- src/billing/charge.ts` |
| A4 | 5 | sweep in batches of 500 with a 200 ms pause | one delete | a single delete of a week of rows locked the table for 9 s on the staging copy | `src/upload/sweep.ts` |

## Deviations from the plan or the decisions

- Step 2: 16 MB parts, not 8 MB (A1). The plan's risk note about the 5 MB S3 minimum still holds.
- Step 6: Go SDK not updated; it falls back to a fresh upload after a disconnect.

## Evidence

- `npm test`: 212 passing (41 new: manifest, parts, resume, complete, sweep, billing).
- Staging: 2 GB upload with the network cut at 40 %, 70 % and 95 % resumed each time; one charge.
- Sweeper: 12,000 abandoned staging manifests removed in 6 minutes with no lock waits over 50 ms.

## Not done / not tested

- Go SDK resume (step 6, partial).
- No load test above 200 concurrent uploads.

## Quiz (for the walkthrough video)

| id | after step | question | options | answer | explain |
|---|---|---|---|---|---|
| K1 | 2 | The client sends part 4 twice. What does the second PUT do? | a) stores it again · b) sees the bit and does nothing · c) fails the upload | b | the bit is already set, so the PUT is idempotent |
| K2 | 4 | A client crashes at 95 % and starts a new upload of the same file. How many charges? | a) one · b) two · c) none | b | the charge is keyed on the manifest id, and a new upload is a new manifest; the client-key option (Q2 B) would make it one |
