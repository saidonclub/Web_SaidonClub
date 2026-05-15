"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "24px", padding: "40px" }}>
      <div className="card-glass" style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
          Algo salió mal
        </h1>
        <p style={{ color: "var(--clr-text-secondary)", marginBottom: "24px", fontSize: "14px" }}>
          Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
        </p>
        <div className="flex" style={{ gap: "12px", justifyContent: "center" }}>
          <button onClick={reset} className="btn btn-primary">
            Reintentar
          </button>
          <Link href="/" className="btn btn-secondary">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}