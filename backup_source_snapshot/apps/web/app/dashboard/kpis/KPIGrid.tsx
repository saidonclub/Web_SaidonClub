"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Users,
  ShoppingCart,
  Wallet,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  UserPlus,
  BarChart2,
  Award,
} from "lucide-react";
import styles from "./KPIGrid.module.css";

interface KPIData {
  activationRate7Days: number;
  activeUsers: number;
  totalUsers: number;
  purchasesLast7Days: number;
  avgPurchaseValue: number;
  referralRate: number;
  monthlyRevenue: number;
  pendingCommissions: number;
  activeMemberships: number;
  purchaseRate7Days: number;
  conversionRate: number;
  newUsersLast7Days: number;
  userGrowthRate: number;
  completedOrdersMonth: number;
}

const COLOR_SUCCESS = "#22c55e";
const COLOR_INFO = "#3b82f6";
const COLOR_ORANGE = "#f97316";
const COLOR_GOLD = "#ffd700";
const COLOR_PURPLE = "#a855f7";

function StatusBadge({ value, threshold }: { value: number; threshold: number }) {
  const isGood = value >= threshold;
  return (
    <div className={styles.kpiStatus}>
      {isGood ? (
        <CheckCircle size={14} className={styles.statusSuccess} />
      ) : (
        <AlertCircle size={14} className={styles.statusWarning} />
      )}
      <span style={{ color: isGood ? COLOR_SUCCESS : "#f59e0b" }}>
        {isGood ? "Excelente" : "Por mejorar"}
      </span>
    </div>
  );
}

function MiniBar({ value, color }: { value: number; color: string }) {
  return (
    <div className={styles.miniBarWrap}>
      <div
        className={styles.miniBarFill}
        style={{ width: `${Math.min(value, 100)}%`, background: color }}
      />
    </div>
  );
}

export default function KPIGrid() {
  const [data, setData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/kpis")
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className={styles.kpiSkeleton}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className={styles.skeletonBox} style={{ height: "130px" }} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const kpis = [
    {
      label: "Tasa de Activación",
      value: `${data.activationRate7Days}%`,
      icon: <Target size={20} />,
      color: data.activationRate7Days >= 50 ? COLOR_SUCCESS : COLOR_ORANGE,
      subtitle: `${data.activeUsers} de ${data.totalUsers} usuarios activos`,
      bar: data.activationRate7Days,
      threshold: 50,
    },
    {
      label: "% Compra (7 días)",
      value: `${data.purchaseRate7Days}%`,
      icon: <ShoppingCart size={20} />,
      color: data.purchaseRate7Days >= 10 ? COLOR_SUCCESS : COLOR_ORANGE,
      subtitle: `${data.purchasesLast7Days} compras · Avg $${data.avgPurchaseValue.toFixed(2)}`,
      bar: data.purchaseRate7Days,
      threshold: 10,
    },
    {
      label: "Tasa de Conversión",
      value: `${data.conversionRate}%`,
      icon: <BarChart2 size={20} />,
      color: data.conversionRate >= 60 ? COLOR_SUCCESS : COLOR_ORANGE,
      subtitle: `${data.completedOrdersMonth} órdenes entregadas este mes`,
      bar: data.conversionRate,
      threshold: 60,
    },
    {
      label: "Tasa de Referidos",
      value: `${data.referralRate}%`,
      icon: <Users size={20} />,
      color: data.referralRate >= 40 ? COLOR_SUCCESS : COLOR_INFO,
      subtitle: `Usuarios con patrocinador activo`,
      bar: data.referralRate,
      threshold: 40,
    },
    {
      label: "Crecimiento de Usuarios",
      value: `+${data.newUsersLast7Days}`,
      icon: <UserPlus size={20} />,
      color: COLOR_PURPLE,
      subtitle: `+${data.userGrowthRate}% vs total · ${data.totalUsers} usuarios`,
      bar: Math.min(data.userGrowthRate * 5, 100),
      threshold: 5,
    },
    {
      label: "Ingresos del Mes",
      value: `$${data.monthlyRevenue.toLocaleString()}`,
      icon: <Wallet size={20} />,
      color: COLOR_GOLD,
      subtitle: `$${data.pendingCommissions.toLocaleString()} en comisiones pendientes`,
      bar: null,
      threshold: 0,
    },
    {
      label: "Membresías Activas",
      value: data.activeMemberships.toString(),
      icon: <Award size={20} />,
      color: COLOR_INFO,
      subtitle: `de ${data.totalUsers} usuarios registrados`,
      bar: data.totalUsers > 0 ? Math.round((data.activeMemberships / data.totalUsers) * 100) : 0,
      threshold: 20,
    },
    {
      label: "Rendimiento General",
      value: `${Math.round((data.activationRate7Days + data.conversionRate + data.referralRate) / 3)}%`,
      icon: <TrendingUp size={20} />,
      color: COLOR_SUCCESS,
      subtitle: "Promedio: activación + conversión + referidos",
      bar: Math.round((data.activationRate7Days + data.conversionRate + data.referralRate) / 3),
      threshold: 50,
    },
  ];

  return (
    <div className={styles.kpiGrid}>
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className={styles.kpiCard}
          style={{ "--kpi-color": kpi.color } as React.CSSProperties}
        >
          <div className={styles.kpiHeader}>
            <span className={styles.kpiIcon} style={{ color: kpi.color }}>
              {kpi.icon}
            </span>
            <span className={styles.kpiLabel}>{kpi.label}</span>
          </div>
          <div className={styles.kpiValue} style={{ color: kpi.color }}>
            {kpi.value}
          </div>
          {kpi.subtitle && (
            <div className={styles.kpiSubtitle}>{kpi.subtitle}</div>
          )}
          {kpi.bar !== null && (
            <MiniBar value={kpi.bar} color={kpi.color} />
          )}
          {kpi.threshold > 0 && (
            <StatusBadge value={kpi.bar ?? 0} threshold={kpi.threshold} />
          )}
        </div>
      ))}
    </div>
  );
}
