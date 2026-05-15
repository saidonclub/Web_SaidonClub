import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter, 
  Calendar,
  DollarSign,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
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

  // Fetch some dummy/initial data for the ledger
  const transactions = await prisma.transaction.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { wallet: { include: { user: true } } }
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
            <button className={styles.actionBtn}>
              <Download size={18} /> Exportar CSV
            </button>
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
              <h3>$45,280.00</h3>
              <span className={styles.trendUp}>+12.5% vs semana anterior</span>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ color: "var(--clr-warn)" }}>
              <TrendingDown size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <label>Comisiones Pagadas</label>
              <h3>$12,450.00</h3>
              <span className={styles.trendDown}>-2.1% vs semana anterior</span>
            </div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiIcon} style={{ color: "var(--clr-info)" }}>
              <DollarSign size={24} />
            </div>
            <div className={styles.kpiInfo}>
              <label>Reserva de Tesorería</label>
              <h3>$128,900.00</h3>
              <span className={styles.trendNeutral}>Estatus: Estable</span>
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
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td>{new Date(tx.createdAt).toLocaleDateString()}</td>
                      <td>{tx.wallet.user.username || tx.wallet.user.email}</td>
                      <td>
                        <span className={`${styles.typeTag} ${styles[tx.type.toLowerCase()] || ''}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td>{tx.description}</td>
                      <td className={tx.amount >= 0 ? styles.pos : styles.neg}>
                        {tx.amount >= 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                      </td>
                      <td>
                        <span className={styles.statusOk}>Completado</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
