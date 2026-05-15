// ============================================================
// COMPONENT: Product Filter Sidebar
// PURPOSE: Filter products by category, price, rating
// ============================================================

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import styles from "@/app/productos/Productos.module.css";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  categories: Category[];
}

function ProductFilterSidebarContent({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const currentCategory = searchParams.get("category") || "all";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMinPriceInput(minPrice);
    setMaxPriceInput(maxPrice);
  }, [minPrice, maxPrice]);

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

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPriceInput) params.set("minPrice", minPriceInput);
    else params.delete("minPrice");

    if (maxPriceInput) params.set("maxPrice", maxPriceInput);
    else params.delete("maxPrice");

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
                Todos los Productos
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

          <div className={styles.filterGroup}>
            <h3 className={styles.filterTitle}>Rango de Precio</h3>
            <div className={styles.priceRange}>
              <input
                type="number"
                placeholder="Min"
                className={styles.priceInput}
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                onBlur={handlePriceApply}
              />
              <input
                type="number"
                placeholder="Max"
                className={styles.priceInput}
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                onBlur={handlePriceApply}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

export default function ProductFilterSidebar({ categories }: Props) {
  return (
    <Suspense fallback={<aside className={styles.sidebar} />}>
      <ProductFilterSidebarContent categories={categories} />
    </Suspense>
  );
}
