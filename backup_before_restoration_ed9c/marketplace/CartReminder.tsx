// ============================================================
// COMPONENT: Cart Reminder
// PURPOSE: Floating cart reminder with checkout CTA
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import { ShoppingCart, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";
import styles from "./CartReminder.module.css";

export default function CartReminder() {
  const { totalItems } = useCart();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show only if cart is not empty, not on cart page, and not dismissed
    if (totalItems > 0 && pathname !== "/carrito" && !isDismissed) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
    return undefined;
  }, [totalItems, pathname, isDismissed]);

  if (!isVisible) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button
          className={styles.closeBtn}
          onClick={() => {
            setIsVisible(false);
            setIsDismissed(true);
          }}
        >
          <X size={14} />
        </button>

        <div className={styles.iconWrapper}>
          <div className={styles.badge}>{totalItems}</div>
          <ShoppingCart size={24} className={styles.icon} />
        </div>

        <div className={styles.content}>
          <p className={styles.title}>¡Tu carrito te espera!</p>
          <p className={styles.subtitle}>
            Tienes productos premium reservados.
          </p>

          <Link href="/carrito" className={styles.actionBtn}>
            Completar Compra <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
