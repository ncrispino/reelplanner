# Decisions

Append-only ledger. `reel record` adds entries from a plan review; a plan that changes one adds a superseding entry and says why. `reel check` enforces this.

| id | date | plan | step | question | chosen | status |
|---|---|---|---|---|---|---|
| D-001 | 2026-09-12 | 2026-09-12-upload-resume | 1 | Where does the manifest live? | **Postgres** | active |
| D-002 | 2026-09-12 | 2026-09-12-upload-resume | 4 | Who owns the idempotency key? | **Server id** | active |
| D-003 | 2026-09-12 | 2026-09-12-upload-resume | 5 | How long before an upload is abandoned? | **24 hours** | active |

### D-001 — Where does the manifest live?

- **Chosen:** Postgres — parts_done flips in the same transaction as the part write; one more table to migrate
- **Not chosen:** S3 object (all upload state in one system; every part becomes an ETag-conditional write with retries, about a day more in step 2)
- **Where:** 2026-09-12-upload-resume, step 1 (Write-ahead upload manifest); components: sdk, manifest
- **Status:** active

### D-002 — Who owns the idempotency key?

- **Chosen:** Server id — the manifest id is the key; no SDK change beyond step 6; a client that loses it starts over and pays once per completed file
- **Not chosen:** Client key (survives a client that retries POST /uploads itself; costs a (customer, key) unique index, a 409 path, and SDK changes in every language)
- **Where:** 2026-09-12-upload-resume, step 4 (Move billing to manifest completion); components: manifest, blob, billing
- **Status:** active

### D-003 — How long before an upload is abandoned?

- **Chosen:** 24 hours — bounds blob storage at one day of interrupted uploads; mobile clients on flaky networks almost always retry within hours
- **Not chosen:** 7 days (safer for very large uploads over bad links; up to a week of orphaned parts per abandoned upload and a sweeper scan that grows with it)
- **Where:** 2026-09-12-upload-resume, step 5 (Sweeper for abandoned manifests); components: manifest, blob, sweeper
- **Status:** active
