import React from "react";
import Link from "next/link";
import {
  Target, 
  Globe, 
  Trophy, 
  Heart,
  ArrowRight
} from "lucide-react";
import styles from "./Nosotros.module.css";


export const metadata = {
  title: "Sobre Nosotros | SaidonClub - El Ecosistema de Élite en Ecuador",
  description: "Conoce la visión, misión y el equipo detrás de SaidonClub. Estamos transformando la economía colaborativa en Ecuador con tecnología y comunidad.",
};

export default function NosotrosPage() {
  return (
    <main className={styles.container}>
      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroShimmer} />
        <div className={styles.heroInner}>
          <span className={styles.heroBadge}>
            <Trophy size={14} />
            Líderes en Economía Colaborativa
          </span>
          <h1 className={styles.title}>
            Estamos Redefiniendo el <span>Futuro</span> del Éxito
          </h1>
          <p className={styles.subtitle}>
            SaidonClub no es solo un marketplace; es un ecosistema diseñado para 
            empoderar a cada individuo a través de la comunidad, la tecnología y 
            beneficios sin precedentes.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>15K+</span>
            <span className={styles.statLabel}>Socios Activos</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>500+</span>
            <span className={styles.statLabel}>Marcas Aliadas</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>$2M+</span>
            <span className={styles.statLabel}>Ahorro Generado</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>24/7</span>
            <span className={styles.statLabel}>Soporte Élite</span>
          </div>
        </div>
      </section>

      {/* ── MISSION / VISION ── */}
      <section className={styles.section}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Target size={32} />
            </div>
            <h2 className={styles.cardTitle}>Nuestra Misión</h2>
            <p className={styles.cardText}>
              Democratizar el acceso a productos y servicios premium, creando un sistema 
              donde el consumo inteligente se traduce en prosperidad compartida para 
              todas las familias ecuatorianas.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Globe size={32} />
            </div>
            <h2 className={styles.cardTitle}>Nuestra Visión</h2>
            <p className={styles.cardText}>
              Ser el ecosistema de beneficios líder en Latinoamérica, reconocido por 
              nuestra transparencia, innovación tecnológica y el impacto positivo 
              en la calidad de vida de nuestros socios.
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <Heart size={32} />
            </div>
            <h2 className={styles.cardTitle}>Nuestros Valores</h2>
            <p className={styles.cardText}>
              Integridad, Innovación, Comunidad y Excelencia. En SaidonClub, cada 
              decisión se toma pensando en el bienestar a largo plazo de nuestra 
              red de socios.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.cta}>
        <div className={styles.heroInner}>
          <h2 className={styles.ctaTitle}>¿Listo para formar parte de la élite?</h2>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link href="/membresias" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              Ver Membresías <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
