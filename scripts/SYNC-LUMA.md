# Luma events sync contract

This file is the boundary between **Luma's public API**, the **sync
pipeline**, and the **EventsPage rendering**. Anyone changing the script,
the data shape, or how the page consumes the data should read this first —
and update it if they change the contract.

Pattern mirrors [`CERT-CONTRACT.md`](CERT-CONTRACT.md): build-time
script produces a gitignored artifact that Vite bundles into the static
site. The script is the source of repo truth; the artifact is not.

## File responsibilities

| File | Owns | Doesn't own |
|---|---|---|
| [`scripts/sync-luma.mjs`](sync-luma.mjs) | API I/O, response validation, normalization, deterministic write order | Page rendering, visual decisions |
| [`src/data/events.types.ts`](../src/data/events.types.ts) | `EventItem` + `EventsData` TypeScript shape, Luma calendar/embed URL constants | Where the data lives at runtime |
| [`src/data/events.json`](../src/data/events.json) | The dataset (regenerated; **gitignored**) | Field meanings, validation rules |
| [`src/pages/EventsPage.tsx`](../src/pages/EventsPage.tsx) | Rendering past events as cards, embedding the Luma iframe for upcoming | Data shape, network |
| [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml) | Running the sync before Vite build, cron schedule | What the sync does internally |
| [`.gitignore`](../.gitignore) | Keeping `src/data/events.json` out of git | — |

## Upstream API

| Endpoint | Used for |
|---|---|
| `GET https://api.lu.ma/calendar/get-items?calendar_api_id=cal-…&period=future\|past&pagination_limit=100` | Lists events on the calendar for one period. |
| `GET https://api.lu.ma/event/get?event_api_id=evt-…` | Per-event detail. Needed because the calendar listing does not include description or full location. |

Both are unauthenticated and back Luma's own public-calendar pages
(`lu.ma/<handle>`). No API key required for public-calendar reads. Not
formally documented as a stable public API contract — if Luma changes
the response shape, the script's `validate()` step trips and the deploy
fails loudly.

## Fields the script reads

From the calendar listing (`entries[].event`):
- `api_id`, `name`, `start_at`, `end_at`, `visibility`, `cover_url`, `location_type`, `timezone`

From the per-event detail (top-level + `event`):
- `description_mirror` — ProseMirror doc; walked to plain text for `summary`
- `event.geo_address_info` — used when `mode === "shown"`
- `featured_city.name` — second-best location source

Anything else on the response is ignored. Adding new fields to Luma's
API is forward-compatible; removing or renaming any of the above will
break the sync.

## Output shape (`src/data/events.json`)

```ts
{
  syncedAt: string,                  // ISO timestamp of this run
  upcoming: EventItem[],             // ascending by startsAt
  past:     EventItem[],             // descending by startsAt
}
```

Each `EventItem` (defined in `src/data/events.types.ts`):

```ts
{
  lumaId:     "evt-…",
  slug:       "kebab-case-from-name",
  title:      string,
  startsAt:   ISO string,
  endsAt?:    ISO string,
  location:   string,                // see "Location resolution" below
  summary:    string,                // first ~240 chars of description
  visibility: "public" | "unlisted", // sync only writes "public"
  coverUrl?:  string,
}
```

## Location resolution

Luma's address fields are unreliable — some are obfuscated, some are null,
some have stale timezones (we saw an ICLR-in-Rio event with timezone
`Africa/Johannesburg`). The script picks the first source that gives a
trustworthy answer:

1. `location_type === "online" || "virtual"` → `"Online"`
2. `geo_address_info.mode === "shown"` → assemble from `city + country`,
   then `city_state`, then `short_address`
3. `featured_city.name` → use it
4. Otherwise → `"Hosted on Luma"`

**Intentionally not used**: IANA timezone city slice. Wrong often enough
(25% in our seed dataset) that "Hosted on Luma" is more honest.

## Filtering

The script writes only events where `event.visibility === "public"`.
Luma's API already excludes unlisted events from public-calendar
responses, but the filter belt-and-braces guards against an unlisted
event slipping through if Luma changes that policy. `EventsPage.tsx`
filters again at render time on the same field.

## Determinism

Given the same Luma calendar contents, two runs of `sync-luma.mjs`
produce **byte-identical** `events.json` except for the `syncedAt`
timestamp. Sources of non-determinism explicitly pinned:

| Source | Default | Pinned to |
|---|---|---|
| Output ordering | API response order (insertion?) | `upcoming` ascending, `past` descending by `startsAt` |
| Field set on each entry | Whatever the API returned | Fixed by `normalizeEntry` |

If you ever see drift across runs beyond `syncedAt`, the cause is
probably:

1. Luma changed the API response shape — the `validate()` step should
   catch this and fail before write.
2. Someone added a non-deterministic field to `normalizeEntry` (avoid).
3. Luma added new events between runs (expected and correct).

## Failure modes

| What fails | Behavior | Recovery |
|---|---|---|
| Calendar endpoint 5xx / timeout | Script exits non-zero. Deploy halts. Previously deployed site stays live. | Investigate and re-run `workflow_dispatch`. |
| Per-event endpoint fails for one event | Logged as a warning; that event is **skipped**, sync continues. | The event will sync next time. |
| `validate()` rejects a required field | Script exits non-zero. Deploy halts. | Means Luma changed the schema. Update `normalizeEntry` + this doc. |
| Network unreachable in the runner | Same as 5xx. | Re-run after CI's outage. |
| Output directory missing | `mkdirSync(recursive: true)` creates it. | n/a |

Silent staleness is worse than a visible broken deploy. The script
deliberately fails loud rather than emitting partial data on calendar
failure.

## Schedule

Configured in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml):

```yaml
schedule:
  - cron: "0 */6 * * *"
```

Every 6 hours, plus on every push to `main` and on manual
`workflow_dispatch`. Average staleness ≈ 3h, worst-case ≈ 6h. Adjust the
cron if you need fresher; expect 2–3 minutes of CI per run.

## Adding a new event

You don't. Add it on Luma; it appears on the site within ≤6h, or
immediately on next push to `main`.

## Removing or editing an event

You don't. Edit it on Luma; the change propagates on the next sync.

The script always overwrites `events.json` based on Luma's current
state. If you want to **preserve** an event on the site after deleting
it from Luma, that needs a separate `src/data/featured-events.ts`
append-only file the script doesn't touch — not implemented today.

## Local development

`src/data/events.json` is gitignored. On a fresh clone:

```bash
npm install
npm run sync:luma     # populate events.json so EventsPage has data
npm run dev
```

Without running the sync once, `/events/past` will show no cards (Vite
will also fail to import the missing JSON, breaking the dev server).

## Rate limiting

Luma's API does not publish rate limits. Our usage is bounded:

- One calendar-listing call per period (2 total) per sync.
- One per-event-detail call per public event (~10 today, growing slowly).
- ≤4 syncs per day from cron + occasional pushes.

≈40–50 requests per day total. Trivial.

The script sleeps `PER_EVENT_DELAY_MS` (100ms) between per-event
requests as a politeness measure. Adjust if Luma ever flags us.
