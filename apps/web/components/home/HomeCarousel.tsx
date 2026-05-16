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
    id: "economia-colaborativa",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    badge: "Economía Colaborativa Ecuador",
    title: "Consumo Inteligente,",
    titleAccent: "Impacto Real.",
    description:
      "Únete al marketplace más innovador de Ecuador. Transforma tus compras diarias en beneficios tangibles para ti y tu comunidad con nuestro sistema colaborativo.",
    cta: "Comenzar ahora",
    ctaSecondary: "Ver beneficios",
    link: "/auth/register",
    linkSecondary: "/membresias",
    points: ["Ahorro Colaborativo", "Respaldo Local", "Comunidad Activa"],
    stat: { value: "35%", label: "Ahorro proyectado" },
  },
  {
    id: "bienestar-integral",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80",
    badge: "Salud y Bienestar Familiar",
    title: "Tu bienestar es nuestra",
    titleAccent: "prioridad absoluta.",
    description:
      "Acceso premium a servicios de salud, odontología y bienestar integral. Protege a los que más quieres con beneficios diseñados para la familia ecuatoriana.",
    cta: "Explorar Salud",
    ctaSecondary: "Planes Familiares",
    link: "/servicios",
    linkSecondary: "/membresias",
    points: ["Red Médica Premium", "Odontología Integral", "Seguro de Bienestar"],
    stat: { value: "24/7", label: "Soporte Médico" },
  },
  {
    id: "red-emprendedores",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
    badge: "Liderazgo y Emprendimiento",
    title: "Lidera la Nueva Era",
    titleAccent: "Digital en Ecuador.",
    description:
      "Convierte tu influencia en ingresos sostenibles. Un modelo de negocio escalable con herramientas tecnológicas de última generación para tu crecimiento.",
    cta: "Unirse a la Red",
    ctaSecondary: "Modelo de Negocio",
    link: "/nosotros",
    linkSecondary: "/membresias",
    points: ["Ingresos Residuales", "Mentoría Profesional", "Escalabilidad Global"],
    stat: { value: "$500+", label: "Bono Promedio" },
  },
  {
    id: "marketplace-premium",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1600&q=80",
    badge: "Marketplace de Excelencia",
    title: "Lo Mejor de Ecuador,",
    titleAccent: "en un solo lugar.",
    description:
      "Desde productos gourmet hasta servicios profesionales especializados. Calidad garantizada con la logística más eficiente del país.",
    cta: "Ver Catálogo",
    ctaSecondary: "Servicios VIP",
    link: "/productos",
    linkSecondary: "/servicios",
    points: ["Calidad Certificada", "Logística Rápida", "Garantía de Satisfacción"],
    stat: { value: "10k+", label: "Productos Únicos" },
  },
  {
    id: "comunidad-digital",
    image: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=1600&q=80",
    badge: "Comunidad Inteligente",
    title: "Conectando Personas,",
    titleAccent: "Creando Valor.",
    description:
      "Nuestra red se basa en la confianza y el crecimiento mutuo. Únete a una comunidad vibrante de ecuatorianos que comparten la visión de prosperidad compartida.",
    cta: "Conoce la Comunidad",
    ctaSecondary: "Nuestra Visión",
    link: "/nosotros",
    linkSecondary: "/membresias",
    points: ["Networking Efectivo", "Eventos Exclusivos", "Crecimiento Mutuo"],
    stat: { value: "50k+", label: "Miembros Activos" },
  },
  {
    id: "estilo-de-vida",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",
    badge: "Recompensas y Estilo de Vida",
    title: "Disfruta de un",
    titleAccent: "Estilo de Vida Premium.",
    description:
      "Tus esfuerzos se transforman en recompensas excepcionales. Accede a viajes, experiencias VIP y beneficios exclusivos diseñados para líderes de alto impacto.",
    cta: "Ver Recompensas",
    ctaSecondary: "Plan de Carrera",
    link: "/membresias",
    linkSecondary: "/nosotros",
    points: ["Experiencias VIP", "Viajes Exclusivos", "Reconocimiento"],
    stat: { value: "VIP", label: "Acceso Total" },
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
