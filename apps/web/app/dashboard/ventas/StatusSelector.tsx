'use client'

import React, { useState } from 'react'
import { updateStatus } from './actions'
import styles from './Ventas.module.css'
import { useToast } from '@/components/shared/Toast'

interface StatusSelectorProps {
  orderId: string
  currentStatus: string
}

export default function StatusSelector({ orderId, currentStatus }: StatusSelectorProps) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED"
    if (newStatus === currentStatus) return

    setLoading(true)
    const result = await updateStatus(orderId, newStatus)
    if (!result.success) {
      toast.error('Error al actualizar', result.error || 'No se pudo cambiar el estado.')
    } else {
      toast.success('Estado actualizado', `Pedido #${orderId.slice(0,8)} marcado como ${newStatus}.`)
    }
    setLoading(false)
  }

  return (
    <select 
      className={styles.actionBtn} 
      value={currentStatus} 
      onChange={handleChange}
      disabled={loading}
    >
      <option value="PENDING">Pendiente</option>
      <option value="PROCESSING">En Proceso</option>
      <option value="SHIPPED">Enviado</option>
      <option value="DELIVERED">Entregado</option>
      <option value="CANCELLED">Cancelado</option>
    </select>
  )
}
