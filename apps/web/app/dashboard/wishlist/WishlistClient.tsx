// ============================================================
// COMPONENT: WishlistClient
// PURPOSE: Client-side wishlist management with add to cart
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2, Eye, Package } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/context/CartContext";
import styles from "./Wishlist.module.css";

interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image?: string;
  addedAt: number;
}

export default function WishlistClient() {
  const { items, removeFromWishlist, clearWishlist, isLoaded } = useWishlist();
  const { addToCart } = useCart();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleRemove = async (item: WishlistItem) => {
    setRemovingId(item.id);
    // Small delay for animation
    await new Promise((resolve) => setTimeout(resolve, 300));
    removeFromWishlist(item.id);
    setRemovingId(null);
  };

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
    });
    // Remove from wishlist after adding to cart
    removeFromWishlist(item.id);
  };

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <Heart size={24} color="var(--clr-orange)" />
          <h1>Mis Favoritos</h1>
        </div>
        <p className={styles.subtitle}>
          Productos guardados para más tarde. ¡Tu lista tiene {items.length} artículos!
        </p>
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Heart size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{items.length}</span>
            <span className={styles.statLabel}>Productos guardados</span>
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}>
            <ShoppingCart size={20} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>${totalValue.toFixed(2)}</span>
            <span className={styles.statLabel}>Valor total</span>
          </div>
        </div>
      </div>

      {items.length > 0 ? (
        <>
          {/* Clear All Button */}
          <div className={styles.clearAllContainer}>
            <button
              className={styles.clearAllBtn}
              onClick={() => {
                if (window.confirm("¿Eliminar todos los favoritos?")) {
                  clearWishlist();
                }
              }}
            >
              <Trash2 size={14} />
              Vaciar lista
            </button>
          </div>

          {/* Wishlist Grid */}
          <div className={styles.wishlistGrid}>
            {items.map((item) => (
              <div
                key={item.id}
                className={styles.wishlistItem}
                style={{
                  opacity: removingId === item.id ? 0 : 1,
                  transform: removingId === item.id ? "scale(0.9)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              >
                <div className={styles.itemImage}>
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: "contain", padding: "16px" }}
                    />
                  ) : (
                    <div className={styles.itemPlaceholder}>
                      <Package size={48} />
                      <span>Sin imagen</span>
                    </div>
                  )}
                </div>
                <div className={styles.itemContent}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <div className={styles.itemPrice}>${item.price.toFixed(2)}</div>
                  <div className={styles.itemActions}>
                    <Link
                      href={`/productos/${item.slug}`}
                      className={`${styles.actionBtn} ${styles.viewBtn}`}
                    >
                      <Eye size={16} />
                      Ver
                    </Link>
                    <button
                      className={`${styles.actionBtn} ${styles.cartBtn}`}
                      onClick={() => handleAddToCart(item)}
                    >
                      <ShoppingCart size={16} />
                      Al Carrito
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.removeBtn}`}
                      onClick={() => handleRemove(item)}
                      aria-label="Eliminar de favoritos"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <Heart size={64} className={styles.emptyIcon} />
          <h3>Tu lista de favoritos está vacía</h3>
          <p>¡Explora el marketplace y guarda tus productos favoritos!</p>
          <Link href="/productos" className={styles.browseBtn}>
            <ShoppingCart size={18} />
            Explorar Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}