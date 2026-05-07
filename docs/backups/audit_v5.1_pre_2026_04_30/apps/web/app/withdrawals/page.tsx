// ============================================================
// MODULE:     app/admin/withdrawals/page
// PURPOSE:    Aprobación de retiros
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Wallet, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from './withdrawals.module.css';

export default async function AdminWithdrawalsPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.APPROVE_WITHDRAWALS)) {
    redirect('/dashboard');
  }

  const [transactions, stats] = await Promise.all([
    prisma.walletTransaction.findMany({
      where: { type: 'WITHDRAWAL' },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        wallet: {
          include: {
            user: { select: { email: true, name: true } },
          },
        },
      },
    }),
    Promise.all([
      prisma.walletTransaction.count({ where: { type: 'WITHDRAWAL' } }),
      prisma.walletTransaction.count({ where: { type: 'WITHDRAWAL', status: 'PENDING' } }),
      prisma.walletTransaction.count({ where: { type: 'WITHDRAWAL', status: 'AVAILABLE' } }),
      prisma.walletTransaction.count({ where: { type: 'WITHDRAWAL', status: 'PAID' } }),
    ]),
  ]);

  const [total, pending, approved, paid] = stats;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Retiros</h1>
          <p className={styles.subtitle}>
            Aprueba y procesa solicitudes de retiro de usuarios
          </p>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Total Retiros"
          value={total}
          icon={<Wallet size={20} />}
          color="blue"
        />
        <StatCard
          title="Pendientes"
          value={pending}
          icon={<Clock size={20} />}
          color="yellow"
        />
        <StatCard
          title="Aprobados"
          value={approved}
          icon={<CheckCircle size={20} />}
          color="green"
        />
        <StatCard
          title="Pagados"
          value={paid}
          icon={<CheckCircle size={20} />}
          color="purple"
        />
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Solicitudes de Retiro</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Usuario</th>
                  <th>Monto</th>
                  <th>Descripción</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={styles.empty}>
                      No hay solicitudes de retiro
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className={styles.txId}>{tx.id.slice(0, 8)}...</td>
                      <td>{tx.wallet?.user?.email}</td>
                      <td className={styles.amount}>
                        ${Number(tx.amount).toFixed(2)}
                      </td>
                      <td>{tx.description || '-'}</td>
                      <td>
                        <StatusBadge status={tx.status} size="sm" />
                      </td>
                      <td>{tx.createdAt.toLocaleDateString()}</td>
                      <td>
                        <div className={styles.actions}>
                          <button className={styles.approveBtn}>Aprobar</button>
                          <button className={styles.rejectBtn}>Rechazar</button>
                        </div>
                      </td>
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
