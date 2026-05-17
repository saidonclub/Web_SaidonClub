"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Search, Plus, Loader2 } from "lucide-react";
import { useCompareContext } from "@/contexts/CompareContext";
import { searchProductsForCompare } from "@/app/productos/comparar/actions";
import { ProductPublic } from "@saidonclub/types";
import { useToast } from "@/components/shared/Toast";
import styles from "./CompareSelector.module.css";

export default function CompareSelector() {
  const { addToCompare, isInCompare, canAddMore, compareCount } = useCompareContext();
  const { warning } = useToast();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductPublic[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        const data = await searchProductsForCompare(query);
        setResults(data);
        setIsSearching(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleAdd = (product: ProductPublic) => {
    if (!canAddMore) {
      warning("Límite de Comparación", "No puedes agregar más productos para comparar (Máximo 4).");
      return;
    }
    const added = addToCompare(product);
    if (added) {
      setQuery("");
      setIsOpen(false);
    }
  };

  if (!canAddMore) {
    return (
      <div className={styles.fullMessage}>
        Límite alcanzado ({compareCount}/4)
      </div>
    );
  }

  return (
    <div className={styles.selectorContainer} ref={dropdownRef}>
      <div className={styles.inputWrapper}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Buscar un producto para comparar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.input}
          onFocus={() => { if (query.length >= 2) setIsOpen(true) }}
        />
        {isSearching && <Loader2 size={18} className={styles.loaderIcon} />}
      </div>

      {isOpen && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((product) => {
            const added = isInCompare(product.id);
            return (
              <div key={product.id} className={styles.resultItem}>
                <div className={styles.resultInfo}>
                  <div className={styles.resultImageWrapper}>
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      <span className={styles.noImage}>📦</span>
                    )}
                  </div>
                  <div className={styles.resultDetails}>
                    <span className={styles.resultName}>{product.name}</span>
                    <span className={styles.resultPrice}>${product.priceSaidon?.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAdd(product)}
                  disabled={added}
                  className={`${styles.addBtn} ${added ? styles.added : ""}`}
                >
                  {added ? "Añadido" : <><Plus size={14} /> Añadir</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      {isOpen && query.length >= 2 && results.length === 0 && !isSearching && (
        <div className={styles.dropdown}>
          <div className={styles.noResults}>No se encontraron productos con {'\u201C'}{query}{'\u201D'}</div>
        </div>
      )}
    </div>
  );
}
