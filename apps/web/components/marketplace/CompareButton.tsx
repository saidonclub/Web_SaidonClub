// ============================================================
// COMPONENT: Compare Button
// PURPOSE: Add/remove product from comparison list
// ============================================================

"use client";

import React from "react";
import { Scale, Check, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCompare } from "@/hooks/useCompare";
import { ProductPublic } from "@saidonclub/types";
import styles from "./CompareButton.module.css";

interface CompareButtonProps {
  product: ProductPublic;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  variant?: "icon" | "full";
}

export default function CompareButton({
  product,
  size = "md",
  showLabel = false,
  variant = "icon",
}: CompareButtonProps) {
  const { addToCompare, removeFromCompare, isInCompare, canAddMore, compareCount } = useCompare();
  
  const isInList = isInCompare(product.id);
  const isDisabled = !isInList && !canAddMore;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInList) {
      removeFromCompare(product.id);
    } else if (canAddMore) {
      addToCompare(product);
    }
  };

  const sizeClasses = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`${styles.fullButton} ${sizeClasses[size]} ${isInList ? styles.inCompare : ""} ${isDisabled ? styles.disabled : ""}`}
        title={
          isInList 
            ? "Quitar de comparación" 
            : canAddMore 
              ? `Comparar (${compareCount}/${4})` 
              : "Máximo 4 productos para comparar"
        }
      >
        <Scale size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
        {showLabel && (
          <span>
            {isInList ? "Quitar" : "Comparar"}
          </span>
        )}
        {!isInList && canAddMore && (
          <span className={styles.countBadge}>{compareCount}/4</span>
        )}
      </button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.button
        key={isInList ? "in" : "out"}
        onClick={handleClick}
        disabled={isDisabled}
        className={`${styles.iconButton} ${sizeClasses[size]} ${isInList ? styles.inCompare : ""} ${isDisabled ? styles.disabled : ""}`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        title={
          isInList 
            ? "Quitar de comparación" 
            : canAddMore 
              ? `Añadir a comparación (${compareCount}/4)` 
              : "Máximo 4 productos"
        }
      >
        {isInList ? (
          <Check size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
        ) : isDisabled ? (
          <X size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
        ) : (
          <Plus size={size === "sm" ? 14 : size === "md" ? 16 : 18} />
        )}
      </motion.button>
    </AnimatePresence>
  );
}