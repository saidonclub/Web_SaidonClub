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
import { Users, Package, Briefcase, Shield, Wallet, TrendingUp } from 'lucide-react';
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
  ]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Administración</h1>
          <p className={styles.subtitle}>
            Gestiona usuarios, productos, servicios y configuraciones del sistema
          </p>
        </div>
        <div className={styles.headerStats}>
          <span className={styles.headerStat}>
            <Users size={16} />
            {totalUsers.toLocaleString()} usuarios
          </span>
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
          title="Usuarios Pendientes"
          value={pendingUsers}
          href="/admin/users?status=PENDING_APPROVAL"
          icon={<Users size={20} />}
          color="orange"
        />
        <StatCard
          title="Productos Pendientes"
          value={pendingProducts}
          href="/admin/products?status=PENDING"
          icon={<Package size={20} />}
          color="purple"
        />
        <StatCard
          title="Servicios Pendientes"
          value={pendingServices}
          href="/admin/services?status=PENDING"
          icon={<Briefcase size={20} />}
          color="cyan"
        />
        <StatCard
          title="KYC Pendiente"
          value={pendingKyc}
          href="/admin/kyc"
          icon={<Shield size={20} />}
          color="yellow"
        />
        <StatCard
          title="Retiros Pendientes"
          value={pendingWithdrawals}
          href="/admin/withdrawals"
          icon={<Wallet size={20} />}
          color="red"
        />
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
            <a href="/admin/transactions" className={styles.cardLink}>
              Ver todas
            </a>
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
            <a href="/admin/users" className={styles.cardLink}>
              Ver todos
            </a>
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
