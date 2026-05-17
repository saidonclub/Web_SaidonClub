/**
 * [AI_CONTEXT]
 * Dashboard Main Entry Point.
 * Orchestrates role-based layouts and session validation.
 * Estética: Obsidian & Safety Orange.
 */import { createClient } from "@/utils/supabase/server";
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
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  ShoppingBag,
  Activity,
  BarChart3,
  Cpu,
  MessageSquare,
  Settings,
  Zap,
  User,
  Scale,
  Percent,
  Lock,
  Globe,
  Briefcase,
} from "lucide-react";
import styles from "./Dashboard.module.css";
import { getDashboardData } from "@/lib/data/dashboard";
import CopyButton from "./network/CopyButton";
import KPIGrid from "./kpis/KPIGrid";
import TerminalWrapper from "@/components/terminal/TerminalWrapper";
import { SmallBox, InfoCard, Timeline, RecentOrdersTable, MiniChart } from "./DashboardWidgets";

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
      link: "/dashboard/ledger",
      trend: { value: "12%", isUp: true }
    },
    {
      label: "Red Total",
      value: data.network.totalCount.toString(),
      icon: <Users size={24} />,
      color: "var(--clr-success)",
      link: "/dashboard/network",
      trend: { value: "5%", isUp: true }
    },
    {
      label: "Ventas Mes",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(data.stats.monthlyPerformance),
      icon: <BarChart3 size={24} />,
      color: "var(--clr-info)",
      link: "/dashboard/kpis",
      trend: { value: "8%", isUp: true }
    },
    {
      label: "SaidonPoints",
      value: `${data.stats.redeemablePoints.toLocaleString()} pts`,
      icon: <Gift size={24} />,
      color: "var(--clr-warn)",
      link: "/dashboard/exchange-points"
    },
  ];

  const transactionTimeline = data.wallet.transactions.slice(0, 5).map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    title: item.type,
    description: `${item.description || "Transacción"} - ${item.amount >= 0 ? "+" : ""}${item.amount.toFixed(2)} USD`,
    type: item.amount >= 0 ? 'success' : 'error'
  }));

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

        {/* Stats Grid - AdminLTE Small Boxes */}
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <SmallBox 
              key={i}
              label={stat.label}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              link={stat.link}
            />
          ))}
        </div>

        {/* KPI Dashboard - Only for Admins */}
        {(role === "SUPER_ADMIN" ||
          role === "ADMIN" ||
          role === "ACCOUNTANT" ||
          role === "AUDITOR") && (
          <section className={styles.systemMetricsSection}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.systemMetricsTitle}>Métricas del Sistema</h3>
              <div className={styles.liveIndicator}>
                <span className={styles.pulse} /> LIVE
              </div>
            </div>
            <KPIGrid />
          </section>
        )}

        <div className={styles.mainGrid}>
          {/* Section 1: Role-Specific Primary Widget */}
          {role === "SUPER_ADMIN" && (
            <div className={styles.fullWidth}>
              <InfoCard title="Núcleo de Administración Maestro" icon={<Cpu size={20} />}>
                <div className={styles.adminDashboardGrid}>
                  <div className={styles.adminMainStats}>
                    <div className={styles.adminStatItem}>
                      <label>Usuarios Totales</label>
                      <div className={styles.statRow}>
                        <span className={styles.statValue}>{data.globalStats?.totalUsers}</span>
                        <MiniChart data={[10, 20, 15, 30, 45, 40, 55]} color="var(--clr-orange)" />
                      </div>
                    </div>
                    <div className={styles.adminStatItem}>
                      <label>Ventas Globales (Netas)</label>
                      <div className={styles.statRow}>
                        <span className={styles.statValue}>${data.globalStats?.totalSales.toFixed(2)}</span>
                        <MiniChart data={[50, 40, 60, 80, 75, 90, 110]} color="var(--clr-success)" />
                      </div>
                    </div>
                    <div className={styles.adminStatItem}>
                      <label>Ordenes Totales</label>
                      <div className={styles.statRow}>
                        <span className={styles.statValue}>{data.globalStats?.totalOrders}</span>
                        <MiniChart data={[5, 10, 8, 15, 20, 18, 25]} color="var(--clr-info)" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.adminActionsGrid}>
                    <div className={styles.adminCategory}>
                      <div className={styles.categoryHeader}>
                        <Percent size={18} />
                        <h4>Precios & Descuentos</h4>
                      </div>
                      <div className={styles.buttonGroup}>
                        <Link href="/admin/prices" className={styles.btnSecondary}>Ajustar Precios</Link>
                        <Link href="/admin/discounts" className={styles.btnSecondary}>Cupones</Link>
                      </div>
                    </div>

                    <div className={styles.adminCategory}>
                      <div className={styles.categoryHeader}>
                        <Lock size={18} />
                        <h4>Seguridad & Roles</h4>
                      </div>
                      <div className={styles.buttonGroup}>
                        <Link href="/admin/users" className={styles.btnSecondary}>Usuarios</Link>
                        <Link href="/admin/roles" className={styles.btnSecondary}>Privilegios</Link>
                      </div>
                    </div>

                    <div className={styles.adminCategory}>
                      <div className={styles.categoryHeader}>
                        <Globe size={18} />
                        <h4>Ecosistema MLM</h4>
                      </div>
                      <div className={styles.buttonGroup}>
                        <Link href="/admin/mlm-config" className={styles.btnSecondary}>Reglas Rango</Link>
                        <Link href="/admin/puntos" className={styles.btnSecondary}>Puntos</Link>
                      </div>
                    </div>

                    <div className={styles.adminCategory}>
                      <div className={styles.categoryHeader}>
                        <Scale size={18} />
                        <h4>Tesorería</h4>
                      </div>
                      <div className={styles.buttonGroup}>
                        <Link href="/dashboard/ledger" className={styles.btnPrimary}>Libro Mayor</Link>
                        <Link href="/dashboard/commissions/audit" className={styles.btnSecondary}>Auditar</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          )}

          {(role === "PROVIDER_PRODUCTS" || role === "PROVIDER_SERVICES" || role === "SUPER_ADMIN") && (
            <InfoCard title="Gestión de Proveedor" icon={<Briefcase size={20} />}>
              <div className={styles.providerContent}>
                <div className={styles.providerEarnings}>
                  <div className={styles.earningsInfo}>
                    <label>Ganancias del Mes</label>
                    <h2 className={styles.earningsValue}>
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(data.stats.providerMonthlyEarnings)}
                    </h2>
                  </div>
                  <div className={styles.earningsChart}>
                    <MiniChart data={[30, 45, 35, 60, 70, 65, 85]} color="var(--clr-success)" />
                  </div>
                </div>
                <div className={styles.providerLinks}>
                  <Link href={role === "PROVIDER_SERVICES" ? "/dashboard/provider/services" : "/dashboard/provider/products"} className={styles.btnPrimary}>
                    Mis {role === "PROVIDER_SERVICES" ? "Servicios" : "Productos"}
                  </Link>
                  <Link href="/dashboard/provider/orders" className={styles.btnSecondary}>
                    Ver Pedidos Recibidos
                  </Link>
                </div>
              </div>
            </InfoCard>
          )}

          {(role === "ACCOUNTANT" || role === "SUPER_ADMIN") && (
            <InfoCard title="Área Contable & Fiscal" icon={<Briefcase size={20} />}>
              <div className={styles.accountantContent}>
                <div className={styles.accountantStats}>
                  <div className={styles.statMini}>
                    <label>Pasivos MLM</label>
                    <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.stats.mlmPassives || 0)}</span>
                  </div>
                  <div className={styles.statMini}>
                    <label>Retenciones</label>
                    <span>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(data.stats.taxRetentions || 0)}</span>
                  </div>
                </div>
                <div className={styles.buttonGroup}>
                  <Link href="/dashboard/accounting/reports" className={styles.btnPrimary}>Generar Reporte</Link>
                  <Link href="/dashboard/accounting/settlements" className={styles.btnSecondary}>Liquidaciones</Link>
                </div>
              </div>
            </InfoCard>
          )}

          {/* MLM Section */}
          <InfoCard title="Mi Red de Socios" icon={<Users size={20} />} footer={<Link href="/dashboard/network" className={styles.viewAll}>Ver red completa</Link>}>
            <div className={styles.referralSection}>
              <div className={styles.referralTitle}>Enlace de Invitación</div>
              <div className={styles.referralInputGroup}>
                <input type="text" readOnly value={referralLink} className={styles.referralInput} />
                <CopyButton text={referralLink} />
              </div>
            </div>

            <div className={styles.networkStats}>
              <div className={styles.networkItem}>
                <span className={styles.netLabel}>Directos (L1)</span>
                <span className={styles.netValue}>{data.network.directCount}</span>
              </div>
              <div className={styles.networkItem}>
                <span className={styles.netLabel}>Red Total</span>
                <span className={styles.netValue}>{data.network.totalCount}</span>
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
                <div className={styles.progressFill} style={{ width: `${data.rank.progress}%` }} />
              </div>
            </div>
          </InfoCard>

          {/* Wallet Widget */}
          <InfoCard title="Tesorería & Fondos" icon={<Wallet size={20} />}>
            <div className={styles.walletContent}>
              <div className={styles.walletBalance}>
                <span className={styles.balanceLabel}>Disponible para retirar</span>
                <span className={styles.balanceValue}>
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(data.wallet.available)}
                </span>
              </div>
              <div className={styles.buttonGroup}>
                <Link href="/dashboard/transfer" className={styles.btnPrimary}>
                  <ArrowUpRight size={18} /> Transferir
                </Link>
                <Link href="/dashboard/withdraw" className={styles.btnSecondary}>
                  <ArrowDownLeft size={18} /> Retirar
                </Link>
              </div>
            </div>
          </InfoCard>

          {/* History Timeline */}
          <InfoCard title="Actividad Reciente" icon={<Clock size={20} />}>
            {transactionTimeline.length > 0 ? (
              <Timeline items={transactionTimeline} />
            ) : (
              <p className={styles.noData}>Sin actividad reciente.</p>
            )}
          </InfoCard>

          {/* Terminal de Reportes */}
          <div className={styles.fullWidth}>
            <TerminalWrapper />
          </div>

          {/* Sales Scripts */}
          <InfoCard title="Scripts de Ventas" icon={<MessageSquare size={20} />}>
            <p className={styles.scriptsDescription}>
              Guiones probados para cerrar más ventas.
            </p>
            <div className={styles.buttonGroup}>
              <Link href="/dashboard/scripts" className={styles.btnPrimary}>Abrir Scripts</Link>
              <Link href="/dashboard/scripts?category=presentacion" className={styles.btnSecondary}>Presentación</Link>
            </div>
          </InfoCard>

          {/* Orders */}
          <InfoCard title="Últimos Pedidos" icon={<ShoppingBag size={20} />} footer={<Link href="/dashboard/orders" className={styles.viewAll}>Ver todos los pedidos</Link>}>
            {data.orders.recent.length > 0 ? (
              <RecentOrdersTable orders={data.orders.recent} />
            ) : (
              <p className={styles.noData}>No hay pedidos.</p>
            )}
          </InfoCard>
        </div>
      </div>

      {/* Quick Actions Bar (Mobile) */}
      <nav className={styles.quickActionsBar}>
        <Link href="/dashboard" className={styles.quickActionBtn} title="Inicio"><Activity size={22} /></Link>
        <Link href="/tienda" className={styles.quickActionBtn} title="Mercado"><ShoppingBag size={22} /></Link>
        <Link href="/dashboard/network" className={styles.quickActionBtn} title="Mi Red"><Users size={22} /></Link>
        <Link href="/dashboard/settings" className={styles.quickActionBtn} title="Perfil"><User size={22} /></Link>
        <Link href="/dashboard/config" className={styles.quickActionBtn} title="Configuración"><Settings size={22} /></Link>
      </nav>
    </div>
  );
}
