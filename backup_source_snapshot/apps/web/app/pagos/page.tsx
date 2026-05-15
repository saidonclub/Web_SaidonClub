"use client";

import React, { useState } from "react";
import styles from "./Pagos.module.css";
import {
  Wallet,
  Bitcoin,
  Smartphone,
  CreditCard,
  Landmark,
  ReceiptText,
  Check,
  Info,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  Banknote,
  Clock,
  CheckCircle,
  ExternalLink,
  Copy as CopyIcon,
  ChevronRight,
  MessageCircle,
  Send,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site";

const PAYMENT_METHODS = [
  {
    id: "usdt",
    name: "USDT (TRC20)",
    icon: <Wallet size={32} />,
    tagline: "Transacciones rápidas y seguras",
    description:
      "La stablecoin más utilizada. Ideal para transacciones internacionales sin límites.",
    minAmount: 1,
    maxAmount: 100000,
    commission: "0 $ USD",
    confirmationTime: "5-15 min",
    color: "#26A17B",
    benefits: [
      "Sin límite de monto",
      "Confirmación rápida",
      "Baja comisión de red",
      "Compatible con Binance, Trust Wallet, MetaMask",
    ],
  },
  {
    id: "btc",
    name: "Bitcoin (BTC)",
    icon: <Bitcoin size={32} />,
    tagline: "El estándar de oro digital",
    description: "La criptomoneda más reconocida y valorada a nivel mundial.",
    minAmount: 10,
    maxAmount: 500000,
    commission: "Variable según red",
    confirmationTime: "10-60 min",
    color: "#F7931A",
    benefits: [
      "Máxima seguridad blockchain",
      "Respaldo global",
      "Histórico de valor",
      "Wallet nativa más segura",
    ],
  },
  {
    id: "binance",
    name: "Binance Pay",
    icon: <Smartphone size={32} />,
    tagline: "Pagos sin comisiones entre usuarios",
    description: "Transfiere entre usuarios de Binance sin costos adicionales.",
    minAmount: 1,
    maxAmount: 50000,
    commission: "0 $ USD",
    confirmationTime: "Instantáneo",
    color: "#F3BA2F",
    benefits: [
      "Comisión 0 entre usuarios Binance",
      "Transferencia instantánea",
      "ID de usuario o email",
      "Amplia adopción",
    ],
  },
  {
    id: "paypal",
    name: "PayPal",
    icon: <CreditCard size={32} />,
    tagline: "Protección al comprador",
    description: "El método más reconocido globally con protección de compra.",
    minAmount: 1,
    maxAmount: 10000,
    commission: "5.4% + $0.30",
    confirmationTime: "1-24 horas",
    color: "#003087",
    benefits: [
      "Protección al comprador",
      "Reembolso garantizado",
      "Aceptación global",
      "Tarjetas o saldo PayPal",
    ],
  },
  {
    id: "deuna",
    name: "De Una QR",
    icon: <QrCode size={32} />,
    tagline: "Pago instantáneo con QR",
    description:
      "Escanea y paga al instante con la app De Una del Banco Pichincha.",
    minAmount: 1,
    maxAmount: 5000,
    commission: "0 $ USD",
    confirmationTime: "Instantáneo",
    color: "#FF6B00",
    benefits: [
      "Pago 100% instantáneo",
      "Sin costo adicional",
      "Sin necesidad de cuenta",
      "Solo con app De Una",
    ],
  },
  {
    id: "transfer",
    name: "Transferencia Bancaria",
    icon: <Landmark size={32} />,
    tagline: "Directo a tu cuenta",
    description: "Transferencia nacional a cuentas del Banco Pichincha.",
    minAmount: 5,
    maxAmount: 100000,
    commission: "Según banco",
    confirmationTime: "1-4 horas laborables",
    color: "#1A1A1A",
    benefits: [
      "Transferencia interbancaria",
      "Válida para cualquier banco",
      "Monto según tu comodidad",
      "Comprobante oficial",
    ],
  },
  {
    id: "deposit",
    name: "Depósito en Efectivo",
    icon: <Banknote size={32} />,
    tagline: "Sin cuenta, en efectivo",
    description: "Depósito en efectivo en puntos autorizados o ventanillas.",
    minAmount: 1,
    maxAmount: 5000,
    commission: "0 $ USD",
    confirmationTime: "1-4 horas laborables",
    color: "#10B981",
    benefits: [
      "Sin cuenta bancaria",
      "Miles de puntos de pago",
      "Pago en efectivo",
      "Recibo físico como comprobante",
    ],
  },
];

export default function PagosPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const selected = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerDecor}>
          <div className={styles.decorCircle1} />
          <div className={styles.decorCircle2} />
        </div>
        <div className={styles.headerContent}>
          <div className={styles.headerMeta}>
            <div className={styles.headerIconBox}>
              <CreditCard size={28} />
            </div>
            <span className={styles.headerBadge}>Sistema de Pagos</span>
          </div>
          <h1 className={styles.title}>Métodos de Pago</h1>
          <p className={styles.subtitle}>
            Elige el método que mejor se adapte a tus necesidades. Todos los
            pagos son procesados de forma segura.
          </p>
        </div>
      </header>

      <div className={styles.infoBar}>
        <div className={styles.infoItem}>
          <ShieldCheck size={18} />
          <span>Pagos 100% seguros</span>
        </div>
        <div className={styles.infoItem}>
          <Clock size={18} />
          <span>Confirmación en 24h máx.</span>
        </div>
        <div className={styles.infoItem}>
          <MessageCircle size={18} />
          <span>Soporte en español</span>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.methodsColumn}>
          <h2 className={styles.columnTitle}>Selecciona tu Método</h2>
          <div className={styles.methodsList}>
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                className={`${styles.methodCard} ${selectedMethod === method.id ? styles.active : ""}`}
                onClick={() => setSelectedMethod(method.id)}
                style={
                  { "--method-color": method.color } as React.CSSProperties
                }
              >
                <div className={styles.methodIconWrap}>{method.icon}</div>
                <div className={styles.methodInfo}>
                  <span className={styles.methodName}>{method.name}</span>
                  <span className={styles.methodTagline}>{method.tagline}</span>
                </div>
                <ChevronRight size={18} className={styles.methodArrow} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.detailsColumn}>
          {!selectedMethod ? (
            <div className={styles.emptyState}>
              <QrCode size={64} strokeWidth={1} />
              <h3>Selecciona un método de pago</h3>
              <p>
                Haz clic en uno de los métodos para ver los detalles y guía de
                uso.
              </p>
            </div>
          ) : (
            selected && (
              <div className={styles.methodDetails}>
                <div
                  className={styles.detailsHeader}
                  style={
                    { "--method-color": selected.color } as React.CSSProperties
                  }
                >
                  <div className={styles.detailsIconWrap}>{selected.icon}</div>
                  <div>
                    <h2 className={styles.detailsTitle}>{selected.name}</h2>
                    <p className={styles.detailsDesc}>{selected.description}</p>
                  </div>
                </div>

                <div className={styles.detailsStats}>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Mínimo</span>
                    <span className={styles.statValue}>
                      ${selected.minAmount}
                    </span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Máximo</span>
                    <span className={styles.statValue}>
                      ${selected.maxAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Comisión</span>
                    <span className={styles.statValue}>
                      {selected.commission}
                    </span>
                  </div>
                  <div className={styles.statCard}>
                    <span className={styles.statLabel}>Confirmación</span>
                    <span className={styles.statValue}>
                      {selected.confirmationTime}
                    </span>
                  </div>
                </div>

                <div className={styles.benefitsList}>
                  <h3>Beneficios</h3>
                  <ul>
                    {selected.benefits.map((b, i) => (
                      <li key={i}>
                        <CheckCircle size={16} /> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Method-specific content */}
                {selectedMethod === "usdt" && (
                  <div className={styles.guideSection}>
                    <h3>
                      <Wallet size={18} /> Guía de Pago USDT
                    </h3>
                    <div className={styles.guideSteps}>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>1</div>
                        <p>Abre tu wallet (Binance, Trust Wallet, MetaMask)</p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>2</div>
                        <p>
                          Selecciona <strong>Retirar / Enviar USDT</strong>
                        </p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>3</div>
                        <p>
                          Elige la red <strong>TRON (TRC20)</strong>
                        </p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>4</div>
                        <p>Copia la dirección o escanea el QR</p>
                      </div>
                    </div>

                    <div className={styles.qrAddressBox}>
                      <div className={styles.qrDisplay}>
                        <div className={styles.qrPlaceholder}>
                          <Image
                            src="/images/payments/usdt-qr.png"
                            alt="QR USDT"
                            width={160}
                            height={160}
                          />
                        </div>
                        <span>Escanea para pagar</span>
                      </div>
                      <div className={styles.addressDisplay}>
                        <label>Dirección de billetera (TRC20):</label>
                        <div className={styles.copyBox}>
                          <code>
                            {SITE_CONFIG.payments.crypto.usdt_trc20.address}
                          </code>
                          <button
                            onClick={() =>
                              handleCopy(
                                SITE_CONFIG.payments.crypto.usdt_trc20.address,
                                "usdt",
                              )
                            }
                            className={styles.copyBtn}
                          >
                            {copied === "usdt" ? (
                              <Check size={16} />
                            ) : (
                              <CopyIcon size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.warningBox}>
                      <AlertTriangle size={18} />
                      <p>
                        <strong>Importante:</strong> Solo envía por la red TRON
                        (TRC20). Envíos por ERC20, BEP20 u otras redes causarán
                        pérdida total de fondos.
                      </p>
                    </div>

                    <div className={styles.walletLogos}>
                      <span>Compatible con:</span>
                      <div className={styles.logoRow}>
                        <div className={styles.walletLogo}>Binance</div>
                        <div className={styles.walletLogo}>Trust</div>
                        <div className={styles.walletLogo}>MetaMask</div>
                        <div className={styles.walletLogo}>Exodus</div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === "btc" && (
                  <div className={styles.guideSection}>
                    <h3>
                      <Bitcoin size={18} /> Guía de Pago Bitcoin
                    </h3>
                    <div className={styles.guideSteps}>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>1</div>
                        <p>Abre tu wallet o exchange preferido</p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>2</div>
                        <p>
                          Selecciona <strong>Retirar Bitcoin</strong>
                        </p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>3</div>
                        <p>Pega nuestra dirección BTC</p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>4</div>
                        <p>Confirma la transacción</p>
                      </div>
                    </div>

                    <div className={styles.qrAddressBox}>
                      <div className={styles.qrDisplay}>
                        <div className={styles.qrPlaceholder}>
                          <Image
                            src="/images/payments/btc-qr.png"
                            alt="QR BTC"
                            width={160}
                            height={160}
                          />
                        </div>
                        <span>Escanea para pagar</span>
                      </div>
                      <div className={styles.addressDisplay}>
                        <label>Dirección Bitcoin:</label>
                        <div className={styles.copyBox}>
                          <code>{SITE_CONFIG.payments.crypto.btc.address}</code>
                          <button
                            onClick={() =>
                              handleCopy(
                                SITE_CONFIG.payments.crypto.btc.address,
                                "btc",
                              )
                            }
                            className={styles.copyBtn}
                          >
                            {copied === "btc" ? (
                              <Check size={16} />
                            ) : (
                              <CopyIcon size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoBox}>
                      <Info size={18} />
                      <p>
                        La tasa de cambio se calcula al momento de la
                        transacción. Puedes verificar la tasa actual en{" "}
                        <a href="https://preev.com/btc/usd" target="_blank">
                          preev.com <ExternalLink size={12} />
                        </a>
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === "binance" && (
                  <div className={styles.guideSection}>
                    <h3>
                      <Smartphone size={18} /> Guía Binance Pay
                    </h3>
                    <div className={styles.guideSteps}>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>1</div>
                        <p>
                          Abre la app de <strong>Binance</strong>
                        </p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>2</div>
                        <p>
                          Ve a <strong>Binance Pay</strong>
                        </p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>3</div>
                        <p>Escanea el QR o ingresa el ID</p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>4</div>
                        <p>Envía el monto en USDT o BUSD</p>
                      </div>
                    </div>

                    <div className={styles.qrAddressBox}>
                      <div className={styles.qrDisplay}>
                        <div className={styles.qrPlaceholder}>
                          <Image
                            src="/images/payments/binance-qr.png"
                            alt="QR Binance"
                            width={160}
                            height={160}
                          />
                        </div>
                        <span>
                          Binance ID:{" "}
                          {SITE_CONFIG.payments.crypto.binance_pay.binance_id}
                        </span>
                      </div>
                      <div className={styles.addressDisplay}>
                        <label>Email para Binance Pay:</label>
                        <div className={styles.copyBox}>
                          <code>
                            {SITE_CONFIG.payments.crypto.binance_pay.email}
                          </code>
                          <button
                            onClick={() =>
                              handleCopy(
                                SITE_CONFIG.payments.crypto.binance_pay.email,
                                "binance",
                              )
                            }
                            className={styles.copyBtn}
                          >
                            {copied === "binance" ? (
                              <Check size={16} />
                            ) : (
                              <CopyIcon size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === "paypal" && (
                  <div className={styles.guideSection}>
                    <h3>
                      <CreditCard size={18} /> Guía PayPal
                    </h3>
                    <div className={styles.paypalFlow}>
                      <div className={styles.paypalStep}>
                        <div className={styles.paypalIcon}>
                          <CreditCard size={24} />
                        </div>
                        <span>Usa tu saldo PayPal o tarjeta vinculada</span>
                      </div>
                      <div className={styles.paypalArrow}>→</div>
                      <div className={styles.paypalStep}>
                        <div className={styles.paypalIcon}>
                          <ShieldCheck size={24} />
                        </div>
                        <span>Protección al comprador activada</span>
                      </div>
                      <div className={styles.paypalArrow}>→</div>
                      <div className={styles.paypalStep}>
                        <div className={styles.paypalIcon}>
                          <CheckCircle size={24} />
                        </div>
                        <span>Verificación automática</span>
                      </div>
                    </div>

                    <div className={styles.paypalInfo}>
                      <p>
                        <strong>Nota:</strong> Se aplica una comisión de 5.4% +
                        $0.30 por servicio PayPal.
                      </p>
                      <a
                        href={`https://www.paypal.com/paypalme/saidonclub`}
                        target="_blank"
                        className={styles.paypalBtn}
                      >
                        <CreditCard size={18} />
                        Abrir PayPal y Pagar
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}

                {selectedMethod === "deuna" && (
                  <div className={styles.guideSection}>
                    <h3>
                      <QrCode size={18} /> Guía De Una QR
                    </h3>
                    <div className={styles.guideSteps}>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>1</div>
                        <p>
                          Abre la app <strong>De Una</strong>
                        </p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>2</div>
                        <p>
                          Toca en <strong>Escanear QR</strong>
                        </p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>3</div>
                        <p>Apunta al código QR</p>
                      </div>
                      <div className={styles.guideStep}>
                        <div className={styles.guideNum}>4</div>
                        <p>Confirma el pago</p>
                      </div>
                    </div>

                    <div className={styles.qrAddressBox}>
                      <div className={styles.qrDisplay}>
                        <div className={styles.qrPlaceholder}>
                          <Image
                            src={SITE_CONFIG.payments.bank.deuna.qr_image}
                            alt="QR De Una"
                            width={180}
                            height={180}
                          />
                        </div>
                        <span>
                          Teléfono: {SITE_CONFIG.payments.bank.deuna.phone}
                        </span>
                      </div>
                    </div>

                    <div className={styles.infoBox}>
                      <Info size={18} />
                      <p>
                        Pago 100% instantáneo. Recibirás confirmación en tu app
                        De Una.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === "transfer" && (
                  <div className={styles.guideSection}>
                    <h3>
                      <Landmark size={18} /> Guía Transferencia Bancaria
                    </h3>
                    <div className={styles.bankCard}>
                      <div className={styles.bankHeader}>
                        <div className={styles.bankLogo}>
                          <Image
                            src="/images/logos/pichincha.png"
                            alt="Pichincha"
                            width={120}
                            height={30}
                          />
                        </div>
                        <span>Banco del Pichincha</span>
                      </div>
                      <div className={styles.bankDetails}>
                        <div className={styles.bankRow}>
                          <span>Beneficiario:</span>
                          <strong>
                            {SITE_CONFIG.payments.bank.pichincha.accountName}
                          </strong>
                        </div>
                        <div className={styles.bankRow}>
                          <span>Tipo de cuenta:</span>
                          <strong>
                            {SITE_CONFIG.payments.bank.pichincha.accountType}
                          </strong>
                        </div>
                        <div className={styles.bankRow}>
                          <span>Número de cuenta:</span>
                          <div className={styles.copyRow}>
                            <strong>
                              {
                                SITE_CONFIG.payments.bank.pichincha
                                  .accountNumber
                              }
                            </strong>
                            <button
                              onClick={() =>
                                handleCopy(
                                  SITE_CONFIG.payments.bank.pichincha
                                    .accountNumber,
                                  "transfer",
                                )
                              }
                              className={styles.copyBtnSmall}
                            >
                              {copied === "transfer" ? (
                                <Check size={12} />
                              ) : (
                                <CopyIcon size={12} />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className={styles.bankRow}>
                          <span>RUC:</span>
                          <strong>
                            {SITE_CONFIG.payments.bank.pichincha.ruc}
                          </strong>
                        </div>
                        <div className={styles.bankRow}>
                          <span>Email:</span>
                          <strong>
                            {SITE_CONFIG.payments.bank.pichincha.email}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className={styles.warningBox}>
                      <AlertTriangle size={18} />
                      <p>
                        En el concepto de la transferencia indica:{" "}
                        <strong>MEMBRESIA + TuUsuario</strong>
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === "deposit" && (
                  <div className={styles.guideSection}>
                    <h3>
                      <Banknote size={18} /> Guía Depósito en Efectivo
                    </h3>
                    <div className={styles.depositSteps}>
                      <div className={styles.depositStep}>
                        <div className={styles.depositIcon}>
                          <Landmark size={20} />
                        </div>
                        <div>
                          <h4>Acércate a cualquier punto</h4>
                          <p>
                            Mi Vecino, Servipagos, Pago Servicios o ventanilla
                            del banco
                          </p>
                        </div>
                      </div>
                      <div className={styles.depositStep}>
                        <div className={styles.depositIcon}>
                          <ReceiptText size={20} />
                        </div>
                        <div>
                          <h4>Indica los datos de cuenta</h4>
                          <p>
                            Cuenta:{" "}
                            {SITE_CONFIG.payments.bank.pichincha.accountNumber}
                          </p>
                        </div>
                      </div>
                      <div className={styles.depositStep}>
                        <div className={styles.depositIcon}>
                          <Banknote size={20} />
                        </div>
                        <div>
                          <h4>Entrega el efectivo</h4>
                          <p>Indica el monto exacto a depositar</p>
                        </div>
                      </div>
                      <div className={styles.depositStep}>
                        <div className={styles.depositIcon}>
                          <CheckCircle size={20} />
                        </div>
                        <div>
                          <h4>Recibe tu comprobante</h4>
                          <p>Toma foto legible del voucher</p>
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoBox}>
                      <Info size={18} />
                      <p>
                        El depósito tarda entre 1-4 horas laborables en
                        confirmarse.
                      </p>
                    </div>
                  </div>
                )}

                <div className={styles.actionSection}>
                  <Link
                    href={`/checkout?method=${selectedMethod}`}
                    className={styles.primaryAction}
                  >
                    <Send size={18} />
                    Proceder al Pago
                  </Link>
                  <p className={styles.actionNote}>
                    Serás redirigido para completar el pago y subir tu
                    comprobante.
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <section className={styles.faqSection}>
        <h2>Preguntas Frecuentes</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h3>¿Cuánto tarda en confirmarse mi pago?</h3>
            <p>
              Dependiendo del método: USDT y Binance Pay son instantáneos;
              transferencias y depósitos tardan 1-4 horas laborables; PayPal
              hasta 24 horas.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>¿Mi pago es seguro?</h3>
            <p>
              Sí. Trabajamos con pasarelas reconocidas y todos los datos
              financieros están encriptados. Nunca almacenamos información de
              tus tarjetas.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>¿Qué pasa si envío por la red equivocada?</h3>
            <p>
              Si envías USDT por una red diferente a TRC20, los fondos se
              perderán. Te recomendamos verificar siempre la red antes de
              enviar.
            </p>
          </div>
          <div className={styles.faqItem}>
            <h3>¿Puedo cambiar de método de pago?</h3>
            <p>
              Sí. Contáctanos por WhatsApp antes de confirmar y te ayudamos a
              cambiar el método si tu pago aún no ha sido procesado.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
