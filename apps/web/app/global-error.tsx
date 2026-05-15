"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error: _error, reset }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0a0a0f",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Inter', system-ui, sans-serif",
          padding: "2rem",
          color: "#f0f0f0",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "480px",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1.5rem" }}>🔴</div>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "700",
              marginBottom: "1rem",
              color: "#f0f0f0",
            }}
          >
            Error crítico del sistema
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              marginBottom: "2rem",
              lineHeight: 1.6,
            }}
          >
            SaidonClub encontró un problema grave. Por favor recarga la página
            o contacta a soporte si el problema persiste.
          </p>

          <button
            onClick={reset}
            style={{
              padding: "0.85rem 2.5rem",
              background: "linear-gradient(135deg, #ff6600, #e55a00)",
              color: "#fff",
              border: "none",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            🔄 Recargar
          </button>
        </div>
      </body>
    </html>
  );
}
