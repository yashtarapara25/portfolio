import { createRoot } from "react-dom/client";
import { Component, type ReactNode } from "react";
import App from "./App.tsx";
import "./index.css";

// ── Global Error Boundary ─────────────────────────────────────────────────────
// Prevents the entire page from going blank on an unhandled render error.
// Shows a human-readable fallback with the error message instead.
class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#050816",
            color: "#e2e8f0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: "12px",
              padding: "2rem 3rem",
              maxWidth: "600px",
            }}
          >
            <h1 style={{ color: "#f87171", fontSize: "1.5rem", marginBottom: "1rem" }}>
              ⚠️ Something went wrong
            </h1>
            <p style={{ color: "#94a3b8", marginBottom: "1rem", fontSize: "0.9rem" }}>
              {this.state.error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: "rgba(34,211,238,0.15)",
                border: "1px solid rgba(34,211,238,0.4)",
                color: "#22d3ee",
                padding: "0.6rem 1.5rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
