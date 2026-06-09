import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { Globe, Users, Lightbulb, Heart, Zap, Briefcase } from "lucide-react";

const ACCENT = "#003399";
const INK = "#0a1f4d";
const PANEL_BG = "#f5f7fb";
const BORDER = "rgba(10,31,77,0.08)";

const values = [
  { icon: Lightbulb, title: "Curiosity", desc: "A deep desire to understand complex systems and push boundaries." },
  { icon: Heart, title: "Ethics", desc: "Strong commitment to ethical principles and responsible AI development." },
  { icon: Zap, title: "Proactive Mindset", desc: "Initiative to identify and address potential problems before they become an issue." },
];

const benefits = [
  { icon: Globe, title: "Global Impact", desc: "Work on problems that matter at the frontier of AI safety." },
  { icon: Users, title: "Expert Team", desc: "Collaborate with leading researchers from top institutions." },
];

const CareersIllustration = () => (
  <svg viewBox="0 0 400 400" width="100%" height="100%" role="img" aria-hidden="true">
    <circle cx="200" cy="200" r="180" fill="none" stroke="#003399" strokeOpacity="0.08" strokeWidth="1" />
    <circle cx="200" cy="200" r="140" fill="none" stroke="#003399" strokeOpacity="0.14" strokeWidth="1" />
    <circle cx="200" cy="200" r="100" fill="none" stroke="#003399" strokeOpacity="0.22" strokeWidth="1" />
    <circle cx="200" cy="200" r="60" fill="none" stroke="#003399" strokeOpacity="0.35" strokeWidth="1" />
    <circle cx="200" cy="200" r="10" fill="#003399" />
  </svg>
);

const SectionRow = ({
  label,
  bg = "#ffffff",
  children,
}: {
  label: string;
  bg?: string;
  children: React.ReactNode;
}) => (
  <section className="careers-section" style={{ background: bg }}>
    <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
      <AnimatedSection>
        <h2 className="careers-section-label" style={{ color: INK }}>
          {label}
        </h2>
      </AnimatedSection>
      <div>{children}</div>
    </div>
  </section>
);

const CareersPage = () => (
  <div>
    <Helmet>
      <title>Careers — EuroSafeAI</title>
      <meta name="description" content="Join EuroSafeAI and help build a safer future with AI. Explore open research and engineering roles." />
    </Helmet>
    {/* Hero */}
    <section className="careers-hero" style={{ background: "#ffffff" }}>
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
            Join Our Mission
          </h1>
        </AnimatedSection>
        <div className="careers-hero-grid">
          <AnimatedSection delay={0.08}>
            <p
              className="careers-hero-sub"
              style={{
                lineHeight: 1.55,
                color: "rgba(10,31,77,0.72)",
                margin: 0,
                maxWidth: "560px",
              }}
            >
              Help us advance AI safety and security. We're looking for talented individuals passionate about ensuring AI benefits humanity.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.15}>
            <div className="careers-hero-illu">
              <CareersIllustration />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>

    {/* Why work with us */}
    <SectionRow label="Why work with us" bg={PANEL_BG}>
      <div className="careers-why-grid">
        <AnimatedSection>
          <p
            className="careers-why-text"
            style={{
              lineHeight: 1.7,
              color: "rgba(10,31,77,0.7)",
              margin: 0,
            }}
          >
            EuroSafeAI is a Swiss nonprofit focused on safety and security for advanced AI systems with emphasis on threat assessment and mitigation. We target scenarios where AI systems may act contrary to developer intent. We actively collaborate with industry including DeepMind.
          </p>
        </AnimatedSection>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {benefits.map((b, i) => (
            <AnimatedSection key={b.title} delay={0.1 + i * 0.08}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div
                  style={{
                    flexShrink: 0,
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    background: "rgba(0,51,153,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <b.icon size={24} color={ACCENT} />
                </div>
                <div>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, color: INK, margin: 0, marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>{b.title}</p>
                  <p style={{ fontSize: "0.95rem", color: "rgba(10,31,77,0.65)", margin: 0, lineHeight: 1.6 }}>{b.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </SectionRow>

    {/* What we look for */}
    <SectionRow label="What we look for" bg="#ffffff">
      <div className="careers-values-grid">
        {values.map((v, i) => (
          <AnimatedSection key={v.title} delay={i * 0.1}>
            <div
              className="careers-value-card"
              style={{
                background: "#ffffff",
                border: `1px solid ${BORDER}`,
                borderRadius: "14px",
                padding: "1.85rem 1.5rem",
                height: "100%",
                transition: "transform 0.25s, box-shadow 0.25s, border-color 0.25s",
              }}
            >
              <v.icon size={26} color={ACCENT} style={{ marginBottom: "1rem" }} />
              <p style={{ fontSize: "1.1rem", fontWeight: 700, color: INK, margin: 0, marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>
                {v.title}
              </p>
              <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "rgba(10,31,77,0.65)", margin: 0 }}>
                {v.desc}
              </p>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </SectionRow>

    {/* Open positions */}
    <SectionRow label="Open positions" bg="#ffffff">
      <AnimatedSection>
        <div
          className="careers-positions-panel"
          style={{
            background: PANEL_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: "16px",
          }}
        >
          <div
            className="careers-positions-icon"
            style={{
              flexShrink: 0,
              borderRadius: "16px",
              background: "rgba(0,51,153,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Briefcase size={30} color={ACCENT} />
          </div>
          <div>
            <h3
              className="careers-positions-title"
              style={{
                fontWeight: 700,
                color: INK,
                margin: 0,
                marginBottom: "0.55rem",
                letterSpacing: "-0.01em",
              }}
            >
              No open positions at this time
            </h3>
            <p
              className="careers-positions-text"
              style={{
                lineHeight: 1.65,
                color: "rgba(10,31,77,0.65)",
                margin: 0,
                maxWidth: "620px",
              }}
            >
              We aren't actively hiring right now, but we're always interested in connecting with talented researchers and engineers. Reach out and tell us about your work.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </SectionRow>

    {/* CTA */}
    <section className="careers-cta" style={{ background: ACCENT }}>
      <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
        <AnimatedSection>
          <h2
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              fontWeight: 800,
              lineHeight: 1.12,
              color: "#ffffff",
              letterSpacing: "-0.025em",
              marginBottom: "1.25rem",
              maxWidth: "720px",
            }}
          >
            Don't see a perfect fit?
          </h2>
          <p
            className="careers-cta-sub"
            style={{
              lineHeight: 1.65,
              color: "rgba(255,255,255,0.82)",
              marginBottom: "2.5rem",
              maxWidth: "520px",
            }}
          >
            We're always interested in hearing from talented individuals passionate about AI safety.
          </p>
          <a
            href="mailto:eurosafeai.zurich@gmail.com?subject=General Application"
            className="careers-cta-btn"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.95rem 2rem",
              minHeight: "44px",
              background: "#ffffff",
              color: ACCENT,
              borderRadius: "999px",
              fontSize: "0.78rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.2s, transform 0.15s",
            }}
          >
            Apply here <span aria-hidden>›</span>
          </a>
        </AnimatedSection>
      </div>
    </section>

    <style>{`
      .careers-hero { padding: clamp(5rem, 8vw, 7rem) 0 clamp(1.5rem, 3vw, 2.5rem); }
      .careers-hero-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
        gap: 4rem;
        align-items: center;
      }
      .careers-hero-sub { font-size: clamp(1.0625rem, 1.3vw, 1.2rem); }
      .careers-hero-illu {
        width: 100%;
        max-width: 320px;
        aspect-ratio: 1 / 1;
        margin-left: auto;
      }

      .careers-section { padding: clamp(2.5rem, 6vw, 5rem) 0; }
      .careers-section-label {
        font-size: clamp(1.5rem, 3vw, 2.25rem);
        font-weight: 700;
        letter-spacing: -0.015em;
        margin: 0;
        margin-bottom: 2rem;
      }

      .careers-why-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
        gap: 4rem;
        align-items: center;
      }
      .careers-why-text { font-size: clamp(1rem, 1.2vw, 1.05rem); }

      .careers-values-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1.5rem;
      }
      .careers-value-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 14px 30px -18px rgba(10,31,77,0.25);
        border-color: rgba(0,51,153,0.25);
      }

      .careers-positions-panel {
        padding: 3rem 2.5rem;
        display: flex;
        gap: 2rem;
        align-items: center;
      }
      .careers-positions-icon { width: 64px; height: 64px; }
      .careers-positions-title { font-size: 1.35rem; }
      .careers-positions-text { font-size: 1rem; }

      .careers-cta { padding: clamp(3.5rem, 7vw, 6rem) 0 clamp(4rem, 8vw, 7rem); }
      .careers-cta-sub { font-size: clamp(1rem, 1.2vw, 1.05rem); }
      .careers-cta-btn:hover { background: #e8eef8; transform: translateY(-1px); }

      @media (max-width: 900px) {
        .careers-hero-grid { grid-template-columns: 1fr; gap: 2rem; }
        .careers-hero-illu { max-width: 260px; margin: 0 auto; }
        .careers-why-grid { grid-template-columns: 1fr; gap: 2rem; }
        .careers-values-grid { grid-template-columns: 1fr; }
        .careers-section-label { margin-bottom: 1.5rem; }
        .careers-positions-panel {
          flex-direction: column;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 2rem 1.5rem;
        }
        .careers-positions-icon { width: 52px; height: 52px; }
        .careers-positions-title { font-size: 1.2rem; }
        .careers-positions-text { font-size: 0.98rem; }
      }
    `}</style>
  </div>
);

export default CareersPage;
