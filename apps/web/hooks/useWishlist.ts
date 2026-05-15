/**
 * @module useWishlist
 * @description Hook para la gestión de la lista de deseos (Wishlist) con persistencia en localStorage.
 * Permite a los usuarios guardar productos de interés sin necesidad de autenticación inmediata.
 */

"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * @interface WishlistItem
 * @description Estructura de un elemento dentro de la lista de deseos.
 */
interface WishlistItem {
  /** ID único del producto */
  id: string;
  /** Slug para navegación SEO */
  slug: string;
  /** Nombre comercial del producto */
  name: string;
  /** Precio actual */
  price: number;
  /** URL de la imagen principal */
  image?: string;
  /** Timestamp de adición para ordenamiento */
  addedAt: number;
}

const STORAGE_KEY = "saidon-wishlist";
const MAX_WISHLIST_SIZE = 50;

/**
 * Hook reactivo para interactuar con la lista de deseos.
 * @returns {Object} API de gestión de wishlist.
 */
export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /** Carga inicial desde localStorage al montar el componente */
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (error) {
      console.error("useWishlist: Error cargando persistencia:", error);
    }
    setIsLoaded(true);
  }, []);

  /** Sincronización automática con localStorage ante cualquier cambio en la lista */
  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("useWishlist: Error guardando persistencia:", error);
    }
  }, [items, isLoaded]);

  /**
   * Añade un producto a la lista si no existe y respeta el límite máximo.
   * @param {Omit<WishlistItem, "addedAt">} item - Datos del producto.
   */
  const addToWishlist = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    setItems((prev) => {
      if (prev.some((i) => i.id === item.id)) {
        return prev;
      }
      
      const newItems = [
        { ...item, addedAt: Date.now() },
        ...prev,
      ].slice(0, MAX_WISHLIST_SIZE);
      
      return newItems;
    });
  }, []);

  /**
   * Elimina un producto de la lista por su ID.
   * @param {string} productId - ID del producto a remover.
   */
  const removeFromWishlist = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  /**
   * Alterna el estado de un producto en la lista (Add/Remove).
   * @param {Omit<WishlistItem, "addedAt">} item - Datos del producto.
   */
  const toggleWishlist = useCallback((item: Omit<WishlistItem, "addedAt">) => {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      
      const newItems = [
        { ...item, addedAt: Date.now() },
        ...prev,
      ].slice(0, MAX_WISHLIST_SIZE);
      
      return newItems;
    });
  }, []);

  /**
   * Comprueba si un producto ya está en la lista.
   * @param {string} productId
   * @returns {boolean}
   */
  const isInWishlist = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  /** Vacía completamente la lista de deseos */
  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  /** Cantidad total de elementos en la lista */
  const wishlistCount = items.length;

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    wishlistCount,
    isLoaded,
  };
}

/** Instancia única para estado global fuera de componentes de React (opcional) */
export function getGlobalWishlist() {
  if (typeof window === "undefined") {
    return {
      items: [] as WishlistItem[],
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      toggleWishlist: () => {},
      isInWishlist: (_id: string) => false,
      clearWishlist: () => {},
      wishlistCount: 0,
      isLoaded: false,
    };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const items: WishlistItem[] = stored ? JSON.parse(stored) : [];
    return {
      items,
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      toggleWishlist: () => {},
      isInWishlist: (id: string) => items.some(i => i.id === id),
      clearWishlist: () => {},
      wishlistCount: items.length,
      isLoaded: true,
    };
  } catch {
    return {
      items: [] as WishlistItem[],
      addToWishlist: () => {},
      removeFromWishlist: () => {},
      toggleWishlist: () => {},
      isInWishlist: (_id: string) => false,
      clearWishlist: () => {},
      wishlistCount: 0,
      isLoaded: false,
    };
  }
}