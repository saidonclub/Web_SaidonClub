// ============================================================
// COMPONENT: Product Card
// PURPOSE: Display product in marketplace with image, price, and add to cart
// ============================================================

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Eye, ShieldCheck, Zap, Tag, Info } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
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
    <motion.div 
      className={`${styles.productCard} product-card`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
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
          <span>{Number(product.rating || 4.9).toFixed(1)}</span>
          {product.reviewsCount ? <span className={styles.reviewCount}>({product.reviewsCount})</span> : null}
        </div>

        {/* Variantes compactas directamente en catálogo */}
        {product.options && (
          <div className={styles.compactVariants}>
            {(() => {
              try {
                const parsed = typeof product.options === "string" ? JSON.parse(product.options) : product.options;
                if (Array.isArray(parsed) && parsed.length > 0) {
                  const opts = parsed as { name: string; values: string[] }[];
                  return opts.slice(0, 2).map((opt) => {
                    if (!opt.name || !opt.values || opt.values.length === 0) return null;
                    return (
                      <div key={opt.name} className={styles.variantLine}>
                        <span className={styles.variantLabel}>{opt.name}:</span>
                        <div className={styles.variantValues}>
                          {opt.values.slice(0, 3).map((val: string) => (
                            <span key={val} className={styles.variantValBadge} title={val}>{val}</span>
                          ))}
                          {opt.values.length > 3 && <span className={styles.variantValMore}>+{opt.values.length - 3}</span>}
                        </div>
                      </div>
                    );
                  });
                }
              } catch (e) {
                return null;
              }
              return null;
            })()}
          </div>
        )}

        <div className={styles.priceBlock}>
          {/* Precio Público (PVP) */}
          <div className={styles.priceRowPvp}>
            <span className={styles.pvpLabel}>
              <Tag size={9} /> P.V.P.
            </span>
            <span className={styles.pricePvp}>${pvp.toFixed(2)}</span>
          </div>

          {/* Precio SaidonClub */}
          <div className={styles.priceRowSaidon}>
            <span className={styles.saidonLabel}>💎 Precio Club</span>
            <span className={styles.priceSaidon}>${saidon.toFixed(2)}</span>
            {discount > 0 && (
              <span className={styles.discountPill}>-{discount}%</span>
            )}
          </div>

          {/* Puntos y IVA */}
          <div className={styles.priceFooter}>
            {Number(product.pointsEarned || 0) > 0 && (
              <span className={styles.pointsInfo}>
                <Zap size={10} />
                +{Number(product.pointsEarned)} pts de beneficio
              </span>
            )}
            <span className={styles.ivaInfo}>
              <Info size={9} />
              IVA incl.
            </span>
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
            productName={product.name}
            price={saidon}
            options={product.options}
            className={styles.addBtnWrapper}
          />
        </div>
      </div>
    </motion.div>
  );
}
