'use client'

import React, { useState } from 'react'
import { ArrowLeft, Wallet, AlertTriangle, CheckCircle, Clock, XCircle, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import PinVerification from '@/components/security/PinVerification'
import { requestWithdrawalPin, executeWithdrawal } from './actions'
import styles from './Withdraw.module.css'
import { useToast } from '@/components/shared/Toast'

interface WalletData {
  available: number
  pending: number
  total: number
}

interface WithdrawalRecord {
  id: string
  amount: number
  status: string
  description: string
  createdAt: string
  metadata: Record<string, string> | null
}

interface Props {
  userEmail: string
  wallet?: WalletData
  history?: WithdrawalRecord[]
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:   { label: 'Pendiente',  color: '#f59e0b', icon: <Clock size={14} /> },
  VALIDATED: { label: 'Aprobado',   color: '#22c55e', icon: <CheckCircle size={14} /> },
  REJECTED:  { label: 'Rechazado',  color: '#ef4444', icon: <XCircle size={14} /> },
  COMPLETED: { label: 'Completado', color: '#22c55e', icon: <CheckCircle size={14} /> },
}

const METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER: '🏦 Transferencia Bancaria',
  USDT_TRC20:    '💎 USDT (TRC20)',
  PAYPAL:        '🅿️ PayPal',
  BINANCE_PAY:   '🟡 Binance Pay',
}

export default function WithdrawPage({ userEmail, wallet, history = [] }: Props) {
  const toast = useToast()
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('BANK_TRANSFER')
  const [details, setDetails] = useState('')
  const [showVerification, setShowVerification] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (wallet && numAmount > wallet.available) {
      toast.error('Fondos insuficientes', `Tu saldo disponible es $${wallet.available.toFixed(2)}`)
      return
    }
    setLoading(true)
    try {
      const result = await requestWithdrawalPin()
      if (result.success) {
        setShowVerification(true)
      } else {
        toast.error('Error al procesar', result.message || 'No se pudo iniciar la solicitud de retiro.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (pin: string) => {
    const result = await executeWithdrawal(userEmail, pin, parseFloat(amount), method, details)
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
          <div className={styles.successIcon}><CheckCircle size={40} /></div>
          <h2 className={styles.successTitle}>Solicitud Enviada</h2>
          <p className={styles.successText}>
            Tu solicitud de retiro por <strong>${amount}</strong> está siendo procesada.
            Recibirás una notificación cuando sea aprobada (24-48 horas hábiles).
          </p>
          <Link href="/dashboard" className={styles.successBtn}>Volver al Inicio</Link>
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

        <h1 className={styles.title}>Retirar Fondos</h1>
        <p className={styles.subtitle}>Retira tus ganancias de forma segura a tu cuenta bancaria o wallet.</p>

        {/* Balance Cards */}
        {wallet && (
          <div className={styles.balanceGrid}>
            <div className={styles.balanceCard}>
              <span className={styles.balanceLabel}>Disponible</span>
              <span className={styles.balanceValue} style={{ color: '#22c55e' }}>
                ${wallet.available.toFixed(2)}
              </span>
            </div>
            <div className={styles.balanceCard}>
              <span className={styles.balanceLabel}>En Proceso</span>
              <span className={styles.balanceValue} style={{ color: '#f59e0b' }}>
                ${wallet.pending.toFixed(2)}
              </span>
            </div>
            <div className={styles.balanceCard}>
              <span className={styles.balanceLabel}>Total Ganado</span>
              <span className={styles.balanceValue} style={{ color: 'var(--clr-orange, #f97316)' }}>
                ${wallet.total.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {!showVerification ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>MÉTODO DE RETIRO</label>
              <select
                className={`${styles.input} ${styles.select}`}
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                required
              >
                <option value="BANK_TRANSFER">🏦 Transferencia Bancaria (Ecuador)</option>
                <option value="USDT_TRC20">💎 USDT (TRC20)</option>
                <option value="PAYPAL">🅿️ PayPal</option>
                <option value="BINANCE_PAY">🟡 Binance Pay</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                {method === 'BANK_TRANSFER' ? 'DATOS BANCARIOS' : 'DIRECCIÓN O EMAIL'}
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                placeholder={
                  method === 'BANK_TRANSFER'
                    ? 'Banco, Tipo de cuenta, Nro de cuenta, Nombre del titular'
                    : 'Introduce tu dirección de wallet o email de PayPal'
                }
                className={styles.input}
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>MONTO A RETIRAR (USD)</label>
              <div className={styles.amountWrapper}>
                <span className={styles.currency}>$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="0.00"
                  step="0.01"
                  min="10"
                  max={wallet?.available ?? undefined}
                  className={`${styles.input} ${styles.amountInput}`}
                />
              </div>
              {wallet && (
                <div className={styles.fieldHint}>
                  Mínimo: $10 · Máximo disponible: ${wallet.available.toFixed(2)} · Límite diario: $1,000
                </div>
              )}
            </div>

            <div className={styles.alert}>
              <AlertTriangle size={24} color="var(--clr-orange)" style={{ flexShrink: 0 }} />
              <p className={styles.alertText}>
                <strong className={styles.alertStrong}>Aviso de Seguridad:</strong> El proceso de retiro puede tardar entre 24 a 48 horas laborales. Se enviará un PIN a tu correo para autorizar esta solicitud.
              </p>
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Procesando...' : 'Solicitar Retiro'}
              <Wallet size={18} />
            </button>
          </form>
        ) : (
          <PinVerification
            email={userEmail}
            type="WITHDRAWAL"
            onVerify={handleVerify}
            onSuccess={() => setSuccess(true)}
            onResend={async () => { await requestWithdrawalPin() }}
          />
        )}

        {/* Withdrawal History */}
        {history.length > 0 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <TrendingDown size={18} color="var(--clr-orange, #f97316)" />
              <h3 className={styles.historyTitle}>Historial de Retiros</h3>
            </div>
            <div className={styles.historyList}>
              {history.map((tx) => {
                const statusCfg = STATUS_CONFIG[tx.status] ?? STATUS_CONFIG.PENDING
                const methodKey = tx.metadata?.method ?? 'BANK_TRANSFER'
                return (
                  <div key={tx.id} className={styles.historyItem}>
                    <div className={styles.historyLeft}>
                      <div className={styles.historyMethod}>
                        {METHOD_LABELS[methodKey] ?? methodKey}
                      </div>
                      <div className={styles.historyDate}>
                        {new Date(tx.createdAt).toLocaleDateString('es-EC', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </div>
                    </div>
                    <div className={styles.historyRight}>
                      <span className={styles.historyAmount}>-${tx.amount.toFixed(2)}</span>
                      <span
                        className={styles.historyStatus}
                        style={{ color: statusCfg.color, borderColor: `${statusCfg.color}30`, background: `${statusCfg.color}10` }}
                      >
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
