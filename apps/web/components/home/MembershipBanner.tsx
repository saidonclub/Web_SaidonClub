// ============================================================
// COMPONENT: Membership Banner
// PURPOSE: Display membership tiers and upgrade CTA
// ============================================================

import Link from "next/link";
import styles from "./MembershipBanner.module.css";

const PLANS = [
  {
    id: "preferente",
    icon: "🌟",
    name: "Membresía Preferente",
    price: 99,
    period: "anual",
    color: "#A0A0A0",
    borderGradient: "linear-gradient(135deg, #2A2A2A, #1A1A1A)",
    features: [
      "Acceso completo al Marketplace Premium",
      "Descuentos exclusivos en marcas seleccionadas",
      "Panel de control personal",
      "Programa de referidos básico",
      "Soporte estándar",
    ],
    cta: "Empezar Ahora — $99/año",
    href: "/auth/register?plan=preferente",
  },
  {
    id: "pionero",
    icon: "🔥",
    name: "Membresía Pionero",
    price: 299,
    period: "único",
    color: "#FF6B00",
    borderGradient: "linear-gradient(135deg, #FF6B00, #FF3D00)",
    features: [
      "Todo lo de Preferente incluido",
      "Programa de Recompensas por Referidos (8 Niveles)",
      "Puntos de bienvenida al activar tu membresía",
      "Estatus de Socio Pionero Vitalicio en el ecosistema",
      "Descuentos de hasta el 30% en seleccionados",
      "Panel Profesional de Gestión de Beneficios",
      "Kit de bienvenida digital exclusivo",
    ],
    cta: "¡Asegurar mi Lugar Pionero!",
    href: "/auth/register?plan=pionero",
    highlight: true,
    badge: "MÁS RENTABLE",
  },
];

export default function MembershipBanner() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>MEMBRESÍAS SAIDONCLUB</span>
          <h2 className={styles.title}>Elige tu Nivel de Acceso</h2>
          <p className={styles.subtitle}>
            Todas las membresías incluyen acceso inmediato al marketplace.{" "}
            <strong>Sin pagos recurrentes obligatorios</strong> en el plan
            Pionero.
          </p>
        </div>

        <div className={styles.grid}>
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.card} ${plan.highlight ? styles.featured : ""}`}
            >
              {plan.badge && (
                <div className={styles.featuredBadge}>{plan.badge}</div>
              )}

              <div className={styles.cardIcon}>{plan.icon}</div>
              <h3 className={styles.planName}>{plan.name}</h3>

              <div className={styles.priceRow}>
                <span className={styles.currency}>$</span>
                <span className={styles.price} style={{ color: plan.color }}>
                  {plan.price}
                </span>
                <span className={styles.period}>/{plan.period}</span>
              </div>

              <ul className={styles.features}>
                {plan.features.map((f) => (
                  <li key={f} className={styles.feature}>
                    <span
                      className={styles.check}
                      style={{ color: plan.color }}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={
                  plan.highlight ? styles.ctaFeatured : styles.ctaDefault
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}

          {/* Info Card */}
          <div className={styles.infoCard}>
            <div className={styles.infoIcon}>💡</div>
            <h3 className={styles.infoTitle}>¿Por qué elegir Pionero?</h3>
            <p className={styles.infoText}>
              El plan Pionero es un pago único de $299 que desbloquea el
              programa de recompensas de referidos en 8 niveles. Empieza a
              recuperar tu inversión desde el primer mes al compartir con tus
              primeros 2 socios.
            </p>
            <div className={styles.calcBox}>
              <div className={styles.calcRow}>
                <span>2 invitados Pionero</span>
                <span className={styles.calcVal}>+2,580 pts</span>
              </div>
              <div className={styles.calcRow}>
                <span>Amigos de tus amigos (5 personas)</span>
                <span className={styles.calcVal}>+3,225 pts</span>
              </div>
              <div className={styles.calcRow}>
                <span>Bono de bienvenida</span>
                <span className={styles.calcVal}>+8,000 pts</span>
              </div>
              <div className={`${styles.calcRow} ${styles.calcTotal}`}>
                <span>Beneficios mes 1</span>
                <span className={styles.calcVal}>+13,805 pts</span>
              </div>
            </div>
            <p className={styles.disclaimer}>
              *Ejemplo estimado basado en el programa de recompensas oficial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
