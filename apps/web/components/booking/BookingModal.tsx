// ============================================================
// COMPONENT: BookingModal
// PURPOSE: Multi-step appointment booking flow
// DESIGN: Obsidian & Safety Orange — fully theme-aware
// ============================================================

"use client";

import { useState } from "react";
import { X, Calendar, Clock, User, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { createAppointment } from "@/lib/actions/appointment";
import { Prisma } from "@saidonclub/database";
import styles from "./BookingModal.module.css";

interface Service {
  id: string;
  name: string;
  description: string;
  pricePVP: number | string | Prisma.Decimal;
  priceSaidon: number | string | Prisma.Decimal;
}

interface Provider {
  id: string;
  name: string;
  avatar: string | null;
  providerProfile: {
    companyName: string;
    whatsappPhone: string | null;
  } | null;
}

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
}

interface BookingModalProps {
  service: Service;
  provider: Provider;
  isOpen: boolean;
  onClose: () => void;
  beneficiaries?: Beneficiary[];
}

type Step = "select" | "details" | "confirm";

const TIME_SLOTS = [
  { value: "09:00", label: "09:00 – 10:00" },
  { value: "10:00", label: "10:00 – 11:00" },
  { value: "11:00", label: "11:00 – 12:00" },
  { value: "14:00", label: "14:00 – 15:00" },
  { value: "15:00", label: "15:00 – 16:00" },
  { value: "16:00", label: "16:00 – 17:00" },
  { value: "17:00", label: "17:00 – 18:00" },
];

const STEP_ORDER: Step[] = ["select", "details"];

function getStepIndex(step: Step): number {
  return STEP_ORDER.indexOf(step);
}

export default function BookingModal({
  service,
  provider,
  isOpen,
  onClose,
  beneficiaries = [],
}: BookingModalProps) {
  const [step, setStep] = useState<Step>("select");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(null);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!preferredDate || !preferredTime) {
      setError("Por favor selecciona fecha y horario preferidos.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createAppointment({
        providerId: provider.id,
        serviceId: service.id,
        beneficiaryId: selectedBeneficiary || undefined,
        requestedDate: preferredDate,
        requestedTimeSlot: preferredTime,
        clientNotes: notes,
      });
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al crear la solicitud. Intenta de nuevo.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state on close
    setStep("select");
    setSelectedBeneficiary(null);
    setPreferredDate("");
    setPreferredTime("");
    setNotes("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  // ── Success Screen ────────────────────────────────────────────
  if (success) {
    return (
      <div className={styles.overlay}>
        <div className={styles.successModal}>
          <div className={styles.successIcon}>
            <CheckCircle size={32} />
          </div>
          <h3 className={styles.successTitle}>¡Solicitud Enviada!</h3>
          <p className={styles.successDesc}>
            Tu solicitud de cita ha sido enviada a{" "}
            <strong>{provider.providerProfile?.companyName || provider.name}</strong>.
            Te notificaremos cuando confirmen tu cita.
          </p>
          <button className={styles.btnClose} onClick={handleClose}>
            Entendido
          </button>
        </div>
      </div>
    );
  }

  const currentStepIndex = getStepIndex(step);

  // ── Main Modal ────────────────────────────────────────────────
  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>Solicitar Cita</h3>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Step progress dots */}
          <div className={styles.stepIndicator}>
            {STEP_ORDER.map((s, i) => (
              <div
                key={s}
                className={`${styles.stepDot} ${
                  i === currentStepIndex ? styles.stepDotActive : ""
                } ${i < currentStepIndex ? styles.stepDotDone : ""}`}
              />
            ))}
          </div>

          {/* Service summary */}
          <div className={styles.serviceBox}>
            <p className={styles.serviceName}>{service.name}</p>
            <p className={styles.servicePrice}>
              ${Number(service.priceSaidon).toFixed(2)}
              <span className={styles.servicePriceLabel}>precio miembro</span>
            </p>
          </div>

          {/* ── STEP 1: Seleccionar beneficiario ────────────────── */}
          {step === "select" && (
            <div>
              <p className={styles.stepLabel}>¿Para quién es la cita?</p>

              {beneficiaries.length === 0 ? (
                <div className={styles.noFamilyNotice}>
                  La cita será para ti como titular. Puedes agregar beneficiarios
                  familiares desde tu panel de perfil.
                </div>
              ) : (
                <div className={styles.beneficiaryList}>
                  {/* Opción: Para mí */}
                  <button
                    className={`${styles.beneficiaryOption} ${
                      selectedBeneficiary === null ? styles.active : ""
                    }`}
                    onClick={() => setSelectedBeneficiary(null)}
                  >
                    <div className={styles.beneficiaryIcon}>
                      <User size={18} />
                    </div>
                    <div>
                      <p className={styles.beneficiaryName}>Para mí</p>
                      <p className={styles.beneficiaryRelation}>Titular de la membresía</p>
                    </div>
                  </button>

                  {/* Beneficiarios familiares */}
                  {beneficiaries.map((b) => (
                    <button
                      key={b.id}
                      className={`${styles.beneficiaryOption} ${
                        selectedBeneficiary === b.id ? styles.active : ""
                      }`}
                      onClick={() => setSelectedBeneficiary(b.id)}
                    >
                      <div className={styles.beneficiaryIcon}>
                        <User size={18} />
                      </div>
                      <div>
                        <p className={styles.beneficiaryName}>{b.name}</p>
                        <p className={styles.beneficiaryRelation}>{b.relationship}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className={styles.actions}>
                <button
                  className={styles.btnPrimary}
                  onClick={() => setStep("details")}
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 2: Fecha, hora y notas ─────────────────────── */}
          {step === "details" && (
            <div className={styles.fieldGroup}>
              {/* Fecha preferida */}
              <div>
                <label className={styles.fieldLabel}>
                  <Calendar size={14} /> Fecha preferida
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className={styles.fieldInput}
                />
              </div>

              {/* Horario preferido */}
              <div>
                <label className={styles.fieldLabel}>
                  <Clock size={14} /> Horario preferido
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className={styles.fieldSelect}
                >
                  <option value="">Selecciona un horario</option>
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notas adicionales */}
              <div>
                <label className={styles.fieldLabel}>
                  <MessageSquare size={14} /> Notas adicionales
                  <span style={{ color: "var(--clr-text-muted)", fontWeight: 500, textTransform: "none", letterSpacing: 0 }}>
                    {" "}(opcional)
                  </span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe síntomas, condiciones especiales o cualquier detalle relevante para el proveedor..."
                  className={styles.fieldTextarea}
                  rows={3}
                />
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <div className={styles.actions}>
                <button
                  className={styles.btnSecondary}
                  onClick={() => setStep("select")}
                >
                  ← Atrás
                </button>
                <button
                  className={styles.btnPrimary}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className={styles.spinner} />
                      Enviando...
                    </>
                  ) : (
                    "Confirmar Solicitud"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
