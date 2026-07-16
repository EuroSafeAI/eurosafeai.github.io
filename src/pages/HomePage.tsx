import { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { findMemberByAuthorName } from "@/lib/team";
import GeometricMesh from "@/components/GeometricMesh";
import { PillarNetwork, PillarBallot, PillarLLM } from "@/components/PillarIllustrations";
import logoUToronto from "@/assets/logos/utoronto.png";
import logoUMichigan from "@/assets/logos/umichigan.png";
import logoDeepMind from "@/assets/logos/google-deepmind.svg";
import logoSchmidt from "@/assets/logos/schmidt-sciences.png";
import logoETH from "@/assets/logos/eth-zurich.png";
import logoAISI from "@/assets/logos/aisi.svg";

const collaborators = [
  { name: "University of Toronto", logo: logoUToronto, url: "https://www.utoronto.ca/" },
  { name: "ETH Zürich", logo: logoETH, url: "https://ethz.ch/en.html" },
  { name: "Google DeepMind", logo: logoDeepMind, url: "https://deepmind.google/" },
  { name: "UK AISI", logo: logoAISI, url: "https://www.aisi.gov.uk/" },
  { name: "University of Michigan", logo: logoUMichigan, url: "https://umich.edu/" },
  { name: "Schmidt Sciences", logo: logoSchmidt, url: "https://www.schmidtsciences.org/" },
];

const pillars = [
  { title: "Multi-Agent Safety", desc: "Ensuring groups of agents can safely interact with the real world and each other without unintended consequences.", href: "/multi-agent-safety" },
  { title: "Democracy Defense", desc: "Studying how AI systems can impact current models of government and developing protective measures.", href: "/democracy-defense" },
  { title: "Frontier AI Safety Research", desc: "Safeguarding and post-training LLMs against harmful use cases, interpreting model behavior via internal states, and detecting model misalignment tendencies.", href: "/frontier-ai-safety" },
];

const missionBlocks = [
  {
    label: "WHY IT MATTERS",
    title: "AI systems are rapidly becoming central to economic infrastructure and high-stakes decision-making.",
    body: "As multi-agent systems interact across markets, supply chains, and critical services, they create complex emergent dynamics that are difficult to predict or control.",
  },
  {
    label: "OUR FOCUS",
    title: "Risk assessments and mitigation strategies for advanced AI systems.",
    body: "We target scenarios where AI systems may act contrary to developer intent — studying the systemic risks that emerge when these systems operate at scale.",
  },
  {
    label: "BUILT ON",
    title: "Curiosity, ethics, and a proactive mindset.",
    body: "Safety research should be rigorous, open, and always in service of keeping AI aligned with human values.",
  },
];

const ACCENT = "#003399";

const Sphere3DIllustration = ({ reduced }: { reduced: boolean }) => {
  const cx = 95;
  const cy = 80;
  const R = 56;

  const nodeCount = 12;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const yNorm = 1 - (i / (nodeCount - 1)) * 2;
    const radial = Math.sqrt(1 - yNorm * yNorm);
    const theta = golden * i;
    return {
      x: cx + R * Math.cos(theta) * radial,
      y: cy + R * yNorm,
      z: R * Math.sin(theta) * radial,
    };
  });

  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodes.length; i++) {
    const nearest = nodes
      .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y, n.z - nodes[i].z) }))
      .filter((o) => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    for (const n of nearest) {
      const key = i < n.j ? `${i}-${n.j}` : `${n.j}-${i}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push(i < n.j ? [i, n.j] : [n.j, i]);
      }
    }
  }

  return (
    <svg viewBox="0 0 190 160" width="100%" height="100%" role="img" aria-hidden="true">
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={ACCENT} strokeOpacity="0.35" strokeWidth="1" />
      <ellipse cx={cx} cy={cy} rx={R} ry={R * 0.22} fill="none" stroke={ACCENT} strokeOpacity="0.22" strokeWidth="0.8" />
      <ellipse cx={cx} cy={cy} rx={R * 0.4} ry={R} fill="none" stroke={ACCENT} strokeOpacity="0.16" strokeWidth="0.8" />

      {edges.map(([a, b], i) => {
        const na = nodes[a];
        const nb = nodes[b];
        const front = (na.z + nb.z) / 2 > -8;
        return (
          <line
            key={`e-${i}`}
            x1={na.x}
            y1={na.y}
            x2={nb.x}
            y2={nb.y}
            stroke={ACCENT}
            strokeOpacity={front ? 0.4 : 0.12}
            strokeWidth="0.8"
          />
        );
      })}

      {!reduced &&
        edges.map(([a, b], i) => {
          const na = nodes[a];
          const nb = nodes[b];
          if ((na.z + nb.z) / 2 < 0) return null;
          return (
            <circle key={`p-${i}`} r="1.5" fill={ACCENT} opacity="0.85">
              <animateMotion
                dur={`${3 + (i % 3) * 0.6}s`}
                begin={`${(i * 0.4) % 3}s`}
                repeatCount="indefinite"
                path={`M${na.x},${na.y} L${nb.x},${nb.y}`}
              />
            </circle>
          );
        })}

      {nodes.map((n, i) => {
        const front = n.z > 0;
        return (
          <circle
            key={`n-${i}`}
            cx={n.x}
            cy={n.y}
            r={front ? 3 : 1.8}
            fill={ACCENT}
            opacity={front ? 0.9 : 0.3}
          />
        );
      })}
    </svg>
  );
};

const BarChartIllustration = ({ reduced }: { reduced: boolean }) => {
  const axisY = 145;
  const thresholdY = 72;
  const bars = [
    { x: 22, h: 42 },
    { x: 52, h: 58 },
    { x: 82, h: 44 },
    { x: 112, h: 102, spike: true },
    { x: 142, h: 66 },
  ];
  return (
    <svg viewBox="0 0 180 160" width="100%" height="100%" role="img" aria-hidden="true">
      <line x1="10" y1={axisY} x2="170" y2={axisY} stroke={ACCENT} strokeOpacity="0.3" strokeWidth="1" />
      {bars.map((b, i) => {
        const y = axisY - b.h;
        return (
          <rect
            key={i}
            x={b.x}
            y={y}
            width="20"
            height={b.h}
            rx="2"
            fill={ACCENT}
            opacity={b.spike ? 0.95 : 0.55}
            className={reduced ? undefined : "mission-bar"}
            style={reduced ? undefined : { animationDelay: `${i * 0.35}s` }}
          />
        );
      })}
      <line
        x1="10"
        y1={thresholdY}
        x2="170"
        y2={thresholdY}
        stroke={ACCENT}
        strokeOpacity="0.4"
        strokeWidth="1.3"
        strokeDasharray="5 3"
        className={reduced ? undefined : "mission-threshold"}
      />
    </svg>
  );
};

const ConstellationIllustration = ({ reduced }: { reduced: boolean }) => {
  const cx = 90;
  const cy = 84;
  const vertices = [
    { x: cx, y: cy - 44 },
    { x: cx - 44, y: cy + 28 },
    { x: cx + 44, y: cy + 28 },
  ];

  return (
    <svg viewBox="0 0 180 160" width="100%" height="100%" role="img" aria-hidden="true">
      {vertices.map((a, i) => {
        const b = vertices[(i + 1) % 3];
        return (
          <line
            key={`edge-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={ACCENT}
            strokeOpacity="0.5"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        );
      })}

      {vertices.map((v, i) => (
        <line
          key={`spoke-${i}`}
          x1={cx}
          y1={cy}
          x2={v.x}
          y2={v.y}
          stroke={ACCENT}
          strokeOpacity="0.18"
          strokeWidth="0.8"
        />
      ))}

      {vertices.map((v, i) => (
        <circle key={`v-${i}`} cx={v.x} cy={v.y} r="4" fill={ACCENT} opacity="0.95" />
      ))}

      <circle cx={cx} cy={cy} r="6" fill="none" stroke={ACCENT} strokeOpacity="0.4" strokeWidth="1">
        {!reduced && (
          <animate attributeName="r" values="5;10;5" dur="3.2s" repeatCount="indefinite" />
        )}
        {!reduced && (
          <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="3.2s" repeatCount="indefinite" />
        )}
      </circle>
      <circle cx={cx} cy={cy} r="3" fill={ACCENT} />
    </svg>
  );
};

const missionIllustrations = [Sphere3DIllustration, BarChartIllustration, ConstellationIllustration];

const pillarIllustrations = [PillarNetwork, PillarBallot, PillarLLM];

const PillarCard = ({
  pillar,
  Illustration,
  isMobile,
}: {
  pillar: { title: string; desc: string; href: string };
  Illustration: () => JSX.Element;
  isMobile: boolean;
}) => {
  const [hover, setHover] = useState(false);
  const [canHover, setCanHover] = useState<boolean>(
    () => typeof window === "undefined" || window.matchMedia("(hover: hover)").matches
  );
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover)");
    const onChange = () => setCanHover(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  const expanded = hover || isMobile || !canHover;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: isMobile ? undefined : "3 / 4",
      }}
    >
    <Link
      to={pillar.href}
      onClick={() => window.scrollTo({ top: 0 })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: isMobile ? "relative" : "absolute",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        background: "#f5f7fb",
        borderRadius: "4px",
        padding: "2rem 1.75rem 1.75rem",
        aspectRatio: isMobile ? undefined : expanded ? "3 / 4" : "1 / 1",
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
        transition: "background 0.3s ease, aspect-ratio 0.5s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "190px",
          aspectRatio: "190/160",
          alignSelf: "center",
          transition: "transform 0.5s ease",
          transform: expanded ? "translateY(-6px)" : "translateY(0)",
        }}
      >
        <Illustration />
      </div>
      <div style={{ marginTop: isMobile ? "1.25rem" : "auto" }}>
        <h3
          style={{
            fontSize: "clamp(1.4rem, 2vw, 1.75rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#0a1f4d",
            letterSpacing: "-0.015em",
            margin: 0,
            textAlign: "left",
          }}
        >
          {pillar.title}
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateRows: expanded ? "1fr" : "0fr",
            transition: "grid-template-rows 0.5s ease, margin-top 0.5s ease, opacity 0.4s ease",
            marginTop: expanded ? "1rem" : "0",
            opacity: expanded ? 1 : 0,
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <p
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.65,
                color: "rgba(10,31,77,0.7)",
                margin: 0,
              }}
            >
              {pillar.desc}
            </p>
            <span
              style={{
                display: "inline-block",
                marginTop: "1.1rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#003399",
              }}
            >
              Learn more →
            </span>
          </div>
        </div>
      </div>
    </Link>
    </div>
  );
};

const PublicationDiagram = () => {
  // Triangle centred in the 740-wide viewBox.
  // Exact arrow endpoints computed from circle-edge intersections so arrows
  // land flush on each circle surface.
  const nodes = [
    { cx: 360, cy: 110, r: 52, label: "Input",      accent: true  },
    { cx: 220, cy: 320, r: 62, label: "Processing",  accent: false },
    { cx: 500, cy: 320, r: 62, label: "Feedback",    accent: false },
  ];

  // Left side: slightly left of the circles, right side: past the Feedback circle
  const tPoints = [
    { id: "T3", label: "CONGESTED BUREAUCRACY",   dotX: -18, dotY: 185 },
    { id: "T4", label: "EPISTEMIC FLOOD",          dotX: -18, dotY: 227 },
    { id: "T1", label: "BELIEF HOMOGENIZATION",    dotX: 492, dotY: 185 },
    { id: "T2", label: "BELIEF REINFORCEMENT",     dotX: 492, dotY: 227 },
    { id: "T5", label: "UNAUDITABLE AUTHORITY",    dotX: 248, dotY: 440 },
    { id: "T6", label: "NORMATIVE CENTRALIZATION", dotX: 248, dotY: 475 },
    { id: "T7", label: "POWER CONCENTRATION",      dotX: 248, dotY: 510 },
  ];

  return (
    <svg viewBox="0 0 740 545" width="100%" height="100%" overflow="visible" role="img" aria-hidden="true">
      <defs>
        <marker
          id="pubdiag-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={ACCENT} />
        </marker>
      </defs>

      {/* Input(360,110,r52) → Processing(220,320,r62)
          exit ≈ (331,153), entry ≈ (254,268), control bows outward-left */}
      <path
        d="M 331 153 Q 258 210 254 268"
        stroke={ACCENT} strokeOpacity="0.85" strokeWidth="1.5"
        fill="none" markerEnd="url(#pubdiag-arrow)"
      />
      {/* Feedback(500,320,r62) → Input(360,110,r52)
          exit ≈ (466,268), entry ≈ (389,153), control bows outward-right */}
      <path
        d="M 466 268 Q 462 210 389 153"
        stroke={ACCENT} strokeOpacity="0.85" strokeWidth="1.5"
        fill="none" markerEnd="url(#pubdiag-arrow)"
      />
      {/* Processing(220,320) → Feedback(500,320)  horizontal, dips slightly */}
      <path
        d="M 282 320 Q 360 378 438 320"
        stroke={ACCENT} strokeOpacity="0.85" strokeWidth="1.5"
        fill="none" markerEnd="url(#pubdiag-arrow)"
      />

      {/* Circles + labels */}
      {nodes.map((n) => (
        <g key={n.label}>
          <circle cx={n.cx} cy={n.cy} r={n.r}
            fill={n.accent ? "#dbe4f4" : "#f5f8fe"}
            stroke={ACCENT} strokeWidth="1.3"
          />
          <text x={n.cx} y={n.cy + 6}
            textAnchor="middle" fontSize="18" fontWeight="600" fill="#0a1f4d"
          >
            {n.label}
          </text>
        </g>
      ))}

      {/* T-point labels */}
      {tPoints.map((t) => (
        <g key={t.id}>
          <circle cx={t.dotX} cy={t.dotY} r="4" fill={ACCENT} />
          <text x={t.dotX + 13} y={t.dotY + 5}
            textAnchor="start" fontSize="15" letterSpacing="0.07em"
          >
            <tspan fontWeight="700" fill={ACCENT}>{t.id}:</tspan>
            <tspan dx={6} fontWeight="500" fill="#0a1f4d" fillOpacity="0.85">{t.label}</tspan>
          </text>
        </g>
      ))}
    </svg>
  );
};

const HomePage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div>
      <Helmet>
        <title>EuroSafeAI — Multi-Agent AI Safety for Democracy</title>
        <meta name="description" content="EuroSafeAI is a nonprofit research organization advancing AI safety and security through rigorous research, threat assessment, and mitigation strategies." />
      </Helmet>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, #ffffff 0%, #ffffff 55%, #f5f7fb 100%)" }}
      >
        <GeometricMesh />
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 0%, rgba(245,247,251,0.3) 60%, #f5f7fb 100%)" }}
          />
        </motion.div>

        <motion.div
          style={{
            opacity: heroOpacity,
            maxWidth: "560px",
            width: "90%",
            textAlign: isMobile ? "center" : "left",
          }}
          className="relative z-10 mx-auto px-6"
        >
          <AnimatedSection>
            <h1
              className="font-display block"
              style={{
                fontSize: "clamp(1.9rem, 5.5vw, 4.6rem)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                lineHeight: 1.08,
                color: "#001233",
                textShadow: "0 2px 40px rgba(255,255,255,0.6)",
                marginBottom: 0,
              }}
            >
              <span className="block">Multi-Agent</span>
              <span className="block">AI Safety</span>
              <span className="block" style={{ color: "#003399", fontWeight: 700 }}>for Democracy</span>
            </h1>
            <div
              style={{
                width: "40px",
                height: "2px",
                background: "rgba(0,51,153,0.3)",
                margin: isMobile ? "1.4rem auto" : "1.4rem 0",
              }}
            />
            <p
              style={{
                fontSize: "0.95rem",
                letterSpacing: "0.01em",
                lineHeight: 1.65,
                color: "rgba(0,20,70,0.65)",
                maxWidth: "420px",
                marginLeft: isMobile ? "auto" : undefined,
                marginRight: isMobile ? "auto" : undefined,
                marginBottom: "1.8rem",
              }}
            >
              A nonprofit research organization led by Prof. Zhijing Jin, aiming to advance AI safety and security through rigorous research, threat assessment, and mitigation strategies.
            </p>
            <div
              style={{
                display: "flex",
                gap: "0.9rem",
                flexWrap: "wrap",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              <Link
                to="/research"
                onClick={() => window.scrollTo({ top: 0 })}
                style={{
                  background: "#003399",
                  border: "1px solid #003399",
                  color: "#fff",
                  padding: "0.75rem 1.8rem",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  borderRadius: "999px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4em",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#002277"; e.currentTarget.style.borderColor = "#002277"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#003399"; e.currentTarget.style.borderColor = "#003399"; }}
              >
                Our Research <span aria-hidden>›</span>
              </Link>
              <Link
                to="/team"
                onClick={() => window.scrollTo({ top: 0 })}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(0,51,153,0.4)",
                  color: "#003399",
                  padding: "0.75rem 1.8rem",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  borderRadius: "999px",
                  fontWeight: 600,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4em",
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#003399"; e.currentTarget.style.background = "rgba(0,51,153,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(0,51,153,0.4)"; e.currentTarget.style.background = "transparent"; }}
              >
                Meet Our Team <span aria-hidden>›</span>
              </Link>
            </div>
          </AnimatedSection>
        </motion.div>
      </section>

      {/* Mission / Content Section */}
      <section style={{ background: "#f5f7fb", padding: "7rem 0 9rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
                Mission
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "#0a1f4d",
                letterSpacing: "-0.025em",
                maxWidth: "900px",
                marginBottom: "5.5rem",
              }}
            >
              Making AI safe as it becomes<br /><span style={{ color: "#003399" }}>central to how the world works.</span>
            </h2>
          </AnimatedSection>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {missionBlocks.map((block, i) => {
              const Illustration = missionIllustrations[i];
              return (
                <AnimatedSection key={block.label} delay={i * 0.15}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      paddingTop: "0.9rem",
                    }}
                  >
                    {Illustration && (
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          aspectRatio: "190/160",
                          marginBottom: "2rem",
                        }}
                      >
                        <Illustration reduced={reducedMotion} />
                      </div>
                    )}
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#0a2a66",
                        marginBottom: "1.1rem",
                      }}
                    >
                      {block.label}
                    </span>
                    <p
                      style={{
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        lineHeight: 1.4,
                        color: "#0a1f4d",
                        marginBottom: "0.85rem",
                        letterSpacing: "-0.01em",
                        maxWidth: "320px",
                      }}
                    >
                      {block.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        lineHeight: 1.7,
                        color: "rgba(10,31,77,0.65)",
                        maxWidth: "320px",
                      }}
                    >
                      {block.body}
                    </p>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section style={{ background: "#fff", padding: "7rem 0 9rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
                Research Focus
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "#0a1f4d",
                letterSpacing: "-0.025em",
                maxWidth: "900px",
                marginBottom: "5.5rem",
              }}
            >
              Our <span style={{ color: "#003399" }}>three pillars</span> of AI safety research.
            </h2>
          </AnimatedSection>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "repeat(3, minmax(0, 1fr))",
              gap: "1.5rem",
              alignItems: "start",
            }}
          >
            {pillars.map((p, i) => {
              const Illustration = pillarIllustrations[i];
              return (
                <AnimatedSection key={p.title} delay={i * 0.12}>
                  <PillarCard pillar={p} Illustration={Illustration} isMobile={isMobile} />
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Publication */}
      <section style={{ background: "linear-gradient(180deg, #eef2fa 0%, #e7edf8 100%)", padding: "6rem 0 7rem" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1200px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1.05fr)",
              gap: isMobile ? "2.5rem" : "3.5rem",
              alignItems: "center",
            }}
          >
            <AnimatedSection>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
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
                  New Publication · 2026
                </span>
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 3.6vw, 3rem)",
                  fontWeight: 800,
                  lineHeight: 1.12,
                  color: "#0a1f4d",
                  letterSpacing: "-0.02em",
                  marginBottom: "1.6rem",
                  maxWidth: "480px",
                }}
              >
                AI Poses Risks to{" "}
                <span style={{ color: "#003399", fontStyle: "italic" }}>
                  Democratic and Social Systems.
                </span>
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  color: "rgba(10,31,77,0.78)",
                  marginBottom: "1.6rem",
                  maxWidth: "520px",
                }}
              >
                We identify{" "}
                <span style={{ color: "#003399", fontWeight: 700 }}>seven failure modes</span>{" "}
                through which AI poses risks to social systems — from belief homogenization and
                epistemic floods to power concentration and normative centralization — and argue
                that AI safety must complement model-level benchmarks with system-level evaluation
                that captures these aggregate institutional effects.
              </p>
              <p
                style={{
                  fontSize: "0.92rem",
                  lineHeight: 1.6,
                  color: "rgba(10,31,77,0.78)",
                  marginBottom: "1.6rem",
                  maxWidth: "520px",
                }}
              >
                {[
                  "David Guzman Piedrahita",
                  "Yoshua Bengio",
                  "Stuart Russell",
                  "Audrey Tang",
                  "Bernhard Schölkopf",
                  "Rada Mihalcea",
                  "Zhijing Jin",
                ].map((author, i, arr) => {
                  const member = findMemberByAuthorName(author);
                  const isLead = i === 0;
                  return (
                    <Fragment key={author}>
                      {member ? (
                        <Link
                          to={`/team/${member.slug}`}
                          onClick={() => window.scrollTo({ top: 0 })}
                          style={{
                            color: isLead ? "#0a1f4d" : "#003399",
                            fontWeight: isLead ? 700 : 600,
                            textDecoration: "none",
                            borderBottom: "1px solid rgba(0,51,153,0.25)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderBottomColor = "#003399";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderBottomColor = "rgba(0,51,153,0.25)";
                          }}
                        >
                          {author}
                        </Link>
                      ) : isLead ? (
                        <span style={{ fontWeight: 700, color: "#0a1f4d" }}>{author}</span>
                      ) : (
                        author
                      )}
                      {i < arr.length - 1 ? ", " : " "}
                    </Fragment>
                  );
                })}
                <span style={{ color: "rgba(10,31,77,0.45)" }}>+ 21 co-authors</span>
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "2rem",
                  marginBottom: "2rem",
                  fontSize: "0.72rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(10,31,77,0.55)",
                  fontWeight: 600,
                }}
              >
                <span>
                  <span style={{ color: "#003399", fontWeight: 700 }}>7</span> &nbsp;Failure Modes
                </span>
                <span>
                  <span style={{ color: "#003399", fontWeight: 700 }}>28</span> &nbsp;Co-Authors
                </span>
                <span>
                  <span style={{ color: "#003399", fontWeight: 700 }}>Pre-Print</span> &nbsp;2026
                </span>
              </div>
              <div style={{ display: "flex", gap: "0.9rem", flexWrap: "wrap" }}>
                <a
                  href="https://zhijing-jin.com/d/2026-ai-risk.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#003399",
                    border: "1px solid #003399",
                    color: "#fff",
                    padding: "0.75rem 1.8rem",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    borderRadius: "999px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4em",
                    textDecoration: "none",
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#002277"; e.currentTarget.style.borderColor = "#002277"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#003399"; e.currentTarget.style.borderColor = "#003399"; }}
                >
                  Read the Paper <span aria-hidden>›</span>
                </a>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <PublicationDiagram />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Collaborators */}
      <section style={{ background: "#ffffff", padding: "7rem 0 7rem", overflow: "hidden" }}>
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <div
              style={{
                display: "flex",
                alignItems: "center",
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
                Collaborations
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                fontWeight: 800,
                lineHeight: 1.12,
                color: "#0a1f4d",
                letterSpacing: "-0.025em",
                maxWidth: "900px",
                marginBottom: "1.6rem",
              }}
            >
              Our <span style={{ color: "#003399" }}>collaborators</span>.
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "rgba(10,31,77,0.65)",
                maxWidth: "640px",
                marginBottom: "1rem",
              }}
            >
              We collaborate with leading research labs, governments, and foundations to advance AI safety on a global scale.
            </p>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "rgba(10,31,77,0.65)",
                maxWidth: "640px",
                marginBottom: "5rem",
              }}
            >
              We are in close collaboration with other ongoing efforts in AI
              safety, such as the Canadian AI Safety Institute (
              <a
                href="/institute-efforts/canada"
                style={{ color: ACCENT, textDecoration: "underline", textUnderlineOffset: "2px" }}
              >
                see our demo
              </a>
              ), and ELLIS (
              <a
                href="/institute-efforts/ellis"
                style={{ color: ACCENT, textDecoration: "underline", textUnderlineOffset: "2px" }}
              >
                see our demo
              </a>
              ).
            </p>
          </AnimatedSection>
        </div>
        <div className="relative">
          <div className="flex animate-marquee gap-24 items-center w-max">
            {[...collaborators, ...collaborators, ...collaborators].map((c, i) => (
              <a
                key={`${c.name}-${i}`}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={c.name}
                className="shrink-0 flex items-center justify-center"
                style={{ height: "80px", width: "220px" }}
              >
                <img src={c.logo} alt={c.name} loading="lazy" className="object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" style={{ height: "100%", width: "100%" }} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section style={{ background: "#003399", padding: "6rem 0 7rem" }}>
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
              Join Our Mission
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
              We're looking for talented researchers and professionals who are passionate about ensuring AI benefits humanity.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
              <Link
                to="/careers"
                onClick={() => window.scrollTo({ top: 0 })}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5em",
                  padding: "0.85rem 1.6rem",
                  background: "#ffffff",
                  color: "#003399",
                  borderRadius: "999px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "background 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.92)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#ffffff"; }}
              >
                View Open Positions <span aria-hidden>›</span>
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
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "#ffffff"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)"; }}
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

export default HomePage;
