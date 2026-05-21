"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./FeaturedServices.module.css";
import ServiceCard, { Service } from "../marketplace/ServiceCard";

// ── Swiper dynamic import (avoids SSR issues) ──────────────
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";

// Core Swiper CSS (loaded globally via this import)
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type Props = {
  featured: Service[];
  popular: Service[];
  highlyRated: Service[];
};

const TABS = [
  { label: "Destacados", key: "featured" as const, emoji: "⭐" },
  { label: "Populares", key: "popular" as const, emoji: "🔥" },
  { label: "Mejor Calificados", key: "highlyRated" as const, emoji: "🏆" },
];

export default function FeaturedServices({ featured, popular, highlyRated }: Props) {
  const [activeTab, setActiveTab] = useState<"featured" | "popular" | "highlyRated">("featured");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const DATA = { featured, popular, highlyRated };
  const items = DATA[activeTab] || [];

  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <span className={styles.eyebrow}>SERVICIOS PROFESIONALES</span>
            <h2 className={styles.title}>Nuestros Servicios Estrella</h2>
            <p className={styles.subtitle}>
              Conecta con los mejores profesionales y agencias del país.
              Gana puntos y ahorra con cada contratación que realices.
            </p>
          </div>

          {/* Tab switcher */}
          <div className={styles.tabs}>
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`${styles.tab} ${activeTab === t.key ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(t.key)}
              >
                <span className={styles.tabEmoji}>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Swiper Carousel ── */}
        {mounted && items.length > 0 ? (
          <div className={styles.swiperWrapper}>
            <Swiper
              key={activeTab} // re-mount when tab changes
              modules={[Navigation, Pagination, Autoplay, A11y]}
              spaceBetween={24}
              slidesPerView={1.2}
              centeredSlides={false}
              loop={items.length >= 4}
              autoplay={{ delay: 5000, disableOnInteraction: true, pauseOnMouseEnter: true }}
              navigation={{
                nextEl: `.${styles.navNext}`,
                prevEl: `.${styles.navPrev}`,
              }}
              pagination={{
                el: `.${styles.swiperProgress}`,
                type: "progressbar",
              }}
              a11y={{ prevSlideMessage: "Servicio anterior", nextSlideMessage: "Servicio siguiente" }}
              breakpoints={{
                480:  { slidesPerView: 2,   spaceBetween: 16 },
                768:  { slidesPerView: 2.5, spaceBetween: 20 },
                1024: { slidesPerView: 3,   spaceBetween: 24 },
                1280: { slidesPerView: 4,   spaceBetween: 24 },
              }}
              className={styles.swiper}
            >
              {items.map((s, i) => (
                <SwiperSlide key={`${s.id}-${activeTab}`} className={styles.slide}>
                  <ServiceCard service={s} priority={i < 3} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className={`${styles.navBtn} ${styles.navPrev}`} aria-label="Anterior">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className={`${styles.navBtn} ${styles.navNext}`} aria-label="Siguiente">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {/* Premium Progress Bar Indicator */}
            <div className={styles.progressContainer}>
              <div className={styles.swiperProgress} />
            </div>
          </div>
        ) : (
          /* Empty state */
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>💼</span>
            <p>No hay servicios disponibles en este momento.</p>
          </div>
        )}

        {/* ── Footer CTA ── */}
        <div className={styles.footerCta}>
          <Link href="/servicios" className={styles.viewAll}>
            Ver directorio de servicios →
          </Link>
        </div>
      </div>
    </section>
  );
}
