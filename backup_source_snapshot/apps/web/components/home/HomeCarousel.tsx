// ============================================================
// COMPONENT: Home Carousel — Ultra Premium Cinematic Hero
// PURPOSE: Fullscreen hero with real images, GSAP animations
// ============================================================

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./HomeCarousel.module.css";

const SLIDES = [
  {
    id: "consumo-inteligente",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
    badge: "Economía Colaborativa",
    title: "Compra mejor.",
    titleAccent: "Ahorra más.",
    description:
      "Una plataforma donde tu consumo genera valor para ti. No cambies lo que haces... cambia dónde lo haces.",
    cta: "Activa tu acceso",
    ctaSecondary: "Ver beneficios",
    link: "/auth/register",
    linkSecondary: "/membresias",
    points: ["Ahorro Inmediato", "Beneficio Tangible", "Consumo Inteligente"],
    stat: { value: "30%", label: "Ahorro promedio" },
  },
  {
    id: "producto-gancho",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
    badge: "Beneficio Inmediato",
    title: "Recupera tu",
    titleAccent: "inversión hoy.",
    description:
      "Accede a membresías con servicios de salud, descuentos exclusivos y beneficios reales desde el primer día.",
    cta: "Ver Beneficios",
    ctaSecondary: "Conocer planes",
    link: "/servicios",
    linkSecondary: "/membresias",
    points: ["Consultas Médicas", "Odontología y Laboratorio", "Bienestar Integral"],
    stat: { value: "5,000+", label: "Miembros activos" },
  },
  {
    id: "sistema-ingresos",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2026&auto=format&fit=crop",
    badge: "Expansión de Red",
    title: "Convierte tu red",
    titleAccent: "en ingresos.",
    description:
      "Todos consumimos constantemente. Construye tu propia red y genera ingresos de forma sostenible y colaborativa.",
    cta: "Conoce el Sistema",
    ctaSecondary: "Ver modelo",
    link: "/nosotros",
    linkSecondary: "/membresias",
    points: ["Ingresos Sostenibles", "Crecimiento Orgánico", "Respaldo Financiero"],
    stat: { value: "$2M+", label: "Ahorros generados" },
  },
  {
    id: "marketplace-global",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop",
    badge: "Marketplace Integral",
    title: "Productos y servicios",
    titleAccent: "de excelencia.",
    description:
      "Desde productos para el hogar hasta servicios profesionales. Todo integrado en un solo lugar con la mejor calidad.",
    cta: "Explorar Catálogo",
    ctaSecondary: "Ver servicios",
    link: "/productos",
    linkSecondary: "/servicios",
    points: ["Calidad Premium", "Proveedores Verificados", "Logística Inteligente"],
    stat: { value: "2,500+", label: "Productos disponibles" },
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (index: number) => {
    if (isAnimating || index === current) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 400);
  };

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      goTo((current + 1) % SLIDES.length);
    }, 7000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, current]);

  const slide = SLIDES[current];

  return (
    <section
      className={styles.hero}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`${styles.bgSlide} ${i === current ? styles.bgActive : ""}`}
          style={{ backgroundImage: `url(${s.image})` }}
        />
      ))}

      {/* Overlays */}
      <div className={styles.bgOverlay} />
      <div className={styles.bgGradient} />
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />
      <div className={styles.bgGlowRight} />

      {/* Floating Particles */}
      <div className={styles.particles}>
        {["💰", "📦", "🚀", "💳", "⭐", "🎯"].map((emoji, i) => (
          <div key={i} className={`${styles.particle} ${styles[`p${i + 1}` as keyof typeof styles]}`}>
            {emoji}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className={styles.inner}>
        {/* Left Content */}
        <div className={`${styles.content} ${isAnimating ? styles.contentOut : styles.contentIn}`}>
          {/* Badge */}
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            {slide.badge}
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            {slide.title}
            <br />
            <span className={styles.titleAccent}>{slide.titleAccent}</span>
          </h1>

          {/* Description */}
          <p className={styles.description}>{slide.description}</p>

          {/* Points */}
          <ul className={styles.points}>
            {slide.points.map((point, i) => (
              <li key={i} className={styles.point} style={{ animationDelay: `${0.1 * i}s` }}>
                <span className={styles.pointCheck}>✓</span>
                {point}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div className={styles.ctas}>
            <Link href={slide.link} className={styles.ctaPrimary}>
              {slide.cta}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href={slide.linkSecondary} className={styles.ctaSecondary}>
              {slide.ctaSecondary}
            </Link>
          </div>

          {/* Stat pill */}
          <div className={styles.statPill}>
            <span className={styles.statValue}>{slide.stat.value}</span>
            <span className={styles.statLabel}>{slide.stat.label}</span>
          </div>
        </div>

        {/* Right Visual — Floating Card */}
        <div className={`${styles.visual} ${isAnimating ? styles.visualOut : styles.visualIn}`}>
          <div className={styles.floatingCard}>
            <div className={styles.cardHeader}>
              <div className={styles.dots}>
                <span style={{ background: "#ef4444" }} />
                <span style={{ background: "#f59e0b" }} />
                <span style={{ background: "#22c55e" }} />
              </div>
              <span className={styles.cardTitle}>Mi Dashboard SaidonClub</span>
            </div>
            <div className={styles.cardBody}>
              {[
                { icon: "💰", label: "Ahorro Acumulado", value: "$1,240.50", color: "#22c55e" },
                { icon: "👥", label: "Mi Red", value: "47 miembros", color: "#FF6B00" },
                { icon: "⭐", label: "Puntos Disponibles", value: "3,850 pts", color: "#f59e0b" },
              ].map((item) => (
                <div key={item.label} className={styles.cardStat}>
                  <span className={styles.cardStatIcon}>{item.icon}</span>
                  <div>
                    <div className={styles.cardStatValue} style={{ color: item.color }}>
                      {item.value}
                    </div>
                    <div className={styles.cardStatLabel}>{item.label}</div>
                  </div>
                </div>
              ))}
              <div className={styles.progressSection}>
                <div className={styles.progressRow}>
                  <span>Nivel: <strong>Pionero</strong></span>
                  <span className={styles.progressPct}>82%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: "82%" }} />
                </div>
              </div>
              <div className={styles.activityRow}>
                <span className={styles.actText}>Regalías por Red</span>
                <span className={styles.actPos}>+$45.20</span>
              </div>
              <div className={styles.activityRow}>
                <span className={styles.actText}>Bono Semilla</span>
                <span className={styles.actPos}>+$50.00</span>
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <div className={styles.floatBadge1}>
            <span>🔥</span> Oferta del día
          </div>
          <div className={styles.floatBadge2}>
            <span>✅</span> Verificado
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={styles.controls}>
        {/* Slide indicators */}
        <div className={styles.indicators}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.indicator} ${i === current ? styles.indicatorActive : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className={styles.counter}>
          <span className={styles.counterCurrent}>{String(current + 1).padStart(2, "0")}</span>
          <span className={styles.counterSep}>/</span>
          <span className={styles.counterTotal}>{String(SLIDES.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint}>
        <div className={styles.mouse}>
          <div className={styles.wheel} />
        </div>
        <span>Descubre más</span>
      </div>
    </section>
  );
}
