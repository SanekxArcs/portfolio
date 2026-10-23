# Sanity retirement and recovery

The active site reads `content/profile.json` via `lib/content.ts`; development/builds need no database credentials. The existing presentation is retained while the redesign is planned in `docs/two-path-portfolio-plan.md`.

## Verified backup

`.local-backups/sanity-2026-10-19T07-21-56-728Z/` contains:
- `dataset.ndjson`: all 78 documents available to the authenticated export, including raw profiles, drafts/private records and asset metadata.
- `assets/`: all 59 original assets. Original size and SHA-1 verified; local SHA-256 recorded in the manifest.
- `manifest.json`: dataset identity, document count and asset mapping/checksums.
- `profile-original.json`: exact previous public projection, including 26 projects and 12 visible work entries.
- `source-before-migration.zip`: source before CMS removal, including uncommitted work, studio/schema/client/queries, AI code, safety tests and package lock. Environment files excluded; existing `.env.local` was not changed.

The backup is ignored by Git because it includes private information. It is local to this checkout, not an off-device backup or a committed Git snapshot. Earlier incomplete attempts may exist; the folder above has the complete manifest and source archive.

Public JSON preserves the published projection, with asset URLs changed to local paths. NDA masking and hidden-work filtering stay intact. Only publicly projected assets are bundled. Public images use the previous CDN presentation, while byte-identical originals stay in the private backup. Raw dataset records, AI prompts and private chats are not imported into the website.

## Changes

Removed Sanity SDKs, `/studio`, generated schema/types, CMS image loader, type-generation build steps and old generated Studio bundles. Replaced shared profile queries with the local adapter. Copied public assets locally and retained the original logo SVG.

The old AI assistant is paused and its launcher removed; `/api/chat` responds with a clear 503. Email/phone contact stays available. Restore chat only after durable storage and its previous usage/concurrency protections are ported.

`npm run backup:sanity` remains an optional read-only legacy export using server-side credentials and direct HTTP. It makes no remote mutations. It creates a new raw backup but refuses to overwrite an edited local profile.

## Recovery

No remote Sanity content was modified or deleted. To restore its old integration, use a separate recovery checkout, extract `source-before-migration.zip` preserving paths, restore relevant source/package files, supply the original environment settings from existing secret storage, and install from the archived lockfile. The archive includes no Git history or credentials.

The raw NDJSON and originals also preserve data if the remote dataset changes later. They are not a Sanity CLI import-ready tar archive. Recovery to a new/deleted dataset requires explicit restoration or asset upload/reference remapping; renaming directories does not recreate asset IDs.

For Convex, seed the finalized public model with stable IDs, upload/map only intended public assets and verify visibility/NDA rules before switching the adapter. Do not indiscriminately import private archives into public content tables.

## Verified foundation (2026-10-19)

- All normalized public fields equal the original published snapshot; only asset URLs changed.
- All 59 raw assets passed original size/SHA-1 checks; the full dataset contains 78 documents.
- Public asset, NDA-redaction and private-field boundary tests pass.
- Production build and TypeScript checking pass with Sanity credentials explicitly blank.
- Browser QA at 1440px dark and 390px light passed with all Sanity hosts blocked: zero CMS requests or page errors, no horizontal overflow or broken loaded images, working CV download, logo/photo toggle and email/phone actions.
- `/studio` returns 404, the paused `/api/chat` returns 503 for GET/POST, and `/sitemap.xml` returns 200.
- Local preview remains at http://127.0.0.1:3000. New two-audience pages and translations are planned, not implemented in this foundation.
