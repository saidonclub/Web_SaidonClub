'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  XCircle, 
  Loader2, 
  AlertTriangle, 
  CheckCircle, 
  Play, 
  Flag
} from 'lucide-react';
import { 
  cancelAppointment, 
  confirmAppointment, 
  startAppointment, 
  completeAppointment 
} from '@/lib/actions/appointment';
import styles from './CitaDetalle.module.css';

interface CitaActionsProps {
  appointmentId: string;
  status: string;
  isProvider: boolean;
}

export default function CitaActions({ appointmentId, status, isProvider }: CitaActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [reason, setReason] = useState('');
  const [providerNotes, setProviderNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const canCancel = ['PENDING_PROVIDER', 'CONFIRMADA', 'SOLICITADA', 'POR_ATENDER'].includes(status);
  const canConfirm = isProvider && ['PENDING_PROVIDER', 'SOLICITADA'].includes(status);
  const canStart = isProvider && ['CONFIRMADA', 'POR_ATENDER'].includes(status);
  const canComplete = isProvider && ['IN_PROGRESS'].includes(status);

   const handleAction = async (actionFn: (id: string) => Promise<unknown>) => {
    setIsLoading(true);
    setError(null);
    try {
      await actionFn(appointmentId);
      router.refresh();
     } catch (err: unknown) {
       setError(err instanceof Error ? err.message : 'Error al procesar la acción');
     }
  };

  const handleCancelSubmit = async () => {
    if (!reason.trim()) {
      setError('Por favor, indica un motivo para la cancelación.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await cancelAppointment(appointmentId, reason);
      setShowCancelModal(false);
      router.refresh();
     } catch (err: unknown) {
       setError(err instanceof Error ? err.message : 'Error al cancelar la cita');
     }
  };

  const handleCompleteSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await completeAppointment(appointmentId, providerNotes);
      setShowCompleteModal(false);
      router.refresh();
     } catch (err: unknown) {
       setError(err instanceof Error ? err.message : 'Error al completar la cita');
     }
  };

  if (!canCancel && !canConfirm && !canStart && !canComplete) return null;

  return (
    <div className={styles.actionsContainer} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {error && <div className={styles.errorMsg}>{error}</div>}

      {canConfirm && (
        <button 
          onClick={() => handleAction(confirmAppointment)}
          disabled={isLoading}
          className={styles.confirmBtn}
          style={{ background: 'var(--clr-success)', marginBottom: '0' }}
        >
          {isLoading ? <Loader2 size={18} className={styles.spin} /> : <CheckCircle size={18} />}
          Confirmar Cita
        </button>
      )}

      {canStart && (
        <button 
          onClick={() => handleAction(startAppointment)}
          disabled={isLoading}
          className={styles.confirmBtn}
          style={{ background: 'var(--clr-primary)', marginBottom: '0' }}
        >
          {isLoading ? <Loader2 size={18} className={styles.spin} /> : <Play size={18} />}
          Iniciar Atención
        </button>
      )}

      {canComplete && (
        <button 
          onClick={() => setShowCompleteModal(true)}
          disabled={isLoading}
          className={styles.confirmBtn}
          style={{ background: 'var(--clr-info)', marginBottom: '0' }}
        >
          {isLoading ? <Loader2 size={18} className={styles.spin} /> : <Flag size={18} />}
          Finalizar Atención
        </button>
      )}

      {canCancel && (
        <button 
          onClick={() => setShowCancelModal(true)}
          disabled={isLoading}
          className={styles.cancelBtn}
        >
          <XCircle size={18} />
          Cancelar Cita
        </button>
      )}
      
      <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
        * Acciones disponibles según el estado actual y tu rol.
      </p>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              <AlertTriangle color="var(--clr-error)" />
              Cancelar Cita
            </h3>
            <p className={styles.modalText}>
              ¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.
            </p>
            <textarea
              className={styles.reasonArea}
              placeholder="Indica el motivo de la cancelación..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
            />
            <div className={styles.modalActions}>
              <button className={styles.closeBtn} onClick={() => setShowCancelModal(false)} disabled={isLoading}>Cerrar</button>
              <button className={styles.confirmBtn} onClick={handleCancelSubmit} disabled={isLoading}>
                {isLoading ? <Loader2 size={18} className={styles.spin} /> : 'Confirmar Cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>
              <CheckCircle color="var(--clr-info)" />
              Finalizar Atención
            </h3>
            <p className={styles.modalText}>
              ¿Deseas agregar algunas notas finales sobre la atención brindada?
            </p>
            <textarea
              className={styles.reasonArea}
              placeholder="Notas médicas, recomendaciones, etc..."
              value={providerNotes}
              onChange={(e) => setProviderNotes(e.target.value)}
              disabled={isLoading}
            />
            <div className={styles.modalActions}>
              <button className={styles.closeBtn} onClick={() => setShowCompleteModal(false)} disabled={isLoading}>Cerrar</button>
              <button className={styles.confirmBtn} onClick={handleCompleteSubmit} disabled={isLoading} style={{ background: 'var(--clr-info)' }}>
                {isLoading ? <Loader2 size={18} className={styles.spin} /> : 'Finalizar y Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
