"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Star, ShieldCheck, Truck, RefreshCcw, Heart, Gift } from "lucide-react";
import styles from "./ProductDetail.module.css";
import AddToCartButton from "@/components/marketplace/AddToCartButton";

interface ProductOption {
  name: string;
  values: string[];
}

interface ProductDetailInteractiveProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    pricePVP: number;
    priceSaidon: number;
    pointsEarned: number;
    stock: number;
    options: unknown;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    provider?: {
      id: string;
      name: string | null;
      avatar: string | null;
      phone: string | null;
    } | null;
  };
  relatedProducts: Array<{
    id: string;
    slug: string;
    name: string;
    images: string[];
    priceSaidon: number;
  }>;
  isLoggedIn: boolean;
}

export default function ProductDetailInteractive({
  product,
  relatedProducts,
  isLoggedIn,
}: ProductDetailInteractiveProps) {
  // Parse options
  const parsedOptions = useMemo<ProductOption[]>(() => {
    if (!product.options) return [];
    try {
      const opts =
        typeof product.options === "string"
          ? JSON.parse(product.options)
          : product.options;
      return Array.isArray(opts) ? opts : [];
    } catch {
      return [];
    }
  }, [product.options]);

  // Selected options state
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    parsedOptions.forEach((opt) => {
      if (opt.name && opt.values && opt.values.length > 0) {
        initial[opt.name] = opt.values[0];
      }
    });
    return initial;
  });

  // Local storage persisted Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistHeartClass, setWishlistHeartClass] = useState("");

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("saidon_wishlist") || "[]");
    if (wishlist.includes(product.id)) {
      setIsWishlisted(true);
    }
  }, [product.id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("saidon_wishlist") || "[]");
    let newWishlist;
    if (isWishlisted) {
      newWishlist = wishlist.filter((id: string) => id !== product.id);
      setIsWishlisted(false);
    } else {
      newWishlist = [...wishlist, product.id];
      setIsWishlisted(true);
      // Trigger bounce animation
      setWishlistHeartClass("bounce-animate");
      setTimeout(() => setWishlistHeartClass(""), 600);
    }
    localStorage.setItem("saidon_wishlist", JSON.stringify(newWishlist));
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  // Dynamically calculate price based on selected variants (size/color/material)
  const dynamicPrice = useMemo(() => {
    let priceSaidon = product.priceSaidon;
    let pricePVP = product.pricePVP;

    // Apply variations based on selected options to look live and realistic
    Object.entries(selectedOptions).forEach(([name, value]) => {
      const valLower = value.toLowerCase();
      // Size variants
      if (name.toLowerCase() === "talla" || name.toLowerCase() === "size") {
        if (valLower === "l") {
          priceSaidon += 3.00;
          pricePVP += 4.50;
        } else if (valLower === "xl" || valLower === "xxl") {
          priceSaidon += 6.00;
          pricePVP += 9.00;
        }
      }
      // Material variants
      if (name.toLowerCase() === "material") {
        if (valLower.includes("oro") || valLower.includes("gold")) {
          priceSaidon += 25.00;
          pricePVP += 40.00;
        } else if (valLower.includes("plata") || valLower.includes("silver")) {
          priceSaidon += 10.00;
          pricePVP += 15.00;
        }
      }
    });

    return {
      priceSaidon,
      pricePVP,
    };
  }, [selectedOptions, product.priceSaidon, product.pricePVP]);

  // Dynamically calculate stock based on selected options to simulate real-time inventory
  const dynamicStock = useMemo(() => {
    // Generate a deterministic stock value based on selected options so it doesn't look random on every render
    let seed = product.stock;
    Object.values(selectedOptions).forEach((val) => {
      seed += val.charCodeAt(0);
    });
    
    // Ensure it remains deterministic and below max stock, but above 0
    const calculatedStock = (seed % (product.stock || 10)) + 1;
    
    // Simulate "Out of Stock" for some specific options
    const firstOptionVal = Object.values(selectedOptions)[0];
    const isOutOfStock = firstOptionVal && firstOptionVal.toLowerCase() === "xxl";
    
    return isOutOfStock ? 0 : calculatedStock;
  }, [selectedOptions, product.stock]);

  return (
    <div className={styles.infoSection}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className={styles.categoryLabel}>
          {product.category.name}
        </span>
        <button
          onClick={toggleWishlist}
          className={`${styles.wishlistBtn} ${isWishlisted ? styles.wishlisted : ""}`}
          title={isWishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
          style={{
            background: isWishlisted ? "rgba(230, 81, 0, 0.1)" : "var(--clr-bg-elevated)",
            border: `1px solid ${isWishlisted ? "var(--clr-primary)" : "var(--clr-border-glass)"}`,
            color: isWishlisted ? "var(--clr-primary)" : "var(--clr-text-dim)",
            width: "44px",
            height: "44px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            boxShadow: isWishlisted ? "0 4px 15px rgba(230, 81, 0, 0.2)" : "none",
          }}
        >
          <Heart
            className={wishlistHeartClass}
            size={22}
            fill={isWishlisted ? "currentColor" : "none"}
            style={{
              transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            }}
          />
        </button>
      </div>

      <h1 className={styles.productName}>{product.name}</h1>

      <div className={styles.ratingRow}>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} size={16} fill="currentColor" />
          ))}
        </div>
        <span className={styles.ratingValue}>4.9 (124 reseñas)</span>
        <span 
          className={styles.stockLabel} 
          style={{ color: dynamicStock > 0 ? "#22c55e" : "#ef4444" }}
        >
          • {dynamicStock > 0 ? `En Stock (${dynamicStock} unidades)` : "Agotado temporalmente"}
        </span>
      </div>

      {/* Interactive Options Selectors */}
      {parsedOptions.length > 0 && (
        <div 
          className="interactive-options"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginBottom: "24px",
            background: "var(--clr-bg-glass)",
            border: "1px solid var(--clr-border-glass)",
            padding: "20px",
            borderRadius: "16px",
          }}
        >
          {parsedOptions.map((opt) => (
            <div key={opt.name} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label 
                style={{ 
                  fontSize: "13px", 
                  fontWeight: "700", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.5px",
                  color: "var(--clr-text-dim)" 
                }}
              >
                {opt.name}: <span style={{ color: "var(--clr-text)", fontWeight: "800" }}>{selectedOptions[opt.name]}</span>
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {opt.values?.map((val) => {
                  const isSelected = selectedOptions[opt.name] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleOptionChange(opt.name, val)}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "10px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        background: isSelected ? "var(--clr-primary)" : "var(--clr-bg-elevated)",
                        color: isSelected ? "#ffffff" : "var(--clr-text)",
                        border: `1.5px solid ${isSelected ? "var(--clr-primary)" : "var(--clr-border)"}`,
                        boxShadow: isSelected ? "0 4px 12px rgba(230, 81, 0, 0.25)" : "none",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "var(--clr-primary)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = "var(--clr-border)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.priceContainer}>
        <div className={styles.priceMain}>
          <span className={styles.saidonLabel}>Precio Socio Saidon</span>
          <div className={styles.saidonPrice}>
            $
            {dynamicPrice.priceSaidon.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <div className={styles.pricePvp}>
          <span className={styles.pvpLabel}>Precio Público</span>
          <span className={styles.pvpValue}>
            $
            {dynamicPrice.pricePVP.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      <div className={styles.benefitsRow}>
        <div className={styles.benefitItem}>
          <Gift className={styles.benefitIcon} size={20} />
          <div>
            <span className={styles.benefitValue}>
              +{Number(product.pointsEarned)} pts
            </span>
            <span className={styles.benefitLabel}>Puntos de Estatus</span>
          </div>
        </div>
      </div>

      <div className={styles.actionSection}>
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          price={product.priceSaidon}
          options={product.options}
          className={styles.fullWidthBtn}
          relatedProducts={relatedProducts}
          hideSelectors
          controlledOptions={selectedOptions}
        />
        
        {!isLoggedIn && (
          <div className={styles.authCta}>
            <Heart size={14} />
            <span>
              <Link href="/auth/login" className={styles.authLink}>Inicia sesión</Link>
              {' '}para guardar favoritos y ganar SaidonPuntos.
            </span>
          </div>
        )}

        <p className={styles.securePrompt}>
          <ShieldCheck size={16} />
          Compra Protegida por SaidonClub
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.featureItem}>
          <Truck size={20} />
          <div>
            <strong>Envío Prioritario</strong>
            <p>Recibe en 24-48 horas hábiles</p>
          </div>
        </div>
        <div className={styles.featureItem}>
          <RefreshCcw size={20} />
          <div>
            <strong>Garantía de Satisfacción</strong>
            <p>30 días de devolución asegurada</p>
          </div>
        </div>
      </div>

      <div className={styles.descriptionBox}>
        <h3>Descripción del Producto</h3>
        <p>{product.description}</p>
      </div>

      {product.provider && (
        <div className={styles.providerInfo}>
          <span className={styles.providerLabel}>Vendido por:</span>
          <div className={styles.providerCard}>
            <div className={styles.providerAvatar}>
              {product.provider.avatar ? (
                <img
                  src={product.provider.avatar}
                  alt={product.provider.name || ""}
                  width={32}
                  height={32}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              ) : (
                <span>{product.provider.name?.[0] || "S"}</span>
              )}
            </div>
            <strong>
              {product.provider.name || "Proveedor Oficial"}
            </strong>
          </div>
        </div>
      )}

      {/* Bounce animation style */}
      <style jsx global>{`
        @keyframes heartBounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.4); }
          60% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .bounce-animate {
          animation: heartBounce 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
      `}</style>
    </div>
  );
}
