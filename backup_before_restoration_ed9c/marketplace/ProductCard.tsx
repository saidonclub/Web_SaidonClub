// ============================================================
// COMPONENT: Product Card
// PURPOSE: Display product in marketplace with image, price, and add to cart
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Eye, ShieldCheck } from "lucide-react";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import styles from "./ProductCard.module.css";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ProductPublic } from "@saidonclub/types";
import { getProductTheme, calculateDiscount } from "@/lib/data/marketplace";

interface ProductCardProps {
  product: ProductPublic;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { trackProductView } = useAnalytics();
  const pvp = Number(product.pricePVP || 0);
  const saidon = Number(product.priceSaidon || 0);
  const discount = calculateDiscount(pvp, saidon);

  const theme = getProductTheme(product.category?.slug);
  const [imageError, setImageError] = useState(false);

  // Safe image check
  const firstImage = product.images?.[0];
  const showImage = !!firstImage && !imageError;

  const handleProductClick = () => {
    trackProductView(product.id, product.name, saidon, product.category?.name || 'unknown');
  };

  return (
    <div className={styles.productCard}>
      <Link 
        href={`/productos/${product.slug}`} 
        className={styles.productLink}
        onClick={handleProductClick}
      >
        <div className={styles.imageWrapper}>
          {showImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "contain", padding: "10px" }}
              priority={priority}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className={styles.placeholderWrapper}>
              <div className={styles.placeholderIcon}>
                {theme.icon}
              </div>
              <div className={styles.placeholderCategory}>
                {product.category?.name}
              </div>
              <div className={styles.placeholderGlow} />
            </div>
          )}
          {discount > 0 && <div className={styles.badge}>-{discount}%</div>}
          {Number(product.pointsEarned || 0) > 0 && (
            <div className={styles.pointsBadge}>
              +{Number(product.pointsEarned)} pts
            </div>
          )}
          {product.isVerified && (
            <div className={styles.verifiedBadge}>
              <ShieldCheck size={12} />
              Verificado
            </div>
          )}
        </div>
      </Link>
      <div className={styles.productInfo}>
        <span className={styles.categoryName}>{product.category?.name}</span>
        <Link href={`/productos/${product.slug}`}>
          <h3 className={styles.productName}>{product.name}</h3>
        </Link>
        <div className={styles.rating}>
          <Star size={12} fill="currentColor" />
          <span>{product.rating?.toFixed(1) || "4.9"}</span>
          {product.reviewsCount && <span className={styles.reviewCount}>({product.reviewsCount})</span>}
        </div>
        <div className={styles.priceRow}>
          <div>
            <span className={styles.pricePvp}>${pvp.toFixed(2)}</span>
            <span className={styles.priceSaidon}>${saidon.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Link
            href={`/productos/${product.slug}`}
            className={styles.detailsBtn}
          >
            <Eye size={14} />
            Ver Detalles
          </Link>

          <AddToCartButton
            productId={product.id}
            variant="compact"
            productSlug={product.slug}
            options={product.options}
            className={styles.addBtnWrapper}
          />
        </div>
      </div>
    </div>
  );
}
