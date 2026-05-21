// ============================================================
// COMPONENT: Value Proposition — Premium Split Layout
// ============================================================

"use client";

import styles from "./ValueProposition.module.css";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Zap, Users, BarChart3, ChevronRight } from "lucide-react";

const POINTS = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Confianza y Respaldo",
    description: "Operamos con total transparencia. Tu patrimonio y datos están protegidos con cifrado de nivel bancario.",
  },
  {
    icon: <Zap size={22} />,
    title: "Resultados Inmediatos",
    description: "Sin esperas. Acreditamos tus recompensas al instante para que veas el fruto de tu lealtad cuando más lo necesitas.",
  },
  {
    icon: <Users size={22} />,
    title: "Somos una Familia",
    description: "Al unirte a SaidonClub, entras a un círculo de emprendedores que se apoyan, crecen y celebran cada logro juntos.",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Valor a tu Fidelidad",
    description: "Nuestro programa de recompensas está diseñado para valorar cada compra y cada persona que invitas a la comunidad.",
  },
];

/* 
 * IMPORTANTE: No colocar estadísticas sobre-puestas en el carrusel a petición del usuario.
 * (ej. Crecimiento Anual, Miembros Activos, Ahorros Generados)
 */

const CAROUSEL_IMAGES = [
  "/images/carousel/carousel_ecuadorian_farmer_1779202686228.png",
  "/images/carousel/carousel_ecuadorian_fisherman_1779202726336.png",
  "/images/carousel/carousel_ecuadorian_weaver_1779202775574.png",
  "/images/carousel/carousel_ecuadorian_entrepreneurs_1779202843906.png",
  "/images/carousel/carousel_ecuadorian_coffee_harvester_1779202858351.png",
  "/images/carousel/carousel_ecuadorian_biologist_1779202914686.png",
  "/images/carousel/ecuadorian_entrepreneurs_network_1778816355719.png",
  "/images/carousel/ecuadorian_collaborative_economy_1778816287497.png",
  "/images/carousel/ecuadorian_premium_marketplace_1778816449683.png",
  "/images/carousel/ecuadorian_delivery.png"
];

export default function ValueProposition() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* Visual Side */}
        <div className={styles.visualSide}>
          <div className={styles.imageCard}>
            <div className={styles.carouselWrapper}>
              <div className={styles.carouselImages}>
                {CAROUSEL_IMAGES.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt="Gente Ecuatoriana Trabajando"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={styles.carouselImage}
                    priority={i === 0}
                  />
                ))}
              </div>

              {/* Stats floating over the carousel overlay */}
              <div className={styles.carouselOverlay}>
                {/* 
                  IMPORTANTE: Se removieron los visualStats por petición del usuario.
                  NO volver a insertar datos como "Crecimiento Anual", "Miembros", etc aquí.
                */}
                
                {/* Central icon */}
                <div className={styles.centralIcon}>
                  <span>🏆</span>
                </div>
              </div>
            </div>

            {/* IMPORTANTE: Floating badge con estadísticas ha sido removido por orden del usuario y no debe regresar. */}
          </div>
        </div>

        {/* Content Side */}
        <div className={styles.contentSide}>
          <span className={styles.eyebrow}>Valor Diferencial</span>
          <h2 className={styles.title}>
            Diseñado para los que no se conforman
            <span className={styles.titleAccent}> con lo ordinario</span>
          </h2>
          <p className={styles.description}>
            En SaidonClub no solo compras o vendes; eres parte de un ecosistema de crecimiento colaborativo que premia la lealtad y la comunidad.
          </p>

          <div className={styles.grid}>
            {POINTS.map((p, i) => (
              <div key={i} className={styles.point}>
                <div className={styles.iconBox}>{p.icon}</div>
                <div className={styles.text}>
                  <h3>{p.title}</h3>
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <Link href="/auth/register" className={styles.primaryBtn}>
              Empezar mi Transformación <ChevronRight size={18} />
            </Link>
            <Link href="/nosotros" className={styles.secondaryBtn}>
              Conocer más
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
