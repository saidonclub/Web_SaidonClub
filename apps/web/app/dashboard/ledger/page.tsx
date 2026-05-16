import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Calendar,
  DollarSign,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { ExportButton } from "@/components/shared/ExportButton";
import styles from "./Ledger.module.css";

export default async function LedgerPage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { role: true }
  });

  if (user?.role !== "SUPER_ADMIN" && user?.role !== "ACCOUNTANT") {
    redirect("/dashboard");
  }

  // Fetch real data for KPIs
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    revenue7dAgg,
    commissionsPaidAgg,
    totalWalletBalanceAgg
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: { in: ['COMPLETED', 'DELIVERED', 'SHIPPED'] },
        createdAt: { gte: sevenDaysAgo }
      },
      _sum: { totalAmount: true }
    }),
    prisma.commission.aggregate({
      where: { status: { in: ['PAID', 'VALIDATED'] } },
      _sum: { amount: true }
    }),
    prisma.wallet.aggregate({
      _sum: { balanceAvailable: true }
    })
  ]);

  const revenue7d = revenue7dAgg._sum.totalAmount?.toNumber() || 0;
  const commissionsPaid = commissionsPaidAgg._sum.amount?.toNumber() || 0;
  const treasuryReserve = totalWalletBalanceAgg._sum.balanceAvailable?.toNumber() || 0;

  // Fetch transactions
  const transactions = await prisma.walletTransaction.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { wallet: { include: { user: true } } }
  });

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/dashboard" className={styles.backBtn}>
              <ArrowLeft size={18} /> Volver
            </Link>
            <h1 className={styles.title}>Libro Mayor & Finanzas</h1>
            <p className={styles.subtitle}>Control centralizado de flujos de caja y comisiones MLM.</p>
          </div>
          <div className={styles.headerActions}>
            <ExportButton 
              data={transactions} 
              filename="Historial_Financiero_SaidonClub" 
              sheetName="Transacciones"
              label="Exportar Excel"
            />
            <button className={styles.actionBtnPrimary}>
              <Calendar size={18} /> Cierre de Mes
            </button>
          </div>
        </header>
 
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ color: "var(--clr-success)" }}>
              <TrendingUp size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <label>Ingresos Brutos (7d)</label>
              <h3>{formatter.format(revenue7d)}</h3>
              <span className={styles.trendUp}>Actualizado en tiempo real</span>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ color: "var(--clr-warn)" }}>
              <TrendingDown size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <label>Comisiones Liquidadas</label>
              <h3>{formatter.format(commissionsPaid)}</h3>
              <span className={styles.trendNeutral}>Histórico total</span>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ color: "var(--clr-info)" }}>
              <DollarSign size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <label>Reserva de Tesorería</label>
              <h3>{formatter.format(treasuryReserve)}</h3>
              <span className={styles.trendNeutral}>Fondos disponibles en wallets</span>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <h3>Últimas Transacciones Globales</h3>
              <div className={styles.tableFilters}>
                <div className={styles.searchBox}>
                  <Filter size={16} />
                  <input type="text" placeholder="Filtrar por usuario o ID..." />
                </div>
              </div>
            </div>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>ID Usuario</th>
                    <th>Tipo</th>
                    <th>Descripción</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const amount = Number(tx.amount);
                    return (
                      <tr key={tx.id}>
                        <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td>{tx.wallet.user.username || tx.wallet.user.email}</td>
                        <td>
                          <span className={`${styles.typeTag} ${styles[tx.type.toLowerCase()] || ''}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td>{tx.description || "Sin descripción"}</td>
                        <td className={amount >= 0 ? styles.pos : styles.neg}>
                          {amount >= 0 ? "+" : ""}{formatter.format(Math.abs(amount))}
                        </td>
                        <td>
                          <span className={tx.status === 'PAID' || tx.status === 'VALIDATED' ? styles.statusOk : styles.statusPending}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
