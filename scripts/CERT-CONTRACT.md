# Certificate generation contract

This file is the boundary between the **data**, the **scoring math**, the
**pipeline**, and the **visual rendering**. Anyone modifying any of those
pieces should read this first — and update it if they change the contract.

## File responsibilities

| File | Owns | Doesn't own |
|---|---|---|
| [`src/data/models.json`](../src/data/models.json) | The dataset (14 entries today) | Field meanings, validation rules |
| [`src/data/models.types.ts`](../src/data/models.types.ts) | The TypeScript shape of one entry | Runtime validation, defaults |
| [`src/lib/scoring.ts`](../src/lib/scoring.ts) | `calcAgg` + `calcGrade` for the leaderboard UI | Which fields exist on a model |
| [`scripts/generate-certificates.mjs`](generate-certificates.mjs) | I/O, validation, jsPDF lifecycle, determinism pins, scoring (mirrored) | Visual layout |
| [`scripts/cert-render-v1.mjs`](cert-render-v1.mjs) | Visual layout, colors, fonts, copy, dimension titles/descriptions | Data shape, file I/O, CERT_SECRET handling |
| [`public/images/stamp.png`](../public/images/stamp.png) | The EuroSafeAI seal binary | — |
| [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | Pinning the stamp hash, running the pipeline before Vite build | What the pipeline does internally |

## What the renderer reads from each model

```
model.id                         → URL, filename, certificate footer ID
model.name                       → large center title
model.company                    → subtitle "by <company>"
model.scores.hr                  → "Human Rights Alignment" dimension card
model.scores.harm                → "Sociopolitical Harm Resistance" dimension card
model.scores.hist                → "Historical Revisionism Resistance" dimension card
model.scores.auth                → "Anti-Authoritarian Alignment" dimension card
```

Anything else on the model object (`region`, `specialty`, `scores_meta` if
added) is **ignored by the renderer**. Adding new fields will not break
generation; removing or renaming any of the above will.

## Computed values

The pipeline computes these from the scores and hands them to the renderer:

```
agg    integer 0–100  = Math.round((hr + harm + hist + auth) / 4)
grade  'A' | 'B' | 'C' | 'D'   per thresholds: 80 / 65 / 50
```

If either formula changes, update **three places**:
1. `src/lib/scoring.ts` (leaderboard UI)
2. `scripts/generate-certificates.mjs` (mirrored copy)
3. The contract version comment in both files

…and bump the version number from `1.0.0` so the divergence is obvious in
diffs.

## Hardcoded strings inside the renderer

Things that look like data but live in `cert-render-v1.mjs` as code:

- `"Evaluation Period: Q1 2026"` — update per quarter
- The four `DIMENSIONS` titles and descriptions
- All footer text ("This certificate reflects preliminary evaluation data…")
- The brand colors (`#1a7fc4` and the grade-color palette)

If a future quarter needs a different evaluation period in the header,
that's a one-line change in `cert-render-v1.mjs` — but **every generated
PDF's bytes will change** because the visible text changed. That's
expected; just regenerate.

## Determinism guarantees

Given a fixed `CERT_SECRET`, identical `models.json`, identical `stamp.png`,
and identical `jspdf` version, the pipeline produces byte-identical PDFs
across runs, machines, and clocks.

Two sources of jsPDF default non-determinism are pinned in the pipeline:

| Source | jsPDF default | Pinned to |
|---|---|---|
| `/ID` | random 32 hex chars per invocation | `deriveFileId(secret, model.id)` |
| `/CreationDate` | wall-clock time to the second | `2026-01-01T00:00:00Z` |

If you ever see hash drift across runs, the cause is one of:

1. `jspdf` version changed — must be pinned exactly (no `^`) in `package.json`
2. `stamp.png` re-exported — workflow has a SHA tripwire that fails the build
3. Locale-dependent text rendering (none known today, but flag if you add Unicode glyphs jsPDF would substitute differently)
4. Someone added a third source of jsPDF default randomness

## Visual redesign procedure

When the design changes:

1. Copy `cert-render-v1.mjs` → `cert-render-v2.mjs`. Edit `v2` freely.
2. Change the import in `generate-certificates.mjs`:
   ```js
   import { renderCertificateV1 } from './cert-render-v1.mjs'
   // becomes
   import { renderCertificateV2 } from './cert-render-v2.mjs'
   ```
3. Run `npm run certs` locally, eyeball the PDFs, run `npm test`, push.
4. Leave `v1` in the repo — it's useful for regenerating historical certs
   with the original look, and as a reference if a v2 design decision needs
   re-litigating.

The data shape, scoring math, and CI plumbing stay untouched.

## Adding a new model

1. Append an entry to `src/data/models.json` following the existing shape.
2. Run `npm test` → the parity tests in `src/test/cert-parity.test.ts` will
   catch missing/invalid fields.
3. Run `npm run certs` → confirm the new PDF is generated.
4. Commit and push. CI regenerates all PDFs.

There is no per-model state in CI or in this repo — adding a model is a
data edit only.

## Removing or renaming a model

A rename is **also** a URL change. The old `/certificate/<old-id>.pdf` and
`/certificate/<old-id>` URLs will 404 after the next deploy. If they're
publicly linked, add a meta-refresh stub at `public/certificate/<old-id>/index.html`
pointing to the new URL — Vite copies it into `dist/` as-is.

## Rotating `CERT_SECRET`

Rotating the secret changes the stamp position (and therefore the bytes)
of every certificate. Don't rotate routinely — the determinism guarantee
exists so that a PDF in someone's archive can be verified against a
freshly regenerated one. Rotate only if the previous secret leaked.
