# EuroSafeAI Website

The public website for **EuroSafeAI**, a Swiss nonprofit research organization advancing AI safety and security through rigorous research, threat assessment, and mitigation strategies.

Production: <https://safe.eu>

---

## Stack

- **Vite** + **React 18** + **TypeScript** (strict)
- **React Router v6** (SPA, client-side routing)
- **Tailwind CSS 3** with shadcn/ui design tokens
- **Framer Motion** for animation
- **react-helmet-async** for per-page metadata
- **Vitest** for unit tests, **Playwright** for end-to-end
- **jsPDF** for deterministic certificate generation
- Deployed to **GitHub Pages** via GitHub Actions

---

## Prerequisites

- Node.js 22 (matches CI)
- npm 10+

## Setup

```bash
npm install
npm run dev          # local dev server on http://localhost:8080
```

## Common commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run Vitest unit tests (includes certificate ↔ leaderboard parity tests) |
| `npm run lint` | ESLint |
| `npm run certs` | Regenerate all certificate PDFs into `public/certificate/` |

---

## Routes

| Route | Source |
|---|---|
| `/` | `src/pages/HomePage.tsx` |
| `/research` | `src/pages/ResearchPage.tsx` |
| `/multi-agent-safety` | `src/pages/MultiAgentSafetyPage.tsx` |
| `/democracy-defense` | `src/pages/DemocracyDefensePage.tsx` |
| `/frontier-ai-safety` | `src/pages/FrontierAISafetyPage.tsx` |
| `/team`, `/team/:slug` | `src/pages/TeamPage.tsx`, `src/pages/MemberPage.tsx` |
| `/careers` | `src/pages/CareersPage.tsx` |
| `/careers/:slug` | `src/pages/CareersJobPage.tsx` |
| `/blog`, `/blog/:slug` | `src/pages/BlogPage.tsx`, `src/pages/BlogPostPage.tsx` |
| `/certificate`, `/certificate/:slug` | `src/pages/CertificatePage.tsx`, `src/pages/CertificateDetailPage.tsx` |
| `/certificates`, `/certificates/:slug` | Aliases that resolve to the `/certificate*` pages |
| `/contact` | `src/pages/ContactPage.tsx` |
| `*` | `src/pages/NotFound.tsx` |

All routes share the global `FloatingNav` (top of `src/App.tsx`) and `Footer`.

---

## Project structure

```
src/
├── App.tsx              Router + providers
├── main.tsx             Bootstrap
├── index.css            Tailwind layer + CSS-variable design tokens
├── pages/               One file per route
├── components/          Shared UI (FloatingNav, Footer, MediaContact, PaperCard, …)
│   └── ui/              shadcn/ui primitives
├── lib/
│   ├── papers.ts        Single source of truth for all publications
│   ├── team.ts          Team roster + author-name resolution
│   ├── jobs.ts          Job-board accessors, visibility rules, JobPosting JSON-LD
│   ├── scoring.ts       calcAgg / calcGrade (mirrored in cert generator)
│   └── utils.ts         cn() helper
├── data/
│   ├── models.json      Frontier-model evaluation scores (drives the leaderboard)
│   ├── models.types.ts  TypeScript shape for entries in models.json
│   ├── jobs.json        Open roles (drives /careers and /careers/:slug)
│   ├── jobs.types.ts    TypeScript shape for entries in jobs.json
│   └── blogPosts.ts     Blog post content
├── hooks/               useIsMobile, useToast
├── assets/              Imported logos, illustrations
└── test/                Vitest specs (cert-parity is the critical one)

public/                  Static files copied verbatim to dist/
├── certificate/         Generated PDFs (gitignored, produced in CI)
├── images/team/         Team photos (WebP)
├── logos/               AI-lab brand logos used by the leaderboard
└── robots.txt
```

---

## Certificate generation

The leaderboard at `/certificate` and the downloadable PDFs are driven by a single source of truth — `src/data/models.json` — and a deterministic build pipeline. The contract is documented in `scripts/CERT-CONTRACT.md`. Highlights:

- **Math lives in `src/lib/scoring.ts`** (`calcAgg`, `calcGrade`) and is mirrored in `scripts/generate-certificates.mjs`. If you change a formula or threshold, update both files and bump the contract version.
- **PDFs are byte-deterministic** given a fixed `CERT_SECRET`, identical `models.json`, identical `public/images/stamp.png`, and the pinned `jspdf@4.2.0`. CI fails the build if `stamp.png` is re-exported (SHA-256 tripwire).
- **Adding a model**: append an entry to `src/data/models.json`, run `npm test` to catch shape violations, then `npm run certs` to regenerate. No code change needed.

---

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`:

1. Install dependencies (Node 22).
2. Verify the `stamp.png` SHA-256 hasn't drifted.
3. Run `npm test` (Vitest).
4. `npm run certs` — generates `public/certificate/*.pdf` from `models.json`.
5. `npm run build` — Vite emits `dist/`.
6. Copy `dist/index.html` to `dist/404.html` (SPA fallback for hard-refresh on subroutes).
7. Write `.nojekyll` and `CNAME` into `dist/`.
8. Upload the artifact and deploy via GitHub Pages.

### Required repo secret

- `CERT_SECRET` — PRNG seed for deterministic certificate-stamp placement. Must remain stable across deploys, otherwise every PDF's stamp position and file bytes change.

### Required GitHub Pages settings

- **Source**: `GitHub Actions` (not "branch").
- **Custom domain**: `safe.eu` (matches the `CNAME` written by the workflow).

---

## Adding content

| Want to add… | Edit |
|---|---|
| A new paper | `src/lib/papers.ts` — append to the `papers` array with the right `categories` (`multi-agent-safety` / `democracy-defense` / `safety`) |
| A new team member | `src/lib/team.ts` — append to `leadership`, `technicalStaff`, or `advisors`; drop the headshot at `public/images/team/<slug>.webp` |
| A new blog post | `src/data/blogPosts.ts` — append a `BlogPost` entry |
| A new model in the leaderboard | `src/data/models.json` — append, then `npm test` and `npm run certs` |
| A new open role | `src/data/jobs.json` — append a `Job` entry (see below) |

---

## Careers board

`/careers` and `/careers/:slug` are driven entirely by `src/data/jobs.json`. Adding, editing, or closing a role is a data edit — no page code changes.

**Publishing a role**

1. Append a `Job` object to `jobs.json` (the shape is documented field-by-field in `src/data/jobs.types.ts`). Start it at `"status": "draft"`.
2. `npm run dev` — drafts render on the board and at their real URL, badged, in local development only.
3. `npm test` — validates slugs, dates, required fields, and the generated structured data.
4. Flip to `"status": "open"` and push. Set `"status": "closed"` when the role ends; the detail page keeps resolving so inbound links don't 404, but it leaves the board and drops its `JobPosting` markup.

**Status semantics**

| Status | On the board | At `/careers/:slug` | Indexed |
|---|---|---|---|
| `draft` | dev only | dev only | no |
| `open` | yes | yes | yes, with `JobPosting` JSON-LD |
| `closed` | no | yes, with a closed notice | `noindex` |

**Applications** currently open a prefilled `mailto:` — the same fallback `ContactPage` uses. Setting `applyUrl` on a role switches the apply buttons to a hosted intake form with no code change; that field is the seam for a real intake endpoint (see `getApplyHref` in `src/lib/jobs.ts`).

**Do not put applicant data in this repo.** Everything under `src/` is compiled into a public bundle served from a public GitHub Pages site. Candidate names, CVs, interview notes, and rejection reasons belong in a separate, private, auth-gated system.

---

## License

All rights reserved. Code is not published under an open-source license. Content (research summaries, paper text) belongs to the respective authors.
