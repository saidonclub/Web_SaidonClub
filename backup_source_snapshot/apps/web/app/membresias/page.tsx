// Note: metadata is defined in app/membresias/layout.tsx since this is a client component
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Shield,
  Crown,
  Zap,
  Users,
  ShoppingBag,
  Headset,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  X,
  DollarSign,
} from "lucide-react";
import styles from "./Membresias.module.css";
import PaymentSelector from "../checkout/PaymentSelector";

const PLANS = [
  {
    id: "preferente",
    name: "Socio Preferente",
    icon: <Shield size={32} />,
    price: 29,
    period: "año",
    desc: "El primer paso hacia beneficios exclusivos y descuentos en el ecosistema Saidón.",
    features: [
      "Descuentos exclusivos (-10%)",
      "Genera puntos por compras",
      "Cashback Básico (1%)",
      "Soporte prioritario",
      "Acceso a ventas privadas",
    ],
    highlight: false,
    color: "#10b981",
  },
  {
    id: "pionero",
    name: "Socio Pionero",
    icon: <Crown size={32} />,
    price: 97,
    period: "año",
    desc: "El nivel máximo. Para líderes que quieren generar ingresos por su red de consumo.",
    features: [
      "Descuentos VIP (-20%)",
      "Cashback Premium (5%)",
      "Regalías por red (8 niveles)",
      "Soporte VIP 24/7 dedicado",
      "Invitación a eventos exclusivos",
      "Regalos de aniversario",
    ],
    highlight: true,
    color: "#ff6b00",
  },
];

export default function MembresiasPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<(typeof PLANS)[0] | null>(
    null,
  );

  return (
    <main className={styles.wrapper}>
      <div className={styles.glow} />

      <section className={styles.header}>
        <span className={styles.badge}>Membresías SaidónClub</span>
        <h1 className={styles.title}>
          Elige tu camino al <span>crecimiento</span>
        </h1>
        <p className={styles.subtitle}>
          Únete a nuestra comunidad exclusiva y empieza a disfrutar de
          beneficios reales, descuentos masivos y un sistema de recompensas
          único en el país.
        </p>
      </section>

      <section className={styles.grid}>
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.card} ${plan.highlight ? styles.highlight : ""}`}
            style={{ "--accent-color": plan.color } as React.CSSProperties}
          >
            {plan.highlight && (
              <span className={styles.popularTag}>MÁS POPULAR</span>
            )}

            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>{plan.icon}</div>
              <h2 className={styles.planName}>{plan.name}</h2>
              <p className={styles.planDesc}>{plan.desc}</p>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.currency}>$</span>
              <span className={styles.price}>{plan.price}</span>
              <span className={styles.period}>{plan.period}</span>
            </div>

            <ul className={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <Check size={18} className={styles.checkIcon} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`${styles.button} ${plan.highlight ? styles.btnPrimary : styles.btnOutline}`}
              onClick={() =>
                plan.price > 0
                  ? setSelectedPlan(plan)
                  : router.push("/auth/register")
              }
            >
              {plan.price === 0 ? "Comenzar Gratis" : "Elegir Plan"}
            </button>
          </div>
        ))}
      </section>

      {selectedPlan && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeModal}
              onClick={() => setSelectedPlan(null)}
            >
              <X size={24} />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>{selectedPlan.icon}</div>
              <h3>Finalizar Membresía {selectedPlan.name}</h3>
              <p>
                Completa tu pago de <strong>${selectedPlan.price}.00</strong>{" "}
                para activar tus beneficios.
              </p>
            </div>
            <div className={styles.modalBody}>
              <PaymentSelector
                planId={selectedPlan.id}
                planAmount={selectedPlan.price}
              />
            </div>
          </div>
        </div>
      )}

      <section id="puntos" className={styles.pointsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Economía <span>Colaborativa</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Convierte tus compras y las de tu red en beneficios tangibles.
          </p>
        </div>

        <div className={styles.pointsExplanation}>
          <div className={styles.pointsStepGrid}>
            <div className={styles.pointsStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Consume & Recomienda</h4>
                <p>
                  Usa los productos y servicios. Invita a otros a hacer lo mismo
                  usando tu enlace de socio.
                </p>
              </div>
            </div>
            <div className={styles.pointsStep}>
              <div className={styles.stepNumber}>
                <Zap size={18} fill="currentColor" />
              </div>
              <div className={styles.stepContent}>
                <h4>Genera Puntos</h4>
                <p>
                  Cada compra en tu red (hasta 8 niveles) genera puntos Saidón
                  instantáneos.
                </p>
              </div>
            </div>
            <div className={styles.pointsStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Flexibilidad de Uso</h4>
                <p>
                  Canjea puntos por productos, servicios o transfiérelos a otros
                  socios P2P.
                </p>
              </div>
            </div>
          </div>

          <div className={styles.pointsGraphicCircle}>
            <div className={styles.circleCore}>
              <span>Valor Punto</span>
              <strong>$0.01</strong>
              <span>USD</span>
            </div>
            <div
              className={styles.orbitItem}
              style={{ top: "10%", left: "10%" }}
            >
              <TrendingUp size={24} />
              <span>Crecimiento Red</span>
            </div>
            <div
              className={styles.orbitItem}
              style={{ top: "15%", right: "5%" }}
            >
              <Users size={24} />
              <span>8 Niveles</span>
            </div>
            <div
              className={styles.orbitItem}
              style={{ bottom: "10%", left: "15%" }}
            >
              <DollarSign size={24} />
              <span>Comisiones</span>
            </div>
            <div
              className={styles.orbitItem}
              style={{ bottom: "15%", right: "10%" }}
            >
              <Zap size={24} />
              <span>Instantáneo</span>
            </div>
          </div>
        </div>

        <div className={styles.levelBenefits}>
          <div className={styles.levelCard}>
            <div className={styles.levelIcon}>&#x1F531;</div>
            <h4 className={styles.levelName}>Bronce</h4>
            <p className={styles.levelPoints}>0 - 500 puntos</p>
          </div>
          <div className={styles.levelCard}>
            <div className={styles.levelIcon}>&#x1F48E;</div>
            <h4 className={styles.levelName}>Plata</h4>
            <p className={styles.levelPoints}>501 - 2,000 puntos</p>
          </div>
          <div className={styles.levelCard}>
            <div className={styles.levelIcon}>&#x1F451;</div>
            <h4 className={styles.levelName}>Oro</h4>
            <p className={styles.levelPoints}>2,001 - 10,000 puntos</p>
          </div>
          <div className={styles.levelCard}>
            <div className={styles.levelIcon}>&#x1F31F;</div>
            <h4 className={styles.levelName}>Diamante</h4>
            <p className={styles.levelPoints}>10,001+ puntos</p>
          </div>
        </div>

        <div className={styles.pointsConversionTable}>
          <h3 className={styles.conversionTitle}>
            <DollarSign size={20} />
            Tabla de Conversión de Puntos
          </h3>
          <div className={styles.conversionGrid}>
            <div className={styles.conversionItem}>
              <span>1 Punto</span>
              <span>$0.01 USD</span>
            </div>
            <div className={styles.conversionItem}>
              <span>100 Puntos</span>
              <span>$1.00 USD</span>
            </div>
            <div className={styles.conversionItem}>
              <span>500 Puntos</span>
              <span>$5.00 USD</span>
            </div>
            <div className={styles.conversionItem}>
              <span>1,000 Puntos</span>
              <span>$10.00 USD</span>
            </div>
            <div className={styles.conversionItem}>
              <span>5,000 Puntos</span>
              <span>$50.00 USD</span>
            </div>
            <div className={styles.conversionItem}>
              <span>10,000 Puntos</span>
              <span>$100.00 USD</span>
            </div>
          </div>
        </div>

        <div className={styles.pointsVisual}>
          <div className={styles.visualTrack}>
            <div className={styles.currentProgress} style={{ width: "45%" }}>
              <div className={styles.progressGlow} />
            </div>
            <div className={styles.milestone} style={{ left: "0%" }}>
              <div className={styles.milestoneDot} />
              <span className={styles.milestoneLabel}>Bronce</span>
            </div>
            <div className={styles.milestone} style={{ left: "33%" }}>
              <div className={styles.milestoneDot} />
              <span className={styles.milestoneLabel}>Plata</span>
            </div>
            <div className={styles.milestone} style={{ left: "66%" }}>
              <div className={styles.milestoneDot} />
              <span className={styles.milestoneLabel}>Oro</span>
            </div>
            <div className={styles.milestone} style={{ left: "100%" }}>
              <div className={styles.milestoneDot} />
              <span className={styles.milestoneLabel}>Diamante</span>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Beneficios <span>Premium</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Más que una membresía, es tu llave a un mundo de privilegios.
          </p>
        </div>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCardLarge}>
            <div className={styles.premiumBadge}>Exclusivo</div>
            <div className={styles.benefitIconBox}>
              <Users size={48} strokeWidth={1.5} />
            </div>
            <div className={styles.benefitText}>
              <h3>Comunidad & Networking</h3>
              <p>
                No solo eres un cliente, eres parte de un club privado de
                emprendedores. Acceso a un ecosistema de profesionales y
                visionarios.
              </p>
              <div className={styles.benefitHighlight}>
                <span>+500 Socios</span>
                <span>Eventos VIP</span>
                <span>Saidon Talk</span>
              </div>
              <ul className={styles.benefitSubList}>
                <li>
                  <Check size={14} /> Masterclasses exclusivas con expertos
                </li>
                <li>
                  <Check size={14} /> Foros de discusión privados por sectores
                </li>
                <li>
                  <Check size={14} /> Directorio de socios para alianzas B2B
                </li>
                <li>
                  <Check size={14} /> Invitaciones a convenciones anuales
                  presenciales
                </li>
              </ul>
              <button
                className={styles.benefitAction}
                onClick={() => router.push("/membresias#agenda")}
              >
                Ver Agenda <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className={styles.benefitCardLarge}>
            <div className={styles.premiumBadge}>Potencial</div>
            <div className={styles.benefitIconBox}>
              <ShoppingBag size={48} strokeWidth={1.5} />
            </div>
            <div className={styles.benefitText}>
              <h3>Marketplace Inteligente Pro</h3>
              <p>
                Tu membresía se paga sola con el ahorro. Acceso a preventas
                exclusivas y productos curados con la mejor relación
                calidad-precio.
              </p>
              <div className={styles.benefitHighlight}>
                <span>Ahorro 30%</span>
                <span>Envíos Gratis</span>
                <span>Saidon Care</span>
              </div>
              <ul className={styles.benefitSubList}>
                <li>
                  <Check size={14} /> Envíos prioritarios en menos de 24h
                </li>
                <li>
                  <Check size={14} /> Garantía extendida en productos
                  electrónicos
                </li>
                <li>
                  <Check size={14} /> Cashback extra del 5% en marcas aliadas
                </li>
                <li>
                  <Check size={14} /> Acceso a productos de importación directa
                </li>
              </ul>
              <button
                className={styles.benefitAction}
                onClick={() => router.push("/productos")}
              >
                Ir a Tienda <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className={styles.benefitCardLarge}>
            <div className={styles.premiumBadge}>Confianza</div>
            <div className={styles.benefitIconBox}>
              <Headset size={48} strokeWidth={1.5} />
            </div>
            <div className={styles.benefitText}>
              <h3>Concierge & Soporte VIP</h3>
              <p>
                Como socio, tienes un asistente personal para tus compras y
                gestión de red. Olvídate de los bots, habla con humanos
                capacitados.
              </p>
              <div className={styles.benefitHighlight}>
                <span>Atención 24/7</span>
                <span>Asesoría Legal</span>
                <span>Gestión de Red</span>
              </div>
              <ul className={styles.benefitSubList}>
                <li>
                  <Check size={14} /> Línea directa por WhatsApp 24/7 (Socio
                  Pionero)
                </li>
                <li>
                  <Check size={14} /> Asesoría en compras masivas
                  internacionales
                </li>
                <li>
                  <Check size={14} /> Resolución de reclamos en menos de 2 horas
                </li>
                <li>
                  <Check size={14} /> Consultoría gratuita en marketing y ventas
                </li>
              </ul>
              <button
                className={styles.benefitAction}
                onClick={() => router.push("/contacto")}
              >
                Contactar <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.whySection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            ¿Por qué elegir <span>SaidonClub</span>?
          </h2>
          <p className={styles.sectionSubtitle}>
            Estamos construyendo el marketplace del futuro, centrado en el
            beneficio del socio.
          </p>
        </div>
        <div className={styles.whyGrid}>
          <div className={styles.whyItem}>
            <div className={styles.whyIcon}>
              <ShieldCheck size={32} />
            </div>
            <h4>Confianza Total</h4>
            <p>
              Respaldados por una infraestructura tecnológica robusta y segura
              para todas tus transacciones.
            </p>
          </div>
          <div className={styles.whyItem}>
            <div className={styles.whyIcon}>
              <Users size={32} />
            </div>
            <h4>Impacto Colectivo</h4>
            <p>
              Tu ahorro individual contribuye al crecimiento de una comunidad
              que busca el bienestar común.
            </p>
          </div>
          <div className={styles.whyItem}>
            <div className={styles.whyIcon}>
              <TrendingUp size={32} />
            </div>
            <h4>Visión de Futuro</h4>
            <p>
              Constantemente añadimos nuevos servicios y beneficios basados en
              el feedback de nuestros socios.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.faqTitle}>Preguntas Frecuentes</h2>
        </div>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>¿Cómo se activa mi membresía?</h3>
            <p>
              Una vez confirmado tu pago, la activación es instantánea.
              Recibirás un correo con tus credenciales y acceso al panel.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>¿Puedo cambiar de plan?</h3>
            <p>
              ¡Claro! Puedes pasar de Socio Preferente a Pionero en cualquier
              momento pagando únicamente la diferencia proporcional.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>¿Qué sucede si no renuevo?</h3>
            <p>
              Perderás el acceso a los precios exclusivos y beneficios, pero tus
              puntos acumulados se mantendrán hasta su fecha de vencimiento
              original.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>¿El marketplace es solo para Ecuador?</h3>
            <p>
              Actualmente operamos principalmente en Ecuador, pero nuestra
              visión es regional y ya contamos con envíos internacionales en
              productos seleccionados.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
