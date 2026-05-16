import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, ChevronRight, Clock, CheckCircle2, XCircle, Package } from 'lucide-react'
import { getUserOrders } from '@/lib/data/dashboard'
import { ExportButton } from '@/components/shared/ExportButton'
import styles from './Pedidos.module.css'

export default async function PedidosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const orders = await getUserOrders(user.id)

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
          <ShoppingBag size={24} color="var(--clr-orange)" />
          <h1>Mis Pedidos</h1>
          {orders.length > 0 && (
            <ExportButton 
              data={orders} 
              filename="Mis_Pedidos_SaidonClub" 
              sheetName="Pedidos"
              label="Descargar Historial"
              className={styles.exportHeader}
            />
          )}
        </div>
        <p className={styles.subtitle}>Gestiona tus compras y rastrea tus envíos.</p>
      </div>

      <div className={styles.content}>
        {orders.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Pedido ID</th>
                  <th>Fecha</th>
                  <th>Productos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className={styles.orderId}>
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className={styles.date}>
                      {new Date(order.createdAt).toLocaleDateString('es-ES')}
                    </td>
                    <td className={styles.itemsCount}>
                      {order._count.items} artículos
                    </td>
                    <td className={styles.amount}>
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td>
                      <Link href={`/dashboard/pedidos/${order.id}`} className={styles.detailBtn}>
                        Detalles
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Package size={64} color="var(--clr-border-glass)" />
            <h3>No tienes pedidos todavía</h3>
            <p>¡Explora el marketplace y comienza tu primera compra!</p>
            <Link href="/productos" className={styles.browseBtn}>
              Ir al Marketplace
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
