// ============================================================
// COMPONENT: StatsCounter — Animated Social Proof Numbers
// ============================================================

"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./StatsCounter.module.css";

const STATS = [
  { value: 5000,  suffix: "+",   prefix: "",  label: "Miembros Activos",          icon: "👥", color: "#FF6B00" },
  { value: 2,     suffix: "M+",  prefix: "$", label: "En Ahorros Generados",       icon: "💰", color: "#22c55e" },
  { value: 2500,  suffix: "+",   prefix: "",  label: "Productos Disponibles",      icon: "📦", color: "#3B82F6" },
  { value: 98,    suffix: "%",   prefix: "",  label: "Satisfacción de Clientes",   icon: "⭐", color: "#f59e0b" },
  { value: 210,   suffix: "+",   prefix: "",  label: "Servicios Profesionales",    icon: "💼", color: "#9333EA" },
  { value: 30,    suffix: "%",   prefix: "",  label: "Ahorro Promedio por Compra", icon: "🎯", color: "#FF6B00" },
];

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!start) return;
    if (doneRef.current) {
      setCount(target);
      return;
    }
    setCount(0);
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setCount(target);
        doneRef.current = true;
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, start]);

  return count;
}

function StatCard({
  stat,
  index,
  isVisible,
}: {
  stat: (typeof STATS)[0];
  index: number;
  isVisible: boolean;
}) {
  const count = useCountUp(stat.value, 1500, isVisible);

  return (
    <div
      className={styles.statCard}
      style={
        {
          animationDelay: `${index * 0.08}s`,
          "--accent": stat.color,
        } as React.CSSProperties
      }
    >
      <div className={styles.statGlow} />
      <div className={styles.statIcon}>{stat.icon}</div>
      <div className={styles.statNumber}>
        {stat.prefix && <span className={styles.prefix}>{stat.prefix}</span>}
        <span className={styles.value}>{count.toLocaleString("es-EC")}</span>
        <span className={styles.suffix}>{stat.suffix}</span>
      </div>
      <div className={styles.statLabel}>{stat.label}</div>
    </div>
  );
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <div className={styles.bg} />
      <div className={styles.bgLines} />

      <div className={styles.inner}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Impacto Real</span>
          <h2 className={styles.title}>
            Números que hablan{" "}
            <span className={styles.titleAccent}>por sí solos</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {STATS.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  );
}
