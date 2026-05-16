// ============================================================
// MODULE:     app/admin/orders/page
// PURPOSE:    Historial completo de compras (Pedidos)
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ShoppingBag, Clock, CheckCircle, XCircle, Search, Filter, X, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './orders.module.css';
import { Prisma, OrderStatus } from '@saidonclub/database';
import { ExportButton } from '@/components/shared/ExportButton';

export const dynamic = "force-dynamic";

async function OrdersContent({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  // Usamos una lógica similar a la de retiros o productos para permisos
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'ACCOUNTANT') {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const query = params.q || '';
  const statusFilter = params.status || '';

   // Construir filtros de Prisma
   const where: Prisma.OrderWhereInput = {};

  if (statusFilter) {
     where.status = statusFilter as OrderStatus;
  }

  if (query) {
    where.OR = [
      { id: { contains: query, mode: 'insensitive' } },
      { affiliateCode: { contains: query, mode: 'insensitive' } },
      {
        user: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { name: { contains: query, mode: 'insensitive' } },
            { username: { contains: query, mode: 'insensitive' } },
          ],
        },
      },
    ];
  }

  const [orders, stats] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: { select: { email: true, name: true, username: true } },
        items: {
          include: {
            product: { select: { name: true } },
            service: { select: { name: true } },
          }
        }
      },
    }),
    Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      })
    ]),
  ]);

  const [total, pending, delivered, cancelled, revenue] = stats;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <div>
            <h1 className={styles.title}>Historial de Pedidos</h1>
            <p className={styles.subtitle}>
              Listado completo de compras de productos y servicios en el sistema
            </p>
          </div>
          {orders.length > 0 && (
            <ExportButton 
              data={orders.map(o => ({
                ID: o.id,
                Usuario: o.user.name || o.user.username,
                Email: o.user.email,
                Monto: Number(o.totalAmount),
                Estado: o.status,
                Metodo: o.paymentMethod,
                Fecha: o.createdAt.toISOString(),
                Items: o.items.map(i => (i.product?.name || i.service?.name) + ` (${i.quantity})`).join(', ')
              }))} 
              filename="Pedidos_SaidonClub" 
              sheetName="Pedidos"
              label="Exportar Pedidos"
            />
          )}
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total Pedidos"
          value={total}
          icon={<ShoppingBag size={20} />}
          color="blue"
        />
        <StatCard
          title="Pendientes"
          value={pending}
          icon={<Clock size={20} />}
          color="yellow"
        />
        <StatCard
          title="Entregados"
          value={delivered}
          icon={<CheckCircle size={20} />}
          color="green"
        />
        <StatCard
          title="Ventas Totales"
          value={`$${Number(revenue._sum.totalAmount || 0).toLocaleString()}`}
          icon={<CreditCard size={20} />}
          color="purple"
        />
      </section>

      {/* Filtros */}
      <section className={styles.filterSection}>
        <form className={styles.filterForm}>
          <div className={styles.searchGroup}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              name="q"
              placeholder="Buscar por email, nombre o ID..."
              defaultValue={query}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.selectGroup}>
            <Filter className={styles.filterIcon} size={18} />
            <select
              name="status"
              defaultValue={statusFilter}
              className={styles.selectInput}
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="PROCESSING">Procesando</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregado</option>
              <option value="CANCELLED">Cancelado</option>
              <option value="REFUNDED">Reembolsado</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.filterBtn}>
              Filtrar
            </button>
            {(query || statusFilter) && (
              <Link href="/admin/orders" className={styles.clearBtn}>
                <X size={16} />
                Limpiar
              </Link>
            )}
          </div>
        </form>
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Registros de Compras</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Items</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Método</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.empty}>
                      No se encontraron pedidos
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td data-label="ID" className={styles.txId}>{order.id.slice(0, 8)}...</td>
                      <td data-label="Usuario">
                        <div className={styles.userInfo}>
                          <span className={styles.userName}>{order.user?.name || order.user?.username}</span>
                          <span className={styles.userEmail}>{order.user?.email}</span>
                        </div>
                      </td>
                      <td data-label="Items">
                        {order.items.length} item(s)
                      </td>
                      <td data-label="Monto" className={styles.amount}>
                        ${Number(order.totalAmount).toFixed(2)}
                      </td>
                      <td data-label="Estado">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td data-label="Método">
                        {order.paymentMethod}
                      </td>
                      <td data-label="Fecha">{order.createdAt.toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.loading}>Cargando historial de pedidos...</div>
    </div>
  );
}

export default function AdminOrdersPage(props: { searchParams: Promise<{ q?: string; status?: string }> }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <OrdersContent {...props} />
    </Suspense>
  );
}
