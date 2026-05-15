"use client";

import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { clearCartUser } from "./actions";
import { useCart } from "@/context/CartContext";
import styles from "./Carrito.module.css";

export default function ClearCartButton() {
  const [loading, setLoading] = useState(false);
  const { clearCart, refreshCart } = useCart();

  const handleClear = async () => {
    if (!window.confirm("¿Estás seguro de que deseas vaciar tu carrito?")) return;
    
    setLoading(true);
    try {
      const res = await clearCartUser();
      if (res && res.success) {
        clearCart();
        refreshCart();
      } else {
        // Fallback for local
        clearCart();
      }
    } catch (e) {
      console.error(e);
      clearCart();
    }
    setLoading(false);
  };

  return (
    <button
      className={styles.clearBtn}
      onClick={handleClear}
      disabled={loading}
    >
      <Trash2 size={16} />
      <span>{loading ? "Vaciando..." : "Limpiar Carrito"}</span>
    </button>
  );
}
