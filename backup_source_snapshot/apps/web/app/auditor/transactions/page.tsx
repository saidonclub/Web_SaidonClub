// ============================================================
// MODULE:     app/auditor/transactions/page
// PURPOSE:    Todas las transacciones (solo lectura)
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { StatusBadge } from '@/components/admin/StatusBadge';
import styles from '../../admin/admin.module.css';

export default async function AuditorTransactionsPage() {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (role !== Role.AUDITOR && role !== Role.SUPER_ADMIN) {
    redirect('/dashboard');
  }

  const transactions = await prisma.walletTransaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      wallet: {
        include: {
          user: { select: { email: true, name: true } },
        },
      },
    },
  });

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Transacciones</h1>
          <p className={styles.subtitle}>
            Vista de solo lectura de todas las transacciones del sistema
          </p>
        </div>
      </header>

      <section className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Tipo</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className={styles.empty}>
                    No hay transacciones
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className={styles.txId}>{tx.id.slice(0, 8)}...</td>
                    <td>{tx.createdAt.toLocaleString()}</td>
                    <td>{tx.wallet?.user?.email || 'N/A'}</td>
                    <td>{tx.type}</td>
                    <td className={styles.amount}>
                      ${Number(tx.amount).toFixed(2)}
                    </td>
                    <td>
                      <StatusBadge status={tx.status} size="sm" />
                    </td>
                    <td>{tx.description || '-'}</td>
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
