# media-service — system spec

_Kept current by the agent after every walkthrough (stage 4). Names come from `glossary.md`; parts and edges from `system.json`. Prose here, data there._

## Purpose

Accepts media files from customer apps, stores them, and charges the customer once per file. Files are up to 2 GB; most clients are on mobile networks.

## Parts

- **Client SDK** — the upload call apps make; retries and (since upload-resume) resumes.
- **Upload API** — `POST /uploads`, `PUT /uploads/:id/parts/:n`, `GET /uploads/:id`, `POST /uploads/:id/complete`.
- **Manifest store** — Postgres table `upload_manifests`; the source of truth for what has arrived.
- **Blob store** — S3-compatible; parts live at `uploads/<id>/<n>` until complete.
- **Billing** — runs from `completed_at`, keyed on the manifest id.
- **Sweeper** — hourly; removes manifests with no `completed_at` older than 24 hours (D-003) and their parts.

## Pipelines

1. **An upload, start to charge:** SDK → API creates the manifest → SDK PUTs each part → API writes the part and flips its bit in one transaction → SDK calls complete → API completes the multipart upload → Billing charges once.
2. **A resume after a disconnect:** SDK → `GET /uploads/:id` → SDK PUTs only the missing parts → complete as above.
3. **The hourly sweep:** Sweeper → manifests older than 24 h with no `completed_at` → delete their parts, then the rows.

## Invariants

- A file is charged once (billing keyed on the manifest id, D-002).
- A part write and its manifest bit commit together (D-001).
- A repeated PUT of a done part is a no-op that returns 200.
- No part outlives its manifest by more than one sweep.

## Knowledge levels

- `new`: nothing about this system; needs the "today" beat (single-stream POST, charge on POST) and the cast.
- `familiar`: knows the six part names, not the mechanics; skips the "today" beat.
- `owner`: wrote the upload handlers; skips "today", the cast and the standard why-nots.

## Conventions

TypeScript service, Postgres migrations under `migrations/NNNN_*.sql`, `npm test` before any PR, feature work on `upload/*` branches.
