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
  TrendingUp,
  X,
  DollarSign,
  Award,
} from "lucide-react";
import styles from "./Membresias.module.css";
import PaymentSelector from "../checkout/PaymentSelector";

const PLANS = [
  {
    id: "preferente",
    name: "Socio Preferente",
    icon: <Shield size={36} />,
    price: 29,
    period: "año",
    desc: "Inicia tu camino en el ecosistema con beneficios exclusivos y ahorros garantizados.",
    features: [
      "Descuentos exclusivos (-10%)",
      "Puntos por cada compra",
      "Cashback Directo (1%)",
      "Soporte prioritario 24/7",
      "Acceso a ventas privadas",
    ],
    highlight: false,
    color: "#FF6B00",
  },
  {
    id: "pionero",
    name: "Socio Pionero",
    icon: <Crown size={36} />,
    price: 97,
    period: "año",
    desc: "El nivel de élite. Diseñado para líderes que buscan maximizar sus ingresos y red.",
    features: [
      "Descuentos VIP (-20%)",
      "Cashback Premium (5%)",
      "Regalías por red (8 niveles)",
      "Concierge VIP dedicado",
      "Eventos & Networking Élite",
      "Regalos de aniversario",
    ],
    highlight: true,
    color: "#FF9D00",
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
        <div className={styles.heroShimmer} />
        <div className={styles.heroInner}>
          <span className={styles.badge}>
            <Award size={16} />
            Ecosistema de Élite SaidónClub
          </span>
          <h1 className={styles.title}>
            Tu Puerta al <span>Crecimiento</span> Exponencial
          </h1>
          <p className={styles.subtitle}>
            Únete a la comunidad de socios más exclusiva de Ecuador. 
            Disfruta de beneficios tangibles, ahorro inteligente y un sistema de recompensas diseñado para tu éxito.
          </p>
        </div>
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
              <span className={styles.period}>/{plan.period}</span>
            </div>

            <ul className={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <li key={idx} className={styles.featureItem}>
                  <Check size={20} className={styles.checkIcon} />
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
              {plan.price === 0 ? "Comenzar Gratis" : "Adquirir Membresía"}
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
              <X size={28} />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.modalIcon}>{selectedPlan.icon}</div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
                Activar Membresía {selectedPlan.name}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '32px' }}>
                Estás a un paso de desbloquear tus beneficios exclusivos por <strong>${selectedPlan.price}.00</strong>.
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
            Economía <span>Colaborativa</span> PRO
          </h2>
          <p className={styles.sectionSubtitle}>
            Transforma tu consumo cotidiano en un motor de generación de riqueza para ti y tu red.
          </p>
        </div>

        <div className={styles.pointsExplanation}>
          <div className={styles.pointsStepGrid}>
            <div className={styles.pointsStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>Consume con Propósito</h4>
                <p>
                  Usa los productos y servicios del marketplace con descuentos de socio. Cada dólar cuenta.
                </p>
              </div>
            </div>
            <div className={styles.pointsStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Expande tu Alcance</h4>
                <p>
                  Recomienda el ecosistema Saidón y genera puntos por cada compra realizada en tu red de hasta 8 niveles.
                </p>
              </div>
            </div>
            <div className={styles.pointsStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Liquidez Inmediata</h4>
                <p>
                  Tus puntos son dinero. Canjéalos por productos, servicios o transfiérelos instantáneamente a otros socios.
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
              style={{ top: "5%", left: "5%" }}
            >
              <TrendingUp size={24} color="#FF6B00" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>ESCALABILIDAD</span>
            </div>
            <div
              className={styles.orbitItem}
              style={{ top: "10%", right: "5%" }}
            >
              <Users size={24} color="#FF6B00" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>COMUNIDAD</span>
            </div>
            <div
              className={styles.orbitItem}
              style={{ bottom: "5%", left: "10%" }}
            >
              <DollarSign size={24} color="#FF6B00" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>REGALÍAS</span>
            </div>
            <div
              className={styles.orbitItem}
              style={{ bottom: "10%", right: "10%" }}
            >
              <Zap size={24} color="#FF6B00" />
              <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>INSTANTÁNEO</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
