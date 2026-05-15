// ============================================================
// CONTEXT: Compare Context
// PURPOSE: Global state for product comparison
// ============================================================

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { ProductPublic } from "@saidonclub/types";

const COMPARE_STORAGE_KEY = "saidon_compare_products";
const MAX_COMPARE_ITEMS = 4;

interface CompareItem extends ProductPublic {
  addedAt: number;
}

interface CompareContextType {
  compareItems: CompareItem[];
  addToCompare: (product: ProductPublic) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
  canAddMore: boolean;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
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

  const value: CompareContextType = {
    compareItems,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
    canAddMore: compareItems.length < MAX_COMPARE_ITEMS,
    compareCount: compareItems.length,
  };

  return (
    <CompareContext.Provider value={value}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompareContext() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompareContext must be used within CompareProvider");
  }
  return context;
}