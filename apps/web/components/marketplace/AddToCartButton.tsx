// ============================================================
// COMPONENT: Add To Cart Button
// PURPOSE: Add products to cart with quantity and variants
// ============================================================

"use client";

import React, { useState, useMemo } from "react";
import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { addToCart } from "@/app/carrito/actions";
import { useCart } from "@/context/CartContext";
import styles from "./AddToCartButton.module.css";

interface ProductOption {
  name: string;
  values: string[];
}

interface RelatedProduct {
  id: string;
  slug: string;
  name: string;
  images: string[];
  priceSaidon: number | string;
}

interface Props {
  productId: string;
  options?: string | ProductOption[] | unknown;
  className?: string;
  variant?: "compact" | "full";
  productSlug?: string;
  productName?: string;
  price?: number;
  hideSelectors?: boolean;
  controlledOptions?: Record<string, string>;
  relatedProducts?: RelatedProduct[]; // For success modal recommendations
}

export default function AddToCartButton({
  productId,
  options,
  className,
  variant = "full",
  productSlug,
  productName,
  price,
  hideSelectors = false,
  controlledOptions,
  relatedProducts = [],
}: Props) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [quantity, setQuantity] = useState(1);
  const { refreshCart, addToCart: addToCartContext } = useCart();
  const router = useRouter();

  // Parse options if they exist
  const parsedOptions = useMemo<ProductOption[]>(() => {
    if (!options) return [];
    try {
      const opts = typeof options === "string" ? JSON.parse(options) : options;
      return Array.isArray(opts) ? opts : [];
    } catch {
      return [];
    }
  }, [options]);

  const hasOptions = parsedOptions.length > 0;

  // State for selected options
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    parsedOptions.forEach((opt) => {
      if (opt.name && opt.values && opt.values.length > 0) {
        initial[opt.name] = opt.values[0] as string; // select first by default
      }
    });
    return initial;
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleOptionChange = (name: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If it's a compact button and has options, we should send to details page
    if (hasOptions && variant === "compact" && productSlug) {
      router.push(`/productos/${productSlug}`);
      return;
    }

    if (status === "loading" || status === "success") return;

    const activeOptions = controlledOptions || selectedOptions;

    setStatus("loading");
    try {
      // First try server action (for logged in users)
      const result = await addToCart(productId, quantity, activeOptions);
      
      if (result && !("error" in result)) {
        setStatus("success");
        await refreshCart(); // Refresh the count in context
        if (variant === "full") {
            setShowSuccessModal(true);
        }
        setTimeout(() => setStatus("idle"), 2000);
      } else if (result && "error" in result && result.error?.includes("Inicia sesión")) {
        // Fallback to local cart for guest users
        addToCartContext({
          id: productId,
          name: productName || productSlug || "Producto",
          price: price || 0,
          quantity: quantity,
          options: activeOptions,
        });
        setStatus("success");
        if (variant === "full") {
            setShowSuccessModal(true);
        }
        setTimeout(() => setStatus("idle"), 2000);
      } else {
        console.error("Add to cart error:", result?.error);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Add to cart exception:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const continueShopping = () => {
    setShowSuccessModal(false);
    setStatus("idle");
  };

  if (variant === "compact") {
    return (
      <button
        className={`${styles.button} ${styles.compact} ${status === "success" ? styles.success : ""} ${className || ""}`}
        onClick={handleAdd}
        disabled={status === "loading"}
      >
        <div className={styles.shimmer} />
        <div className={styles.iconWrapper}>
          {status === "loading" ? (
            <Loader2 className={styles.spinner} size={14} />
          ) : status === "success" ? (
            <Check size={14} />
          ) : (
            <ShoppingCart size={14} />
          )}
        </div>
        <span>
          {status === "success"
            ? "¡Listo!"
            : hasOptions
              ? "Configurar"
              : "Comprar"}
        </span>
      </button>
    );
  }

  return (
    <div
      className={`${className || ""} ${styles.btnContainer}`}
      onClick={(e) => e.stopPropagation()}
    >
      {hasOptions && !hideSelectors && (
        <div className={styles.optionsWrapper}>
          {parsedOptions.map((opt) => (
            <div key={opt.name} className={styles.optionGroup}>
              <label>{opt.name}</label>
              <select
                value={(controlledOptions || selectedOptions)[opt.name] || ""}
                onChange={(e) => handleOptionChange(opt.name, e.target.value)}
              >
                {opt.values?.map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actionRow}>
        <div className={styles.qtySelector}>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className={styles.qtyBtn}
          >
            -
          </button>
          <span className={styles.qtyValue}>{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className={styles.qtyBtn}
          >
            +
          </button>
        </div>

        <button
          className={`${styles.button} ${status === "success" ? styles.success : ""}`}
          onClick={handleAdd}
          disabled={status === "loading"}
        >
          <div className={styles.shimmer} />
          <div className={styles.iconWrapper}>
            {status === "loading" ? (
              <Loader2 className={styles.spinner} size={18} />
            ) : status === "success" ? (
              <Check size={18} />
            ) : (
              <ShoppingCart size={18} />
            )}
          </div>
          <span>{status === "success" ? "¡Añadido!" : "Comprar Ahora"}</span>
        </button>
      </div>

      {showSuccessModal && (
        <div
          className={styles.successOverlay}
          onClick={() => setShowSuccessModal(false)}
        >
          <div
            className={styles.successContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.successIcon}>
              <Check size={32} />
            </div>
            <h3>¡Producto añadido!</h3>
            <p>
              El producto se ha agregado correctamente a tu carrito premium.
            </p>

            <div className={styles.modalActions}>
              <button
                onClick={continueShopping}
                className={styles.secondaryBtn}
              >
                Seguir Comprando
              </button>
              <button
                onClick={() => router.push("/carrito")}
                className={styles.primaryBtn}
              >
                Ir al Carrito
              </button>
            </div>

            {relatedProducts.length > 0 && (
              <div className={styles.modalRecommendations}>
                <h4>También te podría gustar</h4>
                <div className={styles.recGrid}>
                  {relatedProducts.slice(0, 3).map((prod) => (
                    <div
                      key={prod.id}
                      className={styles.recItem}
                      onClick={() => {
                        setShowSuccessModal(false);
                        router.push(`/productos/${prod.slug}`);
                      }}
                    >
                      <div className={styles.recImage}>
                        <Image
                          src={prod.images[0] || "/placeholder.png"}
                          alt={prod.name}
                          width={80}
                          height={80}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                      <div className={styles.recInfo}>
                        <span className={styles.recName}>{prod.name}</span>
                        <span className={styles.recPrice}>
                          ${Number(prod.priceSaidon).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
