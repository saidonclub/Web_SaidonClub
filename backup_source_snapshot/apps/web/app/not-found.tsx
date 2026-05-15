import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-center" style={{ minHeight: "60vh", flexDirection: "column", gap: "24px", padding: "40px" }}>
      <div className="card-glass" style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "40px" }}>
        <div style={{ fontSize: "64px", fontWeight: 800, marginBottom: "8px", background: "linear-gradient(135deg, var(--clr-orange-light), var(--clr-orange))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>
          Página no encontrada
        </h1>
        <p style={{ color: "var(--clr-text-secondary)", marginBottom: "24px", fontSize: "14px" }}>
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex" style={{ gap: "12px", justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">
            Volver al inicio
          </Link>
          <Link href="/productos" className="btn btn-secondary">
            Ver productos
          </Link>
        </div>
      </div>
    </div>
  );
}