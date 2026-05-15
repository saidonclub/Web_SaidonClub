import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { getOrderDetails } from '@/lib/data';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CreditCard, 
  Calendar, 
  MapPin, 
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import styles from './OrderDetail.module.css';
import OrderActions from './OrderActions';


interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const order = await getOrderDetails(id, user.id);

  if (!order) {
    notFound();
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock size={20} className={styles.pending} />;
      case 'SHIPPED': return <Truck size={20} className={styles.shipped} />;
      case 'DELIVERED': return <CheckCircle2 size={20} className={styles.delivered} />;
      case 'CANCELLED': return <XCircle size={20} className={styles.cancelled} />;
      default: return <Package size={20} />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'PROCESSING': 'En Proceso',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado',
      'REFUNDED': 'Reembolsado'
    };
    return labels[status] || status;
  };

  return (
    <div className={styles.container}>
      <Link href="/dashboard/pedidos" className={styles.backBtn}>
        <ChevronLeft size={16} />
        Volver a mis pedidos
      </Link>

      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <span className={styles.orderNumber}>Pedido #{order.id.slice(0, 8).toUpperCase()}</span>
          <h1>Detalles del Pedido</h1>
          <div className={styles.date}>
            <Calendar size={14} />
            Realizado el {new Date(order.createdAt).toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        <div className={styles.statusWrapper}>
          <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
            {getStatusIcon(order.status)}
            {getStatusLabel(order.status)}
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainContent}>
          <div className={styles.card}>
            <h2>
              <ShoppingBag size={20} color="var(--clr-orange)" />
              Artículos del Pedido
            </h2>
            <div className={styles.itemsList}>
              {order.items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.product?.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.product.images[0]} alt={item.product.name} />
                    ) : (
                      <Package size={32} color="var(--clr-border-glass)" />
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.product?.name || 'Producto no disponible'}</div>
                    <div className={styles.itemMeta}>
                      {item.isGift && <span className={styles.giftBadge}>Regalo</span>}
                    </div>
                  </div>
                  <div className={styles.itemPrice}>
                    <span className={styles.price}>${Number(item.totalPrice).toFixed(2)}</span>
                    <span className={styles.qty}>Cant: {item.quantity} x ${Number(item.unitPrice).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={`${styles.card} ${styles.summaryCard}`}>
            <h2>
              <CreditCard size={20} color="var(--clr-orange)" />
              Resumen de Pago
            </h2>
            <div className={styles.summary}>
              <div className={styles.summaryLine}>
                <span>Subtotal</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
              {Number(order.pointsUsed) > 0 && (
                <div className={styles.summaryLine}>
                  <span>Puntos Usados</span>
                  <span className={styles.negative}>-{Number(order.pointsUsed).toFixed(2)}</span>
                </div>
              )}
              <div className={styles.summaryLine}>
                <span>Envío</span>
                <span className={styles.free}>Gratis</span>
              </div>
              <div className={`${styles.summaryLine} ${styles.total}`}>
                <span>Total</span>
                <span>${Number(order.totalAmount).toFixed(2)}</span>
              </div>
              
              <div className={styles.pointsEarned}>
                <CheckCircle2 size={16} />
                Has ganado {Number(order.pointsEarned)} puntos Saidon
              </div>

              <OrderActions orderId={order.id} status={order.status} />
            </div>
          </div>

          <div className={styles.card}>
            <h2>
              <MapPin size={20} color="var(--clr-orange)" />
              Información de Envío
            </h2>
            <div className={styles.shippingInfo}>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Cliente</span>
                <span className={styles.infoValue}>{order.user.name || order.user.email}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Método de Pago</span>
                <span className={styles.infoValue}>{order.paymentMethod}</span>
              </div>
              <div className={styles.infoGroup}>
                <span className={styles.infoLabel}>Estado del Pago</span>
                <span className={styles.infoValue}>{order.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
