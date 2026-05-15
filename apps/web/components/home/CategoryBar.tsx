// ============================================================
// COMPONENT: Category Bar — Premium Marquee Navigation
// ============================================================
"use client";

import Link from "next/link";
import {
  Laptop, Home, Sparkles, Car, Trophy, Gamepad2, PawPrint, Shirt,
  Footprints, ToyBrick, Hammer, Smartphone, ArrowRight, Briefcase,
  HeartPulse, Plane, GraduationCap,
} from "lucide-react";
import styles from "./CategoryBar.module.css";

const PRODUCT_CATEGORIES = [
  { label: "Electrónica", slug: "electronica", count: 142, icon: <Laptop size={20} />, bg: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800" },
  { label: "Hogar", slug: "hogar", count: 78, icon: <Home size={20} />, bg: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800" },
  { label: "Belleza", slug: "belleza", count: 55, icon: <Sparkles size={20} />, bg: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800" },
  { label: "Automotriz", slug: "automotriz", count: 21, icon: <Car size={20} />, bg: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=800" },
  { label: "Deportes", slug: "deportes", count: 43, icon: <Trophy size={20} />, bg: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800" },
  { label: "Gaming", slug: "gaming", count: 34, icon: <Gamepad2 size={20} />, bg: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800" },
  { label: "Mascotas", slug: "mascotas", count: 19, icon: <PawPrint size={20} />, bg: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800" },
  { label: "Moda", slug: "moda", count: 89, icon: <Shirt size={20} />, bg: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=800" },
];

const SERVICE_CATEGORIES = [
  { label: "Calzado", slug: "calzado", count: 52, icon: <Footprints size={20} />, bg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800" },
  { label: "Juguetes", slug: "juguetes", count: 41, icon: <ToyBrick size={20} />, bg: "https://images.unsplash.com/photo-1532330393533-443990a51d10?auto=format&fit=crop&q=80&w=800" },
  { label: "Herramientas", slug: "herramientas", count: 63, icon: <Hammer size={20} />, bg: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800" },
  { label: "Móviles", slug: "moviles", count: 95, icon: <Smartphone size={20} />, bg: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800" },
  { label: "Servicios Pro", slug: "profesionales", count: 210, icon: <Briefcase size={20} />, bg: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" },
  { label: "Salud", slug: "salud", count: 55, icon: <HeartPulse size={20} />, bg: "https://images.unsplash.com/photo-1505751172107-573225a91703?auto=format&fit=crop&q=80&w=800" },
  { label: "Viajes", slug: "viajes", count: 31, icon: <Plane size={20} />, bg: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800" },
  { label: "Educación", slug: "educacion", count: 42, icon: <GraduationCap size={20} />, bg: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800" },
];

export default function CategoryBar() {
  const extendedProducts = [...PRODUCT_CATEGORIES, ...PRODUCT_CATEGORIES, ...PRODUCT_CATEGORIES];
  const extendedServices = [...SERVICE_CATEGORIES, ...SERVICE_CATEGORIES, ...SERVICE_CATEGORIES];

  return (
    <section className={styles.section} id="ecosistema">
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrow}>Ecosistema SaidonClub</span>
          <h2 className={styles.sectionTitle}>
            Explora nuestro universo de productos y servicios
          </h2>
        </div>

        {/* ROW 1: PRODUCTS */}
        <div className={styles.groupWrapper}>
          <div className={`${styles.groupLabel} ${styles.productLabel}`}>
            <div className={styles.groupLabelLine} />
            <span className={styles.groupLabelText}>Productos con descuentos exclusivos</span>
            <div className={styles.groupLabelLine} />
          </div>

          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeRow}>
              {extendedProducts.map((cat, i) => (
                <Link
                  href={`/productos?category=${cat.slug}`}
                  key={`prod-${cat.slug}-${i}`}
                  className={`${styles.card} ${styles.productCard}`}
                  data-tooltip={`${cat.label} — ${cat.count} productos`}
                >
                  <div className={styles.watermark} style={{ backgroundImage: `url(${cat.bg})` }} />
                  <div className={styles.content}>
                    <div className={styles.iconWrap}>{cat.icon}</div>
                    <span className={styles.label}>{cat.label}</span>
                    <span className={styles.count}>{cat.count} items</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: SERVICES */}
        <div className={styles.groupWrapper}>
          <div className={`${styles.groupLabel} ${styles.serviceLabel}`}>
            <div className={styles.groupLabelLine} />
            <span className={styles.groupLabelText}>Servicios profesionales verificados</span>
            <div className={styles.groupLabelLine} />
          </div>

          <div className={styles.marqueeContainer}>
            <div className={styles.marqueeRow}>
              {extendedServices.map((cat, i) => (
                <Link
                  key={`serv-${cat.slug}-${i}`}
                  href={`/servicios?category=${cat.slug}`}
                  className={`${styles.card} ${styles.serviceCard}`}
                  data-tooltip={`${cat.label} — ${cat.count} servicios`}
                >
                  <div className={styles.watermark} style={{ backgroundImage: `url(${cat.bg})` }} />
                  <div className={styles.content}>
                    <div className={styles.iconWrap}>{cat.icon}</div>
                    <span className={styles.label}>{cat.label}</span>
                    <span className={styles.count}>{cat.count} items</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Back to top */}
        <div className={styles.footerActions}>
          <a href="#" className={styles.backToTop} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <ArrowRight size={12} style={{ transform: "rotate(-90deg)" }} />
            <span>Volver arriba</span>
          </a>
        </div>
      </div>
    </section>
  );
}
