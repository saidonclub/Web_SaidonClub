// ============================================================
// COMPONENT: PIN Verification
// PURPOSE: Secure PIN input for sensitive operations (ACID compliance)
// ============================================================

"use client";

import React, { useState, useEffect } from "react";
import { ShieldCheck, Loader2 } from "lucide-react";
import styles from "./PinVerification.module.css";

interface PinVerificationProps {
  email: string;
  type: "TRANSACTION" | "WITHDRAWAL" | "TRANSFER" | "AUTH";
  onVerify: (pin: string) => Promise<{ success: boolean; message?: string }>;
  onSuccess: () => void;
  onResend: () => Promise<void>;
}

export default function PinVerification({
  email,
  onVerify,
  onSuccess,
  onResend,
}: PinVerificationProps) {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullPin = pin.join("");
    if (fullPin.length < 6) return;

    setLoading(true);
    setError(null);
    try {
      const result = await onVerify(fullPin);
      if (result.success) {
        onSuccess();
      } else {
        setError(result.message || "PIN incorrecto o expirado");
      }
    } catch (err) {
      console.error(err);
      setError("Error al verificar el PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;

    setResending(true);
    try {
      await onResend();
      setTimer(60);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <ShieldCheck size={32} />
      </div>

      <h3 className={styles.title}>Verificación de Seguridad</h3>
      <p className={styles.description}>
        Hemos enviado un PIN de 6 dígitos a <br />
        <strong className={styles.email}>{email}</strong>
      </p>

      <div className={styles.pinGrid}>
        {pin.map((digit, i) => (
          <input
            key={i}
            id={`pin-${i}`}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className={styles.pinInput}
          />
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading || pin.some((d) => d === "")}
        className={styles.submitBtn}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          "Verificar y Continuar"
        )}
      </button>

      <div className={styles.resendContainer}>
        <button
          onClick={handleResend}
          disabled={timer > 0 || resending}
          className={`${styles.resendBtn} ${timer > 0 ? styles.resendBtnDisabled : styles.resendBtnActive}`}
        >
          {resending
            ? "Enviando..."
            : timer > 0
              ? `Reenviar código en ${timer}s`
              : "¿No recibiste el código? Reenviar"}
        </button>
      </div>
    </div>
  );
}
