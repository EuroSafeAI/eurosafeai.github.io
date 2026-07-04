import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  brand,
  hero,
  footer,
  statCards,
  timeline,
  sections,
  type ChartSpec,
} from "@/data/instituteEfforts";
import "./InstituteEffortsPage.css";

/**
 * CAISI — AI Safety Progress Timeline dashboard.
 *
 * A faithful, self-contained port of the original standalone Plotly HTML into
 * a React route. All editable content (stats, copy, chart data) lives in
 * src/data/instituteEfforts.ts. Charts are rendered with Plotly, loaded once
 * from the CDN (kept out of the app bundle — this is the only page that uses
 * it). Because the page ships its own header/footer, App.tsx hides the global
 * FloatingNav and Footer on this route.
 */

const PLOTLY_SRC = "https://cdn.plot.ly/plotly-2.35.2.min.js";

interface PlotlyLike {
  newPlot: (
    el: HTMLElement,
    data: unknown[],
    layout: Record<string, unknown>,
    config: Record<string, unknown>,
  ) => void;
  purge: (el: HTMLElement) => void;
}

declare global {
  interface Window {
    Plotly?: PlotlyLike;
  }
}

let plotlyPromise: Promise<void> | null = null;

/** Load Plotly from the CDN exactly once; resolve when window.Plotly exists. */
function loadPlotly(): Promise<void> {
  if (typeof window !== "undefined" && window.Plotly) return Promise.resolve();
  if (plotlyPromise) return plotlyPromise;
  plotlyPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PLOTLY_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      plotlyPromise = null;
      reject(new Error("Failed to load Plotly"));
    };
    document.head.appendChild(script);
  });
  return plotlyPromise;
}

function usePlotly(): boolean {
  const [ready, setReady] = useState<boolean>(
    typeof window !== "undefined" && !!window.Plotly,
  );
  useEffect(() => {
    let alive = true;
    loadPlotly()
      .then(() => alive && setReady(true))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return ready;
}

/** One Plotly chart card. Draws once Plotly is ready; purges on unmount. */
function ChartCard({ spec, ready }: { spec: ChartSpec; ready: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!ready || !el || !window.Plotly) return;
    window.Plotly.newPlot(el, spec.data, spec.layout, spec.config);
    return () => {
      if (window.Plotly) window.Plotly.purge(el);
    };
  }, [ready, spec]);
  return (
    <div className="cc">
      <div style={{ height: spec.height, width: "100%" }}>
        <div ref={ref} className="plotly-graph-div" style={{ height: "100%", width: "100%" }} />
      </div>
    </div>
  );
}

const TONE = {
  violet: { bg: "rgba(79,62,200,0.07)", border: "rgba(79,62,200,0.20)", value: "#4F3EC8" },
  crimson: { bg: "rgba(211,47,47,0.07)", border: "rgba(211,47,47,0.24)", value: "#D32F2F" },
} as const;

const Arrow = () => (
  <div className="carr">
    <svg viewBox="0 0 60 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="7" x2="51" y2="7" stroke="#D6DAE8" strokeWidth="2" />
      <path d="M47 2L58 7L47 12" fill="none" stroke="#D6DAE8" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  </div>
);

const InstituteEffortsPage = () => {
  const ready = usePlotly();

  return (
    <div className="ie-page">
      <Helmet>
        <title>{brand.name} — {brand.title}</title>
        <meta
          name="description"
          content="CAISI AI Safety Progress Timeline — research volume, topical distribution, and Canadian institutional footprint across recent conferences."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      {/* TOP BAR */}
      <header className="bar">
        <svg className="leaf" viewBox="0 0 100 112" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 4C50 4 43 22 35 24 27 26 13 14 13 14 13 14 21 30 15 38 9 46-1 44-1 44 -1 44 10 50 10 60 10 65 5 70 5 70 5 70 19 64 27 69 35 74 33 90 33 90 L50 81 67 90C67 90 65 74 73 69 81 64 95 70 95 70 95 70 90 65 90 60 90 50 101 44 101 44 101 44 91 46 85 38 79 30 87 14 87 14 87 14 73 26 65 24 57 22 50 4 50 4Z"
            fill="#D32F2F"
            stroke="#a81c1c"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <line x1="50" y1="81" x2="50" y2="110" stroke="#a81c1c" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div className="brand">
          <span className="bname">{brand.name}</span>
          <span className="bsub">{brand.sub}</span>
        </div>
        <span className="ttl">{brand.title}</span>
        <span className="bdg">{brand.badge}</span>
      </header>

      {/* HERO */}
      <div className="hero">
        <h1 dangerouslySetInnerHTML={{ __html: hero.titleHtml }} />
        <p dangerouslySetInnerHTML={{ __html: hero.bodyHtml }} />
      </div>

      {/* TIMELINE RAIL */}
      <div className="chron">
        {timeline.map((step, i) => (
          <div key={step.name} style={{ display: "contents" }}>
            <div className={`chron-conf${step.newest ? " newest" : ""}`}>
              <div className="cnm">{step.name}</div>
              <div className="cdot" />
              <div className="cyr">{step.period}</div>
            </div>
            {i < timeline.length - 1 && <Arrow />}
          </div>
        ))}
      </div>

      {/* STAT STRIP */}
      <div className="stats">
        {statCards.map((c) => {
          const t = TONE[c.tone];
          return (
            <div key={c.label} className="sc" style={{ background: t.bg, borderColor: t.border }}>
              <div className="sv" style={{ color: t.value }}>{c.value}</div>
              <div className="sl">{c.label}</div>
              <div className="ss">{c.sub}</div>
            </div>
          );
        })}
      </div>

      {/* SECTIONS */}
      {sections.map((s) => {
        const titleHtml = s.crimson
          ? `<span class="n">${s.num}</span><span class="ca">&nbsp;${s.title}</span>`
          : `<span class="n">${s.num}</span>${s.title}`;
        return (
          <div key={s.num}>
            <div className="dvd" />
            <div className="sec">
              <div className="sec-hd">
                <h2 dangerouslySetInnerHTML={{ __html: titleHtml }} />
                <p dangerouslySetInnerHTML={{ __html: s.descriptionHtml }} />
              </div>
              {(s.pills.length > 0 || s.legendNote) && (
                <div className="pills">
                  {s.pills.map((p) => (
                    <div
                      key={p.label}
                      className="pill"
                      style={{ background: p.bg, borderColor: p.border, color: p.color }}
                    >
                      <div className="pdot" style={{ background: p.color }} />
                      {p.glyph}&nbsp; {p.label}
                    </div>
                  ))}
                  {s.legendNote && <div className="legend-note">{s.legendNote}</div>}
                </div>
              )}
              <ChartCard spec={s.chart} ready={ready} />
            </div>
          </div>
        );
      })}

      {/* FOOTER */}
      <footer>
        <p>{footer.left}</p>
        <p dangerouslySetInnerHTML={{ __html: footer.noteHtml }} />
      </footer>
    </div>
  );
};

export default InstituteEffortsPage;
