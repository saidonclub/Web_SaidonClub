'use client'

import React, { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import { checkout } from './actions'
import styles from './Carrito.module.css'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useToast } from '@/components/shared/Toast'

export default function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { refreshCart } = useCart()
  const toast = useToast()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const result = await checkout()
      if (result.success) {
        refreshCart()
        router.push(`/dashboard/pedidos/${result.orderId}`)
      } else {
        toast.error('Error en el pedido', result.error || 'No se pudo procesar el pedido.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Error de conexión', 'Intenta nuevamente en unos segundos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button 
      className={styles.checkoutBtn} 
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? (
        <>
          Procesando...
          <Loader2 size={18} className="animate-spin" style={{ marginLeft: '8px' }} />
        </>
      ) : (
        <>
          Proceder al Pago
          <ArrowRight size={18} style={{ marginLeft: '8px' }} />
        </>
      )}
    </button>
  )
}
