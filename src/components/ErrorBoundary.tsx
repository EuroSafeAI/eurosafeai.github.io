import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
            fontFamily: "sans-serif",
            color: "#0a1f4d",
          }}
        >
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "rgba(10,31,77,0.6)", maxWidth: "480px", lineHeight: 1.6 }}>
            An unexpected error occurred. Please refresh the page or contact us if the problem
            persists.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "1.5rem",
              padding: "0.6rem 1.4rem",
              background: "#003399",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem",
            }}
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
