// ============================================================
// MODULE:     app/auditor/page
// PURPOSE:    Dashboard principal del auditor
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { FileText, Users, Wallet, Activity } from 'lucide-react';
import Link from 'next/link';
import styles from '../admin/admin.module.css';

export default async function AuditorDashboard() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (role !== Role.AUDITOR && role !== Role.SUPER_ADMIN) {
    redirect('/dashboard');
  }

  const [
    totalTransactions,
    totalUsers,
    totalVolume,
    recentTransactions,
  ] = await Promise.all([
    prisma.walletTransaction.count(),
    prisma.user.count(),
    prisma.walletTransaction.aggregate({
      _sum: { amount: true },
    }),
    prisma.walletTransaction.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        wallet: {
          include: {
            user: { select: { email: true } },
          },
        },
      },
    }),
  ]);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Panel de Auditoría</h1>
          <p className={styles.subtitle}>
            Acceso de solo lectura para revisión de transacciones y reportes
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total Transacciones"
          value={totalTransactions}
          href="/auditor/transactions"
          icon={<Activity size={20} />}
          color="blue"
        />
        <StatCard
          title="Total Usuarios"
          value={totalUsers}
          href="/admin/users"
          icon={<Users size={20} />}
          color="green"
        />
        <StatCard
          title="Volumen Total"
          value={`$${Number(totalVolume._sum.amount || 0).toLocaleString()}`}
          icon={<Wallet size={20} />}
          color="purple"
        />
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>
            <FileText size={18} />
            Transacciones Recientes
          </h2>
          <Link href="/auditor/transactions" className={styles.cardLink}>
            Ver todas
          </Link>
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
                    No hay transacciones
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.createdAt.toLocaleString()}</td>
                    <td>{tx.wallet?.user?.email || 'N/A'}</td>
                    <td>{tx.type}</td>
                    <td className={styles.amount}>
                      ${Number(tx.amount).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={tx.status} size="sm" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
