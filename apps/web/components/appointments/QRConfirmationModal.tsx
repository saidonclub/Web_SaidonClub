// ============================================================
// COMPONENT: QR Confirmation Modal
// PURPOSE: QR code display for appointment verification
// ============================================================

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface QRConfirmationModalProps {
  appointmentId: string;
  serviceName: string;
  providerName: string;
  onClose: () => void;
}

export function QRConfirmationModal({
  appointmentId,
  serviceName,
  providerName,
  onClose,
}: QRConfirmationModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<"generate" | "scan" | "confirm">("generate");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const generateQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate" }),
      });
      const data = await res.json();
      if (data.success) {
        setQrCode(data.qrToken);
        setExpiresAt(data.expiresAt);
        setStep("scan");
        startPolling();
      } else {
        setError(data.error || "Error al generar código QR");
      }
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const startPolling = () => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/appointments/${appointmentId}/qr?token=${qrCode}`,
        );
        const data = await res.json();
        if (data.valid) {
          if (pollRef.current) clearInterval(pollRef.current);
          setStep("confirm");
        }
      } catch {
        console.error("Polling error");
      }
    }, 3000);
  };

  const validateManual = async () => {
    if (!tokenInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${appointmentId}/qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate",
          qrToken: tokenInput,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStep("confirm");
      } else {
        setError(data.error || "Token inválido");
      }
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Confirmación de Servicio
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {serviceName}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Proveedor: {providerName}
            </p>
          </div>

          {step === "generate" && (
            <div className="text-center space-y-4 py-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Genera un código QR para que el cliente confirme la cita
              </p>
              <button
                onClick={generateQR}
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Generando..." : "Generar Código QR"}
              </button>
            </div>
          )}

          {step === "scan" && (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-300 mb-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">QR Generado</span>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Muestra este código al cliente para confirmar
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center font-mono text-sm break-all text-gray-600 dark:text-gray-300">
                {qrCode}
              </div>

              {expiresAt && (
                <p className="text-xs text-center text-gray-500">
                  Expira: {new Date(expiresAt).toLocaleTimeString()}
                </p>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  O ingresa el token manualmente:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Token del cliente"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={validateManual}
                    disabled={loading || !tokenInput.trim()}
                    className="px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    Validar
                  </button>
                </div>
              </div>

              <p className="text-xs text-center text-gray-500 animate-pulse">
                Esperando confirmación del cliente...
              </p>
            </div>
          )}

          {step === "confirm" && (
            <div className="text-center space-y-4 py-6">
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  ¡Servicio Confirmado!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  La transacción ha sido completada exitosamente
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  router.refresh();
                }}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all"
              >
                Cerrar
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
