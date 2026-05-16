// ============================================================
// MODULE:     app/admin/withdrawals/page
// PURPOSE:    Aprobación de retiros
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role, hasPermission, Permission } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Wallet, CheckCircle, Clock, Search, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './withdrawals.module.css';
import { Prisma, TransactionStatus } from '@saidonclub/database';
import { ExportButton } from '@/components/shared/ExportButton';

export const dynamic = "force-dynamic";

async function WithdrawalsContent({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (!hasPermission(role, Permission.APPROVE_WITHDRAWALS)) {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const query = params.q || '';
  const statusFilter = params.status || '';

   // Construir filtros de Prisma
   const where: Prisma.WalletTransactionWhereInput = {
     type: 'WITHDRAWAL',
   };

  if (statusFilter) {
     where.status = statusFilter as TransactionStatus;
  }

  if (query) {
    where.OR = [
      { id: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      {
        wallet: {
          user: {
            OR: [
              { email: { contains: query, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
      },
    ];
  }

  const [transactions, stats] = await Promise.all([
    prisma.walletTransaction.findMany({
      where,
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
        <div className={styles.headerTitle}>
          <div>
            <h1 className={styles.title}>Gestión de Retiros</h1>
            <p className={styles.subtitle}>
              Aprueba y procesa solicitudes de retiro de usuarios
            </p>
          </div>
          {transactions.length > 0 && (
            <ExportButton 
              data={transactions.map(tx => ({
                ID: tx.id,
                Usuario: tx.wallet?.user?.name || 'Usuario',
                Email: tx.wallet?.user?.email,
                Monto: Number(tx.amount),
                Descripcion: tx.description || '',
                Estado: tx.status,
                Fecha: tx.createdAt.toISOString()
              }))} 
              filename="Retiros_SaidonClub" 
              sheetName="Retiros"
              label="Exportar Retiros"
            />
          )}
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
              <option value="AVAILABLE">Aprobado (Disponible)</option>
              <option value="PAID">Pagado</option>
              <option value="REJECTED">Rechazado</option>
            </select>
          </div>

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.filterBtn}>
              Filtrar
            </button>
            {(query || statusFilter) && (
              <Link href="/admin/withdrawals" className={styles.clearBtn}>
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
                    <td colSpan={7}>
                      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>💰</div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: 'var(--clr-text-primary)' }}>
                          {query || statusFilter ? 'Sin resultados con los filtros actuales' : 'No hay solicitudes de retiro'}
                        </h3>
                        <p style={{ color: 'var(--clr-text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
                          {query || statusFilter
                            ? 'Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.'
                            : 'Las solicitudes de retiro de los usuarios aparecerán aquí cuando las realicen.'}
                        </p>
                        {(query || statusFilter) ? (
                          <a href="/admin/withdrawals" style={{ color: 'var(--clr-orange)', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                            Limpiar filtros
                          </a>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td data-label="ID" className={styles.txId}>{tx.id.slice(0, 8)}...</td>
                      <td data-label="Usuario">
                        <div className={styles.userInfo}>
                          <span className={styles.userName}>{tx.wallet?.user?.name || 'Usuario'}</span>
                          <span className={styles.userEmail}>{tx.wallet?.user?.email}</span>
                        </div>
                      </td>
                      <td data-label="Monto" className={styles.amount}>
                        ${Number(tx.amount).toFixed(2)}
                      </td>
                      <td data-label="Descripción">{tx.description || '-'}</td>
                      <td data-label="Estado">
                        <StatusBadge status={tx.status} size="sm" />
                      </td>
                      <td data-label="Fecha">{tx.createdAt.toLocaleDateString()}</td>
                      <td data-label="Acciones">
                        <div className={styles.actions}>
                          {tx.status === 'PENDING' && (
                            <>
                              <button className={styles.approveBtn}>Aprobar</button>
                              <button className={styles.rejectBtn}>Rechazar</button>
                            </>
                          )}
                          {tx.status === 'AVAILABLE' && (
                            <button className={styles.payBtn}>Marcar como Pagado</button>
                          )}
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

function LoadingSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.loading}>Cargando...</div>
    </div>
  );
}

export default function AdminWithdrawalsPage(props: { searchParams: Promise<{ q?: string; status?: string }> }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <WithdrawalsContent {...props} />
    </Suspense>
  );
}

