/**
 * Shape and constants for events sourced from Luma.
 *
 * The actual event array is generated at build time by
 * `scripts/sync-luma.mjs` into `src/data/events.json` (gitignored) and
 * imported by `src/pages/EventsPage.tsx`. This file owns the TypeScript
 * boundary — anything that consumes events imports the type from here.
 *
 * See `scripts/SYNC-LUMA.md` for the full pipeline contract.
 */

export interface EventItem {
  /** Luma event ID (e.g. "evt-sYvsrMdzfUkd8ar"). */
  lumaId: string;
  /** URL slug. Reserved for future /events/:slug detail pages; currently unused. */
  slug: string;
  title: string;
  /** ISO 8601 timestamp. */
  startsAt: string;
  endsAt?: string;
  location: string;
  summary: string;
  /**
   * Belt-and-braces filter. The sync script only writes `"public"` events
   * (Luma's API already excludes private events from public-calendar
   * responses), but EventsPage filters again at render time on this field.
   */
  visibility: "public" | "unlisted";
  featured?: boolean;
  coverUrl?: string;
}

/**
 * Shape of the generated events.json file. Two periods, plus a sync
 * timestamp so we can show "last updated" later if useful.
 */
export interface EventsData {
  syncedAt: string;
  upcoming: EventItem[];
  past: EventItem[];
}

/** Public Luma calendar URL — used in the hero subtitle and footer links. */
export const LUMA_CALENDAR_URL = "https://lu.ma/jinesis";

/** Public Luma calendar API ID — used by the sync script. */
export const LUMA_CALENDAR_ID = "cal-nEA5rut7BsqvYzr";

/** Luma's iframe calendar embed URL — used by EventsPage for the upcoming view. */
export const LUMA_EMBED_URL = `https://lu.ma/embed/calendar/${LUMA_CALENDAR_ID}/events`;
