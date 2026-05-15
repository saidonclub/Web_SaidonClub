// ============================================================
// COMPONENT: Value Proposition — Premium Split Layout
// ============================================================

"use client";

import styles from "./ValueProposition.module.css";
import Link from "next/link";
import { ShieldCheck, Zap, Users, BarChart3, ChevronRight } from "lucide-react";

const POINTS = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Confianza y Respaldo",
    description: "Operamos con total transparencia. Tu patrimonio y datos están protegidos con cifrado de nivel bancario.",
  },
  {
    icon: <Zap size={22} />,
    title: "Resultados Inmediatos",
    description: "Sin esperas. Acreditamos tus recompensas al instante para que veas el fruto de tu lealtad cuando más lo necesitas.",
  },
  {
    icon: <Users size={22} />,
    title: "Somos una Familia",
    description: "Al unirte a SaidonClub, entras a un círculo de emprendedores que se apoyan, crecen y celebran cada logro juntos.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Valor a tu Fidelidad",
    description: "Nuestro programa de recompensas está diseñado para valorar cada compra y cada persona que invitas a la comunidad.",
  },
];

const VISUAL_STATS = [
  { value: "+124%", label: "Crecimiento Anual", color: "#FF6B00" },
  { value: "5,000+", label: "Miembros Activos", color: "#22c55e" },
  { value: "$2M+", label: "Ahorros Generados", color: "#9333EA" },
];

const CAROUSEL_IMAGES = [
  "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=800&auto=format&fit=crop", // Latina professional
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=800&auto=format&fit=crop", // Latin American group
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop", // Hispanic woman working
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop", // Team collaboration
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop"  // Hispanic male professional
];

export default function ValueProposition() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Visual Side */}
        <div className={styles.visualSide}>
          <div className={styles.imageCard}>
            <div className={styles.carouselWrapper}>
              <div className={styles.carouselImages}>
                {CAROUSEL_IMAGES.map((src, i) => (
                  <img key={i} src={src} alt="Comunidad SaidonClub" className={styles.carouselImage} />
                ))}
              </div>

              {/* Stats floating over the carousel overlay */}
              <div className={styles.carouselOverlay}>
                <div className={styles.visualStats}>
                  {VISUAL_STATS.map((s, i) => (
                    <div key={i} className={styles.visualStat} style={{ "--stat-color": s.color } as React.CSSProperties}>
                      <span className={styles.visualStatValue}>{s.value}</span>
                      <span className={styles.visualStatLabel}>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Central icon */}
                <div className={styles.centralIcon}>
                  <span>🏆</span>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className={styles.floatingBadge}>
              <span className={styles.badgeIcon}>📈</span>
              <div>
                <div className={styles.badgeValue}>+124%</div>
                <div className={styles.badgeLabel}>Crecimiento Anual</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Side */}
        <div className={styles.contentSide}>
          <span className={styles.eyebrow}>Valor Diferencial</span>
          <h2 className={styles.title}>
            Diseñado para los que no se conforman
            <span className={styles.titleAccent}> con lo ordinario</span>
          </h2>
          <p className={styles.description}>
            En SaidonClub no solo compras o vendes; eres parte de un ecosistema de crecimiento colaborativo que premia la lealtad y la comunidad.
          </p>

          <div className={styles.grid}>
            {POINTS.map((p, i) => (
              <div key={i} className={styles.point}>
                <div className={styles.iconBox}>{p.icon}</div>
                <div className={styles.text}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/auth/register" className={styles.primaryBtn}>
              Empezar mi Transformación <ChevronRight size={18} />
            </Link>
            <Link href="/nosotros" className={styles.secondaryBtn}>
              Conocer más
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
