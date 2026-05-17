"use client";
 
import React, { useState } from "react";
import { Briefcase, Check, Loader2, Plus } from "lucide-react";
import { addServiceToCart } from "@/app/carrito/actions";
import { useToast } from "@/components/shared/Toast";
import styles from "./HireServiceButton.module.css";
 
interface HireServiceButtonProps {
  serviceId: string;
  serviceName: string;
  className?: string;
  variant?: "compact" | "full";
}
 
export default function HireServiceButton({
  serviceId,
  serviceName,
  className,
  variant = "compact",
}: HireServiceButtonProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { error } = useToast();
 
  const handleHire = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
 
    if (loading || success) return;
 
    setLoading(true);
    try {
      const result = await addServiceToCart(serviceId);
      if (result.success) {
        setSuccess(true);
        // Dispatch custom event for cart refresh if needed, 
        // though revalidatePath usually handles it on next load
        setTimeout(() => {
        setSuccess(false);
        }, 2000);
      } else if (result.error) {
        error("Error", result.error);
      }
    } catch (err) {
      console.error(`Error hiring service ${serviceName}:`, err);
      error("Error", "Ocurrió un error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <button
      className={`${styles.button} ${success ? styles.success : ""} ${variant === "compact" ? styles.compact : ""} ${className || ""}`}
      onClick={handleHire}
      disabled={loading}
      aria-label={`Contratar ${serviceName}`}
    >
      <div className={styles.iconWrapper}>
        {loading ? (
          <Loader2 size={16} className={styles.spinner} />
        ) : success ? (
          <Check size={16} />
        ) : variant === "compact" ? (
          <Plus size={16} />
        ) : (
          <Briefcase size={16} />
        )}
      </div>
      <span className={styles.text}>
        {loading ? "Procesando..." : success ? "¡Agregado!" : variant === "compact" ? "Contratar" : "Contratar Servicio"}
      </span>
      <div className={styles.shimmer} />
    </button>
  );
}
