"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Key,
  Smartphone,
  Eye,
  Copy,
  CheckCircle,
  AlertTriangle,
  Loader2,
  X,
  QrCode,
  Bell,
  BellOff,
} from "lucide-react";
import Link from "next/link";
import styles from "./Settings.module.css";

interface TwoFactorStatus {
  enabled: boolean;
  hasSecret: boolean;
}

export default function SecuritySettingsClient() {
  const [status, setStatus] = useState<TwoFactorStatus>({
    enabled: false,
    hasSecret: false,
  });
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
    checkPushStatus();
  }, []);

  const checkPushStatus = async () => {
    try {
      const res = await fetch("/api/push", { method: "GET" });
      const data = await res.json();
      setPushEnabled(data.subscribed);
    } catch (err) {
      console.error("Error checking push status:", err);
    }
  };

  const togglePushNotifications = async () => {
    if (!("Notification" in window)) {
      setError("Este navegador no soporta notificaciones push");
      return;
    }

    setPushLoading(true);
    try {
      if (pushEnabled) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          await fetch("/api/push", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "unsubscribe",
              endpoint: subscription.endpoint,
            }),
          });
          await subscription.unsubscribe();
        }
        setPushEnabled(false);
        setSuccess("Notificaciones push desactivadas");
      } else {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setError("Permiso de notificaciones denegado");
          setPushLoading(false);
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U",
          ),
        });

        await fetch("/api/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "subscribe", subscription }),
        });

        setPushEnabled(true);
        setSuccess("Notificaciones push activadas");
      }
    } catch (err) {
      console.error("Push error:", err);
      setError("Error al gestionar notificaciones push");
    } finally {
      setPushLoading(false);
    }
  };

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/2fa", { method: "GET" });
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error("Error fetching 2FA status:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateQR = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      const data = await res.json();
      if (data.qrCode) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setShowSetup(true);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError("Error al generar código QR");
    } finally {
      setGenerating(false);
    }
  };

  const verifyCode = async () => {
    if (!code || !secret) return;
    setVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", code, secret }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("2FA activado correctamente");
        setShowSetup(false);
        fetchStatus();
      } else {
        setError(data.error || "Código inválido");
      }
    } catch (err) {
      setError("Error al verificar código");
    } finally {
      setVerifying(false);
    }
  };

  const disable2FA = async () => {
    if (!confirm("¿Estás seguro de que quieres desactivar 2FA?")) return;
    try {
      const res = await fetch("/api/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disable" }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("2FA desactivado");
        fetchStatus();
      }
    } catch (err) {
      setError("Error al desactivar 2FA");
    }
  };

  const copyCodes = () => {
    const codes = [
      "ABC123-XY",
      "DEF456-ZW",
      "GHI789-UV",
      "JKL012-ST",
      "MNO345-QR",
      "PQR678-PQ",
      "STU901-MN",
      "VWX234-LM",
    ];
    navigator.clipboard.writeText(codes.join("\n"));
    setSuccess("Códigos copiados al portapapeles");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "60px",
            }}
          >
            <Loader2 className="animate-spin" size={32} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Link href="/dashboard" className={styles.backLink}>
          ← Volver al Panel
        </Link>

        <header className={styles.header}>
          <Shield size={32} className={styles.headerIcon} />
          <h1 className={styles.title}>Configuración de Seguridad</h1>
          <p className={styles.subtitle}>
            Gestiona la seguridad de tu cuenta y activa funcionalidades de
            protección adicionales.
          </p>
        </header>

        {success && (
          <div className={styles.successBanner}>
            <CheckCircle size={16} />
            {success}
            <button onClick={() => setSuccess(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner}>
            <AlertTriangle size={16} />
            {error}
            <button onClick={() => setError(null)}>
              <X size={16} />
            </button>
          </div>
        )}

        <div className={styles.sectionsGrid}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <Smartphone size={20} />
              <h2>Autenticación de Dos Factores (2FA)</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <span className={styles.securityLabel}>Estado de 2FA</span>
                  <span className={styles.securityDesc}>
                    Proteger tu cuenta con un segundo factor de autenticación
                  </span>
                </div>
                <div className={styles.securityStatus}>
                  <span
                    className={`${styles.statusBadge} ${status.enabled ? styles.statusActive : styles.statusInactive}`}
                  >
                    <CheckCircle size={14} />
                    {status.enabled ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </div>

              {!status.enabled && (
                <button
                  className={styles.actionButton}
                  onClick={generateQR}
                  disabled={generating}
                >
                  {generating ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <QrCode size={16} />
                  )}
                  {generating ? "Generando..." : "Activar 2FA"}
                </button>
              )}

              {status.enabled && (
                <button
                  className={styles.actionButtonSecondary}
                  onClick={disable2FA}
                >
                  <X size={16} />
                  Desactivar 2FA
                </button>
              )}
            </div>
          </section>

          {showSetup && (
            <section className={styles.card}>
              <div className={styles.cardHeader}>
                <QrCode size={20} />
                <h2>Configurar 2FA</h2>
              </div>
              <div className={styles.cardContent}>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                  <p style={{ marginBottom: "15px", color: "#666" }}>
                    Escanea este código con tu aplicación de autenticación
                    (Google Authenticator, Authy, etc.)
                  </p>
                  {qrCode && (
                    <img
                      src={qrCode}
                      alt="QR Code"
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "12px",
                        border: "2px solid #e0e0e0",
                      }}
                    />
                  )}
                </div>

                {secret && (
                  <div style={{ marginBottom: "20px" }}>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#666",
                        marginBottom: "8px",
                      }}
                    >
                      O ingresa este código manualmente:
                    </p>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: "16px",
                        padding: "12px",
                        background: "#f5f5f5",
                        borderRadius: "8px",
                        textAlign: "center",
                        letterSpacing: "2px",
                      }}
                    >
                      {secret}
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontWeight: "500",
                    }}
                  >
                    Ingresa el código de 6 dígitos:
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    maxLength={6}
                    style={{
                      width: "100%",
                      padding: "12px",
                      fontSize: "18px",
                      letterSpacing: "4px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className={styles.actionButton}
                    onClick={verifyCode}
                    disabled={verifying || code.length !== 6}
                    style={{ flex: 1 }}
                  >
                    {verifying ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {verifying ? "Verificando..." : "Verificar y Activar"}
                  </button>
                  <button
                    className={styles.actionButtonSecondary}
                    onClick={() => {
                      setShowSetup(false);
                      setQrCode(null);
                      setSecret(null);
                      setCode("");
                    }}
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <Bell size={20} />
              <h2>Notificaciones Push</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <span className={styles.securityLabel}>
                    Estado de Notificaciones
                  </span>
                  <span className={styles.securityDesc}>
                    Recibe alertas en tiempo real sobre tu cuenta
                  </span>
                </div>
                <div className={styles.securityStatus}>
                  <span
                    className={`${styles.statusBadge} ${pushEnabled ? styles.statusActive : styles.statusInactive}`}
                  >
                    <CheckCircle size={14} />
                    {pushEnabled ? "Activadas" : "Desactivadas"}
                  </span>
                </div>
              </div>

              <div className={styles.securityItem}>
                <div className={styles.securityInfo}>
                  <span className={styles.securityLabel}>
                    Tipos de notificación
                  </span>
                  <span className={styles.securityDesc}>
                    Pedidos, retiros, referidos y promociones
                  </span>
                </div>
                <div className={styles.securityStatus}>
                  <CheckCircle size={16} className={styles.iconActive} />
                </div>
              </div>

              <button
                className={
                  pushEnabled
                    ? styles.actionButtonSecondary
                    : styles.actionButton
                }
                onClick={togglePushNotifications}
                disabled={pushLoading}
              >
                {pushLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : pushEnabled ? (
                  <BellOff size={16} />
                ) : (
                  <Bell size={16} />
                )}
                {pushLoading
                  ? "Procesando..."
                  : pushEnabled
                    ? "Desactivar Notificaciones"
                    : "Activar Notificaciones"}
              </button>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <Key size={20} />
              <h2>Códigos de Recuperación</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.recoveryInfo}>
                <AlertTriangle size={20} className={styles.warningIcon} />
                <div>
                  <p className={styles.recoveryTitle}>
                    Guarda estos códigos en un lugar seguro
                  </p>
                  <p className={styles.recoveryDesc}>
                    Los códigos de recuperación te permiten acceder a tu cuenta
                    si pierdes tu dispositivo.
                  </p>
                </div>
              </div>

              <div className={styles.codesGrid}>
                {[
                  "ABC123-XY",
                  "DEF456-ZW",
                  "GHI789-UV",
                  "JKL012-ST",
                  "MNO345-QR",
                  "PQR678-PQ",
                  "STU901-MN",
                  "VWX234-LM",
                ].map((code, i) => (
                  <div key={i} className={styles.codeItem}>
                    {code}
                  </div>
                ))}
              </div>

              <button className={styles.actionButton} onClick={copyCodes}>
                <Copy size={16} />
                Copiar todos los códigos
              </button>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <Eye size={20} />
              <h2>Actividad Reciente de Seguridad</h2>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.activityList}>
                <div className={styles.activityItem}>
                  <CheckCircle size={16} className={styles.activitySuccess} />
                  <div className={styles.activityInfo}>
                    <span className={styles.activityLabel}>
                      Inicio de sesión
                    </span>
                    <span className={styles.activityTime}>Hoy, 10:30 AM</span>
                  </div>
                  <span className={styles.activityDevice}>
                    Chrome / Windows
                  </span>
                </div>
                <div className={styles.activityItem}>
                  <CheckCircle size={16} className={styles.activitySuccess} />
                  <div className={styles.activityInfo}>
                    <span className={styles.activityLabel}>
                      Verificación de retiro
                    </span>
                    <span className={styles.activityTime}>Ayer, 3:45 PM</span>
                  </div>
                  <span className={styles.activityDevice}>
                    Chrome / Windows
                  </span>
                </div>
                <div className={styles.activityItem}>
                  <CheckCircle size={16} className={styles.activitySuccess} />
                  <div className={styles.activityInfo}>
                    <span className={styles.activityLabel}>
                      Cambio de contraseña
                    </span>
                    <span className={styles.activityTime}>Hace 3 días</span>
                  </div>
                  <span className={styles.activityDevice}>
                    Chrome / Windows
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
