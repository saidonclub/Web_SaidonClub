// ============================================================
// COMPONENT: Terminal Wrapper para Dashboard
// PURPOSE: Wrapper cliente para integrar la terminal unificada en el dashboard
// ============================================================

"use client";

import dynamic from "next/dynamic";

const UnifiedTerminal = dynamic(
  () =>
    import("./UnifiedTerminal").then((mod) => ({
      default: mod.UnifiedTerminal,
    })),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "rgba(255,255,255,0.6)",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        Cargando terminal...
      </div>
    ),
  },
);

export default function TerminalWrapper() {
  return <UnifiedTerminal />;
}
