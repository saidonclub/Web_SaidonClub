'use client';

import React, { useState } from 'react';
import { XCircle, Loader2 } from 'lucide-react';
import { cancelOrderAction } from '../actions';
import styles from './OrderDetail.module.css';

interface OrderActionsProps {
  orderId: string;
  status: string;
}

export default function OrderActions({ orderId, status }: OrderActionsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status !== 'PENDING') return null;

  const handleCancel = async () => {
    if (!confirm('¿Estás seguro de que deseas cancelar este pedido? Esta acción no se puede deshacer.')) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await cancelOrderAction(orderId);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Revalidation is handled by the server action
      setLoading(false);
    }
  };

  return (
    <div className={styles.actionsContainer}>
      {error && <div className={styles.errorMsg}>{error}</div>}
      <button 
        onClick={handleCancel} 
        className={styles.cancelBtn}
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={18} className={styles.spin} />
        ) : (
          <XCircle size={18} />
        )}
        Cancelar Pedido
      </button>
    </div>
  );
}
