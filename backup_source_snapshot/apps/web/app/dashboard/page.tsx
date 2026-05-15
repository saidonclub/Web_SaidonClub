/**
 * [AI_CONTEXT]
 * Dashboard Main Entry Point.
 * Orchestrates role-based layouts and session validation.
 * Estética: Obsidian & Safety Orange.
 */
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Panel | SaidonClub",
  description: "Gestiona tu cuenta, wallet, red de referidos y pedidos en SaidonClub.",
  robots: { index: false, follow: false },
};

import {
  Wallet,
  Users,
  TrendingUp,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  ShoppingBag,
  Activity,
  BarChart3,
  Database,
  CheckCircle2,
  Star,
  Zap,
  User,
} from "lucide-react";
import styles from "./Dashboard.module.css";
import { getDashboardData } from "@/lib/data/dashboard";
import CopyButton from "./network/CopyButton";
import KPIGrid from "./kpis/KPIGrid";
import TerminalWrapper from "@/components/terminal/TerminalWrapper";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user: realUser },
  } = await supabase.auth.getUser();

  if (!realUser) {
    redirect("/auth/login");
  }

  const data = await getDashboardData(realUser.id);
  const role = data.user.role;
  const referralLink = `${process.env.NEXT_PUBLIC_APP_URL || "https://saidonclub.com"}/register?ref=${data.user.affiliateCode}`;

  const stats = [
    {
      label: "Tesorería Total",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.wallet.totalEarned),
      icon: <Wallet size={24} />,
      color: "var(--clr-orange)",
    },
    {
      label: "Red Total",
      value: data.network.totalCount.toString(),
      icon: <Users size={24} />,
      color: "var(--clr-success)",
    },
    {
      label: "Rendimiento Mes",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.stats.monthlyPerformance),
      icon: <TrendingUp size={24} />,
      color: "var(--clr-info)",
    },
    {
      label: "Puntos de Estatus",
      value: `${data.stats.statusPoints.toLocaleString()} pts`,
      icon: <TrendingUp size={24} />,
      color: "var(--clr-info)",
    },
    {
      label: "SaidonPoints",
      value: `${data.stats.redeemablePoints.toLocaleString()} pts`,
      icon: <Gift size={24} />,
      color: "var(--clr-warn)",
    },
  ];

  return (
    <div className={`${styles.container} ${styles[`theme${role}`] || ''}`}>
      <div className={styles.cyberGrid} />
      <div className={styles.inner}>
        <header className={styles.header}>
          <div>
            <div className={styles.roleTag}>
              <Zap size={14} />
              <span>{role} ACCOUNT</span>
            </div>
            <h1 className={styles.title}>Centro de Comando</h1>
            <p className={styles.subtitle}>
              Estatus de Sistema:{" "}
              <span className={styles.statusOnline}>Operacional</span> —{" "}
              {realUser.email}
            </p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.badge2fa}>
              <Shield size={20} color="var(--clr-orange)" />
              <span className={styles.badgeText}>
                Verificado {data.rank.name}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Alerts based on Role */}
        {role === "SUPER_ADMIN" && (
          <div className={styles.adminAlert}>
            <Activity size={20} />
            <span>
              Panel de Control Global Activo. Tienes acceso total a la
              infraestructura.
            </span>
          </div>
        )}

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon} style={{ color: stat.color }}>
                  {stat.icon}
                </div>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
              <h2 className={styles.statValue}>{stat.value}</h2>
            </div>
          ))}
        </div>

        {/* KPI Dashboard - Only for Admins */}
        {(role === "SUPER_ADMIN" ||
          role === "ADMIN" ||
          role === "ACCOUNTANT" ||
          role === "AUDITOR") && (
          <section className={styles.systemMetricsSection}>
            <h3 className={styles.systemMetricsTitle}>
              Métricas del Sistema
            </h3>
            <KPIGrid />
          </section>
        )}

        {/* Terminal de Reportes en Tiempo Real */}
        <section className={styles.terminalSection}>
          <TerminalWrapper />
        </section>

        <div className={styles.mainGrid}>
          {/* Section 1: Role-Specific Primary Widget */}
          {role === "SUPER_ADMIN" && (
            <div className={`${styles.card} ${styles.fullWidth}`}>
              <div className={styles.cardHeader}>
                <Database size={20} color="var(--clr-orange)" />
                <h3 className={styles.cardTitle}>Infraestructura & Usuarios</h3>
              </div>
              <div className={styles.adminGrid}>
                <div className={styles.adminItem}>
                  <span>Base de Datos</span>
                  <div className={styles.statusPill}>Sincronizada</div>
                </div>
                <div className={styles.adminItem}>
                  <span>Seguridad MLM</span>
                  <div className={styles.statusPill}>Encriptación Nivel 8</div>
                </div>
                <div className={styles.adminItem}>
                  <span>Servidores Web</span>
                  <div className={styles.statusPill}>99.9% Uptime</div>
                </div>
                <div className={styles.adminActions}>
                  <Link href="/admin/users" className={styles.adminLink}>
                    Gestionar Directorio de Usuarios
                  </Link>
                  <Link
                    href="/dashboard/ticker"
                    className={styles.adminLinkTicker}
                  >
                    Gestionar Anuncios Ticker
                  </Link>
                </div>
              </div>
            </div>
          )}

          {role === "ACCOUNTANT" && (
            <div className={`${styles.card} ${styles.fullWidth}`}>
              <div className={styles.cardHeader}>
                <BarChart3 size={20} color="var(--clr-info)" />
                <h3 className={styles.cardTitle}>Conciliación Financiera</h3>
              </div>
              <div className={styles.accountantGrid}>
                <div className={styles.metric}>
                  <label>Comisiones Pendientes</label>
                  <span>$1,450.00</span>
                </div>
                <div className={styles.metric}>
                  <label>Cierre de Ciclo</label>
                  <span>En 5 días</span>
                </div>
                <Link
                  href="/dashboard/commissions"
                  className={styles.btnPrimary}
                >
                  Validar Transacciones
                </Link>
              </div>
            </div>
          )}

          {(role === "PROVIDER_PRODUCTS" || role === "PROVIDER_SERVICES") && (
            <div className={`${styles.card} ${styles.fullWidth}`}>
              <div className={styles.cardHeader}>
                <ShoppingBag size={20} color="var(--clr-orange)" />
                <h3 className={styles.cardTitle}>Panel de Proveedor</h3>
              </div>
              <div className={styles.providerGrid}>
                <div className={styles.metric}>
                  <label>Ventas Pendientes</label>
                  <span>{data.stats.pendingSales || 0}</span>
                </div>
                <div className={styles.metric}>
                  <label>Ingresos del Mes</label>
                  <span>
                    ${(data.stats.providerMonthlyEarnings || 0).toFixed(2)}
                  </span>
                </div>
                <div className={styles.buttonGroup}>
                  <Link href="/dashboard/ventas" className={styles.btnPrimary}>
                    Ver Mis Ventas
                  </Link>
                  <Link
                    href="/dashboard/productos"
                    className={styles.btnSecondary}
                  >
                    Gestionar Catálogo
                  </Link>
                </div>
              </div>
            </div>
          )}

          {(role === "PREFERENTE" || role === "PIONERO") && (
            <div className={`${styles.card} ${styles.membershipCard}`}>
              <div className={styles.cardHeader}>
                <Star size={20} color="var(--clr-warn)" />
                <h3 className={styles.cardTitle}>Estatus {role}</h3>
              </div>
              <div className={styles.membershipBody}>
                <p>
                  Tu membresía te otorga un multiplicador de x1.5 en puntos de
                  fidelidad.
                </p>
                <div className={styles.perksList}>
                  <div className={styles.perk}>
                    <CheckCircle2 size={16} color="var(--clr-success)" />
                    <span>Envíos prioritarios</span>
                  </div>
                  <div className={styles.perk}>
                    <CheckCircle2 size={16} color="var(--clr-success)" />
                    <span>Soporte 24/7</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MLM Section (Violeta) */}
          <div className={`${styles.card} ${styles.mlmCard}`}>
            <div className={styles.cardHeader}>
              <Users size={20} color="var(--clr-mlm)" />
              <h3 className={styles.mlmCardTitle}>
                Mi Red de Socios
              </h3>
              <Link href="/dashboard/network" className={styles.viewAll}>
                Ver red completa
              </Link>
            </div>

            <div className={styles.referralSection}>
              <div className={styles.referralTitle}>Enlace de Invitación</div>
              <div className={styles.referralInputGroup}>
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className={styles.referralInput}
                />
                <CopyButton text={referralLink} />
              </div>
            </div>

            <div className={styles.networkStats}>
              <div className={styles.networkItem}>
                <span className={styles.netLabel}>Directos (L1)</span>
                <span className={styles.netValue}>
                  {data.network.directCount}
                </span>
              </div>
              <div className={styles.networkItem}>
                <span className={styles.netLabel}>Red Total</span>
                <span className={styles.netValue}>
                  {data.network.totalCount}
                </span>
              </div>
              <div className={styles.networkItem}>
                <span className={styles.netLabel}>Rango</span>
                <span className={styles.netRank}>{data.rank.name}</span>
              </div>
            </div>
            <div className={styles.rankProgress}>
              <div className={styles.rankInfo}>
                <span>Progreso a {data.rank.nextRank || "Máximo"}</span>
                <span>{data.rank.progress.toFixed(1)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${data.rank.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Common Widgets: Wallet, Network, History */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Tesorería & Fondos</h3>
            <div className={styles.walletContent}>
              <div className={styles.walletBalance}>
                <span className={styles.balanceLabel}>
                  Disponible para retirar
                </span>
                <span className={styles.balanceValue}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(data.wallet.available)}
                </span>
              </div>
              <div className={styles.buttonGroup}>
                <Link href="/dashboard/transfer" className={styles.btnPrimary}>
                  <ArrowUpRight size={18} />
                  Transferir
                </Link>
                <Link
                  href="/dashboard/withdraw"
                  className={styles.btnSecondary}
                >
                  <ArrowDownLeft size={18} />
                  Retirar
                </Link>
                <Link
                  href="/dashboard/exchange-points"
                  className={styles.btnPoints}
                >
                  <Gift size={18} />
                  Canjear
                </Link>
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className={styles.card}>
            <div className={styles.activityHeader}>
              <Clock size={20} color="var(--clr-text-dim)" />
              <h3 className={styles.activityTitle}>Historial Reciente</h3>
            </div>
            <div className={styles.activityList}>
              {data.wallet.transactions.length > 0 ? (
                data.wallet.transactions.map((item) => (
                  <div key={item.id} className={styles.activityItem}>
                    <div className={styles.activityInfo}>
                      <span className={styles.activityType}>{item.type}</span>
                      <h4>{item.description || "Transacción"}</h4>
                      <p className={styles.activityDate}>
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p
                      className={`${styles.activityAmount} ${item.amount >= 0 ? styles.pos : styles.neg}`}
                    >
                      {item.amount >= 0 ? "+" : ""}${item.amount.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className={styles.noData}>Sin actividad reciente.</p>
              )}
            </div>
          </div>

          {/* Sales Scripts Quick Access */}
          <div className={styles.card}>
            <div className={styles.activityHeader}>
              <h3 className={styles.activityTitle}>Scripts de Ventas</h3>
              <Link href="/dashboard/scripts" className={styles.viewAll}>
                Ver todos
              </Link>
            </div>
            <p className={styles.scriptsDescription}>
              Guiones probados para WhatsApp, Instagram y más. Cópialos y cierra más ventas.
            </p>
            <div className={styles.buttonGroup}>
              <Link href="/dashboard/scripts" className={styles.btnPrimary}>
                Abrir Scripts
              </Link>
              <Link href="/dashboard/scripts?category=presentacion" className={styles.btnSecondary}>
                Presentación
              </Link>
            </div>
          </div>

          {/* Orders Card */}
          <div className={styles.card}>
            <div className={styles.activityHeader}>
              <ShoppingBag size={20} color="#3b82f6" />
              <h3 className={styles.activityTitle}>Últimos Pedidos</h3>
            </div>
            <div className={styles.activityList}>
              {data.orders.recent.length > 0 ? (
                data.orders.recent.map((order) => (
                  <div key={order.id} className={styles.activityItem}>
                    <div className={styles.activityInfo}>
                      <span className={styles.orderStatus}>{order.status}</span>
                      <h4>Pedido #{order.id.slice(0, 8)}</h4>
                    </div>
                    <p className={styles.activityAmount}>
                      ${order.total.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className={styles.noData}>No hay pedidos.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <nav className={styles.quickActionsBar}>
        <Link href="/dashboard" className={styles.quickActionBtn} title="Inicio">
          <Activity size={22} />
        </Link>
        <Link href="/tienda" className={styles.quickActionBtn} title="Mercado">
          <ShoppingBag size={22} />
        </Link>
        <Link href="/dashboard/network" className={styles.quickActionBtn} title="Mi Red">
          <Users size={22} />
        </Link>
        <Link href="/dashboard/profile" className={styles.quickActionBtn} title="Mi Perfil">
          <User size={22} />
        </Link>
        <Link href="/dashboard/settings" className={styles.quickActionBtn} title="Ajustes">
          <Database size={22} />
        </Link>
      </nav>
    </div>
  );
}
