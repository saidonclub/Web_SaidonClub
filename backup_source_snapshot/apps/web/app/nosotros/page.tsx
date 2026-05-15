import type { Metadata } from "next";
import { Shield, Target, Zap, Globe, Award, Heart, TrendingUp, Users, DollarSign } from 'lucide-react'
import Link from 'next/link'
import styles from './Nosotros.module.css'

export const metadata: Metadata = {
  title: 'Nosotros | SaidonClub — La Revolución del Comercio en Ecuador',
  description: 'Conoce la historia, misión y visión de SaidonClub, el ecosistema líder en servicios y productos exclusivos con tecnología multinivel.',
  openGraph: {
    title: 'Nosotros | SaidonClub',
    description: 'Revolucionando el comercio en Ecuador.',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
}

export default function NosotrosPage() {
  return (
    <main className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <h1 className={`${styles.title} gradient-text animate-fade-up`}>Nuestra Historia</h1>
          <p className={styles.subtitle}>
            Revolucionando el mercado ecuatoriano a través de la tecnología, la exclusividad y el crecimiento compartido.
          </p>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.card}>
              <Target className={styles.cardIcon} size={40} />
              <h3 className={styles.cardTitle}>Nuestra Misión</h3>
              <p className={styles.cardText}>
                Empoderar a miles de ecuatorianos proporcionando una plataforma tecnológica robusta que facilite el comercio de servicios y productos, impulsado por un sistema de recompensas que premia la fidelidad y el crecimiento de nuestra red.
              </p>
            </div>

            <div className={styles.card}>
              <Globe className={styles.cardIcon} size={40} />
              <h3 className={styles.cardTitle}>Nuestra Visión</h3>
              <p className={styles.cardText}>
                Ser la plataforma líder en el mercado nacional, reconocida por su integridad, innovación constante y por ser el motor de transformación económica para todos nuestros miembros para el año 2027.
              </p>
            </div>

            <div className={styles.card}>
              <Zap className={styles.cardIcon} size={40} />
              <h3 className={styles.cardTitle}>Innovación</h3>
              <p className={styles.cardText}>
                Buscamos constantemente nuevas formas de mejorar la experiencia de nuestros usuarios, integrando las últimas tendencias tecnológicas en nuestro marketplace y sistema de recompensas colaborativo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            <div>
              <span className={styles.statValue}>10K+</span>
              <span className={styles.statLabel}>Miembros Activos</span>
            </div>
            <div>
              <span className={styles.statValue}>$2M+</span>
              <span className={styles.statLabel}>Premios Entregados</span>
            </div>
            <div>
              <span className={styles.statValue}>500+</span>
              <span className={styles.statLabel}>Proveedores VIP</span>
            </div>
            <div>
              <span className={styles.statValue}>8 Niv</span>
              <span className={styles.statLabel}>Red Profunda</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Oportunidad de Negocio ─ Anchor: #red ── */}
      <section id="red" className={styles.section}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Oportunidad de Negocio</h2>
          <p style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem', color: 'var(--clr-text-dim)', lineHeight: 1.8 }}>
            SaidonClub no es solo un marketplace — es un sistema de generación de ingresos sostenibles a través de una red colaborativa.
            Cada miembro Pionero puede construir su propia red con hasta <strong>8 niveles de recompensas</strong>.
          </p>
          <div className={styles.grid}>
            <div className={styles.card}>
              <Users className={styles.cardIcon} size={40} />
              <h4 className={styles.cardTitle}>Sistema 1+1</h4>
              <p className={styles.cardText}>Invita a 2 personas. Cada una de ellas invita a 2 más. Tu red crece de forma exponencial y orgánica sin ventas agresivas.</p>
            </div>
            <div className={styles.card}>
              <TrendingUp className={styles.cardIcon} size={40} />
              <h4 className={styles.cardTitle}>8 Niveles de Ingreso</h4>
              <p className={styles.cardText}>Cada membresía activada en tu red genera puntos y bonos para ti. El sistema recompensa la construcción sostenible de comunidad.</p>
            </div>
            <div className={styles.card}>
              <DollarSign className={styles.cardIcon} size={40} />
              <h4 className={styles.cardTitle}>Ingresos Residuales</h4>
              <p className={styles.cardText}>Tus ingresos no dependen solo de ti. Una red activa genera recompensas continuas. Economía colaborativa aplicada al consumo inteligente.</p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link href="/membresias" className="btn btn-primary btn-lg">
              Ver Planes de Membresía
            </Link>
          </div>
        </div>
      </section>

      {/* ── Sistema de Puntos ─ Anchor: #economia ── */}
      <section id="economia" className={styles.statsSection}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>El Sistema de Puntos SaidonClub</h2>
          <div className={styles.statsGrid}>
            <div>
              <span className={styles.statValue}>1 pt</span>
              <span className={styles.statLabel}>= $0.01 USD</span>
            </div>
            <div>
              <span className={styles.statValue}>100%</span>
              <span className={styles.statLabel}>Canjeable en el Marketplace</span>
            </div>
            <div>
              <span className={styles.statValue}>P2P</span>
              <span className={styles.statLabel}>Transferencias entre Socios</span>
            </div>
            <div>
              <span className={styles.statValue}>8 niv</span>
              <span className={styles.statLabel}>De generación de puntos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.section}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '3rem' }}>Nuestros Valores</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <Shield className={styles.cardIcon} size={32} />
              <h4 className={styles.cardTitle}>Transparencia</h4>
              <p className={styles.cardText}>La honestidad es el pilar de nuestras relaciones con proveedores y clientes.</p>
            </div>
            <div className={styles.card}>
              <Award className={styles.cardIcon} size={32} />
              <h4 className={styles.cardTitle}>Excelencia</h4>
              <p className={styles.cardText}>No nos conformamos con menos que lo mejor en cada producto y servicio listado.</p>
            </div>
            <div className={styles.card}>
              <Heart className={styles.cardIcon} size={32} />
              <h4 className={styles.cardTitle}>Comunidad</h4>
              <p className={styles.cardText}>Crecemos juntos. El éxito de uno es el éxito de todo el ecosistema SaidonClub.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Proveedores ─ Anchor: #proveedores ── */}
      <section id="proveedores" className={styles.section}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>¿Eres Proveedor o Profesional?</h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--clr-text-dim)', lineHeight: 1.8 }}>
            Si tienes productos o servicios que ofrecer, SaidonClub es tu vitrina digital premium.
            Llega a miles de socios calificados que valoran la calidad y están listos para comprar.
          </p>
          <Link href="/contacto" className="btn btn-primary btn-lg">
            Postularme como Proveedor
          </Link>
        </div>
      </section>

      {/* CTA Final */}
      <section className={styles.cta}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Únete a la Revolución SaidonClub</h2>
          <Link href="/auth/register" className="btn btn-primary btn-lg">
            Comenzar Ahora
          </Link>
        </div>
      </section>
    </main>
  )
}
