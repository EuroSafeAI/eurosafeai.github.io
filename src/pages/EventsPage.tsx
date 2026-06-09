import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import Tag from "@/components/Tag";
import {
  LUMA_CALENDAR_URL,
  LUMA_EMBED_URL,
  type EventItem,
  type EventsData,
} from "@/data/events.types";
import eventsData from "@/data/events.json";
import { Clock, ExternalLink, MapPin } from "lucide-react";

/* Page color tokens — mirrored from CareersPage so the visual language
 * is consistent across the marketing pages. */
const ACCENT = "#003399";
const INK = "#0a1f4d";
const PANEL_BG = "#f5f7fb";
const BORDER = "rgba(10,31,77,0.08)";

/* Architecture (verified):
 *   - /events uses Luma's calendar embed iframe (LUMA_EMBED_URL).
 *     Auto-syncs in the visitor's browser; iframe is upcoming-only by
 *     design (we inspected Luma's JS bundle: no past-events code).
 *   - /events/past renders cards from src/data/events.json. That JSON
 *     is generated at build time by scripts/sync-luma.mjs (matches the
 *     scripts/generate-certificates.mjs pattern). See scripts/SYNC-LUMA.md.
 *   - Both render paths share types from src/data/events.types.ts.
 */
const data = eventsData as EventsData;

type View = "upcoming" | "past";

/* ────────────────── date helpers ────────────────── */
const formatFullDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
const formatTimeRange = (startIso: string, endIso?: string) => {
  const start = new Date(startIso);
  const startStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (!endIso) return startStr;
  const end = new Date(endIso);
  const sameDay = start.toDateString() === end.toDateString();
  const endStr = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return sameDay
    ? `${startStr} – ${endStr}`
    : `${startStr} – ${end.toLocaleDateString("en-US", { day: "numeric", month: "short" })} ${endStr}`;
};

/* Vertical date pill — Luma-style "MAR / 06" badge. */
const DatePill = ({ iso }: { iso: string }) => {
  const d = new Date(iso);
  const month = d
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();
  const day = d.toLocaleDateString("en-US", { day: "numeric" });
  return (
    <div className="flex-shrink-0 w-14 h-16 rounded-xl border border-border bg-white flex flex-col items-center justify-center shadow-sm">
      <div
        className="font-mono text-[10px] font-bold tracking-wider leading-none"
        style={{ color: ACCENT }}
      >
        {month}
      </div>
      <div
        className="font-display font-bold leading-none mt-1"
        style={{ fontSize: "1.4rem", color: INK }}
      >
        {day}
      </div>
    </div>
  );
};

/* ────────────────── past event card (Luma vibe) ────────────────── */
const PastEventCard = ({ event: e }: { event: EventItem }) => {
  const lumaUrl = `https://luma.com/event/${e.lumaId}`;
  return (
    <article
      className="group rounded-2xl bg-white p-5 md:p-6 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{
        border: `1px solid ${BORDER}`,
        boxShadow: "0 1px 2px rgba(10,31,77,0.04)",
      }}
    >
      <div className="flex flex-col md:flex-row gap-5 md:gap-6">
        {e.coverUrl && (
          <div className="order-1 md:order-2 md:w-44 md:flex-shrink-0">
            <a
              href={lumaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl overflow-hidden bg-muted aspect-square"
            >
              <img
                src={e.coverUrl}
                alt=""
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </a>
          </div>
        )}

        <div className="flex-1 order-2 md:order-1 min-w-0">
          <div className="flex items-start gap-3 mb-3">
            <DatePill iso={e.startsAt} />
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {e.featured && <Tag>Featured</Tag>}
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Hosted by Jinesis Lab
                </span>
              </div>
              <div className="font-mono text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatFullDate(e.startsAt)} ·{" "}
                {formatTimeRange(e.startsAt, e.endsAt)}
              </div>
            </div>
          </div>

          <h3
            className="font-display text-lg md:text-xl font-bold leading-snug mb-2 group-hover:text-primary transition-colors"
            style={{ color: INK }}
          >
            <a href={lumaUrl} target="_blank" rel="noopener noreferrer">
              {e.title}
            </a>
          </h3>

          <div className="text-sm text-muted-foreground inline-flex items-center gap-1.5 mb-3">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="truncate">{e.location}</span>
          </div>

          <p className="text-sm md:text-[0.95rem] text-muted-foreground leading-relaxed mb-4">
            {e.summary}
          </p>

          <a
            href={lumaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View on Luma <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
};

/* Tabs — pill toggle, same visual idiom we had before. */
const ViewTabs = ({
  view,
  setView,
}: {
  view: View;
  setView: (v: View) => void;
}) => (
  <div
    role="tablist"
    aria-label="Filter events"
    className="inline-flex p-1 rounded-full bg-white"
    style={{
      border: `1px solid ${BORDER}`,
      boxShadow: "0 1px 2px rgba(10,31,77,0.04)",
    }}
  >
    {(["upcoming", "past"] as View[]).map((v) => {
      const active = view === v;
      return (
        <button
          key={v}
          role="tab"
          aria-selected={active}
          onClick={() => setView(v)}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors capitalize ${
            active
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {v}
        </button>
      );
    })}
  </div>
);

/* ────────────────── page ────────────────── */
const EventsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const view: View = location.pathname.endsWith("/past") ? "past" : "upcoming";
  const setView = (v: View) =>
    navigate(v === "past" ? "/events/past" : "/events");

  const isPast = view === "past";
  /* Past events come from the build-time sync (events.json). The script
   * already filters visibility=public and sorts past descending, but we
   * filter again here defensively — a hand-edited JSON in dev should
   * still respect the visibility gate. */
  const pastEvents = data.past.filter((e) => e.visibility === "public");

  return (
    <div>
      <Helmet>
        <title>
          {isPast ? "Past Events — EuroSafeAI" : "Events — EuroSafeAI"}
        </title>
        <meta
          name="description"
          content={
            isPast
              ? "Past workshops, talks, and gatherings hosted by the EuroSafeAI team."
              : "Upcoming workshops, talks, and gatherings hosted by the EuroSafeAI team."
          }
        />
      </Helmet>

      {/* ─── Hero — compact, no illustration ─── */}
      <section className="events-hero" style={{ background: "#ffffff" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <AnimatedSection>
            <h1
              style={{
                fontSize: "clamp(2.25rem, 6.5vw, 5.4rem)",
                fontWeight: 800,
                lineHeight: 1.04,
                color: INK,
                letterSpacing: "-0.03em",
                margin: 0,
                marginBottom: "1.4rem",
                maxWidth: "920px",
              }}
            >
              Events
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <p
              className="events-hero-sub"
              style={{
                lineHeight: 1.55,
                color: "rgba(10,31,77,0.72)",
                margin: 0,
                maxWidth: "640px",
              }}
            >
              {isPast
                ? "A look back at the workshops, talks, and meetups we've hosted with our collaborators. "
                : "Workshops, talks, and meetups we host with our collaborators, around the world. "}
              You can also{" "}
              <a
                href={LUMA_CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-2 underline-offset-2 transition-colors hover:opacity-80"
                style={{ color: ACCENT }}
              >
                subscribe to our calendar
              </a>
              .
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Section — labelled row, panel background like the Careers
            "Why work with us" row. Contains tabs + iframe/cards. ─── */}
      <section className="events-section" style={{ background: PANEL_BG }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <AnimatedSection>
            <div className="events-section-head">
              <h2 className="events-section-label" style={{ color: INK }}>
                {isPast ? "Past events" : "Upcoming events"}
              </h2>
              <ViewTabs view={view} setView={setView} />
            </div>
          </AnimatedSection>

          {/* UPCOMING — Luma iframe (auto-syncs) */}
          {!isPast && (
            <>
              <AnimatedSection delay={0.05}>
                <div
                  className="rounded-2xl overflow-hidden bg-white"
                  style={{
                    border: `1px solid ${BORDER}`,
                    boxShadow: "0 4px 24px rgba(10,31,77,0.06)",
                  }}
                >
                  <iframe
                    src={LUMA_EMBED_URL}
                    title="EuroSafeAI upcoming events"
                    width="100%"
                    height="720"
                    frameBorder={0}
                    style={{ border: 0, display: "block" }}
                    allowFullScreen
                    aria-hidden="false"
                    tabIndex={0}
                    loading="lazy"
                  />
                </div>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <p
                  className="mt-5 text-xs text-center md:text-left"
                  style={{ color: "rgba(10,31,77,0.55)" }}
                >
                  Looking for events that already happened?{" "}
                  <button
                    type="button"
                    onClick={() => setView("past")}
                    className="underline hover:opacity-80"
                    style={{ color: ACCENT }}
                  >
                    See past events →
                  </button>
                </p>
              </AnimatedSection>
            </>
          )}

          {/* PAST — curated cards from src/data/events.ts */}
          {isPast && (
            <>
              <div className="space-y-5">
                {pastEvents.map((e, i) => (
                  <AnimatedSection key={e.lumaId} delay={i * 0.04}>
                    <PastEventCard event={e} />
                  </AnimatedSection>
                ))}
              </div>
              <AnimatedSection delay={0.1}>
                <p
                  className="mt-7 text-xs text-center md:text-left"
                  style={{ color: "rgba(10,31,77,0.55)" }}
                >
                  <button
                    type="button"
                    onClick={() => setView("upcoming")}
                    className="underline hover:opacity-80"
                    style={{ color: ACCENT }}
                  >
                    See upcoming events →
                  </button>
                </p>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>

      {/* Scoped styles — identical spacing to the Team and Careers heroes. */}
      <style>{`
        .events-hero {
          padding: clamp(5rem, 8vw, 7rem) 0 clamp(1.5rem, 3vw, 2.5rem);
        }
        .events-hero-sub { font-size: clamp(1.0625rem, 1.3vw, 1.2rem); }

        .events-section { padding: clamp(2.5rem, 6vw, 5rem) 0; }
        .events-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }
        .events-section-label {
          font-size: clamp(1.5rem, 3vw, 2.25rem);
          font-weight: 700;
          letter-spacing: -0.015em;
          margin: 0;
        }

        @media (max-width: 900px) {
          .events-section-head { margin-bottom: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;
