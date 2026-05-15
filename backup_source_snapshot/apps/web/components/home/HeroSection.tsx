// ============================================================
// COMPONENT: Hero Section
// PURPOSE: Main landing hero with GSAP stagger animations
// ============================================================

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import styles from "./HeroSection.module.css";

const SLIDES = [
  {
    badge: "🚀 ECONOMÍA COLABORATIVA",
    title: "Tu Consumo Ahora\nGenera Beneficios",
    subtitle:
      'Ya estas gastando dinero todos los dias. Y si ese gasto empezara a devolverte beneficios? Unete a la comunidad que transforma el gasto en resultados reales.',
    cta1: { label: "Únete Ahora", href: "/auth/register" },
    cta2: { label: "Ver Modelo de Negocio", href: "/mlm/plan" },
    accent: "#FFFFFF",
    visualType: "dashboard",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2026&auto=format&fit=crop",
    stat1: { value: "Cashback", label: "En cada compra" },
    stat2: { value: "Red", label: "Beneficio mutuo" },
    stat3: { value: "100%", label: "Sostenible" },
  },
  {
    badge: "🛍️ MARKETPLACE EXCLUSIVO",
    title: "Compra Inteligente\nAhorro Inmediato",
    subtitle:
      'Accede a productos de primera calidad con precios preferenciales. En SaidonClub, comprar mejor es la forma mas rapida de ahorrar y ganar.',
    cta1: { label: "Explorar Tienda", href: "/productos" },
    cta2: { label: "Membresía Pionero", href: "/membresias" },
    accent: "#FFFFFF",
    visualType: "marketplace",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop",
    stat1: { value: "Premium", label: "Marcas Top" },
    stat2: { value: "Ahorro", label: "Garantizado" },
    stat3: { value: "Directo", label: "Sin intermediarios" },
  },
  {
    badge: "💼 SERVICIOS PROFESIONALES",
    title: "Expertos Verificados\nTalento con Propósito",
    subtitle:
      'Conecta con los mejores profesionales de Ecuador. Calidad garantizada, precios justos y una red de confianza que respalda cada servicio.',
    cta1: { label: "Contratar Expertos", href: "/servicios" },
    cta2: { label: "Ser Proveedor", href: "/proveedores" },
    accent: "#FFFFFF",
    visualType: "services",
    image:
      "https://images.unsplash.com/photo-1573164574048-f968d7ee9f20?q=80&w=2070&auto=format&fit=crop",
    stat1: { value: "Verificados", label: "Garantía Saidon" },
    stat2: { value: "5%", label: "Comisión fija" },
    stat3: { value: "Elite", label: "Nivel Profesional" },
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  // Initial GSAP entrance animation (runs once on mount)
  useEffect(() => {
    if (hasAnimated.current || !contentRef.current) return;
    hasAnimated.current = true;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Fade-in background with deep zoom
      tl.fromTo(
        `.${styles.bgLuxury}`,
        { opacity: 0, scale: 1.15 },
        { opacity: 0.18, scale: 1, duration: 2.5 }
      );

      tl.fromTo(
        `.${styles.bgImage}`,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1.8 },
        "-=2.0"
      );

      // Stagger content elements with a more premium delay
      tl.fromTo(
        `.${styles.badge}`,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1 },
        "-=1.4"
      );

      tl.fromTo(
        `.${styles.title}`,
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2 },
        "-=0.9"
      );

      tl.fromTo(
        `.${styles.subtitle}`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.8"
      );

      tl.fromTo(
        `.${styles.ctas}`,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.7"
      );

      // Stats stagger
      tl.fromTo(
        `.${styles.statCard}`,
        { opacity: 0, y: 25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.15 },
        "-=0.5"
      );

      // Right visual entry
      tl.fromTo(
        `.${styles.visual}`,
        { opacity: 0, x: 100, rotateY: 30 },
        { opacity: 1, x: 0, rotateY: -15, duration: 1.5, ease: "power4.out" },
        "-=1.8"
      );

      // Floating badges
      tl.fromTo(
        [`.${styles.float1}`, `.${styles.float2}`],
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2 },
        "-=0.6"
      );
    });

    return () => ctx.revert();
  }, []);

  // Slide auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % SLIDES.length);
        setAnimating(false);
      }, 300);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  const goTo = (i: number) => {
    setAnimating(true);
    setTimeout(() => {
      setCurrent(i);
      setAnimating(false);
    }, 300);
  };

  return (
    <section className={styles.hero}>
      {/* Premium Hero Background (local generated asset) */}
      <div className={styles.bgLuxury} />

      {/* Per-slide photo overlay */}
      <div
        className={styles.bgImage}
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      <div className={styles.bgOverlay} />
      <div className={styles.bgGrid} />
      <div className={styles.bgGlow} />

      <div className={styles.inner} ref={contentRef}>
        {/* Left — Content */}
        <div
          className={`${styles.content} ${animating ? styles.fadeOut : styles.fadeIn}`}
        >
          <div className={styles.badge}>{slide.badge}</div>

          <h1 className={styles.title}>
            {slide.title.split("\n").map((line, i) => (
              <span key={i} className={i === 1 ? styles.titleAccent : ""}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
          </h1>

          <p className={styles.subtitle}>{slide.subtitle}</p>

          <div className={styles.ctas}>
            <Link href={slide.cta1.href} className={styles.ctaPrimary}>
              {slide.cta1.label}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href={slide.cta2.href} className={styles.ctaSecondary}>
              {slide.cta2.label}
            </Link>
          </div>

          {/* Mini Stats */}
          <div className={styles.stats}>
            {[slide.stat1, slide.stat2, slide.stat3].map((s, i) => (
              <div key={i} className={styles.statCard}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Visual */}
        <div
          className={`${styles.visual} ${animating ? styles.fadeOut : styles.fadeIn}`}
        >
          {/* Floating Particles */}
          <div className={styles.particles}>
            <div className={`${styles.particle} ${styles.p1}`}>💰</div>
            <div className={`${styles.particle} ${styles.p2}`}>📦</div>
            <div className={`${styles.particle} ${styles.p3}`}>🚀</div>
            <div className={`${styles.particle} ${styles.p4}`}>💳</div>
          </div>

          {slide.visualType === "dashboard" && (
            <div className={styles.dashboardCard}>
              <div className={styles.dashHeader}>
                <div className={styles.dashDot} style={{ background: "#ef4444" }} />
                <div className={styles.dashDot} style={{ background: "#f59e0b" }} />
                <div className={styles.dashDot} style={{ background: "#22c55e" }} />
                <span className={styles.dashTitle}>Mi Dashboard SaidonClub</span>
              </div>
              <div className={styles.dashBody}>
                <div className={styles.dashStats}>
                  {[
                    { icon: "💰", label: "Ahorro Acumulado", value: "$1,240.50", color: "#22c55e" },
                    { icon: "👥", label: "Mi Red", value: "47 miembros", color: "#FF6B00" },
                    { icon: "⭐", label: "Puntos Disponibles", value: "3,850 pts", color: "#f59e0b" },
                  ].map((s) => (
                    <div key={s.label} className={styles.dashStatItem}>
                      <span className={styles.dashStatIcon}>{s.icon}</span>
                      <div>
                        <div className={styles.dashStatVal} style={{ color: s.color }}>
                          {s.value}
                        </div>
                        <div className={styles.dashStatLbl}>{s.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.rankProgress}>
                  <div className={styles.rankRow}>
                    <span className={styles.rankLabel}>
                      Nivel: <strong>Pionero</strong>
                    </span>
                    <span className={styles.rankPct}>82%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: "82%" }} />
                  </div>
                </div>
                <div className={styles.activity}>
                  {[
                    { text: "Regalías por Red", amount: "+$45.20", positive: true },
                    { text: "Bono Semilla", amount: "+$50.00", positive: true },
                  ].map((a, i) => (
                    <div key={i} className={styles.actItem}>
                      <span className={styles.actText}>{a.text}</span>
                      <span className={`${styles.actAmount} ${a.positive ? styles.pos : styles.neg}`}>
                        {a.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {slide.visualType === "marketplace" && (
            <div className={styles.marketplacePreview}>
              <div className={styles.productGrid}>
                {[
                  { img: "💻", name: "Laptop Pro", price: "$899", old: "$1200", off: "25%" },
                  { img: "🎧", name: "Audio Elite", price: "$149", old: "$199", off: "25%" },
                  { img: "👟", name: "Sport Max", price: "$75", old: "$110", off: "32%" },
                  { img: "⌚", name: "Smart Watch", price: "$120", old: "$180", off: "33%" },
                ].map((p, i) => (
                  <div key={i} className={styles.miniProduct}>
                    <div className={styles.pImg}>{p.img}</div>
                    <div className={styles.pInfo}>
                      <div className={styles.pOff}>-{p.off}</div>
                      <div className={styles.pName}>{p.name}</div>
                      <div className={styles.pPrices}>
                        <span className={styles.pCurr}>{p.price}</span>
                        <span className={styles.pOld}>{p.old}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.marketOverlay}>
                <span>🛍️ +2,500 Productos con descuento directo</span>
              </div>
            </div>
          )}

          {slide.visualType === "services" && (
            <div className={styles.servicesPreview}>
              <div className={styles.serviceHeader}>
                <h3>Expertos Verificados</h3>
                <div className={styles.trustBadge}>✅ Garantía Saidon</div>
              </div>
              <div className={styles.proList}>
                {[
                  { name: "Dr. Roberto Ortiz", job: "Odontología Especializada", rating: "5.0", reviews: 124 },
                  { name: "Ing. Carla Méndez", job: "Consultoría Financiera", rating: "4.9", reviews: 86 },
                  { name: "Dra. Sofía Luna", job: "Medicina General", rating: "5.0", reviews: 210 },
                ].map((pro, i) => (
                  <div key={i} className={styles.proItem}>
                    <div className={styles.proAvatar}>{pro.name[0]}</div>
                    <div className={styles.proDetails}>
                      <div className={styles.proName}>{pro.name}</div>
                      <div className={styles.proJob}>{pro.job}</div>
                      <div className={styles.proRating}>
                        ⭐ {pro.rating} ({pro.reviews})
                      </div>
                    </div>
                    <div className={styles.proBtn}>Ver Perfil</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Floating badges */}
          <div className={`${styles.floatBadge} ${styles.float1}`}>
            <span>🔥</span>{" "}
            {slide.visualType === "services" ? "Expertos 100% verif." : "47 ventas hoy"}
          </div>
          <div className={`${styles.floatBadge} ${styles.float2}`}>
            <span>✅</span>{" "}
            {slide.visualType === "services" ? "Atención Prioritaria" : "Pago verificado"}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className={styles.indicators}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Diapositiva ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
