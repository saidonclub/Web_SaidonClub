/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================
// COMPONENT: Booking Modal
// PURPOSE: Multi-step booking flow for scheduling appointments
// ============================================================

"use client";

import { useState } from "react";
import { X, Calendar, Clock, User, MessageSquare, Loader2 } from "lucide-react";
import { createAppointment } from "@/lib/actions/appointment";

interface Service {
  id: string;
  name: string;
  description: string;
  pricePVP: any;
  priceSaidon: any;
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

interface BookingModalProps {
  service: Service;
  provider: Provider;
  isOpen: boolean;
  onClose: () => void;
  beneficiaries?: Array<{ id: string; name: string; relationship: string }>;
}

export default function BookingModal({
  service,
  provider,
  isOpen,
  onClose,
  beneficiaries = [],
}: BookingModalProps) {
  const [step, setStep] = useState<"select" | "details" | "confirm">("select");
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<string | null>(
    null,
  );
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!preferredDate || !preferredTime) {
      setError("Por favor selecciona fecha y horario");
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
    } catch (err: any) {
      setError(err.message || "Error al crear la solicitud. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-in">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
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
          <h3 className="text-xl font-semibold mb-2">Solicitud Enviada</h3>
          <p className="text-gray-600 mb-4">
            Tu solicitud de cita ha sido enviada al proveedor. Te notificaremos
            cuando responda.
          </p>
          <button
            onClick={onClose}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Solicitar Cita</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="font-medium text-sm">{service.name}</p>
            <p className="text-primary font-semibold">
              ${Number(service.priceSaidon).toFixed(2)}{" "}
              <span className="text-xs text-gray-500">precio miembro</span>
            </p>
          </div>

          {step === "select" && beneficiaries.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                ¿Para quién es la cita?
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedBeneficiary(null)}
                  className={`w-full p-3 rounded-lg border text-left ${
                    selectedBeneficiary === null
                      ? "border-primary bg-primary/5"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium">Para mí</p>
                      <p className="text-xs text-gray-500">
                        Titular de la membresía
                      </p>
                    </div>
                  </div>
                </button>
                {beneficiaries.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBeneficiary(b.id)}
                    className={`w-full p-3 rounded-lg border text-left ${
                      selectedBeneficiary === b.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <User size={20} className="text-gray-400" />
                      <div>
                        <p className="font-medium">{b.name}</p>
                        <p className="text-xs text-gray-500">
                          {b.relationship}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep("details")}
                disabled={!selectedBeneficiary && beneficiaries.length > 0}
                className="w-full mt-4 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Continuar
              </button>
            </div>
          )}

          {step === "select" && beneficiaries.length === 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-4">
                La cita será para ti (titular).
              </p>
              <button
                onClick={() => setStep("details")}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Calendar size={16} className="inline mr-1" /> Fecha preferida
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <Clock size={16} className="inline mr-1" /> Horario preferido
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Selecciona un horario</option>
                  <option value="09:00">09:00 - 10:00</option>
                  <option value="10:00">10:00 - 11:00</option>
                  <option value="11:00">11:00 - 12:00</option>
                  <option value="14:00">14:00 - 15:00</option>
                  <option value="15:00">15:00 - 16:00</option>
                  <option value="16:00">16:00 - 17:00</option>
                  <option value="17:00">17:00 - 18:00</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  <MessageSquare size={16} className="inline mr-1" /> Notas
                  adicionales (opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Detalles adicionales para el proveedor..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("select")}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
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

