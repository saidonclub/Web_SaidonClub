'use client';

import styles from './TrustSection.module.css';
import { Lock, Zap, Globe, Award, Quote, Star, Check } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const TRUST_POINTS = [
  {
    icon: <Lock size={32} />,
    title: "Seguridad de Nivel Bancario",
    desc: "Tus transacciones y datos están protegidos por cifrado de extremo a extremo y protocolos de seguridad internacional."
  },
  {
    icon: <Globe size={32} />,
    title: "Comunidad en Expansión",
    desc: "Nacidos en Ecuador para el mundo. Conectamos miles de usuarios en una red de beneficio mutuo y crecimiento real."
  },
  {
    icon: <Award size={32} />,
    title: "Calidad Certificada",
    desc: "Cada proveedor y producto en SaidonClub pasa por un riguroso proceso de verificación para garantizar tu satisfacción."
  }
];

const TESTIMONIALS = [
  {
    name: "Andrea Vaca",
    role: "Socia Fundadora",
    text: "Convertir mis gastos diarios en una fuente de ingresos fue la mejor decisión. SaidonClub no es solo ahorro, es libertad financiera.",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    category: "mlm",
    points: "+2,450 pts"
  },
  {
    name: "Dr. Carlos Ruiz",
    role: "Proveedor de Servicios",
    text: "Como profesional, Saidon me ha permitido llegar a clientes de calidad que valoran mi trabajo. El sistema de comisiones es el más justo del mercado.",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    category: "service",
    points: "⭐ 5.0"
  },
  {
    name: "Lorena Mendez",
    role: "Cliente Inteligente",
    text: "La variedad de productos y los descuentos directos son increíbles. Compro lo de siempre, pero pago mucho menos y gano puntos.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    category: "product",
    points: "$120 Ahorrados"
  },
  {
    name: "Javier Ortiz",
    role: "Líder de Red",
    text: "El modelo de economía colaborativa de SaidonClub realmente funciona. He visto a mi equipo crecer y prosperar en pocos meses.",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
    category: "mlm",
    points: "+5,800 pts"
  },
  {
    name: "Sofia Pazmiño",
    role: "Emprendedora Digital",
    text: "La plataforma es intuitiva y el soporte es excelente. Recomiendo SaidonClub a cualquiera que quiera digitalizar sus beneficios.",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
    category: "product",
    points: "Top Comprador"
  }
];

export default function TrustSection() {
  // Duplicamos los testimonios para un scroll infinito suave
  return (
    <section className={styles.section} id="trust">
      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />

      <div className={styles.inner}>
        {/* Main Trust Grid */}
        <div className={styles.trustGrid}>
          {TRUST_POINTS.map((point, i) => (
            <motion.div 
              key={i} 
              className={styles.trustCard}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={styles.trustIcon}>{point.icon}</div>
              <h3 className={styles.trustTitle}>{point.title}</h3>
              <p className={styles.trustDesc}>{point.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Testimonials Carousel - Business Premium Style */}
        <div className={styles.testimonialsSection}>
          <div className={styles.tHeader}>
            <span className={styles.eyebrow}>Impacto Real</span>
            {/* TÍTULO SOLICITADO POR EL USUARIO: Enfoque en pertenencia y voz del socio */}
            <h2 className={styles.tTitle}>Lo que dice nuestra comunidad</h2>
          </div>

          <div className={styles.carouselContainer}>
            <div className={styles.carouselTrack}>
              {/* Duplicamos para el efecto de loop infinito ultra-suave */}
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className={styles.testimonialCard} data-category={t.category}>
                  <div className={styles.cardGlow} />
                  
                  <div className={styles.cardTop}>
                    <div className={styles.quoteIcon}><Quote size={24} fill="currentColor" /></div>
                    <div className={styles.rating}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  
                  <blockquote className={styles.testimonialQuote}>
                    "{t.text}"
                  </blockquote>
                  
                  <div className={styles.testimonialProfile}>
                    <div className={styles.avatarWrapper}>
                      <Image 
                        src={t.photo} 
                        alt={t.name} 
                        width={60} 
                        height={60} 
                        className={styles.avatar}
                      />
                      <div className={styles.checkBadge}><Check size={10} strokeWidth={4} /></div>
                    </div>
                    
                    <div className={styles.profileInfo}>
                      <h4 className={styles.profileName}>{t.name}</h4>
                      <p className={styles.profileRole}>{t.role}</p>
                    </div>

                    <div className={styles.categoryBadge}>
                      {t.points}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA Card */}
        <motion.div 
          className={styles.finalCta}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className={styles.ctaGlow} />
          <div className={styles.ctaWrapper}>
            <h2 className={styles.ctaTitle}>¿Listo para transformar tu economía?</h2>
            <p className={styles.ctaText}>
              Únete a <strong>más de 5,000 ecuatorianos</strong> que ya están ahorrando y ganando cada día. 
              El registro es gratuito y los beneficios son inmediatos.
            </p>
            <Link href="/auth/register" className={styles.ctaBtn}>
              Empezar Ahora Gratis
              <Zap size={24} fill="white" />
            </Link>
            <div className={styles.ctaTrust}>
              <span>🔒 Pago Seguro</span>
              <span>✅ Sin Contratos</span>
              <span>⚡ Acceso Inmediato</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Link helper if not imported
function Link({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
  return <a href={href} className={className}>{children}</a>;
}
