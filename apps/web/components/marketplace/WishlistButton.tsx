// ============================================================
// COMPONENT: WishlistButton
// PURPOSE: Toggle product in/out of wishlist with heart animation
// ============================================================

"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import styles from "./WishlistButton.module.css";

interface WishlistButtonProps {
  productId: string;
  productSlug: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export default function WishlistButton({
  productId,
  productSlug,
  productName,
  productPrice,
  productImage,
  className = "",
  size = "md",
  showLabel = false,
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);
    
    toggleWishlist({
      id: productId,
      slug: productSlug,
      name: productName,
      price: productPrice,
      image: productImage,
    });

    setTimeout(() => setIsAnimating(false), 600);
  };

  const iconSize = size === "sm" ? 16 : size === "md" ? 20 : 24;

  return (
    <button
      className={`${styles.wishlistBtn} ${styles[size]} ${inWishlist ? styles.active : ""} ${isAnimating ? styles.animating : ""} ${className}`}
      onClick={handleClick}
      aria-label={inWishlist ? "Quitar de favoritos" : "Agregar a favoritos"}
      aria-pressed={inWishlist}
    >
      <Heart
        size={iconSize}
        className={styles.heartIcon}
        fill={inWishlist ? "currentColor" : "none"}
      />
      {showLabel && (
        <span className={styles.label}>
          {inWishlist ? "Guardado" : "Guardar"}
        </span>
      )}
      {isAnimating && <div className={styles.particles}>
        {[...Array(6)].map((_, i) => (
          <span key={i} className={styles.particle} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>}
    </button>
  );
}