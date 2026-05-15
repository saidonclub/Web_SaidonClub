/* eslint-disable react/no-unescaped-entities */
// ============================================================
// COMPONENT: Stripe Payment
// PURPOSE: Process card payments via Stripe integration
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Check, AlertCircle, Loader2, Lock } from "lucide-react";
import styles from "./StripePayment.module.css";

interface StripePaymentProps {
  planId: string;
  planAmount: number;
  onSuccess?: () => void;
}

export default function StripePayment({
  planId,
  planAmount,
  onSuccess,
}: StripePaymentProps) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    createPaymentIntent();
  }, [planAmount]);

  const createPaymentIntent = async () => {
    try {
      const response = await fetch("/api/payments/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId,
          amount: planAmount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || `Error del servidor: ${response.status}`);
        return;
      }

      const data = await response.json();

      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Error al inicializar el pago");
      }
    } catch (err) {
      setError("Error de conexión. Verifica tu conexión a internet.");
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!clientSecret) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/stripe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSecret,
          planId,
          amount: planAmount,
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
        <p>Inicializando pago con tarjeta...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <Check size={48} />
        </div>
        <h3>¡Pago exitoso!</h3>
        <p>Tu pago con tarjeta ha sido procesado correctamente.</p>
        <p>Tu membresía está ahora activa.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <CreditCard size={32} className={styles.cardIcon} />
        <h3>Pagar con Tarjeta (Stripe)</h3>
      </div>

      <div className={styles.paymentInfo}>
        <div className={styles.amountBox}>
          <span>Monto a pagar:</span>
          <strong>${planAmount.toFixed(2)} USD</strong>
        </div>

        <div className={styles.securityBadge}>
          <Lock size={16} />
          <span>Pago seguro con encriptación SSL</span>
        </div>

        <div className={styles.cardsAccepted}>
          <p>Tarjetas aceptadas:</p>
          <div className={styles.cardLogos}>
            <span className={styles.cardBadge}>VISA</span>
            <span className={styles.cardBadge}>Mastercard</span>
            <span className={styles.cardBadge}>Amex</span>
          </div>
        </div>

        <div className={styles.stripeBadge}>
          <svg viewBox="0 0 60 25" className={styles.stripeLogo}>
            <path
              fill="#635BFF"
              d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.02.95-.06 1.48zm-6.02-5.04c-1.26 0-2.13.93-2.35 2.6h4.6c-.1-1.53-.7-2.6-2.25-2.6zM40.95 20h-4.09l-.4 2.37h-2.6L30.5 5.63h2.6l4.04 13.43h2.5l4.31-13.43h2.6l-3.6 14.37zm-7.64-8.14h-2.9l-1.03-3.67h-.12l-1.03 3.67h-2.9l4.66-14.37h1.32l4.66 14.37zM27.63 8.23h2.6v10.14h-2.6V8.23zm-2.85 1.84l-3.23 9.3h2.68l3.23-9.3h-2.68zm-2.78-5.07h-4.32v14.37h4.32V5h-4.32zm-4.32 0h2.6v14.37h-2.6V5zM3.82 5h4.32v14.37H3.82V5z"
            />
          </svg>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <button
        className={styles.payButton}
        onClick={handlePay}
        disabled={!clientSecret || processing}
      >
        {processing ? (
          <>
            <Loader2 size={20} className={styles.spinner} />
            Procesando...
          </>
        ) : (
          <>
            <CreditCard size={20} />
            Pagar ${planAmount.toFixed(2)} con tarjeta
          </>
        )}
      </button>

      <p className={styles.disclaimer}>
        Al hacer clic en "Pagar", serás redirigido a Stripe para completar la
        transacción de forma segura.
      </p>
    </div>
  );
}

