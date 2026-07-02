import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import MediaContact from "@/components/MediaContact";
import { PaperCard } from "@/components/PaperCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPapersByCategory } from "@/lib/papers";
import { PillarBallot } from "@/components/PillarIllustrations";

const ACCENT = "#003399";
const INK = "#0a1f4d";

const SectionEyebrow = ({ children, centered = false }: { children: React.ReactNode; centered?: boolean }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: centered ? "center" : "flex-start",
      gap: "0.9rem",
      marginBottom: "1.6rem",
    }}
  >
    <span style={{ width: "36px", height: "2px", background: "#003399" }} />
    <span
      style={{
        fontSize: "0.72rem",
        fontWeight: 700,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#003399",
      }}
    >
      {children}
    </span>
  </div>
);

const DemocracyDefensePage = () => {
  const papers = getPapersByCategory("democracy-defense");
  const isMobile = useIsMobile();

  return (
    <div>
      <Helmet>
        <title>Democracy Defense — EuroSafeAI</title>
        <meta name="description" content="How EuroSafeAI studies the impact of AI systems on democratic processes and develops protective countermeasures." />
      </Helmet>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #ffffff 55%, #f5f7fb 100%)",
          padding: isMobile ? "6rem 0 3.5rem" : "9rem 0 6rem",
        }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "minmax(0,1fr)" : "minmax(0,1fr) 220px",
                gap: isMobile ? "2rem" : "3rem",
                alignItems: "center",
                textAlign: isMobile ? "center" : "left",
              }}
            >
              <div>
                <SectionEyebrow centered={isMobile}>Research Line</SectionEyebrow>
                <h1
                  style={{
                    fontSize: "clamp(1.9rem, 5vw, 4rem)",
                    fontWeight: 800,
                    lineHeight: 1.08,
                    color: INK,
                    letterSpacing: "-0.025em",
                    marginBottom: "1.4rem",
                    maxWidth: "900px",
                    marginLeft: isMobile ? "auto" : undefined,
                    marginRight: isMobile ? "auto" : undefined,
                  }}
                >
                  <span style={{ color: ACCENT }}>Democracy</span> Defense
                </h1>
                <p
                  style={{
                    fontSize: "1.15rem",
                    lineHeight: 1.55,
                    color: INK,
                    fontWeight: 600,
                    maxWidth: "720px",
                    marginBottom: "1.1rem",
                    marginLeft: isMobile ? "auto" : undefined,
                    marginRight: isMobile ? "auto" : undefined,
                  }}
                >
                  Avoiding AI that passes the redline of Europe or humanity.
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.7,
                    color: "rgba(10,31,77,0.75)",
                    maxWidth: "720px",
                    marginBottom: "1.1rem",
                    marginLeft: isMobile ? "auto" : undefined,
                    marginRight: isMobile ? "auto" : undefined,
                  }}
                >
                  Research on detecting democracy-threatening tendencies of AI, especially the emergent risks exposed by Large Language Models (LLMs).
                </p>
                <p
                  style={{
                    fontSize: "0.95rem",
                    lineHeight: 1.7,
                    color: "rgba(10,31,77,0.6)",
                    maxWidth: "720px",
                    marginBottom: "2rem",
                    marginLeft: isMobile ? "auto" : undefined,
                    marginRight: isMobile ? "auto" : undefined,
                  }}
                >
                  EuroSafeAI conducts rigorous, public-interest evaluations of AI systems for democratic societies. Our audits assess conformity with the EU AI Act, democratic integrity, historical accuracy, and adherence to human rights standards.
                </p>
                <Link
                  to="/research"
                  onClick={() => window.scrollTo({ top: 0 })}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5em",
                    padding: "0.75rem 1.6rem",
                    background: ACCENT,
                    color: "#ffffff",
                    borderRadius: "999px",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#002277"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = ACCENT; }}
                >
                  View All Research <span aria-hidden>›</span>
                </Link>
              </div>
              <div
                style={{
                  width: "100%",
                  maxWidth: isMobile ? "200px" : undefined,
                  aspectRatio: "190/160",
                  marginLeft: isMobile ? "auto" : undefined,
                  marginRight: isMobile ? "auto" : undefined,
                  order: isMobile ? -1 : undefined,
                }}
              >
                <PillarBallot />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* AI Alignment Index */}
      <section style={{ background: "#ffffff", padding: "5rem 0 6rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <SectionEyebrow>AI Alignment Index</SectionEyebrow>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.4rem)",
                fontWeight: 800,
                color: INK,
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
                lineHeight: 1.15,
                maxWidth: "820px",
              }}
            >
              The <span style={{ color: ACCENT }}>EuroSafeAI Alignment Index</span>
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "rgba(10,31,77,0.7)",
                maxWidth: "760px",
                marginBottom: "2rem",
              }}
            >
              The <strong style={{ color: INK }}>EuroSafeAI Alignment Index</strong> is a public leaderboard that evaluates frontier AI models across four dimensions derived directly from our democracy defense research.
            </p>
            <Link
              to="/certificate"
              onClick={() => window.scrollTo({ top: 0 })}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5em",
                padding: "0.75rem 1.6rem",
                background: ACCENT,
                color: "#ffffff",
                borderRadius: "999px",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#002277"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ACCENT; }}
            >
              View the Alignment Index <span aria-hidden>›</span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Research Papers */}
      <section style={{ background: "#f5f7fb", padding: "6rem 0 7rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <SectionEyebrow>Research</SectionEyebrow>
            <h2
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.4rem)",
                fontWeight: 800,
                color: INK,
                letterSpacing: "-0.02em",
                marginBottom: "1rem",
                lineHeight: 1.15,
                maxWidth: "820px",
              }}
            >
              Publications and ongoing work
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "rgba(10,31,77,0.65)",
                maxWidth: "640px",
                marginBottom: "3rem",
              }}
            >
              Publications and ongoing work in this research direction.
            </p>
          </AnimatedSection>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {papers.map((p, i) => (
              <AnimatedSection key={p.slug} delay={Math.min(i * 0.05, 0.4)}>
                <PaperCard paper={p} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Video */}
      <section style={{ background: "#ffffff", padding: "5rem 0 6rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "clamp(1.6rem, 2.6vw, 2.1rem)",
                  fontWeight: 800,
                  color: INK,
                  letterSpacing: "-0.02em",
                  marginBottom: "0.5rem",
                }}
              >
                Featured Video
              </h2>
              <p style={{ fontSize: "1rem", color: "rgba(10,31,77,0.65)" }}>
                AI, Safety, and Democratic Resilience
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div style={{ maxWidth: "780px", margin: "0 auto" }}>
              <div
                style={{
                  overflow: "hidden",
                  borderRadius: "12px",
                  border: "1px solid rgba(10,31,77,0.1)",
                  aspectRatio: "16 / 9",
                  background: "#000",
                }}
              >
                <iframe
                  style={{ width: "100%", height: "100%", border: 0 }}
                  src="https://www.youtube.com/embed/NpGpq1WKcuI"
                  title="AI, Safety, and Democratic Resilience"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <p
                style={{
                  marginTop: "1rem",
                  fontSize: "0.85rem",
                  color: "rgba(10,31,77,0.6)",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                A concise overview connecting AI safety, platform accountability, and information integrity. Highlights practical approaches for evaluating model risks and building civic-minded safeguards.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <MediaContact />

      {/* CTA */}
      <section style={{ background: ACCENT, padding: "6rem 0 7rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "900px", textAlign: "center" }}>
          <AnimatedSection>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "#ffffff",
                letterSpacing: "-0.025em",
                marginBottom: "1.25rem",
              }}
            >
              Explore Our Research
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.85)",
                maxWidth: "620px",
                margin: "0 auto 2.5rem",
              }}
            >
              View all our publications across AI safety, multi-agent systems, and democracy defense.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
              <Link
                to="/research"
                onClick={() => window.scrollTo({ top: 0 })}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5em",
                  padding: "0.85rem 1.6rem",
                  background: "#ffffff",
                  color: ACCENT,
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                All Research <span aria-hidden>›</span>
              </Link>
              <a
                href="mailto:hello@safe.eu"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5em",
                  padding: "0.85rem 1.6rem",
                  border: "1.5px solid rgba(255,255,255,0.7)",
                  color: "#ffffff",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  background: "transparent",
                }}
              >
                Contact Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default DemocracyDefensePage;
