// ============================================================
// COMPONENT: Category Bar — Premium Marquee Navigation
// ============================================================
"use client";

import Link from "next/link";
import {
  Laptop, Home, Sparkles, Trophy, PawPrint, Shirt,
  Hammer, ArrowRight, Briefcase,
  HeartPulse, Plane, GraduationCap,
} from "lucide-react";
import styles from "./CategoryBar.module.css";

const PRODUCT_CATEGORIES = [
  { label: "Tecnología", slug: "tecnologia-innovacion", count: 142, icon: <Laptop size={20} />, bg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" },
  { label: "Hogar", slug: "hogar-electrodomesticos", count: 78, icon: <Home size={20} />, bg: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=800" },
  { label: "Belleza", slug: "salud-cuidado-personal", count: 55, icon: <Sparkles size={20} />, bg: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800" },
  { label: "Moda", slug: "moda-calzado", count: 89, icon: <Shirt size={20} />, bg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" },
  { label: "Deportes", slug: "deporte-aventura", count: 43, icon: <Trophy size={20} />, bg: "https://images.unsplash.com/photo-1526508006240-5bb956c3230a?auto=format&fit=crop&q=80&w=800" },
  { label: "Joyería", slug: "relojeria-joyeria", count: 34, icon: <Sparkles size={20} />, bg: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=800" },
  { label: "Gastronomía", slug: "gastronomia-gourmet", count: 19, icon: <HeartPulse size={20} />, bg: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800" },
  { label: "Mascotas", slug: "mascotas-premium", count: 21, icon: <PawPrint size={20} />, bg: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800" },
];

const SERVICE_CATEGORIES = [
  { label: "Asesoría Financiera", slug: "servicio-asesoria-financiera", count: 52, icon: <Briefcase size={20} />, bg: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" },
  { label: "Transf. Digital", slug: "servicio-transformacion-digital", count: 41, icon: <Laptop size={20} />, bg: "https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800" },
  { label: "Arquitectura", slug: "servicio-arquitectura-diseno", count: 63, icon: <Home size={20} />, bg: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800" },
  { label: "Educación", slug: "servicio-educacion-capacitacion", count: 42, icon: <GraduationCap size={20} />, bg: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800" },
  { label: "Salud", slug: "servicio-salud-bienestar", count: 55, icon: <HeartPulse size={20} />, bg: "https://images.unsplash.com/photo-1505751172107-573225a91703?auto=format&fit=crop&q=80&w=800" },
  { label: "Asesoría Legal", slug: "servicio-asesoria-legal", count: 31, icon: <Briefcase size={20} />, bg: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800" },
  { label: "Turismo", slug: "servicio-turismo-experiencias", count: 95, icon: <Plane size={20} />, bg: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=800" },
  { label: "Mantenimiento", slug: "servicio-mantenimiento-hogar", count: 210, icon: <Hammer size={20} />, bg: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&q=80&w=800" },
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
            <div className={styles.marqueeRowReverse}>
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
