// ============================================================
// MODULE:     app/admin/page
// PURPOSE:    Dashboard principal del panel de administración
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Users, Package, Shield, Wallet, TrendingUp, CreditCard } from 'lucide-react';
import Link from 'next/link';
import styles from './admin.module.css';

export default async function AdminDashboard() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.MANAGE_USERS)) {
    redirect('/dashboard');
  }

  // Obtener métricas en paralelo
  const [
    totalUsers,
    pendingUsers,
    pendingProducts,
    pendingServices,
    pendingKyc,
    pendingWithdrawals,
    recentTransactions,
    recentUsers,
    revenue,
    walletsStats,
    deliveredOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'PENDING_APPROVAL' } }),
    prisma.product.count({ where: { status: 'PENDING' } }),
    prisma.service.count({ where: { status: 'PENDING' } }),
    prisma.kYC.count({ where: { status: 'EN_REVISION' } }),
    prisma.walletTransaction.count({
      where: {
        type: 'WITHDRAWAL',
        status: 'PENDING',
      },
    }),
    prisma.walletTransaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: {
          include: {
            user: {
              select: { email: true, name: true },
            },
          },
        },
      },
    }),
    prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.order.aggregate({
      _sum: { totalAmount: true }
    }),
    prisma.wallet.aggregate({
      _sum: {
        balanceAvailable: true,
        balancePending: true,
        balanceDebt: true,
      }
    }),
    prisma.order.count({ where: { status: 'DELIVERED' } }),
  ]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <div>
            <h1 className={styles.title}>Panel de Administración</h1>
            <p className={styles.subtitle}>
              Gestiona usuarios, productos, servicios y el capital del sistema
            </p>
          </div>
          <div className={styles.headerStats}>
            <span className={styles.headerStat}>
              <Users size={16} />
              {totalUsers.toLocaleString()} usuarios registrados
            </span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <section className={styles.statsGrid}>
        <StatCard
          title="Total Usuarios"
          value={totalUsers}
          href="/admin/users"
          icon={<Users size={20} />}
          color="blue"
        />
        <StatCard
          title="Ventas Totales"
          value={`$${Number(revenue._sum.totalAmount || 0).toLocaleString()}`}
          href="/admin/orders"
          icon={<TrendingUp size={20} />}
          color="green"
        />
        <StatCard
          title="Retiros Pendientes"
          value={pendingWithdrawals}
          href="/admin/withdrawals?status=PENDING"
          icon={<Wallet size={20} />}
          color="orange"
          subtitle="Solicitudes por procesar"
        />
        <StatCard
          title="KYC Pendiente"
          value={pendingKyc}
          href="/admin/kyc"
          icon={<Shield size={20} />}
          color="yellow"
        />
      </section>

      <section className={styles.financeSummary}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Resumen Financiero</h2>
          </div>
          <div className={styles.financeGrid}>
            <div className={styles.financeItem}>
              <span className={styles.financeLabel}>Capital Disponible</span>
              <span className={`${styles.financeValue} ${styles.positive}`}>
                ${Number(walletsStats._sum.balanceAvailable || 0).toLocaleString()}
              </span>
            </div>
            <div className={styles.financeItem}>
              <span className={styles.financeLabel}>Capital Pendiente</span>
              <span className={`${styles.financeValue} ${styles.neutral}`}>
                ${Number(walletsStats._sum.balancePending || 0).toLocaleString()}
              </span>
            </div>
            <div className={styles.financeItem}>
              <span className={styles.financeLabel}>Deuda Total</span>
              <span className={`${styles.financeValue} ${styles.negative}`}>
                ${Number(walletsStats._sum.balanceDebt || 0).toLocaleString()}
              </span>
            </div>
            <div className={styles.financeItem}>
              <span className={styles.financeLabel}>Órdenes Entregadas</span>
              <span className={styles.financeValue}>{deliveredOrders}</span>
            </div>
          </div>
          <div className={styles.cardActions}>
            <Link href="/admin/balances" className={styles.actionBtn}>Ver Estados de Cuenta</Link>
            <Link href="/admin/orders" className={styles.actionBtn}>Ver Historial de Ventas</Link>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <div className={styles.mainGrid}>
        {/* Recent Transactions */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <TrendingUp size={18} />
              Transacciones Recientes
            </h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Usuario</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className={styles.empty}>
                      No hay transacciones recientes
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td data-label="Fecha">{tx.createdAt.toLocaleDateString()}</td>
                      <td data-label="Usuario">{tx.wallet?.user?.email || 'N/A'}</td>
                      <td data-label="Tipo">{tx.type}</td>
                      <td data-label="Monto" className={styles.amount}>
                        ${Number(tx.amount).toFixed(2)}
                      </td>
                      <td data-label="Estado">
                        <StatusBadge status={tx.status} size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Users */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Users size={18} />
              Usuarios Recientes
            </h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.empty}>
                      No hay usuarios recientes
                    </td>
                  </tr>
                ) : (
                  recentUsers.map((u) => (
                    <tr key={u.id}>
                      <td data-label="Email">{u.email}</td>
                      <td data-label="Nombre">{u.name || '-'}</td>
                      <td data-label="Rol">
                        <span className={styles.role}>{u.role}</span>
                      </td>
                      <td data-label="Estado">
                        <StatusBadge status={u.status} size="sm" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
