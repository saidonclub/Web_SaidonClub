'use client'

import React, { useState } from 'react'
import { ArrowLeft, Send, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import PinVerification from '@/components/security/PinVerification'
import { requestTransferPin, executeTransfer } from './actions'
import styles from './Transfer.module.css'
import { useToast } from '@/components/shared/Toast'

export default function TransferPage({ userEmail }: { userEmail: string }) {
  const toast = useToast()
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await requestTransferPin()
      if (result.success) {
        setShowVerification(true)
      } else {
        toast.error('Error al procesar', result.message || 'No se pudo iniciar la transferencia.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (pin: string) => {
    const result = await executeTransfer(userEmail, pin, parseFloat(amount), destination)
    if (result.success) {
      setSuccess(true)
      setShowVerification(false)
    }
    return result
  }

  if (success) {
    return (
      <div className={styles.successContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <Send size={40} />
          </div>
          <h2 className={styles.successTitle}>¡Transferencia Exitosa!</h2>
          <p className={styles.successText}>
            Has enviado <strong>${amount}</strong> a <strong>{destination}</strong> de forma segura.
          </p>
          <Link href="/dashboard" className={styles.successBtn}>
            Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Link href="/dashboard" className={styles.backLink}>
          <ArrowLeft size={16} />
          Volver al Dashboard
        </Link>

        <h1 className={styles.title}>Transferir Fondos</h1>
        <p className={styles.subtitle}>Envía dinero a otros miembros de SaidonClub de forma instantánea.</p>

        {!showVerification ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>
                DESTINATARIO (USUARIO O EMAIL)
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                placeholder="ej. gatita@saidonclub.com"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                MONTO A ENVIAR (USD)
              </label>
              <div className={styles.amountWrapper}>
                <span className={styles.currency}>$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  className={`${styles.input} ${styles.amountInput}`}
                />
              </div>
            </div>

            <div className={styles.alert}>
              <AlertTriangle size={24} color="var(--clr-orange)" style={{ flexShrink: 0 }} />
              <p className={styles.alertText}>
                <strong className={styles.alertStrong}>Seguridad Requerida:</strong> Al hacer clic en continuar, se enviará un PIN de verificación a tu correo para autorizar esta transacción.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? 'Preparando...' : 'Continuar con Verificación'}
              <Send size={18} />
            </button>
          </form>
        ) : (
          <PinVerification
            email={userEmail}
            type="TRANSACTION"
            onVerify={handleVerify}
            onSuccess={() => setSuccess(true)}
            onResend={async () => { await requestTransferPin() }}
          />
        )}
      </div>
    </div>
  )
}
