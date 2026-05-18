"use client";
import React, { useState } from "react";
import styles from "./PaymentSelector.module.css";
import {
  Bitcoin,
  CreditCard,
  Wallet,
  Smartphone,
  Landmark,
  ReceiptText,
  Check,
  Copy,
  Info,
  ShieldCheck,
  Coins,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG } from "@/config/site";
import { MediaUpload } from "@/components/shared/MediaUpload";
import { useToast } from "@/components/shared/Toast";
import SaidonPointsPayment from "@/components/checkout/SaidonPointsPayment";
import StripePayment from "@/components/checkout/StripePayment";

interface PaymentSelectorProps {
  planId: string;
  planAmount: number;
}

export default function PaymentSelector({
  planId,
  planAmount,
}: PaymentSelectorProps) {
  const toast = useToast();
  const [method, setMethod] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadedReceipts, setUploadedReceipts] = useState<
    Record<string, string>
  >({});

  const handleUploadComplete = (urls: string[], methodId: string) => {
    if (urls.length > 0) {
      setUploadedReceipts((prev) => ({ ...prev, [methodId]: urls[0] }));
    } else {
      setUploadedReceipts((prev) => {
        const next = { ...prev };
        delete next[methodId];
        return next;
      });
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (method && !uploadedReceipts[method]) {
      toast.warning(
        "Comprobante requerido",
        "Por favor sube el comprobante de pago antes de continuar.",
      );
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("method", method || "");
    formData.append("receiptUrl", method ? uploadedReceipts[method] : "");
    formData.append("planId", planId);
    formData.append("amount", planAmount.toString());
    formData.append("timestamp", new Date().toISOString());

    try {
      const response = await fetch("/api/payments/notify", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        toast.success(
          "¡Comprobante enviado!",
          result.message || "Tu pago está en proceso de validación.",
        );
        setIsSubmitted(true);
      } else {
        toast.error(
          "Error al notificar pago",
          result.message || "Ocurrió un error inesperado.",
        );
      }
    } catch {
      toast.error(
        "Error de conexión",
        "No se pudo conectar con el servidor. Intenta nuevamente.",
      );
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>
          <Check size={48} />
        </div>
        <h3>¡Pago Notificado!</h3>
        <p>
          Hemos recibido tu comprobante. Nuestro equipo verificará la
          transacción en un lapso de 1 a 4 horas laborables.
        </p>
        <p className={styles.refInfo}>
          Referencia:{" "}
          <strong>
            SAID-{Math.random().toString(36).substring(7).toUpperCase()}
          </strong>
        </p>
        <div className={styles.successActions}>
          <Link href="/dashboard" className={styles.dashboardBtn}>
            Ir al Panel de Control
          </Link>
          <Link href="/" className={styles.homeBtn}>
            Volver al Inicio
          </Link>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    {
      id: "points",
      name: "SaidonPoints",
      icon: <Coins size={24} />,
      type: "points",
      guide: "Usa tus puntos acumulados para pagar tu membresía",
    },
    {
      id: "stripe",
      name: "Tarjeta de Crédito/Débito",
      icon: <CreditCard size={24} />,
      type: "card",
      guide: "Pago seguro con Visa, Mastercard y más",
    },
    {
      id: "usdt",
      name: SITE_CONFIG.payments.crypto.usdt_trc20.name,
      icon: <Wallet size={24} />,
      type: "crypto",
      guide: "Ideal para transacciones internacionales rápidas y seguras.",
    },
    {
      id: "btc",
      name: SITE_CONFIG.payments.crypto.btc.name,
      icon: <Bitcoin size={24} />,
      type: "crypto",
      guide: "El estándar de oro digital. Confirmación en 10-30 min.",
    },
    {
      id: "binance",
      name: SITE_CONFIG.payments.crypto.binance_pay.name,
      icon: <Smartphone size={24} />,
      type: "crypto",
      guide: "Sin comisiones entre usuarios de Binance.",
    },
    {
      id: "paypal",
      name: SITE_CONFIG.payments.online.paypal.name,
      icon: <CreditCard size={24} />,
      type: "online",
      guide: "Protección al comprador. Aplica cargos por servicio.",
    },
    {
      id: "deuna",
      name: SITE_CONFIG.payments.bank.deuna.name,
      icon: <Smartphone size={24} />,
      type: "bank",
      guide: "Pago instantáneo escaneando el código QR.",
    },
    {
      id: "transfer",
      name: "Transferencia Bancaria",
      icon: <Landmark size={24} />,
      type: "bank",
      guide:
        "Transferencia directa a " +
        SITE_CONFIG.payments.bank.pichincha.bankName +
        ".",
    },
    {
      id: "deposit",
      name: "Depósito / Mi Vecino",
      icon: <ReceiptText size={24} />,
      type: "bank",
      guide: "Pago en efectivo en cualquier punto Mi Vecino.",
    },
  ];

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.methodGrid}>
        {paymentMethods.map((pm) => (
          <button
            key={pm.id}
            className={`${styles.methodCard} ${method === pm.id ? styles.active : ""}`}
            onClick={() => setMethod(pm.id)}
          >
            <div className={styles.methodIcon}>{pm.icon}</div>
            <div className={styles.methodText}>
              <span className={styles.methodName}>{pm.name}</span>
              <span className={styles.methodGuide}>{pm.guide}</span>
            </div>
            {method === pm.id && (
              <div className={styles.selectedCheck}>
                <Check size={14} />
              </div>
            )}
          </button>
        ))}
      </div>

      {method && (
        <div className={styles.paymentDetails}>
          <div className={styles.detailsHeader}>
            <button className={styles.backBtn} onClick={() => setMethod(null)}>
              ← Cambiar método
            </button>
            <div className={styles.amountBadge}>
              Monto a pagar: ${planAmount} USD
            </div>
          </div>

          {method === "usdt" && (
            <div className={styles.detailsContent}>
              <div className={styles.methodTitle}>
                <Wallet size={32} />
                <h3>Pago con {SITE_CONFIG.payments.crypto.usdt_trc20.name}</h3>
              </div>
              <div className={styles.instructionBox}>
                <div className={styles.infoIcon}>
                  <Info size={18} />
                </div>
                <div className={styles.instructionText}>
                  <h4>Instrucciones de Envío:</h4>
                  <ol>
                    <li>
                      Abre tu wallet o exchange (Binance, Trust Wallet,
                      MetaMask, etc.)
                    </li>
                    <li>
                      Selecciona <strong>Retirar / Enviar USDT</strong>.
                    </li>
                    <li>
                      Elige la red{" "}
                      <strong>
                        {SITE_CONFIG.payments.crypto.usdt_trc20.network}
                      </strong>{" "}
                      (¡Muy importante!).
                    </li>
                    <li>Escanea el QR o copia la dirección de abajo.</li>
                    <li>
                      Envía exactamente <strong>{planAmount} USDT</strong>.
                    </li>
                  </ol>
                </div>
              </div>

              <div className={styles.cryptoVisual}>
                <div className={styles.qrContainer}>
                  <div className={styles.qrWrapper}>
                    <Image
                      src="/images/payments/usdt-qr.png"
                      alt="QR USDT"
                      width={180}
                      height={180}
                    />
                  </div>
                  <span>Escanea para pagar</span>
                </div>

                <div className={styles.addressSection}>
                  <div className={styles.copyContainer}>
                    <label>Dirección de Billetera (TRC20):</label>
                    <div className={styles.copyBox}>
                      <code>
                        {SITE_CONFIG.payments.crypto.usdt_trc20.address}
                      </code>
                      <button
                        className={styles.copyBtn}
                        onClick={() =>
                          handleCopy(
                            SITE_CONFIG.payments.crypto.usdt_trc20.address,
                          )
                        }
                      >
                        {copied ? "¡Copiado!" : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className={styles.walletLogos}>
                    <Image
                      src="/images/logos/binance-small.png"
                      alt="Binance"
                      width={24}
                      height={24}
                    />
                    <Image
                      src="/images/logos/trust-wallet.png"
                      alt="Trust"
                      width={24}
                      height={24}
                    />
                    <Image
                      src="/images/logos/metamask.png"
                      alt="MetaMask"
                      width={24}
                      height={24}
                    />
                    <span>Aceptamos todas las wallets TRC20</span>
                  </div>
                </div>
              </div>

              <div className={styles.warningAlert}>
                <ShieldCheck size={20} />
                <p>
                  ⚠️ <strong>Atención:</strong> Solo envía por la red TRON
                  (TRC20). El envío por otras redes (ERC20, BEP20) causará la
                  pérdida total de los fondos.
                </p>
              </div>

              <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="txid_usdt">Hash de Transacción (TxID):</label>
                  <input
                    id="txid_usdt"
                    name="txid"
                    type="text"
                    placeholder="Pega el hash de la transacción aquí"
                    className={styles.textInput}
                    required
                  />
                  <span className={styles.inputHint}>
                    Lo encuentras en los detalles del retiro de tu wallet.
                  </span>
                </div>
                <div className={styles.fieldGroup}>
                  <label>Captura del Comprobante:</label>
                  <MediaUpload
                    maxFiles={1}
                    acceptVideo={false}
                    folder="receipts"
                    onUploadComplete={(urls) =>
                      handleUploadComplete(urls, "usdt")
                    }
                  />
                  <input
                    type="hidden"
                    name="receiptUrl"
                    value={uploadedReceipts["usdt"] || ""}
                  />
                </div>
                <button type="submit" className={styles.confirmBtn}>
                  Notificar Envío USDT
                </button>
              </form>
            </div>
          )}

          {method === "btc" && (
            <div className={styles.detailsContent}>
              <div className={styles.methodTitle}>
                <Bitcoin size={32} />
                <h3>Pago con {SITE_CONFIG.payments.crypto.btc.name}</h3>
              </div>
              <div className={styles.instructionBox}>
                <p>
                  Envía el equivalente a <strong>${planAmount} USD</strong> en
                  Bitcoin a nuestra dirección institucional.
                </p>
                <div className={styles.btcRates}>
                  <span>Tasa actual: 1 BTC ≈ $65,000 USD</span>
                  <Link href="https://preev.com/btc/usd" target="_blank">
                    Calculadora en vivo
                  </Link>
                </div>
              </div>

              <div className={styles.cryptoVisual}>
                <div className={styles.qrContainer}>
                  <div className={styles.qrWrapper}>
                    <Image
                      src="/images/payments/btc-qr.png"
                      alt="QR BTC"
                      width={180}
                      height={180}
                    />
                  </div>
                </div>

                <div className={styles.addressSection}>
                  <div className={styles.copyContainer}>
                    <label>Dirección Bitcoin:</label>
                    <div className={styles.copyBox}>
                      <code>{SITE_CONFIG.payments.crypto.btc.address}</code>
                      <button
                        className={styles.copyBtn}
                        onClick={() =>
                          handleCopy(SITE_CONFIG.payments.crypto.btc.address)
                        }
                      >
                        {copied ? "¡Copiado!" : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="txid_btc">TxID de Bitcoin:</label>
                  <input
                    id="txid_btc"
                    name="txid"
                    type="text"
                    className={styles.textInput}
                    placeholder="Hash de la transacción BTC"
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Comprobante:</label>
                  <MediaUpload
                    maxFiles={1}
                    acceptVideo={false}
                    folder="receipts"
                    onUploadComplete={(urls) =>
                      handleUploadComplete(urls, "btc")
                    }
                  />
                  <input
                    type="hidden"
                    name="receiptUrl"
                    value={uploadedReceipts["btc"] || ""}
                  />
                </div>
                <button type="submit" className={styles.confirmBtn}>
                  Notificar Pago BTC
                </button>
              </form>
            </div>
          )}

          {method === "binance" && (
            <div className={styles.detailsContent}>
              <div className={styles.methodTitle}>
                <Smartphone size={32} />
                <h3>{SITE_CONFIG.payments.crypto.binance_pay.name}</h3>
              </div>
              <div className={styles.binanceGrid}>
                <div className={styles.binanceLeft}>
                  <div className={styles.qrWrap}>
                    <Image
                      src="/images/payments/binance-qr.png"
                      alt="QR Binance"
                      width={220}
                      height={220}
                    />
                    <div className={styles.scanBadge}>SCAN TO PAY</div>
                  </div>
                </div>
                <div className={styles.binanceRight}>
                  <h4>Alternativa por Binance ID:</h4>
                  <div className={styles.copyBox}>
                    <strong>
                      {SITE_CONFIG.payments.crypto.binance_pay.binance_id}
                    </strong>
                    <button
                      className={styles.copyBtn}
                      onClick={() =>
                        handleCopy(
                          SITE_CONFIG.payments.crypto.binance_pay.binance_id,
                        )
                      }
                    >
                      {copied ? "¡Copiado!" : <Copy size={16} />}
                    </button>
                  </div>
                  <p className={styles.emailHint}>
                    Email: {SITE_CONFIG.payments.crypto.binance_pay.email}
                  </p>

                  <div className={styles.stepMini}>
                    <span>1. Abre la App de Binance</span>
                    <span>2. Ve a &apos;Pay&apos; y escanea o pega el ID</span>
                    <span>3. Envía {planAmount} USDT / BUSD</span>
                  </div>
                </div>
              </div>
              <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="binance_id">Tu Binance ID o Email:</label>
                  <input
                    id="binance_id"
                    name="txid"
                    type="text"
                    className={styles.textInput}
                    placeholder="ID de quien envía"
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Captura de Confirmación:</label>
                  <MediaUpload
                    maxFiles={1}
                    acceptVideo={false}
                    folder="receipts"
                    onUploadComplete={(urls) =>
                      handleUploadComplete(urls, "binance")
                    }
                  />
                  <input
                    type="hidden"
                    name="receiptUrl"
                    value={uploadedReceipts["binance"] || ""}
                  />
                </div>
                <button type="submit" className={styles.confirmBtn}>
                  Verificar en Binance Pay
                </button>
              </form>
            </div>
          )}

          {method === "paypal" && (
            <div className={styles.detailsContent}>
              <div className={styles.methodTitle}>
                <CreditCard size={32} />
                <h3>{SITE_CONFIG.payments.online.paypal.name}</h3>
              </div>
              <div className={styles.paypalLayout}>
                <div className={styles.paypalInfo}>
                  <p>
                    Seguridad garantizada por <strong>PayPal</strong>. Puedes
                    usar tu saldo o tarjetas vinculadas.
                  </p>
                  <div className={styles.feeCard}>
                    <div className={styles.feeHeader}>Desglose de Pago</div>
                    <div className={styles.feeRow}>
                      <span>Membresía:</span> <span>${planAmount}.00</span>
                    </div>
                    <div className={styles.feeRow}>
                      <span>Cargos PayPal (5.4% + $0.30):</span>{" "}
                      <span>${(planAmount * 0.054 + 0.3).toFixed(2)}</span>
                    </div>
                    <div className={styles.totalRow}>
                      <span>Total Final:</span>{" "}
                      <span>${(planAmount * 1.054 + 0.3).toFixed(2)}</span>
                    </div>
                  </div>
                  <Link
                    href={`https://www.paypal.com/paypalme/saidonclub/${(planAmount * 1.054 + 0.3).toFixed(2)}`}
                    target="_blank"
                    className={styles.paypalActionBtn}
                  >
                    Abrir PayPal y Pagar
                  </Link>
                </div>
                <div className={styles.paypalVisual}>
                  <Image
                    src="/images/payments/paypal-verified.png"
                    alt="PayPal Verified"
                    width={120}
                    height={120}
                  />
                  <span>Transacción Encriptada</span>
                </div>
              </div>
              <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="paypal_email">Tu Email de PayPal:</label>
                  <input
                    id="paypal_email"
                    name="txid"
                    type="email"
                    className={styles.textInput}
                    placeholder="tu-correo@ejemplo.com"
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Comprobante de PayPal:</label>
                  <MediaUpload
                    maxFiles={1}
                    acceptVideo={false}
                    folder="receipts"
                    onUploadComplete={(urls) =>
                      handleUploadComplete(urls, "paypal")
                    }
                  />
                  <input
                    type="hidden"
                    name="receiptUrl"
                    value={uploadedReceipts["paypal"] || ""}
                  />
                </div>
                <button type="submit" className={styles.confirmBtn}>
                  Confirmar Pago PayPal
                </button>
              </form>
            </div>
          )}

          {method === "deuna" && (
            <div className={styles.detailsContent}>
              <div className={styles.methodTitle}>
                <Smartphone size={32} />
                <h3>{SITE_CONFIG.payments.bank.deuna.name}</h3>
              </div>
              <div className={styles.deunaContainer}>
                <div className={styles.deunaSteps}>
                  <div className={styles.dStep}>
                    <div className={styles.dNum}>1</div>
                    <p>
                      Abre la App <strong>De Una</strong>
                    </p>
                  </div>
                  <div className={styles.dStep}>
                    <div className={styles.dNum}>2</div>
                    <p>Escanea el QR o usa el número</p>
                  </div>
                  <div className={styles.dStep}>
                    <div className={styles.dNum}>3</div>
                    <p>
                      Envía <strong>${planAmount}.00</strong>
                    </p>
                  </div>
                </div>

                <div className={styles.deunaQR}>
                  <Image
                    src={SITE_CONFIG.payments.bank.deuna.qr_image}
                    alt="QR De Una"
                    width={220}
                    height={220}
                    className={styles.qrMain}
                  />
                  <div className={styles.phoneLabel}>
                    {SITE_CONFIG.payments.bank.deuna.phone}
                  </div>
                </div>
              </div>
              <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ref_deuna">
                    Teléfono desde el que pagaste:
                  </label>
                  <input
                    id="ref_deuna"
                    name="txid"
                    type="text"
                    className={styles.textInput}
                    placeholder="099XXXXXXX"
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Comprobante (Screenshot):</label>
                  <MediaUpload
                    maxFiles={1}
                    acceptVideo={false}
                    folder="receipts"
                    onUploadComplete={(urls) =>
                      handleUploadComplete(urls, "deuna")
                    }
                  />
                  <input
                    type="hidden"
                    name="receiptUrl"
                    value={uploadedReceipts["deuna"] || ""}
                  />
                </div>
                <button type="submit" className={styles.confirmBtn}>
                  Validar Pago De Una
                </button>
              </form>
            </div>
          )}

          {method === "transfer" && (
            <div className={styles.detailsContent}>
              <div className={styles.methodTitle}>
                <Landmark size={32} />
                <h3>Transferencia Bancaria</h3>
              </div>
              <div className={styles.bankInfoGrid}>
                <div className={styles.bankCard}>
                  <div className={styles.bankLogoWrap}>
                    <Image
                      src="/images/logos/pichincha.png"
                      alt="Pichincha"
                      width={120}
                      height={30}
                    />
                  </div>
                  <div className={styles.bankDetails}>
                    <div className={styles.bdRow}>
                      <span>Banco:</span>{" "}
                      <strong>
                        {SITE_CONFIG.payments.bank.pichincha.bankName}
                      </strong>
                    </div>
                    <div className={styles.bdRow}>
                      <span>Beneficiario:</span>{" "}
                      <strong>
                        {SITE_CONFIG.payments.bank.pichincha.accountName}
                      </strong>
                    </div>
                    <div className={styles.bdRow}>
                      <span>Tipo:</span>{" "}
                      <strong>
                        {SITE_CONFIG.payments.bank.pichincha.accountType}
                      </strong>
                    </div>
                    <div className={styles.bdRow}>
                      <span>Cuenta:</span>
                      <div className={styles.copyRow}>
                        <strong>
                          {SITE_CONFIG.payments.bank.pichincha.accountNumber}
                        </strong>
                        <button
                          onClick={() =>
                            handleCopy(
                              SITE_CONFIG.payments.bank.pichincha.accountNumber,
                            )
                          }
                          className={styles.bdCopy}
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </div>
                    <div className={styles.bdRow}>
                      <span>RUC:</span>{" "}
                      <strong>{SITE_CONFIG.payments.bank.pichincha.ruc}</strong>
                    </div>
                    <div className={styles.bdRow}>
                      <span>Email:</span>{" "}
                      <strong>
                        {SITE_CONFIG.payments.bank.pichincha.email}
                      </strong>
                    </div>
                  </div>
                </div>
                <div className={styles.bankGuide}>
                  <h4>Guía de Transferencia (Instrucciones de Envío):</h4>
                  <ul>
                    <li>
                      Desde la banca web, elige{" "}
                      <strong>Transferencias a Terceros</strong>.
                    </li>
                    <li>Registra la cuenta con los datos de la izquierda.</li>
                    <li>
                      En concepto pon:{" "}
                      <strong>MEMBRESIA {planId.toUpperCase()}</strong>
                    </li>
                    <li>Sube el comprobante generado (PDF o Imagen).</li>
                  </ul>
                </div>
              </div>
              <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ref_transfer">
                    Número de Documento / Referencia:
                  </label>
                  <input
                    id="ref_transfer"
                    name="txid"
                    type="text"
                    className={styles.textInput}
                    placeholder="Ej: 98765432"
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Comprobante de Transferencia:</label>
                  <MediaUpload
                    maxFiles={1}
                    acceptVideo={false}
                    folder="receipts"
                    onUploadComplete={(urls) =>
                      handleUploadComplete(urls, "transfer")
                    }
                  />
                  <input
                    type="hidden"
                    name="receiptUrl"
                    value={uploadedReceipts["transfer"] || ""}
                  />
                </div>
                <button type="submit" className={styles.confirmBtn}>
                  Confirmar Transferencia
                </button>
              </form>
            </div>
          )}

          {method === "deposit" && (
            <div className={styles.detailsContent}>
              <div className={styles.methodTitle}>
                <ReceiptText size={32} />
                <h3>Depósito / Mi Vecino</h3>
              </div>
              <div className={styles.depositGuide}>
                <div className={styles.depositCard}>
                  <h4>Datos para el Depósito:</h4>
                  <p>
                    Banco:{" "}
                    <strong>
                      {SITE_CONFIG.payments.bank.pichincha.bankName}
                    </strong>
                  </p>
                  <p>
                    Cuenta:{" "}
                    <strong>
                      {SITE_CONFIG.payments.bank.pichincha.accountNumber}
                    </strong>
                  </p>
                  <p>
                    A nombre de:{" "}
                    <strong>
                      {SITE_CONFIG.payments.bank.pichincha.accountName}
                    </strong>
                  </p>
                </div>
                <div className={styles.mivecinoLogo}>
                  <Image
                    src="/images/logos/mivecino.png"
                    alt="Mi Vecino"
                    width={150}
                    height={60}
                  />
                  <span>Disponible en farmacias y tiendas locales</span>
                </div>
              </div>
              <div className={styles.visualSteps}>
                <div className={styles.vStep}>
                  <span>1</span>
                  <p>Ve a un Mi Vecino</p>
                </div>
                <div className={styles.vStep}>
                  <span>2</span>
                  <p>Realiza el depósito</p>
                </div>
                <div className={styles.vStep}>
                  <span>3</span>
                  <p>Foto del voucher</p>
                </div>
                <div className={styles.vStep}>
                  <span>4</span>
                  <p>Súbelo aquí</p>
                </div>
              </div>
              <form className={styles.paymentForm} onSubmit={handleSubmit}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="ref_deposit">Referencia del Voucher:</label>
                  <input
                    id="ref_deposit"
                    name="txid"
                    type="text"
                    className={styles.textInput}
                    placeholder="Número de transacción"
                    required
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label>Foto nítida del comprobante:</label>
                  <MediaUpload
                    maxFiles={1}
                    acceptVideo={false}
                    folder="receipts"
                    onUploadComplete={(urls) =>
                      handleUploadComplete(urls, "deposit")
                    }
                  />
                  <input
                    type="hidden"
                    name="receiptUrl"
                    value={uploadedReceipts["deposit"] || ""}
                  />
                </div>
                <button type="submit" className={styles.confirmBtn}>
                  Enviar Comprobante de Depósito
                </button>
              </form>
            </div>
          )}

          {method === "points" && (
            <SaidonPointsPayment planId={planId} planAmount={planAmount} />
          )}

          {method === "stripe" && (
            <StripePayment
              planId={planId}
              planAmount={planAmount}
              onSuccess={() => setIsSubmitted(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
