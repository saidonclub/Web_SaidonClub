import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ShoppingCart, Clock, CheckCircle2, XCircle, Package } from 'lucide-react'
import { getProviderSalesItems } from '@/lib/data/dashboard'
import styles from './Ventas.module.css'
import StatusSelector from './StatusSelector'

export default async function VentasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const salesItems = await getProviderSalesItems(user.id)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={16} className={styles.pending} />
      case 'DELIVERED': return <CheckCircle2 size={16} className={styles.delivered} />
      case 'CANCELLED': return <XCircle size={16} className={styles.cancelled} />
      default: return <Package size={16} className={styles.processing} />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'PROCESSING': 'En Proceso',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado',
      'REFUNDED': 'Reembolsado'
    }
    return labels[status] || status
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <ShoppingCart size={24} color="var(--clr-orange)" />
          <h1>Gestión de Ventas y Servicios</h1>
        </div>
        <p className={styles.subtitle}>Administra los pedidos de tus productos y servicios contratados.</p>
      </div>

      <div className={styles.content}>
        {salesItems.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Item / Servicio</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {salesItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>
                          {item.product?.name || item.service?.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.clientName}>{item.order.user.name || 'Cliente'}</span>
                      <span className={styles.clientEmail}>{item.order.user.email}</span>
                    </td>
                    <td className={styles.date}>
                      {new Date(item.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td>{item.quantity}</td>
                    <td className={styles.amount}>
                      ${Number(item.totalPrice).toFixed(2)}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[item.order.status.toLowerCase()]}`}>
                        {getStatusIcon(item.order.status)}
                        {getStatusLabel(item.order.status)}
                      </span>
                    </td>
                    <td>
                      <StatusSelector orderId={item.orderId} currentStatus={item.order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Package size={64} color="var(--clr-border-glass)" />
            <h3>Aún no tienes ventas</h3>
            <p>Tus productos y servicios aparecerán aquí cuando los clientes realicen pedidos.</p>
          </div>
        )}
      </div>
    </div>
  )
}
