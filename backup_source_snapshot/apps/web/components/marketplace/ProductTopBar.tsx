// ============================================================
// COMPONENT: Product Top Bar
// PURPOSE: Search and sorting controls for products page
// ============================================================

"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import styles from "@/app/productos/Productos.module.css";

function ProductTopBarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "relevance";

  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("q", searchInput);
    else params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.topBar}>
      <form onSubmit={handleSearch} className={styles.searchBox}>
        <Search size={18} />
        <input
          type="text"
          placeholder="Buscar productos..."
          className={styles.searchInput}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className={styles.searchSubmitBtn} aria-label="Buscar">
          Buscar
        </button>
      </form>
      <div className={styles.sortBox}>
        <SlidersHorizontal size={16} />
        <span>Ordenar por:</span>
        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="relevance">Relevancia</option>
          <option value="price_asc">Precio: Menor a Mayor</option>
          <option value="price_desc">Precio: Mayor a Menor</option>
          <option value="newest">Más Recientes</option>
        </select>
      </div>
    </div>
  );
}

export default function ProductTopBar() {
  return (
    <Suspense fallback={<div className={styles.topBar} />}>
      <ProductTopBarContent />
    </Suspense>
  );
}
