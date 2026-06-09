#!/usr/bin/env node
/**
 * Sync events from Luma into src/data/events.json.
 *
 * Pipeline: fetch calendar listing → for each event, fetch per-event detail
 * for the rich description → normalize to EventItem shape → write JSON.
 *
 * Used by `npm run sync:luma` and by the deploy workflow before `npm run
 * build`. Pattern mirrors scripts/generate-certificates.mjs — see
 * scripts/SYNC-LUMA.md for the full contract.
 *
 * Usage:
 *   node scripts/sync-luma.mjs        # full sync (upcoming + past)
 *
 * Output: src/data/events.json (gitignored — see .gitignore)
 *
 * Network: hits api.lu.ma. No auth, no API key. Fails loudly on any HTTP
 * error so the deploy fails visibly rather than silently shipping stale
 * data.
 */

import { writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUTPUT = resolve(ROOT, "src/data/events.json");

const CALENDAR_ID = "cal-nEA5rut7BsqvYzr";
const API = "https://api.lu.ma";
const PAGINATION_LIMIT = 100;
const PER_EVENT_DELAY_MS = 100; // be polite to Luma; sync isn't time-sensitive

const GREEN = "\x1b[0;32m";
const RED = "\x1b[0;31m";
const YELLOW = "\x1b[1;33m";
const DIM = "\x1b[2m";
const RESET = "\x1b[0m";

const log = (msg) => process.stdout.write(`${msg}\n`);
const warn = (msg) => process.stderr.write(`${YELLOW}⚠ ${msg}${RESET}\n`);
const fail = (msg) => {
  process.stderr.write(`${RED}✗ ${msg}${RESET}\n`);
  process.exit(1);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── HTTP ───────────────────────────────────────────────────────────────────

async function fetchJson(url, { label } = {}) {
  const res = await fetch(url, {
    headers: {
      // Realistic UA — some Luma endpoints filter on it.
      "user-agent":
        "Mozilla/5.0 (EuroSafeAI sync-luma; +https://eurosafe.ai.toronto.edu)",
      accept: "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(
      `${label ?? url}: HTTP ${res.status} ${res.statusText}`,
    );
  }
  return res.json();
}

// ── Calendar listing ───────────────────────────────────────────────────────

async function fetchPeriod(period) {
  const url = `${API}/calendar/get-items?calendar_api_id=${CALENDAR_ID}&period=${period}&pagination_limit=${PAGINATION_LIMIT}`;
  const data = await fetchJson(url, { label: `calendar period=${period}` });
  if (!Array.isArray(data.entries)) {
    throw new Error(
      `calendar period=${period}: expected entries[], got ${typeof data.entries}`,
    );
  }
  return data.entries;
}

// ── Per-event detail (for description + location) ──────────────────────────

async function fetchEventDetail(lumaId) {
  const url = `${API}/event/get?event_api_id=${lumaId}`;
  return fetchJson(url, { label: `event ${lumaId}` });
}

// ── Normalization ──────────────────────────────────────────────────────────

/** Walk ProseMirror description_mirror → plain text. */
function extractPlainText(node, out = []) {
  if (!node || typeof node !== "object") return out;
  if (typeof node.text === "string") out.push(node.text);
  if (Array.isArray(node.content)) {
    for (const c of node.content) extractPlainText(c, out);
  }
  return out;
}

/** Take the first sentence-ish ~240 chars from a long description. */
function summarize(text) {
  if (!text) return "";
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 240) return cleaned;
  const slice = cleaned.slice(0, 240);
  // Cut at the last sentence ender if one exists in the window
  const lastEnder = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? "),
  );
  if (lastEnder >= 120) return slice.slice(0, lastEnder + 1);
  // Otherwise cut at the last space and add ellipsis
  const lastSpace = slice.lastIndexOf(" ");
  return slice.slice(0, lastSpace > 0 ? lastSpace : 240) + "…";
}

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Best-effort human-readable location from Luma's varied address fields.
 *  We deliberately do NOT fall back to the IANA timezone — Luma's events
 *  sometimes have a stale or unrelated tz (we saw an ICLR-in-Rio event
 *  with timezone Africa/Johannesburg). "Hosted on Luma" is honest;
 *  "Johannesburg" for an event in Brazil is misleading. */
function resolveLocation(detail) {
  const ev = detail.event ?? {};
  if (ev.location_type === "online" || ev.location_type === "virtual") {
    return "Online";
  }
  const geo = ev.geo_address_info ?? {};
  if (geo.mode === "shown") {
    if (geo.city && geo.country) return `${geo.city}, ${geo.country}`;
    if (geo.city_state) return geo.city_state;
    if (geo.short_address) return geo.short_address;
  }
  if (detail.featured_city?.name) return detail.featured_city.name;
  return "Hosted on Luma";
}

function normalizeEntry(listingEntry, detail) {
  const ev = listingEntry.event;
  const desc = extractPlainText(detail?.description_mirror).join(" ");
  return {
    lumaId: ev.api_id,
    slug: slugify(ev.name),
    title: ev.name,
    startsAt: ev.start_at,
    endsAt: ev.end_at ?? undefined,
    location: resolveLocation(detail ?? { event: ev }),
    summary: summarize(desc),
    visibility: ev.visibility,
    coverUrl: ev.cover_url ?? undefined,
  };
}

/** Sanity check after normalization. */
function validate(item, idx) {
  const required = ["lumaId", "title", "startsAt", "location", "visibility"];
  for (const k of required) {
    if (!item[k] || typeof item[k] !== "string") {
      throw new Error(
        `entry[${idx}] (${item.lumaId ?? "?"}): missing ${k}`,
      );
    }
  }
  if (!/^evt-/.test(item.lumaId)) {
    throw new Error(
      `entry[${idx}] (${item.lumaId}): lumaId does not start with "evt-"`,
    );
  }
}

// ── Main pipeline ──────────────────────────────────────────────────────────

async function syncPeriod(period) {
  log(`${DIM}→ fetching ${period} listing…${RESET}`);
  const entries = await fetchPeriod(period);
  log(`  found ${entries.length} ${period} event(s)`);

  const out = [];
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const id = e.event.api_id;
    if (e.event.visibility !== "public") {
      log(`  ${DIM}skip ${id} (visibility=${e.event.visibility})${RESET}`);
      continue;
    }
    try {
      const detail = await fetchEventDetail(id);
      const norm = normalizeEntry(e, detail);
      validate(norm, i);
      out.push(norm);
      log(`  ${GREEN}✓${RESET} ${norm.title.slice(0, 60)}`);
    } catch (err) {
      // One per-event failure shouldn't kill the whole sync — log and skip.
      warn(`  could not fetch detail for ${id}: ${err.message}`);
    }
    if (i < entries.length - 1) await sleep(PER_EVENT_DELAY_MS);
  }
  return out;
}

async function main() {
  log(`${YELLOW}Syncing Luma events for calendar ${CALENDAR_ID}…${RESET}`);

  const [upcoming, past] = await Promise.all([
    syncPeriod("future"),
    syncPeriod("past"),
  ]);

  // Deterministic ordering: upcoming ascending by date, past descending.
  upcoming.sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
  past.sort(
    (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
  );

  const result = {
    syncedAt: new Date().toISOString(),
    upcoming,
    past,
  };

  mkdirSync(dirname(OUTPUT), { recursive: true });
  writeFileSync(OUTPUT, JSON.stringify(result, null, 2) + "\n", "utf8");

  log("");
  log(
    `${GREEN}✓${RESET} wrote ${upcoming.length} upcoming + ${past.length} past → ${DIM}src/data/events.json${RESET}`,
  );
}

main().catch((err) => fail(err.message));
