// ============================================================
// COMPONENT: Saidon Points Payment
// PURPOSE: Process payment using loyalty points system
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import { Coins, Check, AlertCircle, Loader2 } from "lucide-react";
import styles from "./SaidonPointsPayment.module.css";

interface SaidonPointsPaymentProps {
  planId: string;
  planAmount: number;
  onSuccess?: () => void;
}

interface PointsData {
  available: number;
  required: number;
  missing: number;
  rate: number;
}

export default function SaidonPointsPayment({
  planId,
  planAmount,
  onSuccess,
}: SaidonPointsPaymentProps) {
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);



  useEffect(() => {
    fetchPointsData();
  }, [planAmount]);

  const fetchPointsData = async () => {
    try {
      const response = await fetch("/api/user/points");
      const data = await response.json();

      const exchangeRate = data.exchangeRate || 100;
      const required = Math.ceil(planAmount * exchangeRate);

      setPointsData({
        available: data.points || 0,
        required,
        missing: Math.max(0, required - (data.points || 0)),
        rate: exchangeRate
      });
    } catch (err) {
      setError("Error al cargar tus puntos");
    } finally {
      setLoading(false);
    }
  };

  const handlePayWithPoints = async () => {
    if (!pointsData || pointsData.available < pointsData.required) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/saidon-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          amount: planAmount,
          points: pointsData.required,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(result.message || "Error al procesar el pago");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader2 className={styles.spinner} size={32} />
        <p>Cargando información de puntos...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <Check size={48} />
        </div>
        <h3>¡Pago realizado con SaidonPoints!</h3>
        <p>
          Se han descontado <strong>{pointsData?.required} puntos</strong> de tu
          wallet.
        </p>
        <p>Tu membresía está ahora activa.</p>
      </div>
    );
  }

  const canPay = pointsData && pointsData.available >= pointsData.required;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Coins size={32} className={styles.coinIcon} />
        <h3>Pagar con SaidonPoints</h3>
      </div>

      <div className={styles.pointsInfo}>
        <div className={styles.pointsRow}>
          <span>Puntos disponibles:</span>
          <strong
            className={
              pointsData!.available >= pointsData!.required
                ? styles.pointsGreen
                : styles.pointsRed
            }
          >
            {pointsData!.available.toLocaleString()} pts
          </strong>
        </div>
        <div className={styles.pointsRow}>
          <span>Puntos requeridos:</span>
          <strong>{pointsData!.required.toLocaleString()} pts</strong>
        </div>

        {!canPay && (
          <div className={styles.missingPoints}>
            <AlertCircle size={18} />
            <span>
              Te faltan{" "}
              <strong>{pointsData!.missing.toLocaleString()} puntos</strong>
            </span>
          </div>
        )}
      </div>

      <div className={styles.rateInfo}>
        <p>
          Tasa de conversión: <strong>1 USD = {pointsData?.rate || 100} puntos</strong>
        </p>
        <p className={styles.hint}>
          Usa tus puntos acumulados para obtener descuentos exclusivos
        </p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <button
        className={`${styles.payButton} ${!canPay ? styles.disabled : ""}`}
        onClick={handlePayWithPoints}
        disabled={!canPay || processing}
      >
        {processing ? (
          <>
            <Loader2 size={20} className={styles.spinner} />
            Procesando...
          </>
        ) : canPay ? (
          `Pagar con ${pointsData!.required.toLocaleString()} puntos`
        ) : (
          "Puntos insuficientes"
        )}
      </button>

      {!canPay && (
        <div className={styles.earnPoints}>
          <h4>¿Cómo ganar puntos?</h4>
          <ul>
            <li>💰 Comprando productos y servicios</li>
            <li>👥 Referir nuevos miembros</li>
            <li>📈 Completar metas de ventas</li>
          </ul>
        </div>
      )}
    </div>
  );
}
