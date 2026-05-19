import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import modelsData from "@/data/models.json";
import type { ModelEntry } from "@/data/models.types";

const ACCENT = "#003399";
const INK = "#0a1f4d";

const MODELS = modelsData as ModelEntry[];

const CertificateDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const model = slug ? MODELS.find((m) => m.id === slug) : undefined;

  useEffect(() => {
    if (!slug) return;
    // Auto-trigger download (matches the original DownloadTrigger behavior).
    const link = document.createElement("a");
    link.href = `/certificate/${slug}.pdf`;
    link.download = `${slug}-eurosafe-certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [slug]);

  if (!slug) return null;

  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      <Helmet>
        <title>{model ? `${model.name} Safety Certificate` : "Safety Certificate"} — EuroSafeAI</title>
        <meta name="description" content={model ? `Download the EuroSafeAI safety certificate for ${model.name} by ${model.company}.` : "Download an EuroSafeAI AI model safety certificate."} />
      </Helmet>
      <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 1rem",
        background: "linear-gradient(135deg, #f8fafc 0%, rgba(238,242,250,0.5) 50%, #ffffff 100%)",
      }}
    >
      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(0,51,153,0.08)",
            color: ACCENT,
            marginBottom: "1.5rem",
            boxShadow: "0 4px 12px -6px rgba(10,31,77,0.15)",
          }}
        >
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v10m0 0l-3-3m3 3l3-3M4 17v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
          </svg>
        </div>

        <h1 style={{ fontSize: "1.6rem", fontWeight: 800, color: INK, letterSpacing: "-0.01em", marginBottom: 4 }}>
          {model ? model.name : slug}
        </h1>
        {model && <p style={{ fontSize: "0.9rem", color: "rgba(10,31,77,0.55)", marginBottom: "1.5rem" }}>{model.company}</p>}

        <p style={{ fontSize: "0.9rem", color: "rgba(10,31,77,0.65)", marginBottom: "2rem", lineHeight: 1.55 }}>
          Your certificate is downloading… If it doesn't start automatically, use the button below.
        </p>

        <a
          href={`/certificate/${slug}.pdf`}
          download={`${slug}-eurosafe-certificate.pdf`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5em",
            padding: "0.75rem 1.5rem",
            background: ACCENT,
            color: "#ffffff",
            borderRadius: 8,
            fontSize: "0.85rem",
            fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.04em",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#002277")}
          onMouseLeave={(e) => (e.currentTarget.style.background = ACCENT)}
        >
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Certificate
        </a>

        <p style={{ marginTop: "2rem", fontSize: "0.78rem", color: "rgba(10,31,77,0.45)" }}>
          <Link
            to="/certificate"
            onClick={() => window.scrollTo({ top: 0 })}
            style={{ color: "inherit", textDecoration: "underline" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = ACCENT)}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(10,31,77,0.45)")}
          >
            ← Back to the leaderboard
          </Link>
        </p>
      </div>
      </div>
    </div>
  );
};

export default CertificateDetailPage;
