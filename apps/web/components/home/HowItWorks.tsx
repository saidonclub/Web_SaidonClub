// ============================================================
// COMPONENT: HowItWorks — 3 Steps Animated Section
// ============================================================

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./HowItWorks.module.css";

const STEPS = [
  {
    number: "01",
    icon: "🚀",
    title: "Regístrate Gratis",
    description:
      "Crea tu cuenta en menos de 2 minutos. Sin contratos, sin compromisos. Acceso inmediato a todos los beneficios del ecosistema SaidonClub.",
    highlight: "Registro gratuito",
    color: "#FF6B00",
    features: ["Sin costo de activación", "Acceso inmediato", "Sin contratos"],
  },
  {
    number: "02",
    icon: "🛍️",
    title: "Compra con Descuentos",
    description:
      "Accede a miles de productos y servicios con precios preferenciales exclusivos para miembros. Cada compra genera puntos y cashback automático.",
    highlight: "Hasta 30% de descuento",
    color: "#22c55e",
    features: ["Precios de importador", "Puntos por compra", "Cashback automático"],
  },
  {
    number: "03",
    icon: "💰",
    title: "Gana y Crece",
    description:
      "Tus compras generan puntos convertibles en dinero real. Invita a tu red y multiplica tus beneficios con nuestro sistema de economía colaborativa.",
    highlight: "Ingresos pasivos reales",
    color: "#9333EA",
    features: ["Puntos convertibles", "Regalías por red", "Bonos mensuales"],
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visibleSteps, setVisibleSteps] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleSteps((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    const cards = sectionRef.current?.querySelectorAll("[data-index]");
    cards?.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef} id="como-funciona">
      {/* Background */}
      <div className={styles.bg} />
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <div className={styles.inner}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>Simple y Poderoso</span>
          <h2 className={styles.title}>
            ¿Cómo funciona
            <span className={styles.titleAccent}> SaidonClub?</span>
          </h2>
          <p className={styles.subtitle}>
            Tres pasos para transformar tu forma de consumir y generar beneficios reales cada día.
          </p>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          {/* Connector line */}
          <div className={styles.connector}>
            <div className={styles.connectorLine} />
          </div>

          {STEPS.map((step, i) => (
            <div
              key={i}
              data-index={i}
              className={`${styles.step} ${visibleSteps[i] ? styles.stepVisible : ""}`}
              style={{ "--step-color": step.color, "--delay": `${i * 0.15}s` } as React.CSSProperties}
            >
              {/* Step Number */}
              <div className={styles.stepNumber}>
                <span className={styles.numberText}>{step.number}</span>
                <div className={styles.numberGlow} />
              </div>

              {/* Card */}
              <div className={styles.card}>
                <div className={styles.cardGlow} />

                <div className={styles.cardTop}>
                  <div className={styles.iconWrap}>
                    <span className={styles.icon}>{step.icon}</span>
                  </div>
                  <div className={styles.highlight}>
                    <span className={styles.highlightDot} />
                    {step.highlight}
                  </div>
                </div>

                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>

                <ul className={styles.features}>
                  {step.features.map((f, fi) => (
                    <li key={fi} className={styles.feature}>
                      <span className={styles.featureCheck}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <Link href="/auth/register" className={styles.ctaBtn}>
            Empezar Ahora — Es Gratis
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
          <p className={styles.ctaNote}>
            🔒 Sin tarjeta de crédito · ✅ Sin contratos · ⚡ Acceso inmediato
          </p>
        </div>
      </div>
    </section>
  );
}
