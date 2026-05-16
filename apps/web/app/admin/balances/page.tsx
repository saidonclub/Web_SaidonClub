// ============================================================
// MODULE:     app/admin/balances/page
// PURPOSE:    Gestión de saldos, transacciones y pagos
// ============================================================

import { prisma } from '@saidonclub/database';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth/core';
import { Role } from '@saidonclub/rbac';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, AlertTriangle, Search, Filter, X, Download } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './balances.module.css';
import { Prisma, TransactionStatus, TransactionType } from '@saidonclub/database';
import { ExportButton } from '@/components/shared/ExportButton';

export const dynamic = "force-dynamic";

async function BalancesContent({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; view?: string }> }) {
  const user = await getUser();
  if (!user) redirect('/auth/login');

  const role = user.role as Role;
  if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'ACCOUNTANT') {
    redirect('/dashboard');
  }

  const params = await searchParams;
  const query = params.q || '';
  const typeFilter = params.type || '';
  const view = params.view || 'wallets'; // wallets or transactions

  // Fetch Stats
  const [walletsStats, transactionsStats] = await Promise.all([
    prisma.wallet.aggregate({
      _sum: {
        balanceAvailable: true,
        balancePending: true,
        balanceDebt: true,
      }
    }),
    Promise.all([
      prisma.walletTransaction.count({ where: { status: 'PENDING', type: 'WITHDRAWAL' } }),
      prisma.walletTransaction.count({ where: { status: 'CANCELLED', type: 'WITHDRAWAL' } }),
    ])
  ]);

  const [pendingWithdrawals, rejectedWithdrawals] = transactionsStats;

  // Data for the selected view
  let data: any[] = [];
  if (view === 'wallets') {
    const where: Prisma.WalletWhereInput = query ? {
      user: {
        OR: [
          { email: { contains: query, mode: 'insensitive' } },
          { name: { contains: query, mode: 'insensitive' } },
          { username: { contains: query, mode: 'insensitive' } },
        ]
      }
    } : {};

    data = await prisma.wallet.findMany({
      where,
      include: {
        user: { select: { email: true, name: true, username: true } }
      },
      orderBy: { balanceAvailable: 'desc' },
      take: 100
    });
  } else {
    const where: Prisma.WalletTransactionWhereInput = {};
    if (typeFilter) where.type = typeFilter as TransactionType;
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
              ]
            }
          }
        }
      ];
    }

    data = await prisma.walletTransaction.findMany({
      where,
      include: {
        wallet: {
          include: {
            user: { select: { email: true, name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 100
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <div>
            <h1 className={styles.title}>Saldos y Transacciones</h1>
            <p className={styles.subtitle}>
              Visión global de capital, movimientos y estado de pagos
            </p>
          </div>
          <div className={styles.headerActions}>
            <ExportButton 
              data={data.map(item => {
                if (view === 'wallets') {
                  return {
                    Usuario: item.user.name || item.user.username,
                    Email: item.user.email,
                    Disponible: Number(item.balanceAvailable),
                    Pendiente: Number(item.balancePending),
                    Deuda: Number(item.balanceDebt),
                    Total_Ganado: Number(item.totalEarned)
                  };
                } else {
                  return {
                    ID: item.id,
                    Usuario: item.wallet.user.name || item.wallet.user.email,
                    Tipo: item.type,
                    Monto: Number(item.amount),
                    Estado: item.status,
                    Fecha: item.createdAt.toISOString(),
                    Descripcion: item.description
                  };
                }
              })}
              filename={view === 'wallets' ? "Saldos_Usuarios" : "Transacciones_Sistema"}
              sheetName={view === 'wallets' ? "Saldos" : "Movimientos"}
              label={`Exportar ${view === 'wallets' ? 'Saldos' : 'Movimientos'}`}
            />
          </div>
        </div>
      </header>

      <section className={styles.statsGrid}>
        <StatCard
          title="Capital Disponible"
          value={`$${Number(walletsStats._sum.balanceAvailable || 0).toLocaleString()}`}
          icon={<WalletIcon size={20} />}
          color="green"
        />
        <StatCard
          title="Capital Pendiente"
          value={`$${Number(walletsStats._sum.balancePending || 0).toLocaleString()}`}
          icon={<Clock size={20} />}
          color="yellow"
        />
        <StatCard
          title="Pagos Pendientes"
          value={pendingWithdrawals}
          icon={<AlertTriangle size={20} />}
          color="orange"
          subtitle="Retiros por procesar"
        />
        <StatCard
          title="Pagos Rechazados"
          value={rejectedWithdrawals}
          icon={<XCircle size={20} />}
          color="red"
          subtitle="Retiros cancelados"
        />
      </section>

      <nav className={styles.tabs}>
        <Link 
          href="/admin/balances?view=wallets" 
          className={`${styles.tab} ${view === 'wallets' ? styles.tabActive : ''}`}
        >
          Saldos de Usuarios
        </Link>
        <Link 
          href="/admin/balances?view=transactions" 
          className={`${styles.tab} ${view === 'transactions' ? styles.tabActive : ''}`}
        >
          Historial de Movimientos
        </Link>
      </nav>

      <section className={styles.filterSection}>
        <form className={styles.filterForm}>
          <input type="hidden" name="view" value={view} />
          <div className={styles.searchGroup}>
            <Search className={styles.searchIcon} size={18} />
            <input
              type="text"
              name="q"
              placeholder="Buscar por usuario, email o ID..."
              defaultValue={query}
              className={styles.searchInput}
            />
          </div>

          {view === 'transactions' && (
            <div className={styles.selectGroup}>
              <Filter className={styles.filterIcon} size={18} />
              <select name="type" defaultValue={typeFilter} className={styles.selectInput}>
                <option value="">Todos los tipos</option>
                <option value="ROYALTY">Regalías</option>
                <option value="WITHDRAWAL">Retiros</option>
                <option value="DEPOSIT">Depósitos</option>
                <option value="SEED_BONUS">Bono Semilla</option>
                <option value="RANK_BONUS">Bono Rango</option>
              </select>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.filterBtn}>Filtrar</button>
            {(query || typeFilter) && (
              <Link href={`/admin/balances?view=${view}`} className={styles.clearBtn}>
                <X size={16} /> Limpiar
              </Link>
            )}
          </div>
        </form>
      </section>

      <section className={styles.tableSection}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>{view === 'wallets' ? 'Estado de Carteras' : 'Registro de Movimientos'}</h2>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              {view === 'wallets' ? (
                <>
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Disponible</th>
                      <th>Pendiente</th>
                      <th>Deuda</th>
                      <th>Total Ganado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((wallet) => (
                      <tr key={wallet.id}>
                        <td data-label="Usuario">
                          <div className={styles.userInfo}>
                            <span className={styles.userName}>{wallet.user.name || wallet.user.username}</span>
                            <span className={styles.userEmail}>{wallet.user.email}</span>
                          </div>
                        </td>
                        <td data-label="Disponible" className={`${styles.amount} ${styles.amountPositive}`}>
                          ${Number(wallet.balanceAvailable).toFixed(2)}
                        </td>
                        <td data-label="Pendiente" className={`${styles.amount} ${styles.amountNeutral}`}>
                          ${Number(wallet.balancePending).toFixed(2)}
                        </td>
                        <td data-label="Deuda" className={`${styles.amount} ${styles.amountNegative}`}>
                          ${Number(wallet.balanceDebt).toFixed(2)}
                        </td>
                        <td data-label="Total Ganado">
                          ${Number(wallet.totalEarned).toFixed(2)}
                        </td>
                        <td data-label="Acciones">
                          <Link href={`/admin/balances?view=transactions&q=${wallet.user.email}`} className={styles.detailBtn}>
                            Ver Movimientos
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              ) : (
                <>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Tipo</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((tx) => (
                      <tr key={tx.id}>
                        <td data-label="ID" className={styles.txId}>{tx.id.slice(0, 8)}...</td>
                        <td data-label="Usuario">
                          <div className={styles.userInfo}>
                            <span className={styles.userName}>{tx.wallet.user.name}</span>
                            <span className={styles.userEmail}>{tx.wallet.user.email}</span>
                          </div>
                        </td>
                        <td data-label="Tipo">{tx.type}</td>
                        <td data-label="Monto" className={`${styles.amount} ${tx.amount > 0 ? styles.amountPositive : styles.amountNegative}`}>
                          ${Number(tx.amount).toFixed(2)}
                        </td>
                        <td data-label="Estado">
                          <StatusBadge status={tx.status} size="sm" />
                        </td>
                        <td data-label="Fecha">{tx.createdAt.toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

// Icono faltante
function XCircle({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.loading}>Cargando datos financieros...</div>
    </div>
  );
}

export default function AdminBalancesPage(props: { searchParams: Promise<{ q?: string; type?: string; view?: string }> }) {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <BalancesContent {...props} />
    </Suspense>
  );
}
