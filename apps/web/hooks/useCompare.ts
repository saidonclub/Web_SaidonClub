// ============================================================
// HOOK: useCompare
// PURPOSE: Manage product comparison state in localStorage
// USAGE: Add products to compare, view comparison table, clear
// ============================================================

"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductPublic } from "@saidonclub/types";

const COMPARE_STORAGE_KEY = "saidon_compare_products";
const MAX_COMPARE_ITEMS = 4;

interface CompareItem extends ProductPublic {
  addedAt: number;
}

interface UseCompareReturn {
  compareItems: CompareItem[];
  addToCompare: (product: ProductPublic) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  canAddMore: boolean;
  compareCount: number;
}

export function useCompare(): UseCompareReturn {
  const [compareItems, setCompareItems] = useState<CompareItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCompareItems(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading compare items:", error);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareItems));
    } catch (error) {
      console.error("Error saving compare items:", error);
    }
  }, [compareItems]);

  const addToCompare = useCallback((product: ProductPublic): boolean => {
    if (compareItems.length >= MAX_COMPARE_ITEMS) {
      return false;
    }

    if (compareItems.some(item => item.id === product.id)) {
      return false;
    }

    const compareItem: CompareItem = {
      ...product,
      addedAt: Date.now(),
    };

    setCompareItems(prev => [...prev, compareItem]);
    return true;
  }, [compareItems]);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems(prev => prev.filter(item => item.id !== productId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
  }, []);

  const isInCompare = useCallback((productId: string): boolean => {
    return compareItems.some(item => item.id === productId);
  }, [compareItems]);

  return {
    compareItems,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAddMore: compareItems.length < MAX_COMPARE_ITEMS,
    compareCount: compareItems.length,
  };
}

// Compare attributes to show in comparison table
export const COMPARE_ATTRIBUTES = [
  { key: "name", label: "Producto", type: "text" },
  { key: "category", label: "Categoría", type: "nested", nestedKey: "name" },
  { key: "pricePVP", label: "Precio PVP", type: "currency" },
  { key: "priceSaidon", label: "Precio Club", type: "currency" },
  { key: "pointsEarned", label: "Puntos", type: "points" },
  { key: "rating", label: "Valoración", type: "rating" },
  { key: "reviewsCount", label: "Reseñas", type: "number" },
  { key: "stock", label: "Stock", type: "stock" },
  { key: "isVerified", label: "Verificado", type: "boolean" },
  { key: "brand", label: "Marca", type: "text" },
  { key: "sku", label: "SKU", type: "text" },
] as const;

export type CompareAttributeKey = typeof COMPARE_ATTRIBUTES[number]["key"];