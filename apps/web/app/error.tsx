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
    <div 
      className="flex-center" 
      style={{ 
        minHeight: "75vh", 
        flexDirection: "column", 
        gap: "24px", 
        padding: "40px",
        position: "relative",
        overflow: "hidden",
        background: "radial-gradient(circle at center, rgba(255, 107, 0, 0.05) 0%, transparent 70%)"
      }}
    >
      {/* Cyber Grid Background lines */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255, 107, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 107, 0, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          backgroundPosition: "center",
          pointerEvents: "none",
          opacity: 0.8,
          zIndex: 0
        }}
      />

      <div 
        className="card-glass" 
        style={{ 
          maxWidth: "520px", 
          width: "100%", 
          textAlign: "center", 
          padding: "48px 40px",
          position: "relative",
          zIndex: 1,
          border: "1px solid rgba(255, 107, 0, 0.2)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 107, 0, 0.05), inset 0 0 20px rgba(255, 107, 0, 0.02)",
          borderRadius: "var(--radius-xl, 24px)",
          backdropFilter: "blur(20px)",
          background: "rgba(10, 10, 11, 0.85)"
        }}
      >
        {/* Styled Pulsing Error Icon Container */}
        <div 
          style={{ 
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255, 107, 0, 0.1)",
            border: "1px solid rgba(255, 107, 0, 0.3)",
            marginBottom: "24px",
            boxShadow: "0 0 20px rgba(255, 107, 0, 0.15)",
            animation: "pulseGlow 2.5s infinite ease-in-out"
          }}
        >
          <svg 
            width="36" 
            height="36" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="var(--clr-orange, #FF6B00)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <h1 
          style={{ 
            fontSize: "28px", 
            fontWeight: 800, 
            marginBottom: "12px", 
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, var(--clr-text-primary, #F5F5F7) 50%, var(--clr-text-secondary, #A1A1AA) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Error Inesperado
        </h1>

        <p 
          style={{ 
            color: "var(--clr-text-secondary, #A1A1AA)", 
            marginBottom: "32px", 
            fontSize: "15px",
            lineHeight: "1.6"
          }}
        >
          El ecosistema SaidonClub ha experimentado una interrupción temporal. Nuestro equipo técnico ha registrado la anomalía para su pronta solución.
        </p>

        {error.digest && (
          <div 
            style={{
              padding: "10px 16px",
              background: "rgba(255, 107, 0, 0.05)",
              border: "1px solid rgba(255, 107, 0, 0.1)",
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "monospace",
              color: "rgba(255, 107, 0, 0.8)",
              marginBottom: "32px",
              wordBreak: "break-all"
            }}
          >
            ID Incidente: {error.digest}
          </div>
        )}

        <div className="flex" style={{ gap: "16px", justifyContent: "center", flexDirection: "row" }}>
          <button 
            onClick={reset} 
            className="btn btn-primary"
            style={{
              padding: "12px 28px",
              background: "linear-gradient(135deg, var(--clr-orange, #FF6B00), #e55a00)",
              color: "#000",
              fontWeight: 700,
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: "var(--shadow-orange, 0 8px 20px rgba(255, 107, 0, 0.35))",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
          >
            Reintentar Ecosistema
          </button>
          
          <Link 
            href="/" 
            className="btn"
            style={{
              padding: "12px 28px",
              background: "rgba(255, 255, 255, 0.04)",
              color: "var(--clr-text-primary, #F5F5F7)",
              fontWeight: 600,
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              textDecoration: "none",
              transition: "background 0.2s ease, border-color 0.2s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
              e.currentTarget.style.borderColor = "rgba(255, 107, 0, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
          >
            Volver al Inicio
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 20px rgba(255, 107, 0, 0.15);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 35px rgba(255, 107, 0, 0.3);
            transform: scale(1.03);
          }
          100% {
            box-shadow: 0 0 20px rgba(255, 107, 0, 0.15);
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}