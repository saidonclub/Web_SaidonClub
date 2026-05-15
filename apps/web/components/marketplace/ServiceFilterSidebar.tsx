// ============================================================
// COMPONENT: Service Filter Sidebar
// PURPOSE: Filter services by category, price, rating
// ============================================================

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/app/servicios/Servicios.module.css";
import { Star, Users } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
}

function ServiceFilterSidebarContent({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (mobile) setIsCollapsed(true);
      else setIsCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}
    >
      <button
        className={`${styles.collapseToggle} ${isMobile ? styles.mobileTabBtn : ""}`}
        onClick={() => setIsCollapsed(!isCollapsed)}
        title={isCollapsed ? "Expandir filtros" : "Contraer filtros"}
      >
        {isMobile && <span>OPCIONES</span>}
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          {isCollapsed ? (
            <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
          ) : (
            <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          )}
        </svg>
      </button>

      {!isCollapsed && (
        <div className={styles.sidebarContent}>

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Categorías</h3>
            <ul className={styles.filterList}>
              <li
                className={
                  currentCategory === "all"
                    ? styles.filterItemActive
                    : styles.filterItem
                }
                onClick={() => handleCategoryChange("all")}
              >
                Todos los Servicios
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={
                    currentCategory === cat.slug
                      ? styles.filterItemActive
                      : styles.filterItem
                  }
                  onClick={() => handleCategoryChange(cat.slug)}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.filterGroup} style={{ marginTop: "16px" }}>
            <h3 className={styles.filterTitle}>Beneficios Saidon</h3>
            <div className={styles.sidebarBenefit}>
              <Star size={14} className={styles.benefitIcon} />
              <span>Gana puntos en cada compra</span>
            </div>
            <div className={styles.sidebarBenefit}>
              <Users size={14} className={styles.benefitIcon} />
              <span>Soporte 24/7 institucional</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function ServiceFilterSidebar({ categories }: Props) {
  return (
    <Suspense fallback={<aside className={styles.sidebar} />}>
      <ServiceFilterSidebarContent categories={categories} />
    </Suspense>
  );
}
